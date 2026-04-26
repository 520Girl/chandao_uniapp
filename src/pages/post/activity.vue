<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern pb-[calc(200rpx+env(safe-area-inset-bottom))]">
    <lcrBar :title="'活动详情'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />

    <view v-if="loadError" class="px-6 mt-10 text-center text-sm theme-color-8">
      {{ loadError }}
    </view>
    <view v-else-if="loading" class="py-16 text-center text-sm theme-color-8">加载中…</view>

    <scroll-view v-else-if="detail" scroll-y class="flex-1 min-h-0" :show-scrollbar="false">
      <view class="px-6 pt-6">
        <view class="flex items-start gap-4 mb-10">
          <up-image v-if="templateIconUrl" :src="templateIconUrl" width="120rpx" height="120rpx" radius="24rpx"
            class="shrink-0" mode="aspectFill" />
          <view class="min-w-0 flex-1">
            <text class="text-[#918355] text-xs font-medium tracking-wide block mb-1">{{
              detail.templateName || "共修活动"
              }}</text>
            <text class="theme-color-5 text-2xl font-light leading-snug block break-words">{{
              detail.title
              }}</text>
          </view>
          <view v-if="detail.isTop == 1" class="flex items-start text-[24rpx] flex-col gap-2 mb-3 theme-color-6 leading-relaxed">
            <text class="iconfont icon-tuding text-[48rpx] theme-color-1" />
          </view>
        </view>

        <view class="mb-10">
          <view class="flex items-center gap-2 mb-3">
            <view class="w-1 h-4 bg-primary rounded-full" />
            <text class="text-primary text-xs uppercase tracking-widest font-semibold">时光约定</text>
          </view>
          <view
            class="flex items-center gap-4 p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-white/60 dark:border-white/5">
            <view class="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <text class="iconfont icon-calendar-today text-[48rpx] theme-color-1" />
            </view>
            <view class="min-w-0 flex-1 text-center">
              <text class="theme-color-5 text-base leading-relaxed block whitespace-pre-wrap ">{{
                timeRangeText
                }}</text>
            </view>
          </view>
        </view>

        <view v-if="detail.content?.trim()" class="mb-10">
          <view class="flex items-center gap-2 mb-3">
            <view class="w-1 h-4 bg-primary rounded-full" />
            <text class="text-primary text-xs uppercase tracking-widest font-semibold">活动说明</text>
          </view>

          <view class="bg-primary/5 dark:bg-primary/10 p-6 rounded-xl relative overflow-hidden">
            <view class="flex items-start flex-col gap-2 mb-3 theme-color-6 leading-relaxed">
              <text class="text-sm ">目标冥想时间：{{ detail.targetMeditationSeconds / 60 }}分钟</text>
              <text class="text-sm ">通过百分比：{{ detail.passPercent }}%</text>
            </view>
            <text class="theme-color-5 text-base font-light leading-relaxed block whitespace-pre-wrap">{{
              detail.content
              }}</text>
          </view>
        </view>

        <view class="mb-10">
          <view class="flex items-center gap-2 mb-3">
            <view class="w-1 h-4 bg-primary rounded-full" />
            <text class="text-primary text-xs uppercase tracking-widest font-semibold">打卡概况</text>
          </view>
          <view class="flex gap-4 mb-4">
            <view class="flex-1 rounded-xl bg-white/50 dark:bg-white/5 border border-[#d4af35]/15 p-4 text-center">
              <text class="text-[#918355] text-xs block mb-1">参与人数</text>
              <text class="text-xl font-semibold theme-color-1">{{
                detail.checkinStats.totalParticipants
                }}</text>
            </view>
            <view class="flex-1 rounded-xl bg-white/50 dark:bg-white/5 border border-[#d4af35]/15 p-4 text-center">
              <text class="text-[#918355] text-xs block mb-1">今日已打卡</text>
              <text class="text-xl font-semibold theme-color-1">{{
                detail.checkinStats.todayCheckinCount
                }}</text>
            </view>
          </view>
          <view v-if="detail.checkinStats.checkinList?.length"
            class="rounded-xl border border-[#d4af35]/10 overflow-hidden bg-white/30">
            <view v-for="(row, idx) in detail.checkinStats.checkinList" :key="`${row.userId}-${idx}`"
              class="flex items-center justify-between px-4 py-3 border-b border-[#d4af35]/10 last:border-b-0">
              <text class="theme-color-5 text-sm truncate flex-1 pr-2">{{ row.userName }}</text>
              <text class="text-[#918355] text-xs shrink-0">连续 {{ row.checkinDays }} 天<text v-if="row.todayChecked"
                  class="theme-color-1 ml-1">· 今日已打卡</text></text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view v-if="detail && !loading"
      class="fixed bottom-0 left-0 right-0 px-6 pt-3 pb-[calc(24rpx+env(safe-area-inset-bottom))] bg-theme-bg/95 backdrop-blur border-t border-[#d4af35]/10">
      <view v-if="showJoinBtn" class="flex justify-center">
        <button
          class="w-full max-w-md bg-primary text-white py-3 rounded-full text-sm font-medium tracking-widest disabled:opacity-50"
          :disabled="actionLoading" @click="onJoin">
          {{ actionLoading ? "处理中…" : "加入活动" }}
        </button>
      </view>
      <view v-else-if="showCheckinBtn" class="flex justify-center">
        <button
          class="w-full max-w-md bg-theme-1 text-white py-3 rounded-full text-sm font-medium tracking-widest disabled:opacity-50"
          :disabled="actionLoading" @click="onCheckin">
          {{ actionLoading ? "处理中…" : "今日打卡" }}
        </button>
      </view>
      <view v-else-if="isMember && activityHasEnded" class="text-center py-3 text-sm theme-color-8">
        活动已结束
      </view>
      <view v-else-if="meRow?.todayChecked" class="text-center py-3 text-sm theme-color-1 font-medium">
        今日已打卡
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { fetchActivityDetail, postActivityCheckin, postActivityJoin } from "@/assets/js/api/activity";
import { config } from "@/assets/js/config";
import { useUserStore } from "@/stores/user";
import type { ActivityCheckinDTO, ActivityDetail } from "@/types/api/activity";
import { unwrapApiData } from "@/utils/apiResponse";
import { formatDate, parseCrossPlatformDateInput } from "@/utils";
import { getCurrentLatLng } from "@/utils/location";
import { navigateBack } from "@/utils/navigation";
import lcrBar from "@/components/lcrBar.vue";

