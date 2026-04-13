<template>
  <view class="flex flex-col min-h-screen h-screen theme-bg cloud-pattern">
    <lcrBar :title="'排行榜'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
    <!-- Podium view (Top 3) -->
    <view class="shrink-0 mt-10 px-6">
      <view class="flex items-end justify-center gap-2 mb-8">
        <view
          v-for="item in podiumTop"
          :key="item.rank"
          :class="podiumColClass(item.rank)"
        >
          <view :class="item.rank === 1 ? 'relative mb-4' : 'relative mb-3'">
            <view
              v-if="item.rank === 1"
              class="absolute -top-6 left-1/2 -translate-x-1/2 text-tertiary scale-125"
            >
              <text
                class="iconfont icon-ic_workspace_premium text-[64rpx] theme-color-1"
                style="font-variation-settings: 'FILL' 1; font-size: 32px"
              />
            </view>
            <view :class="podiumAvatarWrapClass(item.rank, item.isVacant)">
              <image
                class="w-full h-full rounded-full object-cover"
                :class="item.isVacant ? 'opacity-60 scale-95' : ''"
                :src="item.avatar"
                :alt="item.avatarAlt"
                mode="aspectFill"
              />
            </view>
            <view :class="podiumBadgeWrapClass(item.rank)">
              <text :class="podiumBadgeTextClass(item.rank)">{{ item.rank }}</text>
            </view>
          </view>
          <view :class="podiumNameClass(item.rank, item.isVacant)">{{ item.name }}</view>
          <view :class="podiumScoreWrapClass(item.rank)">
            <text v-if="item.isVacant" :class="podiumScoreTextClass(item.rank)">—</text>
            <text v-else :class="podiumScoreTextClass(item.rank)">{{ item.score }} {{ podiumScoreSuffix }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- Leaderboard List：up-list 滚动加载 -->
    <view class="flex-1 min-h-0 flex flex-col px-[48rpx] pb-[32rpx]">
      <view class="font-label text-[20rpx] uppercase tracking-[0.2rem] theme-color-5 mb-[32rpx] pl-2 shrink-0">
        {{ listSectionTitle }}
      </view>
      <view class="rank-list-host no-scrollbar">
        <up-list
          class="rank-up-list no-scrollbar"
          height="100%"
          :lower-threshold="120"
          :show-scrollbar="false"
          @scrolltolower="onRankScrollToLower"
        >
          <up-list-item v-for="(row,index) in rank.list" :key="row.rank" :anchor="String(row.rank)">
            <view :class="[listCardClass, 'mb-3',index % 2 === 0 ? 'bg-theme-10' : 'bg-theme-11']" class="rounded-[40rpx]">
              <view class="flex items-center gap-4 ">
                <text class="font-headline theme-color-6 text-[28rpx] italic w-4">{{
                  String(row.rank).padStart(2, '0')
                }}</text>
                <image
                  class="w-10 h-10 rounded-full object-cover grayscale opacity-80"
                  :src="row.avatar"
                  :alt="row.avatarAlt"
                  mode="aspectFill"
                />
                <view>
                  <view class="text-[28rpx] font-medium theme-color-5">{{ row.name }}</view>
                  <view class="text-[20rpx] theme-color-6 font-label tracking-tighter">
                    {{ row.subtitle }}
                  </view>
                </view>
              </view>
              <view class="text-right">
                <text class="font-label text-[20rpx] font-bold theme-color-1">{{ row.score }}</text>
                <text class="block text-[16rpx] theme-color-6 uppercase tracking-tighter">{{
                  scoreUnitLabel
                }}</text>
              </view>
            </view>
          </up-list-item>
          <up-loadmore :status="rank.loadStatus" line @loadmore="loadMoreRank" />
        </up-list>
      </view>
      <view v-if="!rank.fetching && rank.list.length === 0" class="text-center py-6 text-xs text-on-surface-variant/50">
        暂无排行数据
      </view>
    </view>
    <!-- Personal Rank Floating Bar -->
    <view v-if="rank.myRank" class="fixed bottom-[96px] left-1/2 -translate-x-1/2 w-[343px] z-40">
      <view :class="myRankBarWrapClass">
        <view class="flex items-center gap-4">
          <text class="font-headline text-white/60 italic text-sm">{{ rank.myRank.rank }}</text>
          <view class="w-10 h-10 rounded-full border border-white/20 overflow-hidden">
            <image
              class="w-full h-full object-cover"
              :src="rank.myRank.avatar"
              :alt="rank.myRank.avatarAlt"
              mode="aspectFill"
            />
          </view>
          <view>
            <view class="text-sm font-medium">{{ rank.myRank.name }}</view>
            <view class="text-[9px] text-white/60 font-label tracking-widest uppercase">{{ rank.myRank.subtitle }}</view>
          </view>
        </view>
        <view class="text-right">
          <text class="font-label text-xs font-bold text-tertiary">{{ rank.myRank.score }}</text>
          <text class="block text-[8px] text-white/40 uppercase tracking-tighter">{{ scoreUnitLabel }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import { fetchLeaderboardScore } from "@/assets/js/api/leaderboard";
import { config } from "@/assets/js/config";
import type { LeaderboardScoreItem, LeaderboardScorePage } from "@/types/api/leaderboard";
import { unwrapApiData } from "@/utils/apiResponse";
import { navigateBack } from "@/utils/navigation";
import { useUserStore } from "@/stores/user";
import lcrBar from "@/components/lcrBar.vue";

type RankRow = {
  rank: number;
  name: string;
  subtitle: string;
  avatar: string;
  avatarAlt: string;
  score: number | string;
  isSelf?: boolean;
  /** 领奖台空缺占位（无榜单数据时 1–3 名） */
  isVacant?: boolean;
};

const RANK_PAGE_SIZE = 20;

const userStore = useUserStore();

/** 与接口一致；不展示切换 UI 时固定为周榜、全站 */
const LEADERBOARD_RANGE = "total" as const;

/** 领奖台空缺时的默认头像（与资料页默认一致） */
const PODIUM_PLACEHOLDER_AVATAR = "/static/logo.png";

function resolveMediaUrl(raw: string | null | undefined): string {
  const u = (raw || "").trim();
  if (!u) return "/static/logo.png";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return `https:${u}`;
  const base = config.baseURL.replace(/\/+$/, "");
  const path = u.startsWith("/") ? u : `/${u}`;
  return `${base}${path}`;
}

function formatScore(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function selfUserId(): number {
  return userStore.currentUser?.id ?? 0;
}

function mapLeaderItem(item: LeaderboardScoreItem, rank: number, selfId: number): RankRow {
  const loc = [item.lastProvince, item.lastCity].filter((x) => (x || "").trim()).join(" · ");
  const sub =
    loc ||
    `点赞 ${item.likes} · 动态 ${item.postCount} · 打卡 ${item.checkins} · 报告 ${item.reportCount} · ${item.minutes} 分钟`;
  return {
    rank,
    name: item.nickName?.trim() || "云友",
    subtitle: sub,
    score: formatScore(item.score),
    avatar: resolveMediaUrl(item.avatarUrl),
    avatarAlt: "",
    isSelf: selfId > 0 && item.userId === selfId,
  };
}

const rank = reactive({
  topThree: [] as RankRow[],
  list: [] as RankRow[],
  myRank: null as RankRow | null,
  page: 1,
  finished: false,
  loadStatus: "loadmore" as "loadmore" | "loading" | "nomore",
  fetching: false,
  total: 0,
});

const listSectionTitle = "修行总排行";

function vacantPodiumSlot(rankNum: 1 | 2 | 3): RankRow {
  return {
    rank: rankNum,
    name: "虚位以待",
    subtitle: "",
    score: "—",
    avatar: PODIUM_PLACEHOLDER_AVATAR,
    avatarAlt: "",
    isVacant: true,
  };
}

/** 始终三条：2 → 1 → 3；无数据用「虚位以待」+ 默认头像 */
const podiumTop = computed((): RankRow[] => {
  const top = [...rank.topThree].filter((r) => r.rank >= 1 && r.rank <= 3);
  const by = (n: 1 | 2 | 3) => top.find((r) => r.rank === n);
  const second = by(2) ?? vacantPodiumSlot(2);
  const first = by(1) ?? vacantPodiumSlot(1);
  const third = by(3) ?? vacantPodiumSlot(3);
  return [second, first, third];
});

const scoreUnitLabel = "Stability";
const podiumScoreSuffix = "安定";

const listCardClass =
  "zen-glass rounded-2xl p-4 flex items-center justify-between border border-white/20 transition-all";

const myRankBarWrapClass =
  "bg-primary text-white rounded-3xl p-4 flex items-center justify-between shadow-xl shadow-primary/20";

function mergeMyRankFromItems(items: LeaderboardScoreItem[], page: number) {
  const selfId = selfUserId();
  if (!selfId) return;
  const base = (page - 1) * RANK_PAGE_SIZE;
  for (let i = 0; i < items.length; i++) {
    if (items[i].userId === selfId) {
      rank.myRank = mapLeaderItem(items[i], base + i + 1, selfId);
      return;
    }
  }
}

async function fetchRankPage(reset: boolean) {
  if (rank.fetching) return;
  if (rank.finished && !reset) return;

  rank.fetching = true;
  if (reset) {
    rank.topThree = [];
    rank.list = [];
    rank.myRank = null;
    rank.page = 1;
    rank.finished = false;
    rank.total = 0;
  }
  rank.loadStatus = "loading";

  try {
    const page = rank.page;
    const res = await fetchLeaderboardScore({
      range: LEADERBOARD_RANGE,
      page,
      size: RANK_PAGE_SIZE,
    });
    const data = unwrapApiData<LeaderboardScorePage>(res);
    const rawList = data?.list ?? [];
    const pagination = data?.pagination;
    rank.total = pagination?.total ?? rawList.length;
    mergeMyRankFromItems(rawList, page);

    const sid = selfUserId();
    if (page === 1) {
      rank.topThree = rawList.slice(0, 3).map((it, i) => mapLeaderItem(it, i + 1, sid));
      const rest = rawList.slice(3).map((it, i) => mapLeaderItem(it, i + 4, sid));
      rank.list = rank.list.concat(rest);
    } else {
      const startRank = (page - 1) * RANK_PAGE_SIZE + 1;
      const rows = rawList.map((it, i) => mapLeaderItem(it, startRank + i, sid));
      rank.list = rank.list.concat(rows);
    }

    const loadedSlots = rank.topThree.length + rank.list.length;
    const total = pagination?.total ?? rank.total;
    const noMore =
      rawList.length === 0 ||
      rawList.length < RANK_PAGE_SIZE ||
      loadedSlots >= total ||
      (pagination != null && page * RANK_PAGE_SIZE >= total);
    if (noMore) {
      rank.finished = true;
      rank.loadStatus = "nomore";
    } else {
      rank.page = page + 1;
      rank.loadStatus = "loadmore";
    }
  } catch (e) {
    console.error("fetchLeaderboardScore", e);
    rank.loadStatus = rank.list.length || rank.topThree.length ? "nomore" : "loadmore";
    uni.showToast({ title: "排行榜加载失败", icon: "none" });
  } finally {
    rank.fetching = false;
  }
}

function onRankScrollToLower() {
  if (!rank.finished && !rank.fetching) {
    fetchRankPage(false);
  }
}

function loadMoreRank() {
  if (rank.loadStatus === "loadmore" && !rank.finished && !rank.fetching) {
    fetchRankPage(false);
  }
}

onMounted(() => {
  fetchRankPage(true);
});

function podiumColClass(r: number) {
  if (r === 1) return "flex flex-col items-center w-2/5 -translate-y-4";
  return "flex flex-col items-center w-1/3";
}

function podiumAvatarWrapClass(r: number, vacant?: boolean) {
  const dash = vacant ? " border-dashed border-primary/35" : "";
  if (r === 1) return `w-24 h-24 rounded-full border-4 border-theme-1 p-1 overflow-hidden shadow-xl${dash}`;
  if (r === 2) return `w-16 h-16 rounded-full border-2 border-[#DABB53] p-0.5 overflow-hidden${dash}`;
  return `w-16 h-16 rounded-full border-2 border-[#F0E8CF] p-0.5 overflow-hidden${dash}`;
}

function podiumBadgeWrapClass(r: number) {
  if (r === 1)
    return "absolute -bottom-2 left-1/2 -translate-x-1/2 bg-theme-1 text-white rounded-full w-8 h-8 flex items-center justify-center border-4 border-background shadow-md";
  if (r === 2)
    return "absolute -bottom-1 -right-1 bg-[#DABB53] rounded-full w-6 h-6 flex items-center justify-center shadow-sm";
  return "absolute -bottom-1 -right-1 bg-[#F0E8CF] rounded-full w-6 h-6 flex items-center justify-center shadow-sm";
}

function podiumBadgeTextClass(r: number) {
  if (r === 1) return "text-xs font-bold";
  return "text-[20rpx] font-bold text-white";
}

function podiumNameClass(r: number, vacant?: boolean) {
  const muted = vacant ? " opacity-75" : "";
  if (r === 1)
    return `font-headline text-[32rpx] font-bold theme-color-5 mb-1 theme-glow-active${muted}`;
  return `font-headline text-[28rpx] theme-color-5 mb-1${muted}`;
}

function podiumScoreWrapClass(r: number) {
  if (r === 1) return "bg-theme-1 px-3 py-1 rounded-full shadow-sm";
  if (r === 2) return "bg-[#DABB53] px-2 py-0.5 rounded-full";
  return "bg-[#F0E8CF] px-2 py-0.5 rounded-full";
}

function podiumScoreTextClass(r: number) {
  if (r === 1) return "font-label text-[22rpx] tracking-[0.15rem] text-white font-bold";
  if (r === 2) return "font-label text-[20rpx] tracking-widest text-white uppercase";
  return "font-label text-[22rpx] tracking-widest text-white uppercase";
}

const onBack = () => {
  navigateBack();
};
</script>
<style scoped lang="scss">
.rank-list-host {
  flex: 1;
  min-height: 0;
  height: 0;
}
</style>
