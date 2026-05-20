/**
 * 心迹 Tab：海报生成、保存与微信分享钩子（对齐冥想报告分享弹窗，无邀请类项）。
 */
import type { Ref } from "vue";
import { nextTick, shallowRef } from "vue";
import { onShareAppMessage, onShareTimeline, onShow } from "@dcloudio/uni-app";
import type { UviewPosterInstance } from "@/composables/useMeditationReportShare";
import type { HeartTracePosterPayload, UviewPosterJson } from "@/types/pages/heartTraceShare";
import { buildHeartTracePosterJson } from "@/utils/heartTracePosterShare";
import {
  buildHeartTraceFriendShare,
  buildHeartTraceH5Url,
  buildHeartTraceTimelineShare,
  type HeartTraceWechatSharePayload,
} from "@/utils/heartTraceTabShare";
import { showSuccessToast } from "@/utils/toast";

export type UseHeartTracePosterShareOptions = {
  /** 微信分享卡片文案快照 */
  getWechatSharePayload?: () => HeartTraceWechatSharePayload;
  /** @default true */
  registerWechatShare?: boolean;
};

/**
 * @param posterRef 隐藏挂载的 `up-poster` ref
 * @param getPayload 生成前组装载荷（含图表导出路径）
 * @param options 微信分享与 H5 复制
 */
export function useHeartTracePosterShare(
  posterRef: Ref<UviewPosterInstance | null | undefined>,
  getPayload: () => HeartTracePosterPayload | Promise<HeartTracePosterPayload>,
  options?: UseHeartTracePosterShareOptions,
) {
  const registerWechatShare = options?.registerWechatShare !== false;
  const getWechatSharePayload = options?.getWechatSharePayload;

  const posterJson = shallowRef<UviewPosterJson>({ css: { width: "750rpx", height: "1600rpx" }, views: [] });

  if (registerWechatShare && getWechatSharePayload) {
    onShareAppMessage(() => buildHeartTraceFriendShare(getWechatSharePayload()));
    onShareTimeline(() => buildHeartTraceTimelineShare(getWechatSharePayload()));

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

  async function refreshPosterJson(): Promise<void> {
    const payload = await Promise.resolve(getPayload());
    posterJson.value = buildHeartTracePosterJson(payload);
  }

  /**
   * 刷新 json 并导出 PNG 临时路径。
   * @returns 临时文件路径；失败为 `null`
   */
  async function generatePosterImagePath(): Promise<string | null> {
    await refreshPosterJson();
    await nextTick();
    await nextTick();
    // #ifdef MP-WEIXIN
    await new Promise<void>((r) => setTimeout(r, 150));
    // #endif

    async function tryExport(): Promise<string | null> {
      const comp = posterRef.value;
      if (!comp || typeof comp.exportImage !== "function") return null;
      try {
        const res = await comp.exportImage();
        const path = res?.path;
        return path != null && path !== "" ? String(path) : null;
      } catch (e) {
        console.error("heartTrace up-poster exportImage", e);
        return null;
      }
    }

    let path = await tryExport();
    if (path) return path;
    // #ifdef MP-WEIXIN
    await new Promise<void>((r) => setTimeout(r, 220));
    path = await tryExport();
    // #endif
    return path;
  }

  function savePosterToPhotosAlbum(filePath: string): void {
    uni.saveImageToPhotosAlbum({
      filePath,
      success: () => showSuccessToast("已保存到相册"),
      fail: (err) => {
        const msg = String((err as UniApp.GeneralCallbackResult)?.errMsg || "");
        if (msg.includes("auth deny") || msg.includes("authorize") || msg.includes("permission")) {
          uni.showModal({
            title: "需要相册权限",
            content: "保存图片需授权「保存到相册」，请在设置中开启后重试。",
            confirmText: "去设置",
            success: (r) => {
              if (r.confirm) uni.openSetting({});
            },
          });
        } else {
          uni.showToast({ title: "保存失败", icon: "none" });
        }
      },
    });
  }

  function offerPosterAfterGenerate(tempPath: string): void {
    // #ifdef MP-WEIXIN
    uni.showActionSheet({
      itemList: ["保存到相册", "预览图片"],
      success: (tap) => {
        if (tap.tapIndex === 0) savePosterToPhotosAlbum(tempPath);
        else uni.previewImage({ urls: [tempPath] });
      },
    });
    // #endif
    // #ifndef MP-WEIXIN
    uni.previewImage({ urls: [tempPath] });
    // #endif
  }

  /** 生成海报 → 保存/预览 */
  async function generateAndOfferPoster(): Promise<void> {
    uni.showLoading({ title: "生成中", mask: true });
    try {
      const path = await generatePosterImagePath();
      if (!path) {
        uni.showModal({
          title: "海报生成失败",
          content: "请确认统计数据已加载完成后再试；若多次失败请检查图表与网络图域名配置。",
          showCancel: false,
        });
        return;
      }
      offerPosterAfterGenerate(path);
    } finally {
      uni.hideLoading();
    }
  }

  function openFriendShareGuide(): void {
    uni.showModal({
      title: "分享给好友或群",
      content: "请点击右上角「···」，选择「转发」即可发送给好友或群聊。",
      showCancel: false,
    });
  }

  function openTimelineShareGuide(): void {
    uni.showModal({
      title: "分享到朋友圈",
      content:
        "请点击右上角「···」，选择「分享到朋友圈」。若未出现该选项，请将微信与小程序基础库升级至较新版本。",
      showCancel: false,
    });
  }

  async function copyH5ShareLink(baseUrl: string): Promise<void> {
    if (!getWechatSharePayload) return;
    const url = buildHeartTraceH5Url(baseUrl.replace(/\/$/, ""), getWechatSharePayload());
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
    generateAndOfferPoster,
    offerPosterAfterGenerate,
    savePosterToPhotosAlbum,
    openFriendShareGuide,
    openTimelineShareGuide,
    copyH5ShareLink,
  };
}
