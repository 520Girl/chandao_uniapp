<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
    <lcrBar :title="'全部活动'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
    <view class="px-6 pb-32 flex-1">
      <view class="mb-8 mt-8">
        <view class="text-2xl font-serif font-light tracking-tight text-on-surface mb-1 leading-tight italic">
          花满养护人
        </view>
        <text class="text-[12px] font-body text-on-surface-variant/60 tracking-wider">
          <text v-if="contextTeamDisplayName" class="text-[26rpx] font-semibold theme-color-5 truncate">{{
            contextTeamDisplayName
          }}</text>
          <text v-else class="text-[26rpx] font-semibold theme-color-5 truncate">可访问活动</text>
          共修活动一览
        </text>
      </view>

      <view v-if="listLoading && list.length === 0" class="py-16 text-center text-sm theme-color-8">加载中…</view>
      <view v-else-if="!listLoading && list.length === 0" class="py-16 text-center text-sm theme-color-8">暂无活动</view>
      <view v-else class="space-y-6">
        <view
          v-for="(item, index) in list"
          :key="`act-${item.id}`"
          :class="index % 2 === 0 ? 'bg-[#ffffff80] shadow-md' : 'bg-[#d4af350d] shadow-sm'"
          class="relative border border-[#d4af35]/5 p-6 rounded-[2rem]"
          @click="goActivity(item.id)"
        >
          <view class="flex items-center gap-3 mb-4">
            <up-image
              v-if="rowIcon(item) !== ''"
              :src="rowIcon(item)"
              :lazy-load="true"
              width="90rpx"
              height="90rpx"
              shape="circle"
              class="w-[90rpx] h-[90rpx] border-2 border-theme-3 overflow-hidden shrink-0"
              mode="aspectFill"
            />
            <view
              v-else
              class="w-[90rpx] h-[90rpx] rounded-full border-2 border-theme-3 flex items-center justify-center bg-primary/10 shrink-0"
            >
              <text class="iconfont icon-huodong text-[44rpx] theme-color-1" />
            </view>
            <view class="min-w-0 flex-1">
              <view class="text-sm font-bold line-clamp-1">{{ item.title || "共修活动" }}</view>
              <view class="flex items-center gap-1 flex-wrap min-w-0">
                <text class="iconfont icon-MapPin text-[20rpx] theme-color-8 shrink-0" />
                <text class="text-[20rpx] theme-color-8 font-medium line-clamp-1">{{ rowSubline(item) }}</text>
                <text
                  class="text-[80rpx] theme-color-2 iconfont italic icon-huodong text-[#b4d2e761] absolute -right-0 -top-0 pointer-events-none"
                />
              </view>
            </view>
            <text v-if="item.isTop == 1" class="iconfont icon-tuding text-[38rpx] theme-color-1 shrink-0" />
          </view>
          <text
            class="theme-color-7 leading-relaxed italic text-[30rpx] px-2 block first-letter:text-3xl first-letter:mr-2 first-letter:float-left first-letter:font-headline first-letter:text-primary/80"
          >
            “{{ rowQuote(item) }}”
          </text>
        </view>
        <up-loadmore :status="loadMoreStatus" line @loadmore="loadMore" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app";
import { fetchActivityPageGet } from "@/assets/js/api/activity";
import { config } from "@/assets/js/config";
import type { ActivityPage, ActivityPageListItem, ActivityPageQuery } from "@/types/api/activity";
import { useTeamStore } from "@/stores/team";
import { useUserStore } from "@/stores/user";
import { unwrapApiData } from "@/utils/apiResponse";
import { formatDate, formatRelativeTime } from "@/utils/common";
import { navigateBack } from "@/utils/navigation";
import lcrBar from "@/components/lcrBar.vue";

const PAGE_SIZE = 20;
const teamStore = useTeamStore();
const userStore = useUserStore();

const routeTeamId = ref<number | null>(null);
const list = ref<ActivityPageListItem[]>([]);
const page = ref(1);
const listLoading = ref(false);
const loadMoreStatus = ref<"loadmore" | "loading" | "nomore">("loadmore");

