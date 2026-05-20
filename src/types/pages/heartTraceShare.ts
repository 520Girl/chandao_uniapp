/**
 * 心迹 Tab（`pages/index/report`）分享海报：载荷与 `up-poster` json 复用 `meditationShare` 的视图类型。
 */
import type { MeditationStatisticsRange } from "@/types/api/meditation";
import type { UviewPosterJson } from "@/types/pages/meditationShare";

/** 图表导出图（含像素尺寸，用于海报内按比例缩放避免拉伸） */
export interface HeartTraceChartImageMeta {
  src: string;
  width: number;
  height: number;
}

/** 图表导出图（`qiun-data-charts` getImage 结果，已规范为海报可用路径） */
export interface HeartTraceChartImages {
  duration?: HeartTraceChartImageMeta;
  heartRate?: HeartTraceChartImageMeta;
  breathRate?: HeartTraceChartImageMeta;
}

/** 生成心迹海报时的数据快照 */
export interface HeartTracePosterPayload {
  range: MeditationStatisticsRange;
  rangeLabel: string;
  latestSessionMinutes: string;
  latestSessionSubline: string;
  periodSummaryTitle: string;
  periodSummaryMinutes: string;
  periodSummaryMinutesSubline: string;
  periodCardSubline: string;
  chartImages: HeartTraceChartImages;
}

export type { UviewPosterJson };
