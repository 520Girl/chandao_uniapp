<template>
  <view class="flex flex-col min-h-screen h-screen theme-bg cloud-pattern">
    <lcrBar
      :title="'我的订单'"
      :leftIcon="'icon-arrow-left'"
      :handleClick="onBack"
      :type="'all'"
      class="shrink-0" />
    <view class="flex-1 min-h-0 flex flex-col px-6 pt-6 pb-6">
      <!-- Page Title & Atmosphere -->
      <view class="mb-8 mt-4">
        <view class="font-label text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1">Ethereal Archive</view>
        <h2 class="font-headline text-4xl font-light text-[#333333] italic">我的订单</h2>
      </view>
      <!-- 预留：原横向 Pill 筛选（无滚动容器版），需要时可与下方 scroll-view 二选一
      <view class="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar">
        <view class="px-5 py-2 rounded-full bg-theme-1 text-white text-sm font-medium whitespace-nowrap shadow-sm shadow-primary/20">全部</view>
        <view class="px-5 py-2 rounded-full bg-theme-13 text-gray-500 text-sm whitespace-nowrap hover:bg-primary/10 transition-colors">待付款</view>
        <view class="px-5 py-2 rounded-full bg-theme-13 text-gray-500 text-sm whitespace-nowrap hover:bg-primary/10 transition-colors">待收货</view>
        <view class="px-5 py-2 rounded-full bg-theme-13 text-gray-500 text-sm whitespace-nowrap hover:bg-primary/10 transition-colors">已完成</view>
      </view>
      -->
      <scroll-view
        scroll-x
        class="order-status-tabs-scroll mb-8 whitespace-nowrap"
        enable-flex
        :show-scrollbar="false">
        <view class="flex flex-row items-center gap-2 pb-1">
          <view
            v-for="tab in statusTabs"
            :key="tab.label"
            class="px-5 py-2 rounded-full text-sm whitespace-nowrap shrink-0 transition-colors"
            :class="
              activeStatus === tab.value
                ? 'bg-theme-1 text-white font-medium shadow-sm shadow-primary/20'
                : 'bg-theme-13 text-gray-500'
            "
            @click="onTabChange(tab.value)">
            {{ tab.label }}
          </view>
        </view>
      </scroll-view>
      <view
        v-if="listLoading && orders.length === 0"
        class="flex-1 flex items-center justify-center text-sm text-on-surface-variant">
        加载中…
      </view>
      <view
        v-else-if="!listLoading && orders.length === 0"
        class="flex-1 flex items-center justify-center text-sm text-on-surface-variant">
        暂无订单
      </view>
      <view v-else class="order-list-host">
        <up-list
          class="order-up-list"
          height="100%"
          :lower-threshold="120"
          :show-scrollbar="false"
          @scrolltolower="onOrderScrollToLower">
          <up-list-item v-for="item in orders" :key="item.id" :anchor="String(item.id)">
            <view
              class="glass-card rounded-2xl p-5 shadow-sm bg-[#ffffff80] mb-4"
              @click="goToOrderDetail(item.id)">
              <view class="flex justify-between items-start mb-4">
                <text class="text-[20rpx] font-bold tracking-widest text-gray-400">订单 #{{ item.orderNo }}</text>
                <text
                  class="px-2 py-0.5 rounded bg-primary/10 text-primary text-[25rpx] font-medium uppercase"
                  :class="[item.status != 5 ? 'bg-gray-100 text-gray-400' : 'bg-primary/5 text-primary']">
                  {{ shopOrderStatusText(item.status) }}
                </text>
              </view>
              <view class="flex gap-4 mb-5">
                <view class="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <image
                    class="w-full h-full object-cover"
                    :src="item.productImage || '/static/770-800x600.jpg'"
                    mode="aspectFill" />
                </view>
                <view class="flex-1 flex flex-col justify-center min-w-0">
                  <view class="font-medium text-base text-[#333333] mb-0.5 truncate">
                    {{ item.productName || '商品' }}
                  </view>
                  <view class="text-gray-400 text-xs mb-2 min-h-[1em]">{{ orderSubtitle(item) }}</view>
                  <view class="flex items-baseline gap-0.5">
                    <text class="text-primary font-medium text-sm">¥</text>
                    <text class="text-primary font-bold text-xl tracking-tighter">
                      {{ formatPrice(item.price) }}
                    </text>
                  </view>
                </view>
              </view>
              <view class="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <view
                  class="px-4 py-2 rounded-full border border-gray-100 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
                  @click.stop="goToOrderDetail(item.id)">
                  查看详情
                </view>
              </view>
            </view>
          </up-list-item>
          <up-loadmore :status="loadStatus" line @loadmore="loadMoreOrders" />
        </up-list>
      </view>
      <!-- 预留：静态示例卡片样式（无数据时可对照恢复） -->
      <view
        v-show="false"
        class="shrink-0 space-y-4 opacity-0 max-h-0 overflow-hidden pointer-events-none"
        aria-hidden="true">
        <view class="glass-card rounded-2xl p-5 shadow-sm bg-[#ffffff80]">
          <view class="flex justify-between items-start mb-4">
            <text class="text-[10px] font-label tracking-widest text-gray-400">Order #29381</text>
            <text class="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium uppercase">Delivered</text>
          </view>
          <view class="flex gap-4 mb-5">
            <view class="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              <image
                class="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM4kHmYkkVm-FoSwDaRRrCCNlhg2MnEISHfmOf-SkGMwsDVLGQeabilwJH403IQkfcsKN_PG2prXBSePJSnDUziQVFpAoGh6svYZQ1ZScHVlTVxkX0HT99BHtv1pdtxRDGTTfBgk9zXZIFJB0jwS_3LVs3LmeNxxydrF-uJW89WhR5q_o4W8Qn55M0adRFJUAIPecEMMSqpJbqQEWM4dIhDB9htYilqvXJNMbnbA9F2a7XqJg4Q_IIlOUV03HZoE3EmLc4w0Je453L"
                mode="aspectFill" />
            </view>
            <view class="flex-1 flex flex-col justify-center">
              <view class="font-medium text-base text-[#333333] mb-0.5">High Mountain Longjing</view>
              <view class="text-gray-400 text-xs mb-2">狮峰龙井 · 2024头采</view>
              <view class="flex items-baseline gap-0.5">
                <text class="text-primary font-medium text-sm">¥</text>
                <text class="text-primary font-bold text-xl tracking-tighter">1,280.00</text>
              </view>
            </view>
          </view>
          <view class="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <view class="px-4 py-2 rounded-full border border-gray-100 text-xs text-gray-500">查看详情</view>
            <view class="px-4 py-2 rounded-full bg-primary text-xs text-white font-bold shadow-sm shadow-primary/10">
              再次购买
            </view>
          </view>
        </view>
        <view class="glass-card rounded-2xl p-5 shadow-sm">
          <view class="flex justify-between items-start mb-4">
            <text class="text-[10px] font-label tracking-widest text-gray-400 uppercase">Order #29342</text>
            <text class="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium uppercase">Shipped</text>
          </view>
          <view class="flex gap-4 mb-5">
            <view class="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              <image
                class="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF7HwQFAha11CNXHw9RZuoiXmRPgK0wmqtpSLiucfAKX6YHaXgmswgdUgVfc9Hu-5Wjl-MbHXTwZ-a8VCRkL97CmiYdmb7adlh5GhjrrIrriJuXhVuzm6ArdYWaRCeCBNmh2G2LCptNMwShQijDKK49xzSX8GH3C_put0mYe8y6hmZAvGLil0YtFdIe9zkzwQM-NU590HQ9wMrTGqCxAx6t7Jtqw6KxuRej5knwy_UxIj5p6oM-YuBm6IEirjz_LNBvCIXAsvNlp9U"
                mode="aspectFill" />
            </view>
            <view class="flex-1 flex flex-col justify-center">
              <view class="font-medium text-base text-[#333333] mb-0.5">Vintage Pu'er Cake</view>
              <view class="text-gray-400 text-xs mb-2">陈年普洱 · 2012熟饼</view>
              <view class="flex items-baseline gap-0.5">
                <text class="text-primary font-medium text-sm">¥</text>
                <text class="text-primary font-bold text-xl tracking-tighter">2,560.00</text>
              </view>
            </view>
          </view>
          <view class="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <view class="px-4 py-2 rounded-full border border-gray-100 text-xs text-gray-500">追踪物流</view>
          </view>
        </view>
        <view class="glass-card rounded-2xl p-5 shadow-sm opacity-90">
          <view class="flex justify-between items-start mb-4">
            <text class="text-[10px] font-label tracking-widest text-gray-400 uppercase">Order #28912</text>
            <text class="px-2 py-0.5 rounded bg-gray-100 text-gray-400 text-[10px] font-medium uppercase">Archived</text>
          </view>
          <view class="flex gap-4 mb-5">
            <view class="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              <image
                class="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuARzDnIf_Y3es8dlzPn6So4X50_k_ef95nutnmfe7gCD2XSy72CO6mbTc_X4BLy8KOMlV1v0WSz0CLEIyBWsGoGBoyMShGqx2DxOaeKCu2ma54L33QgTm9Xq7jwna3qUM_hxRIMFcKBkOG5zzSMnQrIlmAIVbGTUPK2LOI1dlXHAniyYB3eWeEKtmZ180jK0ho-olf7CNGHNWrjGD-i5jpJCvm0wqDbAm3K388ozfvSJ4wkrTtRhbvduI1zCmVgYYnpPDBUBw36H-UZ"
                mode="aspectFill" />
            </view>
            <view class="flex-1 flex flex-col justify-center">
              <view class="font-medium text-base text-[#333333] mb-0.5">Hand-crafted Teapot</view>
              <view class="text-gray-400 text-xs mb-2">手工紫砂壶 · 石瓢式</view>
              <view class="flex items-baseline gap-0.5">
                <text class="text-primary font-medium text-sm">¥</text>
                <text class="text-primary font-bold text-xl tracking-tighter">3,800.00</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { fetchShopOrderPage } from '@/assets/js/api/shopOrder';
