<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern overflow-x-hidden">
    <lcrBar :title="'发布动态'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
    <view class="max-w-2xl mx-auto w-full box-border px-6 pb-24 overflow-x-hidden">
      <!-- Morning Greeting -->
      <view class="py-8 text-center">
        <view class="text-primary text-xs tracking-[0.3em] uppercase opacity-80">晨曦微露</view>
        <view class="mt-2 text-xl font-light tracking-tight">捕捉当下的心境</view>
      </view>
      <!-- Text Input Area -->
      <view class="mt-4">
        <textarea v-model="content"
          class="w-full min-h-[200px] bg-transparent border-none focus:ring-0 text-lg font-light leading-relaxed placeholder-poetic resize-none p-0"
          placeholder="这一刻，情绪如云影掠过..." />
      </view>
      <!-- Media Upload Grid -->
      <view class="mt-8 post-upload-wrap">
        <up-upload :file-list="fileList" :multiple="true" :max-count="9" name="file" @after-read="onAfterRead"
          @delete="onDeleteFile">
          <view
            class="aspect-square rounded-[60rpx] bg-primary/5 dark:bg-primary/10 border border-dashed border-primary/30 flex flex-col items-center justify-center transition-colors group">
            <text
              class="iconfont icon-add_a_photo theme-color-1 text-[60rpx] group-hover:scale-110 transition-transform" />
            <text class="mt-2 text-[20rpx] tracking-widest theme-color-1">添加影像</text>
          </view>
        </up-upload>
      </view>
      <!-- Emotion Tags（文案来自 Pinia `post_user_state_list`） -->
      <view class="mt-12">
        <view class="text-[20rpx] tracking-[0.2em] theme-color-2 mb-4 font-medium uppercase text-center">
          选择观照标签
        </view>
        <view v-if="dictStore.post_user_state_list.length === 0" class="text-center text-sm theme-color-8 py-4">
          观照标签加载中…
        </view>
        <view v-else class="flex flex-wrap justify-center gap-3">
          <view
            v-for="row in dictStore.post_user_state_list"
            :key="row.value"
            class="flex items-center gap-2 px-5 py-2 rounded-full border transition-colors shadow-sm"
            :class="
              selectedUserState === row.value
                ? 'bg-primary/10 border-primary/30'
                : 'bg-white dark:bg-white/5 border-primary/10 hover:border-primary/40'
            "
            @click="selectedUserState = row.value"
          >
            <text
              class="iconfont text-[28rpx] theme-color-1"
              :class="'icon-' + postUserStateIconClassSuffix(row.value)"
            />
            <text
              class="text-[32rpx] theme-color-5"
              :class="selectedUserState === row.value ? 'font-medium' : 'font-light'"
            >
              {{ row.name }}
            </text>
          </view>
        </view>
      </view>
      <!-- 发布关联团队（样式对齐「关联冥想 Session」卡片） -->
      <view class="mt-12 mb-10">
        <view class="text-[20rpx] tracking-[0.2em] text-primary/70 mb-4 font-medium uppercase text-center">
          发布到团队 TEAM
        </view>
        <view v-if="teamStore.loading && teamStore.myCurrentTeams.length === 0"
          class="bg-white dark:bg-white/5 rounded-2xl p-6 border border-primary/5 text-center text-sm theme-color-8">
          加载团队中…
        </view>
        <view v-else-if="teamStore.myCurrentTeams.length === 0"
          class="bg-white dark:bg-white/5 rounded-2xl p-6 border border-primary/5 text-center text-sm theme-color-8">
          暂无在职团队，请先加入团队后再发布动态
        </view>
        <view v-else class="team-h-scroll-clip w-full max-w-full overflow-hidden">
          <scroll-view class="team-h-scroll" scroll-x :show-scrollbar="false">
            <view class="team-h-scroll__track">
              <view
                v-for="t in teamStore.myCurrentTeams"
                :key="t.id"
                class="team-h-scroll__card rounded-2xl p-4 flex items-center justify-between gap-3 active:opacity-90"
                :class="
                  teamStore.selectedTeamIdForPublish === t.teamId
                    ? 'bg-theme-13 border-theme-1 shadow-lg shadow-primary/10'
                    : 'bg-white border-primary/5'
                "
                @click="teamStore.setPublishTeamId(t.teamId)"
              >
                <view class="flex items-start gap-3 min-w-0 flex-1">
                  <view
                    class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-[4rpx]"
                  >
                    <text class="iconfont icon-self_improvement text-[48rpx] theme-color-1" />
                  </view>
                  <view class="min-w-0 flex-1 flex flex-col gap-1">
                    <view class="text-[28rpx] font-medium tracking-wide theme-color-5 break-words leading-snug">
                      {{ t.teamName }}
                    </view>
                    <view class="text-[24rpx] theme-color-2 font-light leading-relaxed break-words flex">
                      <text>{{ t.memberCount }} 位成员 · </text>
                      <text class="block ml-[10rpx]">
                        {{
                          teamStore.selectedTeamIdForPublish === t.teamId
                            ? "已选为发布团队"
                            : "点击选择"
                        }}
                      </text>
                    </view>
                  </view>
                </view>
                <view class="text-primary/40 shrink-0 pt-[8rpx]">
                  <text
                    class="iconfont text-[48rpx] theme-color-12"
                    :class="
                      teamStore.selectedTeamIdForPublish === t.teamId
                        ? 'icon-done-all'
                        : 'icon-sync_alt'
                    "
                  />
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view v-if="teamStore.myCurrentTeams.length > 1" class="text-center text-[22rpx] theme-color-8 mt-3">
          左右滑动查看团队，点击卡片选择发布目标
        </view>
      </view>
    </view>
    <!-- Floating Action Toolbar -->
    <nav class="fixed bottom-0 left-0 right-0 p-6 pointer-events-none">
      <view
        class="max-w-md mx-auto bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl rounded-full border border-primary/10 shadow-xl flex items-center justify-around py-3 px-8 pointer-events-auto">
        <view
          class="flex flex-col items-center  gap-[2rpx] group"
          :class="defaultPostUserState ? 'theme-color-1' : 'theme-color-6'"
          @click="onTag"
        >
          <text class="iconfont icon-sell text-[48rpx] group-hover:text-primary transition-colors" />
          <text class="text-[16rpx] tracking-widest uppercase">标签</text>
        </view>
        <view
          class="flex flex-col items-center  gap-[2rpx] group"
          :class="locationReady ? 'theme-color-1' : 'theme-color-6'"
          @click="onLocation"
        >
          <text class="iconfont icon-MapPin text-[48rpx] transition-colors" />
          <text class="text-[16rpx] tracking-widest uppercase">位置</text>
        </view>
        <view
          class="flex flex-col items-center gap-[2rpx] group"
          :class="publishVisibility === 2 ? 'theme-color-1 ' : 'theme-color-6'"
          @click="onVisible"
        >
          <text 
          class="iconfont text-[48rpx]  transition-colors"
          :class="publishVisibility === 2  ? 'icon-lockopen' : ' icon-lock1'"
           />
          <text class="text-[16rpx]  uppercase" :class="publishVisibility === 2 ? 'theme-color-1 ' : 'theme-color-6'">{{ visibilityShortLabel }}</text>
        </view>
        <view class="flex flex-col items-center  gap-[2rpx] group theme-color-6" :class="{ 'opacity-50 pointer-events-none': submitting }"
          @click="submitPost">
          <text class="iconfont icon-send text-[48rpx] transition-colors" />
          <text class="text-[16rpx] tracking-widest uppercase">
            {{ submitting ? "…" : "发布" }}
          </text>
        </view>
      </view>
    </nav>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from "@dcloudio/uni-app";
