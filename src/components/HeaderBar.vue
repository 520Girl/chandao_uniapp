<template>
    <view class="amx-headerBar" :style="{ height: headerHeight, paddingTop: statusBarHeight + 'rpx' }"
        :class="appThemeClass">
        <view class="header-content">
            <text class="title">标题{{ statusBarHeight }}{{ user?.username }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getStatusBarHeight, getTitleBarHeight } from '@/utils/system'
import { getActualTheme } from '@/composables/useTheme'
import { useUserStore } from '@/stores/user';

const props = withDefaults(defineProps<{
    headerHeight: string
    titleHeight: number
}>(), {
    headerHeight: '0rpx',
    titleHeight: 0
})
const userStore = useUserStore()
const user = computed(() => userStore.currentUser)
const statusBarHeight = ref(0)


// 计算 App 端主题类名
const appThemeClass = computed(() => {
    const actualTheme = getActualTheme();
    return `app-theme-${actualTheme}`;
});

onMounted(() => {
    statusBarHeight.value = getStatusBarHeight()
})
</script>

<style scoped lang="scss">
.amx-headerBar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.1);
    background: var(--header-bg);
    height: 88rpx; // 标题栏高度
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .header-content {
        .title {
            font-size: 36rpx;
            font-weight: bold;
            color: #fff;
        }
    }
}
</style>