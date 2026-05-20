<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
    <lcrBar :title="pageBarTitle" :type="inviteLanding ? 'none' : 'home'" :onBack="onLcrBack"
      :onHome="onLcrHome" />
    <view class="flex flex-col flex-1 min-h-0">
      <view v-if="visitorMode && sharerDisplayLine" class="px-6 pt-4 text-center">
        <view class="text-[24rpx] text-[#3c3728]/65">{{ sharerDisplayLine }}</view>
      </view>
      <view class="px-8 pt-10 pb-6 text-center">
        <view class="theme-color-5 text-[60rpx] font-medium leading-snug">
          今日，你照见 <text class="font-bold text-primary">{{ elapsedMin }}</text> 分{{ elapsedRemainSec }}秒
          <view class="italic font- text-[38rpx]">{{ reportFromApi?.breathText }}</view>
        </view>
      </view>
      <!-- <view class="relative px-6 py-4">
        <view
        class="bg-white/40 rounded-[80rpx] p-6 h-64 relative overflow-hidden border border-primary/5 flex items-center justify-center float-soft">
        <view class="absolute inset-0 flex items-center justify-center overflow-hidden">
          <view :class="`bg-blue-300/${reportFromApi?.peaceRatio}`"
            class="absolute w-40 h-24 bg-blue-300/100 watercolor-blur cloud-shape -translate-x-12 -translate-y-8">
          </view>
          <view :class="`bg-blue-200/${reportFromApi?.relaxRatio}`"
            class="absolute w-32 h-20 bg-blue-200/100 watercolor-blur cloud-shape -translate-x-20 translate-y-4">
          </view>
          <view :class="`bg-red-300/${reportFromApi?.tensionRatio}`"
            class="absolute w-36 h-28 bg-red-300/100 watercolor-blur cloud-shape translate-x-16 translate-y-10">
          </view>
          <view :class="`bg-red-400/${reportFromApi?.anxietyRatio}`"
            class="absolute w-24 h-24 bg-red-400/100 watercolor-blur cloud-shape translate-x-10 -translate-y-12">
          </view>
        </view>
        <view class="relative z-10 text-center">
          <view class="text-[24rpx] font-bold tracking-[0.1em] text-primary/80 mb-1 uppercase">情绪云图</view>
          <view class="text-[20rpx] text-[#3c3728]/60 italic">{{ manualStop ? '手动结束，本次觉察已记录' : '自然完成，状态平稳收束' }}
          </view>
        </view>
      </view>
      </view> -->
      <view class="relative px-4 py-4">
        <view
          class="bg-white/40 rounded-xl p-6 h-25 relative overflow-hidden border border-primary/5 flex flex-col items-center justify-center">
          
          <view class="relative z-10 text-center">
            <view class="text-[24rpx] font-bold tracking-[0.1em] text-primary/80 mb-1 uppercase">心迹记录</view>
            <view class="text-[20rpx] text-[#3c3728]/60 italic">{{ manualStop ? '手动结束，本次觉察已记录' : '自然完成，状态平稳收束' }}
            </view>
          </view>
          <view class="items-center justify-center overflow-hidden">
              <view v-if="sitCountLine" class="text-[22rpx] text-[#3c3728]/60 mt-1">{{ sitCountLine }}</view>
          </view>
        </view>
      </view>
      <view class="px-6 py-2">
        <view class="bg-white/40 rounded-xl p-5 border border-primary/5">
          <view class="text-[28rpx] font-bold tracking-[0.1em] text-primary/80 uppercase mb-4 text-center">生理指标回顾
          </view>
          <view class="grid grid-cols-3 gap-4">
            <view class="flex flex-col items-center">
              <view class="size-10 rounded-full bg-primary/5 flex items-center justify-center mb-2">
                <text class="iconfont icon-tubiaozhizuomoban- text-primary text-xl"></text>
              </view>
              <view class="text-[20rpx] text-[#3c3728]/50 uppercase tracking-tighter">平均心率</view>
              <view class="text-[28rpx] font-bold text-[#3c3728] tabular-nums">{{ avgHeart }} <text
                  class="text-[16rpx] font-normal">bpm</text></view>
            </view>
            <view class="flex flex-col items-center border-x border-primary/10">
              <view class="size-10 rounded-full bg-primary/5 flex items-center justify-center mb-2">
                <text class="iconfont icon-wind text-primary text-xl"></text>
              </view>
              <view class="text-[20rpx] text-[#3c3728]/50 uppercase tracking-tighter">平均呼吸率</view>
              <view class="text-[28rpx] font-bold text-[#3c3728] tabular-nums">{{ avgBreath }} <text
                  class="text-[16rpx] font-normal">次/分</text></view>
            </view>
            <view class="flex flex-col items-center">
              <view class="size-10 rounded-full bg-primary/5 flex items-center justify-center mb-2">
                <text class="iconfont icon-directions_run text-primary text-xl"></text>
              </view>
              <view class="text-[20rpx] text-[#3c3728]/50 uppercase tracking-tighter">体动次数</view>
              <view class="text-[28rpx] font-bold text-[#3c3728] tabular-nums">{{ movementCountDisplay }}</view>
            </view>
          </view>
        </view>
      </view>


      <view class="px-6 py-4">
        <view class="bg-white/40 rounded-[80rpx] p-5 border border-primary/5">
          <view class="flex justify-between items-end mb-4">
            <view>
              <view class="text-[24rpx] font-bold tracking-[0.1em] text-primary/80 uppercase">{{ stabilityCardTitle }}
              </view>
              <view class="text-[32rpx] font-light mt-1 text-[#3c3728]">{{ secondaryTitle }}</view>
            </view>
            <view class="text-right">
              <text class="text-2xl font-bold text-primary">{{ stabilityIndex }}</text>
              <text class="text-[10px] text-[#3c3728]/50 block uppercase">{{ stabilityCardHint }}</text>
            </view>
          </view>
          <view class="relative h-12 w-full bg-[#eeeae3] rounded-full overflow-hidden flex items-center">
            <view class="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 opacity-60">
            </view>
            <view
              class="absolute h-full bg-primary/20 backdrop-blur-sm rounded-r-full border-r-2 border-primary/30 progress-anim"
              :style="{ width: `${Math.max(10, Math.min(100, stabilityIndex))}%` }">
            </view>
            <view class="relative w-full flex justify-between px-4 z-10">
              <text class="text-[9px] uppercase font-bold text-[#3c3728]/40">薄</text>
              <text class="text-[9px] uppercase font-bold text-[#3c3728]/60 italic">当前厚度</text>
              <text class="text-[9px] uppercase font-bold text-[#3c3728]/40">厚</text>
            </view>
          </view>
          <view class="mt-3 text-[11px] leading-relaxed text-[#3c3728]/70 italic">{{ reportSubtitle }}</view>

        </view>
      </view>
      <view class="px-6 py-2">
        <view class="bg-white/40 rounded-xl p-5 border border-primary/5">
          <view class="text-[28rpx] font-bold tracking-[0.1em] text-primary/80 uppercase mb-4 text-center">
            身体节律趋势
          </view>
          <view class="w-full" style="height: 200px">
            <qiun-data-charts :key="'body-trend-' + bodyTrendChartKey" type="line" canvas-id="meditationTrendChart"
              :canvas2d="true" background="transparent" :chart-data="bodyTrendChartData" :opts="bodyTrendOpts" />
          </view>
        </view>
      </view>
      <view class="px-6 py-4">
        <view class="bg-white/40 rounded-xl p-5 border border-primary/5">
          <view class="text-[28rpx] font-bold tracking-[0.1em] text-primary/80 uppercase mb-6 text-center">中道实践
          </view>
          <view class="relative h-24 flex flex-col justify-center">
            <!-- Shore 1 -->
            <view class="absolute left-0 bottom-2 text-center">
              <text class="iconfont icon-landscape text-[#3c3728]/30 text-3xl"></text>
              <view class="text-[18rpx] uppercase tracking-tighter text-[#3c3728]/50 mt-1">执着</view>
            </view>
            <!-- Shore 2 -->
            <view class="absolute right-0 bottom-2 text-center">
              <text class="iconfont icon-landscape text-[#3c3728]/30 text-3xl"></text>
              <view class="text-[18rpx] uppercase tracking-tighter text-[#3c3728]/50 mt-1">厌离</view>
            </view>
            <!-- Cloud Bridge (Progress) -->
            <view class="relative w-full px-10">
              <!-- Background Path -->
              <canvas id="cloudBridgeCanvas" canvas-id="cloudBridgeCanvas" type="2d"
                class="w-full h-[96rpx] overflow-visible" />
              <!-- Floating Cloud Indicator -->
              <view class="absolute top-[-5px] -translate-x-1/2" :style="{ left: harmonyPercent + '%' }">
                <view
                  class="bg-white size-8 rounded-full shadow-lg border border-primary/20 flex items-center justify-center">
                  <text class="iconfont icon-Cloudy text-primary text-sm"></text>
                </view>
              </view>
            </view>
          </view>
          <view class="text-center mt-2">
            <!-- <view class="text-[26rpx] font-medium text-[#3c3728]">{{ midPathSummary }}</view>-->
            <view v-if="sitCountLine" class="text-[22rpx] text-[#3c3728]/60 mt-1">{{ sitCountLine }}</view>
          </view>
        </view>
      </view>
      <view class="text-center mb-10">
        <view class="text-[26rpx] font-medium text-[#3c3728] mb-1">温馨提示：本报告仅为静心参考，非医疗诊断。
        </view>
        <text class="text-[26rpx] font-medium text-[#3c3728] mb-1">以舒适为宜，不勉强、不贪长。</text>
      </view>
    </view>
    <view v-if="showShareFab" class="fixed bottom-24 right-8 z-20">
      <button
        class="size-14 bg-theme-2 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
        @click="openShareSheet">
        <text v-if="!inviteLanding" class="iconfont icon-share text-[70rpx]"></text>
        <text v-else class="iconfont icon-jiarutuandui text-[50rpx]"></text>
      </button>
    </view>
    <up-poster v-if="showShareFab" ref="posterRef" :json="posterJson" />
    <up-action-sheet v-if="showShareFab" v-model:show="shareSheetVisible" title="分享" :actions="shareSheetActions"
      cancel-text="取消" @select="onShareSheetSelect" />
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app';
import { computed, nextTick, onBeforeUnmount } from 'vue';
import {
  fetchMeditationReportDetail,
  fetchMeditationReportShare,
  postMeditationReportShareToken,
} from '@/assets/js/api/meditation';
import { config } from '@/assets/js/config';
import { postUserCreatePersonalInvite, postUserCreateTeamInvite } from '@/assets/js/api/user';
import lcrBar from '@/components/lcrBar.vue';
import { useMeditationReportShare, type UviewPosterInstance } from '@/composables/useMeditationReportShare';
import { useMeditationStore } from '@/stores/meditation';
import { useTeamStore } from '@/stores/team';
import { useUserStore } from '@/stores/user';
import type {
  MeditationReport,
  MeditationReportSection,
  MeditationReportShareTokenData,
  MeditationReportSharer,
} from '@/types/api/meditation';
import type { UserInviteCreatedData } from '@/types/api/user';
import type { MeditationReportSharePayload } from '@/types/pages/meditationShare';
import { unwrapApiData } from '@/utils/apiResponse';
import { drawCloudBridgeCanvas } from '@/utils/common';
import { buildJoinInvitePosterQrText, buildMeditationReportPosterJson } from '@/utils/meditationReportShare';
import {
  parseMeditationReportDetailPayload,
  parseMeditationReportSharePayload,
} from '@/utils/meditationReport';
import {
  setLeavingMeditationForReportPage,
  stopMeditationBackgroundMusic,
} from '@/utils/meditationBackgroundMusic';
import { navigateBack } from '@/utils/navigation';

