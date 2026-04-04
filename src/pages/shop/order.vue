<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
      <lcrBar :title="'我的订单'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
      <view class="pt-6 px-6">
    <!-- Page Title & Atmosphere -->
    <view class="mb-8 mt-4">
      <view class="font-label text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1">Ethereal Archive</view>
      <h2 class="font-headline text-4xl font-light text-[#333333] italic">我的订单</h2>
    </view>
    <!-- Filter viewigation (Pill Style from SCREEN_60 palette) -->
    <view class="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar">
      <view
        class="px-5 py-2 rounded-full bg-theme-1 text-white text-sm font-medium whitespace-nowrap shadow-sm shadow-primary/20">全部</view>
      <view
        class="px-5 py-2 rounded-full bg-theme-13 text-gray-500 text-sm whitespace-nowrap hover:bg-primary/10 transition-colors">待付款</view>
      <view
        class="px-5 py-2 rounded-full bg-theme-13 text-gray-500 text-sm whitespace-nowrap hover:bg-primary/10 transition-colors">待收货</view>
      <view
        class="px-5 py-2 rounded-full bg-theme-13 text-gray-500 text-sm whitespace-nowrap hover:bg-primary/10 transition-colors">已完成</view>
    </view>
    <!-- Order List -->
    <view class="space-y-4">
      <!-- Order Card 1: Longjing -->
      <view class="glass-card rounded-2xl p-5 shadow-sm bg-[#ffffff80]" @click="goToOrderDetail(1)">
        <view class="flex justify-between items-start mb-4">
          <text class="text-[10px] font-label tracking-widest text-gray-400 ">Order #29381</text>
          <text
            class="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium uppercase">Delivered</text>
        </view>
        <view class="flex gap-4 mb-5">
          <view class="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
            <image alt="Tea" class="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM4kHmYkkVm-FoSwDaRRrCCNlhg2MnEISHfmOf-SkGMwsDVLGQeabilwJH403IQkfcsKN_PG2prXBSePJSnDUziQVFpAoGh6svYZQ1ZScHVlTVxkX0HT99BHtv1pdtxRDGTTfBgk9zXZIFJB0jwS_3LVs3LmeNxxydrF-uJW89WhR5q_o4W8Qn55M0adRFJUAIPecEMMSqpJbqQEWM4dIhDB9htYilqvXJNMbnbA9F2a7XqJg4Q_IIlOUV03HZoE3EmLc4w0Je453L" />
          </view>
          <view class="flex-1 flex flex-col justify-center">
            <view class="font-medium text-base text-[#333333] mb-0.5">High Mountain Longjing</view>
            <view class="text-gray-400 text-xs mb-2">狮峰龙井 · 2024头采</view>
            <view class="flex items-baseline gap-0.5">
              <text class="text-primary font-medium text-sm">¥</text>
              <text class="text-primary font-bold text-xl tracking-tighter">1,280.00</text>
            </view>
          </view>
        </view>
        <view class="flex justify-end gap-3 pt-4 border-t border-gray-50">
          <view
            class="px-4 py-2 rounded-full border border-gray-100 text-xs text-gray-500 hover:bg-gray-50 transition-colors">查看详情</view>
          <view
            class="px-4 py-2 rounded-full bg-primary text-xs text-white font-bold shadow-sm shadow-primary/10">再次购买</view>
        </view>
      </view>
      <!-- Order Card 2: Pu'er -->
      <view class="glass-card rounded-2xl p-5 shadow-sm">
        <view class="flex justify-between items-start mb-4">
          <text class="text-[10px] font-label tracking-widest text-gray-400 uppercase">Order #29342</text>
          <text class="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium uppercase">Shipped</text>
        </view>
        <view class="flex gap-4 mb-5">
          <view class="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
            <image alt="Tea Brick" class="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF7HwQFAha11CNXHw9RZuoiXmRPgK0wmqtpSLiucfAKX6YHaXgmswgdUgVfc9Hu-5Wjl-MbHXTwZ-a8VCRkL97CmiYdmb7adlh5GhjrrIrriJuXhVuzm6ArdYWaRCeCBNmh2G2LCptNMwShQijDKK49xzSX8GH3C_put0mYe8y6hmZAvGLil0YtFdIe9zkzwQM-NU590HQ9wMrTGqCxAx6t7Jtqw6KxuRej5knwy_UxIj5p6oM-YuBm6IEirjz_LNBvCIXAsvNlp9U" />
          </view>
          <view class="flex-1 flex flex-col justify-center">
            <view class="font-medium text-base text-[#333333] mb-0.5">Vintage Pu'er Cake</view>
            <view class="text-gray-400 text-xs mb-2">陈年普洱 · 2012熟饼</view>
            <view class="flex items-baseline gap-0.5">
              <text class="text-primary font-medium text-sm">¥</text>
              <text class="text-primary font-bold text-xl tracking-tighter">2,560.00</text>
            </view>
          </view>
        </view>
        <view class="flex justify-end gap-3 pt-4 border-t border-gray-50">
          <view
            class="px-4 py-2 rounded-full border border-gray-100 text-xs text-gray-500 hover:bg-gray-50 transition-colors">追踪物流</view>
        </view>
      </view>
      <!-- Order Card 3: Teapot -->
      <view class="glass-card rounded-2xl p-5 shadow-sm opacity-90">
        <view class="flex justify-between items-start mb-4">
          <text class="text-[10px] font-label tracking-widest text-gray-400 uppercase">Order #28912</text>
          <text class="px-2 py-0.5 rounded bg-gray-100 text-gray-400 text-[10px] font-medium uppercase">Archived</text>
        </view>
        <view class="flex gap-4 mb-5">
          <view class="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
            <image alt="Teapot" class="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuARzDnIf_Y3es8dlzPn6So4X50_k_ef95nutnmfe7gCD2XSy72CO6mbTc_X4BLy8KOMlV1v0WSz0CLEIyBWsGoGBoyMShGqx2DxOaeKCu2ma54L33QgTm9Xq7jwna3qUM_hxRIMFcKBkOG5zzSMnQrIlmAIVbGTUPK2LOI1dlXHAniyYB3eWeEKtmZ180jK0ho-olf7CNGHNWrjGD-i5jpJCvm0wqDbAm3K388ozfvSJ4wkrTtRhbvduI1zCmVgYYnpPDBUBw36H-UZ" />
          </view>
          <view class="flex-1 flex flex-col justify-center">
            <view class="font-medium text-base text-[#333333] mb-0.5">Hand-crafted Teapot</view>
            <view class="text-gray-400 text-xs mb-2">手工紫砂壶 · 石瓢式</view>
            <view class="flex items-baseline gap-0.5">
              <text class="text-primary font-medium text-sm">¥</text>
              <text class="text-primary font-bold text-xl tracking-tighter">3,800.00</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
    </view>
  </template>
  <script setup lang="ts">
    import { navigateBack, navigateTo } from '@/utils/navigation';
  import lcrBar from '@/components/lcrBar.vue';
  
  const onBack = () => {
    navigateBack();
  };
  const goToOrderDetail = (id: number) => {
    uni.navigateTo({
      url: `/pages/shop/order-detail?id=${id}`
    });
  };
  </script>
  <style scoped lang="scss">
  
  </style>