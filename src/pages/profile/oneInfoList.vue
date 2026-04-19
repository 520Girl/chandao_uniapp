<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
        <lcrBar :title="'个人信息收集清单'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
        <view class="max-w-[375px] mx-auto pb-24 px-8">
            <!-- Header view -->
            <view class="mt-12 mb-16">
                <view class="font-headline text-4xl leading-tight text-ink-cyan mb-6">个人信息收集清单</view>
                <view class="h-px w-12 bg-primary/40 mb-8"></view>
                <view class="font-body text-on-surface-variant leading-relaxed italic">
                    我们严格保护您的个人信息，仅收集服务所需内容，保障您的隐私安全。
                </view>
            </view>

            <!-- Long-form Content Area -->
            <article class="space-y-12">
                <!-- 一、注册与登录信息 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">01</view>
                        <view class="font-headline text-xl text-ink-cyan italic">注册与登录信息</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>1. 收集信息：微信昵称、微信头像、手机号码（可选）</view>
                        <view>2. 收集方式：用户主动授权、微信快捷登录</view>
                        <view>3. 使用目的：完成账号注册、登录，识别用户身份，保障账号安全</view>
                    </view>
                </view>

                <!-- 二、服务核心使用信息 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">02</view>
                        <view class="font-headline text-xl text-ink-cyan italic">服务核心使用信息</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>1. 收集信息：静坐时长、呼吸参考数据、心率参考数据、身心状态记录、心迹报告数据、观照手记内容、标签</view>
                        <view>2. 收集方式：用户使用服务时自动记录、用户主动填写</view>
                        <view>3. 使用目的：生成个人静心数据报告，展示身心状态，优化静坐服务体验</view>
                    </view>
                </view>

                <!-- Bento-style Highlight Card (Glassmorphism) -->
                <view class="p-6 rounded-2xl bg-theme-3 bg-white/40 backdrop-blur-xl border border-white/20 shadow-sm">
                    <view class="flex items-start gap-4 mb-3 ">
                        <view class="p-2 rounded-full bg-primary/10 text-primary">
                            <view class="iconfont icon-verifieduser text-[48rpx]" data-icon="verified_user"
                                style="font-variation-settings: 'FILL' 1;"></view>
                        </view>
                        <view>
                            <view class="font-label text-xs font-semibold uppercase tracking-wider text-ink-cyan">隐私保护
                            </view>
                            <view class="font-body text-xs text-on-surface-variant mt-1">我们遵循最小必要原则，仅收集实现功能所需信息。</view>
                        </view>
                    </view>
                </view>

                <!-- 三、社区互动信息 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">03</view>
                        <view class="font-headline text-xl text-ink-cyan italic">社区互动信息</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>1. 收集信息：观照手记互动、点赞、收藏、评论、共修排行数据</view>
                        <view>2. 收集方式：用户主动操作、平台自动记录</view>
                        <view>3. 使用目的：实现共修社区交流、心得分享、排行展示功能</view>
                    </view>
                </view>

                <!-- 四、设备与日志信息 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">04</view>
                        <view class="font-headline text-xl text-ink-cyan italic">设备与日志信息</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>1. 收集信息：设备型号、操作系统、网络类型、设备 ID、服务使用日志、异常日志</view>
                        <view>2. 收集方式：平台自动采集</view>
                        <view>3. 使用目的：保障小程序稳定运行、修复功能故障、提升服务流畅度</view>
                    </view>
                </view>

                <!-- Visual Break/Abstract Element -->
                <view class="relative w-full h-32 rounded-3xl overflow-hidden my-12">
                    <view class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/30"></view>
                    <view
                        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-primary/20 animate-pulse">
                    </view>
                    <view
                        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md">
                    </view>
                    <image alt="" class="w-full h-full object-cover mix-blend-overlay opacity-20"
                        data-alt="Soft abstract light patterns and shadows"
                        src="./static/unnamed.png" />
                </view>

                <!-- 五、地理位置信息（敏感个人信息） -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">05</view>
                        <view class="font-headline text-xl text-ink-cyan italic">地理位置信息（敏感个人信息）</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>1. 收集信息：模糊位置坐标、所在城市 / 区县、打卡地点、分享位置信息</view>
                        <view>2. 收集方式：用户主动授权、点击分享位置、开启同城共修、位置打卡</view>
                        <view>3. 使用目的：实现位置分享、同城共修匹配、位置打卡、定位内容展示</view>
                        <view>4. 用户权利：随时关闭位置授权、删除位置记录、拒绝再次提供位置信息，不影响核心服务使用</view>
                    </view>
                </view>

                <!-- 六、信息使用规则 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">06</view>
                        <view class="font-headline text-xl text-ink-cyan italic">信息使用规则</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>1. 仅收集实现服务功能所必需的信息，不超范围、超权限收集个人信息。</view>
                        <view>2. 所有信息仅用于本小程序相关服务，不用于无关商业营销、第三方数据共享。</view>
                        <view>3. 用户可随时查看、管理个人信息，自主申请账号注销与数据删除。</view>
                    </view>
                </view>
            </article>

            <!-- Footer Action -->
            <view class="mt-24 mb-12 text-center">
                <button
                    class="w-full py-5 px-8 rounded-full bg-primary text-white font-label text-sm font-semibold uppercase tracking-[0.15rem] shadow-lg shadow-primary/20 button-transition">
                    我已阅读并了解
                </button>
                <view class="mt-6 font-label text-[20rpx] text-on-surface-variant/60 uppercase tracking-widest">
                    最后修改：2025年12月
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

<style scoped lang="scss"></style>