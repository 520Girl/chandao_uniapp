<template>
  <view class="flex flex-col min-h-screen theme-bg pb-32">
    <IcrBar :title="'确认订单'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" type="all" />
    <view v-if="pageLoading" class="px-4 py-16 text-center text-sm text-on-surface-variant">加载中…</view>
    <view v-else class="max-w-2xl px-4 space-y-6">
      <!-- Delivery Method Selector -->
      <view class="flex p-[8rpx] bg-theme-13 rounded-full">
        <view
          class="flex-1 text-center border-0 border-[#fff] py-[16rpx] text-[28rpx] font-semibold rounded-full bg-white shadow-sm theme-color-1">
          快递配送
        </view>
        <view class="flex-1 text-center border-0 border-[#fff] py-[16rpx] text-[28rpx] font-semibold rounded-full">
          到店自提
        </view>
      </view>
      <!-- Shipping Address -->
      <view class="bg-white rounded-2xl p-[40rpx] shadow-sm border border-primary/5">
        <view class="flex items-start gap-4" @click="goListAddress">
          <view class="p-2 rounded-full bg-theme-13">
            <text class="iconfont icon-MapPin text-[48rpx] theme-color-1" />
          </view>
          <view class="flex-1">
            <template v-if="currentAddress">
              <view class="flex items-center gap-2 mb-1">
                <text class="font-bold theme-color-5 text-[32rpx]">{{ currentAddress.contact }}</text>
                <text class="text-[28rpx] theme-color-6">{{ displayPhone(currentAddress.phone) }}</text>
              </view>
              <view class="text-[28rpx] theme-color-5 leading-relaxed">
                {{ addressRegionLine(currentAddress) }} {{ currentAddress.address }}
              </view>
            </template>
            <view v-else class="text-[28rpx] theme-color-6">请选择收货地址</view>
          </view>
          <view class="text-gray-400 hover:text-primary transition-colors self-center">
            <text class="iconfont icon-jinru text-[30rpx]" />
          </view>
        </view>
        <view
          class="mt-4 pt-4 border-t border-dashed border-gray-100 dark:border-white/10 flex items-center justify-between">
          <text class="text-[24rpx] theme-color-1 font-medium px-[16rpx] py-[4rpx] bg-theme-13 rounded">
            {{ currentAddress?.isDefault ? '默认地址' : currentAddress ? '已选择地址' : '未选择' }}
          </text>
          <text class="text-[24rpx] theme-color-6">收货时间：工作日/周末均可</text>
        </view>
      </view>
      <!-- Product Details -->
      <view class="bg-white dark:bg-white/5 rounded-2xl p-[40rpx] shadow-sm border border-primary/5">
        <view class="text-[24rpx] font-bold theme-color-6 mb-[32rpx] uppercase tracking-wider">商品清单</view>
        <view class="space-y-6">
          <view v-if="product" class="flex gap-4">
            <view class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <image
                class="w-full h-full object-cover"
                :src="product.mainImage || '/static/770-800x600.jpg'"
                mode="aspectFill" />
            </view>
            <view class="flex-1 flex flex-col justify-between py-0.5">
              <view>
                <view class="font-medium text-[28rpx] theme-color-5 mb-[8rpx]">{{ product.name }}</view>
                <view class="text-[24rpx] theme-color-6">规格 ：40支装</view>
              </view>
              <view class="flex justify-between items-end">
                <text class="theme-color-5 text-[32rpx] font-bold">¥ {{ formatPrice(product.price) }}</text>
                <text class="text-[24rpx] theme-color-6">x 1</text>
              </view>
            </view>
          </view>
          <!-- 预留：第二件商品行样式（多件订单时接入 v-for） -->
          <view
            v-show="false"
            class="flex gap-4 opacity-0 max-h-0 overflow-hidden pointer-events-none"
            aria-hidden="true">
            <view class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <image
                class="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsFlP37iiHN7ZlZjTsUpwcLBagVN60xDdxkuyhR0TjE0nLIdJ1g24p8uGT87F6NDhxo49ffoa7I9AnV6ux-AKl8k9wn6hsyjDFC3QINL9T4D-8Rvl63MwXsQwRZRP8Lr9SogtKgyKbYoZyPsjw55tg-iz2mlxy1izwuCbqLRTC0nTGF4mC9k6c1sLqv2EcmIuV3oKG_peG-XF7pQCUxtfsj76jnpwqsSK_Xq6D4YtB2GTmq9quvNZgtaUsJpjdQB7z_jw4vwKYLdLY"
                mode="aspectFill" />
            </view>
            <view class="flex-1 flex flex-col justify-between py-0.5">
              <view>
                <view class="font-medium text-[28rpx] theme-color-5 mb-[8rpx]">老山檀香 · 沉静如水</view>
                <view class="text-[24rpx] theme-color-6">规格：40支装</view>
              </view>
              <view class="flex justify-between items-end">
                <text class="theme-color-5 text-[32rpx] font-bold">¥ 128.00</text>
                <text class="text-[24rpx] theme-color-6">x 2</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- Options: Coupons & Shipping & 备注 -->
      <view class="bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-primary/5">
        <view class="viewide-y viewide-gray-50 dark:viewide-white/5">
          <view
            class="w-full flex items-center justify-between p-[40rpx] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <view class="flex items-center gap-3">
              <text class="iconfont icon-youhuijuan text-[46rpx] theme-color-1" />
              <text class="text-[28rpx] font-medium">优惠券</text>
            </view>
            <view class="flex items-center gap-1">
              <text class="text-[24rpx] text-primary">-¥ {{ placeholderDiscount }}</text>
              <text class="iconfont icon-jinru text-gray-300" />
            </view>
          </view>
          <view
            class="w-full flex items-center justify-between p-[40rpx] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <view class="flex items-center gap-3">
              <text class="iconfont icon-navicon-chps text-primary text-[46rpx] theme-color-1" />
              <text class="text-[28rpx] font-medium">配送方式</text>
            </view>
            <view class="flex items-center gap-1">
              <text class="text-[24rpx] text-gray-500">顺丰包邮</text>
              <text class="iconfont icon-jinru text-gray-300" />
            </view>
          </view>
          <view class="p-[40rpx] flex items-center gap-3">
            <text class="iconfont icon-beizhu text-primary text-[34rpx] theme-color-1" />
            <text class="text-[28rpx] font-medium flex-shrink-0">备注信息</text>
            <input
              v-model="remark"
              class="flex-1 text-[24rpx] bg-transparent border-none focus:ring-0 placeholder:text-gray-300 p-0"
              placeholder="如有特殊要求请留言"
              type="text" />
          </view>
        </view>
      </view>
      <!-- Payment Methods（预留接入支付） -->
      <view class="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-primary/5">
        <view class="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">支付方式</view>
        <view class="space-y-4">
          <label class="flex items-center justify-between cursor-pointer group">
            <view class="flex items-center gap-3">
              <view class="w-[64rpx] h-[64rpx] rounded-full bg-theme-13 flex items-center justify-center">
                <text class="w-5 h-5 iconfont icon-weixin1 text-[#07C160] text-[40rpx]" />
              </view>
              <text class="text-sm font-medium">微信支付</text>
            </view>
            <input
              class="w-5 h-5 text-primary bg-theme-1 rounded-full border-gray-200 focus:ring-primary/20"
              name="payment"
              type="radio" />
          </label>
          <label class="flex items-center justify-between cursor-pointer group">
            <view class="flex items-center gap-3">
              <view class="w-[64rpx] h-[64rpx] rounded-full bg-theme-13 flex items-center justify-center">
                <text class="iconfont icon-creditcard theme-color-1 text-[32rpx]" />
              </view>
              <view>
                <text class="text-[28rpx] font-medium block">余额支付</text>
                <text class="text-[20rpx] text-gray-400">当前余额: ¥ {{ placeholderBalance }}</text>
              </view>
            </view>
            <input
              class="w-5 h-5 text-primary border-gray-200 focus:ring-primary/20"
              name="payment"
              type="radio" />
          </label>
        </view>
      </view>
      <!-- Bill Summary -->
      <view class="space-y-2 px-1">
        <view class="flex justify-between text-[28rpx] text-gray-500">
          <text>商品小计</text>
          <text>¥ {{ formatPrice(product?.price ?? 0) }}</text>
        </view>
        <view class="flex justify-between text-[28rpx] text-gray-500">
          <text>运费</text>
          <text>¥ 0.00</text>
        </view>
        <view class="flex justify-between text-[28rpx] theme-color-1">
          <text>优惠扣减</text>
          <text>-¥ {{ placeholderDiscount }}</text>
        </view>
      </view>
    </view>
    <!-- Bottom Action Bar -->
    <view
      class="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-lg border-t border-gray-100 dark:border-white/5 pb-8 pt-4 px-6 z-50">
      <view class="max-w-2xl mr-auto flex items-center justify-between">
        <view class="flex flex-col">
          <text class="text-[24rpx] theme-color-6 font-medium">实付金额</text>
          <view class="flex items-baseline gap-1">
            <text class="text-[48rpx] theme-color-1 font-bold">¥</text>
            <text class="text-[48rpx] theme-color-1 font-bold tracking-tighter">
              {{ formatPrice(payableAmount) }}
            </text>
          </view>
        </view>
        <view class="flex items-center justify-end">
          <button
            class="bg-theme-1 ml-auto hover:bg-primary/90 text-white px-10 py-3.5 rounded-full font-bold text-base shadow-lg shadow-primary/20 active:scale-95 transition-all"
            :disabled="submitLoading || !product || !currentAddress"
            @click="onSubmitOrder">
            {{ submitLoading ? '提交中…' : '立即下单' }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { createShopOrder } from '@/assets/js/api/shopOrder';
import { fetchShopProductInfo } from '@/assets/js/api/shopProduct';
import { fetchUserAddressList } from '@/assets/js/api/userAddress';
import IcrBar from '@/components/lcrBar.vue';
import type { ShopProduct } from '@/types/api/shop';
import type { UserAddress } from '@/types/api/userAddress';
import { unwrapApiData, unwrapApiList } from '@/utils/apiResponse';
import { navigateBack } from '@/utils/navigation';

const ORDER_SELECTED_ADDRESS_ID_KEY = 'shop_selected_address_id';

/** 预留：优惠券/余额展示占位，接入营销接口后改为计算值 */
const placeholderDiscount = '0.00';
const placeholderBalance = '2,540.00';

const productId = ref(0);
const product = ref<ShopProduct | null>(null);
const addressList = ref<UserAddress[]>([]);
const selectedAddressId = ref<number | null>(null);
const remark = ref('');
const pageLoading = ref(true);
const submitLoading = ref(false);

const currentAddress = computed(() => {
  if (!addressList.value.length) return null;
  if (selectedAddressId.value != null) {
    const matched = addressList.value.find((x) => x.id === selectedAddressId.value);
    if (matched) return matched;
  }
  return addressList.value.find((x) => x.isDefault) || addressList.value[0] || null;
});

/** 实付：当前无券逻辑，与商品价一致，占位优惠接入后在此扣减 */
const payableAmount = computed(() => product.value?.price ?? 0);

function formatPrice(n: number) {
  return (Number(n) || 0).toFixed(2);
}

function displayPhone(phone: string) {
  const p = phone.replace(/\s/g, '');
  return p.replace(/^(\d{3})\d{4}(\d{4})$/, '$1 **** $2');
}

function addressRegionLine(a: UserAddress) {
  return [a.province, a.city, a.district].filter(Boolean).join(' ');
}

function goListAddress() {
  const sid = currentAddress.value?.id ?? '';
  uni.navigateTo({ url: `/pages/shop/list-address?mode=select&selectedId=${sid}` });
}

async function loadPage() {
  if (!productId.value) {
    pageLoading.value = false;
    return;
  }
  pageLoading.value = true;
  try {
    const [pRes, aRes] = await Promise.all([
      fetchShopProductInfo({ id: productId.value }),
      fetchUserAddressList({})
    ]);
    const pdata = unwrapApiData<ShopProduct>(pRes);
    product.value = pdata && typeof pdata === 'object' && 'id' in pdata ? pdata : null;
    addressList.value = unwrapApiList(aRes) as UserAddress[];
    const stored = uni.getStorageSync(ORDER_SELECTED_ADDRESS_ID_KEY) as number | undefined;
    selectedAddressId.value = stored || null;
    if (selectedAddressId.value == null) {
      const def = addressList.value.find((x) => x.isDefault) || addressList.value[0];
      selectedAddressId.value = def?.id ?? null;
    }
  } catch (e) {
    console.error('confirm-order load', e);
    product.value = null;
  } finally {
    pageLoading.value = false;
  }
}

async function onSubmitOrder() {
  if (!product.value || !currentAddress.value) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' });
    return;
  }
  submitLoading.value = true;
  try {
    const res = await createShopOrder({
      productId: product.value.id,
      addressId: currentAddress.value.id,
      remark: remark.value.trim() || undefined
    });
    const data = unwrapApiData<{ orderNo?: string }>(res);
    const orderNo = data && typeof data === 'object' ? data.orderNo : '';
    uni.showToast({ title: orderNo ? `下单成功 ${orderNo}` : '下单成功', icon: 'success' });
    setTimeout(() => {
      uni.redirectTo({ url: '/pages/shop/order' });
    }, 400);
  } catch (e) {
    console.error('createShopOrder', e);
  } finally {
    submitLoading.value = false;
  }
}

const onBack = () => navigateBack();

onLoad((options) => {
  productId.value = Number(options?.productId || 0);
});

onShow(() => {
  const stored = uni.getStorageSync(ORDER_SELECTED_ADDRESS_ID_KEY) as number | undefined;
  if (stored != null) selectedAddressId.value = stored;
  if (product.value && productId.value) {
    fetchUserAddressList({})
      .then((aRes) => {
        addressList.value = unwrapApiList(aRes) as UserAddress[];
      })
      .catch((e) => console.error('fetchUserAddressList', e));
  }
});

onMounted(() => {
  if (productId.value) {
    loadPage();
  } else {
    pageLoading.value = false;
  }
});
</script>
