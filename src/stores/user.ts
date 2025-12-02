/**************************** CodeGeeX Inline Diff ****************************/
import { defineStore } from 'pinia'

// 定义用户信息的接口
export interface User {
    id?: number
    username: string
    email: string
    avatar?: string
    role?: 'admin' | 'user' | 'guest'
    createdAt?: string
    updatedAt?: string
}

// 定义用户状态接口
export interface UserState {
    currentUser: User | null
    isLoggedIn: boolean
    loading: boolean
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        currentUser: {
            username: '未登录用户',
            email: '',
            role: 'guest',
        },
        isLoggedIn: false,
        loading: false
    }),

    getters: {
        // 获取用户显示名称
        displayName: (state): string => {
            return state.currentUser?.username || '未登录用户'
        },

        // 检查是否为管理员
        isAdmin: (state): boolean => {
            return state.currentUser?.role === 'admin'
        }
    },

    actions: {
        // 设置用户信息
        setUser(user: User) {
            this.currentUser = user
            this.isLoggedIn = true
        },

        // 清除用户信息
        clearUser() {
            this.currentUser = null
            this.isLoggedIn = false
        },

        // 更新用户信息
        async updateUser(userData: Partial<User>) {
            if (!this.currentUser) return

            this.loading = true
            try {
                // 这里可以添加API调用
                // const response = await api.updateUser(userData)
                this.currentUser = { ...this.currentUser, ...userData }
            } catch (error) {
                console.error('更新用户信息失败:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // 登录
        async login(credentials: { username: string; password: string }) {
            this.loading = true
            try {
                // 这里添加实际的登录API调用
                // const response = await api.login(credentials)
                // 模拟登录成功
                const mockUser: User = {
                    id: 1,
                    username: credentials.username,
                    email: `${credentials.username}@example.com`,
                    role: 'user',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
                this.setUser(mockUser)
            } catch (error) {
                console.error('登录失败:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // 登出
        async logout() {
            this.loading = true
            try {
                // 这里添加实际的登出API调用
                // await api.logout()
                this.clearUser()
            } catch (error) {
                console.error('登出失败:', error)
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})