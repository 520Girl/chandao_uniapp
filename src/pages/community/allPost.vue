<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
    <lcrBar :title="'全部动态'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
    <view class="px-6 pb-32 flex-1">
      <view class="mb-8 mt-8">
        <view class="text-2xl font-serif font-light tracking-tight text-on-surface mb-1 leading-tight italic">
          庇护所守护者
        </view>
        <text class="text-[12px] font-body text-on-surface-variant/60 tracking-wider">
          <text v-if="contextTeamDisplayName" class="text-[26rpx] font-semibold theme-color-5 truncate">{{ contextTeamDisplayName }}</text>
          <text v-else class="text-[26rpx] font-semibold theme-color-5 truncate">管理社群</text>
          内的每一个宁静时刻</text>
      </view>
      <!-- Filter Tabs -->
      <view class="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar text-[22rpx]">
        <view
          class="px-5 py-2 rounded-full text-[11px] font-bold tracking-widest whitespace-nowrap shrink-0 transition-colors shadow-sm"
          :class="
            activePublishStatus === 0
              ? 'bg-theme-1 text-white shadow-primary/20'
              : 'bg-white border border-primary/10 text-on-surface-variant'
          "
          @click="onTabChange(0)">
          全部动态 ({{ countAll }})
        </view>
        <view
          class="px-5 py-2 rounded-full text-[11px] font-bold tracking-widest whitespace-nowrap shrink-0 transition-colors"
          :class="
            activePublishStatus === 1
              ? 'bg-theme-1 text-white shadow-sm shadow-primary/20'
              : 'bg-white border border-primary/10 text-on-surface-variant'
          "
          @click="onTabChange(1)">
          待审核 ({{ countPending }})
        </view>
        <view
          class="px-5 py-2 rounded-full text-[11px] font-bold tracking-widest whitespace-nowrap shrink-0 transition-colors"
          :class="
            activePublishStatus === 2
              ? 'bg-theme-1 text-white shadow-sm shadow-primary/20'
              : 'bg-white border border-primary/10 text-on-surface-variant'
          "
          @click="onTabChange(2)">
          已发布 ({{ countPublished }})
        </view>
      </view>

      <view v-if="listLoading && posts.length === 0" class="py-16 text-center text-sm theme-color-8">加载中…</view>
      <view v-else-if="!listLoading && posts.length === 0" class="py-16 text-center text-sm theme-color-8">
        暂无动态
      </view>
      <view v-else class="space-y-6">
        <template v-for="post in posts" :key="post.id">
          <!-- 待审核：与 allPost copy 一致（白底、粗边框、批准发布 + 标记） -->
          <view
            v-if="post.status === 1"
            class="bg-white rounded-[2rem] p-5 border border-primary/20 shadow-sm"
            @click="goPostDetail(post.id)">
            <view class="flex items-center justify-between mb-4">
              <view class="flex items-center gap-3">
                <image
                  class="w-8 h-8 rounded-full object-cover ring-2 ring-primary/10"
                  :src="selfAvatar"
                  mode="aspectFill" />
                <text class="text-[10px] font-bold tracking-[0.15em] text-on-surface-variant uppercase">{{
                  selfNickname
                }}</text>
              </view>
              <text
                class="px-2.5 py-1 rounded-full bg-primary/10 text-[9px] font-bold text-primary tracking-widest uppercase">
                待审核
              </text>
            </view>
            <view class="text-[13px] font-body theme-color-6 text-on-surface-variant mb-6 leading-relaxed whitespace-pre-wrap">
              {{ (post.content || "").trim() || "（无正文）" }}
            </view>
            <view v-if="post.images?.length" class="grid grid-cols-2 gap-2.5 mb-6">
              <image
                v-for="(img, imgIdx) in post.images.slice(0, 4)"
                :key="imgIdx"
                class="rounded-xl h-32 w-full object-cover"
                mode="aspectFill"
                :src="resolveMediaUrl(img)" />
            </view>
            <view class="flex gap-3" @click.stop>
              <view
                class="flex-1 py-3 rounded-full bg-primary text-white text-[11px] font-bold tracking-[0.2em] flex items-center justify-center gap-2 shadow-md shadow-primary/10 transition-transform active:scale-95"
                @tap.stop="onPendingPostFlagTap(post.id)"
                @click.stop="onPendingPostFlagTap(post.id)">
                <text class="iconfont icon-check-circle text-[36rpx]"></text>
                批准发布
              </view>
              <view
                class="w-12 h-12 rounded-full border border-primary/10 bg-primary/5 flex items-center justify-center text-on-surface-variant/60 shrink-0"
                @tap.stop="onPendingPostFlagTap(post.id)"
                @click.stop="onPendingPostFlagTap(post.id)">
                <text class="iconfont icon-flag text-[36rpx]"></text>
              </view>
            </view>
          </view>
          <!-- 已发布 / 草稿等：原卡片 -->
          <view
            v-else
            class="rounded-[2rem] p-5 shadow-sm border border-primary/10 bg-[#ffffffcc]"
            @click="goPostDetail(post.id)">
            <view class="flex items-center justify-between mb-4">
              <view class="flex items-center gap-3">
                <image
                  class="w-8 h-8 rounded-full object-cover ring-2 ring-primary/10"
                  :src="selfAvatar"
                  mode="aspectFill" />
                <text class="text-[10px] font-bold tracking-[0.15em] text-on-surface-variant uppercase">{{
                  selfNickname
                }}</text>
              </view>
              <text
                class="px-2.5 py-1 rounded-full bg-primary/10 text-[9px] font-bold text-primary tracking-widest uppercase">
                {{ postStatusLabel(post.status) }}
              </text>
            </view>
            <view class="text-[26rpx] font-body theme-color-6 leading-relaxed mb-4 line-clamp-4 whitespace-pre-wrap">
              {{ (post.content || "").trim() || "（无正文）" }}
            </view>
            <view v-if="post.images?.length" class="grid grid-cols-2 gap-2.5 mb-4">
              <image
                v-for="(img, imgIdx) in post.images.slice(0, 4)"
                :key="imgIdx"
                class="rounded-xl h-32 w-full object-cover"
                mode="aspectFill"
                :src="resolveMediaUrl(img)" />
            </view>
            <view class="flex items-center justify-between pt-4 border-t border-primary/5">
              <view class="flex gap-5">
                <text class="flex items-center gap-1 text-[24rpx] theme-color-8">
                  <text class="iconfont icon-heart-fill text-[36rpx]"></text>
                  {{ post.likeCount ?? 0 }}
                </text>
              </view>
              <view class="flex gap-3" @click.stop>
                <view
                  class="flex items-center gap-1.5 px-3 py-2 rounded-full bg-theme-13 text-on-surface-variant active:opacity-80"
                  @tap.stop="goPostDetail(post.id)"
                  @click.stop="goPostDetail(post.id)">
                  <text class="iconfont icon-a-EditSquare-Light text-[36rpx]"></text>
                  <text class="text-[10px] font-bold tracking-widest">编辑</text>
                </view>
                <view
                  class="flex items-center gap-1.5 px-3 py-2 rounded-full bg-red-500/10 text-[#ef4444] active:opacity-80"
                  @tap.stop="openDeletePostConfirm(post)"
                  @click.stop="openDeletePostConfirm(post)">
                  <text class="iconfont icon-trash-2 text-[36rpx]"></text>
                  <text class="text-[10px] font-bold tracking-widest">删除</text>
                </view>
              </view>
            </view>
          </view>
        </template>
      </view>
      <view v-if="posts.length > 0" class="py-6 text-center text-xs theme-color-8">
        <text v-if="loadMoreStatus === 'loading'">加载更多…</text>
        <text v-else-if="loadMoreStatus === 'nomore'">没有更多了</text>
      </view>
    </view>
    <view
      class="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center z-40 transition-transform active:scale-95"
      @click="goNewPost">
      <text class="icon-add iconfont text-[56rpx]"></text>
    </view>

    <ToastConfirm
      v-model:show="toastShow"
      :title="toastTitle"
      :message="toastMessage"
      :fields="toastFieldsEmpty"
      :confirm-text="toastConfirmText"
      cancel-text="取消"
      :mask-closable="true"
      @confirm="onToastConfirm" />
  </view>
