<template>
  <view
    class="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden box-border theme-bg meditation-page page-root"
  >
    <lcrBar title="历史心迹" :type="'back'" />

    <scroll-view
      scroll-y
      class="flex-1 min-h-0 w-full max-w-full box-border px-6"
      style="height: 0"
      :lower-threshold="140"
      @scrolltolower="onScrollToLower"
    >
      <view class="w-full max-w-full min-w-0 pt-5 pb-28 space-y-5 box-border">
        <!-- 与心迹首页同系的标题区 -->
        <view class="space-y-1 px-0.5">
          <view class="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/55 font-medium font-label">
            历次静坐
          </view>
          <view class="font-headline text-[40rpx] theme-color-7 leading-tight">过往心迹</view>
          <view class="text-[24rpx] text-on-surface-variant/85 leading-snug max-w-[620rpx]">
            轻点卡片查看当次完整报告
          </view>
        </view>

        <!-- 空状态 -->
        <view
          v-if="rows.length === 0 && !loading"
          class="relative overflow-hidden rounded-[36rpx] border border-white/25 bg-surface-container-lowest/25 px-8 py-16 text-center"
        >
          <view class="absolute -right-6 -bottom-8 text-primary/[0.07] pointer-events-none select-none">
            <text class="iconfont icon-shijian text-[200rpx]" />
          </view>
          <view class="relative z-[1] space-y-3">
            <text class="iconfont icon-shijian text-5xl text-primary/35 block" />
            <view class="font-headline text-[34rpx] theme-color-7">暂无记录</view>
            <view class="text-sm text-on-surface-variant/80 leading-relaxed">
              完成静坐后，这里会留下每一次心迹
            </view>
          </view>
        </view>

        <!-- 列表 -->
        <view v-else class="space-y-4 w-full max-w-full min-w-0">
          <view
            v-for="row in rows"
            :key="row.sessionId"
            class="history-card relative overflow-hidden rounded-[36rpx] border border-white/20 bg-theme-13 p-5 min-w-0 box-border transition-opacity active:opacity-92"
            hover-class="opacity-95"
            @tap="openDetail(row.sessionId)"
          >
            <view class="absolute -right-3 -top-4 text-primary/10 pointer-events-none select-none">
              <text class="iconfont icon-shijian text-[120rpx]" />
            </view>

            <view class="relative z-[1] flex flex-col gap-3 min-w-0">
              <view class="flex justify-between items-start gap-3 min-w-0">
                <view class="space-y-1 min-w-0 flex-1">
                  <view
                    class="text-[10px] tracking-[0.15rem] uppercase text-on-surface-variant/60 font-medium font-label"
                  >
                    单次觉察
                  </view>
                  <view v-if="splitDuration(row.totalDuration)" class="flex flex-wrap items-baseline gap-x-1 gap-y-0">
                    <text class="text-[52rpx] font-semibold text-primary leading-none tabular-nums">
                      {{ splitDuration(row.totalDuration)!.minutes }}
                    </text>
                    <text class="text-[24rpx] font-medium text-primary/75">分</text>
                    <text class="text-[40rpx] font-semibold text-primary tabular-nums leading-none">
                      {{ splitDuration(row.totalDuration)!.seconds }}
                    </text>
                    <text class="text-[22rpx] text-primary/70">秒</text>
                  </view>
                  <view v-else class="text-[40rpx] font-semibold text-on-surface-variant/70">—</view>
                </view>
                <view
                  class="shrink-0 mt-1 px-3 py-1.5 rounded-full bg-white/25 border border-white/30 backdrop-blur-[2px]"
                >
                  <text class="text-[22rpx] text-on-surface-variant font-medium tabular-nums block text-right max-w-[280rpx] truncate">
                    {{ row.createTime || "—" }}
                  </text>
                </view>
              </view>

              <view
                v-if="row.summaryText"
                class="rounded-2xl bg-white/30 border border-white/25 px-4 py-3 text-[24rpx] text-on-surface leading-relaxed line-clamp-3"
              >
                {{ row.summaryText }}
              </view>
              <view
                v-else
                class="rounded-2xl bg-white/15 border border-dashed border-white/25 px-4 py-2.5 text-[22rpx] text-on-surface-variant/75 italic"
              >
                本场暂无摘要，仍可查看完整报告
              </view>

              <view
                class="flex items-center justify-between gap-2 pt-1 border-t border-white/15 mt-0.5 min-w-0"
              >
                <view class="flex items-center gap-1.5 text-[22rpx] text-on-surface-variant/80 min-w-0">
                  <text class="iconfont icon-pingfenxiangguanli text-[22rpx] shrink-0 text-primary/50" />
                  <text class="truncate">会话 #{{ row.sessionId }}</text>
                </view>
                <view class="flex items-center gap-1 shrink-0 text-[24rpx] font-medium text-primary">
                  <text>查看报告</text>
                  <text class="iconfont icon-fanhui1 rotate-180 text-[20rpx] opacity-80" />
                </view>
              </view>
            </view>
          </view>
        </view>

        <view v-if="loading" class="flex flex-col items-center justify-center py-8 gap-2">
          <view class="h-1 w-24 rounded-full bg-primary/20 overflow-hidden">
            <view class="history-loading-bar h-full w-1/3 rounded-full bg-primary/55" />
          </view>
          <text class="text-xs tracking-widest text-on-surface-variant/70 font-label">加载中</text>
        </view>

        <view
          v-else-if="finished && rows.length > 0"
          class="text-center pt-2 pb-6 space-y-2"
        >
          <view class="h-px w-16 mx-auto bg-primary/15 rounded-full" />
          <text class="text-[22rpx] text-on-surface-variant/65 tracking-wide">已展示全部心迹</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { fetchMeditationReportHistory } from "@/assets/js/api/meditation";
