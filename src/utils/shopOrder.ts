/**
 * 商城订单展示用文案（状态码以后端为准，可按实际枚举调整映射）。
 */

/**
 * 订单状态码转展示文案。
 * @param status 后端 `status` 数值
 * @returns 中文状态简述
 */
export function shopOrderStatusText(status: number): string {
  const map: Record<number, string> = {
    0: '未知',
    1: '待支付',
    2: '待发货',
    3: '已发货',
    4: '已完成',
    5: '已取消'
  };
  return map[status] ?? `状态${status}`;
}
