<template>
    <view class="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden box-border pb-32 theme-bg meditation-page">
        <HomeBar :title="'心迹'" description="观 照 身 心" :titleIcon="'icon-xinshuai'" :leftIcon="'icon-Trophy'" :handleClick="gotoRank" />

        <view class="flex-1 w-full max-w-full min-w-0 box-border px-6 flex flex-col">
            <view class="w-full max-w-full min-w-0 pt-6 space-y-8 box-border">
                <!-- Health Dashboard Cards -->
                <view class="grid grid-cols-2 gap-4 w-full min-w-0">
                    <!-- Left Card: Recent -->
                    <view
                    @click="handleLatestSessionClick"
                        class="relative glass-card rounded-3xl p-5 bg-theme-13 space-y-3 flex flex-col justify-between aspect-square border border-white/20 min-w-0 overflow-hidden">
                        <view class="absolute -right-4 -top-4 text-primary/10 select-none">
                            <text class="icon-shijian  iconfont text-8xl"></text>
                        </view>
                        <view class="space-y-1">
                            <view class="text-[10px] tracking-[0.15rem] uppercase text-on-surface-variant/60 font-medium"></view>
                            <view class="font-headline text-[40rpx] theme-color-7">本次心迹</view>
                        </view>
                        <view class="space-y-1 theme-color-6">
                            <view class="text-[48rpx] font-semibold text-primary">{{ latestSessionMinutesDisplay }}<span
                                    class="text-[24rpx] ml-1 font-normal opacity-70">分钟</span>
                            </view>
                            <view class="text-[24rpx] text-on-surface-variant flex items-center gap-1 line-clamp-1">
                                <text class="iconfont icon-shijian text-[24rpx]"></text>
                                <text class="line-clamp-1">{{ latestSessionSubline }}</text> 
                            </view>
                        </view>
                    </view>
                    <!-- Right Card: Monthly Trend -->
                    <view
                        class="relative bg-theme-13 rounded-3xl p-5 space-y-3 flex flex-col justify-between aspect-square min-w-0 overflow-hidden">
                        <view class="absolute -right-4 -top-4 text-primary/10 select-none">
                            <text class="icon-pingfenxiangguanli  iconfont text-8xl"></text>
                        </view>
                        <view class="space-y-1">
                            <view class="text-[10px] tracking-[0.15rem] uppercase text-on-surface-variant/60 font-medium"></view>
                            <view class="font-headline text-[40rpx] theme-color-7">{{ periodSummaryTitle }}</view>
                        </view>
                        <view class="space-y-1 theme-color-6 ">
                            <view class="text-[48rpx] font-semibold text-primary line-clamp-1">{{ periodSummaryMinutes }}<text
                                    class="text-[24rpx] ml-1 font-normal opacity-70 ">分钟 {{ periodSummaryMinutesSubline }}</text>
                            </view>
                            <view class="text-[24rpx] text-on-surface-variant flex items-center gap-1">
                                <text class="iconfont icon-pingfenxiangguanli text-[24rpx]"></text>
                               <text class="line-clamp-1">{{ periodCardSubline }}</text> 
                            </view>
                        </view>
                    </view>
                </view>
                <!-- Filter Bar：对应接口 `range` day / week / month -->
                <view
                    class="flex justify-center items-center bg-surface-container-low/50 rounded-full p-1.5 max-w-full mx-auto px-1 box-border">
                    <view :class="rangePillClass('day')" @tap="setStatisticsRange('day')">日</view>
                    <view :class="rangePillClass('week')" @tap="setStatisticsRange('week')">周</view>
                    <view :class="rangePillClass('month')" @tap="setStatisticsRange('month')">月</view>
                </view>
                <!-- Duration Chart -->
                <view class="space-y-4 w-full max-w-full min-w-0 box-border">
                    <view class="flex justify-between items-end gap-2 px-2 min-w-0">
                        <view class="font-headline text-[40rpx] theme-color-7">静坐时长</view>
                        <view class="text-xs font-label tracking-widest text-on-surface-variant/60">分钟 / 日期</view>
                    </view>
                    <view class="bg-white/30 rounded-[32px] p-4 w-full max-w-full min-w-0 overflow-hidden box-border">
                        <view class="w-full max-w-full min-w-0 box-border" style="height: 190px">
                            <qiun-data-charts
                                :key="'dur-' + chartsRemountKey"
                                type="column"
                                canvas-id="weeklyDurationChart"
                                :canvas2d="true"
                                background="transparent"
                                :chart-data="durationChartData"
                                :opts="durationOpts" />
                        </view>
                    </view>
                </view>
                <!-- Data Comparison -->
                <view class="space-y-6 w-full max-w-full min-w-0">
                    <view class="flex justify-between items-center gap-2 min-w-0">
                        <view class="font-headline text-[40rpx] theme-color-7 shrink-0">数据对比</view>
                    <view class="flex gap-2 shrink-0">
                            <view class="flex items-center gap-1 px-[2rpx] py-1.5 bg-surface-container-low rounded-full">
                        <span class="text-[10px] text-on-surface font-medium">心率</span>
                            </view>
                            <view class="flex items-center gap-1 px-[2rpx] py-1.5 bg-surface-container-low rounded-full">
                        <span class="text-[10px] text-on-surface font-medium">呼吸</span>
                            </view>
                            <view class="flex items-center gap-1 px-[2rpx] py-1.5 bg-surface-container-low rounded-full">
                        <span class="text-[10px] text-on-surface font-medium">体动</span>
                      </view>
                        </view>
                    </view>
                  <view class="grid grid-cols-1 gap-4 w-full max-w-full min-w-0">
                    <view
                      class="w-full max-w-full min-w-0 bg-surface-container-lowest/20 border border-white/30 box-border overflow-hidden rounded-3xl p-3 space-y-2">
                      <view class="px-1 text-xs tracking-widest text-on-surface-variant/60">平均心率对比</view>
                      <view class="w-full max-w-full min-w-0 box-border" style="height: 168px">
                        <qiun-data-charts
                          :key="'cmp-heart-' + chartsRemountKey"
                          type="line"
                          canvas-id="weeklyCompareHeartChart"
                          :canvas2d="true"
                          background="transparent"
                          :tap-legend="true"
                          tooltip-format="statisticsCompareTooltip"
                          :chart-data="heartRateCompareChartData"
                          :opts="compareHeartRateOpts" />
                      </view>
                    </view>
                    <view
                      class="w-full max-w-full min-w-0 bg-surface-container-lowest/20 border border-white/30 box-border overflow-hidden rounded-3xl p-3 space-y-2">
                      <view class="px-1 text-xs tracking-widest text-on-surface-variant/60">平均呼吸率对比</view>
                      <view class="w-full max-w-full min-w-0 box-border" style="height: 168px">
                        <qiun-data-charts
                          :key="'cmp-breath-' + chartsRemountKey"
                          type="line"
                          canvas-id="weeklyCompareBreathChart"
                          :canvas2d="true"
                          background="transparent"
                          :tap-legend="true"
                          tooltip-format="statisticsCompareTooltip"
                          :chart-data="breathRateCompareChartData"
                          :opts="compareBreathRateOpts" />
                      </view>
                    </view>
                    <view
                      class="w-full max-w-full min-w-0 bg-surface-container-lowest/20 border border-white/30 box-border overflow-hidden rounded-3xl p-3 space-y-2">
                      <view class="px-1 text-xs tracking-widest text-on-surface-variant/60">体动总数对比</view>
                      <view class="w-full max-w-full min-w-0 box-border" style="height: 168px">
                        <qiun-data-charts
                          :key="'cmp-movement-' + chartsRemountKey"
                          type="column"
                          canvas-id="weeklyCompareMovementChart"
                          :canvas2d="true"
                          background="transparent"
                          :tap-legend="true"
                          tooltip-format="statisticsCompareTooltip"
                          :chart-data="movementCompareChartData"
                          :opts="compareBarOpts" />
                      </view>
                    </view>
                    </view>
                </view>
                <!-- Aesthetic Quote/Insight Footer -->
                <view class="pb-12 text-center">
                    <view
                        class="font-headline theme-color-8 italic text-on-surface-variant/40 text-sm max-w-[200px] mx-auto leading-relaxed">
                        “数据不是生活的终点，而是觉知的镜子。”
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { fetchMeditationReportStatistics } from '@/assets/js/api/meditation';
import HomeBar from '@/components/homeBar.vue';
import type {
  MeditationStatisticsCompareChartData,
  MeditationStatisticsCompareMetricBlock,
  MeditationReportStatisticsData,
  MeditationStatisticsChartBlock,
  MeditationStatisticsRange,
} from '@/types/api/meditation';
import { unwrapApiData } from '@/utils/apiResponse';
import { parseMeditationReportStatisticsPayload } from '@/utils/meditationReport';

