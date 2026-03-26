

<template>
  <view class="flex flex-col min-h-screen theme-bg">
    <ShopBar :title="'云息商城'" :leftIcon="'icon-shangcheng'" />
    <!-- <header class="sticky top-0 z-50 bg-[#f8f7f6] px-6 pt-6 pb-2">
      <view class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-extrabold tracking-tight text-[#201d12]">云息商城</h1>
        <view class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-[#d4af35]/10">
          <ShoppingBag :size="22" class="text-[#d4af35]" />
        </view>
      </view>
      <view class="relative mb-4">
        <Search :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af35]/60" />
        <input class="w-full bg-white border-none rounded-full py-3.5 pl-12 pr-4 shadow-sm text-sm" placeholder="搜索禅意好物..." />
      </view>
      <scroll-view scroll-x class="flex gap-3 pb-2 whitespace-nowrap">
        <view v-for="(cat, i) in categories" :key="cat" :class="['inline-block whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all mr-2', i === 0 ? 'bg-[#d4af35] text-white shadow-md shadow-[#d4af35]/20' : 'bg-white border border-[#d4af35]/10 text-[#d4af35]/80']">
          {{ cat }}
        </view>
      </scroll-view>
    </header> -->
    <main class="flex-1 px-6 pt-4 space-y-8">
      <view class="grid grid-cols-1 gap-8">
        <view v-for="p in products" :key="p.id" class="group flex flex-col bg-white rounded-[80rpx] overflow-hidden shadow-md border border-transparent mb-6">
          <view class="relative aspect-[4/3] overflow-hidden">
            <image src="/static/770-800x600.jpg" class="w-full h-full" mode="aspectFill" />
            <view class="absolute top-[32rpx] left-[32rpx] bg-theme-1 text-white text-[20rpx] uppercase tracking-widest font-bold px-[24rpx] py-[8rpx] rounded-full">{{ p.tag }}</view>
          </view>
          <view class="p-[48rpx] flex flex-col gap-2">
            <view class="flex justify-between items-start">
              <view>
                <h3 class="font-bold text-[36rpx] leading-tight">{{ p.name }}</h3>
                <text class="theme-color-1 font-medium text-[28rpx] block">{{ p.cat }}</text>
              </view>
              <text class="text-[40rpx] font-bold">$ {{ p.price }}.00</text>
            </view>
            <text class="text-[28rpx] theme-color-8 mt-[16rpx] line-clamp-2 block">{{ p.desc }}</text>
            <button @click="goToConfirm(p)" class="mt-[32rpx] w-full bg-theme-13 text-[#d4af35] font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
              <text>立即购买</text>
              <text class="iconfont icon-jiarugouwuche text-[32rpx]"></text>
            </button>
          </view>
        </view>
      </view>
    </main>
  </view>
</template>
<script setup lang="ts">
import { ShoppingBag, Search } from 'lucide-vue-next';
import { navigateTo } from '@/utils/navigation';
import ShopBar from '@/components/shopBar.vue';

const onNavigate = (screen: string) => {
  navigateTo(screen);
};

const categories = ['全部', '香薰', '服饰', '科技', '健康'];
const products = [
  { id: 1, name: '智能禅垫', cat: '芳香疗法', price: 24, desc: '智能禅垫真的非常好用你用了就知道了', tag: '环保' },
  { id: 2, name: '智能冥想垫', cat: '科技', price: 199, desc: '内置触觉传感器和蓝牙5.0。', tag: '新品' },
];
// 前往确认订单
const goToConfirm = (p: any) => {
  const json = JSON.stringify(p);
  uni.navigateTo({ url: `/pages/shop/confirm-order?p=${encodeURIComponent(json)}` });
}
</script>
<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
