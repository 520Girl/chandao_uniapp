<template>
    <transition name="toast-modal">
        <view
            v-if="visible"
            class="toast-modal-mask fixed inset-0 z-[100] bg-on-background/10 backdrop-blur-md flex items-center justify-center p-6"
            @tap="onMaskTap">
            <view
                class="toast-modal-panel bg-surface-container-lowest w-full max-w-[320px] max-h-[85vh] overflow-y-auto rounded-[40px] p-4 flex flex-col items-center text-center shadow-2xl relative"
                @tap.stop>
            <view class="absolute inset-0 pointer-events-none cloud-pattern theme-bg opacity-90 rounded-[40px]" />
            <view class="absolute top-[-20rpx] left-[-20rpx] w-24 h-24 mb-4 flex items-center justify-center shrink-0">
                <view
                    class="absolute inset-0 border-2 iconfont icon-auto_awesome theme-color-8 text-[60rpx] border-dashed border-tertiary/20 rounded-full animate-[spin_10s_linear_infinite]">
                </view>
            </view>
            <view
                class="absolute right-4 top-4 z-10 size-8 flex items-center justify-center rounded-full bg-black/5 active:bg-black/10"
                @tap="handleClose">
                <text class="iconfont icon-close text-lg theme-color-7 text-on-surface-variant/70"></text>
            </view>
            <view class="relative z-[1] w-full pt-2 shrink-0">
                <view class="text-base font-medium text-on-surface px-2 mb-4">{{ title }}</view>
            </view>
            <view class="relative z-[1] w-full space-y-3 text-left">
                <view v-for="item in effectiveFields" :key="item.key" class="w-full">
                    <text
                        v-if="fieldLabelVisible(item.label)"
                        class="block text-[22rpx] theme-color-7 mb-1.5 pl-1">{{ item.label }}</text>
                    <!-- group + focus-within：聚焦本项 input 时右侧图标高亮（与原先单项一致） -->
                    <view class="relative group w-full">
                        <input
                            class="h-[100rpx] leading-[100rpx] bg-theme-13 border-2 mx-auto text-[30rpx] border-transparent focus:border-primary/50 focus:ring-0 rounded-full px-[40rpx] transition-all outline-none w-full box-border"
                            :placeholder="item.placeholder"
                            :disabled="item.disabled"
                            :class="item.disabled ? 'theme-color-6' : ''"
                            type="text"
                            :value="formValues[item.key]"
                            @input="(e) => onFieldInput(item.key, e)" />
                        <text
                            v-if="resolvedFieldIcon(item)"
                            :class="resolvedFieldIconClassList(item)"
                            class="text-[48rpx] absolute right-5 top-1/2 -translate-y-1/2 group-focus-within:text-primary pointer-events-none transition-colors" />
                    </view>
                </view>
            </view>
            <view class="relative z-[1] mt-8 flex w-full gap-3 justify-center shrink-0">
                <view
                    class="flex-1 px-4 py-2.5 rounded-full bg-theme-12 theme-color-7 text-on-surface-variant font-label text-xs tracking-widest active:opacity-80 text-center"
                    @tap="handleClose">
                    {{ cancelText }}
                </view>
                <view
                    class="flex-1 px-4 py-2.5 rounded-full bg-theme-1 theme-color-7 text-on-surface font-label text-xs tracking-widest active:opacity-80 text-center"
                    @tap="handleConfirm">
                    {{ confirmText }}
                </view>
            </view>
        </view>
        </view>
    </transition>
</template>

<script setup lang="ts">
import type { ToastProps, ToastInputField } from '@/types/pages/component';

const props = withDefaults(
    defineProps<ToastProps>(),
    {
        show: false,
        title: '提示',
        fields: undefined,
        icon: 'icon-Edit',
        iconColor: 'theme-color-12',
        placeholder: '请输入',
        cancelText: '取消',
        confirmText: '确定',
        maskClosable: true,
        defaultValue: '',
        required: false
    }
);

const emit = defineEmits<{
    'update:show': [value: boolean];
    close: [];
    /** 多项时为 { [key]: 输入值 }；单项兼容为 { value: string } */
    confirm: [value: Record<string, string>];
}>();

