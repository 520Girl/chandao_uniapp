let SYSTEM_INFO = uni.getSystemInfoSync()

//获取状态栏高度
export function getStatusBarHeight() {

    return SYSTEM_INFO.statusBarHeight || 0;
}

// 获取胶囊按钮高度
export function getTitleBarHeight() {
    if (uni.getMenuButtonBoundingClientRect) {
        let { top, height } = uni.getMenuButtonBoundingClientRect() // 获取胶囊按钮位置信息
        //使标题 和 胶囊按钮上线居中 胶囊按钮顶部高度-状态栏高度*2+胶囊高度
        let navbarHeight = (top - getStatusBarHeight()) * 2 + height
        return navbarHeight // 得到的是标题栏高度 标题和胶囊按钮上下居中（上下边距相等）
    } else {
        return 70;//没有胶囊按钮默认高度
    }
}

/**
 * 获取状态栏 和 胶囊按钮总高度
 */
export const getNavbarHeight = () => getStatusBarHeight() + getTitleBarHeight();

/**
 * 当是抖音的时候title 左边有一个logo 需要隔离开
 */
export const getTitleLogo = () => {
    // #ifdef MP-TOUTIAO
    let { leftIcon: { left, width } } = tt.getCustomButtonBoundingClientRect();
    return left + width + 5;
    // #endif

    // #ifndef MP-TOUTIAO
    return 0
    // #endif
}

/**
 * 获取底部安全距离 + tabbar高度
 */

export const getSafeBottomHeight = () => {
    // 通常在 50px 左右
    console.log('屏幕高度:', SYSTEM_INFO.screenHeight);
    console.log('窗口高度:', SYSTEM_INFO.windowHeight);
    console.log('底部安全高度:', SYSTEM_INFO);
    // return SYSTEM_INFO.screenHeight - SYSTEM_INFO.windowHeight + (SYSTEM_INFO.safeAreaInsets?.bottom || 0)
    return (SYSTEM_INFO.safeAreaInsets?.bottom || 0)
}

/**
 * 获取设备类型
 */
 export const getDeviceType = () => {
    // #ifdef APP-PLUS
    return 'APP'
    // #endif
    // #ifdef H5
    return 'H5'
    // #endif
    // #ifdef MP-WEIXIN
    return 'MP-WEIXIN'
    // #endif
    
    return process.env.UNI_PLATFORM || ''
 }