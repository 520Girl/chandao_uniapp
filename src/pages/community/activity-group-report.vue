<template>
  <view class="page-root flex flex-col min-h-screen w-full max-w-full overflow-x-hidden box-border theme-bg cloud-pattern">
    <lcrBar title="共修报告" :on-back="onBack" type="home" />

    <view v-if="loading" class="flex-1 flex flex-col items-center justify-center pt-32 px-6 gap-4">
      <text
        class="iconfont icon-nest_clock_farsight_analog_24dp_595959_FILL0_wght4 theme-color-1 text-[56rpx] opacity-80" />
      <text class="text-[26rpx] theme-color-7 tracking-wide">榜单加载中…</text>
    </view>

    <view v-else-if="loadError" class="flex-1 flex flex-col items-center justify-center pt-24 px-8 gap-4">
      <text class="iconfont icon-huodong theme-color-6 text-[56rpx] opacity-50" />
      <text class="text-center text-[28rpx] theme-color-8 leading-relaxed">{{ loadError }}</text>
      <view
        class="mt-4 px-10 py-3 rounded-full border border-primary/25 bg-white/60 dark:bg-white/5 active:opacity-80"
        @tap="retryLoad">
        <text class="font-label text-[24rpx] tracking-[0.2em] theme-color-1 uppercase font-bold">重试</text>
      </view>
    </view>

    <scroll-view v-else scroll-y class="flex-1 min-h-0 w-full" :show-scrollbar="false">
      <view class="px-5 pt-4 pb-32 flex flex-col gap-5 min-w-0">
        <!-- 活动标题 + 阶段 -->
        <view class="text-center">
          <text class="block font-serif italic text-[40rpx] theme-color-1 leading-snug line-clamp-2">{{
            titleLine
          }}</text>
          <view class="mt-2 flex flex-wrap items-center justify-center gap-2">
            <text class="font-label text-[20rpx] tracking-[0.25em] theme-color-5 uppercase">{{ phaseLabel }}</text>
            <text class="text-[22rpx] theme-color-7">· 活动 #{{ result?.activityId }}</text>
          </view>
        </view>

        <!-- 统计窗说明 -->
        <view v-if="result" class="rounded-2xl border border-primary/10 bg-white/50 dark:bg-white/5 px-4 py-3">
          <view class="flex items-center gap-2">
            <text class="iconfont icon-calendar-today theme-color-1 text-[36rpx] shrink-0 mt-0.5" />
            <view class="min-w-0 flex-1">
              <text class="block text-[24rpx] font-medium theme-color-8 leading-relaxed">计划：{{ result.startAt }} ~ {{ result.endAt }}</text>
              <text class="block text-[22rpx] theme-color-7 mt-1 leading-relaxed">
                有效统计窗（±{{ result.rankGraceSeconds }}s）：{{ result.rankWindowStartAt }} ~ {{ result.rankWindowEndAt }}
              </text>
            </view>
          </view>
          <view v-if="rosterLine" class="mt-2 pt-2 border-t border-primary/10">
            <text class="text-[22rpx] theme-color-6 leading-relaxed">{{ rosterLine }}</text>
          </view>
        </view>

        <!-- 今日 spotlight：体动榜第 1（少动优先） -->
        <view v-if="spotlightEntry" class="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/8 to-transparent px-5 py-8">
          <view class="absolute -right-6 -top-6 size-28 rounded-full bg-primary/5 pointer-events-none" />
          <view class="flex flex-col items-center relative z-[1]">
            <text class="font-label text-[20rpx] uppercase tracking-[0.35em] theme-color-5 mb-4">本场共修 spotlight</text>
            <view class="relative mb-4">
              <view class="w-[200rpx] h-[200rpx] rounded-full overflow-hidden border-2 border-primary/40 p-1 bg-white dark:bg-zinc-900 shadow-md">
                <image class="w-full h-full rounded-full" :src="avatarSrc(spotlightEntry.avatarUrl)" mode="aspectFill" />
              </view>
              <view class="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary px-1 py-1 rounded-full shadow">
                <text class="text-[20rpx] text-white font-bold tracking-wider">TOP 1</text>
              </view>
            </view>
            <text class="font-headline text-[36rpx] theme-color-1 mb-1">{{ displayNick(spotlightEntry.nickName) }}</text>
            <text class="text-[22rpx] theme-color-7 mb-4">体动最少 · 共修时长 {{ formatDuration(spotlightEntry.durationSeconds) }}</text>
            <view class="flex flex-wrap justify-center gap-3">
              <view class="stat-pill">
                <text class="iconfont icon-heart-fill theme-color-1 text-[28rpx]" />
                <text class="font-headline text-[30rpx] theme-color-8">{{ fmt1(spotlightEntry.avgHeartRateWeighted) }}</text>
                <text class="text-[18rpx] theme-color-6">bpm</text>
              </view>
              <view class="stat-pill">
                <text class="iconfont icon-wind theme-color-1 text-[28rpx]" />
                <text class="font-headline text-[30rpx] theme-color-8">{{ fmt1(spotlightEntry.avgBreathRateWeighted) }}</text>
                <text class="text-[18rpx] theme-color-6">次/分</text>
              </view>
              <view class="stat-pill">
                <text class="iconfont icon-directions_run theme-color-1 text-[28rpx]" />
                <text class="font-headline text-[30rpx] theme-color-8">{{ spotlightEntry.movementCount }}</text>
                <text class="text-[18rpx] theme-color-6">体动</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 三榜 Tab -->
        <view class="flex flex-row flex-nowrap gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <view
            v-for="(tab, i) in tabs"
            :key="tab.key"
            class="shrink-0 px-4 py-2.5 rounded-full border transition-all active:scale-[0.98]"
            :class="tabIndex === i ? tabPillActive : tabPillIdle"
            @tap="tabIndex = i">
            <text :class="['iconfont mr-1.5', tab.icon, tabIndex === i ? 'text-white' : 'theme-color-1']" />
            <text class="text-[24rpx] font-bold" :class="tabIndex === i ? 'text-white' : 'theme-color-8'">{{ tab.label }}</text>
          </view>
        </view>
        <text class="text-[20rpx] theme-color-6 px-1 -mt-2">{{ rankingRuleHint }}</text>

        <!-- 榜单列表 -->
        <view v-if="!currentRows.length" class="py-16 flex flex-col items-center gap-3">
          <text class="iconfont icon-flag theme-color-6 text-[48rpx] opacity-40" />
          <text class="text-[24rpx] theme-color-7">该榜单暂无数据</text>
        </view>

        <view v-else class="flex flex-col gap-3">
          <view class="flex justify-between items-center border-b border-primary/10 pb-3 px-1">
            <text class="font-label text-[20rpx] tracking-[0.2em] theme-color-5 uppercase">名次</text>
            <text class="font-label text-[20rpx] tracking-[0.2em] theme-color-5 uppercase">成员与数据</text>
          </view>

          <view
            v-for="row in currentRows"
            :key="'rk-' + tabs[tabIndex].key + '-' + row.userId"
            class="rank-row flex items-center justify-between gap-3 py-3 border-b border-primary/5 last:border-0">
            <view class="flex items-center gap-3 min-w-0 flex-1">
              <text class="font-headline italic text-[32rpx] theme-color-5 w-[52rpx] text-center shrink-0">{{
                String(row.rank).padStart(2, "0")
              }}</text>
              <image class="size-12 rounded-full border border-primary/15 shrink-0 bg-white" :src="avatarSrc(row.avatarUrl)" mode="aspectFill" />
              <view class="min-w-0 flex-1">
                <text class="block font-medium text-[28rpx] theme-color-8 truncate">{{ displayNick(row.nickName) }}</text>
                <text class="block text-[20rpx] theme-color-6 mt-0.5 truncate">时长 {{ formatDuration(row.durationSeconds) }}</text>
              </view>
            </view>
            <view class="flex items-end gap-4 shrink-0">
              <view class="flex flex-col items-center w-[88rpx]">
                <text class="iconfont icon-heart-fill theme-color-1 text-[26rpx] mb-0.5" />
                <text class="font-headline text-[26rpx] theme-color-8 tabular-nums">{{ fmt1(row.avgHeartRateWeighted) }}</text>
              </view>
              <view class="flex flex-col items-center w-[88rpx]">
                <text class="iconfont icon-wind theme-color-1 text-[26rpx] mb-0.5" />
                <text class="font-headline text-[26rpx] theme-color-8 tabular-nums">{{ fmt1(row.avgBreathRateWeighted) }}</text>
              </view>
              <view class="flex flex-col items-center w-[88rpx]">
                <text class="iconfont icon-directions_run theme-color-1 text-[26rpx] mb-0.5" />
                <text class="font-headline text-[26rpx] theme-color-8 tabular-nums">{{ row.movementCount }}</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="result && currentRows.length" class="rounded-xl bg-primary/5 px-3 py-2">
          <text class="text-[20rpx] theme-color-6 leading-relaxed">
            说明：心率、呼吸为按报告时长加权后的均值；体动为报告次数合计。会话须完全落在有效统计窗内方参与汇总。
          </text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { fetchActivityDetail, fetchActivityRoomResult } from "@/assets/js/api/activity";