import { postPostManual } from "@/assets/js/api/post";
import { postUserLocationReport, uploadImage } from "@/assets/js/api/user";
import { BUSINESS_CODE } from "@/assets/js/config";
import { getCurrentLatLng } from "@/utils/location";
import { navigateBack } from "@/utils/navigation";
import { postUserStateIconClassSuffix } from "@/utils/postUserStateIcon";
import { useDictStore } from "@/stores/dict";
import { usePostDraftStore } from "@/stores/post";
import { useTeamStore } from "@/stores/team";
import { useUserStore } from "@/stores/user";

import lcrBar from "@/components/lcrBar.vue";

const postDraftStore = usePostDraftStore();
const dictStore = useDictStore();
const teamStore = useTeamStore();
const userStore = useUserStore();

const content = ref("");
const submitting = ref(false);
const selectedUserState = ref(2);

/** 0=仅团队 1=公开 2=仅自己（与 PostManualDTO.visibility 约定一致） */
const publishVisibility = ref(1);

const postLat = ref<number | null>(null);
const postLng = ref<number | null>(null);
const postAccuracy = ref<number | undefined>(undefined);

const locationReady = computed(
  () => postLat.value != null && postLng.value != null && Number.isFinite(postLat.value) && Number.isFinite(postLng.value),
);

