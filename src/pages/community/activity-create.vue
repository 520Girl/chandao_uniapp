<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern pb-[calc(200rpx+env(safe-area-inset-bottom))]">
    <LcrBar :title="'发布团队活动'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />

    <view v-if="!teamReady" class="py-16 text-center text-sm theme-color-8">校验团队中…</view>
    <view v-else class="px-6 pt-4">
      <view class="mb-6">
        <text class="text-[#918355] text-xs block mb-2">发布至</text>
        <text class="theme-color-5 text-base font-medium">{{ teamLabel }}</text>
      </view>

      <view class="mb-6">
        <view class="flex items-center gap-2 mb-3">
          <view class="w-1 h-4 bg-primary rounded-full" />
          <text class="text-primary text-xs uppercase tracking-widest font-semibold">活动模板</text>
        </view>
        <view v-if="templatesLoading" class="text-sm theme-color-8 py-4">加载模板中…</view>
        <view v-else-if="!templates.length" class="text-sm theme-color-8 py-4">暂无可选模板</view>
        <scroll-view v-else scroll-y class="max-h-[480rpx]">
          <view
            v-for="tpl in templates"
            :key="tpl.id"
            class="flex items-center gap-3 p-4 mb-3 rounded-2xl border-2 transition-colors"
            :class="selectedTemplateId === tpl.id ? 'border-primary bg-primary/5' : 'border-[#d4af35]/15 bg-white/30'"
            @click="selectedTemplateId = tpl.id"
          >
            <up-image
              v-if="templateIconUrl(tpl.icon)"
              :src="templateIconUrl(tpl.icon)"
              width="88rpx"
              height="88rpx"
              radius="16rpx"
              class="shrink-0"
              mode="aspectFill"
            />
            <view v-else class="size-[88rpx] rounded-2xl bg-primary/10 shrink-0 flex items-center justify-center">
              <text class="iconfont icon-huodong text-[40rpx] theme-color-1" />
            </view>
            <view class="min-w-0 flex-1">
              <text class="theme-color-5 text-sm font-semibold block mb-1">{{ tpl.name }}</text>
              <text class="text-[#918355] text-xs line-clamp-2">{{ (tpl.description || "").trim() || " " }}</text>
            </view>
            <text
              v-if="selectedTemplateId === tpl.id"
              class="iconfont icon-done-all text-[40rpx] theme-color-1 shrink-0"
            />
          </view>
        </scroll-view>
      </view>

      <view class="mb-6">
        <text class="text-[#918355] text-sm block mb-2">活动标题</text>
        <input
          v-model="title"
          class="w-full h-[88rpx] px-4 rounded-2xl bg-white/50 border border-[#d4af35]/20 text-base theme-color-5"
          placeholder="填写活动标题"
          type="text"
        />
      </view>

      <view class="mb-6">
        <view class="flex items-center gap-2 mb-2">
          <view class="w-1 h-4 bg-primary rounded-full" />
          <text class="text-primary text-xs uppercase tracking-widest font-semibold">发布方式</text>
        </view>
        <view class="flex gap-3">
          <view
            class="flex-1 py-3 rounded-2xl text-center text-sm font-medium border-2"
            :class="publishStatus === 2 ? 'border-primary theme-color-1 bg-primary/5' : 'border-[#d4af35]/15 theme-color-8'"
            @click="publishStatus = 2"
          >
            直接发布
          </view>
          <view
            class="flex-1 py-3 rounded-2xl text-center text-sm font-medium border-2"
            :class="publishStatus === 1 ? 'border-primary theme-color-1 bg-primary/5' : 'border-[#d4af35]/15 theme-color-8'"
            @click="publishStatus = 1"
          >
            存为草稿
          </view>
        </view>
      </view>

      <view v-if="publishStatus === 2" class="mb-6">
        <view
          class="flex items-center justify-between p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-white/60 dark:border-white/5"
        >
          <view class="flex items-center gap-3 min-w-0">
            <view class="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <text class="iconfont icon-calendar-today text-[48rpx] theme-color-1" />
            </view>
            <view class="min-w-0">
              <view class="text-[#918355] text-xs">起止时间（发布必填）</view>
              <view class="theme-color-5 text-sm leading-relaxed break-words">{{ timeRangeLine }}</view>
            </view>
          </view>
          <view class="shrink-0 pl-2" @click="openStartPicker">
            <text class="iconfont icon-lishidianjihou text-[48rpx] theme-color-1" />
          </view>
        </view>
      </view>

      <view class="mb-6">
        <text class="text-[#918355] text-sm block mb-2">活动说明（可选，默认用模板说明）</text>
        <textarea
          v-model="content"
          class="w-full min-h-[200rpx] p-4 rounded-2xl bg-primary/5 text-base theme-color-5 leading-relaxed"
          placeholder="补充说明、共修规约等"
        />
      </view>

      <view class="mb-6">
        <text class="text-[#918355] text-sm block mb-2">打卡方式</text>
        <view class="flex gap-3">
          <view
            class="flex-1 py-3 rounded-2xl text-center text-sm border-2"
            :class="checkinMode === 1 ? 'border-primary theme-color-1' : 'border-[#d4af35]/15 theme-color-8'"
            @click="checkinMode = 1"
          >
            每日打卡
          </view>
          <view
            class="flex-1 py-3 rounded-2xl text-center text-sm border-2"
            :class="checkinMode === 2 ? 'border-primary theme-color-1' : 'border-[#d4af35]/15 theme-color-8'"
            @click="checkinMode = 2"
          >
            仅一次
          </view>
        </view>
      </view>

      <view class="mb-4 flex gap-4">
        <view class="flex-1">
          <text class="text-[#918355] text-xs block mb-2">禅修目标（分钟）</text>
          <input
            v-model.number="targetMinutes"
            class="w-full h-[80rpx] px-3 rounded-xl bg-white/50 border border-[#d4af35]/20 text-sm theme-color-5"
            type="number"
          />
        </view>
        <view class="flex-1">
          <text class="text-[#918355] text-xs block mb-2">达标 %（0–100）</text>
          <input
            v-model.number="passPercent"
            class="w-full h-[80rpx] px-3 rounded-xl bg-white/50 border border-[#d4af35]/20 text-sm theme-color-5"
            type="number"
          />
        </view>
      </view>
    </view>

    <view
      v-if="teamReady"
      class="fixed bottom-0 left-0 right-0 px-6 pt-3 pb-[calc(24rpx+env(safe-area-inset-bottom))] bg-theme-bg/95 backdrop-blur border-t border-[#d4af35]/10"
    >
      <button
        class="w-full max-w-md mx-auto block bg-primary text-white py-3 rounded-full text-sm font-medium disabled:opacity-50"
        :disabled="submitLoading"
        @click="onSubmit"
      >
        {{ submitLoading ? "提交中…" : "提交" }}
      </button>
    </view>

    <up-datetime-picker
      v-model="timeStart"
      :show="showTimeStart"
      mode="datetime"
      title="开始时间"
      :closeOnClickOverlay="true"
      confirmColor="#d4af35"
      cancelColor="#d4af35"
      @confirm="onStartConfirm"
      @cancel="showTimeStart = false"
      @close="showTimeStart = false"
    />
    <up-datetime-picker
      v-model="timeEnd"
      :show="showTimeEnd"
      mode="datetime"
      title="结束时间"
      :minDate="timeStart"
      :closeOnClickOverlay="true"
      confirmColor="#d4af35"
      cancelColor="#d4af35"
      @confirm="onEndConfirm"
      @cancel="showTimeEnd = false"
      @close="showTimeEnd = false"
    />
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { fetchActivityTemplates, postActivityCreateFromTemplate } from "@/assets/js/api/activity";
import { config } from "@/assets/js/config";
import type { ActivityCreateFromTemplateBody, ActivityTemplateItem } from "@/types/api/activity";
import { useTeamStore } from "@/stores/team";
import { useUserStore } from "@/stores/user";
import { unwrapApiData } from "@/utils/apiResponse";
import { navigateBack } from "@/utils/navigation";
import LcrBar from "@/components/lcrBar.vue";