const meditationStore = useMeditationStore();
const userStore = useUserStore();
const teamStore = useTeamStore();

/** 小程序邀请类海报：覆盖主标题、底部说明与二维码（图或文本） */
const reportPosterExtras = ref<
  Partial<
    Pick<
      MeditationReportSharePayload,
      'posterMainTitle' | 'posterBottomHint' | 'posterBottomQrText' | 'posterBottomQrImageUrl'
    >
  >
>({});

const duration = ref(15);
const elapsedSec = ref(0);
const avgHeart = ref(72);
const avgBreath = ref(12);
const maxHeart = ref(78);
const minHeart = ref(66);
const manualStop = ref(false);
const trackTitle = ref('');
/** 小程序 scene 解析出的邀请码（非邀请落地时为空） */
const inviteCode = ref('');
const inviteLanding = computed(() => inviteCode.value.trim().length > 0);

/** 好友通过 `shareToken` 打开（免登录） */
const visitorMode = ref(false);
const sharerInfo = ref<MeditationReportSharer | null>(null);
/** 本人分享前换取的 `shareToken`，用于微信分享 path / H5 链接 */
const cachedShareToken = ref<string | null>(null);

const pageBarTitle = computed(() => {
  if (inviteLanding.value) return "团队邀请";
  if (visitorMode.value) return "好友心迹";
  return "心迹报告";
});

