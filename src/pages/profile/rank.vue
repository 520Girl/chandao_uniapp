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
            <view :class="podiumAvatarWrapClass(item.rank)">
              <image
                class="w-full h-full rounded-full object-cover"
                :src="item.avatar"
                :alt="item.avatarAlt"
                mode="aspectFill"
              />
            </view>
            <view :class="podiumBadgeWrapClass(item.rank)">
              <text :class="podiumBadgeTextClass(item.rank)">{{ item.rank }}</text>
            </view>
          </view>
          <view :class="podiumNameClass(item.rank)">{{ item.name }}</view>
          <view :class="podiumScoreWrapClass(item.rank)">
            <text :class="podiumScoreTextClass(item.rank)">{{ item.score }} {{ podiumScoreSuffix }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- Leaderboard List：up-list 滚动加载 -->
    <view class="flex-1 min-h-0 flex flex-col px-[48rpx] pb-[32rpx]">
      <view class="font-label text-[20rpx] uppercase tracking-[0.2rem] theme-color-5 mb-[32rpx] pl-2 shrink-0">
        {{ listSectionTitle }}
      </view>
      <view class="rank-list-host">
        <up-list
          class="rank-up-list"
          height="100%"
          :lower-threshold="120"
          :show-scrollbar="true"
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
            <image class="w-full h-full object-cover" :src="rank.myRank.avatar" :alt="rank.myRank.avatarAlt" mode="aspectFill" />
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
import { computed, onMounted, reactive } from 'vue';
import { getRankList } from '@/assets/js/api/user';
import { navigateBack } from '@/utils/navigation';
import lcrBar from '@/components/lcrBar.vue';

type RankRow = {
  rank: number;
  name: string;
  subtitle: string;
  avatar: string;
  avatarAlt: string;
  score: number;
  isSelf?: boolean;
};

type RankPagePayload = {
  topThree: RankRow[];
  list: RankRow[];
  myRank: RankRow | null;
  hasMore: boolean;
};

const RANK_PAGE_SIZE = 10;
/** 开发时 true：走本页模拟分页；false：走 getRankList，结构在 parseRankApiPayload 对齐后端 */
const USE_RANK_MOCK = true;

const MOCK_AVATAR = '/static/770-800x600.jpg';

const MOCK_TOP_THREE: RankRow[] = [
  {
    rank: 1,
    name: '陈云溪',
    subtitle: '',
    score: 1204,
    avatar: MOCK_AVATAR,
    avatarAlt: ''
  },
  {
    rank: 2,
    name: '林素心',
    subtitle: '',
    score: 982,
    avatar: MOCK_AVATAR,
    avatarAlt: ''
  },
  {
    rank: 3,
    name: '周墨语',
    subtitle: '',
    score: 945,
    avatar: MOCK_AVATAR,
    avatarAlt: ''
  }
];

const MOCK_FROM_FOUR: RankRow[] = [
  {
    rank: 4,
    name: '沈漫天',
    subtitle: '修行 12 天 · 已安定',
    score: 892,
    avatar:
      'https://lview.googleusercontent.com/aida-public/AB6AXuCyrXyBndweRU1MXL7pbHX0gTiRrxG3G8tOVw--SDIJwl3HPL-P3lMVQS8xQkGe9jKboiDUSH6uXHFPJNHYqVFeUMm7H1ZzGftq8TtqDjOkVosh4Ux865GBWAXRxiaITAUgnTGJ4jPD0FGinuCgXSkgmZsWuWf04vWQAqmfu6rlfIWfhSsAQmNZgr26RNP8GNqAyB9f7CQjLr0Qo3UyPNWuUP2D-xRi2xCdGMuLX5zCL7Ci0YDhXwKHkzaJWCJHZZUYN3cJywufOx9R',
    avatarAlt: ''
  },
  {
    rank: 5,
    name: '何广智',
    subtitle: '修行 8 天 · 云端中',
    score: 876,
    avatar:
      'https://lview.googleusercontent.com/aida-public/AB6AXuC8EGKx-x9tBZpls42DSODy_niXYSD46Z0OWcWtF3DiccJnRhgixG1TwMSKzkI5IeoDEwQXPfaQcyeMjpltno7kWLR8O_J8mZ5N4sB3FIG7RnlIbmOU4ULpZEo0TG5iUi0-jAHQSQgUkmKn_QNtW3hEPf9EcRccCQFN7Rz2fSsQXDKxIKMEUzmPrTpqPAJ3m13bdTx0ni0weJ4VqNlJ6tzFP9HvZfdcWCB0Fnp8VczZgZYth2Vf4yydwNKHyNtS0p0y1245qrkRqYGq',
    avatarAlt: ''
  },
  {
    rank: 6,
    name: '苏禾子',
    subtitle: '修行 32 天 · 大师境',
    score: 812,
    avatar: MOCK_AVATAR,
    avatarAlt: ''
  },
  {
    rank: 7,
    name: '王清风',
    subtitle: '修行 15 天 · 入定中',
    score: 798,
    avatar:
      'https://lview.googleusercontent.com/aida-public/AB6AXuADmtcPWSuLWmi3FuCj4KNu05Zw01bmUuL-8CjjxbDFu3hbrA1jjF5dqEXH6NlICt5ghjXaEZ84FImkAqUm4LPqBMxRCLfzuBR2AZ0vnERMVKO2XjKHNTJmUdNVYRiK07KTZojUIcTgyxSXdZqe3vhK4zBEcQ-vgr1B4KlDGTFJmHF54spXWgcvNCudDozyJ-muewWT6Q4gIaDdXXhUO8q612frph9mwW97QBObxQiZI9FLI_VFw2FsyWGnFEFSoH91-vtlBJ21x-LH',
    avatarAlt: ''
  }
];

function buildMockRankRest(): RankRow[] {
  const rest: RankRow[] = [...MOCK_FROM_FOUR];
  for (let r = 8; r < 24; r += 1) {
    rest.push({
      rank: r,
      name: `修行者${r}`,
      subtitle: `修行 ${r % 29} 天 · 精进中`,
      score: 820 - r,
      avatar: MOCK_AVATAR,
      avatarAlt: ''
    });
  }
  rest.push({
    rank: 24,
    name: '我',
    subtitle: '已打败 78% 修行者',
    score: 542,
    avatar:
      'https://lview.googleusercontent.com/aida-public/AB6AXuAVimXxTHHxSdNkj-DTFiY1OJxZ7WO_D1e6hbnpqrTpOFMLg4N6TCbYpTCg1rdW53yZs7XBHbnnNIyFR7lRkIqCrRzTvHVcB3X3h74W067LbippoYBuEuLFACR1YiVzWwU5Lrabp38ZtHvRH15QbMRve4aQIB18vjEL0LDDIGFBXshQL6trKxH0EXnbYZXGwYWtJioPbxEG5zGw-71iduWpz0wT8ahcwQ3Yc10moM56rvdmXBPSAcP02DAxc8kgKycPjLOjg1sF_KIL',
    avatarAlt: '',
    isSelf: true
  });
  for (let r = 25; r <= 45; r += 1) {
    rest.push({
      rank: r,
      name: `修行者${r}`,
      subtitle: `修行 ${r % 29} 天 · 精进中`,
      score: 820 - r,
      avatar: MOCK_AVATAR,
      avatarAlt: ''
    });
  }
  return rest;
}

const RANK_MOCK_REST = buildMockRankRest();

function mockRankPage(page: number, pageSize: number): Promise<RankPagePayload> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * pageSize;
      const list = RANK_MOCK_REST.slice(start, start + pageSize);
      const hasMore = start + pageSize < RANK_MOCK_REST.length;
      if (page === 1) {
        const myRank = RANK_MOCK_REST.find((x) => x.isSelf) ?? null;
        resolve({
          topThree: [...MOCK_TOP_THREE].sort((a, b) => a.rank - b.rank),
          list,
          myRank,
          hasMore
        });
      } else {
        resolve({ topThree: [], list, myRank: null, hasMore });
      }
    }, 260);
  });
}

