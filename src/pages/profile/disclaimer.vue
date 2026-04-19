<template>
    <view class="flex flex-col min-h-screen theme-bg">
        <lcrBar :title="'免责声明'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
        <view class="max-w-[375px] mx-auto min-h-screen zen-gradient-bg pb-24">
            <!-- Hero view / Title -->
            <view class="px-8 pt-12 pb-8">
                <view class="font-label text-[30rpx] uppercase tracking-[0.2rem] text-primary mb-2">免责声明</view>
                <view class="font-headline text-4xl text-on-surface leading-tight mb-4">静心前行，风险自担。</view>
            </view>

            <!-- Content Area -->
            <view class="px-4 space-y-12">

                <!-- 一、服务性质声明 -->
                <view>
                    <view class="font-headline text-2xl text-on-surface mb-4">一、服务性质声明</view>
                    <view class="space-y-4 text-on-surface-variant font-body text-sm leading-[1.8] font-light">
                        <view>1.本小程序及配套设备提供的静坐时长、呼吸、心率、身心状态等数据，仅为日常静心、身心放松参考数据，不具备医疗诊断、治疗、康复、养生诊疗等专业医疗效力，不属于医疗设备及医疗服务范畴。</view>
                        <view>2.平台提供的静坐、冥想引导内容，仅为身心放松、情绪调节、静心修行的辅助方式，不能替代专业医疗诊断、心理咨询、疾病治疗、精神干预等专业服务。</view>
                    </view>
                </view>

                <!-- 二、使用风险提示 -->
                <view class="p-6 rounded-2xl bg-theme-3 bg-surface-container-low border border-primary/10">
                    <view class="font-headline text-2xl text-on-surface mb-4">二、使用风险提示</view>
                    <view class="space-y-6">
                        <view class="flex gap-4">
                            <view
                                class="h-10 w-10 shrink-0 bg-theme-2 rounded-full bg-primary-container flex items-center justify-center">
                                <text
                                    class="iconfont icon-tubiaozhizuomoban- text-[48rpx] text-on-primary-container"></text>
                            </view>
                            <view>
                                <view class="font-label text-xs uppercase tracking-widest text-primary mb-1">身体状况</view>
                                <view class="font-body text-sm text-on-surface-variant leading-relaxed">
                                    用户需根据自身身体状况自愿使用，特殊疾病、孕期等情况需及时就医，不得依赖本平台替代专业诊疗。
                                </view>
                            </view>
                        </view>

                        <view class="flex gap-4">
                            <view
                                class="h-10 w-10 shrink-0 bg-theme-2 rounded-full bg-tertiary-container flex items-center justify-center">
                                <text
                                    class="iconfont icon-surroundsound text-[48rpx] text-on-tertiary-container"></text>
                            </view>
                            <view>
                                <view class="font-label text-xs uppercase tracking-widest text-primary mb-1">安全使用</view>
                                <view class="font-body text-sm text-on-surface-variant leading-relaxed">
                                    禁止在驾驶、高空作业等危险场景使用；练习中出现不适请立即停止，自行承担健康风险。
                                </view>
                            </view>
                        </view>
						
						<view class="flex gap-4">
                            <view
                                class="h-10 w-10 shrink-0 bg-theme-2 rounded-full bg-primary-container flex items-center justify-center">
                                <text
                                    class="iconfont icon-MapPin text-[48rpx] text-on-primary-container"></text>
                            </view>
                            <view>
                                <view class="font-label text-xs uppercase tracking-widest text-primary mb-1">位置信息</view>
                                <view class="font-body text-sm text-on-surface-variant leading-relaxed">
                                    自愿授权位置信息，内容公开后隐私风险自行承担；禁止在敏感/私密/危险场所分享位置。
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 三、社区内容免责 -->
                <view>
                    <view class="font-headline text-2xl text-on-surface mb-4">三、社区内容免责</view>
                    <view class="space-y-4 text-on-surface-variant font-body text-sm leading-[1.8] font-light">
                        <view>1.共修社区内用户发布的观照手记、心得、评论、位置打卡、定位内容等，仅代表用户个人观点，不代表平台立场，平台不对内容的真实性、准确性、合法性、安全性负责。</view>
                        <view>2.若用户发布内容侵犯第三方合法权益，由发布者自行承担全部责任，平台将依法履行违规内容审核、删除、账号处理等义务。</view>
                    </view>
                </view>

                <!-- 四、其他免责 -->
                <view
                    class="relative bg-theme-5 text-white overflow-hidden p-8 rounded-2xl bg-on-surface text-surface-container-lowest">
                    <view class="absolute -top-12 -right-12 w-32 h-32 bg-primary blur-[40px] opacity-20"></view>
                    <view class="font-headline text-2xl mb-4 relative z-10">四、其他免责</view>
                    <view class="font-body text-sm leading-relaxed opacity-80 relative z-10">
                        1.因不可抗力、网络故障、第三方服务故障、系统维护等不可抗因素导致服务中断、数据丢失的，平台不承担责任。<br/><br/>
                        2.用户因自身操作不当、账号保管不善、设备故障、擅自授权第三方、违反平台规则等行为造成的信息泄露、财产损失等，由用户自行承担。
                    </view>
                    <view class="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                        <view class="iconfont icon-yuanlinyanghuxitong theme-color-1 text-tertiary-fixed"
                            style="font-variation-settings: 'FILL' 1;"></view>
                        <view class="font-label text-[10px] uppercase tracking-widest">静心 · 安全 · 正念</view>
                    </view>
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