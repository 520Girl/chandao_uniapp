/**
 * 跨端定位（uni-app 统一 `uni.getLocation`，微信小程序与 H5 均走同一 API）。
 *
 * - **微信小程序**：`type: 'gcj02'` 由微信支持，可与国内地图、`<map>` 等对齐；需在 `manifest.json` → `mp-weixin`
 *   配置定位权限说明与 `requiredPrivateInfos`（如 `getLocation`）。
 * - **H5**：浏览器原生坐标为 WGS84；指定 `gcj02` 时由 uni-app 结合 manifest 里配置的**高德/腾讯等 Web 地图 Key**
 *   做定位或转换，实际能否稳定得到 GCJ-02 依赖该配置与运行域名（一般需 **HTTPS**、厂商侧域名白名单）。
 *   未配 Key 或仅 IP 定位时，精度/坐标系可能与小程序不一致。
 */

/** 经纬度（WGS84 / GCJ02 由 `type` 决定，与 `uni.getLocation` 一致） */
export interface LatLng {
  /** 纬度 */
  latitude: number;
  /** 经度 */
  longitude: number;
  /** 水平精度（米），部分平台可能无 */
  accuracy?: number;
}

export interface GetCurrentLatLngOptions {
  /**
   * 坐标系；国内地图多用 `gcj02`。
   * @default 'gcj02'
   */
  type?: "wgs84" | "gcj02";
  /** 是否高精度，默认 true */
  isHighAccuracy?: boolean;
  /** 高精度定位超时 ms，默认 4000 */
  highAccuracyExpireTime?: number;
}

/**
 * 获取当前设备经纬度。
 *
 * @param options 坐标系与精度选项
 * @returns `latitude` / `longitude`，可选 `accuracy`
 * @throws 用户拒绝、无权限或平台失败时 Promise reject（`uni.getLocation` 的 fail 对象或 Error）
 *
 * @remarks 默认 `gcj02` 适合国内业务；若需与国际 WGS84 数据源对接可显式传 `type: 'wgs84'`（小程序/H5 语义以官方文档为准）。
 */
export function getCurrentLatLng(options?: GetCurrentLatLngOptions): Promise<LatLng> {
  const type = options?.type ?? "gcj02";
  const isHighAccuracy = options?.isHighAccuracy !== false;
  const highAccuracyExpireTime = options?.highAccuracyExpireTime ?? 4000;

  return new Promise((resolve, reject) => {
    uni.getLocation({
      type,
      isHighAccuracy,
      highAccuracyExpireTime,
      success(res) {
        const latitude = Number(res.latitude);
        const longitude = Number(res.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          reject(new Error("定位返回经纬度无效"));
          return;
        }
        const accuracy =
          typeof res.horizontalAccuracy === "number" && Number.isFinite(res.horizontalAccuracy)
            ? res.horizontalAccuracy
            : undefined;
        resolve({ latitude, longitude, accuracy });
      },
      fail(err) {
        reject(err ?? new Error("获取定位失败"));
      },
    });
  });
}
