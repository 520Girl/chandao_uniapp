
<template>
  <view class="flex flex-col min-h-screen px-8 py-12 theme-bg">
    <view class="flex-1 flex flex-col justify-center items-center text-center">
      <view class="size-24 bg-[#d4af35]/10 rounded-full flex items-center justify-center mb-8">
        <!-- <Cloud :size="48" class="text-[#d4af35]" /> -->
        <text class="icon-yunduo iconfont text-[#d4af35] size-90 text-[100rpx]"></text>
      </view>
      <h1 class="text-[50rpx] font-extrabold tracking-tight mb-4 italic">照见花满</h1>
      <text class="text-[#d4af35]/60 text-[28rpx] leading-relaxed max-w-[280px] block">
        捕捉当下的心境，回归本自安定
      </text>
      <text class="text-[#d4af35]/60 text-[28rpx] leading-relaxed max-w-[280px] block">开始你的禅意之旅。</text>
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
      <view
        @click="onEnterGuestExperience"
        class="w-full text-[#918355] mt-[24rpx] text-[26rpx] font-medium flex items-center justify-center active:opacity-70">
        <text>进入体验（暂不登录）</text>
      </view>
      <view class="flex items-center justify-center gap-3 text-[22rpx]">
         <view class="relative flex items-center cursor-pointer" @click="toggleAgree">
                            <view :class="['custom-checkbox', { 'checked': agreeChecked }]">
                                <view v-if="agreeChecked" class="custom-checkbox-dot"></view>
                            </view>
                        </view>
        <view class="flex items-center flex-wrap justify-center leading-relaxed theme-color-6">
          我已阅读并同意
          <text
            class="text-primary font-medium theme-color-1 px-[3rpx] underline decoration-primary/50"
            @click.stop="openUserAgreement"
          >用户协议</text>
          和
          <text
            class="text-primary font-medium theme-color-1 px-[3rpx] underline decoration-primary/50"
            @click.stop="openPrivacyPolicy"
          >隐私政策</text>
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
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref } from "vue";
import { setToken, setUserInfo } from "@/assets/js/api/user";
import { wechatMiniLoginByConfig } from "@/assets/js/api/wechat-login";
import { useUserStore } from "@/stores/user";
import {
  navigateToAgreementFromLogin,
  STORAGE_LOGIN_AGREEMENT_CHECKED,
} from "@/utils/agreementNavigation";

const userStore = useUserStore();
const loading = ref(false);
/** 邀请落地页传入 `?inviteCode=`，同步写入 `PENDING_INVITE_CODE` 供登录成功后加入团队 */
const routeInviteCode = ref("");

onLoad((options) => {
  const raw = options?.inviteCode ?? options?.scene;
  if (raw == null || String(raw).trim() === "") return;
  try {
    const c = decodeURIComponent(String(raw)).trim();
    routeInviteCode.value = c;
    uni.setStorageSync("PENDING_INVITE_CODE", c);
  } catch {
    /* ignore */
  }
});

const agreeChecked = ref(false);

onShow(() => {
  if (uni.getStorageSync(STORAGE_LOGIN_AGREEMENT_CHECKED) === "1") {
    agreeChecked.value = true;
    try {
      uni.removeStorageSync(STORAGE_LOGIN_AGREEMENT_CHECKED);
    } catch {
      /* 忽略 */
    }
  }
});

const toggleAgree = () => {
    agreeChecked.value = !agreeChecked.value;
};
const onWechatLogin = async () => {
if (loading.value) {
    return;
  }
  if(!agreeChecked.value) {
        uni.showToast({
            title: '请同意用户协议和隐私政策',
            icon: 'none'
        });
        return;
    };
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
    const refreshToken = result?.refreshToken ?? result?.data?.refreshToken ?? null;
    userStore.$patch({
      token: String(token),
      refreshToken: refreshToken != null ? String(refreshToken) : null,
      isLoggedIn: true,
      guestMode: false,
    });
    if (user) {
      setUserInfo(user);
      userStore.setUser(user);
    }

    const profileOk = await userStore.fetchUserProfile();
    if (!profileOk) {
      userStore.clearUser();
      throw new Error("获取用户信息失败");
    }
    await userStore.fetchUnReadCount();
    const wentJoin = await userStore.redirectToJoinPageIfPendingInvite();
    if (wentJoin) {
      uni.showToast({ title: "登录成功", icon: "success" });
      return;
    }

    uni.showToast({
      title: "登录成功",
      icon: "success",
    });

    setTimeout(() => {
      uni.switchTab({ url: "/pages/index/home" });
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
  const q =
    routeInviteCode.value !== ""
      ? `?inviteCode=${encodeURIComponent(routeInviteCode.value)}`
      : "";
  uni.navigateTo({
    url: `/pages/login/inputLogin${q}`,
  });
};

/** 小程序合规：未登录可先浏览首页；业务接口由 `request` 层拦截 */
function onEnterGuestExperience() {
  userStore.enterGuestMode();
  uni.switchTab({ url: "/pages/index/home" });
}

function openUserAgreement() {
  navigateToAgreementFromLogin("user");
}

function openPrivacyPolicy() {
  navigateToAgreementFromLogin("privacy");
}
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

