// 设备管理
import { get , post} from '../request'
import type { Device , addDeviceParams } from '@/types/api/device'



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

