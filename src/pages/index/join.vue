<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
        <lcrBar :title="inviteLanding ? '团队邀请' : '心迹报告'" :type="inviteLanding ? 'none' : 'all'" :onBack="onLcrBack"
            :onHome="onLcrHome" />
        <!-- 小程序扫码落地：scene 携带邀请码；此模式禁止分享/返回，引导登录或已登录则直接加入 -->
        <view class="flex flex-col flex-1 px-8 pt-8 pb-20 items-center text-center">
            <text class="iconfont icon-shequn1 text-[120rpx] text-primary/90 mb-6"></text>
            <view class="text-[36rpx] font-bold theme-color-5 mb-3">受邀加入团队</view>
            <view class="text-[26rpx] theme-color-8 leading-relaxed mb-10 max-w-[560rpx]">
                请先登录账号，登录成功后将自动完成加入。若您已登录，可直接确认加入。
            </view>
            <view
                class="w-full max-w-[480rpx] py-4 rounded-full bg-theme-1 text-white text-[30rpx] font-bold shadow-lg mb-5 active:opacity-95"
                @tap="confirmInviteJoin">
                {{ userStore.isLoggedIn ? "确认加入" : "去登录并加入" }}
            </view>
            <text class="text-[22rpx] theme-color-8/80">请勿通过右上角转发本页，邀请码仅用于本人加入。</text>
        </view>
    </view>
</template>
<script setup lang="ts">
import type { JoinByInviteResult } from '@/types/api/user';
import { unwrapApiData } from '@/utils/apiResponse';
import { postUserJoinByInvite } from '@/assets/js/api/user';
import { useTeamStore } from '@/stores/team';
import { useUserStore } from '@/stores/user';
import lcrBar from '@/components/lcrBar.vue';

const userStore = useUserStore();
const teamStore = useTeamStore();
/** 小程序 scene 解析出的邀请码（非邀请落地时为空） */
const inviteCode = ref('');
const inviteLanding = computed(() => inviteCode.value.trim().length > 0);


const onLcrBack = () => {
    uni.navigateBack();
};

async function confirmInviteJoin() {
    const code = inviteCode.value.trim();
    if (!code) return;
    uni.removeStorageSync("PENDING_INVITE_CODE");
    if (!userStore.isLoggedIn) {
        try {
            uni.setStorageSync('PENDING_INVITE_CODE', code);
        } catch {
            /* ignore */
        }
        uni.navigateTo({
            url: `/pages/login/index?inviteCode=${encodeURIComponent(code)}`,
        });
        return;
    }
    uni.showLoading({ title: '加入中…', mask: true });
    try {
        const res = await postUserJoinByInvite({ code });
        const data = unwrapApiData<JoinByInviteResult>(res);
        if (data && data?.personalFormation !== null) {
            uni.showToast({ title: '加入成功', icon: 'success' });
            return;
        }
        uni.removeStorageSync("PENDING_INVITE_CODE");

        setTimeout(() => {
          uni.switchTab({ url: '/pages/index/home' });
        }, 500);
    } catch (e) {
        console.error('postUserJoinByInvite', e);
    } finally {
        uni.hideLoading();
    }
}


onLoad((query) => {
    const q = (query || {}) as Record<string, unknown>;
    inviteCode.value = parseInviteSceneRaw(q.inviteCode);
    hideInviteShareMenu();
});



function parseInviteSceneRaw(raw: unknown): string {
    if (raw == null) return '';
    const s = String(raw).trim();
    if (!s) return '';
    try {
        return decodeURIComponent(s).trim();
    } catch {
        return s;
    }
}

function hideInviteShareMenu() {
    // #ifdef MP-WEIXIN
    try {
        uni.hideShareMenu({ hideShareItems: ['shareAppMessage', 'shareTimeline'] });
    } catch {
        /* 基础库差异 */
    }
    // #endif
}
const onLcrHome = () => {
    uni.switchTab({
        url: '/pages/index/home'
    });
};
</script>
<style scoped lang="scss"></style>
