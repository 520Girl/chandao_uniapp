<template>
    <view class="flex flex-col min-h-screen theme-bg">
        <lcrBar :title="'账户管理'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
        <view class="w-full px-4 pt-10 pb-24 flex flex-col gap-8 flex-grow">
            <!-- Section Header -->
            <view class="space-y-1">
                <view class="font-label text-xs text-on-surface-variant tracking-widest opacity-60 uppercase">云息坚持内心，做自己
                </view>
            </view>
            <!-- Device List -->
            <view class="space-y-6">
                <!-- <view class="text-[24rpx] font-bold uppercase tracking-widest theme-color-1 mb-[46rpx]">个人身份</view> -->
                <view class="flex flex-col items-center gap-6">
                    <!-- Avatar Container -->
                    <view class="relative group">
                        <view class="size-32 rounded-full border-4 border-primary/20 p-1 animate-puls">
                            <view class="w-full h-full rounded-full bg-cover bg-center shadow-inner overflow-hidden"
                                data-alt="Modern minimalist user profile avatar portrait"
                                :style="`background-image: url('${avatarUrl}')`">
                            </view>
                        </view>
                        <button
                            @click="show = true"
                            class="absolute bottom-1 right-1 bg-theme-1 text-white px-[10rpx] leading-[2] rounded-full shadow-lg hover:scale-105 transition-transform">
                            <text class="iconfont icon-camera text-sm theme-color-3"></text>
                        </button>
                    </view>
                    <!-- Nickname Input -->
                    <view class="w-full space-y-2 box-border  px-3 ">
                        <view class="text-[28rpx] font-medium theme-color-1 px-[5rpx] mb-[10rpx]">昵称</view>
                        <view class="relative group">
                            <input style="height:70rpx;min-height:auto;line-height:1;" class="
                            bg-theme-13 border-2 mx-auto h-[70rpx] text-[30rpx]
                            border-transparent focus:border-primary/50 
                            focus:ring-0 rounded-full px-[40rpx] py-[20rpx] transition-all 
                            outline-none " placeholder="Enter your nickname" type="text" v-model="nickname" />
                            <text
                                class="icon-Edit iconfont theme-color-12 text-[48rpx] absolute right-5 top-1/2 -translate-y-1/2  group-focus-within:text-primary"></text>
                        </view>
                        <text
                            class="text-[20rpx] text-[#d4af3599] text-center uppercase tracking-tighter text-center w-full margin-auto block">账号ID:
                            #882930</text>
                    </view>
                </view>
            </view>
            <!-- Hint Text -->

            <view class="mt-auto pt-10 text-center">
                <view class="mt-24 mb-1 text-center">
                    <button
                        class="w-full py-5 px-8 rounded-full bg-primary text-white font-label text-sm font-semibold uppercase tracking-[0.15rem] shadow-lg shadow-primary/20 button-transition">
                        保存个人信息
                    </button>
                </view>
                <view class="font-label text-[10px] leading-relaxed text-on-surface-variant/40 tracking-[0.15em] pt-1">
                    <view>可以修改昵称</view><view>头像</view>
                </view>
            </view>
        </view>
        <!-- 选项头像  -->
         <up-action-sheet
            :actions="list"
            :round="10"
            :cancelText="'取消'"
            @close="close"
            @select="onSelectAvatarAction"
            :show="show"
        ></up-action-sheet>
    </view>
</template>
<script setup lang="ts">
import { navigateBack } from '@/utils/navigation';
import lcrBar from '@/components/lcrBar.vue';
import { uploadImage } from '@/assets/js/api/user';

const nickname = ref('嗲日期');
const show = ref(false);
const avatarUrl = ref('/static/770-800x600.jpg');
const uploading = ref(false);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const COMPRESS_THRESHOLD = 1024 * 1024; // 1MB
const list = ref([  
  {  
    name: '拍照',  
    fontSize: '28rpx'

  },  
  {  
    name: '从相册选择',  
     fontSize: '28rpx'

  }
]);  
const popupData = reactive({  
  mode: 'center'  
});
// 关闭弹窗
const close = () => {  
  show.value = false;  
};

const normalizeUploadUrl = (url: string) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return url;
  return `/${url}`;
};

const extractUploadedUrl = (res: any) => {
  return (
    res?.data?.url ||
    res?.data?.fileUrl ||
    res?.data?.path ||
    res?.url ||
    ''
  );
};

const maybeCompressImage = (filePath: string, size = 0) => {
  if (size <= COMPRESS_THRESHOLD) return Promise.resolve(filePath);

  return new Promise<string>((resolve) => {
    uni.compressImage({
      src: filePath,
      quality: 80,
      success: (res) => resolve(res.tempFilePath),
      fail: () => resolve(filePath)
    });
  });
};

const chooseAndUploadAvatar = async (sourceType: Array<'album' | 'camera'>) => {
  if (uploading.value) return;
  uploading.value = true;

  try {
    const chooseRes = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType
    });

    const filePath = chooseRes.tempFilePaths?.[0];
    const tempFiles = Array.isArray(chooseRes.tempFiles) ? chooseRes.tempFiles : [];
    const file = tempFiles[0] as { size?: number } | undefined;
    if (!filePath) {
      throw new Error('未获取到图片');
    }

    if (file?.size && file.size > MAX_IMAGE_SIZE) {
      uni.showToast({
        title: '图片不能超过5MB',
        icon: 'none'
      });
      return;
    }

    uni.showLoading({
      title: '上传中...',
      mask: true
    });

    const finalPath = await maybeCompressImage(filePath, file?.size || 0);
    const uploadRes = await uploadImage({
      filePath: finalPath,
      name: 'file'
    });

    const uploadedUrl = normalizeUploadUrl(extractUploadedUrl(uploadRes));
    avatarUrl.value = uploadedUrl || finalPath;

    uni.showToast({
      title: '头像上传成功',
      icon: 'success'
    });
  } catch (error: any) {
    const msg = error?.errMsg || error?.message || '';
    if (msg.includes('auth deny') || msg.includes('authorize')) {
      uni.showModal({
        title: '提示',
        content: '请在设置中开启相机/相册权限',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) {
            uni.openSetting();
          }
        }
      });
      return;
    }

    if (!msg.includes('cancel')) {
      uni.showToast({
        title: '上传失败，请稍后重试',
        icon: 'none'
      });
    }
  } finally {
    uni.hideLoading();
    show.value = false;
    uploading.value = false;
  }
};

const onSelectAvatarAction = (item: { name?: string }) => {
  if (item?.name === '拍照') {
    chooseAndUploadAvatar(['camera']);
    return;
  }
  if (item?.name === '从相册选择') {
    chooseAndUploadAvatar(['album']);
  }
};

const onBack = () => {
    navigateBack();
};
</script>
<style scoped lang="scss">
    
</style>