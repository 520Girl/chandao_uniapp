<template>
  <view class="amx-index" :class="appThemeClass">
    <HeaderBar :headerHeight="headerHeight" :titleHeight="titleHeight" />
    
    <!-- 页面内容区域 -->
    <view class="content" :style="{ paddingTop: headerHeight, paddingBottom: (120 + safeBottomHeight) + 'rpx' }">
      顶部元素占位
      <ImageBox  class="logo" :imgurl="'/static/logo.png'" />
      {{headerHeight}}
      
      <view class="text-area">
        <text class="title theme-toggle-btn">{{ title }}</text>
      </view>
      <view class="mt-8 p-4 card-surface">
        <text class="text-lg font-bold theme-text">Tailwind CSS 测试</text>
        <view class="mt-2 flex space-x-2">
          <view class="w-4 h-4 bg-red-500 rounded"></view>
          <view class="w-4 h-4 bg-green-500 rounded"></view>
          <view class="w-4 h-4 bg-blue-500 rounded"></view>
        </view>
      </view>
      <view class="mt-8">
        <button class="theme-toggle-btn" @click="onToggle">
          切换主题（当前：{{ themeDisplayName }}）
        </button>
      </view>

      <!-- 页面切换区域 -->
      <view class="page-content mt-8">
        <view v-if="currentTab === 0" class="home-content card-surface">
          <text class="text-lg theme-text">首页内容</text>
        </view>
        <view v-else-if="currentTab === 1" class="question-content card-surface">
          <text class="text-lg theme-text">问题页面内容</text>
        </view>
        <view v-else-if="currentTab === 2" class="answer-content card-surface">
          <text class="text-lg theme-text">回答页面内容</text>
        </view>
        <view v-else-if="currentTab === 3" class="mine-content card-surface">
          <text class="text-lg theme-text">我的页面内容</text>
        </view>
      </view>

      <!-- 主题指示器 -->
      <view class="mt-8 theme-indicator">
        <text>当前主题：{{ themeDisplayName }}</text>
        <text v-if="theme === 'auto'" class="theme-muted">（跟随系统）</text>
      </view>
    </view>

    <!-- 使用 TabBar 组件 -->
    <TabBar :current-tab="currentTab" @tab-change="handleTabChange" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { toggleTheme, getTheme, getActualTheme, watchSystemTheme } from "@/composables/useTheme";
import TabBar from "@/components/TabBar.vue";
import HeaderBar from "@/components/HeaderBar.vue";
import ImageBox from "@/components/Image-box.vue";
import { getStatusBarHeight, getTitleBarHeight, getSafeBottomHeight } from "@/utils/system";

const title = ref("Hello");
const theme = ref(getTheme());
const currentTab = ref(0);
const headerHeight = ref<string>('0rpx');
const titleHeight = ref<number>(88);
const safeBottomHeight = ref(0);

// 计算 App 端主题类名
const appThemeClass = computed(() => {
  const actualTheme = getActualTheme();
  return `app-theme-${actualTheme}`;
});

// 主题显示名称
const themeDisplayName = computed(() => {
  switch (theme.value) {
    case 'light': return '浅色';
    case 'dark': return '深色';
    case 'auto': return '自动';
    default: return '浅色';
  }
});

onMounted(() => {
  // 计算头部总高度：状态栏 + 标题栏
  headerHeight.value = getStatusBarHeight() + titleHeight.value + 'rpx'
  console.log('headerHeight', headerHeight.value,getStatusBarHeight(),titleHeight.value)
  // 获取底部安全区域高度
  safeBottomHeight.value = getSafeBottomHeight();

  // 监听系统主题变化（仅 H5）
  const unwatch = watchSystemTheme((newTheme) => {
    if (theme.value === 'auto') {
      // 如果当前是自动模式，系统主题变化时更新界面
      console.log('系统主题变化:', newTheme);
    }
  });

  // 监听主题变化事件（App 端）
  // #ifdef APP-PLUS
  uni.$on('themeChanged', (newTheme: string) => {
    console.log('App 端主题变化:', newTheme);
    // 强制更新计算属性
    theme.value = getTheme();
  });
  // #endif

  // 清理监听器
  if (unwatch) {
    onUnmounted(unwatch);
  }
});

onUnmounted(() => {
  // #ifdef APP-PLUS
  uni.$off('themeChanged');
  // #endif
});

function onToggle() {
  theme.value = toggleTheme();
  uni.showToast({
    title: '主题变化' + theme.value,
    icon: 'none'
  });
}

function handleTabChange(index: number, path: string) {
  currentTab.value = index;
  console.log('切换到标签页:', index, path);
}
</script>

<style scoped lang="scss">
@include b(index) {
  height: 100vh;
  position: relative;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100vh;
    box-sizing: border-box;
  }
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
  height: 150rpx;
}

.page-content {
  width: 100%;
  padding: 0 40rpx;

  .home-content,
  .question-content,
  .answer-content,
  .mine-content {
    padding: 40rpx;
    border-radius: 20rpx;
    text-align: center;
  }
}
</style>
