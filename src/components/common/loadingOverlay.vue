<template>
    <transition name="loading-modal">
        <view
            v-if="visible"
            class="loading-modal-root fixed inset-0 z-[110] flex items-center justify-center p-6"
            :class="mask ? 'bg-on-background/10 backdrop-blur-md' : 'pointer-events-none bg-transparent'">
            <view
                class="loading-modal-panel bg-surface-container-lowest min-w-[200px] max-w-[280px] rounded-[40px] px-8 py-10 flex flex-col items-center text-center shadow-2xl relative pointer-events-auto"
                @tap.stop>
                <view
                    class="absolute inset-0 pointer-events-none cloud-pattern theme-bg opacity-90 rounded-[40px]" />
                <view class="relative z-[1] flex flex-col items-center w-full">
                    <view class="relative w-20 h-20 mb-5 flex items-center justify-center shrink-0">
                        <view
                            class="absolute inset-0 border-2 border-dashed border-tertiary/25 rounded-full animate-[spin_10s_linear_infinite]" />
                        <text
                            class="iconfont icon-auto_awesome theme-color-8 text-[56rpx] animate-[spin_1.2s_linear_infinite]" />
                    </view>
                    <view v-if="hasText" class="text-sm theme-color-7 text-on-surface-variant font-medium leading-relaxed">
                        {{ text }}
                    </view>
                </view>
            </view>
        </view>
    </transition>
</template>

<script setup lang="ts">
import type { LoadingOverlayProps } from "@/types/pages/component";

const props = withDefaults(defineProps<LoadingOverlayProps>(), {
    show: false,
    text: "加载中…",
    mask: true
});

const emit = defineEmits<{
    "update:show": [value: boolean];
}>();

const visible = computed({
    get: () => props.show,
    set: (v: boolean) => emit("update:show", v)
});

const hasText = computed(() => String(props.text ?? "").trim() !== "");
</script>

<style scoped lang="scss">
.loading-modal-enter-active,
.loading-modal-leave-active {
    transition: opacity 0.22s ease;
}

.loading-modal-enter-from,
.loading-modal-leave-to {
    opacity: 0;
}

.loading-modal-enter-active .loading-modal-panel,
.loading-modal-leave-active .loading-modal-panel {
    transition:
        transform 0.32s cubic-bezier(0.34, 1.35, 0.64, 1),
        opacity 0.26s ease;
}

.loading-modal-enter-from .loading-modal-panel,
.loading-modal-leave-to .loading-modal-panel {
    opacity: 0;
    transform: scale(0.94) translateY(12px);
}

.loading-modal-leave-to .loading-modal-panel {
    transform: scale(0.96) translateY(6px);
}
</style>
