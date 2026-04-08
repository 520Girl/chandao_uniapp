<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
    <lcrBar :title="'订单状态'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
    <view v-if="pageLoading" class="pt-16 text-center text-sm theme-color-6">加载中…</view>
    <view v-else-if="!detail" class="pt-16 text-center text-sm theme-color-6">订单不存在</view>
    <view v-else class="pt-6 pb-10 px-6 min-h-screen">
      <view class="mb-10 text-center">
        <view class="inline-flex items-center justify-center p-4 mb-5 rounded-full bg-primary/10">
          <text class="iconfont icon-Package-2 text-primary text-4xl" />
        </view>
        <h2 class="serif-text italic text-4xl font-bold tracking-tight mb-2 text-[#333]">
          {{ shopOrderStatusText(detail.status) }}
        </h2>
        <view class="theme-color-6 font-label tracking-widest uppercase text-[11px]">
          订单编号: {{ detail.orderNo }}
        </view>
      </view>
      <view class="mb-8 p-5 rounded-2xl bg-white shadow-sm border border-primary/5">
        <view class="flex items-center gap-3 mb-4">
          <view class="bg-primary/10 p-2 rounded-full">
            <text class="iconfont icon-MapPin text-primary text-xl" />
          </view>
          <view class="font-label font-bold text-sm tracking-wide text-[#333]">收货地址</view>
        </view>
        <view class="space-y-1 pl-12">
          <view class="font-bold text-base text-[#333]">{{ detail.contact || '—' }}</view>
          <view class="theme-color-6 text-sm leading-relaxed">
            {{ fullAddressLine }}
          </view>
          <view v-if="detail.phone" class="theme-color-6 text-sm mt-2 font-medium">
            {{ displayPhone(detail.phone) }}
          </view>
        </view>
      </view>
      <view class="mb-8 bg-white rounded-2xl p-5 shadow-sm border border-primary/5">
        <view class="text-sm font-bold theme-color-6 mb-4 uppercase tracking-wider">订单内容</view>
        <view class="space-y-6">
          <view class="flex gap-4">
            <view class="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
              <image
                class="w-full h-full object-cover"
                :src="detail.productImage || '/static/770-800x600.jpg'"
                mode="aspectFill" />
            </view>
            <view class="flex-1 flex flex-col justify-between py-0.5 min-w-0">
              <view>
                <view class="font-medium text-base text-[#333]">{{ detail.productName || '商品' }}</view>
                <view class="theme-color-6 text-xs mt-1 min-h-[1em]">{{ orderGoodsSpecLine }}</view>
                <view v-if="detail.remark" class="theme-color-6 text-xs mt-1">备注：{{ detail.remark }}</view>
              </view>
              <view class="flex justify-between items-end">
                <text class="font-bold text-primary">¥ {{ formatPrice(detail.productPrice ?? detail.price) }}</text>
                <text class="theme-color-6 text-sm">x 1</text>
              </view>
            </view>
          </view>
          <!-- 预留：第二件商品行（多明细订单） -->
          <view
            v-show="false"
            class="flex gap-4 opacity-0 max-h-0 overflow-hidden pointer-events-none"
            aria-hidden="true">
            <view class="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
              <image
                class="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy-Yv7uBez2VtJAJWwblg48i5wda27OpOv_qNsnn0cLMSU8qk1uBT8Lv7v1O59fQlcckmvGEzadoMzYGfgeN-ueCp1E7Ka64NqsQRhoeizBeS5EUH3JxS_AZw6cmV0vAWCuhElQ1Pt8mjw1pht62oRbrr64tt-WaJSDro1m5dHYHJ5QAzhhkN7R2yZ9sRO04RxOPCPhQ33Tf3KN6VXUIntmJEwhM0oaeQkiAFtX0BfOZ-1LB1-5zBZnvqY7aif6SOABrC26RgPYVYz"
                mode="aspectFill" />
            </view>
            <view class="flex-1 flex flex-col justify-between py-0.5">
              <view>
                <view class="font-medium text-base text-[#333]">檀木沉静香薰蜡烛</view>
                <view class="theme-color-6 text-xs mt-1">规格: 250g / 森林香调</view>
              </view>
              <view class="flex justify-between items-end">
                <text class="font-bold text-primary">¥ 360.00</text>
                <text class="theme-color-6 text-sm">x 2</text>
              </view>
            </view>
          </view>
        </view>
        <view v-if="detail.logisticsNo" class="mt-4 text-xs theme-color-6">
          物流单号：{{ detail.logisticsNo }}
        </view>
      </view>
      <view class="mb-10 px-1">
        <view class="space-y-3">
          <view class="flex justify-between items-center text-sm">
            <text class="theme-color-6">商品小计</text>
            <text class="font-medium text-[#333]">¥ {{ formatPrice(detail.productPrice ?? detail.price) }}</text>
          </view>
          <view class="flex justify-between items-center text-sm">
            <text class="theme-color-6">运费</text>
            <text class="font-medium text-[#333]">¥ 0.00</text>
          </view>
          <view class="flex justify-between items-center text-sm text-primary">
            <text>优惠减免</text>
            <text class="font-medium">- ¥ {{ placeholderOrderDiscount }}</text>
          </view>
          <view class="pt-4 mt-4 border-t border-dashed border-gray-200 flex justify-between items-baseline">
            <text class="text-xs theme-color-6 font-medium">应付总额</text>
            <view class="flex items-baseline gap-1">
              <text class="text-sm text-primary font-bold">¥</text>
              <text class="text-2xl text-primary font-bold tracking-tighter">{{ formatPrice(detail.price) }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="space-y-4">
        <button
          class="w-full py-4 rounded-full bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          @click="onContactService">
          <text class="iconfont icon-kefu text-xl" />
          联系在线客服
        </button>
        <button
          v-if="canCancel"
          class="w-full py-4 rounded-full bg-white border border-gray-200 theme-color-6 font-medium text-base transition-colors hover:bg-gray-50 active:scale-95"
          :disabled="cancelLoading"
          @click="onCancelOrder">
          {{ cancelLoading ? '处理中…' : '取消订单' }}
        </button>
      </view>
      <view class="mt-12 text-center">
        <view class="text-[10px] uppercase tracking-[0.2em] theme-color-6 font-label">
          下单时间: {{ detail.createTime }}
        </view>
        <view class="text-[10px] uppercase tracking-[0.2em] theme-color-6 font-label mt-1">
          支付方式: {{ placeholderPayMethod }}
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { cancelShopOrder, fetchShopOrderDetail } from '@/assets/js/api/shopOrder';
import lcrBar from '@/components/lcrBar.vue';
import type { ShopOrderDetail } from '@/types/api/shop';
import { unwrapApiData } from '@/utils/apiResponse';
import { navigateBack } from '@/utils/navigation';
import { shopOrderStatusText } from '@/utils/shopOrder';

const orderId = ref(0);
const detail = ref<ShopOrderDetail | null>(null);
const pageLoading = ref(true);
const cancelLoading = ref(false);

/** 预留：优惠金额、支付方式展示，接入支付/营销后替换 */
const placeholderOrderDiscount = '0.00';
const placeholderPayMethod = '微信支付';

/** 预留：规格副标题 */
const orderGoodsSpecLine = computed(() => '');

const fullAddressLine = computed(() => {
  const d = detail.value;
  if (!d) return '';
  const parts = [d.province, d.city, d.district, d.detailAddress].filter(Boolean);
  return parts.join(' ') || '—';
});

/** 待付款等可尝试取消，状态码以后端为准 */
const canCancel = computed(() => {
  const s = detail.value?.status;
  return s === 0 || s === 1;
});

function formatPrice(n: number) {
  return (Number(n) || 0).toFixed(2);
}

function displayPhone(phone: string) {
  const p = phone.replace(/\s/g, '');
  return p.replace(/^(\d{3})\d{4}(\d{4})$/, '$1 **** $2');
}

async function loadDetail() {
  if (!orderId.value) {
    pageLoading.value = false;
    return;
  }
  pageLoading.value = true;
  try {
    const res = await fetchShopOrderDetail({ id: orderId.value });
    const data = unwrapApiData<ShopOrderDetail>(res);
    detail.value = data && typeof data === 'object' && 'id' in data ? data : null;
  } catch (e) {
    console.error('fetchShopOrderDetail', e);
    detail.value = null;
  } finally {
    pageLoading.value = false;
  }
}

function onContactService() {
  uni.showToast({ title: '客服入口待接入', icon: 'none' });
}

function onCancelOrder() {
  if (!detail.value) return;
  uni.showModal({
    title: '提示',
    content: '确定取消该订单吗？',
    success: async (res) => {
      if (!res.confirm) return;
      cancelLoading.value = true;
      try {
        await cancelShopOrder({ id: detail.value!.id });
        uni.showToast({ title: '已取消', icon: 'success' });
        await loadDetail();
      } catch (e) {
        console.error('cancelShopOrder', e);
      } finally {
        cancelLoading.value = false;
      }
    }
  });
}

const onBack = () => navigateBack();

onLoad((options) => {
  orderId.value = Number(options?.id || 0);
  loadDetail();
});
</script>
<style scoped lang="scss"></style>
