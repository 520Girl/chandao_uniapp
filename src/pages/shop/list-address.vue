<template>
  <view class="flex flex-col min-h-screen pb-32 theme-bg">
    <lcrBar :title="'收货地址'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />

    <view class="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      <view v-if="listLoading && addresses.length === 0" class="text-center text-sm text-on-surface-variant py-12">
        加载中…
      </view>
      <view
        v-for="item in addresses"
        :key="item.id"
        class="rounded-[36rpx] p-5 shadow-sm border transition-all"
        :class="
          item.id === selectedId
            ? 'bg-theme-13 border-theme-1 shadow-lg shadow-primary/10'
            : 'bg-white border-primary/5'
        "
        @click="onSelectAddress(item)">
        <view class="flex justify-between items-start mb-3">
          <view class="flex items-center gap-3 flex-wrap">
            <text class="text-[32rpx] font-bold theme-color-5">{{ item.contact }}</text>
            <text class="font-medium tracking-wide text-[26rpx]" :class="{ 'theme-color-1': item.id === selectedId }">
              {{ displayPhone(item.phone) }}
            </text>
            <text
              v-if="item.isDefault"
              class="bg-primary/10 text-primary text-[20rpx] px-2 py-0.5 rounded-full font-bold border border-primary/20">
              默认
            </text>
            <text
              v-if="item.id === selectedId"
              class="bg-theme-1 text-white text-[20rpx] px-2 py-0.5 rounded-full font-bold">
              已选中
            </text>
          </view>
          <view class="text-zinc-400 hover:text-primary transition-colors" @click.stop="goEditAddress(item.id)">
            <text class="iconfont icon-a-EditSquare-Light text-[44rpx] theme-color-6" />
          </view>
        </view>
        <view class="flex gap-2 items-start">
          <text class="iconfont icon-MapPin text-[28rpx]" :class="{ 'text-zinc-300 ': item.id === selectedId }" />
          <view class="text-zinc-500 text-[28rpx] leading-relaxed">
            {{ regionLine(item) }} {{ item.address }}
          </view>
        </view>
        <view class="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer group" @click.stop="setDefault(item)">
            <view
              class=" h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center"
              :class="item.isDefault ? 'bg-primary border-primary' : 'bg-transparent border-zinc-200'">
              <text v-if="item.isDefault" class="text-white text-[18rpx] font-bold leading-none">✓</text>
            </view>
            <text class="text-xs text-zinc-400 group-hover:text-primary transition-colors">设为默认地址</text>
          </label>
          <view
            class="text-xs text-zinc-300 hover:text-red-400 flex items-center gap-1 transition-colors"
            @click.stop="deleteAddress(item)">
            <text class="iconfont icon-trash-2 text-[28rpx]" />
            删除
          </view>
        </view>
      </view>
      <view v-if="!listLoading && addresses.length === 0" class="text-center text-[26rpx] theme-color-6 py-16">
        暂无收货地址
      </view>
      <view class="py-10" />
    </view>

    <view class="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light/95 to-transparent">
      <view
        class="w-full bg-primary text-white h-14 rounded-full font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
        @click="goCreateAddress">
        <text class="iconfont text-white icon-add text-[40rpx]" />
        <text class="text-[32rpx] font-bold">新增收货地址</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { deleteUserAddress, fetchUserAddressList, updateUserAddress } from '@/assets/js/api/userAddress';
import lcrBar from '@/components/lcrBar.vue';
import type { UserAddress } from '@/types/api/userAddress';
import { unwrapApiList } from '@/utils/apiResponse';
import { navigateBack } from '@/utils/navigation';

const ORDER_SELECTED_ADDRESS_ID_KEY = 'shop_selected_address_id';

const addresses = ref<UserAddress[]>([]);
const selectedId = ref<number | null>(null);
const chooseMode = ref(false);
const listLoading = ref(false);

function displayPhone(phone: string) {
  const p = phone.replace(/\s/g, '');
  return p.replace(/^(\d{3})\d{4}(\d{4})$/, '$1 **** $2');
}

function regionLine(item: UserAddress) {
  return [item.province, item.city, item.district].filter(Boolean).join(' ');
}

async function refreshList() {
  listLoading.value = true;
  try {
    const res = await fetchUserAddressList({});
    addresses.value = unwrapApiList(res) as UserAddress[];
  } catch (e) {
    console.error('fetchUserAddressList', e);
    addresses.value = [];
  } finally {
    listLoading.value = false;
  }
}

function onSelectAddress(item: UserAddress) {
  selectedId.value = item.id;
  uni.setStorageSync(ORDER_SELECTED_ADDRESS_ID_KEY, item.id);
  if (chooseMode.value) {
    navigateBack();
  }
}

async function setDefault(item: UserAddress) {
  try {
    await updateUserAddress({
      id: item.id,
      contact: item.contact,
      phone: item.phone.replace(/\s/g, ''),
      province: item.province,
      city: item.city,
      district: item.district,
      address: item.address,
      isDefault: true
    });
    await refreshList();
  } catch (e) {
    console.error('updateUserAddress', e);
  }
}

function deleteAddress(item: UserAddress) {
  uni.showModal({
    title: '提示',
    content: '确认删除该地址吗？',
    success: async (res) => {
      if (!res.confirm) return;
      try {
        await deleteUserAddress({ ids: [item.id] });
        if (selectedId.value === item.id) {
          selectedId.value = null;
          uni.removeStorageSync(ORDER_SELECTED_ADDRESS_ID_KEY);
        }
        await refreshList();
      } catch (e) {
        console.error('deleteUserAddress', e);
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
  chooseMode.value = options?.mode === 'select';
  const querySelectedId = Number(options?.selectedId || 0);
  selectedId.value =
    querySelectedId ||
    (uni.getStorageSync(ORDER_SELECTED_ADDRESS_ID_KEY) as number | undefined) ||
    null;
});

onShow(() => {
  refreshList().then(() => {
    if (selectedId.value == null) {
      const def = addresses.value.find((x) => x.isDefault) || addresses.value[0];
      selectedId.value = def?.id ?? null;
    }
  });
});

const onBack = () => navigateBack();
</script>
