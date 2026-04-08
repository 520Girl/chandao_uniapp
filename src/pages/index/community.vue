<template>
  <view class="min-h-screen theme-bg pb-[calc(120rpx+env(safe-area-inset-bottom))]">
    <HomeBar :title="'云息社区'" description="安 定 共 修" :leftIcon="'icon-shopping-bag'" :handleClick="gotoShop" />
    <view class="px-4 py-6">
      <view class="text-center">
        <view class="text-[48rpx] font-bold mb-6">今日照见：________</view>
        <view class="relative max-w-[90%] mx-auto">
          <input style="height: 132rpx; min-height: auto; line-height: 2" v-model="content"
            class="w-full bg-white border border-theme-12 rounded-full text-center italic text-[#d4af35]/60 shadow-sm"
            placeholder="分享你的内心天空..." />
          <view @click="goPublishPost"
            class="absolute bg-theme-1 right-2 top-2 text-white w-[96rpx] h-[96rpx] rounded-full shadow-lg flex items-center justify-center">
            <text class="iconfont icon-send text-[48rpx] bg-theme-1"></text>
          </view>
        </view>
      </view>

      <!-- 排行榜 -->
      <view class="mb-10 overflow-hidden mt-8">
        <view class="flex items-center justify-between mb-4 px-2" @click="goRank()">
          <view class="text-sm font-bold uppercase tracking-widest theme-color-1">安宁指数榜</view>
          <text class="text-xs font-medium theme-color-8 flex items-center gap-1">
            <text class="icon-auto_awesome iconfont text-[28rpx]"></text>
            关注内在成长
          </text>
        </view>
        <view class="flex items-center gap-4 overflow-x-auto pb-[32rpx] no-scrollbar">
          <view v-for="(item, index) in rankList" :key="index" class="flex flex-col items-center gap-2">
            <view :class="index === 0 ? 'border-2 border-theme-1 shadow-[0_0_15px_rgba(212,175,53,0.3)]' : 'border border-primary/20'
              " class="relative p-[12rpx] rounded-full">
              <image :alt="item.name" class="w-[90rpx] h-[90rpx] rounded-full object-cover" :src="item.imgUrl"
                mode="aspectFill" :lazy-load="true" :show-menu="false" />
            </view>
            <span :class="index === 0 ? 'theme-color-1' : 'theme-color-8'" class="text-[20rpx] font-bold">{{
              item.name
            }}</span>
          </view>
        </view>
      </view>

      <!-- 融合流：随页面一起滚动，触底加载更多 -->
      <view v-if="feedLoading && feedList.length === 0"
        class="py-16 flex items-center justify-center text-sm theme-color-8">
        加载中…
      </view>
      <view v-else-if="!feedLoading && feedList.length === 0"
        class="py-16 flex items-center justify-center text-sm theme-color-8">
        暂无动态
      </view>
      <view v-else class="flex flex-col gap-6">
        <view v-for="(item, index) in feedList" :key="`${item.itemType}-${item.id}`" class="block">
          <view :class="index % 2 === 0 ? 'bg-[#ffffff80] shadow-md' : 'bg-[#d4af350d] shadow-sm'"
            class="relative border border-[#d4af35]/5 p-6 rounded-[2rem]">
            <view v-if="item.itemType === 'activity' && item.isTop === 1"
              class="absolute top-4 right-4 text-[20rpx] theme-color-1 font-bold">
              置顶
            </view>
            <view class="flex items-center gap-3 mb-6 ">
              <up-image :src="feedAvatar(item, index)" :lazy-load="true" width="90rpx" height="90rpx"
                class="w-[90rpx] h-[90rpx] rounded-full border-2 border-theme-3 overflow-hidden" mode="aspectFill" />
              <view class="min-w-0 flex-1">
                <view class="text-sm font-bold">{{ feedNickname(item) }}</view>
                <view class="flex items-center gap-1 flex-wrap">
                  <template v-if="item.itemType === 'activity'">
                    <text class="iconfont icon-MapPin text-[20rpx] cloud-glow-active theme-color-8 shrink-0"></text>
                    <text
                      class="text-[20rpx] theme-color-8 font-medium uppercase tracking-wider block line-clamp-1">
                      {{ feedActivitySubline(item) }}
                    </text>
                    <text
                      class="text-[80rpx] theme-color-2 iconfont italic icon-huodong text-[#b4d2e761] absolute -right-0 -top-0"></text>
                  </template>
                  <template v-else>
                    <text class="text-[20rpx] theme-color-8 font-medium uppercase tracking-wider block">{{
                      feedPostSubline(item) }}</text>
                    <text class="text-[30rpx] theme-color-2 iconfont italic icon-pengyouquan text-[#E8C3A1]"></text>
                  </template>
                </view>
              </view>
              <text class="iconfont text-[28rpx] theme-color-1 ml-auto shrink-0"
                :class="'icon-' + feedMoodIcon(item)"></text>
            </view>
            <template v-if="item.itemType === 'activity'">
              <text
                class="theme-color-7 leading-relaxed mb-[32rpx] italic text-[30rpx] px-[16rpx] block first-letter:text-3xl first-letter:mr-3 first-letter:float-left first-letter:font-headline first-letter:text-primary/80"
                @click="onFeedNavigate(item)">
                “{{ feedActivityQuote(item) }}”
              </text>
            </template>
            <template v-else>
              <!-- 小程序端 text 上 v-html 不渲染；用 rich-text + 有限 HTML（span） -->
              <view
                class="theme-color-7 leading-relaxed mb-[32rpx] text-[30rpx] px-[16rpx] block"
                @click="onFeedNavigate(item)"
              >
                <rich-text :nodes="feedContent(item)" />
              </view>
            </template>

            <view v-if="feedImages(item).length" class="grid grid-cols-2 gap-2 mb-[32rpx]" @click="onFeedNavigate(item)" >
              <up-image width="100%" height="256rpx" radius="30rpx" class="w-full h-[256rpx] object-cover"
                v-for="(img, imgIndex) in feedImages(item)" :key="imgIndex" :src="img" mode="aspectFill">
                <template #error>
                  <view style="font-size: 24rpx;">加载失败</view>
                </template>
                <template #loading>
                  <view style="font-size: 24rpx;">加载中...</view>
                </template>
              </up-image>
            </view>
            <view class="flex items-center justify-between border-t border-[#d4af35]/5 pt-1">
              <view class="flex items-center gap-6" v-if="item.itemType === 'post'">
                <view class="flex items-center gap-1" :class="item.isLiked ? 'theme-color-1' : 'theme-color-12'"
                  @click.stop="onToggleLike(item)">
                  <text class="iconfont icon-heart-fill text-[35rpx] cloud-glow-active" :class="{'text-theme-1': item.isLiked}"></text>
                  <text class="text-[24rpx] font-bold">{{ item.likeCount ?? 0 }} 点亮</text>
                </view>
                <view class="flex items-center gap-1 theme-color-8 align-baseline">
                  <text class="iconfont icon-chat-bubble-1 text-[35rpx]"></text>
                  <text class="text-[24rpx] font-medium h-full">回响</text>
                </view>
              </view>
              <view class="flex items-center gap-1" v-if="item.itemType === 'activity'">
                <view class="flex items-center gap-1 theme-color-1">
                  <text class="iconfont icon-canjia text-[24rpx]"></text>
                  <text class="text-[24rpx] font-medium">{{ item.participantCount ?? 0 }} </text>
                </view>
                <view
                  class="flex items-center ml-[20rpx] px-[24rpx] text-[24rpx] py-[20rpx] rounded-full bg-theme-13 theme-color-1 text-xs font-bold transition-transform active:scale-95">
                  <text class="iconfont icon-person-fill text-[35rpx]"></text>
                  <text class="text-[24rpx] icon-done-all iconfont font-medium" @click="handleJoinActivity(item)">{{ item.isJoined ? '了解详情' : '加入' }}</text>
                </view>
              </view>
              <view class="flex flex-col items-center gap-1 shrink-0">
                <text class="text-[20rpx] text-[#d4af35]/40">{{ formatRelativeTime(item.sortTime) }}</text>
              </view>
            </view>
          </view>
        </view>
        <up-loadmore :status="feedLoadStatus" line @loadmore="loadMoreFeed" />
      </view>
    </view>

    <!-- 下滑一定距离后显示：回顶部（旋风图标） -->
    <view v-show="showBackToTop"
      class="community-back-top fixed right-6 z-[60] flex size-[100rpx] items-center justify-center rounded-full bg-theme-1 text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform"
      :style="{ bottom: backTopBottom }" hover-class="opacity-90" role="button" aria-label="回到顶部" @click="scrollToTop">
      <text class="iconfont icon-TOP text-[50rpx] animate-pulse" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { onPageScroll, onReachBottom, onShow } from "@dcloudio/uni-app";
