/**
 * 冥想报告页：注册微信分享钩子、海报生成、分享引导与 H5 复制链接。
 * 仅应在报告页 `setup` 中调用一次；`onShareAppMessage` / `onShareTimeline` 由此注册。
 */
import type { Ref } from "vue";
import { nextTick, shallowRef } from "vue";
import { onShareAppMessage, onShareTimeline, onShow } from "@dcloudio/uni-app";
import type { MeditationReportSharePayload, UviewPosterJson } from "@/types/pages/meditationShare";
import {
  buildMeditationReportFriendShare,
  buildMeditationReportH5Url,
  buildMeditationReportPosterJson,
  buildMeditationReportTimelineShare,
} from "@/utils/meditationReportShare";
import { showSuccessToast } from "@/utils/toast";

/** `up-poster` 暴露的实例方法（uview-plus Options API） */
export type UviewPosterInstance = {
  exportImage: () => Promise<{ path?: string; width?: number; height?: number }>;
};

export type UseMeditationReportShareOptions = {
  /**
   * 为 `false` 时不注册 `onShareAppMessage` / `onShareTimeline` / 分享菜单（非报告页仅导出海报时用）。
   * @default true
   */
  registerWechatShare?: boolean;
};

/**
 * @param posterRef `up-poster` 组件 ref，用于 `exportImage`
 * @param getPayload 每次分享/生成海报前调用，需返回最新报告字段
 * @param options 非报告页可关闭微信分享钩子，避免误转发冥想路径
 */
export function useMeditationReportShare(
  posterRef: Ref<UviewPosterInstance | null | undefined>,
  getPayload: () => MeditationReportSharePayload,
  options?: UseMeditationReportShareOptions,
) {
  const registerWechatShare = options?.registerWechatShare !== false;

  const posterJson = shallowRef<UviewPosterJson>(buildMeditationReportPosterJson(getPayload()));

  if (registerWechatShare) {
    onShareAppMessage(() => buildMeditationReportFriendShare(getPayload()));
    onShareTimeline(() => buildMeditationReportTimelineShare(getPayload()));

    onShow(() => {
      // #ifdef MP-WEIXIN
      try {
        uni.showShareMenu({
          withShareTicket: true,
          menus: ["shareAppMessage", "shareTimeline"],
        });
      } catch {
        /* 基础库过低时忽略 */
      }
      // #endif
    });
  }

  /**
   * 按当前载荷刷新 `posterJson` 并调用 `up-poster.exportImage`。
   * 小程序端 canvas 布局常晚一拍：多等一帧 + 短延迟再导出，失败时会重试一次。
   * @returns 临时文件路径；失败返回 `null`
   */
  async function generatePosterImagePath(): Promise<string | null> {
    posterJson.value = buildMeditationReportPosterJson(getPayload());
    await nextTick();
    await nextTick();
    // #ifdef MP-WEIXIN
    await new Promise<void>((r) => setTimeout(r, 120));
    // #endif

    async function tryExport(): Promise<string | null> {
      const comp = posterRef.value;
      if (!comp || typeof comp.exportImage !== "function") {
        return null;
      }
      try {
        const res = await comp.exportImage();
        const path = res?.path;
        return path != null && path !== "" ? String(path) : null;
      } catch (e) {
        console.error("up-poster exportImage", e);
        return null;
      }
    }

    let path = await tryExport();
    if (path) return path;
    // #ifdef MP-WEIXIN
    await new Promise<void>((r) => setTimeout(r, 200));
    path = await tryExport();
    // #endif
    return path;
  }

  /** 提示用户使用右上角菜单转发给好友/群 */
  function openFriendShareGuide(): void {
    uni.showModal({
      title: "分享给好友或群",
      content: "请点击右上角「···」，选择「转发」即可发送给好友或群聊。",
      showCancel: false,
    });
  }

  /** 提示用户使用右上角菜单分享到朋友圈 */
  function openTimelineShareGuide(): void {
    uni.showModal({
      title: "分享到朋友圈",
      content:
        "请点击右上角「···」，选择「分享到朋友圈」。若未出现该选项，请将微信与小程序基础库升级至较新版本。",
      showCancel: false,
    });
  }

  /**
   * 将 H5 落地链接写入剪贴板（需配置 `VITE_H5_SHARE_BASE` 或在 payload 中带 `h5LandingBaseUrl`）。
   * @param baseUrl 站点根 URL
   */
  async function copyH5ShareLink(baseUrl: string): Promise<void> {
    const url = buildMeditationReportH5Url(baseUrl.replace(/\/$/, ""), getPayload());
    // #ifdef H5
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        showSuccessToast("链接已复制");
        return;
      } catch {
        /* 继续走 uni */
      }
    }
    // #endif
    uni.setClipboardData({
      data: url,
      success: () => showSuccessToast("链接已复制"),
    });
  }

  return {
    posterJson,
    generatePosterImagePath,
    openFriendShareGuide,
    openTimelineShareGuide,
    copyH5ShareLink,
  };
}
