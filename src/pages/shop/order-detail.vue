<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
      <lcrBar :title="'订单状态'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
      <view class="pt-6 pb-10 px-6 min-h-screen">
        <!-- Order Status view -->
        <view class="mb-10 text-center">
            <view class="inline-flex items-center justify-center p-4 mb-5 rounded-full bg-primary/10">
                <text class="iconfont icon-Package-2 text-primary text-4xl"></text>
            </view>
            <h2 class="serif-text italic text-4xl font-bold tracking-tight mb-2 text-[#333]">配送中</h2>
            <view class="text-on-surface-variant font-label tracking-widest uppercase text-[11px]">订单编号: YX-20231084</view>
        </view>
        <!-- Shipping Address Card -->
        <view class="mb-8 p-5 rounded-2xl bg-white shadow-sm border border-primary/5">
            <view class="flex items-center gap-3 mb-4">
                <view class="bg-primary/10 p-2 rounded-full">
                    <text class="iconfont icon-MapPin text-primary text-xl"></text>
                </view>
                <view class="font-label font-bold text-sm tracking-wide text-[#333]">收货地址</view>
            </view>
            <view class="space-y-1 pl-12">
                <view class="font-bold text-base text-[#333]">张晓琳</view>
                <view class="text-on-surface-variant text-sm leading-relaxed">
                    上海市徐汇区安福路288号<br />
                    3号楼 402室, 200031
                </view>
                <view class="text-on-surface-variant text-sm mt-2 font-medium">+86 138 **** 9012</view>
            </view>
        </view>
        <!-- Product List -->
        <view class="mb-8 bg-white rounded-2xl p-5 shadow-sm border border-primary/5">
            <view class="text-sm font-bold text-on-surface-variant mb-4 uppercase tracking-wider">订单内容</view>
            <view class="space-y-6">
                <!-- Product Item 1 -->
                <view class="flex gap-4">
                    <view class="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                        <image alt="Product" class="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyZ9bDkuqUq9GYkLAk8yE7rn8R1jz1SNadITMVYKXldLcWr8_6PKtYGFbvOP766t2DFuDhSpJrZBhjKogRwdo9qpDBJmn5prghYfvfz5FH9wFhemuumhWIpQ-BLPihI4PXWus5J9qnHh9PifWppjim-_e_rfG76GOv-nuZ9AUJvfds20lCBFYcfk7E7y5JL4_cQtF0ZeO3ZPa3-ILc6cBVZj0WOBGErrPVe6fNBY5iMnOZuXdhqBl4PDlo7swZtQhtRYWuYuEmxI1C" />
                    </view>
                    <view class="flex-1 flex flex-col justify-between py-0.5">
                        <view>
                            <view class="font-medium text-base text-[#333]">青岩釉面茶具套装</view>
                            <view class="text-on-surface-variant text-xs mt-1">规格: 极简灰 / 六头装</view>
                        </view>
                        <view class="flex justify-between items-end">
                            <text class="font-bold text-primary">¥ 1,280.00</text>
                            <text class="text-on-surface-variant text-sm">x 1</text>
                        </view>
                    </view>
                </view>
                <!-- Product Item 2 -->
                <view class="flex gap-4">
                    <view class="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                        <image alt="Product" class="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy-Yv7uBez2VtJAJWwblg48i5wda27OpOv_qNsnn0cLMSU8qk1uBT8Lv7v1O59fQlcckmvGEzadoMzYGfgeN-ueCp1E7Ka64NqsQRhoeizBeS5EUH3JxS_AZw6cmV0vAWCuhElQ1Pt8mjw1pht62oRbrr64tt-WaJSDro1m5dHYHJ5QAzhhkN7R2yZ9sRO04RxOPCPhQ33Tf3KN6VXUIntmJEwhM0oaeQkiAFtX0BfOZ-1LB1-5zBZnvqY7aif6SOABrC26RgPYVYz" />
                    </view>
                    <view class="flex-1 flex flex-col justify-between py-0.5">
                        <view>
                            <view class="font-medium text-base text-[#333]">檀木沉静香薰蜡烛</view>
                            <view class="text-on-surface-variant text-xs mt-1">规格: 250g / 森林香调</view>
                        </view>
                        <view class="flex justify-between items-end">
                            <text class="font-bold text-primary">¥ 360.00</text>
                            <text class="text-on-surface-variant text-sm">x 2</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <!-- Order Summary -->
        <view class="mb-10 px-1">
            <view class="space-y-3">
                <view class="flex justify-between items-center text-sm">
                    <text class="text-on-surface-variant">商品小计</text>
                    <text class="font-medium text-[#333]">¥ 2,000.00</text>
                </view>
                <view class="flex justify-between items-center text-sm">
                    <text class="text-on-surface-variant">运费</text>
                    <text class="font-medium text-[#333]">¥ 0.00</text>
                </view>
                <view class="flex justify-between items-center text-sm text-primary">
                    <text>优惠减免</text>
                    <text class="font-medium">- ¥ 120.00</text>
                </view>
                <view class="pt-4 mt-4 border-t border-dashed border-gray-200 flex justify-between items-baseline">
                    <text class="text-xs text-on-surface-variant font-medium">应付总额</text>
                    <view class="flex items-baseline gap-1">
                        <text class="text-sm text-primary font-bold">¥</text>
                        <text class="text-2xl text-primary font-bold tracking-tighter">1,880.00</text>
                    </view>
                </view>
            </view>
        </view>
        <!-- Action Buttons -->
        <view class="space-y-4">
            <button
                class="w-full py-4 rounded-full bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                <text class="iconfont icon-kefu text-xl"></text>
                联系在线客服
            </button>
            <button
                class="w-full py-4 rounded-full bg-white border border-gray-200 text-on-surface-variant font-medium text-base transition-colors hover:bg-gray-50 active:scale-95">
                取消订单
            </button>
        </view>
        <!-- Order Metadata -->
        <view class="mt-12 text-center">
            <view class="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-label">
                下单时间: 2023.10.24 14:32:05
            </view>
            <view class="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-label mt-1">
                支付方式: 微信支付
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
  <style scoped lang="scss">
  
  </style>