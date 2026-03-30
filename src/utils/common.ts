import { getCurrentInstance } from "vue";

/**
 * 新版 Canvas 2D 绘制云桥进度曲线（uni-app 小程序可用）
 * @param progress 0~1
 * @param canvasId 默认 cloudBridgeCanvas
 */
export function drawCloudBridgeCanvas(progress = 0.7, canvasId = "cloudBridgeCanvas") {
  const inst = getCurrentInstance();
  const proxy = inst?.proxy;
  if (!proxy) return;

  const query = uni.createSelectorQuery().in(proxy as any);
  query
    .select(`#${canvasId}`)
    // 新版必须拿 node 才能 getContext('2d')
    .fields({ node: true, size: true }, (res: any) => {
      if (!res || !res.node) return;
      const { node: canvas, width: w, height: h } = res as { node: any; width: number; height: number };
      if (!w || !h) return;

      // 小程序 canvas 需要把绘图缓冲区按 dpr 放大，否则会出现“线条铺不满/发虚”
      const dpr = Math.max(1, Number(uni.getSystemInfoSync().pixelRatio) || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      // ✅ 新版标准 2D 上下文（关键！）
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 后续坐标使用 CSS 像素体系绘制
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 清空画布
      ctx.clearRect(0, 0, w, h);

      // ============= 你的绘制逻辑完全不变 =============
      const scaleX = w / 200;
      const scaleY = h / 40;
      const s = (scaleX + scaleY) / 2;

      const P0 = { x: 0, y: 35 };
      const P1 = { x: 100, y: -10 };
      const P2 = { x: 200, y: 35 };

      const bezierPoint = (t: number) => {
        const x = (1 - t) * (1 - t) * P0.x + 2 * (1 - t) * t * P1.x + t * t * P2.x;
        const y = (1 - t) * (1 - t) * P0.y + 2 * (1 - t) * t * P1.y + t * t * P2.y;
        return { x: x * scaleX, y: y * scaleY };
      };

      const N = 120;
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= N; i++) {
        pts.push(bezierPoint(i / N));
      }

      let totalLen = 0;
      const segLens: number[] = [];
      for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i - 1].x;
        const dy = pts[i].y - pts[i - 1].y;
        const len = Math.hypot(dx, dy);
        segLens.push(len);
        totalLen += len;
      }

      const dash = [4 * s, 8 * s];
      const lineWidthBg = 4 * s;
      const lineWidthFg = 6 * s;

      // ---------- 背景虚线 ----------
      ctx.save();
      ctx.lineWidth = lineWidthBg;
      ctx.setLineDash(dash);
      ctx.strokeStyle = "#e5e1d8";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
      ctx.restore();

      // ---------- 金色进度 ----------
      const targetLen = totalLen * Math.min(1, Math.max(0, progress));
      let acc = 0;
      ctx.save();
      ctx.lineWidth = lineWidthFg;
      ctx.lineCap = "round";

      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "rgba(212,175,53,0.2)");
      grad.addColorStop(1, "rgba(212,175,53,1)");
      ctx.strokeStyle = grad;

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const seg = segLens[i - 1] || 0;
        if (acc + seg >= targetLen) {
          const remain = targetLen - acc;
          const ratio = seg === 0 ? 0 : remain / seg;
          const x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * ratio;
          const y = pts[i - 1].y + (pts[i].y - pts[i - 1].y) * ratio;
          ctx.lineTo(x, y);
          break;
        }
        ctx.lineTo(pts[i].x, pts[i].y);
        acc += seg;
      }
      ctx.stroke();
      ctx.restore();
    })
    .exec();
}

/**
 * 时间格式化工具，支持自定义格式字符串
 * @param date 输入日期，支持 Date 对象、时间戳（毫秒）或 ISO 字符串
 * @param format 输出格式，默认为 "YYYY-MM-DD HH:mm:ss"
 */
export function formatDate(date: Date | number | string, format = "YYYY-MM-DD HH:mm:ss"): string {
  let d: Date;
  if (typeof date === "string") {
    d = new Date(date);
  }
  else if (typeof date === "number") {
    d = new Date(date);
  }
  else {
    d = date;
  }
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();
  return format
    .replace("YYYY", String(year))
    .replace("MM", String(month).padStart(2, "0"))
    .replace("DD", String(day).padStart(2, "0"))
    .replace("HH", String(hour).padStart(2, "0"))
    .replace("mm", String(minute).padStart(2, "0"))
    .replace("ss", String(second).padStart(2, "0"));

}
