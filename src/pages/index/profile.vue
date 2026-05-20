<template>
  <view class="flex flex-col min-h-screen pb-[32rpx] theme-bg">
    <HomeBar :title="'设置'" description="随 心 自 在" :titleIcon="'icon-yonghu'" :leftIcon="'icon-Trophy'"  :handleClick="onGoToShop" />

    <view
      v-if="meditationStore.hasActiveMeditationSession"
      class="mx-4 mt-2 px-4 py-3 rounded-2xl border border-primary/20 bg-primary/5 text-on-surface"
    >
      <text class="text-[24rpx] font-medium text-primary">当前有进行中的禅修，将在静坐页继续或结束后生成报告</text>
    </view>
   
    <view class="mobile-container">
    <!-- Profile view -->
    <view class="flex-1 px-4 space-y-10">
      <!-- Avatar & Info -->
      <view class="flex flex-col items-center pt-4">
        <view class="relative group">
          <view class="w-24 h-24 rounded-full overflow-hidden mb-6 shadow-sm border border-outline-gold" @click="onGoToManage('accountManage')">
            <image alt="头像" class="w-full h-full object-cover"
              :src="avatarUrl" />
          </view>
          <view @click="onGoToManage('accountManage')" class="absolute bottom-6 right-0 bg-white p-1.5 rounded-full shadow-sm border border-outline-gold" >
            <text class="iconfont icon-beizhu text-primary text-sm" data-icon="edit"></text>
          </view>
        </view>
        <!-- 团队：单团队静态展示；多团队用 u-dragsort 横向拖动排序（同叠放 + 与 myTeams/reorder 同步） -->
        <view
          v-if="teamDragsortItems.length"
          class="w-full max-w-md mx-auto flex flex-col items-center justify-center mb-1 mt-1"
        >
          <view class="flex items-center justify-center">
            <view
              v-for="(item, idx) in teamDragsortItems"
              :key="item.teamId"
              class="relative rounded-full border-2 border-white/95 shadow-sm box-border"
              :style="idx > 0 ? { marginLeft: '-8px' } : undefined"
              @click="onGoToManage('postManage', item.teamId)"
            >
              <up-avatar
                :text="item.letter"
                :size="TEAM_AVATAR_SIZE"
                :font-size="16"
                color="#ffffff"
                :random-bg-color="true"
                :color-index="item.colorIndex"
              />
              <view
                v-if="item.isTeamOwner"
                class="absolute -bottom-[2rpx] -right-[2rpx] w-[30rpx] h-[30rpx] rounded-full bg-primary border-2 border-white flex items-center justify-center shadow-sm z-10"
                aria-label="团队管理员"
              >
                <text
                  class="iconfont icon-huizhangguanli text-[18rpx] text-white leading-none"
                  style="font-variation-settings: 'FILL' 1"
                />
              </view>
            </view>
          </view>
          <view
            v-if="teamDragsortItems.length > 1"
            class="text-[20rpx] text-on-surface-variant/50 font-label tracking-wider mt-1"
            @click="openTeamSortPanel"
          >
            调整团队顺序
          </view>
        </view>
        <view
          v-if="teamSortVisible"
          class="fixed inset-0 z-[100] bg-on-background/10 backdrop-blur-md flex items-center justify-center p-6"
          @click.self="closeTeamSortPanel"
        >
          <view class="toast-like-panel relative w-full max-w-[640rpx] max-h-[85vh] overflow-hidden rounded-[40rpx] p-4 bg-surface-container-lowest shadow-2xl">
            <view class="absolute inset-0 pointer-events-none cloud-pattern theme-bg opacity-90 rounded-[40rpx]" />
            <view class="absolute right-4 top-4 z-10 size-8 flex items-center justify-center rounded-full bg-black/5 active:bg-black/10" @click="closeTeamSortPanel">
              <text class="iconfont icon-close text-lg theme-color-7 text-on-surface-variant/70"></text>
            </view>
            <view class="relative z-[1]">
              <view class="text-center text-[28rpx] font-semibold mb-1">调整团队顺序</view>
              <view class="text-center text-[20rpx] text-on-surface-variant/60 mb-3">拖动后自动生效</view>
              <su-drag
                ref="teamSortDragRef"
                v-model="teamSortDraft"
                :columns="1"
                :item-height="56"
                :touch-dragging="true"
                item-margin="0"
                custom-class="team-sort-item"
                @end="onTeamSortDragEnd"
              >
                <template #default="{ data }">
                  <view class="h-[56px] px-3 flex items-center justify-between border-b border-primary/10">
                    <view class="flex items-center gap-3">
                      <up-avatar
                        :text="data.letter"
                        :size="30"
                        :font-size="14"
                        color="#ffffff"
                        :random-bg-color="true"
                        :color-index="data.colorIndex"
                      />
                      <text class="text-[26rpx] text-on-surface">{{ data.teamName }}</text>
                    </view>
                    <text v-if="Number(data.sort ?? 0) === 0" class="text-[22rpx] text-primary">首团队</text>
                  </view>
                </template>
              </su-drag>
              <view class="mt-4 h-10 rounded-full border border-primary/20 flex items-center justify-center" @click="closeTeamSortPanel">
                完成
              </view>
            </view>
          </view>
        </view>
        <view class="text-center space-y-1">
          <view class="font-headline text-3xl font-light italic text-primary tracking-tight" >{{ nickName }}</view>
          <view class="font-label text-xs uppercase tracking-[0.2em] text-secondary opacity-80" >修行始于 {{ startTime }}年</view>
        </view>
      </view>

      <!-- Settings Group: Essential -->
      <view class="space-y-4">
        <view class="font-bold text-[20rpx] uppercase tracking-[0.25rem] text-primary/70 px-2">基础设置</view>
        <view class="space-y-1">
          <view @click="onGoToManage('accountManage')"
            class="flex bg-theme-13 items-center justify-between p-4 bg-accent-light/30 border border-primary/20 rounded-2xl hover:bg-accent-light/50 transition-colors cursor-pointer group">
            <view class="flex items-center gap-4">
              <text class="icon-zhanghaoguanli iconfont text-[40rpx] theme-color-1" data-icon="mail"></text>
              <text class="font-body text-[28rpx] theme-color-5">账户管理</text>
            </view>
            <view class="flex items-center gap-2">
              <text class="theme-color-7 text-[24rpx]">{{ phone }}</text>
              <text class="iconfont icon-jinru text-[30rpx] theme-color-12 group-hover:translate-x-1 transition-transform"
                data-icon="chevron_right"></text>
            </view>
          </view>
          <view @click="onGoToManage('deviceManage')"
            class="flex bg-theme-13 items-center justify-between p-4 bg-accent-light/30 border border-outline-gold/20 rounded-2xl hover:bg-accent-light/50 transition-colors cursor-pointer group">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-shebei text-[40rpx] theme-color-1" data-icon="lock"></text>
              <text class="font-body text-[28rpx] theme-color-5">设备管理</text>
            </view>
            <view class="flex items-center gap-2">
              <text class="theme-color-7 text-[24rpx]">{{ deviceManageRightText }}</text>
              <text class="iconfont icon-jinru text-[30rpx] theme-color-12 group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
            </view>
          </view>
          <view @click="onGoToManage('postManage')"
            class="flex bg-theme-13 items-center justify-between p-4 bg-accent-light/30 border border-primary/20 rounded-2xl hover:bg-accent-light/50 transition-colors cursor-pointer group">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-shequn1 text-[40rpx] theme-color-1" data-icon="lock"></text>
              <text class="font-body text-[28rpx] theme-color-5">社群管理</text>
            </view>
            <text class="iconfont icon-jinru text-[30rpx] theme-color-12 group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
          </view>
          <view @click="onGoToManage('order')"
            class="flex bg-theme-13 items-center justify-between p-4 bg-accent-light/30 border border-primary/20 rounded-2xl hover:bg-accent-light/50 transition-colors cursor-pointer group">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-wodedingdan text-[40rpx] theme-color-1" data-icon="lock"></text>
              <text class="font-body text-[28rpx] theme-color-5">我的订单</text>
            </view>
            <text class="iconfont icon-jinru text-[30rpx] theme-color-12 group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
          </view>
          <view @click="onGoToManage('medal')"
            class="flex bg-theme-13 items-center justify-between p-4 bg-accent-light/30 border border-primary/20 rounded-2xl hover:bg-accent-light/50 transition-colors cursor-pointer group">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-xunzhang text-[40rpx] theme-color-1" data-icon="lock"></text>
              <text class="font-body text-[28rpx] theme-color-5">勋章管理</text>
            </view>
            <text class="iconfont icon-jinru text-[30rpx] theme-color-12 group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
          </view>
        </view>
      </view>
      <!-- Settings Group: Legal -->
      <view class="space-y-4   ">
        <view class="flex justify-between items-center px-[16rpx]">
          <view class="font-bold text-[20rpx] uppercase tracking-[0.25rem] text-primary/70">法律与透明度</view>
        </view>
        <view class="space-y-px overflow-hidden rounded-2xl border-primary/20 shadow-sm">
          <!-- Privacy Policy -->
          <view @click="onGoToManage('privacyPolicy')"
            class="flex bg-theme-13  items-center justify-between p-4 bg-accent-light/20 hover:bg-accent-light/40 transition-colors cursor-pointer group">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-yinsizhengce text-[40rpx] theme-color-1" data-icon="policy"></text>
              <text class="font-body text-[28rpx] theme-color-5">隐私协议</text>
            </view>
            <text class="iconfont icon-jinru text-[30rpx] theme-color-12 text-outline-gold group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
          </view>
          <!-- User Agreement -->
          <view @click="onGoToManage('userAgent')"
            class="flex  bg-theme-13  items-center justify-between p-4 bg-accent-light/20 hover:bg-accent-light/40 transition-colors cursor-pointer group border-t border-outline-gold/30">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-gavel text-[40rpx] theme-color-1" data-icon="gavel"></text>
              <text class="font-body text-[28rpx] theme-color-5">用户协议</text>
            </view>
            <text class="iconfont icon-jinru text-[30rpx] theme-color-12 text-outline-gold group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
          </view>
          <!-- Disclaimer -->
          <view @click="onGoToManage('disclaimer')"
            class="flex bg-theme-13  items-center justify-between p-4 bg-accent-light/20 hover:bg-accent-light/40 transition-colors cursor-pointer group border-t border-outline-gold/30">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-info text-[40rpx] theme-color-1" data-icon="info"></text>
              <text class="font-body text-[28rpx] theme-color-5">免责声明</text>
            </view>
            <text class="iconfont icon-jinru text-[30rpx] theme-color-12 text-outline-gold group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
          </view>
          <!-- One Info List -->
          <view @click="onGoToManage('oneInfoList')"
            class="flex bg-theme-13  items-center justify-between p-4 bg-accent-light/20 hover:bg-accent-light/40 transition-colors cursor-pointer group border-t border-outline-gold/30">
            <view class="flex items-center gap-4">
              <text class="iconfont icon-wodedingdan text-[40rpx] theme-color-1" data-icon="info"></text>
              <text class="font-body text-[28rpx] theme-color-5">个人信息列表</text>
            </view>
            <text class="iconfont icon-jinru text-[30rpx] theme-color-12 text-outline-gold group-hover:translate-x-1 transition-transform"
              data-icon="chevron_right"></text>
          </view>
        </view>
      </view>
      <!-- Logout Button -->
      <view
        class="w-full py-[30rpx] shadow-sm rounded-full bg-theme-13 border border-outline-gold/50 hover:bg-red-50 hover:border-red-200 transition-all duration-300 group">
        <view class="flex items-center justify-center gap-3" @click="loginOut()">
          <text class="iconfont icon-tuichu text-[40rpx] theme-color-1 group-hover:text-red-500 transition-colors"
            data-icon="logout"></text>
          <text
            class="font-label text-[30rpx] theme-color-5 uppercase tracking-[0.25rem] text-primary group-hover:text-red-500 transition-colors">退出登录</text>
        </view>
      </view>
      <!-- Version Info -->
      <view class="text-center pt-4">
        <view class="font-label text-[18rpx] uppercase tracking-[0.3rem] text-primary/70">照见花开 v1.1.9</view>
      </view>
    </view>
  </view>
  </view>
