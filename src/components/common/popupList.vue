<template>
    <up-popup :show="show" :round="10" mode="bottom" @close="close" @open="open">
        <view  style="height: 100rpx;" v-for="value in list" :key="value.name"
            class="flex items-center justify-center"
        >
            <text :style="{ fontSize: value.fontSize }">{{ value.name }}</text>
        </view>
    </up-popup>
</template>
<script setup lang="ts">
const show = ref(true);
const list = ref([
   {  
     name: '拍照',  
     fontSize: '28rpx'  
   },  
   {  
     name: '从相册选择',  
      fontSize: '28rpx'  
   },
   {  
     name: '取消',  
      fontSize: '28rpx'  
   }
 ]);
const close = () => {  
    show.value = false;
};
const open = () => {  
    show.value = true;
};
</script>
<style scoped lang="scss">

</style>