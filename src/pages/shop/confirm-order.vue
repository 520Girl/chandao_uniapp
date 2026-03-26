

<template>
  <view class="flex flex-col min-h-screen theme-bg pb-32">
   <IcrBar :title="'确认订单'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" type="'all'" />
    <view class="max-w-2xl px-4 space-y-6">
        <!-- Delivery Method Selector -->
        <view class="flex p-[8rpx] bg-theme-13 rounded-full">
            <view
                class="flex-1 text-center border-0 border-[#fff] py-[16rpx] text-[28rpx] font-semibold rounded-full bg-white shadow-sm theme-color-1 ">
                快递配送
            </view>
            <view class="flex-1 text-center border-0  border-[#fff] py-[16rpx] text-[28rpx] font-semibold rounded-full ">
                到店自提
            </view>
        </view>
        <!-- Shipping Address view -->
        <view class="bg-white rounded-2xl p-[40rpx] shadow-sm border border-primary/5">
            <view class="flex items-start gap-4" @click="goListAddress()">
                <view class="p-2 rounded-full bg-theme-13">
                    <text class="iconfont icon-MapPin text-[48rpx] theme-color-1"></text>
                </view>
                <view class="flex-1">
                    <template v-if="currentAddress">
                      <view class="flex items-center gap-2 mb-1">
                          <text class="font-bold theme-color-5 text-[32rpx]">{{ currentAddress.name }}</text>
                          <text class="text-[28rpx] theme-color-6">{{ displayPhone(currentAddress.phone) }}</text>
                      </view>
                      <view class="text-[28rpx] theme-color-5 leading-relaxed">
                          {{ currentAddress.region }} {{ currentAddress.detail }}
                      </view>
                    </template>
                    <view v-else class="text-[28rpx] theme-color-6">请选择收货地址</view>
                </view>
                <view class="text-gray-400 hover:text-primary transition-colors self-center">
                    <text class="iconfont icon-jinru text-[30rpx]"></text>
                </view>
            </view>
            <view
                class="mt-4 pt-4 border-t border-dashed border-gray-100 dark:border-white/10 flex items-center justify-between">
                <text class="text-[24rpx] theme-color-1 font-medium px-[16rpx] py-[4rpx] bg-theme-13 rounded">{{ currentAddress?.isDefault ? '默认地址' : '已选择地址' }}</text>
                <text class="text-[24rpx] theme-color-6">收货时间：工作日/周末均可</text>
            </view>
        </view>
        <!-- Product Details -->
        <view class="bg-white dark:bg-white/5 rounded-2xl p-[40rpx] shadow-sm border border-primary/5">
            <view class="text-[24rpx] font-bold theme-color-6 mb-[32rpx] uppercase tracking-wider">商品清单</view>
            <view class="space-y-6">
                <view v-for="item in orderItems" :key="item.name" class="flex gap-4">
                    <view class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <image :alt="item.name" class="w-full h-full object-cover" :src="item.img" mode="aspectFill" />
                    </view>
                    <view class="flex-1 flex flex-col justify-between py-0.5">
                        <view>
                            <view class="font-medium text-[28rpx] theme-color-5 mb-[8rpx]">{{ item.name }}</view>
                            <view class="text-[24rpx] theme-color-6">{{ item.spec }}</view>
                        </view>
                        <view class="flex justify-between items-end">
                            <text class="theme-color-5 text-[32rpx] font-bold">¥ {{ item.price.toFixed(2) }}</text>
                            <text class="text-[24rpx] theme-color-6">x {{ item.qty }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <!-- Options: Coupons & Shipping -->
        <view class="bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-primary/5">
            <view class="viewide-y viewide-gray-50 dark:viewide-white/5">
                <view
                    class="w-full flex items-center justify-between p-[40rpx] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <view class="flex items-center gap-3">
                        <text class="iconfont icon-youhuijuan text-[46rpx] theme-color-1"></text>
                        <text class="text-[28rpx] font-medium">优惠券</text>
                    </view>
                    <view class="flex items-center gap-1">
                        <text class="text-[24rpx] text-primary">-¥ 50.00</text>
                        <text class="iconfont icon-jinru text-gray-300"></text>
                    </view>
                </view>
                <view
                    class="w-full flex items-center justify-between p-[40rpx] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <view class="flex items-center gap-3">
                        <text class="iconfont icon-navicon-chps text-primary text-[46rpx] theme-color-1"></text>
                        <text class="text-[28rpx] font-medium">配送方式</text>
                    </view>
                    <view class="flex items-center gap-1">
                        <text class="text-[24rpx] text-gray-500">顺丰包邮</text>
                        <text class="iconfont icon-jinru text-gray-300"></text>
                    </view>
                </view>
                <view class="p-[40rpx] flex items-center gap-3">
                    <text class="iconfont icon-beizhu text-primary text-[34rpx] theme-color-1"></text>
                    <text class="text-[28rpx] font-medium flex-shrink-0">备注信息</text>
                    <input class="flex-1 text-[24rpx] bg-transparent border-none focus:ring-0 placeholder:text-gray-300 p-0"
                        placeholder="如有特殊要求请留言" type="text" />
                </view>
            </view>
        </view>
        <!-- Payment Methods -->
        <view class="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-primary/5">
            <view class="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">支付方式</view>
            <view class="space-y-4">
              
                <label class="flex items-center justify-between cursor-pointer group">
                    <view class="flex items-center gap-3">
                        <view class="w-[64rpx] h-[64rpx] rounded-full bg-theme-13 flex items-center justify-center">
                            <text class="w-5 h-5 iconfont icon-weixin1 text-[#07C160] text-[40rpx]"></text>
                        </view>
                        <text class="text-sm font-medium">微信支付</text>
                    </view>
                    <input class="w-5 h-5 text-primary bg-theme-1 rounded-full border-gray-200 focus:ring-primary/20" name="payment"
                        type="radio" />
                </label>
                <label class="flex items-center justify-between cursor-pointer group">
                    <view class="flex items-center gap-3">
                        <view class="w-[64rpx] h-[64rpx] rounded-full bg-theme-13 flex items-center justify-center">
                            <text class="iconfont icon-creditcard theme-color-1 text-[32rpx]"></text>
                        </view>
                        <view>
                            <text class="text-[28rpx] font-medium block">余额支付</text>
                            <text class="text-[20rpx] text-gray-400">当前余额: ¥ 2,540.00</text>
                        </view>
                    </view>
                    <input class="w-5 h-5 text-primary border-gray-200 focus:ring-primary/20" name="payment"
                        type="radio" />
                </label>
            </view>
        </view>
        <!-- Bill Summary -->
        <view class="space-y-2 px-1">
            <view class="flex justify-between text-[28rpx] text-gray-500">
                <text>商品小计</text>
                <text>¥ 1,136.00</text>
            </view>
            <view class="flex justify-between text-[28rpx] text-gray-500">
                <text>运费</text>
                <text>¥ 0.00</text>
            </view>
            <view class="flex justify-between text-[28rpx] theme-color-1">
                <text>优惠扣减</text>
                <text>-¥ 50.00</text>
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
                    <text class="text-[48rpx] theme-color-1 font-bold tracking-tighter">1,086.00</text>
                </view>
            </view>
            <view class="flex items-center justify-end">
              <button
                class="bg-theme-1 ml-auto hover:bg-primary/90 text-white px-10 py-3.5 rounded-full font-bold text-base shadow-lg shadow-primary/20 active:scale-95 transition-all">
                立即下单
            </button>
            </view>
        </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { navigateBack, navigateTo } from "@/utils/navigation";
import IcrBar from "@/components/lcrBar.vue";

type AddressItem = {
  id: number;
  name: string;
  phone: string;
  region: string;
  detail: string;
  isDefault: boolean;
};

const ADDRESS_BOOK_KEY = "shop_address_book";
const ORDER_SELECTED_ADDRESS_ID_KEY = "shop_selected_address_id";

const onBack = () => {
  navigateBack();
};

const orderItems = [
  {
    name: "高山明前龙井 · 禅悦礼盒",
    spec: "规格：特级 250g / 罐",
    price: 880,
    qty: 1,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwB-_NX4M93ien44HmYJo7e32mE4E1Ovk4nGq2c9BfrZVOkLUftxC5qg_N4iS-kwCiLgCRJUr9ngddcCsvlegXax9ifg8NgzUHCeipoXjj1Olwvo2bJDY_EYlMLjXLgQ3DKY1IwywVQYL3dj3CzBkqGALgbemUhjl8qHRtGODZoRhYrBR1a_0DXR0InSQRpK0W6J175FXv0MZDXjiEkkuAa7UxbCrrGH7P3Ko0dhjuoRbNEzYvpIh3l2TzB3wJMm7DtW5kFFFIRS3F"
  },
  {
    name: "老山檀香 · 沉静如水",
    spec: "规格：40支装",
    price: 128,
    qty: 2,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsFlP37iiHN7ZlZjTsUpwcLBagVN60xDdxkuyhR0TjE0nLIdJ1g24p8uGT87F6NDhxo49ffoa7I9AnV6ux-AKl8k9wn6hsyjDFC3QINL9T4D-8Rvl63MwXsQwRZRP8Lr9SogtKgyKbYoZyPsjw55tg-iz2mlxy1izwuCbqLRTC0nTGF4mC9k6c1sLqv2EcmIuV3oKG_peG-XF7pQCUxtfsj76jnpwqsSK_Xq6D4YtB2GTmq9quvNZgtaUsJpjdQB7z_jw4vwKYLdLY"
  }
];

const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
const shipping = 0;
const total = subtotal + shipping;

const addressList = ref<AddressItem[]>([]);
const selectedAddressId = ref<number | null>(null);

const currentAddress = computed(() => {
  if (!addressList.value.length) return null;
  if (selectedAddressId.value != null) {
    const matched = addressList.value.find((x) => x.id === selectedAddressId.value);
    if (matched) return matched;
  }
  return addressList.value.find((x) => x.isDefault) || addressList.value[0] || null;
});

const displayPhone = (phone: string) => phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1 **** $2");

const loadAddressState = () => {
  const list = uni.getStorageSync(ADDRESS_BOOK_KEY) as AddressItem[] | undefined;
  addressList.value = Array.isArray(list) ? list : [];
  const selected = uni.getStorageSync(ORDER_SELECTED_ADDRESS_ID_KEY) as number | undefined;
  selectedAddressId.value = selected || null;
};

const goListAddress = () => {
  const selected = currentAddress.value?.id ?? "";
  uni.navigateTo({ url: '/pages/shop/list-address?mode=select&selectedId=${selected}' });
};

onShow(() => {
  loadAddressState();
});
</script>