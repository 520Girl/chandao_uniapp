/**
 * 设备列表/详情接口字段映射为页面展示模型（纯函数，供页面与 Pinia 共用）。
 */
import type { DeviceItem } from "@/types/pages/device";

/**
 * 从列表接口原始响应中取出记录数组（兼容多种分页字段名）。
 * @param res `uni.request` / 封装 `get` 的原始返回
 */
export function extractDeviceListPayload(res: unknown): Record<string, unknown>[] {
  if (res == null) return [];
  const body = res as Record<string, unknown>;
  const inner = body.data !== undefined ? body.data : body;
  if (Array.isArray(inner)) return inner as Record<string, unknown>[];
  const d = inner as Record<string, unknown>;
  const list = (d?.list ?? d?.records ?? d?.rows ?? d?.items ?? d?.data ?? []) as unknown[];
  return Array.isArray(list) ? (list as Record<string, unknown>[]) : [];
}

/**
 * 从详情接口原始响应中取出单条对象。
 * @param res 详情接口原始返回
 */
export function extractDeviceDetailPayload(res: unknown): Record<string, unknown> | null {
  if (res == null) return null;
  const body = res as Record<string, unknown>;
  const inner = body.data !== undefined ? body.data : body;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    return inner as Record<string, unknown>;
  }
  return null;
}

/** 接口 status / interface.id：0 未激活，1 使用中，2 无人使用，3 离床，4 离线 */
export function mapApiStatusToLabel(code: number): string {
  if (code === 0) return "未激活";
  if (code === 1) return "使用中";
  if (code === 2) return "无人使用";
  if (code === 3) return "离床";
  if (code === 4) return "离线";
  return "未知";
}

/**
 * 将接口中的状态字段规范为数字码；无法识别时为 -1。
 * @param raw `status` 或 `interface.id` 等
 */
export function normalizeDeviceStatusCode(raw: unknown): number {
  const n = Number(raw);
  if (n === 0 || n === 1 || n === 2 || n === 3 || n === 4) return n;
  return -1;
}

/**
 * 将单条列表/绑定记录映射为设备管理页 `DeviceItem`。
 * @param raw 单条 DTO
 */
export function mapApiRowToDeviceItem(raw: Record<string, unknown>): DeviceItem {
  const iface = raw.interface as Record<string, unknown> | undefined;
  const name = String(raw.name ?? iface?.name ?? raw.model ?? raw.sn ?? "设备");
  let statusCode: number;
  if (iface != null && iface.id != null && String(iface.id) !== "") {
    statusCode = normalizeDeviceStatusCode(iface.id);
  } else {
    statusCode = normalizeDeviceStatusCode(raw.status);
  }
  const status =
    iface != null && iface.name != null && String(iface.name).trim() !== ""
      ? String(iface.name)
      : mapApiStatusToLabel(statusCode);
  return {
    id: Number(raw.id ?? 0),
    sn: String(raw.sn ?? ""),
    model: String(raw.model ?? ""),
    mac: String(raw.mac ?? ""),
    name,
    statusCode,
    status,
    remark: String(raw.remark ?? ""),
    icon: "icon-grid-view",
    iconColor: "theme-color-1",
  };
}

/**
 * 用 `/app/device/info` 详情 DTO 生成对 `DeviceItem` 的补丁（含 interface 优先的状态）。
 * @param detail `extractDeviceDetailPayload` 的结果
 */
export function patchDeviceItemFromDetail(detail: Record<string, unknown>): Partial<DeviceItem> {
  const iface = detail.interface as Record<string, unknown> | undefined;
  const patch: Partial<DeviceItem> = {};

  if (iface != null && iface.id != null && String(iface.id) !== "") {
    const statusCode = normalizeDeviceStatusCode(iface.id);
    patch.statusCode = statusCode;
    patch.status = String(iface.name ?? mapApiStatusToLabel(statusCode));
    if (iface.model != null && String(iface.model) !== "") {
      patch.model = String(iface.model);
    }
  } else if (detail.status != null) {
    const statusCode = normalizeDeviceStatusCode(detail.status);
    patch.statusCode = statusCode;
    patch.status = mapApiStatusToLabel(statusCode);
  }

  return patch;
}
