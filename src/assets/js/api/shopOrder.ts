// 商城订单
import { get, post } from '../request';
import type { ShopOrderCreateDTO, ShopOrderPageDTO } from '@/types/api/shop';

/**
 * 创建订单（需登录）。
 * @param body `productId`、`addressId` 必填；`remark` 可选
 * @returns 业务 `data` 含 `orderNo`
 */
export const createShopOrder = (body: ShopOrderCreateDTO) => {
  return post('/app/shop/order/create', body);
};

/**
 * 订单分页列表（需登录）。
 * @param body `page` / `size` / `status` / `keyWord` 可选
 */
export const fetchShopOrderPage = (body?: ShopOrderPageDTO) => {
  return post('/app/shop/order/page', body ?? {});
};

/**
 * 订单详情（需登录）。
 * @param params `id` 订单主键
 */
export const fetchShopOrderDetail = (params: { id: number }) => {
  return get('/app/shop/order/detail', params);
};

/**
 * 取消订单（需登录）。
 * @param body `id` 订单主键
 * @returns 业务 `data` 多为 `null`
 */
export const cancelShopOrder = (body: { id: number }) => {
  return post('/app/shop/order/cancel', body);
};