import lcrBar from "@/components/lcrBar.vue";
import type { MeditationReportHistoryListItem } from "@/types/api/meditation";
import { useUserStore } from "@/stores/user";
import { unwrapApiData } from "@/utils/apiResponse";
import { parseMeditationReportHistoryPayload } from "@/utils/meditationReport";

const PAGE_SIZE = 10;

const userStore = useUserStore();
const rows = ref<MeditationReportHistoryListItem[]>([]);
const nextPage = ref(1);
const loading = ref(false);
const finished = ref(false);

function splitDuration(sec: number | undefined): { minutes: string; seconds: string } | null {
  if (sec == null || !Number.isFinite(sec) || sec <= 0) return null;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return { minutes: String(m), seconds: String(s).padStart(2, "0") };
}

async function loadNext(): Promise<void> {
  if (loading.value || finished.value) return;
  if (!userStore.isLoggedIn) return;
  loading.value = true;
  try {
    const p = nextPage.value;
    const res = await fetchMeditationReportHistory({ page: p, size: PAGE_SIZE });
    const raw = unwrapApiData<unknown>(res);
    const { list, total } = parseMeditationReportHistoryPayload(raw);
    rows.value.push(...list);
    if (list.length === 0) {
      finished.value = true;
      return;
    }
    if (total != null && total > 0 && rows.value.length >= total) {
      finished.value = true;
      return;
    }
    if (list.length < PAGE_SIZE) {
      finished.value = true;
      return;
    }
    nextPage.value = p + 1;
  } catch (e) {
    console.error("fetchMeditationReportHistory", e);
    uni.showToast({ title: "加载失败", icon: "none" });
  } finally {
    loading.value = false;
  }
}

function onScrollToLower(): void {
  void loadNext();
}

function openDetail(sessionId: number): void {
  if (!Number.isFinite(sessionId) || sessionId <= 0) {
    uni.showToast({ title: "无效会话", icon: "none" });
    return;
  }
  uni.navigateTo({
    url: `/pages/meditation/report?sessionId=${sessionId}`,
  });
}

onMounted(() => {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: "登录后查看", icon: "none" });
    setTimeout(() => uni.navigateBack(), 400);
    return;
  }
  void loadNext();
});
</script>

<style scoped lang="scss">
.page-root {
  height: 100vh;
}

.history-card {
  box-shadow: 0 8rpx 32rpx rgba(43, 37, 24, 0.06);
}

@keyframes history-load-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(320%);
  }
}

.history-loading-bar {
  animation: history-load-slide 1.1s ease-in-out infinite;
}
</style>
