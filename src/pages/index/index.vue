<template>
  <view class="content">
    <image class="logo " src="/static/logo.png" />
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
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { toggleTheme, getTheme } from "@/composables/useTheme";

const title = ref("Hello");
const theme = ref(getTheme());

function onToggle() {
  theme.value = toggleTheme();
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: $primary-color;
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
</style>
