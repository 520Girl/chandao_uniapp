export type ThemeMode = "light" | "dark" | "auto";

const THEME_KEY = "__app_theme__";
const ACTUAL_THEME_KEY = "__app_actual_theme__";
let hasNativeThemeListener = false;

// 获取根元素（支持 H5 和 App）
function getRootEl(): HTMLElement | null {
    // #ifdef H5
    if (typeof document !== "undefined") {
        return document.documentElement;
    }
    // #endif

    // #ifdef APP-PLUS
    // App 端通过 CSS 变量实现
    return null;
    // #endif
}

// 检测系统主题
function getSystemTheme(): "light" | "dark" {
    // #ifdef H5
    if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    }
    // #endif

    // #ifdef APP-PLUS || MP
    try {
        const systemInfo = uni.getSystemInfoSync() as { theme?: string };
        return systemInfo.theme === "dark" ? "dark" : "light";
    } catch (e) {
        return "light";
    }
    // #endif

    return "light";
}

function ensureNativeThemeListener(): void {
    // #ifdef APP-PLUS || MP
    if (hasNativeThemeListener) return;
    try {
        uni.onThemeChange((e: any) => {
            const currentMode = getTheme();
            if (currentMode !== "auto") return;

            const newTheme = e?.theme === "dark" ? "dark" : "light";
            uni.setStorageSync(ACTUAL_THEME_KEY, newTheme);
            uni.$emit("themeChanged", newTheme);
        });
        hasNativeThemeListener = true;
    } catch (error) {
        console.log("当前端不支持 onThemeChange");
    }
    // #endif
}

export function getTheme(): ThemeMode {
    if (typeof uni !== "undefined") {
        const v = uni.getStorageSync(THEME_KEY) as ThemeMode | "";
        if (v === "light" || v === "dark" || v === "auto") return v;
    }

    // #ifdef H5
    if (typeof localStorage !== "undefined") {
        const v = localStorage.getItem(THEME_KEY) as ThemeMode | null;
        if (v === "light" || v === "dark" || v === "auto") return v;
    }
    // #endif

    return "auto";
}

// 获取实际应用的主题
export function getActualTheme(): "light" | "dark" {
    const theme = getTheme();
    if (theme === "auto") {
        return getSystemTheme();
    }
    return theme;
}

export function setTheme(mode: ThemeMode): void {
    const root = getRootEl();

    // #ifdef H5
    if (root) {
        const actualTheme = mode === "auto" ? getSystemTheme() : mode;
        root.setAttribute("data-theme", actualTheme);
    }
    // #endif

    // #ifdef APP-PLUS || MP
    // 原生端（App/小程序）通过类名和事件更新页面主题
    const actualTheme = mode === "auto" ? getSystemTheme() : mode;
    uni.setStorageSync(ACTUAL_THEME_KEY, actualTheme);
    // 触发主题更新事件
    uni.$emit("themeChanged", actualTheme);

    // 显示主题切换提示
    uni.showToast({
        title: "主题已切换为: " + (actualTheme === "light" ? "浅色" : "深色"),
        icon: "none",
        duration: 2000
    });

    // 注册一次系统主题监听：auto 模式下跟随系统变化
    ensureNativeThemeListener();
    // #endif

    if (typeof uni !== "undefined") {
        uni.setStorageSync(THEME_KEY, mode);
    }

    // #ifdef H5
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(THEME_KEY, mode);
    }
    // #endif
}

/**
 * 切换主题
 * @returns 当前主题模式
 */
export function toggleTheme(): ThemeMode {
    const current = getTheme();
    console.log("当前主题:", current);
    let next: ThemeMode;

    if (current === "light") {
        next = "dark";
    } else if (current === "dark") {
        next = "auto";
    } else {
        next = "light";
    }

    setTheme(next);
    return next;
}

export function initTheme(): ThemeMode {
    const current = getTheme();
    setTheme(current);
    return current;
}

// 监听系统主题变化（仅 H5）
export function watchSystemTheme(callback: (theme: "light" | "dark") => void): (() => void) | null {
    // #ifdef H5
    if (typeof window !== "undefined" && window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => {
            const newTheme = e.matches ? "dark" : "light";
            callback(newTheme);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }
    // #endif

    return null;
}