const visible = computed({
    get: () => props.show,
    set: (v: boolean) => emit('update:show', v)
});

/** 未传 label、或仅空白：不展示标题行 */
function fieldLabelVisible(label: string | undefined | null) {
    if (label === undefined || label === null) return false;
    return String(label).trim() !== '';
}

/**
 * 行尾图标类名：不传用 props.icon；传 `''` 不显示。
 */
function resolvedFieldIcon(f: ToastInputField): string | null {
    if (f.icon === '') return null;
    if (f.icon != null && String(f.icon).trim() !== '') return String(f.icon).trim();
    if (props.icon === '') return null;
    const d = props.icon;
    return d != null && String(d).trim() !== '' ? String(d).trim() : null;
}

/**
 * 行尾图标颜色类：不传用 props.iconColor；传 `''` 不加颜色类。
 */
function resolvedFieldIconColor(f: ToastInputField): string | null {
    if (f.iconColor === '') return null;
    if (f.iconColor != null && String(f.iconColor).trim() !== '') return String(f.iconColor).trim();
    if (props.iconColor === '') return null;
    const d = props.iconColor;
    return d != null && String(d).trim() !== '' ? String(d).trim() : null;
}

function resolvedFieldIconClassList(f: ToastInputField): string[] {
    const name = resolvedFieldIcon(f);
    if (!name) return [];
    const color = resolvedFieldIconColor(f);
    const list = ['iconfont', name];
    if (color) list.push(color);
    return list;
}

/** 无 fields 时退化为一条 key=value */
const effectiveFields = computed((): ToastInputField[] => {
    if (props.fields && props.fields.length > 0) {
        return props.fields.map((f) => ({
            ...f,
            placeholder: f.placeholder ?? '请输入',
            required: f.required !== undefined ? f.required : props.required
        }));
    }
    return [
        {
            key: 'value',
            placeholder: props.placeholder,
            defaultValue: props.defaultValue,
            required: props.required
        }
    ];
});

const formValues = ref<Record<string, string>>({});

function resetFormFromProps() {
    const next: Record<string, string> = {};
    for (const f of effectiveFields.value) {
        next[f.key] = f.defaultValue ?? '';
    }
    formValues.value = next;
}

watch(
    () => props.show,
    (open) => {
        if (open) resetFormFromProps();
    }
);

watch(
    () => [props.fields, props.defaultValue, props.placeholder] as const,
    () => {
        if (props.show) resetFormFromProps();
    },
    { deep: true }
);

function onFieldInput(key: string, e: unknown) {
    const ev = e as { detail?: { value?: string } };
    formValues.value = {
        ...formValues.value,
        [key]: String(ev.detail?.value ?? '')
    };
}

function handleClose() {
    visible.value = false;
    emit('close');
}

function handleConfirm() {
    const out: Record<string, string> = {};
    for (const f of effectiveFields.value) {
        const raw = (formValues.value[f.key] ?? '').trim();
        const need = f.required === true;
        if (need && !raw) {
            uni.showToast({
                title: fieldLabelVisible(f.label) ? `请填写${String(f.label).trim()}` : '请填写完整',
                icon: 'none'
            });
            return;
        }
        out[f.key] = raw;
    }
    emit('confirm', out);
    visible.value = false;
}

function onMaskTap() {
    if (!props.maskClosable) return;
    handleClose();
}
</script>

<style scoped lang="scss">
/* 遮罩淡入淡出 */
.toast-modal-enter-active,
.toast-modal-leave-active {
    transition: opacity 0.22s ease;
}

.toast-modal-enter-from,
.toast-modal-leave-to {
    opacity: 0;
}

/* 内容卡片：轻微上浮 + 缩放（进入略带回弹感） */
.toast-modal-enter-active .toast-modal-panel,
.toast-modal-leave-active .toast-modal-panel {
    transition:
        transform 0.32s cubic-bezier(0.34, 1.35, 0.64, 1),
        opacity 0.26s ease;
}

.toast-modal-enter-from .toast-modal-panel,
.toast-modal-leave-to .toast-modal-panel {
    opacity: 0;
    transform: scale(0.94) translateY(16px);
}

.toast-modal-leave-to .toast-modal-panel {
    transform: scale(0.96) translateY(8px);
}
</style>