import lcrBar from '@/components/lcrBar.vue';
import type { ShopOrderListItem } from '@/types/api/shop';
import { unwrapApiPageList } from '@/utils/apiResponse';
import { navigateBack } from '@/utils/navigation';
import { shopOrderStatusText } from '@/utils/shopOrder';

type LoadMoreStatus = 'loadmore' | 'loading' | 'nomore';

const statusTabs: { label: string; value: number | null }[] = [
  { label: '全部', value: null },
  { label: '待付款', value: 0 },
  { label: '待发货', value: 1 },
  { label: '待收货', value: 2 },
  { label: '已完成', value: 3 }
];

const activeStatus = ref<number | null>(null);
const orders = ref<ShopOrderListItem[]>([]);
const page = ref(1);
const listLoading = ref(false);
const loadFinished = ref(false);
const loadStatus = ref<LoadMoreStatus>('loadmore');

function formatPrice(n: number) {
  return (Number(n) || 0).toFixed(2);
}

/** 预留：列表副标题（规格/卖点），接口有字段后在此拼接 */
function orderSubtitle(_item: ShopOrderListItem) {
  return '';
}

async function fetchNextPage() {
  if (listLoading.value || loadFinished.value) return;
  listLoading.value = true;
  loadStatus.value = 'loading';
  try {
    const body: { page: number; size: number; status?: number } = {
      page: page.value,
      size: 3
    };
    if (activeStatus.value !== null) body.status = activeStatus.value;
    const res = await fetchShopOrderPage(body);
    const list = unwrapApiPageList(res) as ShopOrderListItem[];
    orders.value.push(...list);
    if (list.length < 3) {
      loadFinished.value = true;
      loadStatus.value = 'nomore';
    } else {
      page.value += 1;
      loadStatus.value = 'loadmore';
    }
  } catch (e) {
    console.error('fetchShopOrderPage', e);
    loadStatus.value = orders.value.length ? 'nomore' : 'loadmore';
  } finally {
    listLoading.value = false;
  }
}