const sharerDisplayLine = computed(() => {
  const name = sharerInfo.value?.nickName?.trim();
  if (!name) return "";
  return `${name} 的冥想报告`;
});

const showShareFab = computed(() => !inviteLanding.value && !visitorMode.value);

/** 接口拉取或 Store 注入的完整报告 */
const reportFromApi = ref<MeditationReport | null>(null);
/** 入口 URL 上的 sessionId（分享落地或直达时用于补全 path） */
const urlSessionId = ref<number | null>(null);
const effectiveSessionId = computed(
  () => reportFromApi.value?.sessionId ?? urlSessionId.value ?? null
);

const posterRef = ref<UviewPosterInstance | null>(null);
const shareSheetVisible = ref(false);

function resolvePosterAvatarUrl(raw: string | null | undefined): string {
  const v = String(raw ?? '').trim();
  if (!v) return '/static/logo.png';

  if (v.startsWith('/upload/')) return v;

  // H5 导出海报时，跨域图片会污染 canvas，导致 exportImage 失败；跨域头像改用本地兜底。
  if (typeof window !== 'undefined' && window.location?.origin) {
    try {
      const resolved = new URL(v, window.location.origin);
      if (resolved.pathname.startsWith('/upload/')) {
        return `${resolved.pathname}${resolved.search}${resolved.hash}`;
      }
      if (resolved.origin !== window.location.origin) {
        return '/static/logo.png';
      }
      return resolved.href;
    } catch {
      return '/static/logo.png';
    }
  }

  if (/^https?:\/\//i.test(v)) return v;
  if (v.startsWith('//')) return `https:${v}`;
  if (v.startsWith('/static/')) return v;
  const root = config.baseURL.replace(/\/+$/, '');
  const path = v.startsWith('/') ? v : `/${v}`;
  return `${root}${path}`;
}

function buildSharePayloadBase(): MeditationReportSharePayload {
  const extra = reportPosterExtras.value;
  const r = reportFromApi.value;
  return {
    durationMin: duration.value,
    elapsedSec: elapsedSec.value,
    avgHeart: avgHeart.value,
    avgBreath: avgBreath.value,
    maxHeart: maxHeart.value,
    minHeart: minHeart.value,
    manualStop: manualStop.value,
    trackTitle: trackTitle.value,
    sessionId: effectiveSessionId.value,
    shareToken: cachedShareToken.value,
    h5LandingBaseUrl: import.meta.env.VITE_H5_SHARE_BASE,
    posterUserName: userStore.nickName,
    posterUserAvatarUrl: resolvePosterAvatarUrl(userStore.avatarUrl),
    posterTotalDays: r?.totalDays ?? null,
    posterTotalHours: r?.totalHours ?? null,
    posterConsecutiveDays: r?.consecutiveDays ?? null,
    posterMovementCount:
      r?.movementCount != null && Number.isFinite(Number(r.movementCount))
        ? Math.floor(Number(r.movementCount))
        : null,
    ...(extra.posterMainTitle != null ? { posterMainTitle: extra.posterMainTitle } : {}),
    ...(extra.posterBottomHint != null ? { posterBottomHint: extra.posterBottomHint } : {}),
    ...(extra.posterBottomQrText !== undefined
      ? { posterBottomQrText: extra.posterBottomQrText }
      : {}),
    ...(extra.posterBottomQrImageUrl !== undefined
      ? { posterBottomQrImageUrl: extra.posterBottomQrImageUrl }
      : {}),
  };
}

function getSharePayload(): MeditationReportSharePayload {
  return buildSharePayloadBase();
}

/**
 * 分享前换取 `shareToken`（微信 `onShareAppMessage` 等异步场景）。
 */
async function getSharePayloadForShare(): Promise<MeditationReportSharePayload> {
  await ensureShareToken();
  return buildSharePayloadBase();
}

/**
 * 为当前会话生成或复用分享令牌。
 * @param refresh `true` 时使旧分享链接失效
 */
async function ensureShareToken(refresh = false): Promise<string | null> {
  const sid = effectiveSessionId.value;
  if (!userStore.isLoggedIn || sid == null || sid <= 0) {
    return null;
  }
  if (!refresh && cachedShareToken.value) {
    return cachedShareToken.value;
  }
  try {
    const res = await postMeditationReportShareToken({ sessionId: sid, refresh });
    const data = unwrapApiData<MeditationReportShareTokenData>(res);
    const token = data?.shareToken?.trim() || null;
    cachedShareToken.value = token;
    return token;
  } catch (e) {
    console.error("postMeditationReportShareToken", e);
    const msg = e instanceof Error ? e.message : "无法生成分享链接";
    uni.showToast({ title: msg, icon: "none" });
    return null;
  }
}

function resetReportPosterExtras() {
  reportPosterExtras.value = {};
}

/** 当前用户作为 owner 的团队：列表顺序中第一个（与「多团队默认第一个」一致） */
const firstOwnedTeamId = computed((): number | null => {
  const uid = userStore.currentUser?.id;
  if (uid == null) return null;
  const hit = teamStore.myCurrentTeams.find((t) => t.ownerId === uid);
  return hit?.teamId ?? null;
});

const canCreateTeamInvitePoster = computed(() => firstOwnedTeamId.value != null);

/** 当前用户作为负责人的团队数量（与 `myTeams` 列表顺序一致，可多团队） */
const ownedTeamCount = computed((): number => {
  const uid = userStore.currentUser?.id;
  if (uid == null) return 0;
  return teamStore.myCurrentTeams.filter((t) => t.ownerId === uid).length;
});

function applyInviteDataToPosterExtras(data: UserInviteCreatedData, kind: 'team' | 'personal') {
  const code = data.code?.trim();
  if (!code) {
    uni.showToast({ title: '邀请数据异常', icon: 'none' });
    return false;
  }
  const h5Base = import.meta.env.VITE_H5_SHARE_BASE?.trim();
  const qrText = buildJoinInvitePosterQrText(code, h5Base);
  const img = data.miniProgramQrUrl?.trim() || null;
  reportPosterExtras.value = {
    posterMainTitle: kind === 'team' ? '团队分享' : '个人成团分享',
    posterBottomHint:
      kind === 'team'
        ? '长按保存 · 微信扫码加入团队（负责人邀请）'
        : '长按保存 · 微信扫码加入个人成团',
    posterBottomQrImageUrl: img,
    posterBottomQrText: img ? null : qrText,
  };
  return true;
}

const {
  posterJson,
  generatePosterImagePath,
  openFriendShareGuide,
  openTimelineShareGuide,
  copyH5ShareLink,
} = useMeditationReportShare(posterRef, getSharePayload, {
  getPayloadAsync: getSharePayloadForShare,
});

const shareSheetActions = computed(() => {
  const rows: { name: string; value: string }[] = [];
  if (canCreateTeamInvitePoster.value) {
    rows.push({ name: '团队分享', value: 'posterTeamInvite' });
  }
  rows.push({ name: '个人成团分享', value: 'posterPersonalInvite' });
  // #ifdef MP-WEIXIN
  rows.push(
    { name: '分享给微信好友或群', value: 'friend' },
    { name: '分享到微信朋友圈', value: 'timeline' },
  );
  // #endif
  rows.push({ name: '生成分享海报', value: 'poster' });
  // #ifdef H5
  rows.push({ name: '复制页面链接', value: 'copyLink' });
  // #endif
  return rows;
});

async function openShareSheet() {
  const code = inviteCode.value.trim();
  if (inviteLanding.value && code) {
    try {
      uni.setStorageSync("PENDING_INVITE_CODE", code);
    } catch {
      /* ignore */
    }
    uni.navigateTo({
      url: `/pages/login/index?inviteCode=${encodeURIComponent(code)}`,
    });
    return;
  }
  if (userStore.isLoggedIn) {
    try {
      await teamStore.fetchMyCurrentTeams();
    } catch {
      /* ignore */
    }
    await ensureShareToken();
  }
  shareSheetVisible.value = true;
}

/** 微信小程序：保存海报或预览；其它端直接预览 */
function offerPosterAfterGenerate(tempPath: string) {
  // #ifdef MP-WEIXIN
  uni.showActionSheet({
    itemList: ['保存到相册', '预览图片'],
    success: (tap) => {
      if (tap.tapIndex === 0) {
        savePosterToPhotosAlbum(tempPath);
      } else {
        uni.previewImage({ urls: [tempPath] });
      }
    },
  });
  // #endif
  // #ifndef MP-WEIXIN
  uni.previewImage({ urls: [tempPath] });
  // #endif
}

function savePosterToPhotosAlbum(filePath: string) {
  uni.saveImageToPhotosAlbum({
    filePath,
    success: () => {
      uni.showToast({ title: '已保存到相册', icon: 'success' });
    },
    fail: (err) => {
      const msg = String((err as UniApp.GeneralCallbackResult)?.errMsg || '');
      if (msg.includes('auth deny') || msg.includes('authorize') || msg.includes('permission')) {
        uni.showModal({
          title: '需要相册权限',
          content: '保存图片需授权「保存到相册」，请在设置中开启后重试。',
          confirmText: '去设置',
          success: (r) => {
            if (r.confirm) uni.openSetting({});
          },
        });
      } else {
        uni.showToast({ title: '保存失败', icon: 'none' });
      }
    },
  });
}

/** H5：生成报告页海报（底部为报告落地二维码，非邀请） */
async function generateReportPosterAfterReset() {
  resetReportPosterExtras();
  posterJson.value = buildMeditationReportPosterJson(getSharePayload());
  uni.showLoading({ title: '生成中', mask: true });
  try {
    const path = await generatePosterImagePath();
    if (!path) {
      uni.showModal({
        title: '海报生成失败',
        content: '可稍后再试。若多次失败，请检查浏览器与海报中二维码链接域名配置。',
        showCancel: false,
      });
      return;
    }
    offerPosterAfterGenerate(path);
  } finally {
    uni.hideLoading();
    resetReportPosterExtras();
    posterJson.value = buildMeditationReportPosterJson(getSharePayload());
  }
}

/** 先调邀请接口再生成海报（各端一致；底部为邀请链接二维码或接口返回的小程序码图） */
async function generateInviteSharePoster(kind: 'team' | 'personal') {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }
  if (kind === 'team' && firstOwnedTeamId.value == null) {
    uni.showToast({ title: '仅团队负责人可创建团队邀请', icon: 'none' });
    return;
  }
  if (kind === 'personal' && ownedTeamCount.value > 3) {
    uni.showToast({
      title: '您担任负责人的团队超过三个，暂无法生成个人成团分享',
      icon: 'none',
    });
    return;
  }
  resetReportPosterExtras();
  uni.showLoading({ title: '创建邀请…', mask: true });
  try {
    const res =
      kind === 'team'
        ? await postUserCreateTeamInvite({ teamId: firstOwnedTeamId.value as number })
        : await postUserCreatePersonalInvite({});
    const data = unwrapApiData<UserInviteCreatedData>(res);
    if (!data || !applyInviteDataToPosterExtras(data, kind)) return;
    posterJson.value = buildMeditationReportPosterJson(getSharePayload());
    uni.hideLoading();
    uni.showLoading({ title: '生成海报…', mask: true });
    const path = await generatePosterImagePath();
    if (!path) {
      uni.showModal({
        title: '海报生成失败',
        content:
          '可稍后再试。若使用小程序码图片，请确认图片域名已在小程序后台「downloadFile 合法域名」中配置。',
        showCancel: false,
      });
      return;
    }
    offerPosterAfterGenerate(path);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '创建邀请失败';
    uni.showToast({ title: msg, icon: 'none' });
  } finally {
    uni.hideLoading();
    resetReportPosterExtras();
    posterJson.value = buildMeditationReportPosterJson(getSharePayload());
  }
}

