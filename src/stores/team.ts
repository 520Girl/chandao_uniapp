import { defineStore } from "pinia";
import { fetchMyTeams, postUserMyTeamsReorder } from "@/assets/js/api/user";
import { BUSINESS_CODE } from "@/assets/js/config";
import type { MyTeamItem } from "@/types/api/user";
/**
 * 当前用户团队列表（`fetchMyTeams`）及发布动态等场景选用的 `teamId`。
 * 不落盘；登录后由 `user` store 拉取资料成功后同步刷新。
 */
function sortMyTeamItems(list: MyTeamItem[]): MyTeamItem[] {
  return [...list].sort(
    (a, b) =>
      (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.teamId - b.teamId,
  );
}

export const useTeamStore = defineStore("team", {
  state: () => ({
    /** `status=0`：当前在职团队 */
    myCurrentTeams: [] as MyTeamItem[],
    loading: false,
    /** 发布动态选用的团队 ID；须在 `myCurrentTeams` 内 */
    selectedTeamIdForPublish: null as number | null,
  }),
  getters: {
    hasCurrentTeam(): boolean {
      return this.myCurrentTeams.length > 0;
    },
    /**
     * 提交发布时使用的团队 ID：已选且在列表中；仅有一个团队时可不点选；
     * 多团队时必须手动选择其一。
     */
    resolvedPublishTeamId(): number | null {
      if (this.selectedTeamIdForPublish != null) {
        const ok = this.myCurrentTeams.some((t) => t.teamId === this.selectedTeamIdForPublish);
        if (ok) return this.selectedTeamIdForPublish;
      }
      if (this.myCurrentTeams.length === 1) return this.myCurrentTeams[0].teamId;
      return null;
    },
  },
  actions: {
    /**
     * 拉取当前在职团队列表（`status=0`）。
     * 单团队时自动选中；选中 ID 若已不在列表则清空。
     */
    async fetchMyCurrentTeams() {
      this.loading = true;
      try {
        const res = await fetchMyTeams({ status: 0 });
        if (res.code === BUSINESS_CODE.SUCCESS && Array.isArray(res.data)) {
          this.myCurrentTeams = sortMyTeamItems(res.data as MyTeamItem[]);
          const list = this.myCurrentTeams;
          if (
            this.selectedTeamIdForPublish != null &&
            !list.some((t) => t.teamId === this.selectedTeamIdForPublish)
          ) {
            this.selectedTeamIdForPublish = null;
          }
          if (this.selectedTeamIdForPublish == null && list.length === 1) {
            this.selectedTeamIdForPublish = list[0].teamId;
          }
        } else {
          this.myCurrentTeams = [];
        }
      } catch (e) {
        console.error("fetchMyCurrentTeams", e);
        this.myCurrentTeams = [];
      } finally {
        this.loading = false;
      }
    },

    setPublishTeamId(teamId: number | null) {
      this.selectedTeamIdForPublish = teamId;
    },

    /**
     * 用户资料里的 `firstTeamId` 若在列表中且尚未选择，则作为默认。
     */
    syncPublishTeamFromUserFirstTeam(firstTeamId: number | null | undefined) {
      if (firstTeamId == null) return;
      const hit = this.myCurrentTeams.some((t) => t.teamId === firstTeamId);
      if (hit && this.selectedTeamIdForPublish == null) {
        this.selectedTeamIdForPublish = firstTeamId;
      }
    },

    clearTeams() {
      this.myCurrentTeams = [];
      this.selectedTeamIdForPublish = null;
    },

    /**
     * 重排当前在职团队显示顺序；`teamIds` 须为全部在职团队 ID 的一个全排列。
     */
    async reorderMyTeamsByTeamIds(teamIds: number[]) {
      if (teamIds.length === 0) return;
      this.loading = true;
      try {
        await postUserMyTeamsReorder({ teamIds });
        await this.fetchMyCurrentTeams();
      } catch (e) {
        console.error("postUserMyTeamsReorder", e);
        uni.showToast({ title: "调整顺序失败", icon: "none" });
        await this.fetchMyCurrentTeams();
      } finally {
        this.loading = false;
      }
    },
  },
});