const statsRange = ref<MeditationStatisticsRange>('week');

const FALLBACK_DURATION: MeditationStatisticsChartBlock = {
  categories: ['-'],
  series: [{ name: '时长', data: [0] }],
};
const FALLBACK_COMPARE: MeditationStatisticsCompareChartData = {
  categories: ['-'],
  heartRate: {
    series: [
      { name: '-', data: [0] },
      { name: '-', data: [0] },
    ],
  },
  breathRate: {
    series: [
      { name: '-', data: [0] },
      { name: '-', data: [0] },
    ],
  },
  movement: {
    series: [
      { name: '-', data: [0] },
      { name: '-', data: [0] },
    ],
  },
  duration: {
    series: [
      { name: '-', data: [0] },
      { name: '-', data: [0] },
    ],
  },
};

const statistics = ref<MeditationReportStatisticsData | null>(null);

/** 快速切换日/周/月时递增，用于丢弃晚到的旧请求结果，避免界面「慢一拍」 */
let statisticsLoadSeq = 0;

/**
 * tab 页在其它 tab 激活时可能宽高为 0，canvas 2d 首次 init 失败；切回本页时递增以强制重建图表。
 * 注意：不要用 `statsRange` 作图表 :key，否则切换周期会先销毁组件再用「上一周期」的 statistics 挂载，易与当前选中项错位。
 */
