/**
 * 用户收货地址：`/app/user/address/*`（服务端注入当前 `userId`）。
 */
import { get, post } from "../request";
import type {
  UserAddressCreate,
  UserAddressDeleteDTO,
  UserAddressPageDTO,
  UserAddressUpdate,
} from "@/types/api/userAddress";

/**
 * 新增地址（需登录）。
 * @param body 收货人、手机、省市区、详细地址、`isDefault` 可选
 * @returns `data` 结构以后端为准（常含新建 `id`）
 */
export const addUserAddress = (body: UserAddressCreate) => {
  return post('/app/user/address/add', body);
};

/**
 * 删除地址（需登录）。
 * @param body `ids` 待删除主键数组
 */
export const deleteUserAddress = (body: UserAddressDeleteDTO) => {
  return post('/app/user/address/delete', body);
};

/**
 * 更新地址（需登录）。
 * @param body 含 `id` 及与新增相同的可编辑字段
 */
export const updateUserAddress = (body: UserAddressUpdate) => {
  return post('/app/user/address/update', body);
};

/**
 * 地址详情（需登录）。
 * @param params `id` 地址主键
 */
export const fetchUserAddressInfo = (params: { id: number }) => {
  return get('/app/user/address/info', params);
};

/**
 * 当前用户地址列表（需登录）。
 * @param body 查询条件可选；服务端强制按 `userId` 过滤
 */
export const fetchUserAddressList = (body: Record<string, unknown> = {}) => {
  return post('/app/user/address/list', body);
};

/**
 * 地址分页（需登录）。
 *
 * @param body `page` / `size` 等；可带其它条件，后端仍强制 userId
 * @returns 业务 `data` 常为 `{ list, pagination }`，见 `UserAddressPageResult`
 */
export const fetchUserAddressPage = (body?: UserAddressPageDTO) => {
  return post("/app/user/address/page", body ?? {});
};

/**
 * 默认地址（需登录）。
 * @returns 业务 `data` 为 `{ address: UserAddress | null }`
 */
export const fetchUserDefaultAddress = () => {
  return get('/app/user/address/default');
};
