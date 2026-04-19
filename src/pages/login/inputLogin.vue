<template>
    <view class="flex flex-col min-h-screen theme-bg ">
        <view class="relative mx-auto  w-full bg-surface flex flex-col overflow-hidden">
            <!-- Content Area -->
            <view class="px-8 pt-12 relative z-10 box-border">
                <!-- Welcome Message -->
                <view class=" flex-1 mb-12 mx-auto text-center flex items-center justify-center align-center flex-col">
                    <view class="size-24 bg-[#d4af35]/10 rounded-full flex items-center justify-center ">
                        <!-- <Cloud :size="48" class="text-[#d4af35]" /> -->
                        <text class="icon-yunduo iconfont text-[#d4af35] size-90 text-[100rpx]"></text>
                    </view>
                    <view class="font-headline italic text-4xl text-on-surface mb-2 tracking-tight">欢迎回来</view>
                    <view class="font-label text-sm text-on-surface-variant/70 tracking-[0.1rem] uppercase">Welcome back
                    </view>
                </view>
                <!-- Tab Navigation (Asymmetric Style) -->
                <view class="flex gap-8 mb-10 items-end ">
                    <view class="relative group">
                        <view class="text-xl font-headline italic text-on-surface">账号密码登录</view>
                        <view class="absolute -bottom-1 left-0 w-8 h-[2px] bg-theme-5 rounded-full"></view>
                    </view>
                </view>
                <!-- Form Container -->
                <form class="space-y-6">
                    <!-- Account Input -->
                    <view class="relative group">
                        <label
                            class="block text-[20rpx] theme-color-7 font-label tracking-[0.1rem] uppercase text-on-surface-variant/60 mb-2 ml-1">账号/手机号</label>
                        <input
                            v-model="phone"
                            class=" h-[100rpx] leading-[100rpx] box-border theme-color-7 bg-theme-10 border-none rounded-xl px-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-tertiary/30 transition-all outline-none"
                            placeholder="请输入您的账号" type="text" />
                    </view>
                    <!-- Password Input -->
                    <view class="relative group mt-2">
                        <label
                            class="block text-[20rpx] theme-color-7 font-label tracking-[0.1rem] uppercase text-on-surface-variant/60 mb-2 ml-1">请输入您的密码</label>
                        <view class="relative">
                            <input
                                :key="passwordVisible ? 'pwd-text' : 'pwd-mask'"
                                v-model="password"
                                class="h-[100rpx] leading-[100rpx] box-border theme-color-7  bg-theme-10 border-none rounded-xl px-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-tertiary/30 transition-all outline-none"
                                placeholder="请输入您的密码" :type="passwordVisible ? 'text' : 'password'" />
                            <view
                                class="absolute height-full z-[2] w-[60rpx] right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-tertiary transition-colors"
                                @tap="togglePasswordVisible">
                                <view v-if="passwordVisible" class="iconfont icon-yincang text-xl theme-color-7"></view>
                                <view v-else class="iconfont icon-visibility text-xl theme-color-7"></view>
                            </view>
                        </view>
                    </view>
                    <!-- Forgot Password -->
                    <view class="flex justify-end">
                        <navigate class="text-xs font-label theme-color-7 mt-2 hover:text-tertiary transition-colors"
                            href="#">忘记密码？</navigate>
                    </view>
                    <!-- Primary Action -->
                    <view class="pt-4">
                        <view
                            @tap="toLogin()"
                            class=" button-transition text-[38rpx] w-full bg-theme-1 text-white text-center font-label py-3 rounded-full shadow-lg shadow-tertiary/10 active:scale-95 transition-transform duration-200">
                            登录
                        </view>
                    </view>
                    <!-- Agreement -->
                    <view class="flex items-center justify-center gap-3 text-[22rpx] mt-3">
                        <view class="relative flex items-center cursor-pointer" @tap="toggleAgree">
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
                </form>
                <!-- Other Login Methods Section -->
                <view class="mt-10">
                    <view class="flex items-center gap-4">
                        <view
                            class="h-[1px] flex-1 bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent">
                        </view>
                        <view
                            class="text-[26rpx] theme-color-7  font-label tracking-[0.2rem] uppercase text-on-surface-variant/40">
                            其他登录方式</view>
                        <view
                            class="h-[1px] flex-1 bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent" >
                        </view>
                    </view>
                    <view class="flex justify-center" @tap="toLogin()">
                        <view
                            class=" trounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-container-highest transition-colors active:scale-90 duration-200">
                            <!-- Custom WeChat Icon Placeholder as Material Symbol doesn't have it -->
                            <view class="icon-weixin1 iconfont text-[#00c700] text-[50rpx]"></view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- Decorative Element: Floating Zen Circle -->
            <view
                class="absolute bottom-[-5%] left-[-10%] w-48 h-48 border border-tertiary/5 rounded-full pointer-events-none">
            </view>
            <view
                class="absolute bottom-[5%] left-[-5%] w-32 h-32 border border-tertiary/10 rounded-full pointer-events-none">
            </view>
            <!-- Bottom Shell suppressed for focused journey -->
        </view>
    </view>
</template>
<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

onLoad((options) => {
//   const raw = options?.inviteCode ?? options?.scene;
//   if (raw == null || String(raw).trim() === "") return;
//   try {
//     const c = decodeURIComponent(String(raw)).trim();
//     uni.setStorageSync("PENDING_INVITE_CODE", c);
//   } catch {
//     /* ignore */
//   }
});
const phone = ref('12810909149');
const password = ref('123456');

const toLogin = () => {
    if(!phone.value || !password.value) return;
    if(!agreeChecked.value) {
        uni.showToast({
            title: '请同意用户协议和隐私政策',
            icon: 'none'
        });
        return;
    };
    userStore.login({ phone: phone.value, password: password.value });
}

const passwordVisible = ref(false);
const agreeChecked = ref(true);

const togglePasswordVisible = () => {
    passwordVisible.value = !passwordVisible.value;
};

const toggleAgree = () => {
    agreeChecked.value = !agreeChecked.value;
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