<template>
    <view class="flex flex-col min-h-screen theme-bg">
        <lcrBar :title="'免责声明'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
        <view class="max-w-[375px] mx-auto min-h-screen zen-gradient-bg pb-24">
            <!-- Hero view / Title -->
            <view class="px-8 pt-12 pb-8">
                <view class="font-label text-[30rpx] uppercase tracking-[0.2rem] text-primary mb-2">免责声明</view>
                <view class="font-headline text-4xl text-on-surface leading-tight mb-4">静心前行，风险自担。</view>
            </view>

            <!-- Content Area -->
            <view class="px-4 space-y-12">

                <!-- 简介 -->
                <view>
                    <view class="font-headline text-2xl text-on-surface mb-4">简介</view>
                    <view class="space-y-4 text-on-surface-variant font-body text-sm leading-[1.8] font-light">
                        <view>本小程序提供禅修、冥想、正念、呼吸引导等内容，仅作为日常身心放松、舒缓压力的辅助工具，不构成宗教服务、医疗服务或心理治疗服务。</view>
                        <view>使用本小程序，即表示您已阅读、理解并同意本免责声明全部内容。</view>
                    </view>
                </view>

                <!-- 适用人群与健康提示 -->
                <view class="p-6 rounded-2xl bg-theme-3 bg-surface-container-low border border-primary/10">
                    <view class="font-headline text-2xl text-on-surface mb-4">适用人群与健康提示</view>
                    <view class="space-y-6">
                        <view class="flex gap-4">
                            <view
                                class="h-10 w-10 shrink-0 bg-theme-2 rounded-full bg-primary-container flex items-center justify-center">
                                <text
                                    class="iconfont icon-tubiaozhizuomoban- text-[48rpx] text-on-primary-container"></text>
                            </view>
                            <view>
                                <view class="font-label text-xs uppercase tracking-widest text-primary mb-1">特殊人群</view>
                                <view class="font-body text-sm text-on-surface-variant leading-relaxed">
                                    孕妇、严重高血压、心脏病、癫痫、精神类疾病及身体不适者，请在专业医师指导下使用。
                                </view>
                            </view>
                        </view>

                        <view class="flex gap-4">
                            <view
                                class="h-10 w-10 shrink-0 bg-theme-2 rounded-full bg-tertiary-container flex items-center justify-center">
                                <text
                                    class="iconfont icon-surroundsound text-[48rpx] text-on-tertiary-container"></text>
                            </view>
                            <view>
                                <view class="font-label text-xs uppercase tracking-widest text-primary mb-1">练习安全</view>
                                <view class="font-body text-sm text-on-surface-variant leading-relaxed">
                                    练习中如出现头晕、胸闷、情绪不适等情况，请立即停止并休息，必要时及时就医。
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 责任声明 -->
                <view>
                    <view class="font-headline text-2xl text-on-surface mb-4">责任声明</view>
                    <view class="space-y-4 text-on-surface-variant font-body text-sm leading-[1.8] font-light">
                        <view>本平台不承担以下情形导致的任何责任：</view>
                        <view class="list-none space-y-3">
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>用户不当使用、自行操作失误所造成的身体或心理不适。</view>
                            </view>
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>未遵循提示，在不适宜的状态下强行练习所产生的风险。</view>
                            </view>
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>因个人设备、网络、第三方软件等问题导致的服务中断或数据异常。</view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 服务说明 -->
                <view
                    class="relative bg-theme-5 text-white overflow-hidden p-8 rounded-2xl bg-on-surface text-surface-container-lowest">
                    <view class="absolute -top-12 -right-12 w-32 h-32 bg-primary blur-[40px] opacity-20"></view>
                    <view class="font-headline text-2xl mb-4 relative z-10">服务说明</view>
                    <view class="font-body text-sm leading-relaxed opacity-80 relative z-10">
                        我们不承诺冥想效果、情绪改善或心理疗愈，所有内容仅供辅助放松使用。
                        平台将尽力维护服务稳定，但不对不可抗力、系统维护等不可控因素承担责任。
                    </view>
                    <view class="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                        <view class="iconfont icon-yuanlinyanghuxitong theme-color-1 text-tertiary-fixed"
                            style="font-variation-settings: 'FILL' 1;"></view>
                        <view class="font-label text-[10px] uppercase tracking-widest">静心 · 安全 · 正念</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script setup lang="ts">
import { navigateBack } from '@/utils/navigation';
import lcrBar from '@/components/lcrBar.vue';

const onBack = () => {
    navigateBack();
};
</script>
<style scoped lang="scss"></style>