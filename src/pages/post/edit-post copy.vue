<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
      <lcrBar :title="'发布动态'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
      <view class="max-w-2xl mx-auto px-6 pb-24">
        <!-- Morning Greeting -->
        <view class="py-8 text-center">
            <view class="text-primary text-xs tracking-[0.3em] uppercase opacity-80">晨曦微露</view>
            <view class="mt-2 text-xl font-light tracking-tight">捕捉当下的心境</view>
        </view>
        <!-- Text Input Area -->
        <view class="mt-4">
            <textarea
                v-model="content"
                class="w-full min-h-[200px] bg-transparent border-none focus:ring-0 text-lg font-light leading-relaxed placeholder-poetic resize-none p-0"
                placeholder="这一刻，情绪如云影掠过..."></textarea>
        </view>
        <!-- Media Upload Grid -->
        <view class="mt-8 post-upload-wrap">
          <up-upload
            :fileList="fileList"
            :multiple="true"
            :maxCount="9"
            :useSlot="true"
            name="file"
            @afterRead="onAfterRead"
            @delete="onDeleteFile"
          >
            <view
              slot="addBtn"
              class="aspect-square rounded-[60rpx] bg-primary/5 dark:bg-primary/10 border border-dashed border-primary/30 flex flex-col items-center justify-center transition-colors group"
            >
              <text
                class="iconfont icon-add_a_photo theme-color-1 text-[60rpx] group-hover:scale-110 transition-transform"
              ></text>
              <text class="mt-2 text-[20rpx] tracking-widest theme-color-1">添加影像</text>
            </view>
          </up-upload>
        </view>
        <!-- Emotion Tags -->
        <view class="mt-12">
            <view class="text-[20rpx] tracking-[0.2em] theme-color-2 mb-4 font-medium uppercase text-center">选择情绪标签</view>
            <view class="flex flex-wrap justify-center gap-3">
                <view
                    class="flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-white/5 border border-primary/10 hover:border-primary/40 transition-colors shadow-sm">
                    <text class="iconfont icon-Cloudy text-[28rpx] theme-color-1"></text>
                    <text class="text-[32rpx] font-light theme-color-5">漂浮</text>
                </view>
                <view
                    class="flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 transition-colors shadow-sm">
                    <text class="iconfont icon-ink-water-drop text-[28rpx] theme-color-1"></text>
                    <text class="text-[32rpx] font-medium theme-color-5">宁静</text>
                </view>
                <view
                    class="flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-white/5 border border-primary/10 hover:border-primary/40 transition-colors shadow-sm">
                    <text class="iconfont icon-wind text-[28rpx] theme-color-1"></text>
                    <text class="text-[32rpx] font-light theme-color-5">消散</text>
                </view>
                <view
                    class="flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-white/5 border border-primary/10 hover:border-primary/40 transition-colors shadow-sm">
                    <text class="iconfont icon-lightbulb text-[28rpx] theme-color-1"></text>
                    <text class="text-[32rpx] font-light theme-color-5">觉察</text>
                </view>
            </view>
        </view>
        <!-- Linked Meditation Session -->
        <view class="mt-12">
            <view class="text-[20rpx] tracking-[0.2em] text-primary/70 mb-4 font-medium uppercase text-center">关联冥想 Session
            </view>
            <view
                class="bg-white dark:bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-primary/5 group">
                <view class="flex items-center gap-4">
                    <view class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <text class="iconfont icon-self_improvement text-[48rpx] theme-color-1"></text>
                    </view>
                    <view>
                        <h3 class="text-[28rpx] font-medium tracking-wide theme-color-5">云端观息：清晨冥想</h3>
                        <view class="text-[24rpx] theme-color-2 mt-1 font-light">12分钟 · 已完成</view>
                    </view>
                </view>
                <view class="text-primary/40 hover:text-primary transition-colors">
                    <text class="iconfont icon-sync_alt text-[48rpx] theme-color-12"></text>
                </view>
            </view>
        </view>
    </view>
    <!-- Floating Action Toolbar -->
    <nav class="fixed bottom-0 left-0 right-0 p-6 pointer-events-none">
        <view
            class="max-w-md mx-auto bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl rounded-full border border-primary/10 shadow-xl flex items-center justify-around py-3 px-8 pointer-events-auto">
            <view class="flex flex-col items-center gap-1 group">
                <text
                    class="iconfont icon-sell text-[48rpx] theme-color-1 group-hover:text-primary transition-colors"></text>
                <text class="text-[16rpx] tracking-widest theme-color-2 uppercase">标签</text>
            </view>
            <view class="flex flex-col items-center gap-1 group">
                <text
                    class="iconfont icon-MapPin text-[48rpx] theme-color-1 group-hover:text-primary transition-colors"></text>
                <text class="text-[16rpx] tracking-widest theme-color-2 uppercase">位置</text>
            </view>
            <view class="flex flex-col items-center gap-1 group">
                <text
                    class="iconfont icon-lockopen text-[48rpx] theme-color-1 group-hover:text-primary transition-colors"></text>
                <text class="text-[16rpx] tracking-widest theme-color-2 uppercase">可见</text>
            </view>
        </view>
    </nav>
    </view>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue';
  import { navigateBack } from '@/utils/navigation';
  import lcrBar from '@/components/lcrBar.vue';
  const content = ref('');
  type UploadItem = {
    url: string;
    name?: string;
  };

  const fileList = ref<UploadItem[]>([]);

  const onAfterRead = (event: { file: { url: string } | { url: string }[] }) => {
    const files = Array.isArray(event.file) ? event.file : [event.file];
    const next = files.map((item, idx) => ({
      url: item.url,
      name: `image-${Date.now()}-${idx}`
    }));
    fileList.value = [...fileList.value, ...next];
  };

  const onDeleteFile = (event: { index: number }) => {
    fileList.value.splice(event.index, 1);
  };
  
  const onBack = () => {
    navigateBack();
  };


  onLoad((query: any) => {
    if(query.type === 'cindex') {
     content.value = query.content;
    } else {
      content.value = query.content;
    }
  });


  </script>
  <style scoped lang="scss">
  :deep(.u-upload) {
    width: 100%;
  }

  :deep(.u-upload__wrap) {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12rpx;
  }

  :deep(.u-upload__wrap__preview),
  :deep(.u-upload__wrap__slot) {
    width: 100% !important;
    aspect-ratio: 1 / 1;
    border-radius: 60rpx !important;
    overflow: hidden;
  }

  :deep(.u-upload__wrap__preview__image) {
    width: 100% !important;
    height: 100% !important;
    border-radius: 60rpx !important;
    object-fit: cover !important;
  }

  :deep(.u-upload__deletable) {
    top: 12rpx !important;
    right: 12rpx !important;
    width: 44rpx !important;
    height: 44rpx !important;
    border-radius: 9999rpx !important;
    background: rgba(0, 0, 0, 0.2) !important;
    backdrop-filter: blur(8rpx);
    display: flex !important;
    align-items: center;
    text-align: center;
    margin: auto;
    justify-content: center;
  }

  :deep(.u-upload__deletable__icon .u-icon__icon) {
    font-size: 30rpx !important;
    font-weight: 700;
    top: 3px;
    right: 3px;
    text-align: center;
  }
  </style>