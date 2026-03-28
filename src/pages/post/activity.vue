<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
      <lcrBar :title="'活动详情'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
      <view class="px-6  pb-24">
        <!-- view: Theme (Editable) -->
        <view class="mt-8 mb-12">
            <view class="flex items-center gap-2 mb-4">
                <view class="w-1 h-4 bg-primary rounded-full"></view>
                <view class="text-primary text-xs uppercase tracking-widest font-semibold">活动灵魂</view>
            </view>
            <label class="block group">
                <text class="text-[#918355] text-sm font-light mb-2 block">点击描绘活动主题</text>
                <view class="relative">
                    <input
                        class="theme-color-5 w-full h-[100rpx] bg-transparent border-0 border-b border-[#e5e0d2] dark:border-[#4a4538] focus:border-primary focus:ring-0 text-2xl font-light py-2 px-0 placeholder:text-[#d1cdc2] transition-colors"
                        placeholder="输入一个诗意的主题..." type="text" value="林间听风：初秋茶叙" />
                    <text
                        class="iconfont icon-Edit absolute right-0 top-1/2 -translate-y-1/2 text-[#918355] text-xl opacity-0 group-hover:opacity-100 transition-opacity"></text>
                </view>
            </label>
        </view>
        <!-- view: Time (Editable) -->
        <view class="mb-12">
            <view
                class="flex items-center justify-between p-3 bg-white/40 dark:bg-white/5 rounded-lg border border-white/60 dark:border-white/5 shadow-sm">
                <view class="flex items-center gap-4">
                    <view class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <text class="iconfont icon-calendar-today text-[48rpx] theme-color-1"></text>
                    </view>
                    <view>
                        <view class="text-[#918355] text-xs font-medium tracking-wide">时光约定</view>
                        <view class="text-[#1a170f] dark:text-[#fbfbf9] text-base">2023年10月20日 14:00</view>
                    </view>
                </view>
                <view class="text-primary cursor-pointer hover:scale-110 transition-transform ">
                    <text class="iconfont icon-lishidianjihou text-[48rpx] theme-color-1"></text>
                </view>
            </view>
        </view>
        <!-- view: Location (Static) -->
        <view class="mb-12">
            <view class="flex items-start gap-4 px-2">
                <view class="size-12 shrink-0 flex items-center justify-center text-[#918355]">
                    <text class="iconfont icon-MapPin text-[49rpx] theme-color-1"></text>
                </view>
                <view class="flex-1 border-l border-[#e5e0d2] dark:border-[#4a4538] pl-6 pb-2">
                    <view class="text-[#918355] text-xs font-medium tracking-wide mb-1">静谧之地</view>
                    <view class="theme-color-5 dark:text-[#fbfbf9] text-base leading-relaxed">杭州市西湖区灵隐街道<br />法喜寺后山·竹间茶室
                    </view>
                </view>
            </view>
        </view>
        <!-- view: Content Style (Editable) -->
        <view class="mb-16">
            <view class="flex items-center gap-2 mb-6">
                <view class="w-1 h-4 bg-primary rounded-full"></view>
                <view class="text-primary text-xs uppercase tracking-widest font-semibold">美学范围</view>
            </view>
            <view class="bg-primary/5 dark:bg-primary/10 p-8 rounded-lg relative overflow-hidden">
                <!-- Decorative element -->
                <view class="absolute -right-4 -top-4 text-primary/10 select-none">
                    <text class="icon-auto_awesome iconfont text-8xl"></text>
                </view>
                <label class="block">
                    <text class="text-[#918355] text-sm font-light mb-4 block">定义内容意境</text>
                    <textarea
                        class="theme-color-5 w-full bg-transparent border-0 focus:ring-0  dark:text-[#fbfbf9] font-light leading-relaxed p-0 resize-none h-32 placeholder:text-[#d1cdc2]"
                        placeholder="描述您期望的活动氛围或视觉风格..." v-model="activityData.content"></textarea>
                </label>
            </view>
        </view>
        <!-- Action Button -->
        <view class="fixed bottom-10 left-0 right-0 px-8 flex justify-center pointer-events-none">
            <button
                class="pointer-events-auto bg-primary text-white px-12 py-4 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                <text class="text-sm font-medium tracking-[0.2em] ml-2">保存意境</text>
                <text class="iconfont icon-done-all text-lg"></text>
            </button>
        </view>
    </view>
    <!-- Footer decoration -->
    <view class="text-center py-12 opacity-20 pointer-events-none">
        <view class="inline-block w-12 h-[1px] bg-primary align-middle"></view>
        <text class="mx-4 text-primary text-[10px] tracking-[0.5em] uppercase">Poetic Life</text>
        <view class="inline-block w-12 h-[1px] bg-primary align-middle"></view>
    </view>
    </view>
  </template>
  <script setup lang="ts">
  import { navigateBack } from '@/utils/navigation';
  import lcrBar from '@/components/lcrBar.vue';
  
  const activityData = ref({
    title: '活动1',
    time: '2023-01-01',
    location: '活动地点1',
    content: '白墙黛瓦，琴声悠扬。以宋代极简美学为底色，点缀青苔与枯木，让每一处留白都充满叙事感。穿着以素色棉麻为主，在烟雨蒙蒙中找寻内心的宁静。',
  });
  const onBack = () => {
    navigateBack();
  };
  </script>
  <style scoped lang="scss">
  
  </style>