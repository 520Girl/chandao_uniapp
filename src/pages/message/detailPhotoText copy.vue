<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
    <lcrBar :title="'消息详情'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
    <view class="flex-1 px-8 pt-4 pb-28">
      <!-- 开发用：切换 contentType 虚拟样例 -->
      <view v-if="showMockSwitcher" class="mb-6">
        <view class="font-label text-[20rpx] theme-color-8 mb-2">虚拟样例（contentType）</view>
        <up-subsection
          :list="subsectionList"
          :current="subsectionIndex"
          active-color="#705900"
          inactive-color="#7d7463"
          @change="onSubsectionChange"
        />
      </view>

      <view class="mb-8 flex flex-wrap gap-2">
        <up-tag :text="contentTypeLabel" type="warning" plain size="mini" />
      </view>

      <!-- Meta -->
      <view class="mb-10">
        <view class="flex items-center gap-4 mb-6">
          <view class="w-12 h-12 rounded-full overflow-hidden bg-primary/5 ring-1 ring-primary/10 shrink-0">
            <image :src="detail.senderAvatar" class="w-full h-full" mode="aspectFill" />
          </view>
          <view class="min-w-0">
            <view class="font-label text-[20rpx] uppercase tracking-[0.2em] text-on-surface-variant">来自</view>
            <view class="font-headline text-[36rpx] italic text-primary truncate">{{ detail.senderName }}</view>
          </view>
        </view>
        <view class="space-y-2">
          <view class="font-label text-[20rpx] uppercase tracking-[0.3em] text-primary/70 font-medium">
            {{ detail.createTimeLabel }}
          </view>
          <view class="font-headline text-[56rpx] leading-tight text-on-surface pt-1 break-words">{{ detail.title }}</view>
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
        <up-album
          v-if="albumUrls.length"
          class="message-detail-album w-full"
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
      </template>

      <!-- 2 图文链接 -->
      <template v-else-if="detail.contentType === 2">
        <view
          class="font-body text-[30rpx] leading-[1.85] text-on-surface/85 whitespace-pre-wrap break-words mb-6"
        >
          {{ detail.content }}
        </view>
        <up-album
          v-if="albumUrls.length"
          class="message-detail-album w-full mb-8"
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
        <view class="w-px h-16 bg-gradient-to-b from-primary/20 to-transparent" />
      </view>
      <footer class="text-center">
        <view class="font-headline italic text-on-surface-variant/60">云息 · 消息中心</view>
      </footer>
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
import type { MessageDetailView } from "@/types/pages/message";
import { navigateBack } from "@/utils/navigation";
import lcrBar from "@/components/lcrBar.vue";

const showMockSwitcher = true;

/** 与正文区左右留白一致的 rpx，用于 up-album 换算 */
const ALBUM_PAD_RPX = 64;
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

const albumMultipleSizePx = computed(() => {
  const ww = uni.getSystemInfoSync().windowWidth || 375;
  const pad = pxFromRpx(ALBUM_PAD_RPX);
  const gap = pxFromRpx(ALBUM_GAP_RPX);
  const inner = Math.max(0, ww - pad - gap * (albumRowCount - 1));
  return Math.max(72, Math.floor(inner / albumRowCount));
});

const albumSingleSizePx = computed(() => {
  const ww = uni.getSystemInfoSync().windowWidth || 375;
  const pad = pxFromRpx(ALBUM_PAD_RPX);
  return Math.max(120, Math.floor(ww - pad));
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

/** 四种 contentType 的虚拟数据（可替换为接口详情） */
const MOCK_DETAILS: MessageDetailView[] = [
  {
    id: 9001,
    contentType: 0,
    title: "在声音中寻找寂静",
    senderName: "云溪精舍",
    senderAvatar: "https://picsum.photos/seed/msg0/120/120",
    createTimeLabel: "2025年4月8日",
    content:
      "风虽不语，却带走了山谷的歌声。\n\n在今天的集体练习中，我们注意到社区空间产生了一种美妙的共鸣。愿你呼吸绵长，心境轻盈。",
  },
  {
    id: 9002,
    contentType: 1,
    title: "本周共修影像",
    senderName: "活动小助手",
    senderAvatar: "https://picsum.photos/seed/msg1/120/120",
    createTimeLabel: "昨天 18:30",
    content: "以下是本期线下共修的现场记录，点击图片可预览大图。",
    images: [
      "https://picsum.photos/seed/m1/800/600",
      "https://picsum.photos/seed/m2/800/600",
      "https://picsum.photos/seed/m3/800/600",
      "https://picsum.photos/seed/m4/800/600",
    ],
  },
  {
    id: 9003,
    contentType: 2,
    title: "新活动已发布",
    senderName: "系统通知",
    senderAvatar: "https://picsum.photos/seed/msg2/120/120",
    createTimeLabel: "今天 09:12",
    content: "春季户外禅修已开始报名，海报如下。报名请戳下方链接完成登记。",
    images: ["https://picsum.photos/seed/act/900/600", "https://picsum.photos/seed/act2/900/600"],
    linkUrl: "https://example.com/activity/spring-outdoor",
    linkTitle: "立即报名 · 春季户外禅修",
  },
  {
    id: 9004,
    contentType: 3,
    title: "账号安全提醒",
    senderName: "安全中心",
    senderAvatar: "https://picsum.photos/seed/msg3/120/120",
    createTimeLabel: "2 小时前",
    content:
      "我们检测到您在新设备登录。如非本人操作，请尽快修改密码并检查账号绑定信息。说明文档见下方链接。",
    linkUrl: "https://example.com/help/security",
    linkTitle: "查看安全说明",
  },
];

const detail = ref<MessageDetailView>({ ...MOCK_DETAILS[0] });

const subsectionList = computed(() =>
  MOCK_DETAILS.map((m, i) => ({
    name: `${i}·${contentTypeShort(m.contentType)}`,
  })),
);

const subsectionIndex = ref(0);

function contentTypeShort(t: number) {
  if (t === 0) return "文本";
  if (t === 1) return "图文";
  if (t === 2) return "图链";
  return "文链";
}

const contentTypeLabel = computed(() => {
  const t = detail.value.contentType;
  if (t === 0) return "纯文本";
  if (t === 1) return "图文";
  if (t === 2) return "图文链接";
  return "文本链接";
});

const albumUrls = computed(() => {
  const list = detail.value.images;
  if (!list?.length) return [];
  return list.map((u) => resolveMediaUrl(u)).filter(Boolean);
});

function onSubsectionChange(index: number) {
  subsectionIndex.value = index;
  const next = MOCK_DETAILS[index];
  if (next) detail.value = { ...next };
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
  const raw = options?.type ?? options?.contentType;
  const n = raw != null ? Number(raw) : NaN;
  if (!Number.isNaN(n) && n >= 0 && n <= 3) {
    subsectionIndex.value = n;
    detail.value = { ...MOCK_DETAILS[n] };
  }
});
</script>

<style scoped lang="scss">
.message-detail-album {
  width: 100%;
}
</style>