</template>

<script setup lang="ts">
import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import { fetchPostFeed, postPostDelete } from "@/assets/js/api/post";
import { config } from "@/assets/js/config";
import type { MyPostFeedQuery, PostFeedPage, PostInfo } from "@/types/api/post";
import type { ToastInputField } from "@/types/pages/component";
import { unwrapApiData } from "@/utils/apiResponse";
import { navigateBack } from "@/utils/navigation";
import lcrBar from "@/components/lcrBar.vue";
import { ToastConfirm } from "@/components";
import { useTeamStore } from "@/stores/team";
import { useUserStore } from "@/stores/user";

const PAGE_SIZE = 20;

const teamStore = useTeamStore();
const userStore = useUserStore();

/** 路由 `?teamId=`，与社群管理页跳转一致；无参数则请求中不带 `teamId` */
const routeTeamId = ref<number | null>(null);

/** 构建 `/app/post/feed` 查询：有 URL `teamId` 才写入该字段 */
function buildMyPostFeedQuery(partial: {
  page: number;
  size: number;
  publishStatus: 0 | 1 | 2;
}): MyPostFeedQuery {
  const q: MyPostFeedQuery = {
    page: partial.page,
    size: partial.size,
    publishStatus: partial.publishStatus,
  };
  if (routeTeamId.value != null) q.teamId = routeTeamId.value;
  return q;
}

