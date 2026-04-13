<template>
  <view class="flex flex-col min-h-screen pb-32 theme-bg">
    <LcrBar :title="'社群管理'" :type="'all'" />
    <view
      class="sticky  z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md" :class="`top-${getNavbarHeight()}px`">
    </view>
    <view class="flex-1 overflow-y-auto px-[32rpx] py-[32rpx] space-y-6">
      <!-- Search Bar -->
      <view class="relative group">
        <view class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <text
            class="iconfont icon-search text-[36rpx] text-primary/40 theme-color-1"></text>
        </view>
        <input
          class="box-border h-[94rpx] pl-[96rpx] pr-4 bg-white bg-theme-11 border-none rounded-full text-[28rpx] transition-all shadow-sm"
          placeholder="搜索动态或成员..." type="text" v-model="searchQuery" />
      </view>
      <!-- Content view: My Posts -->
      <view class="space-y-4">
        <view class="flex items-center justify-between">
          <view class="text-[28rpx] font-bold theme-color-1">我的动态 ({{ myPostsTotal }})</view>
          <view class="text-[24rpx] font-bold theme-color-1 flex items-center gap-1" @click="goAllPost()">
            全部动态 <text class="iconfont icon-jinru text-[24rpx]" ></text>
          </view>
        </view>
        <template v-for="(post, pIdx) in filteredPosts" :key="post.id">
          <!-- 与原版一致：偶数索引为「大图卡片」，奇数为「纯文卡片」 -->
          <view
            v-if="pIdx % 2 === 0"
            class="bg-white rounded-[70rpx] p-[32rpx] shadow-sm border border-primary/5"
            @click="goPostDetail(post.id)"
          >
            <view class="flex gap-3 mb-3">
              <image class="w-[80rpx] h-[80rpx] rounded-full object-cover ring-2 ring-[#d4af3566]"
                data-alt="User personal profile avatar"
                :src="selfAvatar" />
              <view>
                <view class="font-bold text-[28rpx]">{{ selfNickname }}</view>
                <view class="text-[20rpx] theme-color-8 uppercase">
                  {{ formatRelativeTime(post.updateTime || post.createTime) }} · {{ postStatusLabel(post.status) }}
                </view>
              </view>
            </view>
            <view class="text-[28rpx] leading-relaxed mb-[32rpx] theme-color-5">
              {{ (post.content || '').trim() || '（无正文）' }}
            </view>
            <view v-if="post.images?.length" class="grid grid-cols-2 gap-2 mb-[32rpx]">
              <image class="w-full h-[256rpx] object-cover rounded-[30rpx]"
                v-for="(img, imgIdx) in post.images.slice(0, 4)"
                :key="imgIdx"
                mode="aspectFill"
                :src="resolveMediaUrl(img)" />
            </view>
            <view class="flex items-center justify-between pt-[32rpx] border-t border-primary/5">
              <view class="flex gap-4">
                <text class="flex items-center gap-1 text-[24rpx] theme-color-8"><text
                    class="iconfont icon-heart-fill text-base align-middle"></text> {{ post.likeCount ?? 0 }}</text>
                <text class="flex items-center gap-1 text-[24rpx] theme-color-8"><text
                    class="iconfont icon-chat-bubble-1 text-base align-middle "></text> 0</text>
              </view>
              <view class="flex gap-2" @click.stop>
                <view
                  class="flex items-center gap-1 px-[24rpx] text-[24rpx] py-[12rpx] rounded-full bg-theme-13 theme-color-1 text-xs font-bold transition-transform active:scale-95"
                  @click.stop="goPostDetail(post.id)">
                  <text class="iconfont icon-beizhu text-[24rpx]"></text> 编辑
                </view>
                <view
                  class="flex items-center gap-1 px-[24rpx] text-[24rpx] py-[12rpx] rounded-full bg-red-500/10 text-[#ef4444] font-bold transition-transform active:scale-95"
                  @click.stop="openDeletePostConfirm(post)">
                  <text class="iconfont icon-trash-2 text-[24rpx]"></text> 删除
                </view>
              </view>
            </view>
          </view>
          <view
            v-else
            class="bg-white rounded-[70rpx] p-[32rpx] shadow-sm border border-primary/5"
            @click="goPostDetail(post.id)"
          >
            <view class="flex gap-3 mb-3">
              <image class="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                data-alt="User personal profile avatar"
                :src="selfAvatar"
                mode="aspectFill" />
              <view>
                <view class="font-bold text-[28rpx]">{{ selfNickname }}</view>
                <view class="text-[20rpx] theme-color-8 uppercase">
                  {{ formatRelativeTime(post.updateTime || post.createTime) }} · {{ postStatusLabel(post.status) }}
                </view>
              </view>
            </view>
            <view class="text-[24rpx] leading-relaxed mb-[32rpx] text-[#4a4538] dark:text-primary/80 italic">
              {{ (post.content || '').trim() || '（无正文）' }}
            </view>
            <view class="flex items-center justify-between pt-[32rpx] border-t border-primary/5">
              <view class="flex gap-4">
                <text class="flex items-center gap-1 text-[24rpx] theme-color-8">
                  <text
                    class="iconfont icon-heart-fill text-base align-middle"></text> {{ post.likeCount ?? 0 }}</text>
              </view>
              <view class="flex gap-2" @click.stop>
                <view
                  class="flex items-center gap-1 px-[24rpx] text-[24rpx] py-[12rpx] rounded-full bg-theme-13 theme-color-1 text-xs font-bold transition-transform active:scale-95"
                  @click.stop="goPostDetail(post.id)">
                  <text class="iconfont icon-beizhu text-[24rpx]"></text> 编辑
                </view>
                <view
                  class="flex items-center gap-1 px-[24rpx] text-[24rpx] py-[12rpx] rounded-full bg-red-500/10 text-[#ef4444] font-bold transition-transform active:scale-95"
                  @click.stop="openDeletePostConfirm(post)">
                  <text class="iconfont icon-trash-2 text-[24rpx]"></text> 删除
                </view>
              </view>
            </view>
          </view>
        </template>
      </view>
      <!-- Member Management view -->
      <view class="space-y-4">
        <view class="flex items-center justify-between">
          <view class="text-[28rpx] font-bold theme-color-1 uppercase tracking-widest">社群成员 ({{ membersTotal }})</view>
          <view class="text-[24rpx] font-bold theme-color-1 flex items-center gap-1" @click="goAllMember()">
            管理全员 <text class="iconfont icon-setting text-[24rpx]"></text>
          </view>
        </view>
        <view class="bg-white dark:bg-white/5 rounded-xl viewide-y viewide-primary/5 border border-primary/5">
          <template v-for="(m, mIdx) in filteredMembers" :key="m.userId">
            <view v-if="mIdx % 3 === 0" class="flex items-center justify-between p-4">
              <view class="flex items-center gap-3">
                <view class="relative">
                  <image class="w-[96rpx] h-[96rpx] rounded-full object-cover" data-alt="Male user profile portrait"
                    :src="resolveMediaUrl(m.avatarUrl)"
                    mode="aspectFill" />
                  <text class="absolute bottom-0 right-0 w-[24rpx] h-[24rpx] bg-[#22c55e] border-2 border-white rounded-full"></text>
                </view>
                <view>
                  <view class="flex items-center gap-2">
                    <view class="font-bold text-[28rpx] theme-color-5">{{ m.nickName?.trim() || '云友' }}</view>
                    <text v-if="m.isOwner == 1" class="px-[16rpx] py-[4rpx] rounded-full bg-theme-3 text-[20rpx] theme-color-1 font-bold">管理员</text>
                  </view>
                  <view class="text-[24rpx] theme-color-4">{{ memberSubline(m) }}</view>
                </view>
              </view>
              <view
                v-if="canRemoveMember(m)"
                class="flex items-center gap-1 px-[24rpx] text-[24rpx] py-[12rpx] rounded-full bg-red-500/10 text-[#ef4444] font-bold transition-transform active:scale-95"
                @click.stop="openRemoveMemberConfirm(m)">
                <text class="iconfont icon-trash-2 text-[24rpx]"></text> 移出
              </view>
              <view
                v-else
                class="w-[80rpx] h-[80rpx] flex mr-0 items-center justify-center rounded-full bg-theme-13  text-primary hover:bg-primary/20 transition-colors">
                <text class="iconfont icon-person_search text-[48rpx]  theme-color-1 "></text>
              </view>
            </view>
            <view v-else-if="mIdx % 3 === 1" class="flex items-center justify-between p-4">
              <view class="flex items-center gap-3">
                <img class="w-12 h-12 rounded-full object-cover" data-alt="Female user profile portrait"
                  :src="resolveMediaUrl(m.avatarUrl)" />
                <view>
                  <view class="flex items-center gap-2">
                    <view class="font-bold text-[28rpx] theme-color-5">{{ m.nickName?.trim() || '云友' }}</view>
                  </view>
                  <view class="text-[24rpx] theme-color-4">{{ memberSubline(m) }}</view>
                </view>
              </view>
              <view
                v-if="canRemoveMember(m)"
                class="flex items-center gap-1 px-[32rpx] py-[12rpx] mr-0 rounded-full bg-red-500/10 text-[#ef4444] text-[24rpx] font-bold transition-transform active:scale-95"
                @click.stop="openRemoveMemberConfirm(m)">
                <text class="iconfont icon-trash-2 text-[24rpx]"></text> 移出
              </view>
              <view
                v-else
                class="px-[32rpx] py-[12rpx] mr-0 rounded-full ring-1 ring-[#d4af35]/30 bg-theme-13 text-primary text-[24rpx] font-bold hover:bg-primary/5 transition-colors">
                管理
              </view>
            </view>
            <view v-else class="flex items-center justify-between p-4">
              <view class="flex items-center gap-3">
                <image class="w-12 h-12 rounded-full object-cover" data-alt="Professional user profile portrait"
                  :src="resolveMediaUrl(m.avatarUrl)"
                  mode="aspectFill" />
                <view>
                  <view class="flex items-center gap-2">
                    <view class="font-bold text-[28rpx] theme-color-5">{{ m.nickName?.trim() || '云友' }}</view>
                  </view>
                  <view class="text-[24rpx] theme-color-4">{{ memberSubline(m) }}</view>
                </view>
              </view>
              <view
                v-if="canRemoveMember(m)"
                class="flex items-center gap-1 px-4 py-1.5 mr-0 rounded-full bg-red-500/10 text-[#ef4444] text-xs font-bold transition-transform active:scale-95"
                @click.stop="openRemoveMemberConfirm(m)">
                <text class="iconfont icon-trash-2 text-[24rpx]"></text> 移出
              </view>
              <view
                v-else
                class="px-4 py-1.5 mr-0 rounded-full ring-1 ring-[#d4af35]/30 text-primary bg-theme-13 text-xs font-bold hover:bg-primary/5 transition-colors">
                管理
              </view>
            </view>
          </template>
        </view>
      </view>
    </view>
    <!-- Floating Action view -->
    <view class="fixed bottom-24 right-6 flex flex-col gap-3">
      <view
      @click="goEditPost()"
        class="flex items-center justify-center w-[112rpx] h-[112rpx] rounded-full  bg-theme-2 text-background-dark shadow-lg shadow-primary/20 active:scale-95 transition-transform">
        <text class="iconfont icon-share text-[70rpx] text-white"></text>
      </view>
    </view>

    <ToastConfirm
      v-model:show="manageToastShow"
      :title="manageToastTitle"
      :message="manageToastMessage"
      :fields="manageToastFieldsEmpty"
      :confirm-text="manageToastConfirmText"
      cancel-text="取消"
      :mask-closable="true"
      @confirm="onManageToastConfirm"
    />
  </view>
