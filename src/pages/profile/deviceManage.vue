<template>
    <view class="flex flex-col min-h-screen theme-bg">
        <lcrBar :title="'设备管理'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
        <view class="w-full px-4 pt-10 pb-24 flex flex-col gap-8 flex-grow">
            <!-- Section Header -->
            <view class="space-y-1">
                <view class="font-headline text-2xl text-on-surface tracking-tight">我的设备</view>
                <view class="font-label text-xs text-on-surface-variant tracking-widest opacity-60 uppercase">
                    云息设备坚持内心，做自己
                </view>
            </view>
            <!-- Device List -->
            <view class="p-[46rpx] space-y-4">
                <view class="flex items-center justify-between mb-2">
                    <text
                        class="text-[24rpx] theme-color-1 font-bold uppercase tracking-widest text-primary">设备管理中心</text>
                    <text
                        class="theme-color-1 bg-theme-10 text-primary text-[20rpx] font-bold px-2 py-1 rounded-full">3个可用名额</text>
                </view>
                <!-- Device Slot 1: Yunxi Smart Mat Pro -->
                <view
                    class="bg-white p-4 rounded-[100rpx] border-theme flex items-center gap-4 hover:border-primary/40 transition-colors shadow-sm">
                    <view
                        class="size-14 bg-theme-10 rounded-full flex items-center justify-center text-primary shrink-0">
                        <text class="iconfont icon-grid-view text-[60rpx] theme-color-1"></text>
                    </view>
                    <view class="flex-1">
                        <text class="font-bold text-sm tracking-tight">第一个设备</text>
                        <view class="flex items-center gap-1.5">
                            <view class="size-2 bg-green-500 rounded-full animate-pulse"></view>
                            <text class="text-[11px] font-medium text-green-600 uppercase tracking-tighter">已连接</text>
                        </view>
                    </view>
                    <view class="theme-color-12 bg-white border-0 hover:none">
                        <text class="iconfont icon-setting text-[48rpx]"></text>
                    </view>
                </view>
                <!-- Device Slot 2: Heart Rate Sensor -->

                <view
                    class="bg-white p-4 rounded-[100rpx] border-theme-12 flex items-center gap-4 hover:border-primary/40 transition-colors shadow-sm">
                    <view
                        class="size-14 bg-theme-10 rounded-full flex items-center justify-center text-primary shrink-0">
                        <text class="iconfont icon-grid-view text-[60rpx] theme-color-1"></text>
                    </view>
                    <view class="flex-1">
                        <text class="font-bold text-sm tracking-tight">第一个设备</text>
                        <view class="flex items-center gap-1.5">
                            <view class="size-2 bg-theme-12 rounded-full animate-pulse"></view>
                            <text class="text-[11px] font-medium theme-color-12 uppercase tracking-tighter">待机</text>
                        </view>
                    </view>
                    <view class="theme-color-12 bg-white border-0 hover:none">
                        <text class="iconfont icon-setting text-[48rpx]"></text>
                    </view>
                </view>
                <!-- Device Slot 3: Empty Slot -->
                <view
                    class="border-2 border-dashed border-primary/20 p-4 rounded-[100rpx] flex items-center gap-4 bg-primary/5 group cursor-pointer hover:bg-primary/10 transition-colors">
                    <view
                        class="size-14 border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center text-primary/30 group-hover:text-primary shrink-0">
                        <text class="iconfont icon-add text-[38rpx] theme-color-12"></text>
                    </view>
                    <view class="flex-1">
                        <view
                            class="font-bold text-sm tracking-tight theme-color-12 group-hover:text-primary transition-colors">
                            绑定新设备</view>
                        <view class="text-[11px] theme-color-12 uppercase tracking-tighter">空插槽</view>
                    </view>
                    <text
                        class="iconfont icon-sensors theme-color-12 group-hover:text-primary transition-colors"></text>
                </view>
            </view>
            <!-- Hint Text -->
            <view class="mt-auto pt-10 text-center">
                <view class="font-label text-[10px] leading-relaxed text-on-surface-variant/40 tracking-[0.15em] px-4">
                    当前支持绑定最多3个设备<br />确保数据精准采集
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