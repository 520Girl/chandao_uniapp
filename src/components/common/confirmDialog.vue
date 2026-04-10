<template>
    <transition name="confirm-modal">
        <view
            v-if="visible"
            class="confirm-modal-mask fixed inset-0 z-[100] bg-on-background/10 backdrop-blur-md flex items-center justify-center p-6"
            @tap="onMaskTap">
            <view
                class="confirm-modal-panel overflow-hidden bg-surface-container-lowest w-full max-w-[320px] rounded-[40px] p-4 flex flex-col items-center text-center shadow-2xl relative"
                @tap.stop>
                <view
                    class="absolute overflow-hidden inset-0 pointer-events-none cloud-pattern theme-bg opacity-90 rounded-[40px]" />
                <view
                    class="absolute top-[-20rpx] left-[-20rpx] w-24 h-24 mb-4 flex items-center justify-center shrink-0">
                    <view
                        class="absolute inset-0 border-2 iconfont icon-auto_awesome theme-color-8 text-[60rpx] border-dashed border-tertiary/20 rounded-full animate-[spin_10s_linear_infinite]" />
                </view>
                <view
                    v-if="showClose"
                    class="absolute right-4 top-4 z-10 size-8 flex items-center justify-center rounded-full bg-black/5 active:bg-black/10"
                    @tap="handleDismiss">
                    <text class="iconfont icon-close text-lg theme-color-7 text-on-surface-variant/70" />
                </view>
                <view class="relative z-[1] w-full pt-2 shrink-0 px-1">
                    <view class="text-base font-medium text-on-surface mb-2">{{ title }}</view>
                    <view
                        v-if="hasMessage"
                        class="text-sm theme-color-7 text-on-surface-variant/90 leading-relaxed whitespace-pre-wrap">
                        {{ message }}
                    </view>
                </view>
                <view class="relative z-[1] mt-8 flex w-full gap-3 justify-center shrink-0">
                    <view
                        class="flex-1 px-4 py-2.5 rounded-full bg-theme-12 theme-color-7 text-on-surface-variant font-label text-xs tracking-widest active:opacity-80 text-center"
                        @tap="handleCancel">
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
import type { ConfirmDialogProps } from "@/types/pages/component";

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
    show: false,
    title: "提示",
    message: "",
    cancelText: "取消",
    confirmText: "确定",
    maskClosable: false,
    showClose: false
});

const emit = defineEmits<{
    "update:show": [value: boolean];
    /** 左侧取消按钮 */
    cancel: [];
    confirm: [];
    /** 遮罩或右上角关闭 */
    dismiss: [];
}>();

const visible = computed({
    get: () => props.show,
    set: (v: boolean) => emit("update:show", v)
});

const hasMessage = computed(() => String(props.message ?? "").trim() !== "");

function handleCancel() {
    visible.value = false;
    emit("cancel");
}

function handleConfirm() {
    emit("confirm");
    visible.value = false;
}

function handleDismiss() {
    visible.value = false;
    emit("dismiss");
}

function onMaskTap() {
    if (!props.maskClosable) return;
    handleDismiss();
}
</script>

<style scoped lang="scss">
.confirm-modal-enter-active,
.confirm-modal-leave-active {
    transition: opacity 0.22s ease;
}

.confirm-modal-enter-from,
.confirm-modal-leave-to {
    opacity: 0;
}

.confirm-modal-enter-active .confirm-modal-panel,
.confirm-modal-leave-active .confirm-modal-panel {
    transition:
        transform 0.32s cubic-bezier(0.34, 1.35, 0.64, 1),
        opacity 0.26s ease;
}

.confirm-modal-enter-from .confirm-modal-panel,
.confirm-modal-leave-to .confirm-modal-panel {
    opacity: 0;
    transform: scale(0.94) translateY(16px);
}

.confirm-modal-leave-to .confirm-modal-panel {
    transform: scale(0.96) translateY(8px);
}
</style>
