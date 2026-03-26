<script setup lang="ts">
import { onMounted } from 'vue';
import { Cloud } from 'lucide-vue-next';
import { navigateTo } from '@/utils/navigation';

onMounted(() => {
  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/login/index'
    });
  }, 2000);
});
</script>

<template>
  <view class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f8f7f6] overflow-hidden">
    <view class="flex flex-col items-center gap-8">
      <view class="w-24 h-24 rounded-full border-2 border-[#d4af35] flex items-center justify-center relative">
        <Cloud :size="48" class="text-[#d4af35]" :stroke-width="1" />
        <view class="absolute inset-0 border border-[#d4af35]/20 rounded-full animate-ping" />
      </view>
      <view class="text-center">
        <h1 class="text-3xl font-bold tracking-[0.3em] text-[#201d12] mb-2 uppercase">YUNXI</h1>
        <text class="text-[#d4af35]/80 font-light tracking-widest text-sm uppercase block">Find your inner peace</text>
      </view>
    </view>
    <view class="absolute bottom-20 flex flex-col items-center gap-4">
      <text class="text-4xl font-bold text-[#d4af35] tracking-[0.3em] block">云息</text>
      <view class="h-[1px] bg-[#d4af35] w-24" />
    </view>
  </view>
</template>

<style scoped>
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
