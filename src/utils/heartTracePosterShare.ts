/**
 * 心迹 Tab 分享海报：`up-poster` json（独立版式，非页面 1:1 复刻）。
 */
import type {
  HeartTraceChartImageMeta,
  HeartTracePosterPayload,
  UviewPosterJson,
} from "@/types/pages/heartTraceShare";
import {
  HEART_TRACE_POSTER_COMPARE_BOX,
  HEART_TRACE_POSTER_DURATION_BOX,
} from "@/utils/heartTraceChartExport";

const C_BG = "#faf9f7";
const C_PRIMARY = "#c9a227";
const C_PRIMARY_SOFT = "rgba(201, 162, 39, 0.22)";
const C_INK = "#1c1917";
const C_TEXT = "#3f3320";
const C_MUTED = "#6e6045";
const C_CARD = "#ffffff";
const POSTER_W = "750rpx";

/**
 * 根据心迹统计快照与图表导出图生成海报 json。
 *
 * @param p 心迹海报载荷（不含体动图表）
 */
export function buildHeartTracePosterJson(p: HeartTracePosterPayload): UviewPosterJson {
  const views: UviewPosterJson["views"] = [];
  const push = (v: UviewPosterJson["views"][number]) => views.push(v);

  const posterHeight = estimatePosterHeight(p);

  push({
    type: "view",
    css: { left: "0rpx", top: "0rpx", width: POSTER_W, height: `${posterHeight}rpx`, background: C_BG },
  });
  push({
    type: "view",
    css: { left: "0rpx", top: "0rpx", width: POSTER_W, height: "8rpx", background: C_PRIMARY },
  });

  push({
    type: "text",
    text: "心迹",
    css: {
      left: "48rpx",
      top: "40rpx",
      color: C_INK,
      fontSize: "52rpx",
      fontWeight: "bold",
    },
  });
  push({
    type: "text",
    text: "观照身心 · 数据为镜",
    css: {
      left: "48rpx",
      top: "108rpx",
      color: C_MUTED,
      fontSize: "24rpx",
      letterSpacing: "0.12em",
    },
  });

  const headerTop = 40;
  const headerBottom = 132;
  const rangeFontSize = 28;
  const rangeTextRight = 24;
  const rangeTextW = 160;
  const rangeTextLeft = 750 - rangeTextW - rangeTextRight;
  const rangeTextTop = headerTop + (headerBottom - headerTop - rangeFontSize) / 2;
  push({
    type: "text",
    text: `本${p.rangeLabel}`,
    css: {
      left: `${rangeTextLeft}rpx`,
      top: `${rangeTextTop}rpx`,
      width: `${rangeTextW}rpx`,
      color: C_PRIMARY,
      fontSize: `${rangeFontSize}rpx`,
      fontWeight: "bold",
      textAlign: "right",
    },
  });

  const cardTop = 168;
  const cardW = 327;
  const cardH = 188;
  const gap = 16;
  const leftL = 40;
  const rightL = leftL + cardW + gap;

  const drawStatCard = (left: number, label: string, value: string, hint: string, accent: boolean) => {
    push({
      type: "view",
      css: {
        left: `${left}rpx`,
        top: `${cardTop}rpx`,
        width: `${cardW}rpx`,
        height: `${cardH}rpx`,
        background: C_CARD,
        radius: "32rpx",
      },
    });
    if (accent) {
      push({
        type: "view",
        css: {
          left: `${left}rpx`,
          top: `${cardTop + 24}rpx`,
          width: "6rpx",
          height: "48rpx",
          background: C_PRIMARY,
          radius: "3rpx",
        },
      });
    }
    push({
      type: "text",
      text: label,
      css: {
        left: `${left + 28}rpx`,
        top: `${cardTop + 28}rpx`,
        color: C_MUTED,
        fontSize: "24rpx",
      },
    });
    push({
      type: "text",
      text: value,
      css: {
        left: `${left + 28}rpx`,
        top: `${cardTop + 72}rpx`,
        color: C_PRIMARY,
        fontSize: "44rpx",
        fontWeight: "bold",
      },
    });
    push({
      type: "text",
      text: hint,
      css: {
        left: `${left + 28}rpx`,
        top: `${cardTop + 132}rpx`,
        color: C_TEXT,
        fontSize: "22rpx",
        width: `${cardW - 56}rpx`,
      },
    });
  };

  drawStatCard(
    leftL,
    "最近一次",
    `${p.latestSessionMinutes} 分钟`,
    p.latestSessionSubline || "—",
    true,
  );
  drawStatCard(
    rightL,
    p.periodSummaryTitle,
    `${p.periodSummaryMinutes} 分钟`,
    [p.periodSummaryMinutesSubline, p.periodCardSubline].filter(Boolean).join(" · ") || "—",
    false,
  );

  let sectionTop = cardTop + cardH + 40;
  const chartBoxLeft = 40;
  const chartBoxWidth = 686;
  const chartPad = 16;

  sectionTop = appendChartBlock(
    views,
    sectionTop,
    "平均呼吸率",
    "",
    p.chartImages.breathRate,
    HEART_TRACE_POSTER_COMPARE_BOX,
    chartBoxLeft,
    chartBoxWidth,
    chartPad,
  );
  sectionTop = appendChartBlock(
    views,
    sectionTop,
    "平均心率",
    "",
    p.chartImages.heartRate,
    HEART_TRACE_POSTER_COMPARE_BOX,
    chartBoxLeft,
    chartBoxWidth,
    chartPad,
  );
  sectionTop = appendChartBlock(
    views,
    sectionTop,
    "静坐时长",
    "分钟 / 日期",
    p.chartImages.duration,
    HEART_TRACE_POSTER_DURATION_BOX,
    chartBoxLeft,
    chartBoxWidth,
    chartPad,
  );

  push({
    type: "view",
    css: {
      left: "120rpx",
      top: `${sectionTop}rpx`,
      width: "510rpx",
      height: "2rpx",
      background: C_PRIMARY_SOFT,
    },
  });
  push({
    type: "text",
    text: "“数据不是生活的终点，而是觉知的镜子。”",
    css: {
      left: "80rpx",
      top: `${sectionTop + 28}rpx`,
      color: "rgba(110,96,69,0.65)",
      fontSize: "26rpx",
      fontStyle: "italic",
      width: "590rpx",
      textAlign: "center",
    },
  });
  push({
    type: "text",
    text: "长按图片可保存 · 分享你的心迹",
    css: {
      left: "48rpx",
      top: `${sectionTop + 96}rpx`,
      color: C_MUTED,
      fontSize: "22rpx",
      width: "654rpx",
      textAlign: "center",
    },
  });

  return {
    css: { width: POSTER_W, height: `${posterHeight}rpx`, background: C_BG },
    views,
  };
}

