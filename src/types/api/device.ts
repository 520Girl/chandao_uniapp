
export interface Device extends addDeviceParams {
    id: number
    createTime?: string
    updateTime?: string
    tenantId?: any
    sn: string
    userId: number
    model: string
    bindDate?: any
    statusUpdateTime?: string
    mac: string
    bindTime: string
    status: number; // 0-未激活，1-使用中，2-无人使用
    lastOnline?: string; // ISO日期字符串
}


export interface addDeviceParams {
    sn: string;
    model: string;
    mac: string;
}

type DeviceInterfaceInfo = {
   id: string;
   since: string; // ISO日期字符串
   name: string;
   model: string;
}
export interface DeviceInfo extends Device {
    interface: DeviceInterfaceInfo; // 设备接口信息，具体结构根据后端返回定义
}