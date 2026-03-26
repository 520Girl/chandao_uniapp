

<template>
  <view class="flex flex-col min-h-screen pb-32 theme-bg">
    <lcrBar :title="'收货地址'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />

    <view class="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      <view
        v-for="item in addresses"
        :key="item.id"
        class="rounded-[36rpx] p-5 shadow-sm border transition-all"
        :class="
          item.id === selectedId
            ? 'bg-theme-13 border-theme-1 shadow-lg shadow-primary/10'
            : 'bg-white border-primary/5'
        "
        @click="onSelectAddress(item)"
      >
        <view class="flex justify-between items-start mb-3">
          <view class="flex items-center gap-3 flex-wrap">
            <text class="text-[32rpx] font-bold theme-color-5" >{{ item.name }}</text>
            <text class="font-medium tracking-wide text-[26rpx]" :class="{ 'theme-color-1': item.id === selectedId}">{{ item.phone }}</text>
            <text
              v-if="item.isDefault"
              class="bg-primary/10 text-primary text-[20rpx] px-2 py-0.5 rounded-full font-bold border border-primary/20"
            >
              默认
            </text>
            <text
              v-if="item.id === selectedId"
              class="bg-theme-1 text-white text-[20rpx] px-2 py-0.5 rounded-full font-bold"
            >
              已选中
            </text>
          </view>
          <view class="text-zinc-400 hover:text-primary transition-colors" @click.stop="goEditAddress(item.id)">
            <text class="iconfont icon-a-EditSquare-Light text-[44rpx] theme-color-6" ></text>
          </view>
        </view>
        <view class="flex gap-2 items-start">
          <text class="iconfont icon-MapPin text-[28rpx]" :class="{ 'text-zinc-300 ': item.id === selectedId}"></text>
          <view class="text-zinc-500 text-[28rpx] leading-relaxed">
            {{ item.region }} {{ item.detail }}
          </view>
        </view>
        <view class="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer group" @click.stop="setDefault(item.id)">
            <view
              class=" h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center"
              :class="item.isDefault ? 'bg-primary border-primary' : 'bg-transparent border-zinc-200'"
            >
              <text v-if="item.isDefault" class="text-white text-[18rpx] font-bold leading-none">✓</text>
            </view>

            <text class="text-xs text-zinc-400 group-hover:text-primary transition-colors">设为默认地址</text>
          </label>
          <view class="text-xs text-zinc-300 hover:text-red-400 flex items-center gap-1 transition-colors" @click.stop="deleteAddress(item.id)">
            <text class="iconfont icon-trash-2 text-[28rpx]"></text>
            删除
          </view>
        </view>
      </view>
      <view v-if="addresses.length === 0" class="text-center text-[26rpx] theme-color-6 py-16">暂无收货地址</view>
      <view class="py-10"></view>
    </view>

    <view class="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light/95 to-transparent">
      <view
        class="w-full bg-primary text-white h-14 rounded-full font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
        @click="goCreateAddress"
      >
        <text class="iconfont text-white icon-add text-[40rpx]"></text>
        <text class="text-[32rpx] font-bold">新增收货地址</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { navigateBack, navigateTo } from "@/utils/navigation";
import lcrBar from "@/components/lcrBar.vue";

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

const addresses = ref<AddressItem[]>([]);
const selectedId = ref<number | null>(null);
const chooseMode = ref(false);

const mockAddresses: AddressItem[] = [
  { id: 1, name: "张慕白", phone: "13800138000", region: "北京市 朝阳区", detail: "亮马桥路 48号院 官舍南区 3号楼 1202室", isDefault: true },
  { id: 2, name: "林听雨", phone: "13900139999", region: "浙江省 杭州市 西湖区", detail: "灵隐街道 云栖竹径禅意生活馆 302室", isDefault: false }
];

const formatPhone = (phone: string) => phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1 **** $2");

function readBook() {
  const cached = uni.getStorageSync(ADDRESS_BOOK_KEY) as AddressItem[] | undefined;
  const list = Array.isArray(cached) && cached.length ? cached : mockAddresses;
  addresses.value = list.map((x) => ({ ...x, phone: formatPhone(x.phone.replace(/\s/g, "")) }));
  if (!cached || !cached.length) {
    saveBook(list);
  }
}

function saveBook(list: AddressItem[]) {
  const normalized = list.map((x) => ({ ...x, phone: x.phone.replace(/\s/g, "") }));
  uni.setStorageSync(ADDRESS_BOOK_KEY, normalized);
}

function onSelectAddress(item: AddressItem) {
  selectedId.value = item.id;
  uni.setStorageSync(ORDER_SELECTED_ADDRESS_ID_KEY, item.id);
  // if (chooseMode.value) {
  //   navigateBack();
  // }
}

function setDefault(id: number) {
  const next = addresses.value.map((x) => ({ ...x, isDefault: x.id === id }));
  addresses.value = next;
  saveBook(next);
}

function deleteAddress(id: number) {
  if (addresses.value.length <= 1) {
    uni.showToast({ title: "至少保留一个地址", icon: "none" });
    return;
  }
  uni.showModal({
    title: "提示",
    content: "确认删除该地址吗？",
    success: (res) => {
      if (!res.confirm) return;
      let next = addresses.value.filter((x) => x.id !== id);
      if (!next.some((x) => x.isDefault) && next.length) {
        next = next.map((x, idx) => ({ ...x, isDefault: idx === 0 }));
      }
      addresses.value = next;
      saveBook(next);
      if (selectedId.value === id) {
        const fallback = next.find((x) => x.isDefault) || next[0];
        selectedId.value = fallback?.id ?? null;
        if (selectedId.value != null) {
          uni.setStorageSync(ORDER_SELECTED_ADDRESS_ID_KEY, selectedId.value);
        }
      }
    }
  });
}

function goEditAddress(id: number) {
  uni.navigateTo({ url: `/pages/shop/edit-address?id=${id}&mode=edit` });
}

function goCreateAddress() {
  uni.navigateTo({ url: '/pages/shop/edit-address?mode=create' });
}

onLoad((options) => {
  chooseMode.value = options?.mode === "select";
  const querySelectedId = Number(options?.selectedId || 0);
  selectedId.value = querySelectedId || (uni.getStorageSync(ORDER_SELECTED_ADDRESS_ID_KEY) as number) || null;
});

onShow(() => {
  readBook();
  if (selectedId.value == null) {
    const defaultAddress = addresses.value.find((x) => x.isDefault) || addresses.value[0];
    selectedId.value = defaultAddress?.id ?? null;
  }
});

const onBack = () => navigateBack();
</script>