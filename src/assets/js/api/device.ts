// 设备管理
import { get, post } from '../request'
import type { addDeviceParams, DeviceSortBody } from '@/types/api/device'



/**
 * 绑定设备
 * @param {Object} params - 参数对象
 * - `sn`: 设备序列号
 * - `model`: 设备型号
 * - `mac`: 设备MAC地址
 */
export const addDevice = (params: addDeviceParams) => {
    return post('/app/device/bind', params)
}


/**
 * 解绑设备
 * @param {Object} params - 参数对象
 * - `sn`: 设备序列号
 */
export const removeDevice = (params: { sn: string }) => {
    return post('/app/device/unbind', params)
}

/**
 * 设备信息
 * @param {Object} params - 参数对象
 * - `mac`: 设备MAC地址
 */
export const fetchDeviceDetails = (params: { mac: string }) => {
    return get('/app/device/info', params)
}


export type FetchDeviceListParams = {
    page?: number;
    size?: number;
    name?: string;
};

/**
 * 设备列表
 * @param params page / size / name（可选）
 */
export const fetchDeviceList = (params?: FetchDeviceListParams) => {
    return get('/app/device/list', params);
};

/**
 * 重排设备顺序（全量 SN 排列，下标 0 为主设备）；需登录。
 *
 * @param body `order` 为当前用户全部已绑定 SN 的一个全排列
 * @returns 与设备列表相同的数据结构
 */
export const postDeviceSort = (body: DeviceSortBody) => {
    return post('/app/device/sort', body);
};

/**
 * 轻量查设备状态（会同步一次云端到本地 `device_info`），适合轮询；需登录。
 * @param params `mac` 为设备 MAC
 */
export const fetchDeviceStatus = (params: { mac: string }) => {
  return get("/app/device/status", params);
};

/**
 * 拉取设备 SOAP 实时数据；会先同步状态再取最新测点。仅允许当前用户已绑定设备；需登录。
 * @param body `mac` 为设备 MAC
 */
export const postDeviceRealtime = (body: { mac: string }) => {
  return post("/app/device/realtime", body);
};