const contextTeamDisplayName = computed(() => {
  const tid = routeTeamId.value;
  if (tid == null) return "";
  const hit = teamStore.myCurrentTeams.find((t) => t.teamId === tid);
  return hit?.teamName?.trim() || `团队 ${tid}`;
});

function resolveMediaUrl(raw: string | null | undefined): string {
  const u = (raw || "").trim();
  if (!u) return "/static/logo.png";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return `https:${u}`;
  const base = config.baseURL.replace(/\/+$/, "");
  const path = u.startsWith("/") ? u : `/${u}`;
  return `${base}${path}`;
}

function rowIcon(item: ActivityPageListItem): string {
  const u = (item.templateIcon || "").trim();
  if (!u) return "";
  return resolveMediaUrl(u);
}

function formatRange(item: ActivityPageListItem): string {
  const s = item.startDate?.trim();
  const e = item.endDate?.trim();
  if (s && e) {
    return `${formatDate(s, "MM-DD HH:mm")} ~ ${formatDate(e, "MM-DD HH:mm")}`;
  }
  return s || e || "";
}

function rowSubline(item: ActivityPageListItem): string {
  const parts: string[] = [];
  const t = (item.templateName || "").trim();
  if (t) parts.push(t);
  const r = formatRange(item);
  if (r) parts.push(r);
  return parts.length ? parts.join(" · ") : "共修邀约";
}

function rowQuote(item: ActivityPageListItem): string {
  return (item.content || item.title || "活动邀约").trim();
}

function goActivity(id: number) {
  uni.navigateTo({ url: `/pages/post/activity?id=${id}` });
}

function buildQuery(p: number): ActivityPageQuery {
  const q: ActivityPageQuery = { page: p, size: PAGE_SIZE };
  if (routeTeamId.value != null) q.teamId = routeTeamId.value;
  return q;
}

async function loadList(reset: boolean) {
  if (listLoading.value) return;
  if (!reset && loadMoreStatus.value === "nomore") return;
  listLoading.value = true;
  if (reset) {
    page.value = 1;
    list.value = [];
    loadMoreStatus.value = "loadmore";
  }
  loadMoreStatus.value = "loading";
  try {
    const res = await fetchActivityPageGet(buildQuery(page.value));
    const data = unwrapApiData<ActivityPage>(res);
    const chunk = data?.list ?? [];
    const total = data?.pagination?.total;
    if (reset) {
      list.value = chunk;
    } else {
      list.value = list.value.concat(chunk);
    }
    const loaded = list.value.length;
    if (chunk.length < PAGE_SIZE || (total != null && loaded >= total)) {
      loadMoreStatus.value = "nomore";
    } else {
      loadMoreStatus.value = "loadmore";
      page.value += 1;
    }
  } catch (e) {
    console.error("allActivity loadList", e);
    uni.showToast({ title: "加载失败", icon: "none" });
    loadMoreStatus.value = "loadmore";
    if (reset) list.value = [];
  } finally {
    listLoading.value = false;
  }
}

function loadMore() {
  if (loadMoreStatus.value === "loadmore" && !listLoading.value) {
    void loadList(false);
  }
}

onLoad((options) => {
  const raw = options?.teamId;
  if (raw != null && String(raw).trim() !== "") {
    const n = Number(raw);
    routeTeamId.value = Number.isFinite(n) && n > 0 ? n : null;
  } else {
    routeTeamId.value = null;
  }
});

onShow(async () => {
  await teamStore.fetchMyCurrentTeams();
  if (routeTeamId.value != null) {
    teamStore.setPublishTeamId(routeTeamId.value);
  } else {
    teamStore.syncPublishTeamFromUserFirstTeam(userStore.currentUser?.firstTeamId);
  }
  await loadList(true);
});

onReachBottom(() => {
  loadMore();
});

const onBack = () => navigateBack();
</script>

<style scoped lang="scss"></style>
