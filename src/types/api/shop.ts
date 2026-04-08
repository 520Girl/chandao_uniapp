/**
 * 商城：商品分页/详情、订单创建/分页/详情/取消。
 * 金额字段以后端精度为准；时间为 ISO 字符串。
 */

/** POST `/app/shop/product/page` */
export interface ShopProductPageDTO {
  /** 页码，默认 1 */
  page?: number;
  /** 每页条数，默认 20 */
  size?: number;
  /** 搜索关键字 */
  keyWord?: string;
}

/** 商品分页列表行（后端 select 固定字段） */
export interface ShopProductListItem {
  id: number;
  name: string;
  price: number;
  mainImage?: string;
  intro?: string;
  /** 是否佣金商品等，含义以后端为准 */
  isCommission: number;
}

/** 分页 `data`：含 `list` 与可选 `pagination`（Cool 常见结构） */
export interface ShopProductPage {
  list: ShopProductListItem[];
  pagination?: ShopPagePagination;
}

/** GET `/app/shop/product/info` 商品详情 */
export interface ShopProduct extends ShopProductListItem {
  createTime: string;
  updateTime: string;
}

/** 通用分页元信息（字段以后端为准，均可选） */
export interface ShopPagePagination {
  page?: number;
  size?: number;
  total?: number;
}

/** POST `/app/shop/order/create` */
export interface ShopOrderCreateDTO {
  productId: number;
  addressId: number;
  remark?: string;
}

/** 创建订单返回 */
export interface ShopOrderCreateResult {
  orderNo: string;
}

/** POST `/app/shop/order/page` */
export interface ShopOrderPageDTO {
  page?: number;
  size?: number;
  /** 订单状态筛选 */
  status?: number;
  /** 订单号/商品名关键字 */
  keyWord?: string;
}

/** 订单列表行 */
export interface ShopOrderListItem {
  id: number;
  createTime: string;
  status: number;
  orderNo: string;
  price: number;
  productName?: string;
  productImage?: string;
  productPrice?: number;
}

export interface ShopOrderPage {
  list: ShopOrderListItem[];
  pagination?: ShopPagePagination;
}

/** GET `/app/shop/order/detail` */
export interface ShopOrderDetail {
  id: number;
  userId: number;
  productId: number;
  addressId: number;
  status: number;
  orderNo: string;
  price: number;
  remark?: string;
  logisticsNo?: string;
  commissionRecipientId?: number;
  productName?: string;
  productImage?: string;
  productPrice?: number;
  contact?: string;
  phone?: string;
  province?: string;
  city?: string;
  district?: string;
  detailAddress?: string;
  createTime: string;
  updateTime: string;
}
