<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
        <lcrBar :title="'用户协议'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
        <view class="max-w-[375px] mx-auto pb-24 px-8">
            <!-- Header view -->
            <view class="mt-12 mb-16">
                <view class="font-label text-[30rpx] uppercase tracking-[0.2rem] text-primary mb-2">文档版本 2.4</view>
                <view class="font-headline text-4xl leading-tight text-ink-cyan mb-6">服务条款与静谧协议</view>
                <view class="h-px w-12 bg-primary/40 mb-8"></view>
                <view class="font-body text-on-surface-variant leading-relaxed italic">
                    进入此空间，即表示您同意在 Yunxi 生态系统中培养正念并保护您的数字存在。
                </view>
            </view>
            <!-- Long-form Content Area -->
            <article class="space-y-12">
                <!-- view 1 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">01</view>
                        <view class="font-headline text-xl text-ink-cyan italic">神圣的存在</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>
                            Yunxi 被设计为一个内省的容器。通过访问我们的服务，您承认我们会以对待呼吸间静默的虔诚态度来处理您的数据。
                        </view>
                        <view>
                            我们不会出售您的宁静时刻。您的关注点仅属于您自己；我们的平台仅作为您意图的镜子。
                        </view>
                    </view>
                </view>
                <!-- Bento-style Highlight Card (Glassmorphism) -->
                <view class="p-6 rounded-2xl bg-theme-3 bg-white/40 backdrop-blur-xl border border-white/20 shadow-sm">
                    <view class="flex items-start gap-4 mb-3 ">
                        <view class="p-2 rounded-full bg-primary/10 text-primary">
                            <view class="iconfont icon-verifieduser text-[48rpx]" data-icon="verified_user"
                                style="font-variation-settings: 'FILL' 1;"></view>
                        </view>
                        <view>
                            <view class="font-label text-xs font-semibold uppercase tracking-wider text-ink-cyan">数据主权
                            </view>
                            <view class="font-body text-xs text-on-surface-variant mt-1">您保留对冥想期间收集的所有生物识别数据的完全所有权。</view>
                        </view>
                    </view>
                </view>
                <!-- view 2 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">02</view>
                        <view class="font-headline text-xl text-ink-cyan italic">临界责任</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>
                            用户应本着“无害”的精神使用平台。我们禁止任何破坏其他用户宁静或网络完整性的行为。
                        </view>
                        <view class="space-y-2 list-none">
                            <view class="flex items-start gap-2">
                                <view class="text-primary mt-1 text-[10px]">●</view>
                                <view>尊重公共课中的共享宁静。</view>
                            </view>
                            <view class="flex items-start gap-2">
                                <view class="text-primary mt-1 text-[10px]">●</view>
                                <view>维护您的精神日志的机密性。</view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- Visual Break/Abstract Element -->
                <view class="relative w-full h-32 rounded-3xl overflow-hidden my-12">
                    <view class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/30"></view>
                    <view
                        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-primary/20 animate-pulse">
                    </view>
                    <view
                        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md">
                    </view>
                    <image alt="" class="w-full h-full object-cover mix-blend-overlay opacity-20"
                        data-alt="Soft abstract light patterns and shadows"
                        src="/static/unnamed.png" />
                </view>
                <!-- view 3 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">03</view>
                        <view class="font-headline text-xl text-ink-cyan italic">无界更新</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed">
                        <view>
                            正如同自然在演变，这些条款也可能发生变化。我们将通过屏幕的光影通知您重大变更。继续使用该应用即表示您接受这些不断演化的节奏。
                        </view>
                    </view>
                </view>
            </article>
            <!-- Footer Action -->
            <view class="mt-24 mb-12 text-center">
                <button
                    class="w-full py-5 px-8 rounded-full bg-primary text-white font-label text-sm font-semibold uppercase tracking-[0.15rem] shadow-lg shadow-primary/20 button-transition">
                    我已了解并同意
                </button>
                <view class="mt-6 font-label text-[20rpx] text-on-surface-variant/60 uppercase tracking-widest">
                    最后修改：2023年10月14日
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