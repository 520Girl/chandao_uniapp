<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern pb-[calc(200rpx+env(safe-area-inset-bottom))]">
    <LcrBar :title="'发布团队活动'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />

    <view v-if="!teamReady" class="py-16 text-center text-sm theme-color-8">校验团队中…</view>
    <view v-else class="px-6 pt-4">
      <!-- 所属团队（上下文） -->
      <view class="mb-6">
        <text class="text-[#918355] text-xs block mb-2">所属团队</text>
        <text class="theme-color-5 text-base font-medium">{{ teamLabel }}</text>
      </view>

      <!-- 2. 模板 -->
      <view class="mb-6">
        <view class="flex items-center gap-2 mb-3">
          <view class="w-1 h-4 bg-primary rounded-full" />
          <text class="text-primary text-xs uppercase tracking-widest font-semibold">活动模板（必填）</text>
        </view>
        <view v-if="templatesLoading" class="text-sm theme-color-8 py-4">加载模板中…</view>
        <view v-else-if="!templates.length" class="text-sm theme-color-8 py-4">暂无可选模板</view>
        <scroll-view v-else scroll-y class="max-h-[480rpx]">
          <view
            v-for="tpl in templates"
            :key="tpl.id"
            class="flex items-center gap-3 p-4 mb-3 rounded-2xl border-2 transition-colors"
            :class="selectedTemplateId === tpl.id ? 'border-primary bg-primary/5' : 'border-[#d4af35]/15 bg-white/30'"
            @click="onSelectTemplate(tpl.id)"
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

      <!-- 4. 活动类型 -->
      <view class="mb-6">
        <view class="flex items-center gap-2 mb-2">
          <view class="w-1 h-4 bg-primary rounded-full" />
          <text class="text-primary text-xs uppercase tracking-widest font-semibold">活动类型</text>
        </view>
        <view class="flex gap-3">
          <view
            class="flex-1 py-3 rounded-2xl text-center text-sm font-medium border-2"
            :class="activityType === 1 ? 'border-primary theme-color-1 bg-primary/5' : 'border-[#d4af35]/15 theme-color-8'"
            @click="setActivityType(1)"
          >
            普通打卡
          </view>
          <view
            class="flex-1 py-3 rounded-2xl text-center text-sm font-medium border-2"
            :class="activityType === 2 ? 'border-primary theme-color-1 bg-primary/5' : 'border-[#d4af35]/15 theme-color-8'"
            @click="setActivityType(2)"
          >
            多人共修
          </view>
        </view>
        <text v-if="activityType === 2" class="text-[22rpx] theme-color-6 mt-2 block leading-relaxed">
          多人共修须绑定当前团队；打卡模式固定为「仅一次」；发布时禅修目标秒数与计划时长一致（由后端按起止时间写入）。
        </text>
      </view>

      <!-- 1. 标题 -->
      <view class="mb-6">
        <text class="text-[#918355] text-sm block mb-2">活动标题（必填）</text>
        <input
          v-model="title"
          class="w-full h-[88rpx] px-4 rounded-2xl bg-white/50 border border-[#d4af35]/20 text-base theme-color-5"
          placeholder="填写活动标题"
          type="text"
        />
      </view>

      <!-- 9. 状态：发布方式 -->
      <view class="mb-6">
        <view class="flex items-center gap-2 mb-2">
          <view class="w-1 h-4 bg-primary rounded-full" />
          <text class="text-primary text-xs uppercase tracking-widest font-semibold">状态</text>
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

      <!-- 5. 起止时间（发布必填） -->
      <view v-if="publishStatus === 2" class="mb-6">
        <view
          class="flex items-center justify-between p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-white/60 dark:border-white/5"
        >
          <view class="flex items-center gap-3 min-w-0">
            <view class="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <text class="iconfont icon-calendar-today text-[48rpx] theme-color-1" />
            </view>
            <view class="min-w-0">
              <view class="text-[#918355] text-xs">开始 / 结束（发布必填，YYYY-MM-DD HH:mm:ss）</view>
              <view class="theme-color-5 text-sm leading-relaxed break-words">{{ timeRangeLine }}</view>
            </view>
          </view>
          <view class="shrink-0 pl-2" @click="openStartPicker">
            <text class="iconfont icon-lishidianjihou text-[48rpx] theme-color-1" />
          </view>
        </view>
      </view>

      <!-- 6. 内容 -->
      <view class="mb-6">
        <text class="text-[#918355] text-sm block mb-2">活动说明（可选）</text>
        <textarea
          v-model="content"
          class="w-full min-h-[200rpx] p-4 rounded-2xl bg-primary/5 text-base theme-color-5 leading-relaxed"
          placeholder="补充说明、共修规约等"
        />
      </view>

      <!-- 7a 普通：打卡、禅修目标、达标 -->
      <template v-if="activityType === 1">
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
      </template>

      <!-- 7b 多人共修：房间号、人数、容差 -->
      <template v-else>
        <view class="mb-4">
          <text class="text-[#918355] text-sm block mb-2">房间号（可选）</text>
          <input
            v-model="groupRoomNo"
            class="w-full h-[88rpx] px-4 rounded-2xl bg-white/50 border border-[#d4af35]/20 text-base theme-color-5"
            placeholder="留空则提交为 null"
            type="text"
          />
        </view>
        <view class="mb-4 flex gap-4">
          <view class="flex-1">
            <text class="text-[#918355] text-xs block mb-2">人数上限（0–20）</text>
            <input
              v-model.number="groupMaxParticipants"
              class="w-full h-[80rpx] px-3 rounded-xl bg-white/50 border border-[#d4af35]/20 text-sm theme-color-5"
              type="number"
              @blur="groupMaxParticipants = clampInt(Number(groupMaxParticipants) || 0, 0, 20)"
            />
          </view>
          <view class="flex-1">
            <text class="text-[#918355] text-xs block mb-2">榜单容差（秒，0–300）</text>
            <input
              v-model.number="rankGraceSeconds"
              class="w-full h-[80rpx] px-3 rounded-xl bg-white/50 border border-[#d4af35]/20 text-sm theme-color-5"
              type="number"
              @blur="rankGraceSeconds = clampInt(Number(rankGraceSeconds) || 30, 0, 300)"
            />
          </view>
        </view>
      </template>
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
import { computed, reactive, ref } from "vue";
import { fetchActivityTemplates, postActivityCreateFromTemplate } from "@/assets/js/api/activity";
import { config } from "@/assets/js/config";
import type {
  ActivityCreateFromTemplateBody,
  ActivityGroupSessionConfigPayload,
  ActivityTemplateItem,
} from "@/types/api/activity";
import { useTeamStore } from "@/stores/team";
import { useUserStore } from "@/stores/user";
import { sceneTypeForTemplate } from "@/utils/activityRoomPayload";
import {
  clampInt,
  parseSessionConfigDefault,
  toBackendDateTimeString,
  toIsoDateTimeString,
} from "@/utils/activityCreateForm";
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
/** 1 普通打卡 2 多人共修 */
const activityType = ref<1 | 2>(1);
const title = ref("");
const content = ref("");
/** 1 草稿 2 发布 */
const publishStatus = ref(2);
const checkinMode = ref<1 | 2>(1);
const targetMinutes = ref(15);
const passPercent = ref(100);
const groupRoomNo = ref("");
const groupMaxParticipants = ref(20);
const rankGraceSeconds = ref(30);
const submitLoading = ref(false);

