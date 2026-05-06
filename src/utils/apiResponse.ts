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
 * 连续剥离多层 `{ data: ... }`（兼容网关/加密外层再包一层业务包）。
 */
export function unwrapApiDataDeep<T = unknown>(res: unknown): T | null {
  let cur: unknown = res;
  for (let i = 0; i < 8; i++) {
    const next = unwrapApiData<unknown>(cur);
    if (next === null || next === undefined) return next as T | null;
    if (next === cur) return next as T;
    cur = next;
  }
  return cur as T;
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
export function unwrapApiPagedResult<T = unknown>(res: unknown): { list: T[]; total?: number, unread?: number, read?: number, system?: number } {
  const inner = unwrapApiData(res);
  if (inner == null) return { list: [], unread: 0, read: 0, system: 0 };
  if (Array.isArray(inner)) return { list: inner as T[], unread: 0, read: 0, system: 0 };
  if (typeof inner !== "object") return { list: [], unread: 0, read: 0, system: 0 };
  const o = inner as Record<string, unknown>;
  const rawList = o.list ?? o.records ?? o.rows ?? o.items;
  const list = (Array.isArray(rawList) ? rawList : []) as T[];
  let total: number | undefined;
  let unread: number | undefined;
  let read: number | undefined;
  let system: number | undefined;
  const pag = o.counts;
  if (pag && typeof pag === "object") {
    const p = pag as Record<string, unknown>;
    if (typeof p.total === "number") total = p.total;
    if (typeof p.unread === "number") unread = p.unread;
    if (typeof p.read === "number") read = p.read;
    if (typeof p.system === "number") system = p.system;
  }
  if (total === undefined && typeof o.total === "number") total = o.total;
  return { list, total,unread, read, system };
}
