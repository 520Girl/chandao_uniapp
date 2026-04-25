
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
    /** 绑定列表内排序，越小越靠前 */
    sortOrder?: number;
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

/** POST `/app/device/sort` Body：须为当前用户已绑定 SN 的一个全排列 */
export interface DeviceSortBody {
  order: string[];
}

/**
 * GET `/app/device/status` 的 `data`；会同步云端状态到 `device_info`。
 * @see 接口 `status` 为本地状态码，与 `interface.id` 含义同列表/详情
 */
export interface DeviceStatusAppData {
  sn: string;
  mac: string;
  model: string;
  /** 与 device_info 状态码一致，已同步云端 */
  status: number;
  /** 状态同步时间 */
  statusUpdateTime?: string;
  /** 云端 status 对象（name/since/model 等） */
  interface?: {
    id?: string;
    name?: string;
    since?: string;
    model?: string;
  } & Record<string, unknown>;
}

/** POST `/app/device/realtime` 内层 `data` 数组的一条记录（字段以云端为准） */
export interface DeviceRealtimeDataPoint {
  date?: string;
  id?: number;
  temperature?: number;
  humidity?: number;
  inbed?: boolean;
  body_movement?: boolean;
  left?: { respiration_rate?: number; heart_rate?: number };
  right?: { respiration_rate?: number; heart_rate?: number };
  [k: string]: unknown;
}

/**
 * POST `/app/device/realtime` 的 `data` 包装（SOAP 回包 + `data` 为测点列表）。
 */
export interface DeviceRealtimePayload {
  ret?: number;
  err_code?: number;
  msg?: string;
  timestamp?: number;
  mac?: string;
  data?: DeviceRealtimeDataPoint[];
  [k: string]: unknown;
}