const chartsRemountKey = ref(0);



const latestSessionSubline = computed(() => {
  const first = statistics.value?.last7Sessions?.[0];
  if (first?.startDate) return `最近开始 ${first.startDate}`;
  return '暂无最近会话';
});

const periodSummaryTitle = computed(() => {
  const r = statsRange.value;
  if (r === 'day') return '本日概况';
  if (r === 'month') return '本月概况';
  return '本周概况';
});

const periodSummaryMinutesSubline = computed(() => {
const cur = statistics.value?.currentPeriod;
  const prev = statistics.value?.previousPeriod;
  if (!cur) return '';
  if (!prev) return '';
  const c = cur.totalDurationMinutes;
  const p = prev.totalDurationMinutes;
  if (!Number.isFinite(c) || !Number.isFinite(p)) return '-';
  const d = Math.round(c - p);
  if (d === 0) return '-';
  const dir = d > 0 ? '↑' : '↓';
  return `${dir} ${Math.abs(d)} 分钟`;
});

const durationChartData = computed(
  () => statistics.value?.durationChartData ?? FALLBACK_DURATION,
);
const compareChartData = computed(() => statistics.value?.compareChartData ?? FALLBACK_COMPARE);

function buildCompareMetricChartData(
  metric: MeditationStatisticsCompareMetricBlock,
  categories: string[],
): MeditationStatisticsChartBlock {
  return {
    categories,
    series: metric.series,
  };
}

const heartRateCompareChartData = computed(() =>
  buildCompareMetricChartData(compareChartData.value.heartRate, compareChartData.value.categories),
);

const breathRateCompareChartData = computed(() =>
  buildCompareMetricChartData(compareChartData.value.breathRate, compareChartData.value.categories),
);

const movementCompareChartData = computed(() =>
  buildCompareMetricChartData(compareChartData.value.movement, compareChartData.value.categories),
);

/** 优先用统计根字段；不足 1 分钟时保留最多两位小数，否则四舍五入为整数分钟 */
const latestSessionMinutesDisplay = computed(() => {
  const m =
    statistics.value?.latestSessionMinutes ??
    statistics.value?.currentPeriod?.latestSessionMinutes ??
    0;
  if (!Number.isFinite(m) || m <= 0) return '0';
  if (m < 1) return String(Math.round(m * 100) / 100);
  return String(Math.round(m));
});

const periodSummaryMinutes = computed(() =>
  Math.round(statistics.value?.currentPeriod?.totalDurationMinutes ?? 0),
);

/** 与 5.4.2 一致：整段 `currentPeriod` 汇总 + 固定 7 桶；与 `previousPeriod.totalDurationMinutes` 比环比时长 */
const periodCardSubline = computed(() => {
  const cur = statistics.value?.currentPeriod;
  const prev = statistics.value?.previousPeriod;
  if (!cur) return '';
  const base = `${cur.sessionCount} 场 · 本周期 ${Math.round(cur.totalDurationMinutes)} 分`;
  if (!prev) return base;
  return `${base} `;
});

function flatBlockValues(block: MeditationStatisticsChartBlock): number[] {
  return block.series.flatMap((s) => s.data);
}

const durationMaxY = computed(() => {
  const vals = flatBlockValues(durationChartData.value);
  if (!vals.length) return 40;
  const m = Math.max(...vals, 0);
  return Math.max(10, Math.ceil(m / 5) * 5 + 5);
});