async function onShareSheetSelect(item: { name: string; value?: string }) {
  const v = item.value;
  if (v === 'poster') {
    await generateReportPosterAfterReset();
    return;
  }
  if (v === 'posterTeamInvite') {
    await generateInviteSharePoster('team');
    return;
  }
  if (v === 'posterPersonalInvite') {
    await generateInviteSharePoster('personal');
    return;
  }
  if (v === 'friend') {
    openFriendShareGuide();
    return;
  }
  if (v === 'timeline') {
    openTimelineShareGuide();
    return;
  }
  if (v === 'copyLink') {
    const base = import.meta.env.VITE_H5_SHARE_BASE?.trim();
    if (!base) {
      uni.showToast({ title: '请在环境变量配置 VITE_H5_SHARE_BASE', icon: 'none' });
      return;
    }
    await copyH5ShareLink(base);
  }
}

const movementCount = ref(0);
/** `focusScore` 等，优先于本地估算 */
const focusScoreFromApi = ref<number | null>(null);
// “中道实践”进度（0~1）；`attachmentRatio` 或 `focusScore`
const harmonyProgress = ref(0.5);
const harmonyPercent = computed(() => Math.round(harmonyProgress.value));

/** canvas2d 下图表首帧常为占位数据；接口返回后递增 key 强制重挂载（与 `pages/index/report.vue` 一致） */
const bodyTrendChartKey = ref(0);

