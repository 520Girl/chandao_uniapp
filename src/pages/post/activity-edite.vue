<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
      <lcrBar :title="'活动编辑'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
      <view class="px-6  pb-24">
        <!-- view: Theme (Editable) -->
        <view class="mt-8 mb-12">
            <view class="flex items-center gap-2 mb-4">
                <view class="w-1 h-4 bg-primary rounded-full"></view>
                <view class="text-primary text-xs uppercase tracking-widest font-semibold">活动灵魂</view>
            </view>
            <label class="block group">
                <text class="text-[#918355] text-sm font-light mb-2 block">点击描绘活动主题</text>
                <view class="relative">
                    <input
                        class="theme-color-5 w-full h-[100rpx] bg-transparent border-0 border-b border-[#e5e0d2] dark:border-[#4a4538] focus:border-primary focus:ring-0 text-2xl font-light py-2 px-0 placeholder:text-[#d1cdc2] transition-colors"
                        placeholder="输入一个诗意的主题..." type="text" v-model="titleText" />
                    <text
                        class="iconfont icon-Edit absolute right-0 top-1/2 -translate-y-1/2 text-[#918355] text-xl opacity-0 group-hover:opacity-100 transition-opacity"></text>
                </view>
            </label>
        </view>
        <!-- view: Time (Editable) -->
        <view class="mb-12">
            <view
                class="flex items-center justify-between p-3 bg-white/40 dark:bg-white/5 rounded-lg border border-white/60 dark:border-white/5 shadow-sm">
                <view class="flex items-center gap-4">
                    <view class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <text class="iconfont icon-calendar-today text-[48rpx] theme-color-1"></text>
                    </view>
                    <view class="min-w-0 flex-1">
                        <view class="text-[#918355] text-xs font-medium tracking-wide">时光约定</view>
                        <view class="text-[#1a170f] dark:text-[#fbfbf9] text-base leading-relaxed break-words" v-html="activityTimeRangeDisplay">
                            
                        </view>
                    </view>
                </view>
                <view
                    class="text-primary active:opacity-80 transition-opacity"
                    @tap="openActivityDatetime">
                    <text class="iconfont icon-lishidianjihou text-[48rpx] theme-color-1"></text>
                </view>
            </view>
        </view>
        <!-- view: Location (Static) -->
        <view class="mb-12">
            <view class="flex items-start gap-4 px-2">
                <view class="size-12 shrink-0 flex items-center justify-center text-[#918355]">
                    <text class="iconfont icon-MapPin text-[49rpx] theme-color-1"></text>
                </view>
                <view class="flex-1 border-l border-[#e5e0d2] dark:border-[#4a4538] pl-6 pb-2">
                    <view class="text-[#918355] text-xs font-medium tracking-wide mb-1">静谧之地</view>
                    <view class="theme-color-5 dark:text-[#fbfbf9] text-base leading-relaxed">杭州市西湖区灵隐街道<br />法喜寺后山·竹间茶室
                    </view>
                </view>
            </view>
        </view>
        <!-- view: Content Style (Editable) -->
        <view class="mb-16">
            <view class="flex items-center gap-2 mb-6">
                <view class="w-1 h-4 bg-primary rounded-full"></view>
                <view class="text-primary text-xs uppercase tracking-widest font-semibold">美学范围</view>
            </view>
            <view class="bg-primary/5 dark:bg-primary/10 p-8 rounded-lg relative overflow-hidden">
                <!-- Decorative element -->
                <view class="absolute -right-4 -top-4 text-primary/10 select-none">
                    <text class="icon-auto_awesome iconfont text-8xl"></text>
                </view>
                <label class="block">
                    <text class="text-[#918355] text-sm font-light mb-4 block">定义内容意境</text>
                    <textarea
                        class="theme-color-5 w-full bg-transparent border-0 focus:ring-0  dark:text-[#fbfbf9] font-light leading-relaxed p-0 resize-none h-32 placeholder:text-[#d1cdc2]"
                        placeholder="描述您期望的活动氛围或视觉风格..." v-model="contentText"></textarea>
                </label>
            </view>
        </view>
        <!-- Action Button -->
        <view class="fixed bottom-10 left-0 right-0 px-8 flex justify-center pointer-events-none">
            <button
                class="pointer-events-auto bg-primary text-white px-12 py-4 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                <text class="text-sm font-medium tracking-[0.2em] ml-2">保存意境</text>
                <text class="iconfont icon-done-all text-lg"></text>
            </button>
        </view>
    </view>
    <!-- Footer decoration -->
    <view class="text-center py-12 opacity-20 pointer-events-none">
        <view class="inline-block w-12 h-[1px] bg-primary align-middle"></view>
        <text class="mx-4 text-primary text-[10px] tracking-[0.5em] uppercase">Poetic Life</text>
        <view class="inline-block w-12 h-[1px] bg-primary align-middle"></view>
    </view>
    <!-- 联动：先选开始，确认后再选结束（结束时间 minDate = 开始时间） -->
    <up-datetime-picker
        v-model="activityTimeStart"
        :show="showActivityTimeStart"
        mode="datetime"
        title="选择开始时间"
        :closeOnClickOverlay="true"
        confirmColor='#d4af35'
        cancelColor='#d4af35'
        @confirm="onActivityTimeStartConfirm"
        @cancel="onActivityTimeStartDismiss"
        @close="onActivityTimeStartDismiss"
    />
    <up-datetime-picker
        v-model="activityTimeEnd"
        :show="showActivityTimeEnd"
        mode="datetime"
        title="选择结束时间"
        :min-date="activityTimeStart"
        :closeOnClickOverlay="true"
        confirmColor='#d4af35'
        cancelColor='#d4af35'
        @confirm="onActivityTimeEndConfirm"
        @cancel="onActivityTimeEndDismiss"
        @close="onActivityTimeEndDismiss"
    />
    </view>
  </template>
  <script setup lang="ts">
  import { onLoad } from "@dcloudio/uni-app";
  import { fetchActivityDetail } from "@/assets/js/api/activity";
  import type { ActivityDetail } from "@/types/api/activity";
  import { unwrapApiData } from "@/utils/apiResponse";
  import { navigateBack } from "@/utils/navigation";
  import lcrBar from "@/components/lcrBar.vue";

  const DEFAULT_TIME_START = new Date(2023, 9, 20, 14, 0, 0).getTime();
  const DEFAULT_TIME_END = new Date(2023, 9, 20, 18, 0, 0).getTime();

  /** 活动时段：接口无时间时用默认 14:00 ~ 18:00（本地） */
  const activityTimeStart = ref(DEFAULT_TIME_START);
  const activityTimeEnd = ref(DEFAULT_TIME_END);
  const showActivityTimeStart = ref(false);
  const showActivityTimeEnd = ref(false);

  const titleText = ref("");
  const contentText = ref("");

  function parseServerDateToMs(raw: string | null | undefined): number | null {
    const s = raw?.trim();
    if (!s) return null;
    const t = Date.parse(s);
    return Number.isNaN(t) ? null : t;
  }

  async function loadActivityDetail(id: number) {
    try {
      const res = await fetchActivityDetail({ id });
      const data = unwrapApiData<ActivityDetail>(res);
      if (!data) {
        throw new Error("empty detail");
      }
      titleText.value = data.title ?? "";
      contentText.value = data.content ?? "";
      const startMs = parseServerDateToMs(data.startDate);
      const endMs = parseServerDateToMs(data.endDate);
      activityTimeStart.value = startMs ?? DEFAULT_TIME_START;
      activityTimeEnd.value = endMs ?? DEFAULT_TIME_END;
      if (activityTimeEnd.value < activityTimeStart.value) {
        activityTimeEnd.value = activityTimeStart.value;
      }
    } catch (e) {
      console.error("fetchActivityDetail", e);
      uni.showToast({ title: "加载活动失败", icon: "none" });
    }
  }

  onLoad((query) => {
    const id = Number(query?.id);
    if (!Number.isFinite(id) || id <= 0) {
      uni.showToast({ title: "活动不存在", icon: "none" });
      return;
    }
    loadActivityDetail(id);
  });

  function formatActivityDateTime(ms: number) {
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}年${m}月${day}日 ${h}:${min}`;
  }

  const activityTimeRangeDisplay = computed(() => {
    const startStr = formatActivityDateTime(activityTimeStart.value);
    const endStr = formatActivityDateTime(activityTimeEnd.value);
    if (!startStr || !endStr) return '';
    return `${startStr} <view class=" block text-center">～</view> ${endStr}`;
  });

  function openActivityDatetime() {
    showActivityTimeStart.value = true;
  }

  function onActivityTimeStartConfirm() {
    showActivityTimeStart.value = false;
    if (activityTimeEnd.value < activityTimeStart.value) {
      activityTimeEnd.value = activityTimeStart.value;
    }
    showActivityTimeEnd.value = true;
  }

  function onActivityTimeStartDismiss() {
    showActivityTimeStart.value = false;
  }

  function onActivityTimeEndConfirm() {
    if (activityTimeEnd.value < activityTimeStart.value) {
      uni.showToast({ title: '结束时间需不早于开始时间', icon: 'none' });
      return;
    }
    showActivityTimeEnd.value = false;
  }

  function onActivityTimeEndDismiss() {
    showActivityTimeEnd.value = false;
  }

  const onBack = () => {
    navigateBack();
  };
  </script>
  <style scoped lang="scss">
  
  </style>