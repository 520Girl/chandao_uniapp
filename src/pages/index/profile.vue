<template>
  <view class="flex flex-col min-h-screen pb-[32rpx] theme-bg">
    <HomeBar :title="'账号设置'" description="云 息 自 我" :titleIcon="'icon-yonghu'" :leftIcon="'icon-Trophy'"  :handleClick="onGoToShop" />
   
    <view class="mobile-container">
    <!-- Profile view -->
    <view class="flex-1 px-4 space-y-10">
      <!-- Avatar & Info -->
      <view class="flex flex-col items-center pt-4">
        <view class="relative group">
          <view class="w-24 h-24 rounded-full overflow-hidden mb-6 shadow-sm border border-outline-gold" @click="onGoToManage('accountManage')">
            <image alt="头像" class="w-full h-full object-cover"
              :src="avatarUrl" />
          </view>
          <view @click="onGoToManage('accountManage')" class="absolute bottom-6 right-0 bg-white p-1.5 rounded-full shadow-sm border border-outline-gold" >
            <text class="iconfont icon-beizhu text-primary text-sm" data-icon="edit"></text>
          </view>
        </view>
        <view class="text-center space-y-1">
          <h2 class="font-headline text-3xl font-light italic text-primary tracking-tight" >{{ nickName }}</h2>
          <p class="font-label text-xs uppercase tracking-[0.2em] text-secondary opacity-80" >修行始于 {{ startTime }}年</p>
        </view>
      </view>
      <!-- Settings Group: Essential -->
      <view class="space-y-4">
        <view class="font-bold text-[20rpx] uppercase tracking-[0.25rem] text-primary/70 px-2">基础设置</view>
        <view class="space-y-1">
          <view @click="onGoToManage('accountManage')"
            class="flex bg-theme-13 items-center justify-between p-4 bg-accent-light/30 border border-primary/20 rounded-2xl hover:bg-accent-light/50 transition-colors cursor-pointer group">
            <view class="flex items-center gap-4">
              <text class="icon-zhanghaoguanli iconfont text-[40rpx] theme-color-1" data-icon="mail"></text>
              <text class="font-body text-[28rpx] theme-color-5">账户管理</text>
            </view>
            <view class="flex items-center gap-2">
              <text class="theme-color-7 text-[24rpx]">{{ phone }}</text>
              <text class="iconfont icon-jinru text-[30rpx] theme-color-12 group-hover:translate-x-1 transition-transform"
                data-icon="chevron_right"></text>
            </view>
          </view>
          <view @click="onGoToManage('deviceManage')"
            class="flex bg-theme-13 items-center justify-between p-4 bg-accent-light/30 border border-outline-gold/20 rounded-2xl hover:bg-accent-light/50 transition-colors cursor-pointer group">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-shebei text-[40rpx] theme-color-1" data-icon="lock"></text>
              <text class="font-body text-[28rpx] theme-color-5">设备管理</text>
            </view>
            <text class="iconfont icon-jinru text-[30rpx] theme-color-12 group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
          </view>
          <view @click="onGoToManage('postManage')"
            class="flex bg-theme-13 items-center justify-between p-4 bg-accent-light/30 border border-primary/20 rounded-2xl hover:bg-accent-light/50 transition-colors cursor-pointer group">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-shequn1 text-[40rpx] theme-color-1" data-icon="lock"></text>
              <text class="font-body text-[28rpx] theme-color-5">社群管理</text>
            </view>
            <text class="iconfont icon-jinru text-[30rpx] theme-color-12 group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
          </view>
          <view @click="onGoToManage('order')"
            class="flex bg-theme-13 items-center justify-between p-4 bg-accent-light/30 border border-primary/20 rounded-2xl hover:bg-accent-light/50 transition-colors cursor-pointer group">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-wodedingdan text-[40rpx] theme-color-1" data-icon="lock"></text>
              <text class="font-body text-[28rpx] theme-color-5">我的订单</text>
            </view>
            <text class="iconfont icon-jinru text-[30rpx] theme-color-12 group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
          </view>
          <view @click="onGoToManage('medal')"
            class="flex bg-theme-13 items-center justify-between p-4 bg-accent-light/30 border border-primary/20 rounded-2xl hover:bg-accent-light/50 transition-colors cursor-pointer group">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-xunzhang text-[40rpx] theme-color-1" data-icon="lock"></text>
              <text class="font-body text-[28rpx] theme-color-5">勋章管理</text>
            </view>
            <text class="iconfont icon-jinru text-[30rpx] theme-color-12 group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
          </view>
        </view>
      </view>
      <!-- Settings Group: Legal -->
      <view class="space-y-4   ">
        <view class="flex justify-between items-center px-[16rpx]">
          <view class="font-bold text-[20rpx] uppercase tracking-[0.25rem] text-primary/70">法律与透明度</view>
        </view>
        <view class="space-y-px overflow-hidden rounded-2xl border-primary/20 shadow-sm">
          <!-- Privacy Policy -->
          <view @click="onGoToManage('privacyPolicy')"
            class="flex bg-theme-13  items-center justify-between p-4 bg-accent-light/20 hover:bg-accent-light/40 transition-colors cursor-pointer group">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-yinsizhengce text-[40rpx] theme-color-1" data-icon="policy"></text>
              <text class="font-body text-[28rpx] theme-color-5">隐私协议</text>
            </view>
            <text class="iconfont icon-jinru text-[30rpx] theme-color-12 text-outline-gold group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
          </view>
          <!-- User Agreement -->
          <view @click="onGoToManage('userAgent')"
            class="flex  bg-theme-13  items-center justify-between p-4 bg-accent-light/20 hover:bg-accent-light/40 transition-colors cursor-pointer group border-t border-outline-gold/30">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-gavel text-[40rpx] theme-color-1" data-icon="gavel"></text>
              <text class="font-body text-[28rpx] theme-color-5">用户协议</text>
            </view>
            <text class="iconfont icon-jinru text-[30rpx] theme-color-12 text-outline-gold group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
          </view>
          <!-- Disclaimer -->
          <view @click="onGoToManage('disclaimer')"
            class="flex bg-theme-13  items-center justify-between p-4 bg-accent-light/20 hover:bg-accent-light/40 transition-colors cursor-pointer group border-t border-outline-gold/30">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-info text-[40rpx] theme-color-1" data-icon="info"></text>
              <text class="font-body text-[28rpx] theme-color-5">免责声明</text>
            </view>
            <text class="iconfont icon-jinru text-[30rpx] theme-color-12 text-outline-gold group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
          </view>
        </view>
      </view>
      <!-- Logout Button -->
      <view
        class="w-full py-[30rpx] shadow-sm rounded-full bg-theme-13 border border-outline-gold/50 hover:bg-red-50 hover:border-red-200 transition-all duration-300 group">
        <view class="flex items-center justify-center gap-3" @click="loginOut()">
          <text class="iconfont icon-tuichu text-[40rpx] theme-color-1 group-hover:text-red-500 transition-colors"
            data-icon="logout"></text>
          <text
            class="font-label text-[30rpx] theme-color-5 uppercase tracking-[0.25rem] text-primary group-hover:text-red-500 transition-colors">退出登录</text>
        </view>
      </view>
      <!-- Version Info -->
      <view class="text-center pt-4">
        <p class="font-label text-[18rpx] uppercase tracking-[0.3rem] text-primary/70">坐观其心 v2.4.1</p>
      </view>
    </view>
  </view>
  </view>
</template>

<script setup lang="ts">
import { navigateTo } from '@/utils/navigation';
import HomeBar from '@/components/homeBar.vue';
import { formatDate } from '@/utils';
const { nickName, avatarUrl, phone,createTime } = storeToRefs(useUserStore())
const nickname = ref<string>("Yunxi User");
const startTime = computed(() => formatDate(createTime.value, 'YYYY'));
  // 退出登录
const loginOut = () => {
  uni.showModal({
    title: '提示',  
    content: '确认退出登录吗?',
    success: (res) => {
      if (res.confirm) {
        useUserStore().logout();
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        });
        // 可选：跳转到登录页
        uni.navigateTo({
          url: '/pages/login/index'
        })
      }
    }
  }); 
}

// 前往商城
const onGoToShop = () => {
  uni.navigateTo({
    url: '/pages/profile/rank'
  })
}
//前往管理页面
const onGoToManage = (target: string) => {
  if (target === 'postManage') {
    uni.navigateTo({
      url: '/pages/community/manage'
    })
  } else if (target === 'order') {
    uni.navigateTo({
      url: '/pages/shop/order'
    })
  } else {
    uni.navigateTo({
      url: `/pages/profile/${target}`
    })
  }
}

</script>

