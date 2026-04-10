<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
    <lcrBar :title="'消息详情'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
    <view class="flex-1 px-6 pt-4 pb-7 box-border">
      <view
        v-if="loading"
        class="py-20 text-center font-body text-[28rpx] text-on-surface-variant"
      >
        加载中…
      </view>
      <view
        v-else-if="loadError"
        class="py-20 text-center space-y-4"
      >
        <view class="font-body text-[28rpx] text-on-surface-variant">{{ loadError }}</view>
        <button
          class="bg-primary/20 text-primary border border-primary/20 font-label text-xs px-8 py-3 rounded-full"
          @click="reload"
        >
          重试
        </button>
      </view>
      <view
        v-else-if="!detail"
        class="py-20 text-center font-body text-[28rpx] text-on-surface-variant"
      >
        消息不存在或已删除
      </view>

      <template v-else>
        <view class="mb-8 flex flex-wrap gap-2 items-center">
          <up-tag :text="contentTypeLabel" type="warning" plain size="mini" />
          <up-tag
            v-if="meta.readStatus === 0"
            text="未读"
            type="error"
            plain
            size="mini"
          />
        </view>

        <!-- Meta -->
        <view class="mb-10">
          <view class="flex items-center gap-4 mb-6">
            <view
              class="w-12 h-12 rounded-full overflow-hidden bg-primary/5 ring-1 ring-primary/10 shrink-0 flex items-center justify-center"
            >
              <image
                v-if="senderAvatarResolved"
                :src="senderAvatarResolved"
                class="w-full h-full"
                mode="aspectFill"
              />
              <text v-else class="iconfont icon-notifications_active text-[45rpx] text-primary" />
            </view>
            <view class="min-w-0">
              <view class="font-label text-[20rpx] uppercase tracking-[0.2em] text-on-surface-variant">
                来自
              </view>
              <view class="font-headline text-[36rpx] italic text-primary truncate">
                {{ detail.senderName }}
              </view>
            </view>
          </view>
          <view class="space-y-2">
            <view class="font-label text-[20rpx] uppercase tracking-[0.3em] text-primary/70 font-medium">
              {{ detail.createTimeLabel }}
            </view>
            <view
              v-if="meta.sendTime"
              class="font-label text-[20rpx] text-on-surface-variant/80"
            >
              发送时间 {{ meta.sendTime }}
            </view>
            <view class="font-headline text-[56rpx] leading-tight text-on-surface pt-1 break-words">
              {{ detail.title }}
            </view>
          </view>
        </view>

        <!-- 0 纯文本 -->
        <template v-if="detail.contentType === 0">
          <view
            class="font-body text-[30rpx] leading-[1.85] text-on-surface/85 whitespace-pre-wrap break-words"
          >
            {{ detail.content }}
          </view>
        </template>

        <!-- 1 图文 -->
        <template v-else-if="detail.contentType === 1">
          <view
            class="font-body text-[30rpx] leading-[1.85] text-on-surface/85 whitespace-pre-wrap break-words mb-6"
          >
            {{ detail.content }}
          </view>
          <view
            v-if="albumUrls.length"
            class="message-detail-album-host w-full max-w-full overflow-hidden box-border"
          >
            <up-album
              class="message-detail-album w-full max-w-full"
              :urls="albumUrls"
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
        </template>

        <!-- 2 图文链接 -->
        <template v-else-if="detail.contentType === 2">
          <view
            class="font-body text-[30rpx] leading-[1.85] text-on-surface/85 whitespace-pre-wrap break-words mb-6"
          >
            {{ detail.content }}
          </view>
          <view
            v-if="albumUrls.length"
            class="message-detail-album-host w-full max-w-full overflow-hidden box-border mb-8"
          >
            <up-album
              class="message-detail-album w-full max-w-full"
              :urls="albumUrls"
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
          <up-divider text="相关链接" text-color="#918355" line-color="rgba(112,89,0,0.15)" />
          <view class="pt-4">
            <up-link
              :href="detail.linkUrl || ''"
              :text="detail.linkTitle || '打开链接'"
              color="#705900"
              :font-size="14"
              under-line
            />
          </view>
        </template>

        <!-- 3 文本链接 -->
        <template v-else-if="detail.contentType === 3">
          <view
            class="font-body text-[30rpx] leading-[1.85] text-on-surface/85 whitespace-pre-wrap break-words mb-6"
          >
            {{ detail.content }}
          </view>
          <up-cell-group :border="false" class="rounded-2xl overflow-hidden bg-white/40 dark:bg-white/5">
            <up-cell
              :title="detail.linkTitle || '查看详情'"
              is-link
              :border="false"
              @click="openLink(detail.linkUrl)"
            >
              <template #icon>
                <text class="iconfont icon-wenbenlianjielie text-[40rpx] theme-color-1 mr-2" />
              </template>
            </up-cell>
          </up-cell-group>
          <view class="mt-4">
            <up-link
              :href="detail.linkUrl || ''"
              :text="detail.linkUrl || ''"
              color="#918355"
              :font-size="12"
              :under-line="false"
            />
          </view>
        </template>

        <view class="my-10 flex justify-center">
          <view class="w-px h-1 bg-gradient-to-b from-primary/20 to-transparent" />
        </view>
        <footer class="text-center">
          <view class="font-headline italic text-on-surface-variant/60">云息 · 消息中心</view>
        </footer>
      </template>
    </view>

    <view class="fixed bottom-10 left-0 w-full px-8 flex justify-center pointer-events-none">
      <button
        class="pointer-events-auto bg-primary/20 text-primary border border-primary/20 font-label text-xs uppercase tracking-[0.2em] px-10 py-4 rounded-full shadow-sm active:scale-95 flex items-center gap-3"
        @click="onReplyTap"
      >
        <text class="iconfont icon-reply text-[36rpx]" />
        回复
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { config } from "@/assets/js/config";
import { fetchMessageInfo, markMessageRead } from "@/assets/js/api/message";
import type { MessageInfo } from "@/types/api/message";
import type { MessageDetailView } from "@/types/pages/message";
import { messageInfoToDetailView } from "@/utils/messageDetail";
import { unwrapApiData } from "@/utils/apiResponse";
import { navigateBack } from "@/utils/navigation";
import { formatDate } from "@/utils/common";
import lcrBar from "@/components/lcrBar.vue";

