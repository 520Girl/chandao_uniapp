<template>
    <view class="flex flex-col min-h-screen theme-bg">
        <lcrBar :title="'设备管理'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
        <view class="w-full px-4 pt-10 pb-24 flex flex-col gap-8 flex-grow">
            <!-- Section Header -->
            <view class="space-y-1">
                <view class="font-headline text-2xl text-on-surface tracking-tight">我的设备</view>
                <view class="font-label text-xs text-on-surface-variant tracking-widest opacity-60 uppercase">
                    云息设备坚持内心，做自己
                </view>
            </view>
            <!-- Device List -->
            <view class="p-[46rpx] space-y-4">
                <view class="flex items-center justify-between mb-2">
                    <text
                        class="text-[24rpx] theme-color-1 font-bold uppercase tracking-widest text-primary">设备管理中心</text>
                    <text
                        class="theme-color-1 bg-theme-10 text-primary text-[20rpx] font-bold px-2 py-1 rounded-full">{{ remainingSlots }}个可用名额</text>
                </view>
                <view v-if="listLoading" class="py-12 text-center text-sm text-on-surface-variant">加载中…</view>
                <template v-else>
                    <!-- 已绑定设备 -->
                    <view
                        v-for="item in deviceList"
                        :key="item.id"
                        class="bg-white p-4 rounded-[100rpx] border-theme flex items-center gap-4 hover:border-primary/40 transition-colors shadow-sm active:opacity-90"
                        @tap="() => openEditDeviceToast(item)">
                        <view
                            class="size-14 bg-theme-10 rounded-full flex items-center justify-center text-primary shrink-0">
                            <text class="iconfont text-[60rpx] theme-color-1" :class="item.icon || 'icon-grid-view'"></text>
                        </view>
                        <view class="flex-1 min-w-0">
                            <view class="font-bold text-sm tracking-tight">{{ item.name }}</view>
                            <view class=" flex items-center gap-1">
                                <text class="iconfont icon-shebei1 text-[30rpx] theme-color-12 font-bold"></text>
                                <text class="text-[26rpx] theme-color-12 ">{{ item.sn }}</text>
                            </view>
                            <view class="flex items-center gap-1.5">
                                <view class="size-2 rounded-full animate-pulse" :class="statusDotClass(item.statusCode)"></view>
                                <text class="text-[11px] font-medium" :class="statusTextClass(item.statusCode)">{{ item.status }}</text>
                            </view>
                        </view>
                        <view class="theme-color-12 bg-white border-0 shrink-0" @tap.stop="onUnbindDevice(item)">
                            <text class="iconfont icon-setting text-[48rpx]"></text>
                        </view>
                    </view>
                    <!-- 空插槽：添加设备 -->
                    <view
                        v-if="deviceList.length < MAX_DEVICES"
                        class="border-2 border-dashed border-primary/20 p-4 rounded-[100rpx] flex items-center gap-4 bg-primary/5 group cursor-pointer hover:bg-primary/10 transition-colors active:opacity-90"
                        @tap="openAddDeviceToast">
                        <view
                            class="size-14 border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center text-primary/30 group-hover:text-primary shrink-0">
                            <text class="iconfont icon-add text-[38rpx] theme-color-12"></text>
                        </view>
                        <view class="flex-1">
                            <view
                                class="font-bold text-sm tracking-tight theme-color-12 group-hover:text-primary transition-colors">
                                绑定新设备</view>
                            <view class="text-[11px] theme-color-12 uppercase tracking-tighter">空插槽</view>
                        </view>
                        <text
                            class="iconfont icon-sensors theme-color-12 group-hover:text-primary transition-colors"></text>
                    </view>
                </template>
            </view>
            <!-- Hint Text -->
            <view class="mt-auto pt-10 text-center">
                <view class="font-label text-[10px] leading-relaxed text-on-surface-variant/40 tracking-[0.15em] px-4">
                    当前支持绑定最多{{ MAX_DEVICES }}个设备<br />确保数据精准采集
                </view>
            </view>
            <ToastConfirm
                v-model:show="showToast"
                :title="toastParams.title"
                :fields="toastParams.fields"
                :mask-closable="toastParams.maskClosable"
                :cancel-text="toastParams.cancelText"
                :confirm-text="toastParams.confirmText"
                :required="toastParams.required"
                @close="onToastClose"
                @confirm="onToastConfirm" />

                <ConfirmDialog
                v-model:show="showExit"
                title="解绑设备"
                :message="`确定要解绑「${currentDevice?.name}」吗？`"
                @confirm="() => onConfirm()"
                />
        </view>
    </view>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { navigateBack } from '@/utils/navigation';
import { showSuccessToast } from '@/utils/toast';
import { LcrBar, ToastConfirm, ConfirmDialog } from '@/components';
import type { ToastInputField } from '@/types/pages/component';
import type { DeviceItem } from '@/types/pages/device';
import { addDevice, removeDevice, fetchDeviceDetails } from '@/assets/js/api/device';
import { useDeviceStore, DEVICE_BIND_SLOT_MAX } from '@/stores/device';
import { extractDeviceDetailPayload } from '@/utils/deviceMap';

