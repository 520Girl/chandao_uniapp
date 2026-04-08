/**
 * 用户收货地址：`/app/user/address/*`，服务端注入当前 `userId`。
 */

/** POST `/app/user/address/add` */
export interface UserAddressCreate {
  contact: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  /** 街道门牌等详细地址 */
  address: string;
  /** 是否默认 */
  isDefault?: boolean;
}

/** POST `/app/user/address/update`：在创建字段基础上带 `id` */
export interface UserAddressUpdate extends UserAddressCreate {
  id: number;
}

/** GET `/app/user/address/info`、列表项等 */
export interface UserAddress {
  id: number;
  userId: number;
  contact: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault: boolean;
  createTime: string;
  updateTime: string;
}

/** POST `/app/user/address/delete` */
export interface UserAddressDeleteDTO {
  ids: number[];
}

/** GET `/app/user/address/default` 的 `data` */
export interface UserDefaultAddressData {
  address: UserAddress | null;
}

/** POST `/app/user/address/page` 请求体 */
export interface UserAddressPageDTO {
  page?: number;
  size?: number;
}
