<script setup lang="ts">
import { ArrowLeft, Share2, Trophy } from 'lucide-vue-next';
import { navigateBack } from '@/utils/navigation';

const onBack = () => {
  navigateBack();
};

const leaderboard = [
  { rank: 2, name: 'Elena Rose', pts: '1,280', img: 'rank2', color: 'border-slate-200', bg: 'bg-slate-400' },
  { rank: 1, name: '禅定大师 Kai', pts: '1,450', img: 'rank1', color: 'border-[#d4af35]', bg: 'bg-[#d4af35]', main: true },
  { rank: 3, name: 'Marcus V.', pts: '1,140', img: 'rank3', color: 'border-amber-600', bg: 'bg-amber-700' },
];
</script>

<template>
  <view class="flex flex-col min-h-screen pb-32">
    <header class="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#f8f7f6] border-b border-[#d4af35]/5">
      <view @click="onBack" class="w-10 h-10 flex items-center justify-center rounded-full">
        <ArrowLeft :size="24" />
      </view>
      <h1 class="text-lg font-bold tracking-tight">荣誉榜</h1>
      <view class="w-10 h-10 flex items-center justify-center rounded-full">
        <Share2 :size="24" />
      </view>
    </header>
    <main class="flex-1 px-4 py-6 space-y-8">
      <h2 class="text-2xl font-extrabold tracking-tight">安定指数排行榜</h2>
      <view class="flex items-end justify-center gap-4 h-48 mt-12 mb-10">
        <view v-for="r in leaderboard" :key="r.rank" :class="['flex flex-col items-center flex-1', r.main && '-translate-y-6']">
          <view class="relative mb-3">
            <Trophy v-if="r.main" :size="32" class="absolute -top-8 left-1/2 -translate-x-1/2 text-[#d4af35]" fill="currentColor" />
            <view :class="['rounded-full border-4 bg-cover bg-center shadow-lg', r.main ? 'size-24' : 'size-20', r.color]" :style="{ backgroundImage: `url('https://picsum.photos/seed/${r.img}/200/200')` }" />
            <view :class="['absolute -bottom-2 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm', r.bg]">第{{ r.rank }}名</view>
          </view>
          <text class="font-bold text-sm block">{{ r.name }}</text>
          <text class="text-xs text-[#d4af35]/60 block">{{ r.pts }} pts</text>
        </view>
      </view>
    </main>
  </view>
</template>