</template>
<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import { fetchTeamMemberPage, postTeamMemberRemove } from "@/assets/js/api/team";
import { fetchPostFeed, postPostDelete } from "@/assets/js/api/post";
import { config } from "@/assets/js/config";
import type { PostInfo } from "@/types/api/post";
import type { TeamMemberRow } from "@/types/api/team";
import type { ToastInputField } from "@/types/pages/component";
import { unwrapApiData } from "@/utils/apiResponse";
import { formatRelativeTime } from "@/utils/common";
import { getNavbarHeight } from "@/utils/system";
import LcrBar from "@/components/lcrBar.vue";
import {ToastConfirm} from "@/components";
import { useTeamStore } from "@/stores/team";
import { useUserStore } from "@/stores/user";

const teamStore = useTeamStore();
const userStore = useUserStore();

const searchQuery = ref("");
const myPosts = ref<PostInfo[]>([]);
const myPostsTotal = ref(0);
const members = ref<TeamMemberRow[]>([]);
const membersTotal = ref(0);

/** 纯确认弹窗：无输入框 */
const manageToastFieldsEmpty: ToastInputField[] = [];
const manageToastShow = ref(false);
const manageToastTitle = ref("");
const manageToastMessage = ref("");
const manageToastConfirmText = ref("确定");

