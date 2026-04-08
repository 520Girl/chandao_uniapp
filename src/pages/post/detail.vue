<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
    <lcrBar :title="'动态详情'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
    <view v-if="pageLoading" class="py-24 flex justify-center text-sm theme-color-8">加载中…</view>
    <view v-else-if="loadError" class="px-6 py-24 text-center text-sm theme-color-8">{{ loadError }}</view>
    <view v-else-if="detail" class="pb-24">
      <view class="p-4 space-y-4">
        <view class="flex items-center justify-between">
          <view class="flex items-center gap-3">
            <view class="relative p-0.5 rounded-full bg-gradient-to-tr from-primary to-primary/20">
              <image
                :src="displayAvatar"
                class="w-12 h-12 rounded-full object-cover border-2 border-theme-2"
                mode="aspectFill"
              />
            </view>
            <view>
              <view class="font-bold text-[32rpx] flex items-center gap-2">
                {{ displayNickname }}
              </view>
              <p class="text-[24rpx] theme-color-6">{{ postSubline }}</p>
            </view>
          </view>
        </view>
        <view class="space-y-3">
          <view
            class="text-[32rpx] leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap"
          >
            {{ displayContent }}
          </view>
          <!--
            uview up-album：rowCount 只负责分行，单元格边长仍由 multipleSize 决定；
            需按屏宽换算 px，否则默认 70px 会显得「row-count 无效」。
          -->
          <up-album
            v-if="displayImages.length"
            class="post-detail-album w-full"
            :urls="displayImages"
            :row-count="albumRowCount"
            unit="px"
            :multiple-size="albumMultipleSizePx"
            :single-size="albumSingleSizePx"
            :space="albumSpacePx"
            :radius="albumRadiusPx"
            multiple-mode="aspectFill"
            single-mode="aspectFill"
          />
        </view>
        <view class="flex items-center gap-6 py-2 border-y border-primary/10">
          <view
            class="flex items-center gap-1.5"
            :class="detail.isLiked ? 'theme-color-1' : 'text-slate-500 dark:text-slate-400'"
            @click="onToggleLike"
          >
            <text class="iconfont icon-heart-fill text-[48rpx]"></text>
            <text class="text-[28rpx] font-bold">{{ detail.likeCount ?? 0 }}</text>
          </view>
          <view class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <text class="iconfont icon-chat-bubble-1 text-[48rpx]"></text>
            <text class="text-[28rpx] font-bold">{{ detail.commentCount ?? 0 }}</text>
          </view>
        </view>
      </view>
      <view class="flex items-center px-4 py-6 gap-3">
        <text class="iconfont icon-Cloudy theme-color-3 text-[72rpx]"></text>
        <view class="text-[36rpx] font-bold">全部评论</view>
        <view class="h-[1px] flex-1 bg-gradient-to-r from-primary/20 to-transparent"></view>
      </view>
      <view class="px-4 py-8 text-center text-sm theme-color-8">暂无评论</view>
    </view>
    <view
      v-if="detail"
      class="fixed bottom-0 left-0 right-0 p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-primary/10"
    >
      <view class="max-w-2xl mx-auto flex items-center gap-3">
        <view class="flex-1 relative">
          <input
            style="height: 70rpx; min-height: auto; line-height: 1"
            class="w-full bg-slate-100 dark:bg-white/10 border-none rounded-full py-[20rpx] pl-[15rpx] text-[28rpx] focus:ring-2 focus:ring-primary/50 placeholder-slate-400"
            placeholder="说点什么..."
            type="text"
          />
          <text
            class="iconfont icon-sentiment-satisfied absolute right-0 top-1/2 -translate-y-1/2 text-[48rpx] theme-color-1"
          ></text>
        </view>
        <view class="flex items-center gap-1 bg-theme-10 p-1 rounded-full">
          <view
            class="w-[80rpx] h-[80rpx] flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300"
            @click="onToggleLike"
          >
            <text
              class="iconfont icon-heart-fill text-[48rpx]"
              :class="detail.isLiked ? 'theme-color-1' : ''"
            ></text>
          </view>
          <view
            class="w-[80rpx] h-[80rpx] flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300"
          >
            <text class="iconfont icon-star text-[48rpx]"></text>
          </view>
          <view
            class="bg-theme-1 w-[80rpx] h-[80rpx] flex items-center justify-center rounded-full text-white bg-primary shadow-md"
          >
            <text class="iconfont icon-send text-[48rpx]"></text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { fetchPostDetail, postPostLike } from "@/assets/js/api/post";
import { getDictJumpType } from "@/assets/js/api/dict";
import { config } from "@/assets/js/config";
import type { PostDetailInfo } from "@/types/api/post";
import type { resItem } from "@/types/api/dict";
import { formatRelativeTime } from "@/utils";
import { unwrapApiData, unwrapApiList } from "@/utils/apiResponse";
import { navigateBack } from "@/utils/navigation";
import lcrBar from "@/components/lcrBar.vue";

const postId = ref<number | null>(null);
const detail = ref<PostDetailInfo | null>(null);
const pageLoading = ref(true);
const loadError = ref("");
const userStateLabelByValue = ref<Map<number, string>>(new Map());

