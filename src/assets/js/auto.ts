import { isLoggedIn } from './api/user'

//需要登录验证的路由
export const AUTH_ROUTES = [
    '/pages/index/index',
]

export const PUBLIC_ROUTES = [
    '/pages/index/login',
]

// 检查路由是否需要登录验证
export const isRouteRequireAuth = (route: string): boolean => {
    return AUTH_ROUTES.includes(route)
}


// 检查路由是否为公开路由
export const isPublicRoute = (route: string): boolean => {
    console.log('isPublicRoute', route, getCurrentPages())

    return PUBLIC_ROUTES.includes(route)
}

export const routeGuard = (url: string): boolean => {
    console.log('routeGuard', url)
    // 如果是公开路由，直接通过
    if (isPublicRoute(url || '')) {
        return true
    }
    // 如果需要登录验证但未登录，跳转到登录页
    if (isRouteRequireAuth(url || '') && !isLoggedIn()) {
        console.log('需要登录验证但未登录，跳转到登录页')
        uni.navigateTo({
            url: '/pages/login/index'
        })
        return false
    }
    return true
}

// 在App.vue中使用的全局路由守卫
export const setupGlobalRouteGuard = () => {
    // 监听页面跳转
    uni.addInterceptor('navigateTo', {
        invoke(e: any) {
            const url = e.url
            if (!routeGuard(url)) {
                return false
            }
        }
    })

    // uni.addInterceptor('redirectTo', {
    //     invoke(e: any) {
    //         const url = e.url
    //         if (!routeGuard(url)) {
    //             return false
    //         }
    //     }
    // })

    // uni.addInterceptor('reLaunch', {
    //     invoke(e: any) {
    //         const url = e.url
    //         if (!routeGuard(url)) {
    //             return false
    //         }
    //     }
    // })

    // uni.addInterceptor('switchTab', {
    //     invoke(e: any) {
    //         const url = e.url
    //         if (!routeGuard(url)) {
    //             return false
    //         }
    //     }
    // })
} 