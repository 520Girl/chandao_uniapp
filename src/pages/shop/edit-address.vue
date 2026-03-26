

<template>
  <view class="flex flex-col min-h-screen pb-32 theme-bg">
    <IcrBar :title="pageTitle" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
    <view class="flex-1 px-[48rpx] pt-[32rpx] pb-[64rpx] space-y-6">
      <view class="space-y-2">
        <text class="block text-[28rpx] font-medium theme-color-5 ml-[32rpx]">收货人</text>
        <input
          v-model="form.name"
          class="h-[96rpx] px-[40rpx] bg-theme-11 dark:bg-white/5 border-none rounded-full text-[28rpx] transition-all outline-none"
          placeholder="请输入收货人姓名"
          type="text"
        />
      </view>
      <view class="space-y-2">
        <text class="block text-[28rpx] font-medium theme-color-5 ml-[32rpx]">手机号码</text>
        <input
          v-model="form.phone"
          class="h-[96rpx] px-[40rpx] bg-theme-11 border-none rounded-full text-[28rpx] outline-none"
          placeholder="请输入手机号码"
          type="number"
          maxlength="11"
        />
      </view>
      <view class="space-y-2">
        <text class="block text-[28rpx] font-medium theme-color-5 ml-[32rpx]">所在地区</text>
        <input
          v-model="form.region"
          class="h-[96rpx] px-[40rpx] bg-theme-11 border-none rounded-full text-[28rpx] outline-none"
          placeholder="请输入所在地区"
          type="text"
        />
      </view>
      <view class="space-y-2">
        <text class="block text-[28rpx] font-medium theme-color-5 ml-[32rpx]">详细地址</text>
        <textarea
          v-model="form.detail"
          class="w-full box-border p-6 bg-theme-11 border-none rounded-xl text-[28rpx] outline-none resize-none"
          placeholder="请输入街道、门牌号等详细信息"
          rows="3"
        />
      </view>
      <view class="flex items-center justify-between px-4 py-2">
        <view class="flex flex-col">
          <text class="text-[28rpx] font-medium theme-color-5">设为默认地址</text>
          <text class="text-[24rpx] theme-color-6 mt-1">下单时将优先使用该地址</text>
        </view>
        <up-switch v-model="form.isDefault" activeColor="#d4af35" />
      </view>
    </view>
    <view class="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100">
      <button
        class="w-full box-border h-[112rpx] leading-[112rpx] m-auto bg-theme-1 text-white font-bold text-[36rpx] rounded-full shadow-lg shadow-primary/20 active:scale-[0.98]"
        @click="onSave"
      >
        保存并使用
      </button>
      <view
        v-if="isEdit"
        class="w-full mt-[20rpx] mb-[32rpx] text-center text-[28rpx] text-gray-400 hover:text-red-500 transition-colors font-medium"
        @click="onDelete"
      >
        删除收货地址
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { navigateBack } from "@/utils/navigation";
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

const editingId = ref<number | null>(null);
const isEdit = computed(() => editingId.value != null);
const pageTitle = computed(() => (isEdit.value ? "编辑地址" : "新增地址"));

const form = reactive<AddressItem>({
  id: 0,
  name: "",
  phone: "",
  region: "",
  detail: "",
  isDefault: false
});

const readBook = (): AddressItem[] => {
  const list = uni.getStorageSync(ADDRESS_BOOK_KEY) as AddressItem[] | undefined;
  return Array.isArray(list) ? list : [];
};

const saveBook = (list: AddressItem[]) => {
  uni.setStorageSync(ADDRESS_BOOK_KEY, list);
};

onLoad((options) => {
  const id = Number(options?.id || 0);
  if (!id) return;
  editingId.value = id;
  const current = readBook().find((x) => x.id === id);
  if (!current) return;
  Object.assign(form, current);
});

function validateForm() {
  if (!form.name.trim()) return "请输入收货人";
  if (!/^1\d{10}$/.test(form.phone)) return "请输入正确手机号";
  if (!form.region.trim()) return "请输入所在地区";
  if (!form.detail.trim()) return "请输入详细地址";
  return "";
}

function onSave() {
  const message = validateForm();
  if (message) {
    uni.showToast({ title: message, icon: "none" });
    return;
  }

  let list = readBook();
  if (form.isDefault) {
    list = list.map((x) => ({ ...x, isDefault: false }));
  }

  if (isEdit.value) {
    list = list.map((x) => (x.id === editingId.value ? { ...form, id: Number(editingId.value) } : x));
  } else {
    const nextId = list.length ? Math.max(...list.map((x) => x.id)) + 1 : 1;
    list.unshift({ ...form, id: nextId });
    uni.setStorageSync(ORDER_SELECTED_ADDRESS_ID_KEY, nextId);
  }

  if (!list.some((x) => x.isDefault) && list.length) {
    list[0].isDefault = true;
  }

  saveBook(list);
  uni.showToast({ title: "保存成功", icon: "success" });
  setTimeout(() => navigateBack(), 200);
}

function onDelete() {
  if (!isEdit.value) return;
  uni.showModal({
    title: "提示",
    content: "确认删除该地址吗？",
    success: (res) => {
      if (!res.confirm) return;
      let list = readBook().filter((x) => x.id !== editingId.value);
      if (!list.some((x) => x.isDefault) && list.length) {
        list[0].isDefault = true;
      }
      saveBook(list);
      uni.showToast({ title: "已删除", icon: "success" });
      setTimeout(() => navigateBack(), 200);
    }
  });
}

const onBack = () => navigateBack();
</script>