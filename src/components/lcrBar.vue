<template>
    <view class="custom-nav-bar ">
        <view class="navbar theme-bg ethereal-blur">
            <view class="statusBar" :style="{ height: getStatusBarHeight() + 'px' }"></view>
            <view class="titleBar" :style="{ height: getTitleBarHeight() + 'px', marginLeft: getTitleLogo() + 'rpx' }">
                <view
                    class="flex items-center justify-between border-b border-[#d4af35]/5" :style="{ width: 'calc(100vw - ' + getMenuButtonWidth() + 'px)' }">
                    <view class="left-actions" v-if="type === 'all'">
                        <view @click="onBack" class="left-btn">
                            <text class="iconfont icon-fanhui1 left-icon"></text>
                        </view>
                        <view class="left-divider"></view>
                        <view @click="onHome" class="left-btn">
                            <text class="iconfont icon-fangzi left-icon"></text>
                        </view>
                    </view>
                    <view class="left-actions" style="padding:0;"v-else-if="type === 'back'">
                         <view @click="onBack" class="left-btn">
                            <text class="iconfont icon-fanhui1 left-icon"></text>
                        </view>
                    </view>
                    <view v-else>
                      
                    </view>
                    
                    
                    <view class=" flex items-center justify-center rounded-full flex-1">
                        <h1 class="text-[36rpx] font-bold tracking-tight">{{title}}</h1>
                    </view>
                </view>
            </view>
        </view>
        <view class="fill" :style="{ height: getNavbarHeight() + 'px' }">

        </view>
    </view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight, getNavbarHeight, getTitleLogo,getMenuButtonWidth } from '@/utils/system'
defineProps({
    title: {
        type: String,
        default: "首页"
    },
    onBack: {
        type: Function,
        default: () => {
            uni.navigateBack();
         }
    },
    type: {
        type: String,
        default: "back"
    },
    onHome: {
        type: Function,
        default: () => { 
            uni.switchTab({
                url: '/pages/index/home'
            })
        }
    },

})

</script>

<style lang="scss" scoped>
.custom-nav-bar {
    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        // background: linear-gradient(to bottom, transparent, #fff 400rpx),
        //     linear-gradient(to right, #beecd8 20%, #F4E2D8);

        .titleBar {
            display: flex;
            align-items: center;
            justify-content: start;
            padding: 0 30rpx;

            .left-actions {
                display: flex;
                align-items: center;
                height: 60rpx;
                padding: 0 8rpx;
                border-radius: 999rpx;
                border: 1px solid rgba(0, 0, 0, 0.12);
                background: #fff;
                box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
                flex-shrink: 0;

                .left-btn {
                    width: 62rpx;
                    height: 62rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }

                .left-icon {
                    font-size: 34rpx;
                    color: #1f1f1f;
                }

                .left-divider {
                    width: 1px;
                    height: 34rpx;
                    background: rgba(0, 0, 0, 0.15);
                }
            }

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
}
</style>