const compareYBounds = computed(() => {
  const vals = flatBlockValues(heartRateCompareChartData.value);
  if (!vals.length) return { min: 0, max: 60 };
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const span = maxV - minV || 1;
  const pad = Math.max(span * 0.1, 2);
  return {
    min: Math.max(0, Math.floor(minV - pad)),
    max: Math.ceil(maxV + pad),
  };
});

function calcYBounds(block: MeditationStatisticsChartBlock, fallbackMax: number) {
  const vals = flatBlockValues(block);
  if (!vals.length) return { min: 0, max: fallbackMax };
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const span = maxV - minV || 1;
  const pad = Math.max(span * 0.1, 1);
  return {
    min: Math.max(0, Math.floor(minV - pad)),
    max: Math.max(2, Math.ceil(maxV + pad)),
  };
}

const breathRateYBounds = computed(() => calcYBounds(breathRateCompareChartData.value, 30));
const movementYBounds = computed(() => calcYBounds(movementCompareChartData.value, 20));

const durationOpts = computed(() => ({
  color: ['#705900'],
  legend: { show: false },
  padding: [12, 12, 8, 6],
  xAxis: {
    disableGrid: true,
    fontSize: 10,
    fontColor: '#7d7463',
  },
  yAxis: {
    data: [
      {
        min: 0,
        max: durationMaxY.value,
        title: '分钟',
        titleFontSize: 10,
        titleFontColor: '#7d7463',
        axisLine: false,
      },
    ],
    gridType: 'dash' as const,
    dashLength: 4,
    fontSize: 10,
    fontColor: '#7d7463',
  },
  extra: {
    column: {
      type: 'group' as const,
      width: 18,
      borderRadius: [8, 8, 8, 8],
    },
  },
}));

/** 三个对比图使用同主题不同色阶，保持金色体系一致 */
const HEART_COMPARE_COLORS: readonly [string, string] = ['rgba(212,175,53,0.28)', '#705900'];
const HEART_COMPARE_COLORS_2: readonly [string, string] = ['#4A90E2', '#B4D4F5'];
const BREATH_COMPARE_COLORS: readonly [string, string] = ['#F9BCB0', '#E6644F'];
const MOVEMENT_COMPARE_COLORS: readonly [string, string] = ['rgba(218,187,83,0.26)', '#DABB53'];

const compareHeartRateOpts = computed(() => ({
  color: [...HEART_COMPARE_COLORS_2],
  /** 底部图例色块与折线同色（opts.color）；点击图例切换该系列 show，由 uCharts touchLegend 处理 */
  legend: {
    show: true,
    position: 'bottom',
    float: 'center',
    fontSize: 10,
    lineHeight: 12,
    padding: 4,
    margin: 4,
    itemGap: 14,
    fontColor: '#5c5548',
    backgroundColor: 'rgba(0,0,0,0)',
    borderWidth: 0,
    hiddenColor: '#b9b0a0',
  },
  padding: [6, 8, 2, 8],
  xAxis: {
    disableGrid: true,
    fontSize: 10,
    fontColor: '#7d7463',
  },
  yAxis: {
    data: [
      {
        min: compareYBounds.value.min,
        max: compareYBounds.value.max,
        axisLine: false,
      },
    ],
    splitNumber: 4,
    gridType: 'dash' as const,
    dashLength: 3,
    fontSize: 10,
    fontColor: '#7d7463',
  },
  extra: {
    line: {
      type: 'curve' as const,
      width: 2,
      activeType: 'hollow' as const,
    },
    /** 不追加横轴类目行；略抬高行高避免两条系列文字贴边被裁 */
    tooltip: {
      showCategory: false,
      lineHeight: 22,
      fontSize: 11,
      boxPadding: 4,
    },
  },
}));

const compareBarOpts = computed(() => ({
  color: [...MOVEMENT_COMPARE_COLORS],
  legend: {
    show: true,
    position: 'bottom',
    float: 'center',
    fontSize: 10,
    lineHeight: 12,
    padding: 4,
    margin: 4,
    itemGap: 14,
    fontColor: '#5c5548',
    backgroundColor: 'rgba(0,0,0,0)',
    borderWidth: 0,
    hiddenColor: '#b9b0a0',
  },
  padding: [8, 8, 2, 8],
  xAxis: {
    disableGrid: true,
    fontSize: 10,
    fontColor: '#7d7463',
  },
  yAxis: {
    data: [
      {
        min: movementYBounds.value.min,
        max: movementYBounds.value.max,
        axisLine: false,
      },
    ],
    splitNumber: 4,
    gridType: 'dash' as const,
    dashLength: 3,
    fontSize: 10,
    fontColor: '#7d7463',
  },
  extra: {
    column: {
      type: 'group' as const,
      width: 9,
      borderRadius: [4, 4, 0, 0],
    },
    tooltip: {
      showCategory: false,
      lineHeight: 22,
      fontSize: 11,
      boxPadding: 4,
    },
  },
}));

