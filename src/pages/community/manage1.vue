<template>
  <view class="flex flex-col min-h-screen pb-32 theme-bg">
    <LcrBar :title="'社群管理'" :type="'all'" />
    <view
      class="sticky z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md"
      :style="{ top: getNavbarHeight() + 'px' }"
    >
      <view class="px-[32rpx] pb-[25rpx] pt-[12rpx]">
        <view class="flex p-[8rpx] items-center justify-center rounded-full bg-theme-13 gap-1">
          <view
            class="flex box-border cursor-pointer py-[16rpx] text-[28rpx] flex-1 items-center justify-center rounded-full transition-all font-semibold"
            :class="activeTab === 'posts' ? 'bg-white theme-color-1 shadow-sm' : 'theme-color-12'"
            @click="switchTab('posts')"
          >
            <text>我的动态</text>
          </view>
          <view
            class="flex box-border cursor-pointer py-[16rpx] text-[28rpx] flex-1 items-center justify-center rounded-full transition-all font-semibold"
            :class="activeTab === 'members' ? 'bg-white theme-color-1 shadow-sm' : 'theme-color-12'"
            @click="switchTab('members')"
          >
            <text>成员管理</text>
          </view>
        </view>
      </view>
      <view class="px-[32rpx] pb-[25rpx]">
        <view class="relative group">
          <view class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <text class="iconfont icon-search text-[36rpx] text-primary/40 theme-color-1"></text>
          </view>
          <input
            class="box-border h-[94rpx] pl-[96rpx] pr-4 bg-white bg-theme-11 border-none rounded-full text-[28rpx] transition-all shadow-sm"
            :placeholder="activeTab === 'posts' ? '搜索动态...' : '搜索成员...'"
            type="text"
            v-model="searchQuery"
            @confirm="onSearchConfirm"
          />
        </view>
      </view>
    </view>

    <view class="flex-1 min-h-0 px-[32rpx]">
      <up-list
        v-if="activeTab === 'posts'"
        class="h-full"
        height="100%"
        :lower-threshold="120"
        :show-scrollbar="true"
        @scrolltolower="loadMorePosts"
      >
        <view class="py-[24rpx] space-y-4">
          <view class="flex items-center justify-between">
            <view class="text-[28rpx] font-bold theme-color-1">我的动态 ({{ postState.list.length }})</view>
            <view class="text-[24rpx] font-bold theme-color-1 flex items-center gap-1">
              全部动态 <text class="iconfont icon-jinru text-[24rpx]"></text>
            </view>
          </view>
          <view
            v-for="post in postState.list"
            :key="post.id"
            class="bg-white rounded-[70rpx] p-[32rpx] shadow-sm border border-primary/5"
            @click="goPostDetail(post.id)"
          >
            <view class="flex gap-3 mb-3">
              <image class="w-[80rpx] h-[80rpx] rounded-full object-cover ring-2 ring-[#d4af3566]" :src="post.avatar" />
              <view>
                <view class="font-bold text-[28rpx]">{{ post.author }}</view>
                <view class="text-[20rpx] theme-color-8 uppercase">{{ post.timeText }} · 已发布</view>
              </view>
            </view>
            <view v-if="post.images.length" class="text-[28rpx] leading-relaxed mb-[32rpx] theme-color-5">{{ post.content }}</view>
            <view v-else class="text-[24rpx] leading-relaxed mb-[32rpx] text-[#4a4538] dark:text-primary/80 italic">{{ post.content }}</view>
            <view v-if="post.images.length" class="grid grid-cols-2 gap-2 mb-[32rpx]">
              <image v-for="img in post.images" :key="img" class="w-full h-[256rpx] object-cover rounded-[30rpx]" :src="img" />
            </view>
            <view class="flex items-center justify-between pt-[32rpx] border-t border-primary/5">
              <view class="flex gap-4">
                <text class="flex items-center gap-1 text-[24rpx] theme-color-8">
                  <text class="iconfont icon-heart-fill text-base align-middle"></text> {{ post.likes }}
                </text>
                <text class="flex items-center gap-1 text-[24rpx] theme-color-8">
                  <text class="iconfont icon-chat-bubble-1 text-base align-middle "></text> {{ post.comments }}
                </text>
              </view>
              <view class="flex gap-2">
                <button class="flex items-center gap-1 px-[24rpx] text-[24rpx] py-[12rpx] rounded-full bg-theme-13 theme-color-1 font-bold transition-transform active:scale-95">
                  <text class="iconfont icon-beizhu text-[24rpx]"></text>编辑
                </button>
                <button class="flex items-center gap-1 px-[24rpx] text-[24rpx] py-[12rpx] rounded-full bg-red-500/10 text-[#ef4444] font-bold transition-transform active:scale-95">
                  <text class="iconfont icon-trash-2 text-[24rpx]"></text>删除
                </button>
              </view>
            </view>
          </view>
          <up-loadmore :status="postState.loadStatus" line @loadmore="loadMorePosts" />
        </view>
      </up-list>

      <up-list
        v-else
        class="h-full"
        height="100%"
        :lower-threshold="120"
        :show-scrollbar="true"
        @scrolltolower="loadMoreMembers"
      >
        <view class="py-[24rpx] space-y-4">
          <view class="flex items-center justify-between">
            <view class="text-[28rpx] font-bold theme-color-1 uppercase tracking-widest">社群成员 ({{ memberState.list.length }})</view>
            <view class="text-[24rpx] font-bold theme-color-1 flex items-center gap-1">
              管理全员 <text class="iconfont icon-setting text-[24rpx]"></text>
            </view>
          </view>
          <view class="bg-white dark:bg-white/5 rounded-xl viewide-y viewide-primary/5 border border-primary/5">
            <view v-for="member in memberState.list" :key="member.id" class="flex items-center justify-between p-4">
              <view class="flex items-center gap-3">
                <view class="relative">
                  <image class="w-[96rpx] h-[96rpx] rounded-full object-cover" :src="member.avatar" />
                  <text
                    v-if="member.online"
                    class="absolute bottom-0 right-0 w-[24rpx] h-[24rpx] bg-[#22c55e] border-2 border-white rounded-full"
                  ></text>
                </view>
                <view>
                  <view class="flex items-center gap-2">
                    <view class="font-bold text-[28rpx] theme-color-5">{{ member.name }}</view>
                    <text v-if="member.role === '管理员'" class="px-[16rpx] py-[4rpx] rounded-full bg-theme-3 text-[20rpx] theme-color-1 font-bold">管理员</text>
                  </view>
                  <view class="text-[24rpx] theme-color-4">{{ member.subtitle }}</view>
                </view>
              </view>
              <button
              v-if="member.role === '管理员'"
              class="w-[80rpx] h-[80rpx] flex mr-0 items-center justify-center rounded-full bg-theme-13  text-primary hover:bg-primary/20 transition-colors">
              <text class="iconfont icon-person_search text-[48rpx]  theme-color-1 "></text>
            </button>
              <button v-else
              class="px-[32rpx] py-[12rpx] mr-0 rounded-full ring-1 ring-[#d4af35]/30 bg-theme-13 text-primary text-[24rpx] font-bold hover:bg-primary/5 transition-colors">
              管理
            </button>
            </view>
          </view>
          <up-loadmore :status="memberState.loadStatus" line @loadmore="loadMoreMembers" />
        </view>
      </up-list>
    </view>

    <view v-if="activeTab === 'posts'" class="fixed bottom-24 right-6">
      <button
        @click="goEditPost"
        class="flex items-center justify-center w-[112rpx] h-[112rpx] rounded-full bg-theme-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
      >
        <text class="iconfont icon-add text-[48rpx] text-white"></text>
      </button>
    </view>
  </view>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { navigateBack } from "@/utils/navigation";
