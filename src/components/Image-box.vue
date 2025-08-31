<template>
    <view class="amx-imageBox">
        <view class="imageBox-item">
            <image class="imageBox-image" :src="imgurl" mode="widthFix" width="100%" />
        </view>
    </view>
</template>

<script setup lang="ts">
interface ImageBoxProps {
    imgurl: string;
    type?: number;
    text?: string;
}
const props = withDefaults(defineProps<ImageBoxProps>(), {
    imgurl: '',
    type: 1,
    text: '',
});
</script>
<style scoped lang="scss">
@include b(imageBox) {
    width: 100%;
    height: 100%;
    @apply relative w-full h-full;

    .imageBox-item {
        @apply w-full h-full;

        .imageBox-image {
            @apply w-full h-full;
            line-height: 0;
            display: block;
        }
    }
}
</style>