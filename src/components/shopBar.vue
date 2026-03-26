<template>
    <view class="custom-nav-bar">
        <view class="navbar theme-bg ethereal-blur">
            <view class="statusBar" :style="{height:getStatusBarHeight()+'px'}"></view>
            <view class="titleBar" :style="{height:getTitleBarHeight()+15+'px',marginLeft:getTitleLogo()+'rpx'}">
                <view class="title">{{ title }}</view>
                <navigator url="/pages/search/search" class="search">
                    <text class="iconfont icon-search search-icon text-[36rpx]"></text>
                    <text class="text">搜索</text>
                </navigator>
            </view>
        </view>
        <view class="fill" :style="{height: getNavbarHeight()+ 15+'px'}">

        </view>
    </view>
</template>

<script setup >
import { ref, reactive } from "vue"
import { getStatusBarHeight, getTitleBarHeight,getNavbarHeight,getTitleLogo } from '@/utils/system'
defineProps({
    title: {
        type: String,
        default: "首页"
    }
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
