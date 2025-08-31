<template>
    <view class="question-page">
        <view class="header">
            <text class="title">问题</text>
        </view>
        <view class="content">
            <text class="placeholder">问题页面内容</text>
        </view>
    </view>
</template>

<script setup lang="ts">
// 问题页面逻辑
</script>

<style lang="scss" scoped>
.question-page {
    min-height: 100vh;
    background-color: #f5f5f5;

    .header {
        padding: 20rpx;
        background-color: #fff;
        border-bottom: 1rpx solid #eee;

        .title {
            font-size: 36rpx;
            font-weight: bold;
            color: #333;
        }
    }

    .content {
        padding: 40rpx;
        text-align: center;

        .placeholder {
            font-size: 28rpx;
            color: #999;
        }
    }
}
</style>
