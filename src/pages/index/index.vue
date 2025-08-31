<template>
  <view class="amx-index">
    <!-- 页面内容区域 -->
    <view class="content">
      <image class="logo" src="/static/logo.png" />
      <view class="text-area">
        <text class="title bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">{{ title }}</text>
      </view>
      <view class="mt-8 p-4 bg-gray-100 rounded-lg">
        <text class="text-lg font-bold text-gray-800">Tailwind CSS 测试</text>
        <view class="mt-2 flex space-x-2">
          <view class="w-4 h-4 bg-red-500 rounded"></view>
          <view class="w-4 h-4 bg-green-500 rounded"></view>
          <view class="w-4 h-4 bg-blue-500 rounded"></view>
        </view>
      </view>
      <view class="mt-8">
        <button class="btn-primary" @click="onToggle">切换主题（当前：{{ theme }}）</button>
      </view>

      <!-- 页面切换区域 -->
      <view class="page-content mt-8">
        <view v-if="currentTab === 0" class="home-content">
          <text class="text-lg">首页内容</text>
        </view>
        <view v-else-if="currentTab === 1" class="question-content">
          <text class="text-lg">问题页面内容</text>
        </view>
        <view v-else-if="currentTab === 2" class="answer-content">
          <text class="text-lg">回答页面内容</text>
        </view>
        <view v-else-if="currentTab === 3" class="mine-content">
          <text class="text-lg">我的页面内容</text>
        </view>
      </view>
    </view>

    <!-- 使用 TabBar 组件 -->
    <TabBar :current-tab="currentTab" @tab-change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { toggleTheme, getTheme } from "@/composables/useTheme";
import TabBar from "@/components/TabBar.vue";

const title = ref("Hello");
const theme = ref(getTheme());
const currentTab = ref(0);

function onToggle() {
  theme.value = toggleTheme();
}

function handleTabChange(index: number, path: string) {
  currentTab.value = index;
  console.log('切换到标签页:', index, path);
}
</script>

<style scoped lang="scss">
@include b(index) {
  min-height: 100vh;
  position: relative;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding-bottom: 120rpx; // 为底部导航栏留出空间
  box-sizing: border-box;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.page-content {
  width: 100%;
  padding: 0 40rpx;
  background-color: $primary-color;
  .home-content,
  .question-content,
  .answer-content,
  .mine-content {
    background: rgba(255, 255, 255, 0.9);
    background-color: $primary-color;
    padding: 40rpx;
    border-radius: 20rpx;
    text-align: center;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  }
}
</style>