const showExit = ref(false);
const MAX_DEVICES = DEVICE_BIND_SLOT_MAX;
const showToast = ref(false);
const submitLoading = ref(false);

const deviceStore = useDeviceStore();
const { devices: deviceList, listLoading } = storeToRefs(deviceStore);

const remainingSlots = computed(() => Math.max(0, MAX_DEVICES - deviceList.value.length));

/** 弹窗：null 为「添加设备」，有值为正在编辑的设备 id */
const editingDeviceId = ref<number | null>(null);

const toastParams = reactive({
    title: '添加设备',
    fields: [] as ToastInputField[],
    maskClosable: true,
    cancelText: '取消',
    confirmText: '确定',
    required: true
});
//当前设备名称
const currentDevice = ref<DeviceItem | null>(null);

function statusDotClass(code: number) {
    if (code === 1) return 'bg-green-500';
    if (code === 0) return 'bg-amber-400';
    if (code === 2) return 'bg-slate-400';
    if (code === 3) return 'bg-red-500';
    if (code === 4) return 'bg-gray-400';
    return 'bg-theme-12';
}

function statusTextClass(code: number) {
    if (code === 1) return 'text-green-600';
    if (code === 0) return 'text-amber-600';
    if (code === 2) return 'text-slate-500';
    if (code === 3) return 'text-red-600';
    if (code === 4) return 'text-gray-500';
    return 'theme-color-12';
}

onMounted(() => {
    void deviceStore.refreshList(MAX_DEVICES);
});

/** 点击某一设备：拉详情后编辑展示名/备注（无后端修改接口时仅本地更新） */
async function openEditDeviceToast(item: DeviceItem) {
    editingDeviceId.value = item.id;
    toastParams.title = '编辑设备';
    toastParams.confirmText = '保存';

    let name = item.name;
    let mac = item.mac;
    let sn = item.sn;
    try {
        const res = await fetchDeviceDetails({ mac: item.mac });
        deviceStore.mergeDeviceFromDetailResponse(item.id, res);
        const d = extractDeviceDetailPayload(res);
        if (d) {
            name = String(d.name ?? item.name);
            mac = String(d.mac ?? mac);
            sn = String(d.sn ?? sn);
        }
    } catch (e) {
        console.error('fetchDeviceDetails', e);
    }
    toastParams.fields = [
        {
            key: 'name',
            label: '设备昵称',
            placeholder: '设置设备昵称',
            defaultValue: name,
            required: true
        },
        {
            key: 'remark',
            label: '',
            placeholder: '请输入设备 SN',
            defaultValue: sn,
            icon:'',
            disabled: true
        },
        {
            key: 'mac',
            label: '',
            placeholder: '请输入设备 MAC 地址',
            defaultValue: mac,
            icon:'',
            disabled: true
        }
    ];
    showToast.value = true;
}

/** 绑定新设备：需 SN / 型号 / MAC，对应 addDevice */
function openAddDeviceToast() {
    if (deviceList.value.length >= MAX_DEVICES) {
        uni.showToast({ title: '已达到最大绑定数量', icon: 'none' });
        return;
    }
    editingDeviceId.value = null;
    toastParams.title = '绑定设备';
    toastParams.confirmText = '绑定';
    toastParams.fields = [
        { key: 'model', label: '设备昵称', placeholder: '设置设备昵称', defaultValue: '', required: true },
        { key: 'sn', label: '序列号 SN', placeholder: '请输入设备 SN', defaultValue: '', required: true },
        { key: 'mac', label: 'MAC 地址', placeholder: '如 AA:BB:CC:DD:EE:FF', defaultValue: '', required: true }
    ];
    showToast.value = true;
}

function onToastClose() {
    editingDeviceId.value = null;
}

function onUnbindDevice(item: DeviceItem) {
    showExit.value = true;
    currentDevice.value = item;
    
}

async function onToastConfirm(value: Record<string, string>) {
    const id = editingDeviceId.value;

    if (id != null) {
        const name = (value.name ?? '').trim();
        const remark = (value.remark ?? '').trim();
        deviceStore.patchLocalDevice(id, { name, remark });
        editingDeviceId.value = null;
        showSuccessToast('已保存');
        return;
    }

    const sn = (value.sn ?? '').trim();
    const model = (value.model ?? '').trim();
    const mac = (value.mac ?? '').trim();
    if (submitLoading.value) return;
    submitLoading.value = true;
    try {
        await addDevice({ sn, model, mac });
        showSuccessToast('绑定成功');
        await deviceStore.refreshList(MAX_DEVICES);
    } catch (e) {
        console.error('addDevice', e);
    } finally {
        submitLoading.value = false;
    }
}

const onBack = () => {
    navigateBack();
};

// 确认
const onConfirm = async () => {
   
    try {
        await removeDevice({ sn: currentDevice.value?.sn ?? '' });
        showSuccessToast('已解绑');
        await deviceStore.refreshList(MAX_DEVICES);
        showExit.value = false;
    } catch (e) {
        console.error('removeDevice', e);
    }
};
</script>
<style scoped lang="scss"></style>