function parseRankApiPayload(raw: unknown): RankPagePayload {
  const d =
    raw && typeof raw === 'object' && 'data' in raw && (raw as { data: unknown }).data != null
      ? (raw as { data: Record<string, unknown> }).data
      : (raw as Record<string, unknown>);
  const topThree = d?.topThree;
  const list = d?.list ?? d?.records ?? d?.rows;
  const myRank = d?.myRank ?? null;
  const hasMore = d?.hasMore ?? d?.hasNext;
  return {
    topThree: Array.isArray(topThree) ? (topThree as RankRow[]) : [],
    list: Array.isArray(list) ? (list as RankRow[]) : [],
    myRank: myRank && typeof myRank === 'object' ? (myRank as RankRow) : null,
    hasMore: Boolean(hasMore)
  };
}

/** 整页唯一数据源：前三名、列表、我的排名、分页与加载态 */
const rank = reactive({
  topThree: [] as RankRow[],
  list: [] as RankRow[],
  myRank: null as RankRow | null,
  page: 1,
  finished: false,
  loadStatus: 'loadmore' as 'loadmore' | 'loading' | 'nomore',
  fetching: false
});

/** 领奖台：真实名次 2 → 1 → 3 */
const podiumTop = computed(() => {
  const top = [...rank.topThree].filter((r) => r.rank >= 1 && r.rank <= 3);
  const by = (n: number) => top.find((r) => r.rank === n);
  const second = by(2);
  const first = by(1);
  const third = by(3);
  return [second, first, third].filter((x): x is RankRow => x != null);
});