type ManageToastPending =
  | { kind: "deletePost"; postId: number }
  | { kind: "removeMember"; member: TeamMemberRow }
  | null;

const manageToastPending = ref<ManageToastPending>(null);

const selfNickname = computed(() => userStore.nickName);
const selfAvatar = computed(() => userStore.avatarUrl);

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

function memberSubline(m: TeamMemberRow): string {
  const parts: string[] = [];
  if (m.joinedAt) parts.push(`${formatRelativeTime(m.joinedAt)}加入`);
  parts.push(`${m.postCount} 条动态`);
  return parts.join(" · ");
}

const filteredPosts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return myPosts.value;
  return myPosts.value.filter((p) => (p.content || "").toLowerCase().includes(q));
});

const filteredMembers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return members.value;
  return members.value.filter(
    (m) =>
      (m.nickName || "").toLowerCase().includes(q) || String(m.userId).includes(q),
  );
});

/** 当前所选团队是否由本人负责（与 `MyTeamItem.ownerId` 一致） */
const isTeamOwner = computed(() => {
  const uid = userStore.currentUser?.id;
  const tid = teamStore.resolvedPublishTeamId;
  if (uid == null || tid == null) return false;
  const team = teamStore.myCurrentTeams.find((t) => t.teamId === tid);
  return team != null && team.ownerId === uid;
});

