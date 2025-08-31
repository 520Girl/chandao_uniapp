export type ThemeMode = "light" | "dark";

const THEME_KEY = "__app_theme__";

function getRootEl(): HTMLElement | null {
    if (typeof document !== "undefined") {
        return document.documentElement;
    }
    return null;
}

export function getTheme(): ThemeMode {
    if (typeof uni !== "undefined") {
        const v = uni.getStorageSync(THEME_KEY) as ThemeMode | "";
        if (v === "light" || v === "dark") return v;
    }
    if (typeof localStorage !== "undefined") {
        const v = localStorage.getItem(THEME_KEY) as ThemeMode | null;
        if (v === "light" || v === "dark") return v;
    }
    return "light";
}

export function setTheme(mode: ThemeMode): void {
    const root = getRootEl();
    if (root) root.setAttribute("data-theme", mode);
    if (typeof uni !== "undefined") {
        uni.setStorageSync(THEME_KEY, mode);
    } else if (typeof localStorage !== "undefined") {
        localStorage.setItem(THEME_KEY, mode);
    }
}

export function toggleTheme(): ThemeMode {
    const next: ThemeMode = getTheme() === "light" ? "dark" : "light";
    setTheme(next);
    return next;
}

export function initTheme(): ThemeMode {
    const current = getTheme();
    setTheme(current);
    return current;
}


