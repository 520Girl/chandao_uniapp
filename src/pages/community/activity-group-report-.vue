<template>
  <view class="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden box-border pb-24 theme-bg cloud-pattern">
    <lcrBar :title="'共修报告'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'home'" />

    <view class="flex-1 px-6 pt-4 flex flex-col gap-4 min-w-0">
      <view v-if="loading" class="text-center text-sm theme-color-8 py-8">加载中…</view>
      <view
        v-else-if="loadError"
        class="text-center text-sm text-red-600/90 py-8 active:opacity-80"
        @tap="retryLoad">
        {{ loadError }}（点击重试）
      </view>
      <view v-else-if="!result" class="text-center text-sm theme-color-8 py-8">暂无榜单数据</view>
      <template v-else>
        <view class="rounded-3xl bg-white/25 border border-white/30 p-4 space-y-2 min-w-0">
          <view class="font-headline text-[32rpx] theme-color-7 line-clamp-2">{{ titleLine }}</view>
          <view class="text-[22rpx] text-on-surface-variant/80 leading-relaxed space-y-1">
            <view>阶段：{{ phaseLabel }} · 活动 ID：{{ result.activityId }}</view>
            <view>计划：{{ result.startAt }} ~ {{ result.endAt }}</view>
            <view>统计窗：{{ result.rankWindowStartAt }} ~ {{ result.rankWindowEndAt }}</view>
            <view>榜宽限：{{ result.rankGraceSeconds }} 秒</view>
            <view v-if="rosterLine" class="line-clamp-3">{{ rosterLine }}</view>
          </view>
        </view>

        <view
          class="flex justify-center items-center bg-surface-container-low/50 rounded-full p-1.5 max-w-full mx-auto px-1 box-border gap-1 flex-wrap">
          <view
            v-for="(tab, idx) in tabsFixed"
            :key="tab.key"
            :class="idx === tabIndex ? rangePillActive : rangePillIdle"
            @tap="tabIndex = idx">
            {{ tab.label }}
          </view>
        </view>

        <view class="rounded-3xl bg-surface-container-lowest/20 border border-white/30 overflow-hidden min-w-0">
          <view
            v-for="row in currentRows"
            :key="row.userId + '-' + row.rank"
            class="flex items-center gap-3 px-4 py-3 border-b border-white/10 last:border-b-0 min-w-0">
            <text class="font-headline text-[28rpx] theme-color-1 w-10 shrink-0 tabular-nums text-center">{{ row.rank }}</text>
            <image
              class="size-11 rounded-full bg-white/80 shrink-0 border border-primary/10"
              :src="avatarSrc(row.avatarUrl)"
              mode="aspectFill" />
            <view class="flex-1 min-w-0">
              <view class="font-medium text-on-surface truncate">{{ row.nickName || "-" }}</view>
              <view class="text-[22rpx] text-on-surface-variant/80 mt-0.5 tabular-nums">{{ metricLine(row) }}</view>
            </view>
          </view>
          <view v-if="currentRows.length === 0" class="text-center text-sm theme-color-8 py-8">本榜暂无数据</view>
        </view>
      </template>
    </view>
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
const tabsFixed = [
  { key: "duration", label: "时长" },
  { key: "focus", label: "专注" },
  { key: "stability", label: "稳定" },
  { key: "composite", label: "综合" },
] as const;

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
  return `参赛名单（${ids.length} 人）：${ids.join("、")}`;
});

const currentRows = computed((): ActivityRoomRankingEntry[] => {
  const r = result.value?.rankings;
  if (!r) return [];
  const k = tabsFixed[tabIndex.value]?.key;
  if (k === "duration") return r.duration ?? [];
  if (k === "focus") return r.focus ?? [];
  if (k === "stability") return r.stability ?? [];
  return r.composite ?? [];
});

function formatDuration(sec: number): string {
  const s = Math.max(0, Math.floor(Number(sec) || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m} 分 ${String(r).padStart(2, "0")} 秒`;
}

function fmt1(n: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(1);
}

function metricLine(row: ActivityRoomRankingEntry): string {
  const k = tabsFixed[tabIndex.value]?.key;
  if (k === "duration") return `时长 ${formatDuration(row.durationSeconds)}`;
  if (k === "focus") return `专注（加权） ${fmt1(row.focusScoreWeighted)}`;
  if (k === "stability")
    return `体动 ${row.movementCount ?? 0} 次 · 稳定分 ${fmt1(row.stabilityScore)} · 心率(加权) ${fmt1(
      row.avgHeartRateWeighted,
    )}`;
  return `综合分 ${fmt1(row.compositeScore)} · 专注 ${fmt1(row.focusScoreWeighted)} · 时长 ${formatDuration(
    row.durationSeconds,
  )}`;
}

const rangePillActive =
  "px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-white shadow-sm transition-colors shrink-0";
const rangePillIdle =
  "px-4 py-1.5 rounded-full text-xs font-medium text-on-surface-variant/80 active:opacity-80 transition-colors shrink-0";

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
    loadError.value = "加载失败，请检查网络或稍后重试";
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
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
