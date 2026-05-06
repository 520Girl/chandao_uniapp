<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern overflow-hidden">
    <lcrBar :title="'共修等待室'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'no'" />

    <!-- Main scene -->
    <view class="flex flex-col items-center justify-start pt-6 pb-4 px-6 relative">

      <!-- Subtitle -->
      <view class="text-center mb-10">
        <view class="font-serif italic text-4xl text-on-surface mb-2">活动标题</view>
        <text class="font-label text-[20rpx] uppercase tracking-[0.35rem] theme-color-6">灵动流转版</text>
      </view>

      <!-- Avatar Orbit Scene -->
      <view class="relative w-full" style="height: 600rpx;">

        <!-- Ripple rings behind center -->
        <view class="ripple-ring ripple-1" />
        <view class="ripple-ring ripple-2" />
        <view class="ripple-ring ripple-3" />

        <!-- Center orb -->
        <view class="center-orb">
            <view class="flex justify-center items-end flex-row" style="gap: 4rpx;">
                <text class="block font-headline text-[80rpx] italic theme-color-1 leading-none">12</text>
                <text class="block font-headline text-[30rpx] italic theme-color-1 leading-none">/20</text>
            </view>
          
          <text class="font-label text-[18rpx] tracking-[0.25rem] theme-color-6 uppercase">入息等待</text>
        </view>

        <!-- Seat 1: Top Right -->
        <view class="seat seat-tr float-anim-1">
          <view class="seat-avatar-wrap seat-sm border-theme-color-2">
            <image class="w-full h-full rounded-full" src="/static/logo.png" mode="aspectFill" />
          </view>
          <text class="block text-center font-label text-[18rpx] theme-color-6 uppercase tracking-widest mt-1">Quiet Soul</text>
        </view>

        <!-- Seat 2: Bottom Left -->
        <view class="seat seat-bl float-anim-2">
          <view class="seat-avatar-wrap seat-md border-theme-1">
            <image class="w-full h-full rounded-full" src="/static/logo.png" mode="aspectFill" />
          </view>
        </view>

        <!-- Seat 3: Top Left -->
        <view class="seat seat-tl float-anim-3">
          <view class="seat-avatar-wrap seat-xs opacity-70 border-theme-color-3">
            <image class="w-full h-full rounded-full" src="/static/logo.png" mode="aspectFill" />
          </view>
        </view>

        <!-- Seat 4: Mid Right (YOU) -->
        <view class="seat seat-mr float-anim-4">
          <view class="relative">
            <view class="seat-avatar-wrap seat-lg border-theme-1 shadow-gold">
              <image class="w-full h-full rounded-full" src="/static/logo.png" mode="aspectFill" />
            </view>
            <view class="you-badge">
              <text class="font-label text-[16rpx] text-white tracking-widest">YOU</text>
            </view>
          </view>
        </view>

        <!-- Decor line -->
        <view class="absolute top-0 left-1/3 w-[2rpx] h-[100rpx] decor-line" />
        <view class="absolute bottom-[80rpx] right-1/3 w-[140rpx] h-[140rpx] rounded-full decor-circle" />
      </view>

      <!-- Quote -->
      <view class="mt-6 px-6 text-center">
        <text class="font-headline italic text-[28rpx] theme-color-7 leading-relaxed">
          "流转的是时间，静止的是心。{{ "\n" }}在此共处，即便无言，亦有回响。"
        </text>
      </view>
    </view>

    <!-- Bottom Control Panel -->
    <view class="control-panel mt-4 mx-4">
      <view class="flex flex-col" style="gap: 32rpx;">

        <!-- Music Player -->
        <view class="flex items-center justify-between">
          <view class="flex items-center" style="gap: 24rpx;">
            <!-- Waveform icon -->
            <view class="eq-icon-wrap">
              <text class="iconfont icon-bofang theme-color-1 text-[40rpx]" />
            </view>
            <view>
              <text class="block font-label text-[20rpx] tracking-widest theme-color-5 uppercase font-bold">AMIDST CLOUDS</text>
              <text class="block font-headline italic text-[28rpx] theme-color-1">灵动禅韵</text>
            </view>
          </view>

          <!-- Playback controls -->
          <view class="flex items-center" style="gap: 16rpx;">
            <view class="ctrl-btn-sm" @tap="onPrev">
              <text class="iconfont icon-prev theme-color-1 text-[36rpx]" />
            </view>
            <view class="ctrl-btn-play" @tap="onPlay">
              <text class="iconfont icon-daochu1024-15 text-white text-[36rpx]" />
            </view>
            <view class="ctrl-btn-sm" @tap="onNext">
              <text class="iconfont icon-next theme-color-1 text-[36rpx]" />
            </view>
          </view>
        </view>

        <!-- CTA Countdown -->
        <view class="cta-btn" @tap="onStartNow">
          <text class="font-label text-[24rpx] tracking-[0.3rem] theme-color-5 uppercase font-bold">START IN {{ countdownText }}</text>
          <text class="iconfont icon-nest_clock_farsight_analog_24dp_595959_FILL0_wght4 theme-color-6 text-[32rpx]" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { navigateBack } from "@/utils/navigation";
import lcrBar from "@/components/lcrBar.vue";

const countdownSec = ref(4 * 60 + 52);

let timer: ReturnType<typeof setInterval> | null = null;

const countdownText = computed(() => {
  const m = Math.floor(countdownSec.value / 60);
  const s = countdownSec.value % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
});

