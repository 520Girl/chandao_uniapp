<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern pb-24">
        <lcrBar :title="'成员管理'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
        <view class="px-6">
            <view class="mb-8 mt-8">
                <view class="text-2xl font-serif font-light tracking-tight text-on-surface mb-1 leading-tight italic">
                    庇护所守护者
                </view>
                <text class="text-[12px] font-body text-on-surface-variant/60 tracking-wider">管理社区内的每一个宁静时刻</text>
            </view>
            <view class="flex gap-8 border-b border-outline-variant/30 mb-8">
                <view class="pb-3 text-sm font-label tracking-wider transition-colors" :class="memberRoleTab === 0
                    ? 'text-primary border-b-2 border-primary font-bold'
                    : 'text-on-surface-variant/50'
                    " @click="onRoleTabChange(0)">
                    全部 ({{ countAll }})
                </view>
                <view class="pb-3 text-sm font-label tracking-wider transition-colors" :class="memberRoleTab === 1
                    ? 'text-primary border-b-2 border-primary font-bold'
                    : 'text-on-surface-variant/50'
                    " @click="onRoleTabChange(1)">
                    管理层 ({{ countOwners }})
                </view>
            </view>

            <view v-if="listLoading && members.length === 0" class="py-16 text-center text-sm theme-color-8">加载中…</view>
            <view v-else-if="!listLoading && members.length === 0" class="py-16 text-center text-sm theme-color-8">
                暂无成员
            </view>
            <view v-else class="space-y-6">
                <view v-for="m in members" :key="m.userId" class="group">
                    <view class="flex items-center justify-between gap-4">
                        <view class="flex min-w-0 flex-1">
                            <view class="relative shrink-0">
                                <view class="w-14 h-14 rounded-full p-0.5 border border-primary/30">
                                    <image
                                        class="w-full h-full rounded-full object-cover"
                                        :src="resolveMediaUrl(m.avatarUrl)"
                                        mode="aspectFill" />
                                </view>
                                <view
                                    v-if="m.isOwner === 1"
                                    class="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-surface flex items-center justify-center">
                                    <text
                                        class="icon-verified iconfont text-[20rpx] text-on-primary font-bold"
                                        style="font-variation-settings: 'FILL' 1"></text>
                                </view>
                            </view>
                            <view class="min-w-0 pl-3">
                                <view class="font-headline text-lg text-on-surface flex items-center gap-2 flex-wrap">
                                    {{ m.nickName?.trim() || "云友" }}
                                    <text
                                        v-if="m.isOwner === 1"
                                        class="px-2 py-0.5 rounded-full bg-theme-3 text-[20rpx] theme-color-1 font-bold">
                                        负责人
                                    </text>
                                </view>
                                <view class="font-label text-[10px] tracking-widest text-on-surface-variant mt-1">
                                    {{ memberSubline(m) }}
                                </view>
                            </view>
                        </view>
                        <view
                            v-if="canRemoveMember(m)"
                            hover-class="opacity-90"
                            class="shrink-0 flex items-center gap-1 px-[24rpx] text-[24rpx] py-[12rpx] rounded-full bg-red-500/10 text-[#ef4444] font-bold transition-transform active:scale-95"
                            @tap="openRemoveMemberConfirm(m)"
                            @click="openRemoveMemberConfirm(m)">
                            <text class="iconfont icon-trash-2 text-[24rpx]"></text>
                            移出
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="members.length > 0" class="py-6 text-center text-xs theme-color-8">
                <text v-if="loadMoreStatus === 'loading'">加载更多…</text>
                <text v-else-if="loadMoreStatus === 'nomore'">没有更多了</text>
            </view>

            <view
                class="mt-12 p-6 bg-gradient-to-br from-surface-container-low to-surface-variant/20 rounded-[32px] border border-white/40 shadow-sm text-center">
                <view class="font-headline text-xl italic text-on-surface mb-2">扩大我们的圈子</view>
                <view class="font-body text-sm text-on-surface-variant leading-relaxed mb-6">
                    邀请志同道合的伙伴，共同守护我们共享空间的宁静。
                </view>
                <view
                    class="bg-theme-12 theme-color-6 w-full py-4 rounded-full font-label tracking-[0.1rem] text-xs font-bold shadow-md shadow-primary/10 active:scale-95 transition-transform text-center">
                    邀请守护者
                </view>
            </view>
        </view>

        <Toast v-model:show="toastShow" :title="toastTitle" :message="toastMessage" :fields="toastFieldsEmpty"
            :confirm-text="toastConfirmText" cancel-text="取消" :mask-closable="true" @confirm="onToastConfirm" />
    </view>
