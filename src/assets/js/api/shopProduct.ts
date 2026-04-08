// 商城商品
import { get, post } from '../request';
import type { ShopProductPageDTO } from '@/types/api/shop';

/**
 * 商品分页（需登录）。
 * @param body `page` / `size` / `keyWord` 可选
 * @returns 业务 `data` 多为 `{ list, pagination }`
 */
export const fetchShopProductPage = (body?: ShopProductPageDTO) => {
  return post('/app/shop/product/page', body ?? {});
};

/**
 * 商品详情（需登录）。
 * @param params `id` 商品主键
 */
export const fetchShopProductInfo = (params: { id: number }) => {
  return get('/app/shop/product/info', params);
};
