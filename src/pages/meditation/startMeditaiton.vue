<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern meditation-running">
        <lcrBar :title="'正在禅修'" :leftIcon="'icon-arrow-left'" :handleClick="onTapStop" :type="'all'" />
        <view class="flex-grow flex flex-col items-center justify-center px-6">
            <!-- <view class="h-24"></view> -->
            <view class="relative flex items-center justify-center">
                <view
                    class="w-72 h-72 rounded-full border border-theme-12 flex items-center justify-center breathing-glow breath-ring">
                    <view class="absolute inset-0 rounded-full border-[4px] border-theme-10 opacity-60 breath-halo">
                    </view>
                    <view class="flex flex-col items-center justify-center heartbeat-core" :style="{ transform: `scale(${beatScale})` }">
                        <text class="font-headline text-6xl tracking-tighter text-on-surface mb-2 tabular-nums">{{ remainTimeText }}</text>
                        <text class="font-body text-sm tracking-[0.2em] text-on-surface-variant font-medium">{{ breathPhaseText }}</text>
                    </view>
                </view>
            </view>
            <view class="mt-20 flex gap-8">
                <view class="flex flex-col items-center space-y-1">
                    <text class="font-label text-[20rpx] tracking-[0.15em] text-outline uppercase">心跳</text>
                    <view class="bg-surface-container-low px-4 py-1.5 rounded-full flex items-center gap-2">
                        <text class="iconfont icon-heart-fill text-[32rpx] text-[#e500003b]"></text>
                        <text class="font-label text-[28rpx] text-on-surface-variant font-semibold tabular-nums">{{ currentHeartRate }} BPM</text>
                    </view>
                </view>
                <view class="flex flex-col items-center space-y-1">
                    <text class="font-label text-[20rpx] tracking-[0.15em] text-outline uppercase">体动</text>
                    <view class="bg-surface-container-low px-4 py-1.5 rounded-full flex items-center gap-2">
                        <text class="iconfont icon-wind text-[32rpx] theme-color-1"></text>
                        <text class="font-label text-[28rpx] text-on-surface-variant font-semibold tabular-nums">{{ currentBreathRate }} bpm</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="mt-auto px-8 pb-12 w-full flex flex-col space-y-8">
            <view class="flex items-end justify-between">
                <view class="space-y-1">
                    <view class="font-body text-[10px] tracking-widest text-outline uppercase">正在播放</view>
                    <view class="font-headline text-2xl text-on-surface italic">{{ trackTitle || '深夜觉察' }}</view>
                </view>
                <button
                    class="button-transition w-16 h-16 rounded-full glass-effect flex items-center justify-center shadow-lg "
                    @click="onTapStop">
                    <text class="iconfont icon-pause text-[80rpx] text-primary"></text>
                </button>
            </view>
            <view class="h-[4rpx] w-full bg-surface-container-highest/30 rounded-full overflow-hidden">
                <view class="h-full bg-theme-2 progress-anim" :style="{ width: `${progressPercent}%` }"></view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { getMeditationRealtime } from '@/assets/js/api/user';
import lcrBar from '@/components/lcrBar.vue';

type RealtimeStat = {
  heartRate: number;
  breathRate: number;
};

const targetMinutes = ref(15);
const trackId = ref('');
const trackTitle = ref('疗愈音频');
const sessionId = ref('');

const elapsedSec = ref(0);
const remainSec = ref(15 * 60);
const currentHeartRate = ref(72);
const currentBreathRate = ref(12);
const statSamples = ref<RealtimeStat[]>([]);

let timerId: ReturnType<typeof setInterval> | null = null;
let pullId: ReturnType<typeof setInterval> | null = null;
let ended = false;

const progressPercent = computed(() => {
  const total = Math.max(1, targetMinutes.value * 60);
  return Math.min(100, (elapsedSec.value / total) * 100);
});

const remainTimeText = computed(() => {
  const safe = Math.max(0, remainSec.value);
  const mm = String(Math.floor(safe / 60)).padStart(2, '0');
  const ss = String(safe % 60).padStart(2, '0');
  return `${mm}:${ss}`;
});

const elapsedMinuteText = computed(() => `已进行 ${Math.floor(elapsedSec.value / 60)} 分 ${elapsedSec.value % 60} 秒`);

const breathPhaseText = computed(() => {
  const cycle = elapsedSec.value % 8;
  if (cycle < 4) return '吸气';
  return '呼气';
});

const beatScale = computed(() => {
  const phase = (elapsedSec.value * currentHeartRate.value) % 60;
  return phase < 18 ? 1.05 : 1;
});

function toSafeInt(v: unknown, fallback: number) {
  const n = Number(v);
  if (Number.isNaN(n)) return fallback;
  return Math.max(1, Math.round(n));
}