import { config } from "@/assets/js/config";
import lcrBar from "@/components/lcrBar.vue";
import type { ActivityDetail, ActivityRoomRankingEntry, ActivityRoomResultData } from "@/types/api/activity";
import { parseRoomResultFromResponse } from "@/utils/activityRoomPayload";
import { unwrapApiData } from "@/utils/apiResponse";
import { navigateBack } from "@/utils/navigation";

const activityId = ref(0);
const loading = ref(true);
const loadError = ref("");
const result = ref<ActivityRoomResultData | null>(null);
const activityTitle = ref("");

const tabIndex = ref(0);
const tabs = [
  { key: "avgHeartRate" as const, label: "平均心率", icon: "icon-heart-fill" },
  { key: "avgBreathRate" as const, label: "平均呼吸", icon: "icon-wind" },
  { key: "movementCount" as const, label: "体动", icon: "icon-directions_run" },
];

const tabPillActive =
  "border-primary bg-primary text-white shadow-sm shadow-primary/20";
const tabPillIdle =
  "border-primary/15 bg-white/60 dark:bg-white/5 theme-color-8";

function resolveMediaUrl(raw: string | null | undefined): string {
  const u = (raw || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return `https:${u}`;
  const base = config.baseURL.replace(/\/+$/, "");
  const path = u.startsWith("/") ? u : `/${u}`;
  return `${base}${path}`;
}

function avatarSrc(raw: string | null | undefined): string {
  const u = resolveMediaUrl(raw);
  return u || "/static/logo.png";
}

function displayNick(n: string | undefined | null): string {
  const s = (n || "").trim();
  return s && s !== "-" ? s : "匿名";
}

const titleLine = computed(() => {
  const r = result.value;
  if (!r) return "";
  const name = activityTitle.value?.trim();
  if (name) return name;
  return `共修榜单 · 活动 #${r.activityId}`;
});

const phaseLabel = computed(() => {
  const p = result.value?.phase ?? 0;
  if (p === 1) return "进行中";
  if (p === 2) return "已结算";
  return "待开场";
});

const rosterLine = computed(() => {
  const ids = result.value?.rosterUserIds;
  if (!ids?.length) return "";
  const preview = ids.slice(0, 12).join("、");
  if (ids.length <= 12) return `参赛名单（${ids.length} 人）：${preview}`;
  return `参赛名单（${ids.length} 人）：${preview}…`;
});

/** 体动榜第一名（少动优先）作为 spotlight；无则用心率榜第一 */
const spotlightEntry = computed((): ActivityRoomRankingEntry | null => {
  const r = result.value?.rankings;
  if (!r) return null;
  const mv = r.movementCount;
  if (mv.length) return mv[0] ?? null;
  const ah = r.avgHeartRate;
  if (ah.length) return ah[0] ?? null;
  return null;
});

const currentRows = computed((): ActivityRoomRankingEntry[] => {
  const r = result.value?.rankings;
  if (!r) return [];
  const k = tabs[tabIndex.value]?.key;
  if (k === "avgHeartRate") return r.avgHeartRate;
  if (k === "avgBreathRate") return r.avgBreathRate;
  return r.movementCount;
});

const rankingRuleHint = computed(() => {
  const k = tabs[tabIndex.value]?.key;
  if (k === "avgHeartRate") return "排序：加权平均心率 · 降序";
  if (k === "avgBreathRate") return "排序：加权平均呼吸率 · 降序";
  return "排序：体动次数 · 升序（少动靠前）";
});

function formatDuration(sec: number): string {
  const s = Math.max(0, Math.floor(Number(sec) || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m <= 0) return `${r} 秒`;
  return `${m} 分 ${String(r).padStart(2, "0")} 秒`;
}

function fmt1(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(1);
}

async function loadActivityTitle() {
  if (!activityId.value) return;
  try {
    const res = await fetchActivityDetail({ id: activityId.value });
    const d = unwrapApiData<ActivityDetail>(res);
    if (d?.title?.trim()) activityTitle.value = d.title.trim();
  } catch {
    /* 标题可选 */
  }
}

async function load() {
  loadError.value = "";
  if (!Number.isFinite(activityId.value) || activityId.value <= 0) {
    loading.value = false;
    result.value = null;
    loadError.value = "缺少活动 id";
    return;
  }
  loading.value = true;
  try {
    await loadActivityTitle();
    const res = await fetchActivityRoomResult({ id: activityId.value });
    const data = parseRoomResultFromResponse(res);
    if (data) {
      result.value = data;
    } else {
      result.value = null;
      loadError.value = "榜单数据解析失败";
      console.warn("parseRoomResultFromResponse: unexpected payload", res);
    }
  } catch (e) {
    console.error("fetchActivityRoomResult", e);
    result.value = null;
    loadError.value = "加载失败，请检查网络或登录后重试";
  } finally {
    loading.value = false;
  }
}

function retryLoad() {
  void load();
}

onLoad((q) => {
  const raw = q?.id;
  const n = typeof raw === "string" || typeof raw === "number" ? Number(raw) : NaN;
  activityId.value = Number.isFinite(n) ? n : 0;
  void load();
});

const onBack = () => navigateBack();
</script>

<style scoped lang="scss">
.page-root {
  padding-bottom: env(safe-area-inset-bottom);
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(212, 175, 53, 0.2);
}

.dark .stat-pill {
  background: rgba(0, 0, 0, 0.25);
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

.rank-row:active {
  opacity: 0.92;
}
</style>