const stabilityIndex = computed(() => {
  const r = reportFromApi.value;
  if (focusScoreFromApi.value != null) {
    return Math.max(0, Math.min(100, Math.round(focusScoreFromApi.value)));
  }
  if (r?.hrvScore != null && Number.isFinite(Number(r.hrvScore))) {
    return Math.max(0, Math.min(100, Math.round(Number(r.hrvScore))));
  }

  return Math.max(1, Math.min(99, Math.round((avgHeart.value + avgBreath.value) / 2)));
});

const stabilityCardTitle = computed(() => {
  const r = reportFromApi.value;
  if (r?.focusScore != null || focusScoreFromApi.value != null) return '专注指数';
  if (r?.hrvScore != null && Number.isFinite(Number(r.hrvScore))) return 'HRV 指数';
  return '安定指数';
});

const stabilityCardHint = computed(() => {
  const r = reportFromApi.value;
  if (r?.hrvSource === 'heartRate' || (r?.hrvScore != null && Number.isFinite(Number(r.hrvScore)))) {
    return '基于心率体动';
  }
  return '综合评估';
});

function stripMeditationPrefix(raw: string | null | undefined): string {
  const t = String(raw ?? '').trim();
  if (!t) return '';
  return t.replace(/^本次静坐\s*[：:]\s*/u, '').trim();
}

