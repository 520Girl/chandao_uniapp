import { defineStore } from "pinia";
import { getDictJumpType } from "@/assets/js/api/dict";
import type { PostUserStateDictItem, resItem } from "@/types/api/dict";
import { unwrapApiData, unwrapApiList } from "@/utils/apiResponse";

/**
 * 数据字典（内存）；不落盘。
 * `post_user_state`：动态情绪标签 value→文案；`post_user_state_list` 为排序后的列表供选择器渲染。
 * `message_biz_type`：消息业务类型，供消息列表图标/文案解析。
 */
export const useDictStore = defineStore("dict", {
  state: () => ({
    /** `post_user_state`：字典 value → 展示名 */
    post_user_state: new Map<number, string>(),
    /** 同上，按 orderNum 排序，供 v-for / ActionSheet */
    post_user_state_list: [] as PostUserStateDictItem[],
    /** `message_biz_type`：value → name */
    message_biz_type: new Map<number, string>(),
    /** 原始行，便于按 name 与接口 `bizType` 字符串互查 */
    message_biz_type_rows: [] as resItem[],
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

    /**
     * 拉取 `message_biz_type`；失败时不清空已有数据。
     */
    async fetchMessageBizType() {
      try {
        const res = await getDictJumpType({ types: ["message_biz_type"] });
        const data = unwrapApiData<Record<string, unknown>>(res);
        const raw =
          data && typeof data === "object"
            ? (data as Record<string, unknown>)["message_biz_type"]
            : undefined;
        const list = unwrapApiList(raw) as resItem[];
        const nextMap = new Map<number, string>();
        const rows: resItem[] = [];
        for (const row of list) {
          if (row == null || typeof row !== "object") continue;
          rows.push(row);
          if (typeof row.value === "number" && typeof row.name === "string") {
            nextMap.set(row.value, row.name);
          }
        }
        this.message_biz_type = nextMap;
        this.message_biz_type_rows = rows;
      } catch (e) {
        console.error("fetchMessageBizType", e);
      }
    },

    /**
     * 合并接口 `bizType` 与字典 `name`，供消息列表按关键字匹配图标（小写）。
     */
    messageBizTypeMatchHint(bizType: string | null | undefined): string {
      const raw = (bizType ?? "").trim();
      if (!raw) return "";
      const num = Number(raw);
      if (raw !== "" && !Number.isNaN(num) && Number.isFinite(num)) {
        const name = this.message_biz_type.get(num);
        return name ? `${raw} ${name}`.toLowerCase() : raw.toLowerCase();
      }
      let extra = "";
      for (const row of this.message_biz_type_rows) {
        if (!row.name) continue;
        if (raw.includes(row.name) || row.name.includes(raw)) {
          extra = ` ${row.name}`;
          break;
        }
      }
      return `${raw}${extra}`.toLowerCase();
    },
  },
});
