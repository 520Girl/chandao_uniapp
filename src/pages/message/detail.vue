<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
        <lcrBar :title="'消息详情'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
        <view class="flex-1 px-8 pt-4 pb-10">
            <!-- Meta view -->
            <view class="mb-12">
                <view class="flex items-center gap-4 mb-8">
                    <view class="w-12 h-12 rounded-full overflow-hidden bg-primary/5 ring-1 ring-primary/10">
                        <img alt="Sender Avatar" class="w-full h-full object-cover grayscale-[0.2]"
                            data-alt="Soft focused portrait of a calm woman in minimalist natural setting, gentle lighting, ethereal mood"
                            src="/static/770-800x600.jpg" />
                    </view>
                    <view>
                        <view class="font-label text-[20rpx] uppercase tracking-[0.2em] text-on-surface-variant">来自</view>
                        <h3 class="font-headline text-[36rpx] italic text-primary">云溪精舍</h3>
                    </view>
                </view>
                <view class="space-y-2">
                    <view class="font-label text-[20rpx] uppercase tracking-[0.3em] text-primary/70 font-medium">2023年9月24日
                    </view>
                    <h2 class="font-headline text-[72rpx] leading-tight text-on-surface pt-2">在声音中寻找寂静</h2>
                </view>
            </view>
            <!-- Message Body -->
            <view class="prose prose-slate max-w-none">
                <view
                    class="font-headline italic text-xl text-on-surface/70 leading-relaxed mb-10 first-letter:text-5xl first-letter:mr-3 first-letter:float-left first-letter:font-headline first-letter:text-primary/80">
                    风虽不语，却带走了山谷的歌声。今天，我们邀请你静坐于那声音之中。
                </view>
                <view class="space-y-8 text-on-surface/80 leading-[1.8] text-[15px] font-light">
                    <view>
                        在今天的集体练习中，我们注意到社区空间产生了一种美妙的共鸣。你们中的许多人正发现，“自我”并非一个固定点，而是一片变幻的云——正如笼罩在云溪峰上的薄雾。
                    </view>
                    <view>
                        我们已为您的空间添加了全新的环境音效：<span
                            class="text-primary italic font-headline">“情绪如云”</span>。它利用低频共振，帮助您在从动态到静止的过渡中稳固呼吸。
                    </view>
                    <view>
                        愿你呼吸绵长，心境轻盈。
                    </view>
                </view>
            </view>
            <!-- Decorative Visual Anchor -->
            <view class="mb-10 flex justify-center">
                <view class="w-px h-16 bg-gradient-to-b from-primary/20 to-transparent"></view>
            </view>
            <footer class="text-center">
                <view class="font-headline italic text-on-surface-variant/60 mb-16">致以慈经，<view></view>云溪向导</view>
            </footer>
        </view>
        <view class="fixed bottom-12 left-0 w-full px-8 flex justify-center pointer-events-none">
            <button
                class="pointer-events-auto bg-primary/20 text-primary border border-primary/20 font-label text-xs uppercase tracking-[0.2em] px-10 py-4 rounded-full shadow-sm hover:bg-primary/30 transition-all duration-300 active:scale-95 flex items-center gap-3">
                <span class="iconfont icon-reply text-[36rpx]"></span>
                回复精舍
            </button>
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