const reportSubtitle = computed(() => {
  const t = stripMeditationPrefix(reportFromApi.value?.stabilityText);
  if (t) return `${t}`;
  const s = stripMeditationPrefix(reportFromApi.value?.summaryText);
  if (s) return s;
  return '你的心律反映出一种深沉的晨雾——静谧、稳健且充满潜力。';
});

const movementCountDisplay = computed(() => {
  if (reportFromApi.value != null) {
    return `${movementCount.value} 次`;
  }
  return `${minHeart.value}-${maxHeart.value}`;
});

const secondaryTitle = computed(() => {
  const t = stripMeditationPrefix(reportFromApi.value?.heartText);
  return t || '如雾般的韧性';
});

const sitCountLine = computed(() => {
  const { totalDays, totalHours, consecutiveDays, sitCount } = reportFromApi.value ?? {};
  if (totalDays != null && totalHours != null && consecutiveDays != null && sitCount != null) {
    return `累计冥想：${totalDays}天、总时长：${totalHours}小时、连续天数：${consecutiveDays}天`;
  }
  return '';
});

const midPathSummary = computed(() => {
  const r = reportFromApi.value;
  if (r?.relaxRatio != null && Number.isFinite(Number(r.relaxRatio))) {
    return `放松占比约 ${Math.round(Number(r.relaxRatio))}% · 和谐度 ${harmonyPercent.value}%`;
  }
  return `已达成 ${harmonyPercent.value}% 和谐度`;
});

/** 接口 `sections` 按 `index` 排序，供趋势图 X 轴与序列一致 */
const sortedReportSections = computed((): MeditationReportSection[] => {
  const secs = reportFromApi.value?.sections;
  if (!secs?.length) return [];
  return [...secs].sort((a, b) => {
    const ia = Number(a.index);
    const ib = Number(b.index);
    const na = Number.isFinite(ia) ? ia : 0;
    const nb = Number.isFinite(ib) ? ib : 0;
    return na - nb;
  });
});


/**
 * 将总「体动次数」近似拆到若干时间点，与兜底趋势图 6 个类目对齐。
 * @param total 总次数（非负整数）
 * @param len 数据点个数
 */
function distributeMovementAcrossPoints(total: number, len: number): number[] {
  if (len <= 0) return [];
  const t = Math.max(0, Math.floor(total));
  if (t === 0) return Array.from({ length: len }, () => 0);
  const base = Math.floor(t / len);
  let rem = t % len;
  const out: number[] = [];
  for (let i = 0; i < len; i++) {
    out.push(base + (i < rem ? 1 : 0));
  }
  return out;
}

