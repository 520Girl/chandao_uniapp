import { defineStore } from "pinia";
import { getDictJumpType } from "@/assets/js/api/dict";
import type { PostUserStateDictItem, resItem } from "@/types/api/dict";
import { unwrapApiData, unwrapApiList } from "@/utils/apiResponse";

/**
 * 数据字典（内存）；不落盘。
 * `post_user_state`：动态情绪标签 value→文案；`post_user_state_list` 为排序后的列表供选择器渲染。
 */
export const useDictStore = defineStore("dict", {
  state: () => ({
    /** `post_user_state`：字典 value → 展示名 */
    post_user_state: new Map<number, string>(),
    /** 同上，按 orderNum 排序，供 v-for / ActionSheet */
    post_user_state_list: [] as PostUserStateDictItem[],
  }),
  actions: {
    /**
     * 拉取并写入 `post_user_state` / `post_user_state_list`；失败时不清空已有数据。
     */
    async fetchPostUserState() {
      try {
        const res = await getDictJumpType({ types: ["post_user_state"] });
        const data = unwrapApiData<Record<string, unknown>>(res);
        const raw =
          data && typeof data === "object" ? (data as Record<string, unknown>)["post_user_state"] : undefined;
        const list = unwrapApiList(raw) as resItem[];
        const rows: PostUserStateDictItem[] = list
          .filter((r) => r != null && typeof r.value === "number" && typeof r.name === "string")
          .map((r) => ({
            value: r.value,
            name: r.name,
            orderNum: typeof r.orderNum === "number" ? r.orderNum : 0,
          }))
          .sort((a, b) => a.orderNum - b.orderNum);

        const nextMap = new Map<number, string>();
        for (const r of rows) {
          nextMap.set(r.value, r.name);
        }
        this.post_user_state = nextMap;
        this.post_user_state_list = rows;
      } catch (e) {
        console.error("fetchPostUserState", e);
      }
    },

    /** @deprecated 使用 `fetchPostUserState` */
    async getDictJumpTypeData() {
      await this.fetchPostUserState();
    },
  },
});