function parseRealtimePayload(res: unknown): RealtimeStat | null {
  const body = (res || {}) as Record<string, unknown>;
  const d = (body.data ?? body) as Record<string, unknown>;
  const hr = Number(d.heartRate ?? d.heart ?? d.hr);
  const br = Number(d.breathRate ?? d.breath ?? d.rr);
  if (Number.isNaN(hr) || Number.isNaN(br)) return null;
  return {
    heartRate: Math.max(40, Math.min(180, Math.round(hr))),
    breathRate: Math.max(6, Math.min(40, Math.round(br)))
  };
}

function mockRealtime() {
  const hr = currentHeartRate.value + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 2));
  const br = currentBreathRate.value + (Math.random() > 0.5 ? 1 : -1);
  return {
    heartRate: Math.max(55, Math.min(95, hr)),
    breathRate: Math.max(8, Math.min(20, br))
  };
}

async function pullRealtime() {
  try {
    const res = await getMeditationRealtime({ sessionId: sessionId.value || undefined });
    const parsed = parseRealtimePayload(res);
    const latest = parsed || mockRealtime();
    currentHeartRate.value = latest.heartRate;
    currentBreathRate.value = latest.breathRate;
    statSamples.value.push(latest);
  } catch {
    const latest = mockRealtime();
    currentHeartRate.value = latest.heartRate;
    currentBreathRate.value = latest.breathRate;
    statSamples.value.push(latest);
  }
}

function getAvg(list: number[]) {
  if (!list.length) return 0;
  return Math.round(list.reduce((a, b) => a + b, 0) / list.length);
}

function endMeditation(manualStop: boolean) {
  if (ended) return;
  ended = true;
  if (timerId) clearInterval(timerId);
  if (pullId) clearInterval(pullId);

  const heartArr = statSamples.value.map((x) => x.heartRate);
  const breathArr = statSamples.value.map((x) => x.breathRate);
  const avgHeart = getAvg(heartArr) || currentHeartRate.value;
  const avgBreath = getAvg(breathArr) || currentBreathRate.value;
  const maxHeart = heartArr.length ? Math.max(...heartArr) : currentHeartRate.value;
  const minHeart = heartArr.length ? Math.min(...heartArr) : currentHeartRate.value;

  const query = [
    `duration=${targetMinutes.value}`,
    `elapsedSec=${elapsedSec.value}`,
    `avgHeart=${avgHeart}`,
    `avgBreath=${avgBreath}`,
    `maxHeart=${maxHeart}`,
    `minHeart=${minHeart}`,
    `manualStop=${manualStop ? 1 : 0}`,
    trackId.value ? `trackId=${encodeURIComponent(trackId.value)}` : '',
    trackTitle.value ? `trackTitle=${encodeURIComponent(trackTitle.value)}` : ''
  ]
    .filter(Boolean)
    .join('&');

  uni.redirectTo({
    url: `/pages/meditation/report?${query}`
  });
}

function onTapStop() {
  uni.showModal({
    title: '结束冥想',
    content: '确认结束本次冥想并生成报告吗？',
    success: (res) => {
      if (res.confirm) endMeditation(true);
    }
  });
}

onLoad((query) => {
  const q = query || {};
  targetMinutes.value = toSafeInt(q.duration, 15);
  remainSec.value = targetMinutes.value * 60;
  trackId.value = String(q.trackId || '');
  trackTitle.value = decodeURIComponent(String(q.trackTitle || '疗愈音频'));
  sessionId.value = String(q.sessionId || '');

  pullRealtime();
  timerId = setInterval(() => {
    elapsedSec.value += 1;
    remainSec.value = Math.max(0, targetMinutes.value * 60 - elapsedSec.value);
    if (remainSec.value <= 0) {
      endMeditation(false);
    }
  }, 1000);
  pullId = setInterval(() => {
    pullRealtime();
  }, 30000);
});

onUnload(() => {
  if (timerId) clearInterval(timerId);
  if (pullId) clearInterval(pullId);
});

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId);
  if (pullId) clearInterval(pullId);
});
</script>

<style scoped lang="scss">
.heartbeat-core {
  transition: transform 0.15s ease-out;
}

.progress-anim {
  transition: width 0.25s ease;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

@keyframes breath-ring {
  0%,
  100% {
    transform: scale(0.94);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.03);
    opacity: 0.85;
  }
}

@keyframes breath-halo {
  0%,
  100% {
    transform: scale(0.9);
    opacity: 0.38;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.breath-ring {
  animation: breath-ring 4s ease-in-out infinite;
}

.breath-halo {
  animation: breath-halo 4s ease-in-out infinite;
}
</style>