</template>

<script setup lang="ts">
import HomeBar from "@/components/homeBar.vue";
import { useDeviceStore } from "@/stores/device";
import { useMeditationStore } from "@/stores/meditation";
import { useTeamStore } from "@/stores/team";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils";

const userStore = useUserStore();
const deviceStore = useDeviceStore();
const teamStore = useTeamStore();
const meditationStore = useMeditationStore();

const teamReorderLoading = ref(false);

const { nickName, avatarUrl, phone, createTime } = storeToRefs(userStore);
const { devices, listLoading } = storeToRefs(deviceStore);

/** 头像尺寸 */
const TEAM_AVATAR_SIZE = 35;
const TEAM_AVATAR_MAX = 5;

function teamDisplayLetter(name: string): string {
  const s = name.trim();
  if (!s) return "?";
  const ch = s[0]!;
  return /[a-z]/i.test(ch) ? ch.toUpperCase() : ch;
}

type TeamDragsortRow = {
  id: number;
  teamId: number;
  teamName: string;
  letter: string;
  colorIndex: number;
  isTeamOwner: boolean;
};

const teamDragsortItems = computed((): TeamDragsortRow[] => {
  const uid = Number(userStore.currentUser?.id ?? 0);
  return teamStore.myCurrentTeams.slice(0, TEAM_AVATAR_MAX).map((t) => {
    const ownerId = Number(t.ownerId);
    return {
      id: t.teamId,
      teamId: t.teamId,
      teamName: t.teamName || `团队${t.teamId}`,
      letter: teamDisplayLetter(t.teamName || ""),
      colorIndex: Math.abs(Number(t.teamId)) % 20,
      isTeamOwner: uid > 0 && ownerId === uid,
    };
  });
});

