<template>
  <view class="flex flex-col min-h-screen pb-[32rpx] theme-bg">
    <HomeBar :title="'账号设置'" description="云 息 自 我" :titleIcon="'icon-yonghu'" :leftIcon="'icon-Trophy'"  :handleClick="onGoToShop" />
   
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
        <!-- u-avatar-group 只支持图片 url；团队用首字 + 随机底色，叠放与 gap=0.4 一致 -->
        <view
          v-if="teamAvatarEntries.length"
          class="flex items-center justify-center mb-4 mt-1"
       
        >
          <view
            v-for="(entry, index) in teamAvatarEntries"
            :key="entry.teamId"
            @click="onGoToManage('postManage', entry.teamId)"
            class="relative rounded-full border-2 border-white/95 shadow-sm box-border"
            :style="{
              marginLeft: index === 0 ? 0 : `-${teamAvatarOverlapPx}px`,
              zIndex: teamAvatarEntries.length - index,
            }"
          >
            <up-avatar
              :text="entry.letter"
              :size="TEAM_AVATAR_SIZE"
              :font-size="16"
              color="#ffffff"
              :random-bg-color="true"
              :color-index="entry.colorIndex"
            />
            <view
              v-if="entry.isTeamOwner"
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
        <view class="text-center space-y-1">
          <h2 class="font-headline text-3xl font-light italic text-primary tracking-tight" >{{ nickName }}</h2>
          <p class="font-label text-xs uppercase tracking-[0.2em] text-secondary opacity-80" >修行始于 {{ startTime }}年</p>
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
        <p class="font-label text-[18rpx] uppercase tracking-[0.3rem] text-primary/70">坐观其心 v2.4.1</p>
      </view>
    </view>
  </view>
  </view>
</template>

<script setup lang="ts">
import HomeBar from "@/components/homeBar.vue";
import { useDeviceStore } from "@/stores/device";
import { useTeamStore } from "@/stores/team";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils";

const userStore = useUserStore();
const deviceStore = useDeviceStore();
const teamStore = useTeamStore();
const { nickName, avatarUrl, phone, createTime } = storeToRefs(userStore);
const { devices, listLoading } = storeToRefs(deviceStore);

/** 与原先 up-avatar-group 的 size / gap 一致：35 × 0.4 */
const TEAM_AVATAR_SIZE = 35;
const TEAM_AVATAR_GAP = 0.4;
const teamAvatarOverlapPx = TEAM_AVATAR_SIZE * TEAM_AVATAR_GAP;
const TEAM_AVATAR_MAX = 5;

function teamDisplayLetter(name: string): string {
  const s = name.trim();
  if (!s) return "?";
  const ch = s[0]!;
  return /[a-z]/i.test(ch) ? ch.toUpperCase() : ch;
}

const teamAvatarEntries = computed(() => {
  /** 与 `MyTeamItem.ownerId` 比较的用户主键，即 `GET /app/user/info/person` 返回的 `UserPerson.id`（登录后写入 `currentUser`） */
  const uid = Number(userStore.currentUser?.id ?? 0);
  return teamStore.myCurrentTeams.slice(0, TEAM_AVATAR_MAX).map((t) => {
    const ownerId = Number(t.ownerId);
    return {
      teamId: t.teamId,
      letter: teamDisplayLetter(t.teamName || ""),
      colorIndex: Math.abs(Number(t.teamId)) % 20,
      /** 与 `MyTeamItem.ownerId` 一致：本人为团队创建者/管理员 */
      isTeamOwner: uid > 0 && ownerId === uid,
    };
  });
});

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

