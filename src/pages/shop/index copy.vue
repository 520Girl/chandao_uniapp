<template>
  <view class="flex flex-col min-h-screen h-screen theme-bg">
    <ShopBar :title="'静心甄选'" :leftIcon="'icon-shangcheng'" class="shrink-0" />
    <!-- 预留：顶部搜索/分类条样式（接入组件后可取消注释）
    <header class="sticky top-0 z-50 bg-[#f8f7f6] px-6 pt-6 pb-2">
      <view class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-extrabold tracking-tight text-[#201d12]">云息商城</h1>
        <view class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-[#d4af35]/10">
          <ShoppingBag :size="22" class="text-[#d4af35]" />
        </view>
      </view>
      <view class="relative mb-4">
        <Search :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af35]/60" />
        <input class="w-full bg-white border-none rounded-full py-3.5 pl-12 pr-4 shadow-sm text-sm" placeholder="搜索禅意好物..." />
      </view>
      <scroll-view scroll-x class="flex gap-3 pb-2 whitespace-nowrap">
        <view v-for="(cat, i) in categories" :key="cat" :class="['inline-block whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all mr-2', i === 0 ? 'bg-[#d4af35] text-white shadow-md shadow-[#d4af35]/20' : 'bg-white border border-[#d4af35]/10 text-[#d4af35]/80']">
          {{ cat }}
        </view>
      </scroll-view>
    </header>
    -->
    <main class="flex-1 min-h-0 flex flex-col px-6 pt-4 space-y-8">
      <!-- <view class="shrink-0">
        <input
          v-model="keyWord"
          class="w-full bg-white rounded-full py-3.5 px-4 pl-10 shadow-sm text-sm box-border"
          placeholder="搜索商品名称…"
          confirm-type="search"
          @confirm="resetAndLoad" />
      </view> -->
      <view v-if="listLoading && products.length === 0" class="flex-1 flex items-center justify-center text-sm text-on-surface-variant">
        加载中…
      </view>
      <view
        v-else-if="!listLoading && products.length === 0"
        class="flex-1 flex items-center justify-center text-sm text-on-surface-variant">
        暂无商品
      </view>
      <view v-else class="shop-list-host">
        <up-list
          class="shop-up-list"
          height="100%"
          :lower-threshold="120"
          :show-scrollbar="false"
          @scrolltolower="onProductScrollToLower">
          <up-list-item v-for="p in products" :key="p.id" :anchor="String(p.id)">
            <view
              class="group flex flex-col bg-white rounded-[80rpx] overflow-hidden shadow-md border border-transparent mb-6">
              <view class="relative aspect-[4/3] overflow-hidden">
                <image :src="p.mainImage || '/static/770-800x600.jpg'" class="w-full h-full" mode="aspectFill" />
                <view
                  v-if="productTag(p)"
                  class="absolute top-[32rpx] left-[32rpx] bg-theme-1 text-white text-[20rpx] uppercase tracking-widest font-bold px-[24rpx] py-[8rpx] rounded-full">
                  {{ productTag(p) }}
                </view>
              </view>
              <view class="p-[48rpx] flex flex-col gap-2">
                <view class="flex justify-between items-start">
                  <view class="flex-1 min-w-0 pr-2">
                    <h3 class="font-bold text-[36rpx] leading-tight">{{ p.name }}</h3>
                    <text class="theme-color-1 font-medium text-[28rpx] block">{{ productCat(p) }}</text>
                  </view>
                  <text class="text-[40rpx] font-bold shrink-0">¥ {{ formatPrice(p.price) }}</text>
                </view>
                <text class="text-[28rpx] theme-color-8 mt-[16rpx] line-clamp-2 block min-h-[2.5em]">{{
                  productDesc(p)
                }}</text>
                <view
                  class="mt-[32rpx] w-full bg-theme-13 text-[#d4af35] font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
                  @click="goToConfirm(p.id)">
                  <text>立即购买</text>
                  <text class="iconfont icon-jiarugouwuche text-[32rpx]" />
                </view>
              </view>
            </view>
          </up-list-item>
          <up-loadmore :status="loadStatus" line @loadmore="loadMoreProducts" />
        </up-list>
      </view>
    </main>
  </view>
</template>
<script setup lang="ts">
import { fetchShopProductPage } from '@/assets/js/api/shopProduct';
import ShopBar from '@/components/shopBar.vue';
import type { ShopProductListItem } from '@/types/api/shop';
import { unwrapApiPageList } from '@/utils/apiResponse';
import { navigateTo } from '@/utils/navigation';

/** 预留：与注释模板里分类条对应 */
const categories = ['全部', '香薰', '服饰', '科技', '健康'];

const onNavigate = (screen: string) => {
  navigateTo(screen);
};

type LoadMoreStatus = 'loadmore' | 'loading' | 'nomore';

const keyWord = ref('');
const products = ref<ShopProductListItem[]>([]);
const page = ref(1);
const listLoading = ref(false);
const loadFinished = ref(false);
const loadStatus = ref<LoadMoreStatus>('loadmore');

function formatPrice(n: number) {
  return (Number(n) || 0).toFixed(2);
}

/** 角标：当前无独立 tag 字段时由佣金标识推导，后续可改为后端 tag */
function productTag(p: ShopProductListItem) {
  if (Number(p.isCommission) === 1) return '佣金';
  return '';
}

/** 预留：分类副标题 */
function productCat(_p: ShopProductListItem) {
  return '';
}

/** 预留：商品描述文案 */
function productDesc(_p: ShopProductListItem) {
  return _p.intro;
}

async function fetchNextPage() {
  if (listLoading.value || loadFinished.value) return;
  listLoading.value = true;
  loadStatus.value = 'loading';
  try {
    const res = await fetchShopProductPage({
      page: page.value,
      size: 20,
      keyWord: keyWord.value.trim() || undefined
    });
    const list = unwrapApiPageList(res) as ShopProductListItem[];
    products.value.push(...list);
    if (list.length < 20) {
      loadFinished.value = true;
      loadStatus.value = 'nomore';
    } else {
      page.value += 1;
      loadStatus.value = 'loadmore';
    }
  } catch (e) {
    console.error('fetchShopProductPage', e);
    loadStatus.value = products.value.length ? 'nomore' : 'loadmore';
  } finally {
    listLoading.value = false;
  }
}

function onProductScrollToLower() {
  if (!loadFinished.value && !listLoading.value) {
    fetchNextPage();
  }
}

function loadMoreProducts() {
  if (loadStatus.value === 'loadmore' && !loadFinished.value && !listLoading.value) {
    fetchNextPage();
  }
}

function resetAndLoad() {
  page.value = 1;
  loadFinished.value = false;
  products.value = [];
  loadStatus.value = 'loading';
  fetchNextPage();
}

function goToConfirm(productId: number) {
  uni.navigateTo({ url: `/pages/shop/confirm-order?productId=${productId}` });
}

onMounted(() => {
  void categories;
  void onNavigate;
  resetAndLoad();
});
</script>
<style scoped>

.shop-list-host {
  flex: 1;
  min-height: 0;
  height: 0;
}

.shop-up-list {
  height: 100%;
}
</style>
