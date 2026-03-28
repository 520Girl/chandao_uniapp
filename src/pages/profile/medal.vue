<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
      <lcrBar :title="'勋章管理'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
      <main class="flex-1 px-8 pt-12 pb-32 z-10">
      <view class="mb-10 text-center">
        <view class="font-label text-[20rpx] uppercase tracking-[0.2em] theme-color-6 mb-2">My Journey</view>
        <view class="font-headline italic text-[32rpx] theme-color-1">已收集 4 / 12 枚勋章</view>
      </view>
      <!-- Badge Grid -->
      <view class="grid grid-cols-2 gap-x-8 gap-y-12">
        <!-- Unlocked Badge 1 -->
        <view class="flex flex-col items-center gap-4 group">
          <view class="relative w-28 h-28 flex items-center justify-center">
            <view
              class="absolute inset-0 bg-tertiary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700">
            </view>
            <view
              class="relative w-20 h-20 rounded-full bg-gradient-to-br from-tertiary to-primary-container border-2 border-surface-container-lowest flex items-center justify-center badge-glow">
              <text class="iconfont icon-wind text-[40rpx] theme-color-1"
                style="font-variation-settings: 'FILL' 1;"></text>
            </view>
          </view>
          <view class="text-center">
            <text class="font-headline italic text-[28rpx] theme-color-5">一缕云</text>
            <view class="font-label text-[20rpx] theme-color-6 tracking-wider mt-1">初识心境</view>
          </view>
        </view>
        <!-- Unlocked Badge 2 -->
        <view class="flex flex-col items-center gap-4 group">
          <view class="relative w-28 h-28 flex items-center justify-center">
            <view
              class="absolute inset-0 bg-tertiary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700">
            </view>
            <view
              class="relative w-20 h-20 rounded-full bg-gradient-to-br from-tertiary to-primary-container border-2 border-surface-container-lowest flex items-center justify-center badge-glow">
              <text class="iconfont icon-wind text-[40rpx] theme-color-1"
                style="font-variation-settings: 'FILL' 1;"></text>
            </view>
          </view>
          <view class="text-center">
            <text class="font-headline italic text-[28rpx] theme-color-5">回归本心</text>
            <view class="font-label text-[20rpx] theme-color-6 tracking-wider mt-1">内心澄明</view>
          </view>
        </view>
        <!-- Unlocked Badge 3 -->
        <view class="flex flex-col items-center gap-4 group">
          <view class="relative w-28 h-28 flex items-center justify-center">
            <view
              class="absolute inset-0 bg-tertiary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700">
            </view>
            <view
              class="relative w-20 h-20 rounded-full bg-gradient-to-br from-tertiary to-primary-container border-2 border-surface-container-lowest flex items-center justify-center badge-glow">
              <text class="iconfont icon-wind text-[40rpx] theme-color-1"
                style="font-variation-settings: 'FILL' 1;"></text>
            </view>
          </view>
          <view class="text-center">
            <text class="font-headline italic text-[28rpx] theme-color-5">静谧森林</text>
            <view class="font-label text-[20rpx] theme-color-6 tracking-wider mt-1">持续冥想7天</view>
          </view>
        </view>
        <!-- Unlocked Badge 4 -->
        <view class="flex flex-col items-center gap-4 group">
          <view class="relative w-28 h-28 flex items-center justify-center">
            <view
              class="absolute inset-0 bg-tertiary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700">
            </view>
            <view
              class="relative w-20 h-20 rounded-full bg-gradient-to-br from-tertiary to-primary-container border-2 border-surface-container-lowest flex items-center justify-center badge-glow">
              <text class="iconfont icon-yun text-[40rpx] theme-color-1"
                style="font-variation-settings: 'FILL' 1;"></text>
            </view>
          </view>
          <view class="text-center">
            <text class="font-headline italic text-[28rpx] theme-color-5">行云流水</text>
            <view class="font-label text-[20rpx] theme-color-6 tracking-wider mt-1">平稳呼吸</view>
          </view>
        </view>
        <!-- Locked Badge 5 -->
        <view class="flex flex-col items-center gap-4 opacity-40">
          <view class="relative w-28 h-28 flex items-center justify-center">
            <view
              class="relative w-20 h-20 rounded-full bg-theme-13 border border-outline-variant/30 flex items-center justify-center">
              <text class="iconfont icon-lock text-[40rpx] theme-color-1"
                style="font-variation-settings: 'FILL' 1;"></text>
            </view>
          </view>
          <view class="text-center">
            <text class="font-headline italic text-[28rpx] theme-color-5">万物生息</text>
            <view class="font-label text-[20rpx] theme-color-6 tracking-wider mt-1">未达成</view>
          </view>
        </view>
        <!-- Locked Badge 6 -->
        <view class="flex flex-col items-center gap-4 opacity-40">
          <view class="relative w-28 h-28 flex items-center justify-center">
            <view
              class="relative w-20 h-20 rounded-full bg-theme-13 border border-outline-variant/30 flex items-center justify-center">
              <text class="iconfont icon-lock text-[40rpx] theme-color-1"
                style="font-variation-settings: 'FILL' 1;"></text>
            </view>
          </view>
          <view class="text-center">
            <text class="font-headline italic text-[28rpx] theme-color-5">月映千江</text>
            <view class="font-label text-[20rpx] theme-color-6 tracking-wider mt-1">未达成</view>
          </view>
        </view>
      </view>
      <!-- Detailed Stats Card -->
      <view
        class="mt-20 p-6 rounded-[24px] bg-theme-13 backdrop-blur-md border border-outline-variant/10 shadow-sm">
        <view class="flex items-center justify-between mb-4">
          <h3 class="font-headline italic text-primary text-xl">勋章详情</h3>
          <text class="iconfont icon-flare text-[40rpx] theme-color-1"
                style="font-variation-settings: 'FILL' 1;"></text>
        </view>
        <view class="font-body text-sm text-on-surface-variant leading-relaxed opacity-80">
          每一枚勋章都是您与内心对话的见证。继续您的冥想旅程，解锁更多属于您的静谧时刻。
        </view>
      </view>
    </main>
    </view>
  </template>
  <script setup lang="ts">
  import { navigateBack } from '@/utils/navigation';
  import lcrBar from '@/components/lcrBar.vue';
  
  const onBack = () => {
    navigateBack();
  };
  </script>
  <style scoped lang="scss">
  
  </style>