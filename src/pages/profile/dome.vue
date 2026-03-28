<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
    <lcrBar :title="'账户管理'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
   
  </view>
</template>
<script setup lang="ts">
import { navigateBack } from '@/utils/navigation';
import lcrBar from '@/components/lcrBar.vue';

const onBack = () => {
  navigateBack();
};
</script>
<style scoped lang="scss">

</style>