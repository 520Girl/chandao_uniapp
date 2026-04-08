<template>
    <view class="flex flex-col min-h-screen h-screen theme-bg cloud-pattern">
      <lcrBar :title="'消息中心'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
  
      <view class="flex-1 min-h-0 pb-12 px-6 mx-auto flex flex-col">
        <!-- Category Pill Navigation -->
        <view class="flex gap-3 mb-12 overflow-x-auto pb-2 no-scrollbar shrink-0">
          <view
            class="ddress-card flex-shrink-0 px-6 py-2.5 rounded-full bg-primary text-white text-[24rpx] font-label tracking-[0.1rem] transition-all duration-300 shadow-sm">
            系统消息
          </view>
          <view
            class="ddress-card flex-shrink-0 px-6 py-2.5 rounded-full theme-color-8 bg-[#f1efed] text-on-surface-variant text-[24rpx] font-label tracking-[0.1rem] hover:bg-outline/10 transition-all duration-300">
            互动提醒
          </view>
          <view
            class="ddress-card flex-shrink-0 px-6 py-2.5 rounded-full theme-color-8 bg-[#f1efed] text-on-surface-variant text-[24rpx] font-label tracking-[0.1rem] hover:bg-outline/10 transition-all duration-300">
            私信
          </view>
        </view>
  
        <!-- 实际消息列表：up-list 滚动加载 -->
        <view
          v-if="loading && messages.length === 0"
          class="flex-1 flex items-center justify-center text-sm text-on-surface-variant">
          加载中…
        </view>
        <view
          v-else-if="!loading && messages.length === 0"
          class="flex-1 flex items-center justify-center text-sm text-on-surface-variant">
          暂无消息
        </view>
        <view v-else class="message-list-host">
          <up-list
            class="message-up-list"
            height="100%"
            :lower-threshold="120"
            :show-scrollbar="true"
            @scrolltolower="onScrollToLower">
            <up-list-item v-for="m in messages" :key="m.id" :anchor="String(m.id)">
              <!-- 复用原来的卡片样式，只是内容绑定后端数据 -->
              <view class="group cursor-pointer" @click="gotoDetail(m.id)">
                <view class="flex items-start gap-4">
                  <view
                    class="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary shrink-0">
                    <text class="iconfont icon-notifications_active text-[45rpx]"></text>
                  </view>
                  <view class="flex-1 space-y-1">
                    <view class="flex justify-between items-baseline">
                      <view class="font-headline text-[36rpx] italic text-on-surface leading-tight">
                        {{ displayTitle(m) }}
                      </view>
                      <text class="font-label text-[20rpx] theme-color-8 text-outline uppercase">
                        {{ displayTime(m) }}
                      </text>
                    </view>
                    <view class="font-body text-[28rpx] theme-color-7 line-clamp-2 leading-relaxed">
                      {{ displaySummary(m) }}
                    </view>
                  </view>
                </view>
                <view class="message-viewider mt-6"></view>
              </view>
            </up-list-item>
            <up-loadmore :status="loadStatus" line @loadmore="loadMore" />
          </up-list>
        </view>
  
        <!-- 预留：静态示例卡片（完全保留你现在的 UI），不参与实际渲染 -->
        <view
          v-show="false"
          class="space-y-8 opacity-0 max-h-0 overflow-hidden pointer-events-none"
          aria-hidden="true">
          <!-- Message Item 1: System -->
          <view class="group cursor-pointer" @click="gotoDetail('1')">
            <view class="flex items-start gap-4">
              <view
                class="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary shrink-0">
                <text class="iconfont icon-notifications_active text-[45rpx]"></text>
              </view>
              <view class="flex-1 space-y-1">
                <view class="flex justify-between items-baseline">
                  <view class="font-headline text-[36rpx] italic text-on-surface leading-tight">系统通知</view>
                  <text class="font-label text-[20rpx] theme-color-8 text-outline uppercase">刚刚</text>
                </view>
                <view class="font-body text-[28rpx] theme-color-7 line-clamp-2 leading-relaxed">
                  您的禅修周报已经生成。在过去的一周里，您共坚持冥想 120 分钟，心灵宁静指数提升了 15%。
                </view>
              </view>
            </view>
            <view class="message-viewider mt-6"></view>
          </view>
          <!-- Message Item 2: Direct -->
          <view class="group cursor-pointer" @click="gotoDetail('2')">
            <view class="flex items-start gap-4">
              <view class="relative shrink-0">
                <img
                  alt="Portrait of a serene woman"
                  class="w-12 h-12 rounded-full object-cover grayscale opacity-70"
                  src="/static/770-800x600.jpg" />
                <view
                  class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background-light">
                </view>
              </view>
              <view class="flex-1 space-y-1">
                <view class="flex justify-between items-baseline">
                  <view class="font-headline text-lg italic text-on-surface leading-tight">林晚萤</view>
                  <text class="font-label text-[20rpx] theme-color-8 text-outline uppercase">2 小时前</text>
                </view>
                <view class="font-body text-[28rpx] theme-color-7 line-clamp-2 leading-relaxed italic">
                  “刚才在‘深呼吸’冥想室看到了你的分享，那段文字很有共鸣。”
                </view>
              </view>
            </view>
            <view class="message-viewider mt-6"></view>
          </view>
          <!-- Message Item 3/4/5 ... 这里保持你原来的三个块，直接复制就行 -->
        </view>
  
        <!-- Empty State Suggestion Footer -->
        <view class="mt-20 text-center opacity-40 shrink-0">
          <text class="iconfont icon-bx-spa text-4xl mb-4 theme-color-1 block text-outline"></text>
          <view class="font-body text-[20rpx] tracking-[0.3em] text-on-surface-variant uppercase">
            所有的声音 终将归于宁静
          </view>
        </view>
      </view>
    </view>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { navigateBack } from '@/utils/navigation';
  import lcrBar from '@/components/lcrBar.vue';
  import { post } from '@/assets/js/request';
  import type { MessageListItem, MessagePageDTO } from '@/types/api/message';
  import { unwrapApiPageList } from '@/utils/apiResponse';
  
  type LoadMoreStatus = 'loadmore' | 'loading' | 'nomore';
  
  const onBack = () => {
    navigateBack();
  };
  
  const messages = ref<MessageListItem[]>([]);
  const page = ref(1);
  const pageSize = 7;
  const loadStatus = ref<LoadMoreStatus>('loadmore');
  const loading = ref(false);
  const finished = ref(false);
  
  const fetchMessagePage = (body?: MessagePageDTO) => {
    return post('/app/message/page', body ?? {});
  };
  
  const displayTitle = (m: MessageListItem) => m.title || '系统通知';
  const displayTime = (m: MessageListItem) => m.sendTime || m.createTime;
  const displaySummary = (m: MessageListItem) => {
    if (m.content) return m.content;
    if (m.contentData && typeof m.contentData === 'object') {
      const obj = m.contentData as Record<string, unknown>;
      if (typeof obj.summary === 'string') return obj.summary;
    }
    return '';
  };
  
  async function loadPage(reset = false) {
    if (loading.value) return;
    if (!reset && finished.value) return;
  
    loading.value = true;
    if (reset) {
      page.value = 1;
      finished.value = false;
      messages.value = [];
    }
    loadStatus.value = 'loading';
    try {
      const res = await fetchMessagePage({ page: page.value, size: pageSize });
      const list = unwrapApiPageList(res) as MessageListItem[];
      messages.value = messages.value.concat(list);
      if (list.length < pageSize) {
        finished.value = true;
        loadStatus.value = 'nomore';
      } else {
        page.value += 1;
        loadStatus.value = 'loadmore';
      }
    } catch (e) {
      console.error('fetchMessagePage', e);
      loadStatus.value = messages.value.length ? 'nomore' : 'loadmore';
    } finally {
      loading.value = false;
    }
  }
  
  function onScrollToLower() {
    if (!finished.value && !loading.value) {
      loadPage(false);
    }
  }
  
  function loadMore() {
    if (loadStatus.value === 'loadmore' && !finished.value && !loading.value) {
      loadPage(false);
    }
  }
  
  const gotoDetail = (id: number | string) => {
    uni.navigateTo({
      url: `/pages/message/detail?id=${id}`,
    });
  };
  
  onShow(() => {
    loadPage(true);
  });
  </script>
  
  <style scoped lang="scss">
  .message-list-host {
    flex: 1;
    min-height: 0;
    height: 0;
  }
  .message-up-list {
    height: 100%;
  }
  </style>