
<template>
  <view class="flex flex-col min-h-screen px-8 py-12 theme-bg">
    <view class="flex-1 flex flex-col justify-center items-center text-center">
      <view class="size-24 bg-[#d4af35]/10 rounded-full flex items-center justify-center mb-8">
        <!-- <Cloud :size="48" class="text-[#d4af35]" /> -->
        <text class="icon-yunduo iconfont text-[#d4af35] size-90 text-[100rpx]"></text>
      </view>
      <h1 class="text-[50rpx] font-extrabold tracking-tight mb-4 italic">坐观其心</h1>
      <text class="text-[#d4af35]/60 text-[28rpx] leading-relaxed max-w-[280px] block">
        捕捉当下的心境，回归本自安定。开始你的禅意之旅。
      </text>
    </view>
    <view class="space-y-2 mb-12">
      <button :loading="loading" :disabled="loading" @click="onWechatLogin"
        class="bg-theme-1 flex w-full cursor-pointer items-center justify-center rounded-full h-14 px-6 bg-primary text-white gap-3 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]">
        <view class="size-6 bg-white rounded-full flex items-center justify-center">
          <!-- <Users :size="14" class="text-[#d4af35]" /> -->
          <text class="icon-weixin1 iconfont text-[#00c700] text-[40rpx]"></text>
        </view>
        <text>{{ loading ? '登录中...' : '微信一键登录' }}</text>
      </button>
      <view @click="onPhoneLogin"
        class="w-full text-[#d4af35] mt-[10rpx] text-[28rpx] font-semibold  flex items-center justify-center">
        <text>使用账号密码登录</text>
      </view>
      <view class="flex items-center justify-center gap-3 text-[22rpx]">
         <view class="relative flex items-center cursor-pointer" @click="toggleAgree">
                            <view :class="['custom-checkbox', { 'checked': agreeChecked }]">
                                <view v-if="agreeChecked" class="custom-checkbox-dot"></view>
                            </view>
                        </view>
        <view class="flex items-center leading-relaxed theme-color-6">
          我已阅读并同意
          <text class="text-primary font-medium theme-color-1 px-[3rpx]" href="#">用户协议</text>
          和
          <text class="text-primary font-medium theme-color-1 px-[3rpx]" href="#">隐私政策</text>
        </view>
      </view>
    </view>
    <view class="space-y-4 mb-12 w-full flex justify-center pb-8 opacity-40">
      <view class="flex gap-8">
        <view class="iconfont icon-spa text-[48rpx] theme-color-1"></view>
        <view class="iconfont icon-self_improvement text-[48rpx] theme-color-1"></view>
        <view class="iconfont icon-image-filter-vintage text-[48rpx] theme-color-1"></view>
      </view>
    </view>

  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { setToken, setUserInfo } from '@/assets/js/api/user';
import { wechatMiniLoginByConfig } from '@/assets/js/api/wechat-login';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const loading = ref(false);
const agreeChecked = ref(false);
const toggleAgree = () => {
    agreeChecked.value = !agreeChecked.value;
};
const onWechatLogin = async () => {
if (loading.value) {
    return;
  }
  // #ifndef MP-WEIXIN
  uni.showToast({
    title: '请在微信小程序环境测试',
    icon: 'none',
  });
  return;
  // #endif
  
  try {
    loading.value = true;
    const result: any = await wechatMiniLoginByConfig();
    const token = result?.token?.token || result?.token || result?.data?.token;
    if (!token) {
      throw new Error('未获取到 token');
    }
    setToken(String(token));

    const user = result?.user || result?.data?.user;
    if (user) {
      setUserInfo(user);
      userStore.setUser(user);
    }

    uni.showToast({
      title: '登录成功',
      icon: 'success',
    });

    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/home' });
    }, 300);
  } catch (error: any) {
    uni.showToast({
      title: error?.message || '微信登录失败',
      icon: 'none',
    });
  } finally {
    loading.value = false;
  }
};

const onPhoneLogin = () => {
  uni.navigateTo({
    url: '/pages/login/inputLogin',
  })
};
</script>
<style scoped lang="scss">
/* 改造复选框中间白点 */
.custom-checkbox {
     width: 15px;
    height: 15px;
    border: 1px solid rgba(255, 255, 255, 0.38);
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 1);
}

.custom-checkbox.checked {
    border-color: #d4af35;
    background-color: #d4af35;
}

.custom-checkbox-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background-color: #ffffff;
}
</style>

