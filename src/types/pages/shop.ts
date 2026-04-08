/**
 * 商城页面临时表单状态（与 `UserAddress` 字段对齐，便于编辑页绑定）。
 */
export type ShopAddressEditorForm = {
  contact: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault: boolean;
};
