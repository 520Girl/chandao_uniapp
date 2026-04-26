<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
        <lcrBar :title="'隐私协议'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="type" />
        <view class="max-w-[375px] mx-auto min-h-screen zen-gradient-bg pb-24">
            <!-- Hero view / Title -->
            <view class="px-8 pt-12 pb-8">
                <view class="font-label text-[30rpx] uppercase tracking-[0.2rem] text-primary mb-2">法律文档</view>
                <view class="font-headline text-4xl text-on-surface leading-tight mb-4">您的宁静是我们的首要任务。</view>
                <view class="font-body text-sm text-on-surface-variant leading-relaxed">生效日期：2026年04月24日</view>
            </view>
            <!-- view Content Area -->
            <view class="px-4 space-y-12">
                <!-- Introduction view -->
                <view>
                    <view class="font-headline text-2xl text-on-surface mb-4">简介</view>
                    <view class="space-y-4 text-on-surface-variant font-body text-sm leading-[1.8] font-light">
                        <view>本政策适用于「照见花满」小程序，旨在说明我们如何收集、使用、存储、保护您的个人信息，以及您对个人信息享有的权利。我们严格遵守《中华人民共和国个人信息保护法》《中华人民共和国民法典》及微信小程序平台规则，全力保护用户个人信息及隐私安全。</view>
                        <view>使用坐观其心小程序，即表示您同意本条款这一空灵手稿中所述的做法。</view>
                    </view>
                </view>
                <!-- Data Collection view -->
                <view class="p-6 rounded-2xl bg-theme-3 bg-surface-container-low border border-primary/10">
                    <view class="font-headline text-2xl text-on-surface mb-4">数据收集</view>
                    <view class="space-y-6">
                        <view class="flex gap-4">
                            <view
                                class="h-10 w-10 shrink-0 bg-theme-2 rounded-full bg-primary-container flex items-center justify-center">
                                <text class="iconfont icon-tubiaozhizuomoban- text-[48rpx] text-on-primary-container" data-icon="favorite">
                                    </text>
                            </view>
                            <view>
                                <view class="font-label text-xs uppercase tracking-widest text-primary mb-1">健康整合</view>
                                <view class="font-body text-sm text-on-surface-variant leading-relaxed">
                                    注册登录信息：用户微信昵称、微信头像、手机号码（可选绑定）、微信开放平台授权信息，用于账号快捷登录、身份识别。
                                </view>
                            </view>
                        </view>
                        <view class="flex gap-4">
                            <view
                                class="h-10 w-10 shrink-0 bg-theme-2 rounded-full bg-tertiary-container flex items-center justify-center">
                                <text class="iconfont icon-surroundsound text-[48rpx] text-on-tertiary-container"
                                    data-icon="surround_sound"></text>
                            </view>
                            <view>
                                <view class="font-label text-xs uppercase tracking-widest text-primary mb-1">声景</view>
                                <view class="font-body text-sm text-on-surface-variant leading-relaxed">
                                    服务使用信息：静坐时长、呼吸参考数据、心率参考数据、身心状态记录、心迹报告数据、观照手记内容、互动点赞、收藏、评论记录。</view>
                            </view>
                        </view>
                        <view class="flex gap-4">
                            <view
                                class="h-10 w-10 shrink-0 bg-theme-2 rounded-full bg-tertiary-container flex items-center justify-center">
                                <text class="iconfont icon-surroundsound text-[48rpx] text-on-tertiary-container"
                                    data-icon="surround_sound"></text>
                            </view>
                            <view>
                                <view class="font-label text-xs uppercase tracking-widest text-primary mb-1">声景</view>
                                <view class="font-body text-sm text-on-surface-variant leading-relaxed">
                                    设备与日志信息：移动设备型号、操作系统版本、网络状态、设备唯一标识、服务使用日志、异常日志，用于保障服务稳定运行、功能优化。</view>
                            </view>
                        </view>
                        <view class="flex gap-4">
                            <view
                                class="h-10 w-10 shrink-0 bg-theme-2 rounded-full bg-tertiary-container flex items-center justify-center">
                                <text class="iconfont icon-surroundsound text-[48rpx] text-on-tertiary-container"
                                    data-icon="surround_sound"></text>
                            </view>
                            <view>
                                <view class="font-label text-xs uppercase tracking-widest text-primary mb-1">声景</view>
                                <view class="font-body text-sm text-on-surface-variant leading-relaxed">
                                    地理位置信息（敏感个人信息）：精确 / 模糊位置坐标、所在城市 / 区县、打卡地点、分享位置信息；仅在用户主动触发位置分享、同城共修、位置打卡、发布带定位内容时授权获取，不后台持续定位、不强制获取。</view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- Usage view -->
                <view>
                    <view class="font-headline text-2xl text-on-surface mb-4">我们如何使用您的数据</view>
                    <view class="space-y-4 text-on-surface-variant font-body text-sm leading-[1.8] font-light">
                        <view>我们不会将您的个人信息出售给第三方。您的数据仅用于：</view>
                        <view class="list-none space-y-3">
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>为用户提供静坐记录、心迹报告生成、观照手记发布、共修排行、社区互动等核心服务。</view>
                            </view>
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>实现位置分享、同城共修匹配、位置打卡、定位内容展示等附加功能。</view>
                            </view>
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>优化小程序功能、修复故障、提升服务体验，进行合规数据统计与分析。。</view>
                            </view>
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>保障账号安全，进行身份验证、风险防控、违规行为监测。。</view>
                            </view>
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>遵守法律法规及平台监管要求，履行平台管理责任。。</view>
                            </view>
                        </view>
                    </view>
                </view>

                <view>
                    <view class="font-headline text-2xl text-on-surface mb-4">个人信息存储与保护</view>
                    <view class="space-y-4 text-on-surface-variant font-body text-sm leading-[1.8] font-light">
                        <view>我们承诺严格遵守相关法律法规，采取严格的数据安全措施，确保您的个人信息安全。</view>
                        <view class="list-none space-y-3">
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>您的个人信息将存储于中华人民共和国境内服务器，严格遵循最小必要、期限限定原则，仅在实现服务目的所需期限内保留。</view>
                            </view>
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>地理位置信息仅按需临时使用，不长期留存精确坐标，不用于个性化广告推送、第三方营销。</view>
                            </view>
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>我们采取合理的技术、管理、物理措施，保护您的个人信息，防止信息泄露、篡改、丢失、损毁；非经您明示许可，不会向第三方出售、泄露、共享您的个人信息。</view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- Protection view -->
                <view class="relative bg-theme-5 text-white overflow-hidden p-8 rounded-2xl bg-on-surface text-surface-container-lowest">
                    <view class="absolute -top-12 -right-12 w-32 h-32 bg-primary blur-[40px] opacity-20"></view>
                    <view class="font-headline text-2xl mb-4 relative z-10">第三方服务说明</view>
                    <view class="font-body text-sm leading-relaxed opacity-80 relative z-10">
                        本小程序接入微信第三方登录、位置服务等相关服务，第三方服务将按照其自身隐私政策收集、使用信息，我们将督促第三方履行信息保护义务，严控信息流转。
                    </view>
                    <view class="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                        <view class="iconfont icon-yuanlinyanghuxitong theme-color-1  text-tertiary-fixed" data-icon="shield_with_heart"
                            style="font-variation-settings: 'FILL' 1;"></view>
                        <view class="font-label text-[10px] uppercase tracking-widest">端到端正念安全保护</view>
                    </view>
                </view>

                <view>
                    <view class="font-headline text-2xl text-on-surface mb-4">用户个人信息权利</view>
                    <view class="space-y-4 text-on-surface-variant font-body text-sm leading-[1.8] font-light">
                        <view>您享有个人信息主体权利，包括但不限于：</view>
                        <view class="list-none space-y-3">
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>1. 您可随时查看、更正、补充自己的个人信息，自主开启或关闭位置、相册等相关权限。</view>
                            </view>
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>2. 您可申请注销账号、删除个人信息、清除位置使用记录，平台将在法定期限内完成处理。</view>
                            </view>
                            <view class="flex items-start gap-3">
                                <view class="w-1.5 h-1.5 rounded-full bg-primary mt-2"></view>
                                <view>3. 您可拒绝提供部分非必要信息，拒绝相关权限授权，但可能影响对应附加功能的正常使用，核心服务不受影响。</view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- Rights view -->
                <view class="pb-12">
                    <view class="font-headline text-2xl text-on-surface mb-4">政策更新</view>
                    <view class="font-body text-sm text-on-surface-variant leading-[1.8] font-light mb-6">
                        我们将根据法律法规、平台规则及服务调整，不定期更新本隐私政策，更新后将在小程序内公示，公示完成后正式生效。
                    </view>
                </view>
            </view>

            <view class="px-8 mt-8 mb-6 text-center">
                <button
                    class="w-full py-5 px-8 rounded-full bg-primary text-white font-label text-sm font-semibold uppercase tracking-[0.15rem] shadow-lg shadow-primary/20"
                    @click="onAgreeRead"
                >
                    我已阅读并同意
                </button>
            </view>

            <view class="px-8 pt-0 pb-24 text-center">
                <p class="font-body text-xs text-outline mb-4">对本隐私政策有疑问？</p>
                <a class="font-headline italic text-lg text-primary underline underline-offset-4 decoration-primary/30"
                    href="mailto:presence@yunxi.app">admin@yunxi.app</a>
            </view>
        </view>
    </view>
</template>
<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { STORAGE_LOGIN_AGREEMENT_CHECKED } from "@/utils/agreementNavigation";
import { navigateBack } from "@/utils/navigation";
import lcrBar from "@/components/lcrBar.vue";

const source = ref<"home" | "login" | "">("");
const type = ref<"all" | "back" >("back");
onLoad((q) => {
  const s = (q as Record<string, string | undefined>)?.source;
  if (s === "home" || s === "login") {
    source.value = s;
    type.value = s === "home" ? "all" : "back";
  } else {
    source.value = "";
  }
});

const onBack = () => {
  if (source.value === "home") {
    uni.switchTab({ url: "/pages/index/community" });
    return;
  }
  navigateBack();
};

function onAgreeRead() {
  if (source.value === "login") {
    try {
      uni.setStorageSync(STORAGE_LOGIN_AGREEMENT_CHECKED, "1");
    } catch {
      /* 忽略 */
    }
    navigateBack();
    return;
  }
  if (source.value === "home") {
    uni.switchTab({ url: "/pages/index/community" });
    return;
  }
  navigateBack();
}
</script>
<style scoped lang="scss"></style>