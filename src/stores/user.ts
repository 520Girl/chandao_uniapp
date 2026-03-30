/**************************** CodeGeeX Inline Diff ****************************/
import { defineStore } from 'pinia'
import type {  UserState,UserPayload,LoginPayload} from '@/types/api/user'
import { passwordLogin ,fetchUserProfile ,logoutUser,updateUserProfile} from '@/assets/js/api/user'
import { config } from '@/assets/js/config'
// 定义用户信息的接口

export const useUserStore = defineStore('user', {
    persist: {
      enabled: true,
      H5Storage: localStorage, // H5平台使用localStorage
      strategies:[{
        key: 'user_store',
        paths: ['token', 'isLoggedIn','currentUser'],
      }]
    },
    state: (): UserState => ({
        currentUser: null,
        token: null,
        refreshToken: null,
        isLoggedIn: false,
        loading: false
    }),

    getters: {
        // 获取用户显示名称
        nickName: (state): string => state.currentUser?.nickName || config.appName || '未设置',
        avatarUrl: (state): string => state.currentUser?.avatarUrl || '/static/logo.png',
        phone: (state): string => state.currentUser?.phone || '123***890',
        userID: (state): number => state.currentUser?.id || 1,
        createTime: (state): string => state.currentUser?.createTime || '',
        // 状态字段 token/isLoggedIn 不需要 getter，避免和 state 冲突。
        isAuth: (state): boolean => state.isLoggedIn
    },

    actions: {
        // 设置用户信息
        setUser(user: UserPayload) {
            this.currentUser = user;
        },

        // 清除用户信息
        clearUser() {
            this.$patch({
                currentUser: null,
                token: null,
                refreshToken: null,
                isLoggedIn: false,
                loading: false
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
                if (!isSuccess) {
                    this.clearUser()
                    return;
                }

                uni.switchTab({
                    url: '/pages/index/home'
                })
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
        }
    }
})