const listSectionTitle = '本周修行排行';
const scoreUnitLabel = 'Stability';
const podiumScoreSuffix = '安定';

const listCardClass =
  'zen-glass rounded-2xl p-4 flex items-center justify-between border border-white/20 transition-all';

const myRankBarWrapClass =
  'bg-primary text-white rounded-3xl p-4 flex items-center justify-between shadow-xl shadow-primary/20';

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
  }
  rank.loadStatus = 'loading';

  try {
    const page = rank.page;
    const res = USE_RANK_MOCK
      ? await mockRankPage(page, RANK_PAGE_SIZE)
      : parseRankApiPayload(await getRankList({ page, pageSize: RANK_PAGE_SIZE }));
    if (page === 1) {
      rank.topThree = res.topThree;
      if (res.myRank) rank.myRank = res.myRank;
    }
    rank.list = rank.list.concat(res.list);

    const noMore = !res.hasMore || res.list.length === 0 || res.list.length < RANK_PAGE_SIZE;
    if (noMore) {
      rank.finished = true;
      rank.loadStatus = 'nomore';
    } else {
      rank.page = page + 1;
      rank.loadStatus = 'loadmore';
    }
  } catch (e) {
    console.error('getRankList', e);
    rank.loadStatus = rank.list.length ? 'nomore' : 'loadmore';
    uni.showToast({ title: '排行榜加载失败', icon: 'none' });
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
  if (rank.loadStatus === 'loadmore' && !rank.finished && !rank.fetching) {
    fetchRankPage(false);
  }
}

onMounted(() => {
  fetchRankPage(true);
});

function podiumColClass(rank: number) {
  if (rank === 1) return 'flex flex-col items-center w-2/5 -translate-y-4';
  return 'flex flex-col items-center w-1/3';
}

function podiumAvatarWrapClass(rank: number) {
  if (rank === 1) return 'w-24 h-24 rounded-full border-4 border-theme-1 p-1 overflow-hidden shadow-xl';
  if (rank === 2) return 'w-16 h-16 rounded-full border-2 border-[#DABB53] p-0.5 overflow-hidden';
  return 'w-16 h-16 rounded-full border-2 border-[#F0E8CF] p-0.5 overflow-hidden';
}

function podiumBadgeWrapClass(rank: number) {
  if (rank === 1)
    return 'absolute -bottom-2 left-1/2 -translate-x-1/2 bg-theme-1 text-white rounded-full w-8 h-8 flex items-center justify-center border-4 border-background shadow-md';
  if (rank === 2)
    return 'absolute -bottom-1 -right-1 bg-[#DABB53] rounded-full w-6 h-6 flex items-center justify-center shadow-sm';
  return 'absolute -bottom-1 -right-1 bg-[#F0E8CF] rounded-full w-6 h-6 flex items-center justify-center shadow-sm';
}

function podiumBadgeTextClass(rank: number) {
  if (rank === 1) return 'text-xs font-bold';
  return 'text-[20rpx] font-bold text-white';
}

function podiumNameClass(rank: number) {
  if (rank === 1) return 'font-headline text-[32rpx] font-bold theme-color-5 mb-1 theme-glow-active';
  return 'font-headline text-[28rpx] theme-color-5 mb-1';
}

function podiumScoreWrapClass(rank: number) {
  if (rank === 1) return 'bg-theme-1 px-3 py-1 rounded-full shadow-sm';
  if (rank === 2) return 'bg-[#DABB53] px-2 py-0.5 rounded-full';
  return 'bg-[#F0E8CF] px-2 py-0.5 rounded-full';
}

function podiumScoreTextClass(rank: number) {
  if (rank === 1) return 'font-label text-[22rpx] tracking-[0.15rem] text-white font-bold';
  if (rank === 2) return 'font-label text-[20rpx] tracking-widest text-white uppercase';
  return 'font-label text-[22rpx] tracking-widest text-white uppercase';
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