const bodyTrendCategories = computed(() => {
  const secs = sortedReportSections.value;
  if (secs.length > 0) {
    return secs.map((s, i) => (s.index != null ? `段${s.index}` : `第${i + 1}段`));
  }
  return ['第1分', '第3分', '第6分', '第9分', '第12分', '结束'];
});

const bodyTrendSeries = computed(() => {
  const secs = sortedReportSections.value;
  if (secs.length > 0) {
    return [
      {
        name: '心率',
        index: 0,
        data: secs.map((s) => Number(s.avgHeartRate ?? 0))
      },
      {
        name: '呼吸',
        index: 0,
        data: secs.map((s) => Number(s.avgBreathRate ?? 0))
      },
      {
        name: '体动',
        index: 1,
        data: secs.map((s) => Math.max(0, Math.floor(Number(s.movementCount) || 0)))
      }
    ];
  }
  const heartSeed = [
    avgHeart.value + 6,
    avgHeart.value + 3,
    avgHeart.value + 1,
    avgHeart.value - 1,
    avgHeart.value,
    avgHeart.value - 2
  ];
  const breathSeed = [
    avgBreath.value + 2,
    avgBreath.value + 1,
    avgBreath.value,
    avgBreath.value - 1,
    avgBreath.value,
    avgBreath.value
  ];
  const movementSeed = distributeMovementAcrossPoints(movementCount.value, heartSeed.length);
  return [
    { name: '心率', index: 0, data: heartSeed },
    { name: '呼吸', index: 0, data: breathSeed },
    { name: '体动', index: 1, data: movementSeed }
  ];
});

const bodyTrendChartData = computed(() => ({
  categories: bodyTrendCategories.value,
  series: bodyTrendSeries.value
}));

const bodyTrendOpts = computed(() => {
  const useSections = sortedReportSections.value.length > 0;
  const yAxisSkin = {
    gridType: 'dash' as const,
    dashLength: 3,
    fontSize: 10,
    fontColor: '#7d7463'
  };
  const legend = {
    show: true,
    position: 'top' as const,
    float: 'left' as const,
    fontSize: 10
  };
  const xAxis = {
    disableGrid: true,
    fontSize: 10,
    fontColor: '#7d7463'
  };
  const extra = {
    line: {
      type: 'curve' as const,
      width: 2,
      activeType: 'hollow' as const
    }
  };

  if (useSections) {
    return {
      color: ['#705900', '#8ea4d2', '#c49a6c'],
      legend,
      padding: [15, 10, 0, 10],
      xAxis,
      yAxis: {
        ...yAxisSkin,
        data: [
          { min: 0, axisLine: false },
          { min: 0, position: 'right' as const, axisLine: false }
        ]
      },
      extra
    };
  }

  return {
    color: ['#705900', '#8ea4d2', '#c49a6c'],
    legend,
    padding: [15, 10, 0, 10],
    xAxis,
    yAxis: {
      ...yAxisSkin,
      data: [
        { min: 0, max: Math.max(120, maxHeart.value + 12), axisLine: false },
        { min: 0, position: 'right' as const, axisLine: false }
      ]
    },
    extra
  };
});

const elapsedMin = computed(() => Math.floor(elapsedSec.value / 60));
const elapsedRemainSec = computed(() => elapsedSec.value % 60);

function toNum(v: unknown, fallback: number) {
  const n = Number(v);
  if (Number.isNaN(n)) return fallback;
  return Math.round(n);
}

function applyReportToView(r: MeditationReport) {
  reportFromApi.value = r;
  const fs = Number(r.focusScore);
  focusScoreFromApi.value = Number.isFinite(fs) ? Math.round(fs) : null;
  elapsedSec.value = Math.floor(Number(r.totalDuration) || 0);
  const ar = Number(r.attachmentRatio);
  if (Number.isFinite(ar)) {
    harmonyProgress.value = Math.min(1, Math.max(0, ar));
  } else if (focusScoreFromApi.value != null) {
    harmonyProgress.value = Math.min(1, Math.max(0, focusScoreFromApi.value / 100));
  }
  if (r.avgHeartRate != null && Number.isFinite(Number(r.avgHeartRate))) {
    avgHeart.value = Number(r.avgHeartRate);
  }
  if (r.avgBreathRate != null && Number.isFinite(Number(r.avgBreathRate))) {
    avgBreath.value = Number(r.avgBreathRate);
  }
  maxHeart.value = Math.max(Math.ceil(avgHeart.value + 8), 80);
  minHeart.value = Math.max(0, Math.floor(avgHeart.value - 8));
  movementCount.value = Math.floor(Number(r.movementCount) || 0);
  void nextTick(() => drawCloudBridgeCanvas(harmonyProgress.value));
}

