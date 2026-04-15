/**************************** CodeGeeX Inline Diff ****************************/
import { defineStore } from 'pinia'
import type { AuthTokenPayload, LoginPayload, UserPayload, UserState } from "@/types/api/user";
import { passwordLogin, fetchUserProfile, logoutUser, updateUserProfile } from "@/assets/js/api/user";
import { useDeviceStore } from '@/stores/device'
import { useMeditationStore } from '@/stores/meditation'
import { useTeamStore } from '@/stores/team'
import { fetchMessageUnreadCount } from '@/assets/js/api/message'
import { config } from '@/assets/js/config'
// 定义用户信息的接口

export const useUserStore = defineStore('user', {
    persist: {
      enabled: true,
      H5Storage: localStorage, // H5平台使用localStorage
      strategies:[{
        key: 'user_store',
        paths: ['token', 'isLoggedIn','currentUser','refreshToken'],
      }]
    },
    state: (): UserState => ({
        currentUser: null,
        token: null,
        refreshToken: null,
        isLoggedIn: false,
        loading: false,
        unRead: 0
    }),

    getters: {
        // 获取用户显示名称
        nickName: (state): string => state.currentUser?.nickName || config.appName || '未设置',
        avatarUrl: (state): string => state.currentUser?.avatarUrl || '/static/logo.png',
        phone: (state): string => state.currentUser?.phone || '123***890',
        userID: (state): number => state.currentUser?.id || 1,
        createTime: (state): string => state.currentUser?.createTime || '',
        // 状态字段 token/isLoggedIn 不需要 getter，避免和 state 冲突。
        isAuth: (state): boolean => state.isLoggedIn,
        unReadCount: (state): number => state.unRead
    },

    actions: {
        // 设置用户信息
        setUser(user: UserPayload) {
            this.currentUser = user;
        },

        // 清除用户信息
        clearUser() {
            useTeamStore().clearTeams();
            useDeviceStore().clearDevices();
            useMeditationStore().clearHomeActivityPreference();
            this.$patch({
                currentUser: null,
                token: null,
                refreshToken: null,
                isLoggedIn: false,
                loading: false,
                unRead: 0
            });
        },

        /** 刷新 token 成功后写入；未返回新 refreshToken 时保留原 refreshToken */
        applyAuthTokens(payload: AuthTokenPayload) {
            const nextRt =
                payload.refreshToken != null && String(payload.refreshToken).length > 0
                    ? payload.refreshToken
                    : this.refreshToken;
            this.$patch({
                token: payload.token,
                refreshToken: nextRt,
                isLoggedIn: true,
            });
        },

        // 更新用户信息
        async updateUser(userData: Partial<UserPayload>) {
            if (!this.currentUser) return

            this.loading = true
            try {
                // 这里可以添加API调用
                const response = await updateUserProfile(userData)
                this.currentUser = { ...this.currentUser, ...response.data }
                uni.showToast({
                    title: '更新成功',
                    icon: 'success'
                })
            } catch (error) {
                console.error('更新用户信息失败:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // 登录
        async login(credentials:LoginPayload) {
            this.loading = true
            try {
                // 这里添加实际的登录API调用
                const res = await passwordLogin(credentials)
                const response = res.data
                if (res.code !== 1000) {
                    this.loading = false
                    uni.showToast({
                        title: '登录失败',
                        icon: 'none'
                    })
                    return;
                }

                this.token = response.token 
                this.refreshToken = response.refreshToken
                this.isLoggedIn = true

                // 获取用户信息
                const isSuccess = await this.fetchUserProfile()
                await this.fetchUnReadCount()
                if (!isSuccess) {
                    this.clearUser()
                    return;
                }

                const wentJoin = await this.redirectToJoinPageIfPendingInvite();
                if (!wentJoin) {
                    uni.switchTab({
                        url: "/pages/index/home",
                    });
                }
            } catch (error) {
                console.error('登录失败:', error)
                throw error
            } finally {
                this.loading = false
            }
        },
        // 获取用户信息,
        async fetchUserProfile() {
            const response = await fetchUserProfile()
            if (response.code === 1000) {
                this.currentUser = response.data
                const teamStore = useTeamStore()
                await teamStore.fetchMyCurrentTeams()
                teamStore.syncPublishTeamFromUserFirstTeam(this.currentUser?.firstTeamId)
                return true;
            } else {
                uni.showToast({
                    title: '获取用户信息失败',
                    icon: 'none'
                })
                return false;
            }
        },
        // 登出
        async logout() {
            this.loading = true
            try {
                // 这里添加实际的登出API调用
                const response = await logoutUser()
                if (response.code === 1000) {
                       uni.showToast({
                        title: '退出登录成功',
                        icon: 'success'
                    })
                    this.clearUser()
                }
            } catch (error) {
                console.error('登出失败:', error)
                throw error
            } finally {
                this.loading = false
            }
        },
        async fetchUnReadCount() {
            const response = await fetchMessageUnreadCount()
            if (response.code === 1000) {
                this.unRead = response.data
            }
        },

        /**
         * 若存在待处理邀请码（`PENDING_INVITE_CODE`），跳转 `/pages/index/join` 由该页调加入接口后再回首页。
         * @returns 是否已发起跳转（为 `true` 时不应再 `switchTab` 到首页）
         */
        async redirectToJoinPageIfPendingInvite(): Promise<boolean> {
            let raw: unknown;
            try {
                raw = uni.getStorageSync("PENDING_INVITE_CODE");
            } catch {
                return false;
            }
            if (raw == null || typeof raw !== "string" || !String(raw).trim()) return false;
            const code = String(raw).trim();
            try {
                uni.redirectTo({
                    url: `/pages/index/join?inviteCode=${encodeURIComponent(code)}`,
                });
                return true;
            } catch (e) {
                console.error("redirectToJoinPageIfPendingInvite", e);
                return false;
            }
        },
    }
})