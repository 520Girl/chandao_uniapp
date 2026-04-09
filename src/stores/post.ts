import { defineStore } from "pinia";

/**
 * 发布页相关跨页草稿（如社区「今日照见」→ 发布动态预填）。
 * 不落盘；避免使用 `uni.setStorageSync`，仅内存传递。
 */
export const usePostDraftStore = defineStore("postDraft", {
  state: () => ({
    /** 从社区带入的正文；应在发布页 `consume` 或 `clear` */
    communityPrefill: "" as string,
  }),
  actions: {
    /** 设置社区预填文案（会先 trim） */
    setCommunityPrefill(text: string) {
      this.communityPrefill = (text || "").trim();
    },
    /** 取出当前预填并清空，避免重复写入 */
    consumeCommunityPrefill(): string {
      const t = this.communityPrefill;
      this.communityPrefill = "";
      return t;
    },
    /** 丢弃预填（例如未带 prefill 参数进入发布页时清掉残留） */
    clearCommunityPrefill() {
      this.communityPrefill = "";
    },
  },
});
