<script setup lang="ts">
import { User as UserIcon, Cloud, Wind, Trophy, Activity } from 'lucide-vue-next';
import { navigateTo } from '@/utils/navigation';

const onNavigate = (screen: string) => {
  navigateTo(screen);
};
</script>

<template>
  <view class="flex flex-col min-h-screen pb-24 bg-[#f8f7f6]">
    <!-- Header -->
    <view class="flex items-center justify-between px-6 pt-12 pb-6">
      <view class="flex items-center gap-4">
        <view @click="onNavigate('profile')" class="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#d4af35]/10 shadow-sm overflow-hidden">
          <image src="https://picsum.photos/seed/avatar/200/200" class="w-full h-full" mode="aspectFill" />
        </view>
        <view>
          <text class="text-xs uppercase tracking-[0.2em] text-[#d4af35]/60 font-bold block">下午好，</text>
          <text class="text-xl font-bold tracking-tight text-[#201d12] block">云息行者</text>
        </view>
      </view>
      <view class="flex items-center gap-2">
        <view @click="onNavigate('leaderboard')" class="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#d4af35]/10 text-[#d4af35]">
          <Trophy :size="20" />
        </view>
        <view @click="onNavigate('report')" class="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#d4af35]/10 text-[#d4af35]">
          <Activity :size="20" />
        </view>
      </view>
    </view>

    <!-- Zen Quote Section -->
    <view class="px-6 mb-10">
      <view class="relative p-8 rounded-[40px] bg-white border border-[#d4af35]/5 shadow-sm overflow-hidden">
        <view class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#d4af35]/5 blur-3xl" />
        <view class="relative z-10">
          <text class="font-serif italic text-2xl text-[#201d12] leading-relaxed block mb-4">
            "心如止水，<br/>方能照见万物之本真。"
          </text>
          <view class="flex items-center gap-2">
            <view class="w-8 h-px bg-[#d4af35]/30" />
            <text class="text-[10px] uppercase tracking-widest text-[#d4af35]/60 font-bold block">今日禅语</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Main Focus -->
    <view class="relative px-6 mb-12">
      <view class="flex items-center justify-between mb-6">
        <text class="text-sm font-bold uppercase tracking-widest text-[#d4af35]/60 block">今日功课</text>
        <text class="text-xs text-[#d4af35] font-medium block">已坚持 12 天</text>
      </view>
      
      <view @click="onNavigate('meditation')" class="relative w-full aspect-[16/9] rounded-[32px] overflow-hidden shadow-2xl shadow-[#d4af35]/10">
        <image src="https://picsum.photos/seed/zenmain/1200/800" class="absolute inset-0 w-full h-full" mode="aspectFill" />
        <view class="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-transparent to-transparent p-8 flex flex-col justify-end">
          <view class="flex items-center gap-2 mb-3">
            <view class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <text class="text-[10px] text-white/60 font-bold uppercase tracking-widest block">正在进行</text>
          </view>
          <text class="text-3xl font-bold text-white mb-2 block">呼吸的艺术</text>
          <view class="flex items-center gap-4">
            <view class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
              <Wind :size="12" class="text-white" />
              <text class="text-[10px] text-white font-bold block">15 MINS</text>
            </view>
            <text class="text-xs text-white/40 block">已有 1.2k 人参与</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Scene Selection -->
    <view class="px-6 space-y-6">
      <view class="flex items-center justify-between">
        <text class="text-sm font-bold uppercase tracking-widest text-[#d4af35]/60 block">场景化冥想</text>
        <text class="text-xs text-[#d4af35] font-medium block">查看全部</text>
      </view>
      
      <scroll-view scroll-x class="flex gap-4 pb-8 whitespace-nowrap no-scrollbar">
        <view v-for="scene in ['深夜觉察', '晨间唤醒', '午间小憩', '林间漫步']" :key="scene" @click="onNavigate('meditation')" class="relative inline-block w-64 h-80 rounded-[32px] overflow-hidden mr-4 shadow-lg">
          <image :src="`https://picsum.photos/seed/${scene}/600/800`" class="absolute inset-0 w-full h-full opacity-80" mode="aspectFill" />
          <view class="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-[#1a1a1a]/20 to-transparent p-6 flex flex-col justify-end">
            <text class="text-xl font-bold text-white mb-2 block">{{ scene }}</text>
            <text class="text-[10px] text-white/60 font-medium leading-relaxed block whitespace-normal mb-4">
              在这一刻，让心灵归于宁静，照见内心的光。
            </text>
            <view class="flex items-center justify-between">
              <view class="flex items-center gap-2">
                <view class="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <Wind :size="14" class="text-white" />
                </view>
                <text class="text-[10px] text-white font-bold block">12 MINS</text>
              </view>
              <view class="w-8 h-8 rounded-full bg-[#d4af35] flex items-center justify-center shadow-lg shadow-[#d4af35]/20">
                <Activity :size="14" class="text-black" />
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