async function loadReportByShareToken(token: string) {
  visitorMode.value = true;
  sharerInfo.value = null;
  uni.showLoading({ title: "加载报告…", mask: true });
  try {
    const res = await fetchMeditationReportShare({ token });
    const raw = unwrapApiData<unknown>(res);
    const data = parseMeditationReportSharePayload(raw);
    if (data) {
      sharerInfo.value = data.sharer ?? null;
      urlSessionId.value = data.sessionId;
      applyReportToView(data);
      return;
    }
    uni.showModal({
      title: "分享链接无效",
      content: "链接已失效或报告不存在，请让好友重新分享。",
      showCancel: false,
      success: () => {
        uni.switchTab({ url: "/pages/index/home" });
      },
    });
  } catch (e) {
    console.error("fetchMeditationReportShare", e);
    const msg = e instanceof Error ? e.message : "加载失败";
    uni.showModal({
      title: "无法打开分享",
      content: msg,
      showCancel: false,
      success: () => {
        uni.switchTab({ url: "/pages/index/home" });
      },
    });
  } finally {
    uni.hideLoading();
  }
}

async function initReport(q: Record<string, unknown>) {
  const shareToken = String(q.token ?? "").trim();
  if (shareToken) {
    await loadReportByShareToken(shareToken);
    return;
  }

  duration.value = toNum(q.duration, 15);
  manualStop.value = String(q.manualStop || "0") === "1";
  trackTitle.value = decodeURIComponent(String(q.trackTitle || ""));

  const rawSid = q.sessionId;
  const sid = rawSid != null && String(rawSid) !== "" ? Number(rawSid) : NaN;
  urlSessionId.value = Number.isFinite(sid) && sid > 0 ? sid : null;

  if (Number.isFinite(sid) && sid > 0) {
    if (!userStore.isLoggedIn) {
      uni.showToast({ title: "请使用好友分享的链接查看", icon: "none" });
      setTimeout(() => {
        uni.switchTab({ url: "/pages/index/home" });
      }, 2000);
      return;
    }
    uni.showLoading({ title: "加载报告…", mask: true });
    try {
      const res = await fetchMeditationReportDetail({ sessionId: sid });
      const raw = unwrapApiData<unknown>(res);
      const data = parseMeditationReportDetailPayload(raw);
      if (data) {
        applyReportToView(data);
        void ensureShareToken();
        return;
      }
    } catch (e) {
      console.error("fetchMeditationReportDetail", e);
    } finally {
      uni.hideLoading();
    }
  }

  const cached = meditationStore.consumeLastMeditationServerReport();
  if (cached) {
    const normalized = parseMeditationReportDetailPayload(cached as unknown) ?? cached;
    applyReportToView(normalized);
    void ensureShareToken();
    return;
  }

  elapsedSec.value = toNum(q.elapsedSec, duration.value * 60);
  if (q.focusScore != null && String(q.focusScore) !== '') {
    focusScoreFromApi.value = toNum(q.focusScore, 0);
    harmonyProgress.value = Math.min(1, Math.max(0, focusScoreFromApi.value / 100));
  }
  avgHeart.value = toNum(q.avgHeart, 72);
  avgBreath.value = toNum(q.avgBreath, 12);
  maxHeart.value = toNum(q.maxHeart, avgHeart.value + 6);
  minHeart.value = toNum(q.minHeart, avgHeart.value - 6);
  void nextTick(() => drawCloudBridgeCanvas(harmonyProgress.value));
}
function parseInviteSceneRaw(raw: unknown): string {
  if (raw == null) return '';
  const s = String(raw).trim();
  if (!s) return '';
  try {
    return decodeURIComponent(s).trim();
  } catch {
    return s;
  }
}

function hideShareMenuForPage() {
  // #ifdef MP-WEIXIN
  try {
    uni.hideShareMenu({ hideShareItems: ["shareAppMessage", "shareTimeline"] });
  } catch {
    /* 基础库差异 */
  }
  // #endif
}

onLoad((query) => {
  setLeavingMeditationForReportPage(false);
  const q = (query || {}) as Record<string, unknown>;
  inviteCode.value = parseInviteSceneRaw(q.scene);
  void initReport(q);
  if (inviteCode.value.trim() || String(q.token ?? "").trim()) {
    hideShareMenuForPage();
  }
});

onShow(() => {
  if (visitorMode.value || inviteCode.value.trim()) {
    hideShareMenuForPage();
  }
});

function onLcrBack() {
  if (inviteLanding.value) {
    uni.showToast({ title: "请完成加入或登录", icon: "none" });
    return;
  }
  if (visitorMode.value) {
    uni.switchTab({ url: "/pages/index/home" });
    return;
  }
  navigateBack();
}

function onLcrHome() {
  if (inviteLanding.value) {
    uni.showToast({ title: "请完成加入或登录", icon: "none" });
    return;
  }
  uni.switchTab({ url: "/pages/index/home" });
}

// 保留你原本“70%”展示逻辑：画图进度跟随该值
onReady(() => {
  drawCloudBridgeCanvas(harmonyProgress.value);
});

onUnload(() => {
  stopMeditationBackgroundMusic();
});

onBeforeUnmount(() => {
  stopMeditationBackgroundMusic();
});
</script>

<style scoped lang="scss">
.float-soft {
  animation: meditation-float 6s ease-in-out infinite;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

.progress-anim {
  transition: width 0.35s ease;
}

.watercolor-blur {
  filter: blur(40px);
  opacity: 0.6;
}
</style>