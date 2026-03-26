<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
        <lcrBar :title="'隐私协议'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
        <view class="max-w-[375px] mx-auto min-h-screen zen-gradient-bg pb-24">
            <!-- Hero view / Title -->
            <view class="px-8 pt-12 pb-8">
                <view class="font-label text-[30rpx] uppercase tracking-[0.2rem] text-primary mb-2">法律文档</view>
                <view class="font-headline text-4xl text-on-surface leading-tight mb-4">您的宁静是我们的首要任务。</view>
                <view class="font-body text-sm text-on-surface-variant leading-relaxed">生效日期：2026年04月24日</view>
            </view>
            <!-- view Content Area -->
            <view class="px-4 space-y-12">
                <!-- Introduction view -->
                <view>
                    <view class="font-headline text-2xl text-on-surface mb-4">简介</view>
                    <view class="space-y-4 text-on-surface-variant font-body text-sm leading-[1.8] font-light">
                        <view>在 云隙 (Yunxi)，我们坚信隐私是数字健康的基础。本政策概述了我们如何收集、使用和保护您的氛围数据与冥想偏好。</view>
                        <view>使用云隙应用程序，即表示您同意本条款这一空灵手稿中所述的做法。</view>
                    </view>
                </view>
                <!-- Data Collection view -->
                <view class="p-6 rounded-2xl bg-theme-3 bg-surface-container-low border border-primary/10">
                    <view class="font-headline text-2xl text-on-surface mb-4">数据收集</view>
                    <view class="space-y-6">
                        <view class="flex gap-4">
                            <view
                                class="h-10 w-10 shrink-0 bg-theme-2 rounded-full bg-primary-container flex items-center justify-center">
                                <text class="iconfont icon-tubiaozhizuomoban- text-[48rpx] text-on-primary-container" data-icon="favorite">
                                    </text>
                            </view>
                            <view>
                                <view class="font-label text-xs uppercase tracking-widest text-primary mb-1">健康整合</view>
                                <view class="font-body text-sm text-on-surface-variant leading-relaxed">
                                    我们同步您的心率数据，以实时调整呼吸环的节奏。
                                </view>
                            </view>
                        </view>
                        <view class="flex gap-4">
                            <view
                                class="h-10 w-10 shrink-0 bg-theme-2 rounded-full bg-tertiary-container flex items-center justify-center">
                                <text class="iconfont icon-surroundsound text-[48rpx] text-on-tertiary-container"
                                    data-icon="surround_sound"></text>
                            </view>
                            <view>
                                <view class="font-label text-xs uppercase tracking-widest text-primary mb-1">声景</view>
                                <view class="font-body text-sm text-on-surface-variant leading-relaxed">
                                    我们追踪您偏好的环境频率，以策划个性化的听觉花园。</view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- Usage view -->
                <view>
                    <view class="font-headline text-2xl text-on-surface mb-4">我们如何使用您的数据</view>
                    <view class="space-y-4 text-on-surface-variant font-body text-sm leading-[1.8] font-light">
                        <view>我们不会将您的禅意时刻出售给第三方。您的数据仅用于：</view>
                        <view class="list-none space-y-3">
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>个性化“意如云影”生成式音频引擎。</view>
                            </view>
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>改进呼吸环签名的视觉反馈。</view>
                            </view>
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>为您生成每周统计数据，用于正念反思。</view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- Protection view -->
                <view class="relative bg-theme-5 text-white overflow-hidden p-8 rounded-2xl bg-on-surface text-surface-container-lowest">
                    <view class="absolute -top-12 -right-12 w-32 h-32 bg-primary blur-[40px] opacity-20"></view>
                    <view class="font-headline text-2xl mb-4 relative z-10">数据保护</view>
                    <view class="font-body text-sm leading-relaxed opacity-80 relative z-10">
                        您的个人统计数据使用行业标准协议加密。我们对待您的数字足迹，如同对待一场静修般虔诚。
                    </view>
                    <view class="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                        <view class="iconfont icon-yuanlinyanghuxitong theme-color-1  text-tertiary-fixed" data-icon="shield_with_heart"
                            style="font-variation-settings: 'FILL' 1;"></view>
                        <view class="font-label text-[10px] uppercase tracking-widest">端到端正念安全保护</view>
                    </view>
                </view>
                <!-- Rights view -->
                <view class="pb-12">
                    <view class="font-headline text-2xl text-on-surface mb-4">您的权利</view>
                    <view class="font-body text-sm text-on-surface-variant leading-[1.8] font-light mb-6">
                        您有权随时请求导出完整的冥想历史，或从我们的氛围中彻底清除您的账户。
                    </view>
                </view>
            </view>
            <view class="px-8 pt-0 pb-24 text-center">
                <p class="font-body text-xs text-outline mb-4">对我们殿堂的规则有疑问？</p>
                <a class="font-headline italic text-lg text-primary underline underline-offset-4 decoration-primary/30"
                    href="mailto:presence@yunxi.app">admin@yunxi.app</a>
            </view>
        </view>
    </view>
</template>
<script setup lang="ts">
import { ArrowLeft, MoreHorizontal } from 'lucide-vue-next';
import { navigateBack } from '@/utils/navigation';
import lcrBar from '@/components/lcrBar.vue';

const onBack = () => {
    navigateBack();
};
</script>
<style scoped lang="scss"></style>