/** 当前选中模板解析出的默认（供类型联动回退） */
const templateDefaults = reactive({
  groupRoomNo: "",
  groupMaxParticipants: 20,
  rankGraceSeconds: 30,
  checkinMode: 1 as 1 | 2,
  targetMeditationMinutes: 15,
  passPercent: 100,
});

const now = Date.now();
const timeStart = ref(now + 3600000);
const timeEnd = ref(now + 7200000);
const showTimeStart = ref(false);
const showTimeEnd = ref(false);

function formatLine(ms: number) {
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "请选择";
  return toBackendDateTimeString(ms).replace(/-/g, "/").replace(" ", " ");
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

function clampPassPercent(n: number): number {
  if (!Number.isFinite(n)) return 100;
  return Math.max(0, Math.min(100, Math.trunc(n)));
}

/** 活动类型联动 */
function applyTypeLinkedFields(type: 1 | 2) {
  if (type === 2) {
    checkinMode.value = 2;
    targetMinutes.value = 0;
    passPercent.value = 100;
    groupRoomNo.value = templateDefaults.groupRoomNo;
    groupMaxParticipants.value = clampInt(templateDefaults.groupMaxParticipants, 0, 20);
    rankGraceSeconds.value = clampInt(templateDefaults.rankGraceSeconds, 0, 300);
  } else {
    checkinMode.value = templateDefaults.checkinMode === 2 ? 2 : 1;
    targetMinutes.value = Math.max(0, Math.trunc(templateDefaults.targetMeditationMinutes));
    passPercent.value = clampPassPercent(templateDefaults.passPercent);
  }
}

/** 模板默认值 → templateDefaults + 类型联动 */
function applyTemplateDefaults(tpl: ActivityTemplateItem) {
  const session = parseSessionConfigDefault(tpl.sessionConfigDefault);
  templateDefaults.groupRoomNo = session.roomNo;
  templateDefaults.groupMaxParticipants = session.maxParticipants;
  templateDefaults.rankGraceSeconds = session.rankGraceSeconds;

  let at = Number(tpl.activityTypeDefault);
  if (at !== 1 && at !== 2) {
    at = sceneTypeForTemplate(tpl.id) === "group" ? 2 : 1;
  }
  activityType.value = at === 2 ? 2 : 1;

  templateDefaults.checkinMode = tpl.checkinModeDefault === 2 ? 2 : 1;
  const tsec = Number(tpl.targetMeditationSecondsDefault);
  templateDefaults.targetMeditationMinutes =
    Number.isFinite(tsec) && tsec >= 0 ? Math.floor(tsec / 60) : 15;
  templateDefaults.passPercent = clampPassPercent(Number(tpl.passPercentDefault ?? 100));

  applyTypeLinkedFields(activityType.value);
}

function onSelectTemplate(id: number) {
  selectedTemplateId.value = id;
  const tpl = templates.value.find((t) => t.id === id);
  if (tpl) applyTemplateDefaults(tpl);
}

function setActivityType(t: 1 | 2) {
  if (activityType.value === t) return;
  activityType.value = t;
  applyTypeLinkedFields(t);
}

async function loadTemplates() {
  templatesLoading.value = true;
  try {
    const res = await fetchActivityTemplates();
    const data = unwrapApiData<ActivityTemplateItem[]>(res);
    const raw = Array.isArray(data) ? data : [];
    const list = raw.filter((t) => t.allowTeamPublish !== false);
    templates.value = list;
    if (list.length) {
      const first = list.some((t) => t.id === selectedTemplateId.value)
        ? list.find((t) => t.id === selectedTemplateId.value)!
        : list[0]!;
      selectedTemplateId.value = first.id;
      applyTemplateDefaults(first);
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
  // status 须为 number（1/2），勿传字符串以免后端误判为草稿
  const st: 1 | 2 = publishStatus.value === 2 ? 2 : 1;
  let startIso = "";
  let endIso = "";
  if (st === 2) {
    if (timeEnd.value < timeStart.value) {
      uni.showToast({ title: "请设置合法起止时间", icon: "none" });
      return;
    }
    startIso = toIsoDateTimeString(timeStart.value);
    endIso = toIsoDateTimeString(timeEnd.value);
    if (!startIso || !endIso) {
      uni.showToast({ title: "请设置起止时间", icon: "none" });
      return;
    }
  }

  const at: 1 | 2 = activityType.value === 2 ? 2 : 1;
  if (at === 2 && st === 2) {
    if (!Number.isFinite(teamId.value) || teamId.value <= 0) {
      uni.showToast({ title: "多人共修须选择团队", icon: "none" });
      return;
    }
  }

  const graceSec = clampInt(Number(rankGraceSeconds.value) || 30, 0, 300);
  const maxPart = clampInt(Number(groupMaxParticipants.value) || 0, 0, 20);
  const roomTrim = groupRoomNo.value.trim();

  const body: ActivityCreateFromTemplateBody = {
    teamId: teamId.value,
    templateId: selectedTemplateId.value,
    title: t,
    activityType: at,
    status: st,
    sessionConfig: {},
  };

  const c = content.value.trim();
  if (c) body.content = c;

  if (at === 2) {
    body.checkinMode = 2;
    body.passPercent = 100;
    const planSeconds =
      st === 2 ? Math.max(0, Math.floor((timeEnd.value - timeStart.value) / 1000)) : 0;
    body.targetMeditationSeconds = planSeconds;

    const session: ActivityGroupSessionConfigPayload = {
      roomNo: roomTrim.length ? roomTrim : null,
      maxParticipants: maxPart,
      rankGraceSeconds: graceSec,
    };
    if (st === 2) {
      session.scheduledStartTime = startIso;
      session.scheduledEndTime = endIso;
    }
    body.sessionConfig = session;

    if (st === 2) {
      body.startDate = startIso;
      body.endDate = endIso;
    }
  } else {
    body.checkinMode = checkinMode.value === 2 ? 2 : 1;
    body.targetMeditationSeconds = Math.max(0, Math.trunc((Number(targetMinutes.value) || 0) * 60));
    body.passPercent = clampPassPercent(Number(passPercent.value));
    if (st === 2) {
      body.startDate = startIso;
      body.endDate = endIso;
    }
  }

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