type TeamDragRuntimeRow = TeamDragsortRow & { sort: number };
const teamSortDraft = ref<TeamDragRuntimeRow[]>([]);
const teamSortVisible = ref(false);
type SuDragExpose = { init?: () => void; switchDragging?: (value: boolean) => void };
const teamSortDragRef = ref<SuDragExpose | null>(null);

watch(
  teamDragsortItems,
  () => {
    if (teamSortVisible.value) return;
    teamSortDraft.value = teamDragsortItems.value.map((item, index) => ({
      ...item,
      sort: index,
    }));
  },
  { immediate: true },
);

function openTeamSortPanel() {
  if (teamReorderLoading.value) return;
  teamSortDraft.value = teamDragsortItems.value.map((item, index) => ({ ...item, sort: index }));
  teamSortVisible.value = true;
  const runDragReady = () => {
    teamSortDragRef.value?.switchDragging?.(true);
    teamSortDragRef.value?.init?.();
  };
  void nextTick(() => {
    runDragReady();
    // #ifdef MP-WEIXIN
    /** 弹层布局完成后再量宽高并开启拖拽，避免 WXS 拿到错误 itemRect */
    setTimeout(runDragReady, 120);
    // #endif
  });
}

function closeTeamSortPanel() {
  teamSortVisible.value = false;
}