import LcrBar from "@/components/lcrBar.vue";
import { getNavbarHeight } from "@/utils/system";

type TabType = "posts" | "members";
type LoadStatus = "loadmore" | "loading" | "nomore";

type PostItem = { id: string; author: string; avatar: string; timeText: string; content: string; likes: number; comments: number; images: string[] };
type MemberItem = { id: string; name: string; role: string; subtitle: string; avatar: string; online: boolean };

const PAGE_SIZE = 6;
const activeTab = ref<TabType>("posts");
const searchQuery = ref("");

const postState = reactive({ page: 1, finished: false, loading: false, loadStatus: "loadmore" as LoadStatus, list: [] as PostItem[] });
const memberState = reactive({ page: 1, finished: false, loading: false, loadStatus: "loadmore" as LoadStatus, list: [] as MemberItem[] });

const mockPosts: PostItem[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `post-${i + 1}`,
  author: "李慕白",
  avatar: "/static/770-800x600.jpg",
  timeText: `${i + 1}小时前`,
  content: `这是我的第 ${i + 1} 条动态，记录冥想与社群交流的感受。`,
  likes: 12 + i,
  comments: 3 + (i % 5),
  images: i % 2 === 0 ? ["/static/770-800x600.jpg"] : []
}));

const mockMembers: MemberItem[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `member-${i + 1}`,
  name: i === 0 ? "陈修远" : `成员${i + 1}`,
  role: i === 0 ? "管理员" : "成员",
  subtitle: i === 0 ? "上次在线: 5分钟前" : `活跃成员 · ${8 + i} 动态`,
  avatar: "/static/770-800x600.jpg",
  online: i % 3 === 0
}));