onMounted(() => {
  timer = setInterval(() => {
    if (countdownSec.value > 0) countdownSec.value--;
    else clearInterval(timer!);
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const onBack = () => navigateBack();
const onPrev = () => {};
const onPlay = () => {};
const onNext = () => {};
const onStartNow = () => {};
const onInvite = () => {};
</script>

<style scoped lang="scss">
/* ─── Center orb ─────────────────────────────────────── */
.center-orb {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 260rpx;
  height: 260rpx;
  border-radius: 9999px;
  background: rgba(212, 175, 53, 0.08);
  border: 2rpx solid rgba(212, 175, 53, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 80rpx rgba(212, 175, 53, 0.15), inset 0 0 40rpx rgba(212, 175, 53, 0.06);
}

/* ─── Ripple rings ───────────────────────────────────── */
.ripple-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  border: 1rpx solid rgba(212, 175, 53, 0.2);
  animation: ripple 3s ease-out infinite;
}
.ripple-1 { width: 300rpx; height: 300rpx; animation-delay: 0s; }
.ripple-2 { width: 440rpx; height: 440rpx; animation-delay: 0.8s; }
.ripple-3 { width: 580rpx; height: 580rpx; animation-delay: 1.6s; }

@keyframes ripple {
  0%   { opacity: 0.6; transform: translate(-50%, -50%) scale(0.95); }
  100% { opacity: 0;   transform: translate(-50%, -50%) scale(1.08); }
}

/* ─── Seats ──────────────────────────────────────────── */
.seat {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.seat-tr { top: 32rpx;  right: 60rpx; }
.seat-bl { bottom: 64rpx; left: 24rpx; }
.seat-tl { top: 80rpx;  left: 48rpx; }
.seat-mr { top: 50%;    right: 16rpx; transform: translateY(-50%); }

/* ─── Avatar wrappers ────────────────────────────────── */
.seat-avatar-wrap {
  border-radius: 9999px;
  border-width: 3rpx;
  border-style: solid;
  padding: 3rpx;
  overflow: hidden;
  background: rgba(248, 247, 246, 0.9);
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.10);
}
.seat-xs { width: 96rpx;  height: 96rpx; }
.seat-sm { width: 112rpx; height: 112rpx; }
.seat-md { width: 128rpx; height: 128rpx; }
.seat-lg { width: 160rpx; height: 160rpx; }

.border-theme-1     { border-color: #d4af35; }
.border-theme-color-2 { border-color: #DABB53; }
.border-theme-color-3 { border-color: #F0E8CF; }

.shadow-gold { box-shadow: 0 0 40rpx rgba(212,175,53,0.35), 0 8rpx 32rpx rgba(0,0,0,0.12); }

/* ─── YOU badge ──────────────────────────────────────── */
.you-badge {
  position: absolute;
  bottom: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  background: #d4af35;
  border-radius: 9999px;
  padding: 4rpx 20rpx;
}

/* ─── Float animations ───────────────────────────────── */
.float-anim-1 { animation: float1 4s ease-in-out infinite; }
.float-anim-2 { animation: float2 5s ease-in-out infinite; }
.float-anim-3 { animation: float3 6s ease-in-out infinite; }
.float-anim-4 { animation: float4 4.5s ease-in-out infinite; }

@keyframes float1 {
  0%, 100% { transform: translate(0, 0); }
  50%       { transform: translate(-6rpx, -14rpx); }
}
@keyframes float2 {
  0%, 100% { transform: translate(0, 0); }
  50%       { transform: translate(10rpx, -10rpx); }
}
@keyframes float3 {
  0%, 100% { transform: translate(0, 0); }
  50%       { transform: translate(8rpx, 12rpx); }
}
@keyframes float4 {
  0%, 100% { transform: translateY(-50%); }
  50%       { transform: translateY(calc(-50% - 10rpx)); }
}

/* ─── Decor elements ─────────────────────────────────── */
.decor-line {
  background: linear-gradient(to bottom, rgba(212,175,53,0.3), transparent);
}
.decor-circle {
  border: 1rpx solid rgba(212,175,53,0.08);
}

/* ─── Bottom control panel ───────────────────────────── */
.control-panel {
  background: rgba(248, 247, 246, 0.85);
  border: 1rpx solid rgba(212, 175, 53, 0.25);
  border-radius: 48rpx;
  padding: 40rpx 44rpx;
  box-shadow: 0 32rpx 80rpx rgba(112, 89, 0, 0.12);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* ─── Eq icon wrap ───────────────────────────────────── */
.eq-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  background: rgba(212, 175, 53, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ─── Playback controls ──────────────────────────────── */
.ctrl-btn-sm {
  width: 64rpx;
  height: 64rpx;
  border-radius: 9999px;
  background: rgba(212, 175, 53, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ctrl-btn-play {
  width: 80rpx;
  height: 80rpx;
  border-radius: 9999px;
  background: #d4af35;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(212, 175, 53, 0.4);
}

/* ─── CTA button ─────────────────────────────────────── */
.cta-btn {
  width: 100%;
  border-radius: 9999px;
  background: rgba(212, 175, 53, 0.08);
  border: 1rpx solid rgba(212, 175, 53, 0.3);
  padding: 24rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  transition: background 0.2s;
  &:active { background: rgba(212, 175, 53, 0.18); }
}

/* ─── FAB ────────────────────────────────────────────── */
.fab {
  position: fixed;
  bottom: calc(96rpx + 200rpx);
  right: 40rpx;
  z-index: 50;
  width: 112rpx;
  height: 112rpx;
  border-radius: 9999px;
  background: #d4af35;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 40rpx rgba(212, 175, 53, 0.45);
  &:active { transform: scale(0.92); }
}
</style>