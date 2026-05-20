<template>
  <view class="flex flex-col min-h-screen theme-bg" />
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";

/**
 * 微信分享落地：转发到 `report` 并以 `token` 拉取免登录详情。
 */
onLoad((query) => {
  const token = String((query as Record<string, unknown>)?.token ?? "").trim();
  if (!token) {
    uni.showModal({
      title: "分享链接无效",
      content: "链接缺少有效参数，请让好友重新分享。",
      showCancel: false,
      success: () => {
        uni.switchTab({ url: "/pages/index/home" });
      },
    });
    return;
  }
  uni.redirectTo({
    url: `/pages/meditation/report?token=${encodeURIComponent(token)}`,
  });
});
</script>