function onOrderScrollToLower() {
  if (!loadFinished.value && !listLoading.value) {
    fetchNextPage();
  }
}

function loadMoreOrders() {
  if (loadStatus.value === 'loadmore' && !loadFinished.value && !listLoading.value) {
    fetchNextPage();
  }
}

function resetAndLoad() {
  page.value = 1;
  loadFinished.value = false;
  orders.value = [];
  loadStatus.value = 'loading';
  fetchNextPage();
}

function onTabChange(v: number | null) {
  activeStatus.value = v;
  resetAndLoad();
}

function goToOrderDetail(id: number) {
  uni.navigateTo({ url: `/pages/shop/order-detail?id=${id}` });
}

const onBack = () => navigateBack();

onMounted(() => {
  resetAndLoad();
});
</script>
<style scoped lang="scss">
/* H5：横向 scroll-view 的滚动条在内层 div，需显式隐藏（小程序等同理配合 show-scrollbar） */
.order-status-tabs-scroll :deep(.uni-scroll-view-scrollbar-hidden) {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.order-status-tabs-scroll :deep(.uni-scroll-view-scrollbar-hidden::-webkit-scrollbar) {
  display: none;
  width: 0;
  height: 0;
}

.order-list-host {
  flex: 1;
  min-height: 0;
  height: 0;
}

.order-up-list {
  height: 100%;
}
</style>
