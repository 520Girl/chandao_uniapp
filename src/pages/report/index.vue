<script setup lang="ts">
import { ArrowLeft, Share2, Info, TrendingUp, Calendar } from 'lucide-vue-next';
import { navigateBack } from '@/utils/navigation';

const onBack = () => {
  navigateBack();
};

const weeklyData = [
  { day: '周一', value: 65 },
  { day: '周二', value: 78 },
  { day: '周三', value: 82 },
  { day: '周四', value: 75 },
  { day: '周五', value: 88 },
  { day: '周六', value: 92 },
  { day: '周日', value: 85 },
];
</script>

<template>
  <view class="flex flex-col min-h-screen pb-32">
    <!-- Header -->
    <header class="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#f8f7f6] border-b border-[#d4af35]/5">
      <view @click="onBack" class="w-10 h-10 flex items-center justify-center rounded-full">
        <ArrowLeft :size="24" />
      </view>
      <h1 class="text-lg font-bold tracking-tight">安定报告</h1>
      <view class="w-10 h-10 flex items-center justify-center rounded-full">
        <Share2 :size="24" />
      </view>
    </header>

    <main class="flex-1 px-6 py-8 space-y-10">
      <!-- Summary -->
      <view class="text-center space-y-2 mb-10">
        <text class="text-[10px] uppercase tracking-[0.3em] text-[#d4af35] font-bold block">Daily Insight</text>
        <h1 class="text-3xl font-light leading-snug">
          今日，你照见 <text class="font-bold text-[#d4af35]">12</text> 次情绪如<text class="italic font-medium">云</text>。
        </h1>
        <view class="flex items-center justify-center gap-2 text-[#d4af35]/40 text-[10px] uppercase tracking-widest mt-4">
          <Calendar :size="12" />
          <text>2024年3月21日 · 春分</text>
        </view>
      </view>

      <!-- Emotional Cloud Map -->
      <view class="relative mb-10">
        <view class="bg-white rounded-[2.5rem] p-8 h-72 relative overflow-hidden border border-[#d4af35]/10 flex items-center justify-center shadow-sm">
          <!-- Animated Background Blobs (Static in Mini-program for better performance) -->
          <view class="absolute inset-0 flex items-center justify-center overflow-hidden opacity-30">
            <view class="absolute w-64 h-48 bg-blue-300/40 blur-[80px] rounded-full -translate-x-16 -translate-y-12" />
            <view class="absolute w-56 h-56 bg-red-300/30 blur-[80px] rounded-full translate-x-20 translate-y-16" />
            <view class="absolute w-40 h-40 bg-[#d4af35]/20 blur-[60px] rounded-full -translate-y-24 translate-x-12" />
          </view>
          
          <view class="relative z-10 text-center space-y-2">
            <view class="size-16 mx-auto bg-[#d4af35]/5 rounded-full flex items-center justify-center border border-[#d4af35]/10 mb-4">
              <TrendingUp :size="24" class="text-[#d4af35]" />
            </view>
            <text class="text-xs font-bold tracking-[0.3em] text-[#d4af35] uppercase block">情绪云图</text>
            <text class="text-[10px] text-[#d4af35]/40 italic tracking-widest block">内心天空的水墨画卷</text>
          </view>
          
          <!-- Info Button -->
          <view class="absolute bottom-6 right-6 text-[#d4af35]/20">
            <Info :size="16" />
          </view>
        </view>
      </view>

      <!-- Stability Index -->
      <view class="bg-white rounded-[2.5rem] p-8 border border-[#d4af35]/10 shadow-sm space-y-8 mb-10">
        <view class="flex justify-between items-start mb-6">
          <view class="space-y-1">
            <text class="text-[10px] font-bold tracking-[0.2em] text-[#d4af35] uppercase block">安定指数</text>
            <text class="text-2xl font-light tracking-tight block">如雾般的韧性</text>
          </view>
          <view class="text-right">
            <view class="flex items-baseline justify-end gap-1">
              <text class="text-4xl font-bold text-[#d4af35]">82</text>
              <text class="text-xs font-bold text-[#d4af35]/40">/ 100</text>
            </view>
            <text class="text-[10px] text-[#d4af35]/40 font-bold uppercase tracking-widest block mt-1">HRV 评分</text>
          </view>
        </view>

        <!-- Progress Bar -->
        <view class="space-y-4">
          <view class="relative h-14 w-full bg-[#d4af35]/5 rounded-full overflow-hidden flex items-center px-5 border border-[#d4af35]/5">
            <view 
              class="absolute left-0 top-0 h-full bg-[#d4af35]/20 rounded-r-full border-r-2 border-[#d4af35]/30"
              style="width: 82%"
            />
            <view class="relative z-10 w-full flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#d4af35]/60">
              <text>Stable</text>
              <text>82%</text>
            </view>
          </view>
          <text class="text-[11px] leading-relaxed text-[#d4af35]/70 italic px-2 block">
            “你的心律反映出一种深沉的晨雾——静谧、稳健且充满潜力。”
          </text>
        </view>
      </view>

      <!-- Weekly Trend -->
      <view class="bg-white rounded-[2.5rem] p-8 border border-[#d4af35]/10 shadow-sm space-y-6 mb-10">
        <view class="flex items-center justify-between mb-6">
          <text class="text-[10px] font-bold tracking-[0.2em] text-[#d4af35] uppercase block">周安定趋势</text>
          <text class="text-[10px] text-[#d4af35]/40 font-bold uppercase tracking-widest block">过去 7 天</text>
        </view>
        
        <view class="flex items-end justify-between h-32 px-2">
          <view v-for="item in weeklyData" :key="item.day" class="flex flex-col items-center gap-3">
            <view 
              class="w-2 bg-[#d4af35]/10 rounded-full relative overflow-hidden"
              :style="{ height: `${item.value}%` }"
            >
              <view 
                class="absolute bottom-0 left-0 w-full bg-[#d4af35]/40 rounded-full"
                :style="{ height: '40%' }"
              />
            </view>
            <text class="text-[9px] font-bold text-[#d4af35]/40 uppercase tracking-tighter block">{{ item.day }}</text>
          </view>
        </view>
      </view>

      <!-- Action Button -->
      <button class="w-full py-5 bg-[#d4af35] text-white rounded-3xl font-bold text-sm tracking-[0.2em] uppercase shadow-xl shadow-[#d4af35]/20">
        导出详细报告
      </button>
    </main>
  </view>
</template>