async function confirmTeamSort() {
  if (teamReorderLoading.value) return;
  const teamIds = [...teamSortDraft.value]
    .sort((a, b) => Number(a.sort ?? 0) - Number(b.sort ?? 0))
    .map((x) => Number(x.teamId))
    .filter((id) => Number.isFinite(id) && id > 0);
  if (teamIds.length < 2) return;
  teamReorderLoading.value = true;
  try {
    await teamStore.reorderMyTeamsByTeamIds(teamIds);
    await teamStore.fetchMyCurrentTeams();
  } finally {
    teamReorderLoading.value = false;
  }
}

function onTeamSortDragEnd() {
  void confirmTeamSort();
}

const startTime = computed(() => formatDate(createTime.value, "YYYY"));

/** 设备列表右侧：登录后拉 `fetchDeviceList`，展示台数或「无设备」 */
const deviceManageRightText = computed(() => {
  if (!userStore.isLoggedIn) return '登录后查看';
  if (listLoading.value) return '同步中…';
  const n = devices.value.length;
  if (n === 0) return '无设备';
  return `${n} 台设备`;
});

onShow(() => {
  if (userStore.isLoggedIn) {
    void deviceStore.refreshList();
    void teamStore.fetchMyCurrentTeams();
    void meditationStore.fetchActiveSession();
  }
});

// 退出登录
const loginOut = () => {
  uni.showModal({
    title: '提示',  
    content: '确认退出登录吗?',
    success: (res) => {
      if (res.confirm) {
        useUserStore().logout();
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        });
        // 可选：跳转到登录页
        uni.navigateTo({
          url: '/pages/login/index'
        })
      }
    }
  }); 
}

// 前往商城
const onGoToShop = () => {
  uni.navigateTo({
    url: '/pages/profile/rank'
  })
}
//前往管理页面
const onGoToManage = (target: string, teamId?: number) => {
  if (target === 'postManage') {
    const q =
      teamId != null && Number.isFinite(teamId) && teamId > 0 ? `?teamId=${teamId}` : "";
    uni.navigateTo({
      url: `/pages/community/manage${q}`,
    });
  } else if (target === 'order') {
    uni.navigateTo({
      url: '/pages/shop/order'
    })
  } else {
    uni.navigateTo({
      url: `/pages/profile/${target}`
    })
  }
}

</script>

<style scoped lang="scss">
:deep(.toast-like-panel) {
  transform-origin: center;
  animation: team-sort-pop-in 0.24s ease-out;
}

:deep(.team-sort-item) {
  width: 100%;
  height: 100%;
}

@keyframes team-sort-pop-in {
  from {
    opacity: 0;
    transform: scale(0.94) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
