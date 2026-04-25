/**
 * 已绑定设备列表与在线状态（首页禅修「有设备」校验、设备管理页共用）。
 * 不持久化列表，登录态下每次进入首页等会 `refreshList` 拉取最新。
 */
import { defineStore } from "pinia";
import { fetchDeviceList, fetchDeviceDetails, postDeviceSort } from "@/assets/js/api/device";
import type { DeviceItem } from "@/types/pages/device";
import {
  extractDeviceDetailPayload,
  extractDeviceListPayload,
  mapApiRowToDeviceItem,
  patchDeviceItemFromDetail,
} from "@/utils/deviceMap";

/** 与设备管理页一致：最多绑定台数，列表单次拉取 size */
export const DEVICE_BIND_SLOT_MAX = 3;

export interface DeviceStoreState {
  devices: DeviceItem[];
  listLoading: boolean;
}

export const useDeviceStore = defineStore("device", {
  state: (): DeviceStoreState => ({
    devices: [],
    listLoading: false,
  }),

  getters: {
    /** 是否至少绑定了一台设备 */
    hasBoundDevices: (s): boolean => s.devices.length > 0,

    /**
     * 是否具备「设备禅修」条件：至少一台状态为使用中（interface.id/status === 1）。
     * 仅此时首页「有设备」进入才会拉实时心率等接口。
     */
    hasMeditationReadyDevice: (s): boolean => s.devices.some((d) => d.statusCode === 1),

    /** 首页弹窗说明文案 */
    meditationDeviceHint(): string {
      if (this.hasMeditationReadyDevice) {
        return "是否已连接心率/体动等设备？\n选择「有设备」将使用已绑定且处于「使用中」状态的设备进行数据采集。";
      }
      if (this.hasBoundDevices) {
        return "已绑定设备，但当前没有处于「使用中」状态的设备，无法采集实时数据。\n可选择「无设备禅修」，或前往设备管理检查设备连接。";
      }
      return "尚未绑定设备。\n可选择「无设备禅修」，或前往「我的」绑定设备后再使用设备禅修。";
    },
  },

  actions: {
    /** 清空列表（登出时调用） */
    clearDevices() {
      this.devices = [];
      this.listLoading = false;
    },

    /**
     * 拉取已绑定设备列表并写入 `devices`。
     * @param size 每页条数，默认与绑定上限一致
     */
    /**
     * @param silent 为 true 时不切换 `listLoading`（不隐藏列表），适合排序成功后紧跟一次同步，避免 `up-dragsort` 整段卸挂抖动。
     */
    async refreshList(
      size: number = DEVICE_BIND_SLOT_MAX,
      options?: { silent?: boolean },
    ) {
      const silent = options?.silent === true;
      if (!silent) {
        this.listLoading = true;
      }
      try {
        const res = await fetchDeviceList({ page: 1, size });
        const rows = extractDeviceListPayload(res);
        const list = rows.map(mapApiRowToDeviceItem);
        list.sort(
          (a, b) =>
            (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id,
        );
        this.devices = list;
      } catch (e) {
        console.error("fetchDeviceList", e);
      } finally {
        if (!silent) {
          this.listLoading = false;
        }
      }
    },

    /**
     * 本地合并编辑弹窗保存的昵称/备注（无单独更新接口时）。
     */
    patchLocalDevice(deviceId: number, partial: Pick<DeviceItem, "name" | "remark">) {
      const idx = this.devices.findIndex((d) => d.id === deviceId);
      if (idx < 0) return;
      this.devices[idx] = { ...this.devices[idx], ...partial };
    },

    /**
     * 根据详情接口返回更新列表中对应项的状态（含 `interface`）。
     * @param deviceId 设备主键 id
     * @param res 详情接口原始响应
     */
    mergeDeviceFromDetailResponse(deviceId: number, res: unknown) {
      const d = extractDeviceDetailPayload(res);
      if (!d) return;
      const idx = this.devices.findIndex((dev) => dev.id === deviceId);
      if (idx < 0) return;
      const patch = patchDeviceItemFromDetail(d);
      if (Object.keys(patch).length > 0) {
        this.devices[idx] = { ...this.devices[idx], ...patch };
      }
    },

    /**
     * 按 MAC 拉详情并合并到本地列表（用于进入页面前刷新单台状态）。
     * @param mac 设备 MAC
     */
    async refreshDeviceStatusByMac(mac: string) {
      const m = String(mac ?? "").trim();
      if (!m) return;
      const row = this.devices.find((d) => d.mac === m);
      if (!row) return;
      try {
        const res = await fetchDeviceDetails({ mac: m });
        this.mergeDeviceFromDetailResponse(row.id, res);
      } catch (e) {
        console.error("fetchDeviceDetails", e);
      }
    },

    /**
     * 首页开始禅修等入口：先拉绑定列表，再对**第一台具备 MAC** 的设备请求 `/app/device/info`，
     * 用返回的 `interface` 等与列表项合并，供 `hasMeditationReadyDevice` 判断是否「使用中」。
     */
    /**
     * 全量重排已绑定设备 SN 顺序；`order[0]` 为主设备。成功后再 `refreshList` 同步展示。
     */
    async reorderDevicesBySnOrder(order: string[], size: number = DEVICE_BIND_SLOT_MAX) {
      if (order.length === 0) return;
      await postDeviceSort({ order });
      await this.refreshList(size, { silent: true });
    },

    async refreshListAndSyncFirstDeviceDetail() {
      await this.refreshList(DEVICE_BIND_SLOT_MAX);
      const row = this.devices.find((d) => String(d.mac ?? "").trim() !== "");
      if (!row) return;
      try {
        const res = await fetchDeviceDetails({ mac: String(row.mac).trim() });
        this.mergeDeviceFromDetailResponse(row.id, res);
      } catch (e) {
        console.error("fetchDeviceDetails", e);
      }
    },
  },
});