</template>

<script setup lang="ts">
import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import { fetchTeamMemberPage, postTeamMemberRemove } from "@/assets/js/api/team";
import { config } from "@/assets/js/config";
import type { TeamMemberPageData, TeamMemberRow } from "@/types/api/team";
import type { ToastInputField } from "@/types/pages/component";
import { unwrapApiData } from "@/utils/apiResponse";
import { formatRelativeTime } from "@/utils/common";
import { navigateBack } from "@/utils/navigation";
import lcrBar from "@/components/lcrBar.vue";
import Toast from "@/components/common/toast.vue";
import { useTeamStore } from "@/stores/team";
import { useUserStore } from "@/stores/user";

const PAGE_SIZE = 20;

const teamStore = useTeamStore();
const userStore = useUserStore();

const routeTeamId = ref<number | null>(null);

const members = ref<TeamMemberRow[]>([]);
const page = ref(1);
const listLoading = ref(false);
const loadMoreStatus = ref<"loadmore" | "loading" | "nomore">("loadmore");
/** 与接口一致：0 全部，1 仅负责人 */
const memberRoleTab = ref<0 | 1>(0);

const countAll = ref(0);
const countOwners = ref(0);

const toastFieldsEmpty: ToastInputField[] = [];
const toastShow = ref(false);
const toastTitle = ref("");
const toastMessage = ref("");
const toastConfirmText = ref("确定");
const pendingRemoveMember = ref<TeamMemberRow | null>(null);

const resolvedTeamId = computed(() => teamStore.resolvedPublishTeamId ?? routeTeamId.value ?? undefined);

const isTeamOwner = computed(() => {
    const uid = userStore.currentUser?.id;
    const tid = teamStore.resolvedPublishTeamId ?? routeTeamId.value;
    if (uid == null || tid == null) return false;
    const team = teamStore.myCurrentTeams.find((t) => t.teamId === tid);
    return team != null && team.ownerId === uid;
});