import { fetchMixedFeed, postPostLike } from "@/assets/js/api/post";
import { getDictJumpType } from "@/assets/js/api/dict";
import { config } from "@/assets/js/config";
import { postActivityJoin } from "@/assets/js/api/activity";
import type { MixedFeedItem } from "@/types/api/post";
import type { resItem } from "@/types/api/dict";
import { formatDate, formatRelativeTime } from "@/utils";
import { unwrapApiList, unwrapApiPagedResult } from "@/utils/apiResponse";
import HomeBar from "@/components/homeBar.vue";


type FeedLoadStatus = "loadmore" | "loading" | "nomore";

const content = ref<string>("");
const rankList = ref([
  {
    name: "艾登",
    score: 98,
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDfHJ-RCqeVenIKcaa_DXfaiFK1x6tE5jBXA1KGXw9kbn-X1d_j3uuKcGQZtXjFFC9XDPljtXPH_SFbPHkcDxh16ViWWBz51zdjNbtw-twWkwXjbJ_1-CGkzDqU7CV-rAqAOLT31LHrY6VHAoIZXhM4lf2zWHOZP2vy0wmeUSgBHBukvF_EOa3Di13qWNfZvEmj1Uf7fgza5nBlHwrf1QQRg6d7YcnEIFxTOQXwlgEKzyfbz0kFH5vbjdHdS_2lHzGvKH5BLG9znRrb",
  },
  {
    name: "莎拉",
    score: 95,
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi",
  },
  {
    name: "马库斯",
    score: 92,
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi",
  },
  {
    name: "埃琳娜",
    score: 90,
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi",
  },
  {
    name: "朱利安",
    score: 88,
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi",
  },
  {
    name: "朱利安",
    score: 88,
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi",
  },
  {
    name: "朱利安",
    score: 88,
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi",
  },
  {
    name: "朱利安",
    score: 88,
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi",
  },
  {
    name: "朱利安",
    score: 88,
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi",
  },
]);

