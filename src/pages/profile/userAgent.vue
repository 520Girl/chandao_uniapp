<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
        <lcrBar :title="'用户服务协议'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
        <view class="max-w-[375px] mx-auto pb-24 px-8">
            <!-- Header view -->
            <view class="mt-12 mb-16">
                <view class="font-label text-[30rpx] uppercase tracking-[0.2rem] text-primary mb-2">文档版本 2.4</view>
                <view class="font-headline text-4xl leading-tight text-ink-cyan mb-6">用户服务协议</view>
                <view class="h-px w-12 bg-primary/40 mb-8"></view>
                <view class="font-body text-on-surface-variant leading-relaxed italic">
                    点击使用即表示您已充分阅读、理解并同意本协议全部条款。
                </view>
            </view>
            <!-- Long-form Content Area -->
            <article class="space-y-12">
                <!-- 一、协议主体 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">01</view>
                        <view class="font-headline text-xl text-ink-cyan italic">协议主体</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>
                            本协议由您与「照见花满」小程序运营方共同签署，当您点击注册、登录、使用本小程序服务，即视为您已充分阅读、理解并同意接受本协议全部条款。
                        </view>
                    </view>
                </view>

                <!-- 二、服务内容 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">02</view>
                        <view class="font-headline text-xl text-ink-cyan italic">服务内容</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>
                            本小程序为用户提供静坐引导、身心数据记录、心迹报告生成、共修社区交流、观照手记发布、位置分享、同城共修匹配等相关服务，所有服务仅供个人静心、身心放松使用，不涉及任何医疗诊疗、疾病治疗相关服务。
                        </view>
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
                            <view class="font-label text-xs font-semibold uppercase tracking-wider text-ink-cyan">用户规范
                            </view>
                            <view class="font-body text-xs text-on-surface-variant mt-1">请遵守账号使用规范与平台行为准则，共同维护良好的静心环境。</view>
                        </view>
                    </view>
                </view>

                <!-- 三、用户账号规范 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">03</view>
                        <view class="font-headline text-xl text-ink-cyan italic">用户账号规范</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>1. 用户需通过微信快捷登录等合法方式注册账号，保证注册信息真实、准确、完整，若信息变更需及时更新。</view>
                        <view>2. 用户对自身账号的保管、账号下的全部操作承担全部责任，不得转借、出租、售卖账号，若账号被盗用、非正常使用，需及时联系平台处理。</view>
                        <view>3. 用户需年满 14 周岁使用本服务，未成年人需在监护人监护、同意下使用。</view>
                    </view>
                </view>

                <!-- 四、用户行为规范 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">04</view>
                        <view class="font-headline text-xl text-ink-cyan italic">用户行为规范</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>1. 用户在使用服务、发布内容时，需遵守法律法规、公序良俗及平台规则，不得发布违法、违规、低俗、暴力、侵权、虚假宣传、封建迷信等不良内容。</view>
                        <view>2. 不得利用平台进行商业推广、恶意刷屏、骚扰他人、刷取共修排行数据、恶意评论等违规行为。</view>
                        <view>3. 尊重他人知识产权及合法权益，不得抄袭、盗用他人观照手记、心得等原创作品。</view>
                        <view>4. 用户主动使用位置分享、同城共修、位置打卡等功能时，需自主授权小程序获取地理位置信息；用户可随时在设备端关闭位置授权，关闭后仅对应功能无法使用，不影响小程序核心静坐、数据记录服务。</view>
                        <view>5. 用户分享位置、发布带定位内容时，需确保内容合规，不得泄露自身或他人私密位置信息。</view>
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
                        src="/static/unnamed.png" />
                </view>

                <!-- 五、知识产权 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">05</view>
                        <view class="font-headline text-xl text-ink-cyan italic">知识产权</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>1. 平台内所有文字、图标、界面设计、数据模板、音频引导、文案内容等，知识产权归运营方所有，未经许可不得擅自使用、复制、传播、篡改。</view>
                        <view>2. 用户在平台发布的原创观照手记、心得、评论等内容，授权平台在合理范围内使用，用于平台展示、服务优化、社区运营，用户保留自身原创内容的知识产权。</view>
                    </view>
                </view>

                <!-- 六、服务变更与终止 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">06</view>
                        <view class="font-headline text-xl text-ink-cyan italic">服务变更与终止</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>1. 平台有权根据运营需求，变更、暂停或终止部分 / 全部服务，将提前通过小程序公告告知用户。</view>
                        <view>2. 用户若违反本协议约定，平台有权采取警告、限制功能、封禁账号、终止服务等处理措施，且无需承担责任。</view>
                        <view>3. 用户可自主申请注销账号，账号注销后，用户个人信息将按照法律法规及隐私政策约定处理。</view>
                    </view>
                </view>

                <!-- 七、其他 -->
                <view class="space-y-4">
                    <view class="flex items-center gap-3">
                        <view class="font-label text-xs text-primary font-bold tracking-widest">07</view>
                        <view class="font-headline text-xl text-ink-cyan italic">其他</view>
                    </view>
                    <view class="font-body text-sm text-on-surface-variant leading-relaxed space-y-4">
                        <view>本协议自用户同意之日起生效，平台有权对协议内容进行修改，修改后将在平台公示，公示后即生效；用户继续使用服务，视为接受修改后的协议。本协议适用中华人民共和国法律，因本协议产生的争议，双方协商解决，协商不成提交平台所在地有管辖权的法院诉讼解决。</view>
                    </view>
                </view>
            </article>

            <!-- Footer Action -->
            <view class="mt-24 mb-12 text-center">
                <button
                    class="w-full py-5 px-8 rounded-full bg-primary text-white font-label text-sm font-semibold uppercase tracking-[0.15rem] shadow-lg shadow-primary/20 button-transition">
                    我已阅读并同意
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