const userStore = useUserStore();
const { userID } = storeToRefs(userStore);

const activityId = ref(0);
/** 本页刚调用加入成功、详情尚未出现本人行时的短暂态；最终以 checkinList 是否含当前用户为准 */
const sessionJoined = ref(false);
// 阅读消息
const queryType = ref("");

const loading = ref(true);
const loadError = ref("");
const detail = ref<ActivityDetail | null>(null);
const actionLoading = ref(false);

function resolveMediaUrl(raw: string | null | undefined): string {
  const u = (raw || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return `https:${u}`;
  const base = config.baseURL.replace(/\/+$/, "");
  const path = u.startsWith("/") ? u : `/${u}`;
  return `${base}${path}`;
}

const templateIconUrl = computed(() =>
  detail.value?.templateIcon ? resolveMediaUrl(detail.value.templateIcon) : "",
);

const timeRangeText = computed(() => {
  const d = detail.value;
  if (!d) return "时间待定";
  const s = d.startDate?.trim();
  const e = d.endDate?.trim();
  if (s && e) {
    return `${formatDate(s, "YYYY-MM-DD HH:mm")}\n～\n${formatDate(e, "YYYY-MM-DD HH:mm")}`;
  }
  return s || e || "时间待定";
});

const meRow = computed(() => {
  const uid = userID.value;
  const list = detail.value?.checkinStats?.checkinList;
  if (uid == null || !list?.length) return undefined;
  return list.find((r) => r.userId === uid);
});

/** 是否已加入活动：以详情返回的 `checkinList` 中是否存在当前 `userId` 为准，不接受仅 URL `joined=1` */
const isMember = computed(() => {
  if (userID.value == null) return false;
  if (meRow.value) return true;
  return sessionJoined.value;
});

/** 当前时间已超过 `endDate` 则视为已结束，不可再打卡；无/无效 `endDate` 时不限制 */
const activityHasEnded = computed(() => {
  const d = detail.value;
  if (!d) return false;
  const raw = d.endDate?.trim();
  if (!raw) return false;
  const end = parseCrossPlatformDateInput(raw);
  if (Number.isNaN(end.getTime())) return false;
  return Date.now() > end.getTime();
});

const showJoinBtn = computed(() => !isMember.value);
const showCheckinBtn = computed(
  () => isMember.value && !meRow.value?.todayChecked && !activityHasEnded.value,
);

async function loadActivity() {
  if (!activityId.value) {
    loadError.value = "缺少活动信息";
    loading.value = false;
    return;
  }
  loading.value = true;
  loadError.value = "";
  try {
    const res = await fetchActivityDetail({ id: activityId.value });
    const data = unwrapApiData<ActivityDetail>(res);
    if (!data) {
      loadError.value = "暂无活动数据";
      detail.value = null;
      return;
    }
    detail.value = data;
    const uid = userID.value;
    if (uid != null) {
      const inList = data.checkinStats?.checkinList?.some((r) => r.userId === uid) ?? false;
      if (inList) {
        sessionJoined.value = false;
      }
    }
  } catch (e) {
    console.error("fetchActivityDetail", e);
    loadError.value = "加载失败，请稍后重试";
    detail.value = null;
  } finally {
    loading.value = false;
  }
}

async function onJoin() {
  if (!activityId.value || actionLoading.value) return;
  actionLoading.value = true;
  try {
    await postActivityJoin({ id: activityId.value });
    sessionJoined.value = true;
    uni.showToast({ title: "加入成功", icon: "success" });
    await loadActivity();
  } catch (e) {
    console.error("postActivityJoin", e);
    uni.showToast({ title: "加入失败", icon: "none" });
  } finally {
    actionLoading.value = false;
  }
}

async function onCheckin() {
  if (!activityId.value || actionLoading.value) return;
  if (activityHasEnded.value) {
    uni.showToast({ title: "活动已结束，无法打卡", icon: "none" });
    return;
  }
  actionLoading.value = true;
  const body: ActivityCheckinDTO = { id: activityId.value };
  try {
    try {
      // const pos = await getCurrentLatLng();
      // body.lat = pos.latitude;
      // body.lng = pos.longitude;
      // if (pos.accuracy != null) body.accuracy = pos.accuracy;
    } catch {
      /* 未授权或定位失败时仍尝试仅 id 打卡，由后端按活动规则校验 */
    }
    await postActivityCheckin(body);
    uni.showToast({ title: "打卡成功", icon: "success" });
    await loadActivity();
  } catch (e) {
    console.error("postActivityCheckin", e);
    uni.showToast({ title: "打卡失败", icon: "none" });
  } finally {
    actionLoading.value = false;
  }
}

function onBack() {
  navigateBack();
}

onLoad((options) => {
  const q = options ?? {};
  const id = Number(q.id);
  activityId.value = Number.isFinite(id) && id > 0 ? id : 0;
});

onShow(() => {
  if (activityId.value) {
    loadActivity();
  } else {
    loading.value = false;
    loadError.value = "缺少活动信息";
  }
});
</script>

<style scoped lang="scss"></style>