function resolveMediaUrl(raw: string | null | undefined): string {
    const u = (raw || "").trim();
    if (!u) return "/static/logo.png";
    if (/^https?:\/\//i.test(u)) return u;
    if (u.startsWith("//")) return `https:${u}`;
    const base = config.baseURL.replace(/\/+$/, "");
    const path = u.startsWith("/") ? u : `/${u}`;
    return `${base}${path}`;
}

function memberSubline(m: TeamMemberRow): string {
    const parts: string[] = [];
    if (m.joinedAt) parts.push(`${formatRelativeTime(m.joinedAt)} 加入`);
    parts.push(`${m.postCount} 条动态`);
    return parts.join(" · ");
}

/**
 * 仅团队负责人可操作；不可移出负责人；不可移出自己。
 */
function canRemoveMember(m: TeamMemberRow): boolean {
    if (!isTeamOwner.value) return false;
    if (m.isOwner === 1) return false;
    const selfId = userStore.currentUser?.id;
    if (selfId == null) return false;
    if (m.userId === selfId) return false;
    return true;
}

function openRemoveMemberConfirm(m: TeamMemberRow) {
    const tid = resolvedTeamId.value;
    if (tid == null) {
        uni.showToast({ title: "暂无可用团队", icon: "none" });
        return;
    }
    if (!canRemoveMember(m)) return;
    pendingRemoveMember.value = m;
    toastTitle.value = "确认移出成员？";
    toastMessage.value = `将「${(m.nickName || "").trim() || "该成员"}」移出当前团队，对方将不再属于本社群。`;
    toastConfirmText.value = "移出";
    toastShow.value = true;
}

async function onToastConfirm() {
    const m = pendingRemoveMember.value;
    pendingRemoveMember.value = null;
    const tid = resolvedTeamId.value;
    if (m == null || tid == null) return;
    try {
        await postTeamMemberRemove({ teamId: tid, userId: m.userId });
        uni.showToast({ title: "已移出", icon: "success" });
        await refreshAll();
    } catch (e) {
        console.error("postTeamMemberRemove", e);
    }
}

async function fetchRoleTotal(role: 0 | 1): Promise<number> {
    const tid = resolvedTeamId.value;
    const res = await fetchTeamMemberPage({ teamId: tid ?? undefined, page: 1, size: 1, role });
    const data = unwrapApiData<TeamMemberPageData>(res);
    return data?.pagination?.total ?? data?.list?.length ?? 0;
}

async function refreshCounts() {
    try {
        const [a, o] = await Promise.all([fetchRoleTotal(0), fetchRoleTotal(1)]);
        countAll.value = a;
        countOwners.value = o;
    } catch (e) {
        console.error("allMember refreshCounts", e);
    }
}

async function loadList(reset: boolean) {
    if (listLoading.value) return;
    if (!reset && loadMoreStatus.value === "nomore") return;

    const tid = resolvedTeamId.value;

    listLoading.value = true;
    if (reset) {
        page.value = 1;
        members.value = [];
        loadMoreStatus.value = "loadmore";
    }
    loadMoreStatus.value = "loading";

    try {
        const res = await fetchTeamMemberPage({
            teamId: tid ?? undefined,
            page: page.value,
            size: PAGE_SIZE,
            role: memberRoleTab.value,
        });
        const data = unwrapApiData<TeamMemberPageData>(res);
        const list = data?.list ?? [];
        const total = data?.pagination?.total;
        if (reset) {
            members.value = list;
        } else {
            members.value = members.value.concat(list);
        }
        const loaded = members.value.length;
        if (list.length < PAGE_SIZE || (total != null && loaded >= total)) {
            loadMoreStatus.value = "nomore";
        } else {
            loadMoreStatus.value = "loadmore";
            page.value += 1;
        }
    } catch (e) {
        console.error("allMember loadList", e);
        uni.showToast({ title: "加载失败", icon: "none" });
        loadMoreStatus.value = "loadmore";
        if (reset) members.value = [];
    } finally {
        listLoading.value = false;
    }
}

async function refreshAll() {
    await refreshCounts();
    await loadList(true);
}

function onRoleTabChange(v: 0 | 1) {
    if (memberRoleTab.value === v) return;
    memberRoleTab.value = v;
    void loadList(true);
}

onLoad((options) => {
    const raw = options?.teamId;
    if (raw != null && String(raw).trim() !== "") {
        const n = Number(raw);
        if (Number.isFinite(n)) routeTeamId.value = n;
    }
});

onShow(async () => {
    await teamStore.fetchMyCurrentTeams();
    if (routeTeamId.value != null) {
        teamStore.setPublishTeamId(routeTeamId.value);
    } else {
        teamStore.syncPublishTeamFromUserFirstTeam(userStore.currentUser?.firstTeamId);
    }
    await refreshAll();
});

onReachBottom(() => {
    if (loadMoreStatus.value === "loadmore" && !listLoading.value) {
        void loadList(false);
    }
});

const onBack = () => navigateBack();
</script>

<style scoped lang="scss"></style>