/** 仅负责人可操作移出；不可移出负责人；不可移出自己 */
function canRemoveMember(m: TeamMemberRow): boolean {
  if (!isTeamOwner.value) return false;
  if (m.isOwner === 1) return false;
  const selfId = userStore.currentUser?.id;
  if (selfId == null) return false;
  if (m.userId === selfId) return false;
  return true;
}

function openDeletePostConfirm(post: PostInfo) {
  manageToastPending.value = { kind: "deletePost", postId: post.id };
  manageToastTitle.value = "确认删除动态？";
  manageToastMessage.value =
    "仅可删除本人发布的动态。删除后将同步清理点赞记录，且不可恢复。";
  manageToastConfirmText.value = "删除";
  manageToastShow.value = true;
}

function openRemoveMemberConfirm(m: TeamMemberRow) {
  const tid = teamStore.resolvedPublishTeamId;
  if (tid == null) {
    uni.showToast({ title: "暂无可用团队", icon: "none" });
    return;
  }
  if (!canRemoveMember(m)) return;
  manageToastPending.value = { kind: "removeMember", member: m };
  manageToastTitle.value = "确认移出成员？";
  manageToastMessage.value = `将「${(m.nickName || "").trim() || "该成员"}」移出当前团队，对方将不再属于本社群。`;
  manageToastConfirmText.value = "移出";
  manageToastShow.value = true;
}

async function onManageToastConfirm(_vals: Record<string, string>) {
  const pending = manageToastPending.value;
  manageToastPending.value = null;
  if (!pending) return;
  if (pending.kind === "deletePost") {
    try {
      await postPostDelete({ id: pending.postId });
      uni.showToast({ title: "已删除", icon: "success" });
      await loadPageData();
    } catch (e) {
      console.error("postPostDelete", e);
    }
    return;
  }
  const tid = teamStore.resolvedPublishTeamId;
  if (tid == null) return;
  try {
    await postTeamMemberRemove({ teamId: tid, userId: pending.member.userId });
    uni.showToast({ title: "已移出", icon: "success" });
    await loadPageData();
  } catch (e) {
    console.error("postTeamMemberRemove", e);
  }
}

async function loadPageData() {
  try {
    await teamStore.fetchMyCurrentTeams();
    teamStore.syncPublishTeamFromUserFirstTeam(userStore.currentUser?.firstTeamId);

    const teamId = teamStore.resolvedPublishTeamId ?? undefined;

    const [feedRes, memberRes] = await Promise.all([
      fetchPostFeed({ page: 1, size: 2, publishStatus: 2 }),
      fetchTeamMemberPage({ teamId, page: 1, size: 3, role: 0 }),
    ]);

    const feedData = unwrapApiData<{ list: PostInfo[]; pagination?: { total?: number } }>(feedRes);
    myPosts.value = feedData?.list ?? [];
    myPostsTotal.value = feedData?.pagination?.total ?? myPosts.value.length;

    const memData = unwrapApiData<{ list: TeamMemberRow[]; pagination?: { total?: number } }>(memberRes);
    members.value = memData?.list ?? [];
    membersTotal.value = memData?.pagination?.total ?? members.value.length;
  } catch (e) {
    console.error("manage loadPageData", e);
    uni.showToast({ title: "加载失败", icon: "none" });
    myPosts.value = [];
    members.value = [];
  }
}

onShow(() => {
  void loadPageData();
});

function teamQuerySuffix(): string {
  const id = teamStore.resolvedPublishTeamId;
  return id != null ? `?teamId=${id}` : "";
}

const goPostDetail = (postId: number) => {
  uni.navigateTo({
    url: `/pages/post/detail?id=${postId}&type=manage`,
  });
};

function goEditPost(post?: PostInfo) {
  if (post?.id != null) {
    uni.navigateTo({
      url: `/pages/post/edit-post?id=${post.id}`,
    });
    return;
  }
  uni.navigateTo({
    url: "/pages/post/edit-post",
  });
}

const goAllPost = () => {
  uni.navigateTo({
    url: `/pages/community/allPost${teamQuerySuffix()}`,
  });
};

const goAllMember = () => {
  uni.navigateTo({
    url: `/pages/community/allMember${teamQuerySuffix()}`,
  });
};
</script>
