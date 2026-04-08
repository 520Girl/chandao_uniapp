/**
 * 统一解析 `request` 拦截器返回的业务包，兼容「整包即数据」与 `{ code, data }` 两种形态。
 */

/**
 * 取出业务数据：优先 `data` 字段，否则将响应对象本身视为数据。
 * @param res 接口 resolve 值
 * @returns 业务体；无法识别时返回 `null`
 */
export function unwrapApiData<T = unknown>(res: unknown): T | null {
  if (res == null || typeof res !== "object") return null;
  const body = res as Record<string, unknown>;
  if ("data" in body && body.data !== undefined) return body.data as T;
  return body as T;
}

/**
 * 解析数组列表：`data` 为数组，或分页/包装对象上的 `list` / `records` / `rows` / `items`。
 * @param res 接口 resolve 值
 */
export function unwrapApiList(res: unknown): unknown[] {
  const inner = unwrapApiData(res);
  if (inner == null) return [];
  if (Array.isArray(inner)) return inner;
  if (typeof inner === "object") {
    const o = inner as Record<string, unknown>;
    const list = o.list ?? o.records ?? o.rows ?? o.items ?? o.data;
    if (Array.isArray(list)) return list;
  }
  return [];
}

/**
 * 解析分页结果中的列表（`data` 为 `{ list, pagination }` 等）。
 * @param res 接口 resolve 值
 */
export function unwrapApiPageList(res: unknown): unknown[] {
  return unwrapApiList(res);
}

/**
 * 解析分页列表与总数（兼容 `pagination.total` 或根级 `total`）。
 * @param res 接口 resolve 值
 */
export function unwrapApiPagedResult<T = unknown>(res: unknown): { list: T[]; total?: number } {
  const inner = unwrapApiData(res);
  if (inner == null) return { list: [] };
  if (Array.isArray(inner)) return { list: inner as T[] };
  if (typeof inner !== "object") return { list: [] };
  const o = inner as Record<string, unknown>;
  const rawList = o.list ?? o.records ?? o.rows ?? o.items;
  const list = (Array.isArray(rawList) ? rawList : []) as T[];
  let total: number | undefined;
  const pag = o.pagination;
  if (pag && typeof pag === "object") {
    const p = pag as Record<string, unknown>;
    if (typeof p.total === "number") total = p.total;
  }
  if (total === undefined && typeof o.total === "number") total = o.total;
  return { list, total };
}
