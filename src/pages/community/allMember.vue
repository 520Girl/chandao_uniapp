<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
        <lcrBar :title="'成员管理'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
        <view class=" px-6">
            <!-- Section Title -->
            <view class="mb-8 mt-8">
                <view class="text-2xl font-serif font-light tracking-tight text-on-surface mb-1 leading-tight italic ">
                    庇护所守护者</view>
                <text class="text-[12px] font-body text-on-surface-variant/60 tracking-wider">管理社区内的每一个宁静时刻</text>
            </view>
            <!-- Secondary Tabs: All / Management -->
            <view class="flex gap-8 border-b border-outline-variant/30 mb-8">
                <view
                    class="pb-3 text-sm font-label tracking-wider text-on-surface-variant/50 hover:text-primary transition-colors">全部</view>
                <view
                    class="pb-3 text-sm font-label tracking-wider text-primary border-b-2 border-primary font-bold">管理层</view>
            </view>
            <!-- Management List -->
            <view class="space-y-6">
                <!-- Member Card 1 -->
                <view class="group">
                    <view class="flex items-center justify-between mb-4">
                        <view class="flex items-center gap-4">
                            <view class="relative">
                                <view class="w-14 h-14 rounded-full p-0.5 border border-primary/30">
                                    <image alt="Elias Thorne" class="w-full h-full rounded-full object-cover"
                                        src="/static/770-800x600.jpg" />
                                </view>
                                <view
                                    class="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-surface flex items-center justify-center">
                                    <text class="icon-verified iconfont text-[20rpx] text-on-primary font-bold"
                                        style="font-variation-settings: 'FILL' 1;"></text>
                                </view>
                            </view>
                            <view>
                                <view class="font-headline text-lg text-on-surface">Elias Thorne</view>
                                <p class="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
                                    首席守护者</p>
                            </view>
                        </view>
                        <view
                            class="flex items-center gap-1 px-[24rpx] text-[24rpx] py-[12rpx] rounded-full bg-red-500/10 text-[#ef4444] font-bold transition-transform active:scale-95">
                            <text class="iconfont icon-trash-2 text-[24rpx]"></text> 删除
                        </view>
                    </view>
                    <view class="flex gap-2 pl-[72px]">
                        <text
                            class="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-label text-on-surface-variant">版主</text>
                        <text
                            class="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-label text-on-surface-variant">全球视野</text>
                    </view>
                </view>
            </view>
            <!-- Action Area -->
            <view
                class="mt-12 p-6 bg-gradient-to-br from-surface-container-low to-surface-variant/20 rounded-[32px] border border-white/40 shadow-sm text-center">
                <view class="font-headline text-xl italic text-on-surface mb-2">扩大我们的圈子</view>
                <view class="font-body text-sm text-on-surface-variant leading-relaxed mb-6">邀请志同道合的伙伴，共同守护我们共享空间的宁静。</view>
                <view
                    class="address-card bg-theme-12 theme-color-6 w-full py-4 rounded-full bg-primary-container text-on-primary-container font-label tracking-[0.1rem] text-xs font-bold shadow-md shadow-primary/10 active:scale-95 transition-transform">
                    邀请守护者
                </view>
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