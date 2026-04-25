/** 设备管理页展示用（由接口数据映射） */
export interface DeviceItem {
    id: number;
    /** 展示名称（接口 name / interface.name / model 等映射） */
    name: string;
    /** 接口原始值：0 未激活，1 使用中，2 无人使用；-1 表示未知 */
    statusCode: number;
    /** 与 statusCode 对应的展示文案 */
    status: string;
    remark: string;
    sn: string;
    model: string;
    mac: string;
    /** 与接口 `sortOrder` 一致，越小越靠前；首条即主设备 */
    sortOrder?: number;
    icon?: string;
    iconColor?: string;
}