const visibilityShortLabel = computed(() => {
  const v = publishVisibility.value;
  if (v === 2) return "公开";
  if (v === 1) return "私密";
});

/** 与历史默认一致：字典含 value=2 时以此为默认，否则取第一项 */
const defaultPostUserState = computed(() => {
  const rows = dictStore.post_user_state_list;
  if (rows.some((r) => r.value === 2)) return 2;
  return rows[0]?.value ?? 2;
});

function syncSelectedUserStateToDict() {
  if (!dictStore.post_user_state.has(selectedUserState.value)) {
    const first = dictStore.post_user_state_list[0];
    selectedUserState.value = first?.value ?? 2;
  }
}

function onTag() {
  const rows = dictStore.post_user_state_list;
  if (!rows.length) {
    uni.showToast({ title: "标签加载中", icon: "none" });
    return;
  }
  uni.showActionSheet({
    itemList: rows.map((r) => r.name),
    success(res) {
      const row = rows[res.tapIndex];
      if (row) {
        selectedUserState.value = row.value;
        uni.showToast({ title: `已选「${row.name}」`, icon: "none" });
      }
    },
  });
}

async function onLocation() {
  try {
    uni.showLoading({ title: "定位中…", mask: true });
    // const { latitude, longitude, accuracy } = await getCurrentLatLng({ type: "wgs84" });
    // postLat.value = latitude;
    // postLng.value = longitude;
    // postAccuracy.value = accuracy;
    uni.showToast({ title: "已记录发布位置", icon: "success" });
  } catch {
    uni.showToast({ title: "定位失败，请开启定位权限", icon: "none" });
  } finally {
    uni.hideLoading();
  }
}

function onVisible() {
  publishVisibility.value = publishVisibility.value === 2 ? 1 : 2;
  uni.showToast({ title: publishVisibility.value === 2 ? "动态「公开」" : "动态「私密」", icon: "none" });
}


type UploadItem = {
  url: string;
  name?: string;
  type?: string;
  isImage?: boolean;
};

const fileList = ref<UploadItem[]>([]);

const onAfterRead = (event: {
  file:
  | { url?: string; path?: string; name?: string }
  | Array<{ url?: string; path?: string; name?: string }>;
}) => {
  const raw = event.file;
  const files = Array.isArray(raw) ? raw : [raw];
  const next: UploadItem[] = files.map((item, idx) => ({
    url: (item.url || item.path || "") as string,
    name: item.name || `image-${Date.now()}-${idx}`,
    type: "image",
    isImage: true,
  }));
  fileList.value = [...fileList.value, ...next];
};

const onDeleteFile = (event: { index: number }) => {
  fileList.value.splice(event.index, 1);
};