const teamStore = useTeamStore();
const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const teamId = ref(0);
const teamLabel = ref("");
const teamReady = ref(false);
const templates = ref<ActivityTemplateItem[]>([]);
const templatesLoading = ref(false);
const selectedTemplateId = ref(0);
const title = ref("");
const content = ref("");
/** 1 草稿 2 发布 */
const publishStatus = ref(2);
const checkinMode = ref(1);
const targetMinutes = ref(0);
const passPercent = ref(100);
const submitLoading = ref(false);

const now = Date.now();
const timeStart = ref(now + 3600000);
const timeEnd = ref(now + 7200000);
const showTimeStart = ref(false);
const showTimeEnd = ref(false);

function formatLine(ms: number) {
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "请选择";
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}/${m}/${day} ${h}:${min}`;
}

const timeRangeLine = computed(() => `${formatLine(timeStart.value)} ～ ${formatLine(timeEnd.value)}`);

function resolveMediaUrl(raw: string | null | undefined): string {
  const u = (raw || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return `https:${u}`;
  const base = config.baseURL.replace(/\/+$/, "");
  const path = u.startsWith("/") ? u : `/${u}`;
  return `${base}${path}`;
}

function templateIconUrl(raw: string | null | undefined): string {
  return resolveMediaUrl(raw);
}

function openStartPicker() {
  showTimeStart.value = true;
}

function onStartConfirm() {
  showTimeStart.value = false;
  if (timeEnd.value < timeStart.value) {
    timeEnd.value = timeStart.value + 3600000;
  }
  showTimeEnd.value = true;
}

function onEndConfirm() {
  if (timeEnd.value < timeStart.value) {
    uni.showToast({ title: "结束时间需不早于开始", icon: "none" });
    return;
  }
  showTimeEnd.value = false;
}

function onBack() {
  navigateBack();
}

async function loadTemplates() {
  templatesLoading.value = true;
  try {
    const res = await fetchActivityTemplates();
    const data = unwrapApiData<ActivityTemplateItem[]>(res);
    const list = Array.isArray(data) ? data : [];
    templates.value = list;
    if (list.length && !list.some((t) => t.id === selectedTemplateId.value)) {
      selectedTemplateId.value = list[0]!.id;
    }
  } catch (e) {
    console.error("fetchActivityTemplates", e);
    templates.value = [];
    uni.showToast({ title: "模板加载失败", icon: "none" });
  } finally {
    templatesLoading.value = false;
  }
}

onLoad((query) => {
  const raw = query?.teamId;
  const tid = raw != null ? Number(raw) : NaN;
  if (!Number.isFinite(tid) || tid <= 0) {
    uni.showToast({ title: "缺少团队参数", icon: "none" });
    setTimeout(() => navigateBack(), 400);
    return;
  }
  teamId.value = tid;
  void (async () => {
    try {
      await teamStore.fetchMyCurrentTeams();
      const team = teamStore.myCurrentTeams.find((t) => t.teamId === tid);
      const uid = currentUser.value?.id;
      if (!team || uid == null || team.ownerId !== uid) {
        uni.showToast({ title: "仅团队负责人可发布", icon: "none" });
        setTimeout(() => navigateBack(), 400);
        return;
      }
      teamLabel.value = team.teamName?.trim() || `团队 ${tid}`;
      teamReady.value = true;
      await loadTemplates();
    } catch (e) {
      console.error("activity-create onLoad", e);
      setTimeout(() => navigateBack(), 400);
    }
  })();
});

function clampPassPercent(n: number): number {
  if (!Number.isFinite(n)) return 100;
  return Math.max(0, Math.min(100, Math.trunc(n)));
}

async function onSubmit() {
  if (!teamReady.value || submitLoading.value) return;
  if (!selectedTemplateId.value) {
    uni.showToast({ title: "请选择活动模板", icon: "none" });
    return;
  }
  const t = title.value.trim();
  if (!t) {
    uni.showToast({ title: "请填写标题", icon: "none" });
    return;
  }
  const st = publishStatus.value;
  let startIso: string | undefined;
  let endIso: string | undefined;
  if (st === 2) {
    if (timeEnd.value < timeStart.value) {
      uni.showToast({ title: "请设置合法起止时间", icon: "none" });
      return;
    }
    startIso = new Date(timeStart.value).toISOString();
    endIso = new Date(timeEnd.value).toISOString();
  }
  const body: ActivityCreateFromTemplateBody = {
    teamId: teamId.value,
    templateId: selectedTemplateId.value,
    title: t,
    status: st,
    checkinMode: checkinMode.value,
    targetMeditationSeconds: Math.max(0, Math.trunc((Number(targetMinutes.value) || 0) * 60)),
    passPercent: clampPassPercent(Number(passPercent.value)),
  };
  const c = content.value.trim();
  if (c) body.content = c;
  if (startIso) body.startDate = startIso;
  if (endIso) body.endDate = endIso;

  submitLoading.value = true;
  try {
    const res = await postActivityCreateFromTemplate(body);
    const data = unwrapApiData<{ id?: number } & Record<string, unknown>>(res);
    const newId = typeof data?.id === "number" ? data.id : undefined;
    uni.showToast({ title: st === 2 ? "已发布" : "已存草稿", icon: "success" });
    if (newId != null) {
      setTimeout(() => {
        uni.redirectTo({ url: `/pages/post/activity?id=${newId}` });
      }, 200);
    } else {
      setTimeout(() => navigateBack(), 200);
    }
  } catch (e) {
    console.error("postActivityCreateFromTemplate", e);
  } finally {
    submitLoading.value = false;
  }
}
</script>

<style scoped lang="scss"></style>
