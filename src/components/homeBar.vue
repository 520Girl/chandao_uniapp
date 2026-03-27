<template>
    <view class="custom-nav-bar ">
        <view class="navbar theme-bg ethereal-blur">
            <view class="statusBar" :style="{ height: getStatusBarHeight() + 'px'}"></view>
            <view class="titleBar" :style="{ height: getTitleBarHeight()+ 15 + 'px', marginLeft: getTitleLogo() + 'rpx' }">
                <view class="flex items-center justify-between">
                    <view class="flex items-center gap-4">
                        <view @click="callParentFn"
                            class=" relative w-12 h-12 rounded-full bg-white/50 flex items-center justify-center border border-[#d4af35]/10 shadow-sm">
                            <text class="iconfont  theme-color-1 text-[48rpx]" :class="leftIcon" />
                            <view v-if="messageCount > 0" class="absolute top-2 right-2 w-2 h-2 bg-[#d4af35] rounded-full" />
                        </view>
                        <view>
                            <view class="text-xl font-bold tracking-tight flex items-center gap-2">
                                <text class="iconfont theme-color-1 text-[40rpx]" :class="titleIcon"></text>
                                {{ title }}
                            </view>
                            <view class="text-[20rpx] uppercase tracking-[0.2em] theme-color-8">{{ description }}</view>
                        </view>
                    </view>
                </view>
            </view>

        </view>
        <view class="fill" :style="{ height: getNavbarHeight()+ 15 + 'px' }">

        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { getStatusBarHeight, getTitleBarHeight, getNavbarHeight, getTitleLogo } from '@/utils/system'
const { title, description, leftIcon, titleIcon, handleClick } = defineProps({
    title: {
        type: String,
        default: "首页"
    },
    description: {
        type: String,
        default: "第一个云息空间"
    },
    leftIcon: {
        type: String,
        default: ""
    },
    titleIcon: {
        type: String,
        default: ""
    },
    handleClick: {
        type: Function,
        default: () => { }
    },
    messageCount: {
        type: Number,
        default: 0
    }
})
//跳转个人中心
const callParentFn  = () => {
    handleClick()
}
</script>

<style lang="scss" scoped>
.custom-nav-bar {
    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 20;
        width: 100%;
        // background: linear-gradient(to bottom, transparent, #fff 400rpx),
        //     linear-gradient(to right, #beecd8 20%, #F4E2D8);

        .statusBar {}

        .titleBar {
            display: flex;
            align-items: center;
            justify-content: start;
            padding: 0 30rpx;

            .title {
                font-size: 40rpx;
                font-weight: 700;
                color: $uni-text-color;
            }

            .search {
                width: 220rpx;
                height: 50rpx;
                border-radius: 60rpx;
                background: rgba(255, 255, 255, 0.4);
                border: 1px solid #fff;
                margin-left: 30rpx;
                color: #999;
                font-size: 28rpx;
                display: flex;
                align-items: center;

                .icon {
                    margin-left: 5rpx;
                }

                .text {
                    padding-left: 10rpx;
                }
            }

        }
    }

    .fill {}
}
</style>