function isRemoteOrServerPath(url: string): boolean {
  const u = url.trim();
  if (!u) return false;
  if (/^https?:\/\//i.test(u)) return true;
  if (u.startsWith("/") && !u.startsWith("//")) return true;
  return false;
}

async function ensureUploadedUrl(localOrRemote: string): Promise<string> {
  const u = localOrRemote.trim();
  if (!u) throw new Error("图片地址为空");
  if (isRemoteOrServerPath(u)) return u;

  const key = `post_${Date.now()}_${Math.random().toString(36).slice(2, 10)}.jpg`;
  const uploadRes = await uploadImage({
    filePath: u,
    name: "file",
    key,
    scene: "post",
    formData: { key, scene: "post" },
  });

  if (uploadRes.code !== BUSINESS_CODE.SUCCESS) {
    throw new Error(uploadRes.message || "上传失败");
  }
  const uploaded = uploadRes.data;
  if (!uploaded || typeof uploaded !== "string") {
    throw new Error("上传未返回图片地址");
  }
  return uploaded;
}

async function submitPost() {
  if (submitting.value) return;
  const text = content.value.trim();
  if (!text) {
    uni.showToast({ title: "请写一点照见再发布", icon: "none" });
    return;
  }

  const teamId = teamStore.resolvedPublishTeamId;
  if (teamId == null) {
    uni.showToast({
      title:
        teamStore.myCurrentTeams.length === 0
          ? "请先加入团队"
          : "请选择发布到的团队",
      icon: "none",
    });
    return;
  }

  submitting.value = true;
  uni.showLoading({ title: "发布中…", mask: true });
  try {
    const imageUrls: string[] = [];
    for (const item of fileList.value) {
      if (!item.url) continue;
      imageUrls.push(await ensureUploadedUrl(item.url));
    }

    const lat = postLat.value ?? undefined;
    const lng = postLng.value ?? undefined;
    const accuracy = postAccuracy.value ?? undefined;

    await postPostManual({
      content: text,
      images: imageUrls.length ? imageUrls : undefined,
      userState: selectedUserState.value,
      status:publishVisibility.value,
      teamId,
      ...(lat != null && lng != null ? { lat, lng } : {}),
      ...(accuracy != null ? { accuracy } : {}),
    });
    if (lat != null && lng != null) {
      void postUserLocationReport({
        // lat,
        // lng,
        // accuracy: postAccuracy.value,
        scene: "post_publish",
      }).catch(() => {});
    }

    uni.showToast({ title: "发布成功", icon: "success" });
    setTimeout(() => {
      navigateBack();
    }, 400);
  } catch (e: any) {
    console.error("postPostManual", e);
    uni.showToast({
      title: e?.message || e?.data?.message || "发布失败",
      icon: "none",
    });
  } finally {
    submitting.value = false;
    uni.hideLoading();
  }
}

const onBack = () => {
  navigateBack();
};

onLoad((options) => {
  if (options?.prefill === "1") {
    const s = postDraftStore.consumeCommunityPrefill();
    if (s) content.value = s;
  } else {
    postDraftStore.clearCommunityPrefill();
  }
  if (options?.content) {
    try {
      content.value = decodeURIComponent(options.content);
    } catch {
      content.value = options.content;
    }
  }
});

onShow(() => {
  void dictStore.fetchPostUserState().then(() => {
    syncSelectedUserStateToDict();
  });
  void teamStore.fetchMyCurrentTeams().then(() => {
    teamStore.syncPublishTeamFromUserFirstTeam(userStore.currentUser?.firstTeamId);
  });
});
</script>

<style scoped lang="scss">
/* 横向滑动：裁剪在 clip 内，避免撑破页面；卡片略窄于内容区（750 - 左右 padding） */
.team-h-scroll-clip {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.team-h-scroll {
  width: 100%;
  max-width: 100%;
}

.team-h-scroll__track {
  display: block;
  white-space: nowrap;
  padding: 4rpx 0 12rpx;
  box-sizing: border-box;
  font-size: 0;
}

.team-h-scroll__card {
  display: inline-flex;
  vertical-align: top;
  white-space: normal;
  width: 580rpx;
  max-width: 100%;
  margin-right: 24rpx;
  box-sizing: border-box;
  font-size: 28rpx;
}

.team-h-scroll__card:last-child {
  margin-right: 0;
}

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