const onBack = () => navigateBack();

function resetPosts() {
  postState.page = 1;
  postState.finished = false;
  postState.list = [];
  postState.loadStatus = "loadmore";
}

function resetMembers() {
  memberState.page = 1;
  memberState.finished = false;
  memberState.list = [];
  memberState.loadStatus = "loadmore";
}

async function loadMorePosts() {
  if (postState.loading || postState.finished || activeTab.value !== "posts") return;
  postState.loading = true;
  postState.loadStatus = "loading";
  await new Promise((r) => setTimeout(r, 180));
  const keyword = searchQuery.value.trim();
  const source = keyword ? mockPosts.filter((x) => `${x.content}${x.author}`.includes(keyword)) : mockPosts;
  const start = (postState.page - 1) * PAGE_SIZE;
  const slice = source.slice(start, start + PAGE_SIZE);
  postState.list = postState.list.concat(slice);
  if (start + PAGE_SIZE >= source.length || slice.length < PAGE_SIZE) {
    postState.finished = true;
    postState.loadStatus = "nomore";
  } else {
    postState.page += 1;
    postState.loadStatus = "loadmore";
  }
  postState.loading = false;
}

async function loadMoreMembers() {
  if (memberState.loading || memberState.finished || activeTab.value !== "members") return;
  memberState.loading = true;
  memberState.loadStatus = "loading";
  await new Promise((r) => setTimeout(r, 180));
  const keyword = searchQuery.value.trim();
  const source = keyword ? mockMembers.filter((x) => `${x.name}${x.subtitle}`.includes(keyword)) : mockMembers;
  const start = (memberState.page - 1) * PAGE_SIZE;
  const slice = source.slice(start, start + PAGE_SIZE);
  memberState.list = memberState.list.concat(slice);
  if (start + PAGE_SIZE >= source.length || slice.length < PAGE_SIZE) {
    memberState.finished = true;
    memberState.loadStatus = "nomore";
  } else {
    memberState.page += 1;
    memberState.loadStatus = "loadmore";
  }
  memberState.loading = false;
}

function switchTab(tab: TabType) {
  activeTab.value = tab;
  if (tab === "posts" && postState.list.length === 0) loadMorePosts();
  if (tab === "members" && memberState.list.length === 0) loadMoreMembers();
}

function onSearchConfirm() {
  if (activeTab.value === "posts") {
    resetPosts();
    loadMorePosts();
  } else {
    resetMembers();
    loadMoreMembers();
  }
}

function goPostDetail(postId: string) {
  uni.navigateTo({ url: `/pages/post/detail?id=${postId}` });
}

function goEditPost() {
  uni.navigateTo({ url: "/pages/post/edit-post" });
}

loadMorePosts();
</script>