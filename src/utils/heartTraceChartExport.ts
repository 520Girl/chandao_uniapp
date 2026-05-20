/**
 * 心迹页 `qiun-data-charts` 导出为图片，供 `up-poster` 贴图使用。
 */

export type ChartGetImageParams = { base64?: string; type?: string };

const pendingByCanvasId = new Map<
  string,
  { resolve: (src: string | null) => void; timer: ReturnType<typeof setTimeout> }
>();

/**
 * 在页面模板中为对应 `canvas-id` 绑定：`@getImage="(e) => onQiunChartGetImage('xxx', e)"`。
 */
export function onQiunChartGetImage(canvasId: string, params: ChartGetImageParams): void {
  const pending = pendingByCanvasId.get(canvasId);
  if (!pending) return;
  clearTimeout(pending.timer);
  pendingByCanvasId.delete(canvasId);
  const raw = params?.base64;
  void normalizePosterImageSrc(typeof raw === "string" ? raw : "").then(pending.resolve);
}

type QiunChartExpose = { getImage?: () => void };

/**
 * 调用图表 `getImage()` 并等待 `@getImage` 回传（canvas2d 为 base64，旧 canvas 为临时路径）。
 *
 * @param chartRef 页面上的 `qiun-data-charts` ref
 * @param canvasId 与组件 `canvas-id` 一致
 */
export function captureQiunChartImage(
  chartRef: QiunChartExpose | null | undefined,
  canvasId: string,
): Promise<string | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      pendingByCanvasId.delete(canvasId);
      resolve(null);
    }, 6000);
    pendingByCanvasId.set(canvasId, { resolve, timer });
    try {
      chartRef?.getImage?.();
    } catch (e) {
      console.error("captureQiunChartImage getImage", canvasId, e);
      clearTimeout(timer);
      pendingByCanvasId.delete(canvasId);
      resolve(null);
    }
  });
}

/** 心迹页对比图容器高度 168px → 336rpx（750 设计宽） */
export const HEART_TRACE_POSTER_COMPARE_BOX = { widthRpx: 654, heightRpx: 336 };
/** 心迹页静坐时长图容器高度 190px → 380rpx */
export const HEART_TRACE_POSTER_DURATION_BOX = { widthRpx: 654, heightRpx: 380 };

/**
 * 导出图表并附带像素尺寸，供海报按比例贴图。
 */
export async function captureQiunChartImageWithMeta(
  chartRef: QiunChartExpose | null | undefined,
  canvasId: string,
): Promise<{ src: string; width: number; height: number } | null> {
  const src = await captureQiunChartImage(chartRef, canvasId);
  if (!src) return null;
  const size = await getPosterImageSize(src);
  if (size) return { src, ...size };
  return { src, width: 0, height: 0 };
}

/**
 * 读取图片像素尺寸（海报内按原图比例缩放）。
 */
export function getPosterImageSize(src: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    uni.getImageInfo({
      src,
      success: (res) => {
        const w = Number(res.width);
        const h = Number(res.height);
        if (w > 0 && h > 0) resolve({ width: w, height: h });
        else resolve(null);
      },
      fail: () => resolve(null),
    });
  });
}

/**
 * 将图表导出结果转为 `up-poster` 可绘制的 `image.src`（小程序 base64 写临时文件）。
 */
export async function normalizePosterImageSrc(raw: string): Promise<string | null> {
  const s = (raw || "").trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s) || s.startsWith("/") || s.startsWith("wxfile://")) {
    return s;
  }
  if (s.startsWith("data:image")) {
    return writeBase64ToTempFileIfNeeded(s);
  }
  if (s.length > 64 && /^[A-Za-z0-9+/=]+$/.test(s.slice(0, 32))) {
    return writeBase64ToTempFileIfNeeded(`data:image/png;base64,${s}`);
  }
  return s;
}

async function writeBase64ToTempFileIfNeeded(dataUrl: string): Promise<string> {
  // #ifdef MP-WEIXIN
  const wxApi = (globalThis as {
    wx?: {
      env?: { USER_DATA_PATH?: string };
      getFileSystemManager?: () => {
        writeFile: (opts: {
          filePath: string;
          data: string;
          encoding: string;
          success: () => void;
          fail: (err: unknown) => void;
        }) => void;
      };
    };
  }).wx;
  const fs = wxApi?.getFileSystemManager?.();
  const userBase = wxApi?.env?.USER_DATA_PATH;
  if (fs && userBase) {
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const filePath = `${userBase}/heart_trace_chart_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.png`;
    try {
      await new Promise<void>((resolve, reject) => {
        fs.writeFile({
          filePath,
          data: base64,
          encoding: "base64",
          success: () => resolve(),
          fail: (err) => reject(err),
        });
      });
      return filePath;
    } catch (e) {
      console.warn("writeBase64ToTempFileIfNeeded", e);
    }
  }
  // #endif
  return dataUrl;
}