/** 超过该滚动距离（px）后显示回顶按钮 */
const BACK_TOP_AFTER = 320;

const pageScrollTop = ref(0);
const showBackToTop = computed(() => pageScrollTop.value >= BACK_TOP_AFTER);
/** 避开 tabBar + 安全区，与页面底部留白一致思路 */
const backTopBottom = "calc(120rpx + env(safe-area-inset-bottom) + 32rpx)";

const FEED_PAGE_SIZE = 20;
/** `post_user_state`：value → 展示名（字典更新后副标题会跟着变） */
const userStateLabelByValue = ref<Map<number, string>>(new Map());
const feedList = ref<MixedFeedItem[]>([]);
const feedPage = ref(1);
const feedLoadStatus = ref<FeedLoadStatus>("loadmore");
const feedLoading = ref(false);
const feedFinished = ref(false);

function resolveMediaUrl(raw: string | null | undefined): string {
  const u = (raw || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return `https:${u}`;
  const base = config.baseURL.replace(/\/+$/, "");
  const path = u.startsWith("/") ? u : `/${u}`;
  return `${base}${path}`;
}

function feedAvatar(item: MixedFeedItem, index: number): string {
  if (item.itemType === "post" && item.avatarUrl) return resolveMediaUrl(item.avatarUrl);
  if (item.itemType === "activity" && item.activityTemplateIcon) return resolveMediaUrl(item.activityTemplateIcon);
  return `https://picsum.photos/seed/feed${item.id}${index}/100/100`;
}

function feedNickname(item: MixedFeedItem): string {
  if (item.itemType === "post") return item.nickName?.trim() || "云友";
  return item.activityTitle?.trim() || item.activityTemplateName?.trim() || "社群活动";
}

function feedActivitySubline(item: MixedFeedItem): string {
  const parts: string[] = [];
  const tpl = '共修邀约';
  const title = item.activityTitle?.trim();
  if (tpl && tpl !== title) parts.push(tpl);
  const range = formatActivityRange(item);
  if (range) parts.push(range);
  return parts.length ? parts.join(" · ") : "共修邀约";
}

function formatActivityRange(item: MixedFeedItem): string {
  const s = item.activityStartDate?.trim();
  const e = item.activityEndDate?.trim();
  if (s && e) return `${formatDate(s,'MM-DD HH:mm')} ~ ${formatDate(e,'MM-DD HH:mm')}`;
  return s || e || "";
}

function feedPostSubline(item: MixedFeedItem): string {
  let base = "动态";
  if (item.postType === 1) base = "分享报告";
  else if (item.postType === 2) base = "照见分享";
  const s = item.userState;
  if (s == null) return base;
  const stateLabel = userStateLabelByValue.value.get(s);
  return stateLabel ? `${base} · ${stateLabel}` : base;
}
/** 活动详情路由；`joined=1` 供详情页判断已加入（列表未带打卡行时仍可打卡） */
function activityDetailUrl(item: MixedFeedItem): string {
  const q = [`id=${item.id}`];
  if (item.isJoined) q.push("joined=1");
  return `/pages/post/activity?${q.join("&")}`;
}

/** 未加入则先调加入接口，成功后跳转活动详情 */
async function handleJoinActivity(item: MixedFeedItem) {
  if (item.itemType !== "activity") return;
  if (!item.isJoined) {
    try {
      await postActivityJoin({ id: item.id });
      item.isJoined = true;
      uni.showToast({ title: "加入成功", icon: "success" });
    } catch (e) {
      console.error("postActivityJoin", e);
      uni.showToast({ title: "加入失败", icon: "none" });
      return;
    }
  }
  uni.navigateTo({ url: activityDetailUrl(item) });
}
function feedActivityQuote(item: MixedFeedItem): string {
  return (item.content || "活动邀约").trim();
}

/** 用户正文中的 HTML 转义，避免 rich-text 字符串注入标签 */
function escapeHtmlForFeed(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** rich-text 支持的强调样式（勿用自定义 class，小程序内不生效） */
const FEED_HIGHLIGHT_STYLE = "color:#d4af35;font-weight:600";

function wrapFeedRichHtml(body: string): string {
  return `<div style="font-style:italic;line-height:1.625;">${body}</div>`;
}

/**
 * 动态正文 HTML 供 `rich-text`：字典 label 高亮用内联 `span`（与小程序 rich-text 白名单一致）。
 * label 按长度降序匹配，避免短词抢先截断长词。
 */
function feedContent(item: MixedFeedItem): string {
  const raw = item.content?.trim();
  if (!raw) {
    return wrapFeedRichHtml(
      `“分享一则<span style="${FEED_HIGHLIGHT_STYLE}">照见</span>”`,
    );
  }

  let html = escapeHtmlForFeed(raw);
  const labels = [...new Set(userStateLabelByValue.value.values())]
    .filter((l) => l && l.trim().length > 0)
    .sort((a, b) => b.length - a.length);

  for (const label of labels) {
    const escapedLabel = escapeHtmlForFeed(label.trim());
    const safeForRegex = escapedLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`${safeForRegex}`, "g");
    html = html.replace(
      re,
      (m) => `<span style="${FEED_HIGHLIGHT_STYLE}">${m}</span>`,
    );
  }

  return wrapFeedRichHtml(html);
}

function feedMoodIcon(item: MixedFeedItem): string {
  if (item.itemType === "activity") return "huodong";
  switch (item.userState) {
    case 1:
      return "Cloudy";
    case 2:
      return "ink-water-drop";
    case 3:
      return "wind";
    case 4:
      return "lightbulb";
    default:
      return "Cloudy";
  }
}

function feedImages(item: MixedFeedItem): string[] {
  if (item.itemType !== "post" || !item.images?.length) return [];
  return item.images.map((u) => resolveMediaUrl(u)).filter(Boolean);
}
/**
 * 拉取动态相关字典项（当前为 post_user_state），解析为 { value, label }。
 * 接口包一层 data 时用 unwrapApiList，避免直接当数组用。
 */
async function getDictJumpTypeData(): Promise<{ value: number; label: string }[]> {
  const res = await getDictJumpType({ types: ["post_user_state"] });
  const list = unwrapApiList(res['data']['post_user_state']) as resItem[];
  return list.map((row) => ({
    value: row.value,
    label: row.name,
  }));
}

/** 在页面展示前刷新用户状态字典；适合放在 onShow，与列表请求并行。 */
async function refreshPostUserStateDict() {
  try {
    const rows = await getDictJumpTypeData();
    const next = new Map<number, string>();
    for (const r of rows) {
      next.set(r.value, r.label);
    }
    console.log(next)
    userStateLabelByValue.value = next;
  } catch (e) {
    console.error("refreshPostUserStateDict", e);
  }
}

async function loadFeedPage(reset: boolean) {
  if (feedLoading.value) return;
  if (!reset && feedFinished.value) return;

  feedLoading.value = true;
  if (reset) {
    feedPage.value = 1;
    feedFinished.value = false;
    feedList.value = [];
  }
  feedLoadStatus.value = "loading";
  try {
    const res = await fetchMixedFeed({ page: feedPage.value, size: FEED_PAGE_SIZE });
    const { list } = unwrapApiPagedResult<MixedFeedItem>(res);
    feedList.value = feedList.value.concat(list);
    if (list.length < FEED_PAGE_SIZE) {
      feedFinished.value = true;
      feedLoadStatus.value = "nomore";
    } else {
      feedPage.value += 1;
      feedLoadStatus.value = "loadmore";
    }
  } catch (e) {
    console.error("fetchMixedFeed", e);
    feedLoadStatus.value = feedList.value.length ? "nomore" : "loadmore";
    uni.showToast({ title: "加载失败", icon: "none" });
  } finally {
    feedLoading.value = false;
  }
}

function loadMoreFeed() {
  if (feedLoadStatus.value === "loadmore" && !feedFinished.value && !feedLoading.value) {
    loadFeedPage(false);
  }
}

async function onToggleLike(item: MixedFeedItem) {
  if (item.itemType !== "post") return;
  const prev = item.likeCount ?? 0;
  item.likeCount = prev + 1;
  item.isLiked = true;
  try {
    await postPostLike({ id: item.id });
  } catch (e) {
    console.error("postPostLike", e);
    item.likeCount = prev;
    item.isLiked = false;
    uni.showToast({ title: "点赞失败", icon: "none" });
  }
}

const goPublishPost = () => {
  uni.navigateTo({ url: "/pages/post/edit-post" });
};

const onFeedNavigate = (item: MixedFeedItem) => {
  if (item.itemType === "activity") {
    uni.navigateTo({
      url: activityDetailUrl(item),
    });
  } else {
    uni.navigateTo({
      url: `/pages/post/detail?id=${item.id}&type=cindex`,
    });
  }
};

const gotoShop = () => {
  uni.navigateTo({
    url: "/pages/shop/index",
  });
};

const goRank = () => {
  uni.navigateTo({
    url: "/pages/profile/rank",
  });
};

function scrollToTop() {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 280,
  });
}

onPageScroll((e) => {
  pageScrollTop.value = e.scrollTop ?? 0;
});

onShow(() => {
  refreshPostUserStateDict();
  loadFeedPage(true);
});

onReachBottom(() => {
  if (!feedFinished.value && !feedLoading.value && feedList.value.length > 0) {
    loadFeedPage(false);
  }
});
</script>

<style scoped lang="scss">
.community-back-top {
  /* 避免与 tabBar 点击区域重叠过近 */
  touch-action: manipulation;
}

</style>