/**
 * 与外层 `px-6`（Tailwind spacing 6 = 1.5rem/侧，750 稿约 48rpx/侧）对齐。
 * up-album 多图总宽 = n×格宽 + (n-1)×间距，须按「屏宽 − 左右 padding」计算。
 */
const ALBUM_SIDE_PAD_RPX = 48;
const ALBUM_GAP_RPX = 12;
const albumRowCount = 3;

function pxFromRpx(rpx: number): number {
  try {
    return uni.upx2px(rpx);
  } catch {
    const ww = uni.getSystemInfoSync().windowWidth || 375;
    return (rpx / 750) * ww;
  }
}

/** 与页面内容区同宽的可用宽度（px） */
const albumContentWidthPx = computed(() => {
  const ww = uni.getSystemInfoSync().windowWidth || 375;
  const side = pxFromRpx(ALBUM_SIDE_PAD_RPX);
  return Math.max(0, ww - 2 * side);
});

const albumMultipleSizePx = computed(() => {
  const gap = pxFromRpx(ALBUM_GAP_RPX);
  const w = albumContentWidthPx.value;
  const n = albumRowCount;
  const cell = Math.floor((w - gap * (n - 1)) / n);
  return Math.max(48, cell);
});

const albumSingleSizePx = computed(() => {
  const w = albumContentWidthPx.value;
  return Math.max(80, Math.floor(w));
});

const albumSpacePx = computed(() => pxFromRpx(ALBUM_GAP_RPX));
const albumRadiusPx = computed(() => pxFromRpx(16));

function resolveMediaUrl(raw: string | undefined | null): string {
  const u = (raw || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return `https:${u}`;
  const base = config.baseURL.replace(/\/+$/, "");
  const path = u.startsWith("/") ? u : `/${u}`;
  return `${base}${path}`;
}

const loading = ref(true);
const loadError = ref("");
const detail = ref<MessageDetailView | null>(null);
/** 接口原始字段（readStatus、sendTime 等） */
const meta = ref<Pick<MessageInfo, "readStatus" | "sendTime">>({
  readStatus: 1,
  sendTime: "",
});

let currentMessageId: number | null = null;

const contentTypeLabel = computed(() => {
  const t = detail.value?.contentType ?? 0;
  if (t === 0) return "纯文本";
  if (t === 1) return "图文";
  if (t === 2) return "图文链接";
  return "文本链接";
});

const albumUrls = computed(() => {
  const list = detail.value?.images;
  if (!list?.length) return [];
  return list.map((u) => resolveMediaUrl(u)).filter(Boolean);
});

const senderAvatarResolved = computed(() => {
  const a = detail.value?.senderAvatar?.trim();
  if (!a) return "";
  return resolveMediaUrl(a);
});

const sendTimeDisplay = computed(() => {
  const s = meta.value.sendTime?.trim();
  if (!s) return "";
  try {
    return formatDate(s, "YYYY-MM-DD HH:mm");
  } catch {
    return s;
  }
});

async function loadDetail(messageId: number) {
  loading.value = true;
  loadError.value = "";
  detail.value = null;
  currentMessageId = messageId;
  try {
    const res = await fetchMessageInfo({ messageId });
    const data = unwrapApiData<MessageInfo | null>(res);
    if (data == null) {
      loadError.value = "未找到该消息";
      return;
    }
    meta.value = {
      readStatus: data.readStatus,
      sendTime: data.sendTime || "",
    };
    detail.value = messageInfoToDetailView(data);
    if (data.readStatus === 0) {
      try {
        await markMessageRead({ messageId });
        meta.value.readStatus = 1;
      } catch {
        /* 已读标记失败不影响阅读 */
      }
    }
  } catch (e) {
    console.error("fetchMessageInfo", e);
    loadError.value = "加载失败，请检查网络后重试";
  } finally {
    loading.value = false;
  }
}

function reload() {
  if (currentMessageId != null) void loadDetail(currentMessageId);
}

const onBack = () => {
  navigateBack();
};

function openLink(url: string | undefined) {
  const u = (url || "").trim();
  if (!u) {
    uni.showToast({ title: "暂无链接", icon: "none" });
    return;
  }
  if (/^https?:\/\//i.test(u)) {
    // #ifdef H5
    window.open(u, "_blank");
    // #endif
    // #ifndef H5
    uni.setClipboardData({
      data: u,
      success: () => uni.showToast({ title: "链接已复制", icon: "none" }),
    });
    // #endif
    return;
  }
  uni.showToast({ title: "请在浏览器中打开", icon: "none" });
}

function onReplyTap() {
  uni.showToast({ title: "回复功能待接入", icon: "none" });
}

onLoad((options) => {
  const raw = options?.id ?? options?.messageId;
  const id = raw != null ? Number(raw) : NaN;
  if (Number.isNaN(id) || id <= 0) {
    loading.value = false;
    loadError.value = "缺少消息 id";
    return;
  }
  void loadDetail(id);
});
</script>

<style scoped lang="scss">
.message-detail-album-host {
  box-sizing: border-box;
}

.message-detail-album {
  box-sizing: border-box;
  max-width: 100%;
  overflow: hidden;
}
</style>
