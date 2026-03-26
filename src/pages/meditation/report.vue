<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
        <lcrBar :title="'禅修报告'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
        <view class="px-8 pt-10 pb-6 text-center">
            <view class="theme-color-5 text-[60rpx] font-medium leading-snug">
                今日，你照见 <text class="font-bold text-primary">{{ elapsedMin }}</text> 分 {{ elapsedRemainSec }} 秒
                情绪如<text class="italic font-medium">云</text>
            </view>
        </view>
        <view class="relative px-6 py-4">
            <view
                class="bg-white/40 rounded-[80rpx] p-6 h-64 relative overflow-hidden border border-primary/5 flex items-center justify-center float-soft">
                <view class="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <view
                        class="absolute w-40 h-24 bg-blue-300/40 watercolor-blur cloud-shape -translate-x-12 -translate-y-8">
                    </view>
                    <view
                        class="absolute w-32 h-20 bg-blue-200/50 watercolor-blur cloud-shape -translate-x-20 translate-y-4">
                    </view>
                    <view
                        class="absolute w-36 h-28 bg-red-300/30 watercolor-blur cloud-shape translate-x-16 translate-y-10">
                    </view>
                    <view
                        class="absolute w-24 h-24 bg-red-400/20 watercolor-blur cloud-shape translate-x-10 -translate-y-12">
                    </view>
                </view>
                <view class="relative z-10 text-center">
                    <view class="text-[24rpx] font-bold tracking-[0.1em] text-primary/80 mb-1 uppercase">情绪云图</view>
                    <view class="text-[20rpx] text-[#3c3728]/60 italic">{{ manualStop ? '手动结束，本次觉察已记录' : '自然完成，状态平稳收束' }}
                    </view>
                </view>
            </view>
        </view>
        <view class="px-6 py-4">
            <view class="bg-white/40 rounded-[80rpx] p-5 border border-primary/5">
                <view class="flex justify-between items-end mb-4">
                    <view>
                        <view class="text-[24rpx] font-bold tracking-[0.1em] text-primary/80 uppercase">安定指数</view>
                        <p class="text-[32rpx] font-light mt-1 text-[#3c3728]">如雾般的韧性</p>
                    </view>
                    <view class="text-right">
                        <text class="text-2xl font-bold text-primary">{{ Math.max(1, Math.min(99, Math.round((avgHeart +
                            avgBreath) / 2))) }}</text>
                        <text class="text-[10px] text-[#3c3728]/50 block uppercase">HRV 评分</text>
                    </view>
                </view>
                <view class="relative h-12 w-full bg-[#eeeae3] rounded-full overflow-hidden flex items-center">
                    <view
                        class="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 opacity-60">
                    </view>
                    <view
                        class="absolute h-full bg-primary/20 backdrop-blur-sm rounded-r-full border-r-2 border-primary/30 progress-anim"
                        :style="{ width: `${Math.max(10, Math.min(100, Math.round((avgHeart + avgBreath) / 2)))}%` }">
                    </view>
                    <view class="relative w-full flex justify-between px-4 z-10">
                        <text class="text-[9px] uppercase font-bold text-[#3c3728]/40">薄</text>
                        <text class="text-[9px] uppercase font-bold text-[#3c3728]/60 italic">当前厚度</text>
                        <text class="text-[9px] uppercase font-bold text-[#3c3728]/40">厚</text>
                    </view>
                </view>
                <view class="mt-3 text-[11px] leading-relaxed text-[#3c3728]/70 italic">你的心律反映出一种深沉的晨雾——静谧、稳健且充满潜力。</view>

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
                        <view class="text-[20rpx] text-[#3c3728]/50 uppercase tracking-tighter">体动</view>
                        <view class="text-[28rpx] font-bold text-[#3c3728] tabular-nums">{{ minHeart }}-{{ maxHeart }}</view>
                    </view>
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
                            <canvas
                                id="cloudBridgeCanvas"
                                canvas-id="cloudBridgeCanvas"
                                type="2d"
                                class="w-full h-[96rpx] overflow-visible"
                            />
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
                        <view class="text-[26rpx] font-medium text-[#3c3728]">已达成 70% 和谐度</view>
                        <view class="text-[22rpx] text-[#3c3728]/60 mt-1">今日 6 次冥想已完成 4 次</view>
                    </view>
                </view>
            </view>
        <view class="fixed bottom-24 right-8 z-20">
            <button
                class="size-14 bg-theme-2 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
                @click="openShareTip">
                <text class="iconfont icon-share text-[70rpx]"></text>
            </button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { navigateBack } from '@/utils/navigation';
import lcrBar from '@/components/lcrBar.vue';
import { drawCloudBridgeCanvas } from '@/utils/common';

const duration = ref(15);
const elapsedSec = ref(0);
const avgHeart = ref(72);
const avgBreath = ref(12);
const maxHeart = ref(78);
const minHeart = ref(66);
const manualStop = ref(false);
const trackTitle = ref('');
// “中道实践”进度（0~1），后续可替换为接口返回值
const harmonyProgress = ref(0.5);
const harmonyPercent = computed(() => Math.round(harmonyProgress.value * 100));

const elapsedMin = computed(() => Math.floor(elapsedSec.value / 60));
const elapsedRemainSec = computed(() => elapsedSec.value % 60);

function toNum(v: unknown, fallback: number) {
    const n = Number(v);
    if (Number.isNaN(n)) return fallback;
    return Math.round(n);
}

onLoad((query) => {
    const q = query || {};
    duration.value = toNum(q.duration, 15);
    elapsedSec.value = toNum(q.elapsedSec, duration.value * 60);
    avgHeart.value = toNum(q.avgHeart, 72);
    avgBreath.value = toNum(q.avgBreath, 12);
    maxHeart.value = toNum(q.maxHeart, avgHeart.value + 6);
    minHeart.value = toNum(q.minHeart, avgHeart.value - 6);
    manualStop.value = String(q.manualStop || '0') === '1';
    trackTitle.value = decodeURIComponent(String(q.trackTitle || ''));
});

function onBack() {
    navigateBack();
}

function openShareTip() {
    uni.showModal({
        title: '分享说明',
        content:
            '点击右上角“...”即可分享给好友；若当前基础库支持，可在同入口中分享到朋友圈。',
        showCancel: false
    });
}

onShareAppMessage(() => {
    return {
        title: `我完成了 ${elapsedMin.value} 分冥想，平均心率 ${avgHeart.value} BPM`,
        path: `/pages/meditation/report?duration=${duration.value}&elapsedSec=${elapsedSec.value}&avgHeart=${avgHeart.value}&avgBreath=${avgBreath.value}&maxHeart=${maxHeart.value}&minHeart=${minHeart.value}&manualStop=${manualStop.value ? 1 : 0}&trackTitle=${encodeURIComponent(trackTitle.value)}`
    };
});

onShareTimeline(() => {
    return {
        title: `冥想 ${elapsedMin.value} 分钟｜平均心率 ${avgHeart.value} BPM`,
        query: `duration=${duration.value}&elapsedSec=${elapsedSec.value}&avgHeart=${avgHeart.value}&avgBreath=${avgBreath.value}`
    };
});

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

.watercolor-blur{
    filter: blur(40px);
    opacity: 0.6;
}

</style>