const compareBreathRateOpts = computed(() => ({
  ...compareHeartRateOpts.value,
  color: [...BREATH_COMPARE_COLORS],
  yAxis: {
    data: [
      {
        min: breathRateYBounds.value.min,
        max: breathRateYBounds.value.max,
        axisLine: false,
      },
    ],
    splitNumber: 4,
    gridType: 'dash' as const,
    dashLength: 3,
    fontSize: 10,
    fontColor: '#7d7463',
  },
}));

function rangePillClass(range: MeditationStatisticsRange) {
  return statsRange.value === range
    ? 'px-8 py-1.5 rounded-full text-sm font-semibold bg-white text-primary shadow-sm ring-1 ring-black/5'
    : 'px-6 py-1.5 rounded-full text-sm text-on-surface-variant/50 transition-all';
}

async function loadStatistics(range: MeditationStatisticsRange) {
  const seq = ++statisticsLoadSeq;
  uni.showLoading({ title: '加载中', mask: true });
  try {
    const res = await fetchMeditationReportStatistics({ range });
    if (seq !== statisticsLoadSeq) return;
    const raw = unwrapApiData<unknown>(res);
    const data = parseMeditationReportStatisticsPayload(raw);
    if (data) {
      statistics.value = data;
    } else {
      statistics.value = null;
      uni.showToast({ title: '统计数据格式异常', icon: 'none' });
    }
  } catch (e) {
    if (seq !== statisticsLoadSeq) return;
    console.error('fetchMeditationReportStatistics', e);
    uni.showToast({ title: '加载失败', icon: 'none' });
  } finally {
    if (seq === statisticsLoadSeq) {
      uni.hideLoading();
    }
  }
}

function setStatisticsRange(range: MeditationStatisticsRange) {
  if (statsRange.value === range) return;
  statsRange.value = range;
  statistics.value = null;
  void loadStatistics(range);
}

const handleLatestSessionClick = () => {
  uni.navigateTo({
    url: `/pages/meditation/report?sessionId=${statistics.value?.currentPeriod?.latestSessionId}`,
  });
};

function gotoRank() {
  uni.navigateTo({
    url: '/pages/profile/rank',
  });
}

onMounted(() => {
  void loadStatistics(statsRange.value);
});

onShow(() => {
  void nextTick(() => {
    chartsRemountKey.value += 1;
  });
});
</script>

<style scoped lang="scss">
.meditation-page {
    --meditation-glow: rgba(212, 175, 53, 0.35);
}

.music-up-list {
    width: 100%;
}


.glow-blob {
    animation: meditation-glow 5s ease-in-out infinite;
}

.float-ring {
    animation: meditation-float 6s ease-in-out infinite;
}

.label-shimmer {
    animation: label-shimmer 3s ease-in-out infinite;
}

.ring-border-pulse {
    animation: ring-border-pulse 4s ease-in-out infinite;
}

.thumb-pulse {
    animation: thumb-pulse 2.2s ease-in-out infinite;
}

/* 与填充右边缘对齐：圆点中心 = 进度比例位置 */
.thumb-center {
    transform: translate(-50%, -50%);
}

.music-icon-bob {
    animation: music-bob 2.5s ease-in-out infinite;
}

.handle-dot {
    transition: transform 0.2s ease-out;
}

/* 进度环：与 ring-track-border / ring-progress-hole 同宽，保证与 conic 同心 */
.ring-progress-stack {
    --ring-band: 12rpx;
}

.ring-track-border {
    box-sizing: border-box;
    border: var(--ring-band) solid var(--color-10);
    border-radius: 50%;
}

.ring-progress-conic {
    border-radius: 50%;
}

.ring-progress-hole {
    position: absolute;
    left: var(--ring-band);
    right: var(--ring-band);
    top: var(--ring-band);
    bottom: var(--ring-band);
    z-index: 1;
    background-color: var(--color-11);
    box-sizing: border-box;
}

.track-fill-anim {
    transition: width 0.2s ease-out;
}

.btn-press {
    transition: transform 0.15s ease;
}

.btn-press-active {
    transform: scale(0.92);
}

.btn-press-start {
    transition: transform 0.15s ease, opacity 0.15s ease;
}

.btn-press-start:active {
    transform: scale(0.98);
}

.audio-card-anim {
    animation: meditation-float 8s ease-in-out infinite;
    animation-delay: -2s;
}

.tabular-nums {
    font-variant-numeric: tabular-nums;
}
</style>