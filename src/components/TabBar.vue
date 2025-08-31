<template>
  <view class="custom-tabbar">
    <view v-for="(item, index) in tabList" :key="index" class="tab-item" :class="{ active: currentTab === index }"
      @click="switchTab(index, item.pagePath)">
      <image :src="currentTab === index ? item.selectedIconPath : item.iconPath" class="tab-icon" mode="aspectFit" />
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TabItem {
  pagePath: string
  text: string
  iconPath: string
  selectedIconPath: string
}

const props = defineProps<{
  currentTab?: number
}>()

const emit = defineEmits<{
  tabChange: [index: number, path: string]
}>()

const tabList: TabItem[] = [
  {
    pagePath: '/pages/index/index',
    text: '首页',
    iconPath: '/static/icon.png',
    selectedIconPath: '/static/icon.png'
  },
  {
    pagePath: '/pages/index/question',
    text: '问题',
    iconPath: '/static/icon.png',
    selectedIconPath: '/static/icon.png'
  },
  {
    pagePath: '/pages/index/answer',
    text: '回答',
    iconPath: '/static/icon.png',
    selectedIconPath: '/static/icon.png'
  },
  {
    pagePath: '/pages/index/mine',
    text: '我的',
    iconPath: '/static/icon.png',
    selectedIconPath: '/static/icon.png'
  }
]

const currentTab = computed(() => props.currentTab || 0)

const switchTab = (index: number, path: string) => {
  emit('tabChange', index, path)
}
</script>

<style lang="scss" scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 999;

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    transition: all 0.3s ease;

    &.active {
      transform: translateY(-4rpx);

      .tab-text {
        color: #fff;
        font-weight: bold;
      }
    }

    .tab-icon {
      width: 48rpx;
      height: 48rpx;
      margin-bottom: 8rpx;
      filter: brightness(0) invert(1);
    }

    .tab-text {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;
    }
  }
}
</style>