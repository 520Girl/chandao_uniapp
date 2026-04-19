<template>
  <view class="flex flex-col min-h-screen theme-bg">
    <lcrBar :title="'账户管理'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
    <view class="w-full px-4 pt-10 pb-24 flex flex-col gap-8 flex-grow">
      <!-- Section Header -->
      <view class="space-y-1">
        <view class="font-label text-xs text-on-surface-variant tracking-widest opacity-60 uppercase">打理自己的静心小世界
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
            <!-- #ifdef MP-WEIXIN -->
            <button open-type="chooseAvatar" @chooseavatar="onChooseWechatAvatar"
              class="absolute bottom-1 right-1 bg-theme-1 text-white px-[10rpx] leading-[2] rounded-full shadow-lg hover:scale-105 transition-transform">
              <text class="iconfont icon-camera text-sm theme-color-3"></text>
            </button>
            <!-- #endif -->
            <!-- #ifndef MP-WEIXIN -->
            <button @click="show = true"
              class="absolute bottom-1 right-1 bg-theme-1 text-white px-[10rpx] leading-[2] rounded-full shadow-lg hover:scale-105 transition-transform">
              <text class="iconfont icon-camera text-sm theme-color-3"></text>
            </button>
            <!-- #endif -->
          </view>
          <!-- Nickname Input -->
          <view class="w-full space-y-1 box-border  px-3 ">
            <view class="text-[28rpx] font-medium theme-color-1 px-[5rpx] mb-[10rpx]">昵称</view>
            <view class="relative group">
              <!-- #ifdef MP-WEIXIN -->
              <input class="
                        h-[100rpx] leading-[100rpx]
                        bg-theme-13 border-2 mx-auto text-[30rpx]
                        border-transparent focus:border-primary/50 
                        focus:ring-0 rounded-full px-[40rpx] transition-all 
                        outline-none " placeholder="请输入昵称" type="nickname" v-model="nickNameModel"
                @blur="onNicknameBlur" />
              <!-- #endif -->
              <!-- #ifndef MP-WEIXIN -->
              <input class="
                            h-[100rpx] leading-[100rpx]
                            bg-theme-13 border-2 mx-auto text-[30rpx]
                            border-transparent focus:border-primary/50 
                            focus:ring-0 rounded-full px-[40rpx] transition-all 
                        outline-none " placeholder="请输入昵称" type="text" v-model="nickNameModel" />
              <!-- #endif -->
              <text
                class="icon-Edit iconfont theme-color-12 text-[48rpx] absolute right-5 top-1/2 -translate-y-1/2  group-focus-within:text-primary"></text>
            </view>
          </view>
          <view class="w-full box-border px-3">
            <view class="text-[28rpx] font-medium theme-color-1 px-[5rpx] mb-[10rpx]">手机号</view>
            <view class="relative group">
            <!-- #ifdef MP-WEIXIN -->
            <button open-type="getPhoneNumber" @getphonenumber="onGetWechatPhone"
              class="h-[100rpx] leading-[100rpx] bg-theme-13 border-2 border-transparent rounded-full px-[40rpx] pr-[96rpx] text-[30rpx] theme-color-5 text-left w-full">
              {{ displayPhone === '未绑定手机号' ? '点击授权获取手机号' : displayPhone }}
            </button>
            <!-- #endif -->
            <!-- #ifndef MP-WEIXIN -->
            <view
              class="h-[100rpx] leading-[100rpx] bg-theme-13 border-2 border-transparent rounded-full px-[40rpx] pr-[96rpx] text-[30rpx] theme-color-5">
              {{ displayPhone }}
            </view>
            <!-- #endif -->
            <text class="iconfont icon-shouji theme-color-12 text-[42rpx] absolute right-[36rpx] top-1/2 -translate-y-1/2 pointer-events-none"></text>
            </view>
               <text
            class="text-[20rpx] text-[#d4af3599] text-center uppercase tracking-tighter text-center w-full margin-auto block">账号ID:
            #{{ userID }}</text>
          </view>
        
        </view>
      </view>
      <!-- Hint Text -->

      <view class="mt-auto pt-10 text-center">
        <view class="mt-24 mb-1 text-center">
          <button @click="onSaveProfile"
            class="w-full py-5 px-8 rounded-full bg-primary text-white font-label text-sm font-semibold uppercase tracking-[0.15rem] shadow-lg shadow-primary/20 button-transition">
            保存个人信息
          </button>
        </view>
        <view class="font-label text-[10px] leading-relaxed text-on-surface-variant/40 tracking-[0.15em] pt-1">
          <view>可以修改昵称</view>
          <view>头像、手机号</view>
        </view>
      </view>
    </view>
    <!-- 选项头像  -->
    <up-action-sheet :actions="list" :round="10" :cancelText="'取消'" @close="close" @select="onSelectAvatarAction"
      :show="show"></up-action-sheet>
  </view>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { navigateBack } from '@/utils/navigation';
import lcrBar from '@/components/lcrBar.vue';
import { postUserMiniPhone, uploadImage } from '@/assets/js/api/user';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

// 绑定 pinia 用户状态，自动响应 UI
const userStore = useUserStore();
const { nickName, avatarUrl, userID, phone } = storeToRefs(userStore);

const nickNameModel = ref(nickName.value);
watch(nickName, (v) => {
  nickNameModel.value = v;
});

