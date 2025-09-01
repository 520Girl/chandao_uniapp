<template>
  <view class="custom-tabbar"
    :style="{ paddingBottom: safeBottomHeight + 'rpx', height: 120 + safeBottomHeight + 'rpx' }" :class="appThemeClass">
    <view v-for="(item, index) in tabList" :key="index" class="tab-item" :class="{ active: currentTab === index }"
      @click="switchTab(index, item.pagePath)">
      <image :src="currentTab === index ? item.selectedIconPath : item.iconPath" class="tab-icon" mode="scaleToFill" />
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getSafeBottomHeight } from '@/utils/system'
import { getActualTheme } from '@/composables/useTheme'

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

const safeBottomHeight = ref(0)

// 计算 App 端主题类名
const appThemeClass = computed(() => {
  const actualTheme = getActualTheme();
  return `app-theme-${actualTheme}`;
});

const tabList: TabItem[] = [
  {
    pagePath: '/pages/index/index',
    text: '首页',
    iconPath: '/static/logo.png',
    selectedIconPath: '/static/logo.png'
  },
  {
    pagePath: '/pages/index/question',
    text: '问题',
    iconPath: '/static/logo.png',
    selectedIconPath: '/static/logo.png'
  },
  {
    pagePath: '/pages/index/answer',
    text: '回答',
    iconPath: '/static/logo.png',
    selectedIconPath: '/static/logo.png'
  },
  {
    pagePath: '/pages/index/mine',
    text: '我的',
    iconPath: '/static/logo.png',
    selectedIconPath: '/static/logo.png'
  }
]

const currentTab = computed(() => props.currentTab || 0)

onMounted(() => {
  safeBottomHeight.value = getSafeBottomHeight()
})

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
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 999;
  background: var(--tabbar-bg);

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
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

      uni-image>img {
        width: 48rpx;
        height: 48rpx;
      }
    }

    .tab-text {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;
    }
  }
}
</style>