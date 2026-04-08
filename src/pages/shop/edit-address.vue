<template>
  <view class="flex flex-col min-h-screen pb-32 theme-bg">
    <IcrBar :title="pageTitle" :leftIcon="'icon-arrow-left'" :handleClick="onBack" type="all" />
    <view class="flex-1 px-[48rpx] pt-[32rpx] pb-[64rpx] space-y-6">
      <view class="space-y-2">
        <text class="block text-[28rpx] font-medium theme-color-5 ml-[32rpx]">收货人</text>
        <input
          v-model="form.contact"
          class="h-[96rpx] px-[40rpx] bg-theme-13 dark:bg-white/5 border-none rounded-full text-[28rpx] transition-all outline-none"
          placeholder="请输入收货人姓名"
          type="text" />
      </view>
      <view class="space-y-2">
        <text class="block text-[28rpx] font-medium theme-color-5 ml-[32rpx]">手机号码</text>
        <input
          v-model="form.phone"
          class="h-[96rpx] px-[40rpx] bg-theme-13 border-none rounded-full text-[28rpx] outline-none"
          placeholder="请输入手机号码"
          type="number"
          maxlength="11" />
      </view>
      <view class="space-y-2">
        <text class="block text-[28rpx] font-medium theme-color-5 ml-[32rpx]">省</text>
        <input
          v-model="form.province"
          class="h-[96rpx] px-[40rpx] bg-theme-13 border-none rounded-full text-[28rpx] outline-none"
          placeholder="省"
          type="text" />
      </view>
      <view class="space-y-2">
        <text class="block text-[28rpx] font-medium theme-color-5 ml-[32rpx]">市</text>
        <input
          v-model="form.city"
          class="h-[96rpx] px-[40rpx] bg-theme-13 border-none rounded-full text-[28rpx] outline-none"
          placeholder="市"
          type="text" />
      </view>
      <view class="space-y-2">
        <text class="block text-[28rpx] font-medium theme-color-5 ml-[32rpx]">区/县</text>
        <input
          v-model="form.district"
          class="h-[96rpx] px-[40rpx] bg-theme-13 border-none rounded-full text-[28rpx] outline-none"
          placeholder="区/县"
          type="text" />
      </view>
      <view class="space-y-2">
        <text class="block text-[28rpx] font-medium theme-color-5 ml-[32rpx]">详细地址</text>
        <textarea
          v-model="form.address"
          class="w-full box-border p-6 bg-theme-13 border-none rounded-xl text-[28rpx] outline-none resize-none"
          placeholder="街道、门牌号等"
          rows="3" />
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
        :disabled="saveLoading"
        @click="onSave">
        {{ saveLoading ? '保存中…' : '保存并使用' }}
      </button>
      <view
        v-if="isEdit"
        class="w-full mt-[20rpx] mb-[32rpx] text-center text-[28rpx] text-gray-400 hover:text-red-500 transition-colors font-medium"
        @click="onDelete">
        删除收货地址
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { addUserAddress, deleteUserAddress, fetchUserAddressInfo, updateUserAddress } from '@/assets/js/api/userAddress';
import IcrBar from '@/components/lcrBar.vue';
import type { ShopAddressEditorForm } from '@/types/pages/shop';
import { unwrapApiData } from '@/utils/apiResponse';
import { navigateBack } from '@/utils/navigation';

const ORDER_SELECTED_ADDRESS_ID_KEY = 'shop_selected_address_id';

const editingId = ref<number | null>(null);
const isEdit = computed(() => editingId.value != null);
const pageTitle = computed(() => (isEdit.value ? '编辑地址' : '新增地址'));
const saveLoading = ref(false);

const emptyForm = (): ShopAddressEditorForm => ({
  contact: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  address: '',
  isDefault: false
});

const form = reactive<ShopAddressEditorForm>(emptyForm());

onLoad((options) => {
  const id = Number(options?.id || 0);
  const mode = options?.mode || '';
  if (mode === 'create' || !id) {
    editingId.value = null;
    Object.assign(form, emptyForm());
    return;
  }
  editingId.value = id;
  loadAddress(id);
});

async function loadAddress(id: number) {
  try {
    const res = await fetchUserAddressInfo({ id });
    const data = unwrapApiData<Record<string, unknown>>(res);
    if (!data || typeof data !== 'object') return;
    form.contact = String(data.contact ?? '');
    form.phone = String(data.phone ?? '').replace(/\s/g, '');
    form.province = String(data.province ?? '');
    form.city = String(data.city ?? '');
    form.district = String(data.district ?? '');
    form.address = String(data.address ?? '');
    form.isDefault = Boolean(data.isDefault);
  } catch (e) {
    console.error('fetchUserAddressInfo', e);
  }
}

function validateForm() {
  if (!form.contact.trim()) return '请输入收货人';
  if (!/^1\d{10}$/.test(form.phone.replace(/\s/g, ''))) return '请输入正确手机号';
  if (!form.province.trim()) return '请输入省';
  if (!form.city.trim()) return '请输入市';
  if (!form.district.trim()) return '请输入区/县';
  if (!form.address.trim()) return '请输入详细地址';
  return '';
}

async function onSave() {
  const message = validateForm();
  if (message) {
    uni.showToast({ title: message, icon: 'none' });
    return;
  }
  const payload = {
    contact: form.contact.trim(),
    phone: form.phone.replace(/\s/g, ''),
    province: form.province.trim(),
    city: form.city.trim(),
    district: form.district.trim(),
    address: form.address.trim(),
    isDefault: form.isDefault
  };
  saveLoading.value = true;
  try {
    if (isEdit.value && editingId.value != null) {
      await updateUserAddress({ id: editingId.value, ...payload });
    } else {
      const res = await addUserAddress(payload);
      const data = unwrapApiData<Record<string, unknown>>(res);
      const newId =
        data && typeof data === 'object' && data.id != null ? Number(data.id) : NaN;
      if (!Number.isNaN(newId)) {
        uni.setStorageSync(ORDER_SELECTED_ADDRESS_ID_KEY, newId);
      }
    }
    uni.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => navigateBack(), 200);
  } catch (e) {
    console.error('save address', e);
  } finally {
    saveLoading.value = false;
  }
}

function onDelete() {
  if (!isEdit.value || editingId.value == null) return;
  uni.showModal({
    title: '提示',
    content: '确认删除该地址吗？',
    success: async (res) => {
      if (!res.confirm) return;
      try {
        await deleteUserAddress({ ids: [editingId.value!] });
        uni.showToast({ title: '已删除', icon: 'success' });
        setTimeout(() => navigateBack(), 200);
      } catch (e) {
        console.error('deleteUserAddress', e);
      }
    }
  });
}

const onBack = () => navigateBack();
</script>