const displayPhone = computed(() => {
  const value = String(phone.value || '').trim();
  if (!value) return '未绑定手机号';
  return value;
});

// 控制操作弹窗显示
const show = ref(false);
// 上传状态防抖，防止重复提交
const uploading = ref(false);
const bindingPhone = ref(false);
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
// 关闭弹窗
const close = () => {
  show.value = false;
};


/**
 * 检查文件大小是否小于或等于压缩阈值，如果是，则直接返回文件路径。
 * 如果文件大小大于压缩阈值，则使用uni.compressImage函数压缩图片。
 * 如果压缩成功，则返回压缩后的图片路径。
 * 如果压缩失败，则返回原始文件路径。
 *
 * @param {string} filePath - 图片文件路径
 * @param {number} [size=0] - 文件大小（单位：字节）
 * @return {Promise<string>} - Promise对象，解析为图片文件路径
 */
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

/**
 * 选择图片并上传
 * @param {Array<'album' | 'camera'>} sourceType - 选择图片的来源，支持 'album' 和 'camera'
 * @returns {Promise<void>} - 上传结果
 */
const chooseAndUploadAvatar = async (sourceType: Array<'album' | 'camera'>) => {
  if (uploading.value) return;
  uploading.value = true;
  try {
    const chooseRes = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType
    });
    console.log('选择图片结果:', chooseRes);
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
    console.log('选择的图片路径:', filePath, '文件大小:', file?.size);
    uni.showLoading({
      title: '上传中...',
      mask: true
    });

    const finalPath = await maybeCompressImage(filePath, file?.size || 0);
    console.log('最终上传的图片路径:', finalPath);
    await uploadAvatarByFilePath(finalPath);
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

/**
 * 选择头像来源
 * @param {object} item - 选择结果，包含name字段
 * @param {string} item.name - 选择来源，支持 '拍照' 和 '从相册选择'
 */
const onSaveProfile = async () => {
  try {
    const updateData: any = {
      nickName: nickNameModel.value
    };
    if (avatarUrl.value) {
      updateData.avatarUrl = avatarUrl.value;
    }
    await userStore.updateUser(updateData);
    uni.showToast({ title: '保存成功', icon: 'success' });
  } catch (err: any) {
    uni.showToast({ title: err?.message || '保存失败', icon: 'none' });
  }
};

const onSelectAvatarAction = (item: { name?: string }) => {
  // 根据选择来源调用不同上传逻辑
  if (item?.name === '拍照') {
    chooseAndUploadAvatar(['camera']);
    return;
  }
  if (item?.name === '从相册选择') {
    chooseAndUploadAvatar(['album']);
  }
};

const onChooseWechatAvatar = async (event: { detail?: { avatarUrl?: string } }) => {
  const localAvatarPath = event?.detail?.avatarUrl || '';
  if (!localAvatarPath) {
    uni.showToast({
      title: '未获取到头像文件',
      icon: 'none'
    });
    return;
  }

  if (uploading.value) return;
  uploading.value = true;
  try {
    uni.showLoading({ title: '上传中...', mask: true });
    await uploadAvatarByFilePath(localAvatarPath);
  } catch {
    uni.showToast({
      title: '头像更新失败，请重试',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
    uploading.value = false;
  }
};

const uploadAvatarByFilePath = async (filePath: string) => {
  const key = `avatar_${userID.value || 'unknown'}_${Date.now()}.jpg`;
  const uploadRes = await uploadImage({
    filePath,
    name: 'file',
    key,
    scene: 'avatar',
    formData: {
      key,
      scene: 'avatar'
    }
  });

  if (uploadRes.code !== 1000 || !uploadRes.data) {
    throw new Error(uploadRes.message || '上传失败');
  }

  await userStore.updateUser({ avatarUrl: uploadRes.data });
  uni.showToast({
    title: '头像上传成功',
    icon: 'success'
  });
};

const onNicknameBlur = (event: any) => {
  const value = String(event?.detail?.value || '').trim();
  if (value) {
    nickNameModel.value = value;
  }
};

const onGetWechatPhone = async (event: { detail?: { code?: string; encryptedData?: string; iv?: string; errMsg?: string } }) => {
  const detail = event?.detail || {};
  const errMsg = String(detail.errMsg || '');
  if (!detail.code && (errMsg.includes('fail') || errMsg.includes('deny') || errMsg.includes('cancel'))) {
    uni.showToast({
      title: '你已取消手机号授权',
      icon: 'none'
    });
    return;
  }

  if (!detail.code) {
    uni.showToast({
      title: '未获取到手机号凭证',
      icon: 'none'
    });
    return;
  }

  if (bindingPhone.value) return;
  bindingPhone.value = true;
  try {
    uni.showLoading({ title: '绑定中...', mask: true });
    const res = await postUserMiniPhone({
      code: detail.code,
      encryptedData: detail.encryptedData || '',
      iv: detail.iv || ''
    });

    if (res.code !== 1000) {
      throw new Error(res.message || '手机号绑定失败');
    }

    if (res.data) {
      userStore.setUser(res.data);
    } else {
      await userStore.fetchUserProfile();
    }

    uni.showToast({
      title: '手机号绑定成功',
      icon: 'success'
    });
  } catch (error: any) {
    uni.showToast({
      title: error?.message || '手机号绑定失败',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
    bindingPhone.value = false;
  }
};

const onBack = () => {
  navigateBack();
};
</script>
<style scoped lang="scss"></style>