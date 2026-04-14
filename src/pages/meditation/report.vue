<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
    <lcrBar :title="'心迹报告'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
    <view class="px-8 pt-10 pb-6 text-center">
      <view class="theme-color-5 text-[60rpx] font-medium leading-snug">
        今日，你照见 <text class="font-bold text-primary">{{ elapsedMin }}</text> 分{{ elapsedRemainSec }}秒
        <text class="italic font- text-[38rpx]">{{ reportFromApi?.breathText }}</text>
      </view>
    </view>
    <view class="relative px-6 py-4">
      <view
        class="bg-white/40 rounded-[80rpx] p-6 h-64 relative overflow-hidden border border-primary/5 flex items-center justify-center float-soft">
        <view class="absolute inset-0 flex items-center justify-center overflow-hidden">
          <view :class="`bg-blue-300/${reportFromApi?.peaceRatio}`"
            class="absolute w-40 h-24 bg-blue-300/100 watercolor-blur cloud-shape -translate-x-12 -translate-y-8">
          </view>
          <view :class="`bg-blue-200/${reportFromApi?.relaxRatio}`"
            class="absolute w-32 h-20 bg-blue-200/100 watercolor-blur cloud-shape -translate-x-20 translate-y-4">
          </view>
          <view :class="`bg-red-300/${reportFromApi?.tensionRatio}`"
            class="absolute w-36 h-28 bg-red-300/100 watercolor-blur cloud-shape translate-x-16 translate-y-10">
          </view>
          <view :class="`bg-red-400/${reportFromApi?.anxietyRatio}`"
            class="absolute w-24 h-24 bg-red-400/100 watercolor-blur cloud-shape translate-x-10 -translate-y-12">
          </view>
        </view>
        <view class="relative z-10 text-center">
          <view class="text-[24rpx] font-bold tracking-[0.1em] text-primary/80 mb-1 uppercase">情绪云图</view>
          <view class="text-[20rpx] text-[#3c3728]/60 italic">{{ manualStop ? '手动结束，本次觉察已记录' : '自然完成，状态平稳收束' }}
          </view>
        </view>
      </view>
    </view>
    <view class="px-6 py-2">
      <view class="bg-white/40 rounded-xl p-5 border border-primary/5">
        <view class="text-[28rpx] font-bold tracking-[0.1em] text-primary/80 uppercase mb-4 text-center">生理指标回顾
        </view>
        <view class="grid grid-cols-3 gap-4">
          <view class="flex flex-col items-center">
            <view class="size-10 rounded-full bg-primary/5 flex items-center justify-center mb-2">
              <text class="iconfont icon-tubiaozhizuomoban- text-primary text-xl"></text>
            </view>
            <view class="text-[20rpx] text-[#3c3728]/50 uppercase tracking-tighter">平均心率</view>
            <view class="text-[28rpx] font-bold text-[#3c3728] tabular-nums">{{ avgHeart }} <text
                class="text-[16rpx] font-normal">bpm</text></view>
          </view>
          <view class="flex flex-col items-center border-x border-primary/10">
            <view class="size-10 rounded-full bg-primary/5 flex items-center justify-center mb-2">
              <text class="iconfont icon-wind text-primary text-xl"></text>
            </view>
            <view class="text-[20rpx] text-[#3c3728]/50 uppercase tracking-tighter">平均呼吸率</view>
            <view class="text-[28rpx] font-bold text-[#3c3728] tabular-nums">{{ avgBreath }} <text
                class="text-[16rpx] font-normal">次/分</text></view>
          </view>
          <view class="flex flex-col items-center">
            <view class="size-10 rounded-full bg-primary/5 flex items-center justify-center mb-2">
              <text class="iconfont icon-directions_run text-primary text-xl"></text>
            </view>
            <view class="text-[20rpx] text-[#3c3728]/50 uppercase tracking-tighter">体动次数</view>
            <view class="text-[28rpx] font-bold text-[#3c3728] tabular-nums">{{ movementCountDisplay }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="px-6 py-4">
      <view class="bg-white/40 rounded-[80rpx] p-5 border border-primary/5">
        <view class="flex justify-between items-end mb-4">
          <view>
            <view class="text-[24rpx] font-bold tracking-[0.1em] text-primary/80 uppercase">{{ stabilityCardTitle }}
            </view>
            <view class="text-[32rpx] font-light mt-1 text-[#3c3728]">{{ secondaryTitle }}</view>
          </view>
          <view class="text-right">
            <text class="text-2xl font-bold text-primary">{{ stabilityIndex }}</text>
            <text class="text-[10px] text-[#3c3728]/50 block uppercase">{{ stabilityCardHint }}</text>
          </view>
        </view>
        <view class="relative h-12 w-full bg-[#eeeae3] rounded-full overflow-hidden flex items-center">
          <view class="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 opacity-60">
          </view>
          <view
            class="absolute h-full bg-primary/20 backdrop-blur-sm rounded-r-full border-r-2 border-primary/30 progress-anim"
            :style="{ width: `${Math.max(10, Math.min(100, stabilityIndex))}%` }">
          </view>
          <view class="relative w-full flex justify-between px-4 z-10">
            <text class="text-[9px] uppercase font-bold text-[#3c3728]/40">薄</text>
            <text class="text-[9px] uppercase font-bold text-[#3c3728]/60 italic">当前厚度</text>
            <text class="text-[9px] uppercase font-bold text-[#3c3728]/40">厚</text>
          </view>
        </view>
        <view class="mt-3 text-[11px] leading-relaxed text-[#3c3728]/70 italic">{{ reportSubtitle }}</view>

      </view>
    </view>
    <view class="px-6 py-2">
      <view class="bg-white/40 rounded-xl p-5 border border-primary/5">
        <view class="text-[28rpx] font-bold tracking-[0.1em] text-primary/80 uppercase mb-4 text-center">
          身体节律趋势
        </view>
        <view class="w-full" style="height: 200px">
          <qiun-data-charts type="line" canvas-id="meditationTrendChart" :canvas2d="true" background="transparent"
            :chart-data="bodyTrendChartData" :opts="bodyTrendOpts" />
        </view>
      </view>
    </view>
    <view class="px-6 py-4">
      <view class="bg-white/40 rounded-xl p-5 border border-primary/5">
        <view class="text-[28rpx] font-bold tracking-[0.1em] text-primary/80 uppercase mb-6 text-center">中道实践
        </view>
        <view class="relative h-24 flex flex-col justify-center">
          <!-- Shore 1 -->
          <view class="absolute left-0 bottom-2 text-center">
            <text class="iconfont icon-landscape text-[#3c3728]/30 text-3xl"></text>
            <view class="text-[18rpx] uppercase tracking-tighter text-[#3c3728]/50 mt-1">执着</view>
          </view>
          <!-- Shore 2 -->
          <view class="absolute right-0 bottom-2 text-center">
            <text class="iconfont icon-landscape text-[#3c3728]/30 text-3xl"></text>
            <view class="text-[18rpx] uppercase tracking-tighter text-[#3c3728]/50 mt-1">厌离</view>
          </view>
          <!-- Cloud Bridge (Progress) -->
          <view class="relative w-full px-10">
            <!-- Background Path -->
            <canvas id="cloudBridgeCanvas" canvas-id="cloudBridgeCanvas" type="2d"
              class="w-full h-[96rpx] overflow-visible" />
            <!-- Floating Cloud Indicator -->
            <view class="absolute top-[-5px] -translate-x-1/2" :style="{ left: harmonyPercent + '%' }">
              <view
                class="bg-white size-8 rounded-full shadow-lg border border-primary/20 flex items-center justify-center">
                <text class="iconfont icon-Cloudy text-primary text-sm"></text>
              </view>
            </view>
          </view>
        </view>
        <view class="text-center mt-2">
          <view class="text-[26rpx] font-medium text-[#3c3728]">{{ midPathSummary }}</view>
          <view v-if="sitCountLine" class="text-[22rpx] text-[#3c3728]/60 mt-1">{{ sitCountLine }}</view>
        </view>
      </view>
    </view>
    <view class="text-center mb-10">
      <view class="text-[26rpx] font-medium text-[#3c3728] mb-1">温馨提示：本报告仅为静心参考，非医疗诊断。
      </view>
      <text class="text-[26rpx] font-medium text-[#3c3728] mb-1">以舒适为宜，不勉强、不贪长。</text>
    </view>
    <view class="fixed bottom-24 right-8 z-20">
      <button
        class="size-14 bg-theme-2 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
        @click="openShareSheet">
        <text class="iconfont icon-share text-[70rpx]"></text>
      </button>
    </view>
    <up-poster ref="posterRef" :json="posterJson" />
    <up-action-sheet v-model:show="shareSheetVisible" title="分享" :actions="shareSheetActions" cancel-text="取消"
      @select="onShareSheetSelect" />
  </view>
</template>

<script setup lang="ts">
import { nextTick } from 'vue';
import { fetchMeditationReportDetail } from '@/assets/js/api/meditation';
import lcrBar from '@/components/lcrBar.vue';
import { useMeditationReportShare, type UviewPosterInstance } from '@/composables/useMeditationReportShare';
import { useMeditationStore } from '@/stores/meditation';
import type { MeditationReport, MeditationReportSection } from '@/types/api/meditation';
import type { MeditationReportSharePayload } from '@/types/pages/meditationShare';
import { unwrapApiData } from '@/utils/apiResponse';
import { drawCloudBridgeCanvas } from '@/utils/common';
import { parseMeditationReportDetailPayload } from '@/utils/meditationReport';
import { navigateBack } from '@/utils/navigation';

const meditationStore = useMeditationStore();

const duration = ref(15);
const elapsedSec = ref(0);
const avgHeart = ref(72);
const avgBreath = ref(12);
const maxHeart = ref(78);
const minHeart = ref(66);
const manualStop = ref(false);
const trackTitle = ref('');
/** 接口拉取或 Store 注入的完整报告 */
const reportFromApi = ref<MeditationReport | null>(null);
/** 入口 URL 上的 sessionId（分享落地或直达时用于补全 path） */
const urlSessionId = ref<number | null>(null);
const effectiveSessionId = computed(
  () => reportFromApi.value?.sessionId ?? urlSessionId.value ?? null
);

const posterRef = ref<UviewPosterInstance | null>(null);
const shareSheetVisible = ref(false);

function getSharePayload(): MeditationReportSharePayload {
  return {
    durationMin: duration.value,
    elapsedSec: elapsedSec.value,
    avgHeart: avgHeart.value,
    avgBreath: avgBreath.value,
    maxHeart: maxHeart.value,
    minHeart: minHeart.value,
    manualStop: manualStop.value,
    trackTitle: trackTitle.value,
    sessionId: effectiveSessionId.value,
    h5LandingBaseUrl: import.meta.env.VITE_H5_SHARE_BASE,
  };
}

const {
  posterJson,
  generatePosterImagePath,
  openFriendShareGuide,
  openTimelineShareGuide,
  copyH5ShareLink,
} = useMeditationReportShare(posterRef, getSharePayload);

const shareSheetActions = computed(() => {
  const rows: { name: string; value: string }[] = [{ name: '生成分享海报', value: 'poster' }];
  // #ifdef MP-WEIXIN
  rows.push(
    { name: '分享给微信好友或群', value: 'friend' },
    { name: '分享到微信朋友圈', value: 'timeline' },
  );
  // #endif
  // #ifdef H5
  rows.push({ name: '复制页面链接', value: 'copyLink' });
  // #endif
  return rows;
});

function openShareSheet() {
  shareSheetVisible.value = true;
}

/** 微信小程序：保存海报或预览；其它端直接预览 */
function offerPosterAfterGenerate(tempPath: string) {
  // #ifdef MP-WEIXIN
  uni.showActionSheet({
    itemList: ['保存到相册', '预览图片'],
    success: (tap) => {
      if (tap.tapIndex === 0) {
        savePosterToPhotosAlbum(tempPath);
      } else {
        uni.previewImage({ urls: [tempPath] });
      }
    },
  });
  // #endif
  // #ifndef MP-WEIXIN
  uni.previewImage({ urls: [tempPath] });
  // #endif
}

function savePosterToPhotosAlbum(filePath: string) {
  uni.saveImageToPhotosAlbum({
    filePath,
    success: () => {
      uni.showToast({ title: '已保存到相册', icon: 'success' });
    },
    fail: (err) => {
      const msg = String((err as UniApp.GeneralCallbackResult)?.errMsg || '');
      if (msg.includes('auth deny') || msg.includes('authorize') || msg.includes('permission')) {
        uni.showModal({
          title: '需要相册权限',
          content: '保存图片需授权「保存到相册」，请在设置中开启后重试。',
          confirmText: '去设置',
          success: (r) => {
            if (r.confirm) uni.openSetting({});
          },
        });
      } else {
        uni.showToast({ title: '保存失败', icon: 'none' });
      }
    },
  });
}

async function onShareSheetSelect(item: { name: string; value?: string }) {
  const v = item.value;
  if (v === 'poster') {
    uni.showLoading({ title: '生成中', mask: true });
    try {
      const path = await generatePosterImagePath();
      if (!path) {
        uni.showModal({
          title: '海报生成失败',
          content:
            '可稍后再试，或使用右上角「···」转发给好友。若多次失败，请检查微信与小程序基础库版本，并确认海报中二维码链接域名已在小程序后台配置。',
          showCancel: true,
          cancelText: '知道了',
          confirmText: '转发说明',
          success: (res) => {
            if (res.confirm) openFriendShareGuide();
          },
        });
        return;
      }
      offerPosterAfterGenerate(path);
    } finally {
      uni.hideLoading();
    }
    return;
  }
  if (v === 'friend') {
    openFriendShareGuide();
    return;
  }
  if (v === 'timeline') {
    openTimelineShareGuide();
    return;
  }
  if (v === 'copyLink') {
    const base = import.meta.env.VITE_H5_SHARE_BASE?.trim();
    if (!base) {
      uni.showToast({ title: '请在环境变量配置 VITE_H5_SHARE_BASE', icon: 'none' });
      return;
    }
    await copyH5ShareLink(base);
  }
}

const movementCount = ref(0);
/** `focusScore` 等，优先于本地估算 */
const focusScoreFromApi = ref<number | null>(null);
// “中道实践”进度（0~1）；`attachmentRatio` 或 `focusScore`
const harmonyProgress = ref(0.5);
const harmonyPercent = computed(() => Math.round(harmonyProgress.value));

const stabilityIndex = computed(() => {
  const r = reportFromApi.value;
  if (focusScoreFromApi.value != null) {
    return Math.max(0, Math.min(100, Math.round(focusScoreFromApi.value)));
  }
  if (r?.hrvScore != null && Number.isFinite(Number(r.hrvScore))) {
    return Math.max(0, Math.min(100, Math.round(Number(r.hrvScore))));
  }

  return Math.max(1, Math.min(99, Math.round((avgHeart.value + avgBreath.value) / 2)));
});

const stabilityCardTitle = computed(() => {
  const r = reportFromApi.value;
  if (r?.focusScore != null || focusScoreFromApi.value != null) return '专注指数';
  if (r?.hrvScore != null && Number.isFinite(Number(r.hrvScore))) return 'HRV 指数';
  return '安定指数';
});

const stabilityCardHint = computed(() => {
  const r = reportFromApi.value;
  if (r?.hrvSource === 'heartRate' || (r?.hrvScore != null && Number.isFinite(Number(r.hrvScore)))) {
    return '基于心率体动';
  }
  return '综合评估';
});

const reportSubtitle = computed(() => {
  const t = reportFromApi.value?.stabilityText?.trim();
  if (t) return `本次静坐：${t}`;
  const s = reportFromApi.value?.summaryText?.trim();
  if (s) return s;
  return '你的心律反映出一种深沉的晨雾——静谧、稳健且充满潜力。';
});

const movementCountDisplay = computed(() => {
  if (reportFromApi.value != null) {
    return `${movementCount.value} 次`;
  }
  return `${minHeart.value}-${maxHeart.value}`;
});

const secondaryTitle = computed(() => {
  const t = reportFromApi.value?.heartText?.trim();
  return t || '如雾般的韧性';
});

const sitCountLine = computed(() => {
  const { totalDays, totalHours, consecutiveDays, sitCount } = reportFromApi.value ?? {};
  if (totalDays != null && totalHours != null && consecutiveDays != null && sitCount != null) {
    return `累计冥想：${totalDays}天、总时长：${totalHours}小时、连续天数：${consecutiveDays}天`;
  }
  return '';
});

const midPathSummary = computed(() => {
  const r = reportFromApi.value;
  if (r?.relaxRatio != null && Number.isFinite(Number(r.relaxRatio))) {
    return `放松占比约 ${Math.round(Number(r.relaxRatio))}% · 和谐度 ${harmonyPercent.value}%`;
  }
  return `已达成 ${harmonyPercent.value}% 和谐度`;
});

/** 接口 `sections` 按 `index` 排序，供趋势图 X 轴与序列一致 */
const sortedReportSections = computed((): MeditationReportSection[] => {
  const secs = reportFromApi.value?.sections;
  if (!secs?.length) return [];
  return [...secs].sort((a, b) => {
    const ia = Number(a.index);
    const ib = Number(b.index);
    const na = Number.isFinite(ia) ? ia : 0;
    const nb = Number.isFinite(ib) ? ib : 0;
    return na - nb;
  });
});


/**
 * 将总「体动次数」近似拆到若干时间点，与兜底趋势图 6 个类目对齐。
 * @param total 总次数（非负整数）
 * @param len 数据点个数
 */
function distributeMovementAcrossPoints(total: number, len: number): number[] {
  if (len <= 0) return [];
  const t = Math.max(0, Math.floor(total));
  if (t === 0) return Array.from({ length: len }, () => 0);
  const base = Math.floor(t / len);
  let rem = t % len;
  const out: number[] = [];
  for (let i = 0; i < len; i++) {
    out.push(base + (i < rem ? 1 : 0));
  }
  return out;
}

const bodyTrendCategories = computed(() => {
  const secs = sortedReportSections.value;
  if (secs.length > 0) {
    return secs.map((s, i) => (s.index != null ? `段${s.index}` : `第${i + 1}段`));
  }
  return ['第1分', '第3分', '第6分', '第9分', '第12分', '结束'];
});

const bodyTrendSeries = computed(() => {
  const secs = sortedReportSections.value;
  if (secs.length > 0) {
    return [
      {
        name: '心率',
        index: 0,
        data: secs.map((s) => Number(s.avgHeartRate ?? 0))
      },
      {
        name: '呼吸',
        index: 0,
        data: secs.map((s) => Number(s.avgBreathRate ?? 0))
      },
      {
        name: '体动',
        index: 1,
        data: secs.map((s) => Math.max(0, Math.floor(Number(s.movementCount) || 0)))
      }
    ];
  }
  const heartSeed = [
    avgHeart.value + 6,
    avgHeart.value + 3,
    avgHeart.value + 1,
    avgHeart.value - 1,
    avgHeart.value,
    avgHeart.value - 2
  ];
  const breathSeed = [
    avgBreath.value + 2,
    avgBreath.value + 1,
    avgBreath.value,
    avgBreath.value - 1,
    avgBreath.value,
    avgBreath.value
  ];
  const movementSeed = distributeMovementAcrossPoints(movementCount.value, heartSeed.length);
  return [
    { name: '心率', index: 0, data: heartSeed },
    { name: '呼吸', index: 0, data: breathSeed },
    { name: '体动', index: 1, data: movementSeed }
  ];
});

const bodyTrendChartData = computed(() => ({
  categories: bodyTrendCategories.value,
  series: bodyTrendSeries.value
}));

const bodyTrendOpts = computed(() => {
  const useSections = sortedReportSections.value.length > 0;
  const yAxisSkin = {
    gridType: 'dash' as const,
    dashLength: 3,
    fontSize: 10,
    fontColor: '#7d7463'
  };
  const legend = {
    show: true,
    position: 'top' as const,
    float: 'left' as const,
    fontSize: 10
  };
  const xAxis = {
    disableGrid: true,
    fontSize: 10,
    fontColor: '#7d7463'
  };
  const extra = {
    line: {
      type: 'curve' as const,
      width: 2,
      activeType: 'hollow' as const
    }
  };

  if (useSections) {
    return {
      color: ['#705900', '#8ea4d2', '#c49a6c'],
      legend,
      padding: [15, 10, 0, 10],
      xAxis,
      yAxis: {
        ...yAxisSkin,
        data: [
          { min: 0, axisLine: false },
          { min: 0, position: 'right' as const, axisLine: false }
        ]
      },
      extra
    };
  }

  return {
    color: ['#705900', '#8ea4d2', '#c49a6c'],
    legend,
    padding: [15, 10, 0, 10],
    xAxis,
    yAxis: {
      ...yAxisSkin,
      data: [
        { min: 0, max: Math.max(120, maxHeart.value + 12), axisLine: false },
        { min: 0, position: 'right' as const, axisLine: false }
      ]
    },
    extra
  };
});

const elapsedMin = computed(() => Math.floor(elapsedSec.value / 60));
const elapsedRemainSec = computed(() => elapsedSec.value % 60);

function toNum(v: unknown, fallback: number) {
  const n = Number(v);
  if (Number.isNaN(n)) return fallback;
  return Math.round(n);
}

function applyReportToView(r: MeditationReport) {
  reportFromApi.value = r;
  const fs = Number(r.focusScore);
  focusScoreFromApi.value = Number.isFinite(fs) ? Math.round(fs) : null;
  elapsedSec.value = Math.floor(Number(r.totalDuration) || 0);
  const ar = Number(r.attachmentRatio);
  if (Number.isFinite(ar)) {
    harmonyProgress.value = Math.min(1, Math.max(0, ar));
  } else if (focusScoreFromApi.value != null) {
    harmonyProgress.value = Math.min(1, Math.max(0, focusScoreFromApi.value / 100));
  }
  if (r.avgHeartRate != null && Number.isFinite(Number(r.avgHeartRate))) {
    avgHeart.value = Number(r.avgHeartRate);
  }
  if (r.avgBreathRate != null && Number.isFinite(Number(r.avgBreathRate))) {
    avgBreath.value = Number(r.avgBreathRate);
  }
  maxHeart.value = Math.max(Math.ceil(avgHeart.value + 8), 80);
  minHeart.value = Math.max(0, Math.floor(avgHeart.value - 8));
  movementCount.value = Math.floor(Number(r.movementCount) || 0);
  void nextTick(() => drawCloudBridgeCanvas(harmonyProgress.value));
}

async function initReport(q: Record<string, unknown>) {
  duration.value = toNum(q.duration, 15);
  manualStop.value = String(q.manualStop || '0') === '1';
  trackTitle.value = decodeURIComponent(String(q.trackTitle || ''));

  const rawSid = q.sessionId;
  const sid = rawSid != null && String(rawSid) !== '' ? Number(rawSid) : NaN;
  urlSessionId.value = Number.isFinite(sid) && sid > 0 ? sid : null;

  if (Number.isFinite(sid) && sid > 0) {
    uni.showLoading({ title: '加载报告…', mask: true });
    try {
      const res = await fetchMeditationReportDetail({ sessionId: sid });
      const raw = unwrapApiData<unknown>(res);
      const data = parseMeditationReportDetailPayload(raw);
      if (data) {
        applyReportToView(data);
        return;
      }
    } catch (e) {
      console.error('fetchMeditationReportDetail', e);
    } finally {
      uni.hideLoading();
    }
  }

  const cached = meditationStore.consumeLastMeditationServerReport();
  if (cached) {
    const normalized = parseMeditationReportDetailPayload(cached as unknown) ?? cached;
    applyReportToView(normalized);
    return;
  }

  elapsedSec.value = toNum(q.elapsedSec, duration.value * 60);
  if (q.focusScore != null && String(q.focusScore) !== '') {
    focusScoreFromApi.value = toNum(q.focusScore, 0);
    harmonyProgress.value = Math.min(1, Math.max(0, focusScoreFromApi.value / 100));
  }
  avgHeart.value = toNum(q.avgHeart, 72);
  avgBreath.value = toNum(q.avgBreath, 12);
  maxHeart.value = toNum(q.maxHeart, avgHeart.value + 6);
  minHeart.value = toNum(q.minHeart, avgHeart.value - 6);
  void nextTick(() => drawCloudBridgeCanvas(harmonyProgress.value));
}

onLoad((query) => {
  void initReport((query || {}) as Record<string, unknown>);
});

function onBack() {
  navigateBack();
}

// 保留你原本“70%”展示逻辑：画图进度跟随该值
onReady(() => {
  drawCloudBridgeCanvas(harmonyProgress.value);
});
</script>

<style scoped lang="scss">
.float-soft {
  animation: meditation-float 6s ease-in-out infinite;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

.progress-anim {
  transition: width 0.35s ease;
}

.watercolor-blur {
  filter: blur(40px);
  opacity: 0.6;
}
</style>