function resolveMediaUrl(raw: string | null | undefined): string {
  const u = (raw || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return `https:${u}`;
  const base = config.baseURL.replace(/\/+$/, "");
  const path = u.startsWith("/") ? u : `/${u}`;
  return `${base}${path}`;
}

const displayNickname = computed(() => detail.value?.nickName?.trim() || "云友");

const displayAvatar = computed(() => {
  const u = detail.value?.avatarUrl;
  if (u) return resolveMediaUrl(u);
  const id = postId.value ?? 0;
  return `https://picsum.photos/seed/postdetail${id}/100/100`;
});

const displayContent = computed(() => detail.value?.content?.trim() || "");

const displayImages = computed(() => {
  const list = detail.value?.images;
  if (!list?.length) return [];
  return list.map((u) => resolveMediaUrl(u)).filter(Boolean);
});

/** 与正文区 `p-4` 左右留白一致的 rpx，用于换算相册格宽 */
const ALBUM_PAD_RPX = 64;
const ALBUM_GAP_RPX = 12;
/** 每行张数；与社区列表九宫格习惯一致用 2 */
const albumRowCount = 2;

function pxFromRpx(rpx: number): number {
  try {
    return uni.upx2px(rpx);
  } catch {
    const ww = uni.getSystemInfoSync().windowWidth || 375;
    return (rpx / 750) * ww;
  }
}

/** 多图时每格边长（px），保证 rowCount 列大致铺满内容区 */
const albumMultipleSizePx = computed(() => {
  const ww = uni.getSystemInfoSync().windowWidth || 375;
  const pad = pxFromRpx(ALBUM_PAD_RPX);
  const gap = pxFromRpx(ALBUM_GAP_RPX);
  const inner = Math.max(0, ww - pad - gap * (albumRowCount - 1));
  return Math.max(80, Math.floor(inner / albumRowCount));
});

/** 单图时长边约等于内容区宽度（px） */
const albumSingleSizePx = computed(() => {
  const ww = uni.getSystemInfoSync().windowWidth || 375;
  const pad = pxFromRpx(ALBUM_PAD_RPX);
  return Math.max(120, Math.floor(ww - pad));
});

const albumSpacePx = computed(() => pxFromRpx(ALBUM_GAP_RPX));
const albumRadiusPx = computed(() => pxFromRpx(60));

function postTypeBase(t: number | undefined | null): string {
  if (t === 1) return "分享报告";
  if (t === 2) return "照见分享";
  return "动态";
}

const postSubline = computed(() => {
  const d = detail.value;
  if (!d) return "";
  const base = postTypeBase(d.postType ?? d.type);
  const s = d.userState;
  if (s == null) return `${formatRelativeTime(d.createTime)} · ${base}`;
  const stateLabel = userStateLabelByValue.value.get(s);
  return stateLabel
    ? `${formatRelativeTime(d.createTime)} · ${base} · ${stateLabel}`
    : `${formatRelativeTime(d.createTime)} · ${base}`;
});

async function refreshPostUserStateDict() {
  try {
    const res = await getDictJumpType({ types: ["post_user_state"] });
    const list = unwrapApiList(res["data"]["post_user_state"]) as resItem[];
    const next = new Map<number, string>();
    for (const row of list) {
      next.set(row.value, row.name);
    }
    userStateLabelByValue.value = next;
  } catch (e) {
    console.error("refreshPostUserStateDict", e);
  }
}

async function loadDetail() {
  const id = postId.value;
  if (id == null || Number.isNaN(id)) {
    loadError.value = "无效动态";
    pageLoading.value = false;
    return;
  }
  pageLoading.value = true;
  loadError.value = "";
  try {
    await refreshPostUserStateDict();
    const res = await fetchPostDetail({ id });
    const data = unwrapApiData<PostDetailInfo>(res);
    if (!data || typeof data !== "object") {
      loadError.value = "未找到该动态";
      detail.value = null;
      return;
    }
    detail.value = data;
  } catch (e) {
    console.error("fetchPostDetail", e);
    loadError.value = "加载失败，请稍后重试";
    detail.value = null;
  } finally {
    pageLoading.value = false;
  }
}

async function onToggleLike() {
  const d = detail.value;
  if (!d || d.isLiked) return;
  const prev = d.likeCount ?? 0;
  d.likeCount = prev + 1;
  d.isLiked = true;
  try {
    await postPostLike({ id: d.id });
  } catch (e) {
    console.error("postPostLike", e);
    d.likeCount = prev;
    d.isLiked = false;
    uni.showToast({ title: "点赞失败", icon: "none" });
  }
}

const onBack = () => {
  navigateBack();
};

onLoad((options) => {
  const raw = options?.id;
  const n = typeof raw === "string" ? Number.parseInt(raw, 10) : Number(raw);
  if (!Number.isFinite(n)) {
    uni.showToast({ title: "参数错误", icon: "none" });
    pageLoading.value = false;
    loadError.value = "无效动态";
    return;
  }
  postId.value = n;
  loadDetail();
});
</script>