/** 在固定容器内等比缩放，避免贴图拉伸 */
function fitChartInBox(
  boxInnerW: number,
  boxInnerH: number,
  imgW: number,
  imgH: number,
): { w: number; h: number; offsetX: number; offsetY: number } {
  if (imgW > 0 && imgH > 0) {
    const aspect = imgW / imgH;
    let w = boxInnerW;
    let h = w / aspect;
    if (h > boxInnerH) {
      h = boxInnerH;
      w = h * aspect;
    }
    w = Math.round(w);
    h = Math.round(h);
    return {
      w,
      h,
      offsetX: Math.round((boxInnerW - w) / 2),
      offsetY: Math.round((boxInnerH - h) / 2),
    };
  }
  return { w: boxInnerW, h: boxInnerH, offsetX: 0, offsetY: 0 };
}

function appendChartBlock(
  views: UviewPosterJson["views"],
  top: number,
  title: string,
  subtitle: string,
  image: HeartTraceChartImageMeta | undefined,
  innerBox: { widthRpx: number; heightRpx: number },
  boxLeft: number,
  boxWidth: number,
  chartPad: number,
): number {
  const boxInnerW = innerBox.widthRpx;
  const boxInnerH = innerBox.heightRpx;
  const cardInnerH = boxInnerH + chartPad * 2;

  views.push({
    type: "text",
    text: title,
    css: { left: "48rpx", top: `${top}rpx`, color: C_INK, fontSize: "34rpx", fontWeight: "bold" },
  });
  if (subtitle) {
    views.push({
      type: "text",
      text: subtitle,
      css: { left: "520rpx", top: `${top + 6}rpx`, color: C_MUTED, fontSize: "20rpx" },
    });
  }
  const boxTop = top + 48;
  views.push({
    type: "view",
    css: {
      left: `${boxLeft}rpx`,
      top: `${boxTop}rpx`,
      width: `${boxWidth}rpx`,
      height: `${cardInnerH}rpx`,
      background: C_CARD,
      radius: "28rpx",
    },
  });
  const imgAreaLeft = boxLeft + chartPad;
  const imgAreaTop = boxTop + chartPad;
  if (image?.src) {
    const fit = fitChartInBox(boxInnerW, boxInnerH, image.width, image.height);
    views.push({
      type: "image",
      src: image.src,
      css: {
        left: `${imgAreaLeft + fit.offsetX}rpx`,
        top: `${imgAreaTop + fit.offsetY}rpx`,
        width: `${fit.w}rpx`,
        height: `${fit.h}rpx`,
        radius: "12rpx",
      },
    });
  } else {
    views.push({
      type: "text",
      text: "图表生成中",
      css: {
        left: `${boxLeft + boxWidth / 2 - 80}rpx`,
        top: `${boxTop + cardInnerH / 2 - 12}rpx`,
        color: C_MUTED,
        fontSize: "24rpx",
      },
    });
  }
  return boxTop + cardInnerH + 24;
}

function chartBlockHeight(
  image: HeartTraceChartImageMeta | undefined,
  innerBox: { heightRpx: number },
  chartPad: number,
): number {
  const cardInnerH = innerBox.heightRpx + chartPad * 2;
  return 48 + cardInnerH + 24;
}

function estimatePosterHeight(p: HeartTracePosterPayload): number {
  const headerAndCards = 400;
  const pad = 16;
  const breathH = chartBlockHeight(p.chartImages.breathRate, HEART_TRACE_POSTER_COMPARE_BOX, pad);
  const heartH = chartBlockHeight(p.chartImages.heartRate, HEART_TRACE_POSTER_COMPARE_BOX, pad);
  const durationH = chartBlockHeight(p.chartImages.duration, HEART_TRACE_POSTER_DURATION_BOX, pad);
  const footer = 160;
  return Math.max(headerAndCards + breathH + heartH + durationH + footer, 1500);
}
