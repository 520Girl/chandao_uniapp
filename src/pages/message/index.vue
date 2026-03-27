<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
        <lcrBar :title="'消息中心'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />

        <view class="pb-12 px-6 mx-auto">
            <!-- Category Pill Navigation -->
            <view class="flex gap-3 mb-12 overflow-x-auto pb-2 no-scrollbar">
                <view
                    class=" ddress-card flex-shrink-0 px-6 py-2.5 rounded-full bg-primary text-white text-[24rpx] font-label tracking-[0.1rem] transition-all duration-300 shadow-sm">
                    系统消息
                </view>
                <view
                    class="ddress-card flex-shrink-0 px-6 py-2.5 rounded-full theme-color-8 bg-[#f1efed] text-on-surface-variant text-[24rpx] font-label tracking-[0.1rem] hover:bg-outline/10 transition-all duration-300">
                    互动提醒
                </view>
                <view
                    class="ddress-card flex-shrink-0 px-6 py-2.5 rounded-full theme-color-8 bg-[#f1efed] text-on-surface-variant text-[24rpx] font-label tracking-[0.1rem] hover:bg-outline/10 transition-all duration-300">
                    私信
                </view>
            </view>
            <!-- Message List -->
            <view class="space-y-8">
                
                <!-- Message Item 1: System -->
                <view class="group cursor-pointer" @click="gotoDetail('1')">
                    <view class="flex items-start gap-4">
                        <view
                            class="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary shrink-0">
                            <text class="iconfont icon-notifications_active text-[45rpx]"
                                ></text>
                        </view>
                        <view class="flex-1 space-y-1">
                            <view class="flex justify-between items-baseline">
                                <view class="font-headline text-[36rpx] italic text-on-surface leading-tight">系统通知</view>
                                <text class="font-label text-[20rpx] theme-color-8 text-outline uppercase">刚刚</text>
                            </view>
                            <view class="font-body text-[28rpx] theme-color-7 line-clamp-2 leading-relaxed">
                                您的禅修周报已经生成。在过去的一周里，您共坚持冥想 120 分钟，心灵宁静指数提升了 15%。
                            </view>
                        </view>
                    </view>
                    <view class="message-viewider mt-6"></view>
                </view>
                <!-- Message Item 2: Direct -->
                <view class="group cursor-pointer" @click="gotoDetail('2')">
                    <view class="flex items-start gap-4">
                        <view class="relative shrink-0">
                            <img alt="Portrait of a serene woman"
                                class="w-12 h-12 rounded-full object-cover grayscale opacity-70"
                                src="/static/770-800x600.jpg" />
                            <view
                                class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background-light">
                            </view>
                        </view>
                        <view class="flex-1 space-y-1">
                            <view class="flex justify-between items-baseline">
                                <view class="font-headline text-lg italic text-on-surface leading-tight">林晚萤</view>
                                <text class="font-label text-[20rpx] theme-color-8 text-outline uppercase">2 小时前</text>
                            </view>
                            <view class="font-body text-[28rpx] theme-color-7 line-clamp-2 leading-relaxed italic">
                                “刚才在‘深呼吸’冥想室看到了你的分享，那段文字很有共鸣。”
                            </view>
                        </view>
                    </view>
                    <view class="message-viewider mt-6"></view>
                </view>
                <!-- Message Item 3: Activity -->
                <view class="group cursor-pointer">
                    <view class="flex items-start gap-4">
                        <view
                            class="w-12 h-12 rounded-full flex items-center justify-center bg-primary/5 text-primary shrink-0 overflow-hidden">
                            <image alt="Minimalist sunrise" class="w-full h-full object-cover grayscale opacity-60"
                                src="/static/770-800x600.jpg" />
                        </view>
                        <view class="flex-1 space-y-1">
                            <view class="flex justify-between items-baseline">
                                <view class="font-headline text-lg italic text-on-surface leading-tight">社区动态</view>
                                <text class="font-label text-[20rpx] theme-color-8 text-outline uppercase">昨天</text>
                            </view>
                            <view class="font-body text-[28rpx] theme-color-7 line-clamp-2 leading-relaxed">
                                您发布的动态《云端之息》收到了 24 个共鸣。
                            </view>
                        </view>
                    </view>
                    <view class="message-viewider mt-6"></view>
                </view>
                <!-- Message Item 4: Inspiration -->
                <view class="group cursor-pointer">
                    <view class="flex items-start gap-4">
                        <view
                            class="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary shrink-0">
                            <text class="iconfont icon-auto_awesome text-[45rpx]"></text>
                        </view>
                        <view class="flex-1 space-y-1">
                            <view class="flex justify-between items-baseline">
                                <view class="font-headline text-lg italic text-on-surface leading-tight">云汐灵感</view>
                                <text class="font-label text-[20rpx] theme-color-8 text-outline uppercase">10-24</text>
                            </view>
                            <view class="font-body text-[28rpx]  theme-color-7 line-clamp-2 leading-relaxed">
                                新课程：‘山间晨露’声音疗愈现已上线。闭上眼，听见远山。
                            </view>
                        </view>
                    </view>
                    <view class="message-viewider mt-6"></view>
                </view>
                <!-- Message Item 5: Direct -->
                <view class="group cursor-pointer">
                    <view class="flex items-start gap-4">
                        <image alt="Thoughtful man"
                            class="w-12 h-12 rounded-full object-cover grayscale opacity-70 shrink-0"
                            src="/static/770-800x600.jpg" />
                        <view class="flex-1 space-y-1">
                            <view class="flex justify-between items-baseline">
                                <view class="font-headline text-lg italic text-on-surface leading-tight">陈默</view>
                                <text class="font-label text-[20rpx] theme-color-8 text-outline uppercase">10-22</text>
                            </view>
                            <view class="font-body text-[28rpx]  theme-color-7 line-clamp-2 leading-relaxed">
                                好久不见，最近还有去那间茶室吗？
                            </view>
                        </view>
                    </view>
                    <view class="message-viewider mt-6"></view>
                </view>
            </view>
            <!-- Empty State Suggestion Footer -->
            <view class="mt-20 text-center opacity-40">
                <text class="iconfont icon-bx-spa text-4xl mb-4  theme-color-1 block text-outline"></text>
                <view class="font-body text-[20rpx] tracking-[0.3em] text-on-surface-variant uppercase">
                    所有的声音 终将归于宁静
                </view>
            </view>
        </view>
    </view>
</template>
<script setup lang="ts">
import { ArrowLeft, MoreHorizontal } from 'lucide-vue-next';
import { navigateBack } from '@/utils/navigation';
import lcrBar from '@/components/lcrBar.vue';

const onBack = () => {
    navigateBack();
};
const gotoDetail = (id: string) => {
    uni.navigateTo({
        url: `/pages/message/detail?id=${id}`,
    });
};
</script>
<style scoped lang="scss"></style>