const posts = ref<PostInfo[]>([]);
const page = ref(1);
const listLoading = ref(false);
const loadMoreStatus = ref<"loadmore" | "loading" | "nomore">("loadmore");
const activePublishStatus = ref<0 | 1 | 2>(2);

const countAll = ref(0);
const countPending = ref(0);
const countPublished = ref(0);

const toastFieldsEmpty: ToastInputField[] = [];
const toastShow = ref(false);
const toastTitle = ref("");
const toastMessage = ref("");
const toastConfirmText = ref("确定");
const pendingDeletePostId = ref<number | null>(null);

/** URL 带 `teamId` 时展示；名称来自在职团队列表，未命中时退化为「团队 {id}」 */
const contextTeamDisplayName = computed(() => {
  const tid = routeTeamId.value;
  if (tid == null) return "";
  const hit = teamStore.myCurrentTeams.find((t) => t.teamId === tid);
  return hit?.teamName?.trim() || `团队 ${tid}`;
});

const selfNickname = computed(() => userStore.nickName?.trim() || "云友");
const selfAvatar = computed(() => {
  const u = (userStore.avatarUrl || "").trim();
  if (!u) return "/static/logo.png";
  return resolveMediaUrl(u);
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

function postStatusLabel(status: number): string {
  if (status === 2) return "已发布";
  if (status === 1) return "待审核";
  return "草稿";
}

function goPostDetail(postId: number) {
  uni.navigateTo({
    url: `/pages/post/detail?id=${postId}&type=allPost`,
  });
}

/** 待审核卡片右侧标记：占位，避免触发整卡跳转详情 */
function onPendingPostFlagTap(postId: number) {
  uni.showToast({ title: "功能暂未开放", icon: "none" });
}

function goNewPost() {
  uni.navigateTo({ url: "/pages/post/edit-post" });
}

function openDeletePostConfirm(post: PostInfo) {
  pendingDeletePostId.value = post.id;
  toastTitle.value = "确认删除动态？";
  toastMessage.value = "仅可删除本人发布的动态。删除后将同步清理点赞记录，且不可恢复。";
  toastConfirmText.value = "删除";
  toastShow.value = true;
}

async function onToastConfirm() {
  const id = pendingDeletePostId.value;
  pendingDeletePostId.value = null;
  if (id == null) return;
  try {
    await postPostDelete({ id });
    uni.showToast({ title: "已删除", icon: "success" });
    await refreshAll();
  } catch (e) {
    console.error("postPostDelete", e);
  }
}

async function fetchTabTotal(publishStatus: 0 | 1 | 2): Promise<number> {
  const res = await fetchPostFeed(buildMyPostFeedQuery({ page: 1, size: 1, publishStatus }));
  const data = unwrapApiData<PostFeedPage>(res);
  return data?.pagination?.total ?? data?.list?.length ?? 0;
}

async function refreshCounts() {
  try {
    const [a, b, c] = await Promise.all([
      fetchTabTotal(0),
      fetchTabTotal(1),
      fetchTabTotal(2),
    ]);
    countAll.value = a;
    countPending.value = b;
    countPublished.value = c;
  } catch (e) {
    console.error("allPost refreshCounts", e);
  }
}

async function loadList(reset: boolean) {
  if (listLoading.value) return;
  if (!reset && loadMoreStatus.value === "nomore") return;

  listLoading.value = true;
  if (reset) {
    page.value = 1;
    posts.value = [];
    loadMoreStatus.value = "loadmore";
  }
  loadMoreStatus.value = "loading";

  try {
    const res = await fetchPostFeed(
      buildMyPostFeedQuery({
        page: page.value,
        size: PAGE_SIZE,
        publishStatus: activePublishStatus.value,
      }),
    );
    const data = unwrapApiData<PostFeedPage>(res);
    const list = data?.list ?? [];
    const total = data?.pagination?.total;
    if (reset) {
      posts.value = list;
    } else {
      posts.value = posts.value.concat(list);
    }
    const loaded = posts.value.length;
    if (list.length < PAGE_SIZE || (total != null && loaded >= total)) {
      loadMoreStatus.value = "nomore";
    } else {
      loadMoreStatus.value = "loadmore";
      page.value += 1;
    }
  } catch (e) {
    console.error("allPost loadList", e);
    uni.showToast({ title: "加载失败", icon: "none" });
    loadMoreStatus.value = "loadmore";
    if (reset) posts.value = [];
  } finally {
    listLoading.value = false;
  }
}

async function refreshAll() {
  await refreshCounts();
  await loadList(true);
}

function onTabChange(v: 0 | 1 | 2) {
  if (activePublishStatus.value === v) return;
  activePublishStatus.value = v;
  void loadList(true);
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
  await refreshAll();
});

onReachBottom(() => {
  if (loadMoreStatus.value === "loadmore" && !listLoading.value) {
    void loadList(false);
  }
});

const onBack = () => navigateBack();
</script>

<style scoped lang="scss">
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
</style>
