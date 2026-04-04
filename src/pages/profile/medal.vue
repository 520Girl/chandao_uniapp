<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
    <lcrBar :title="'勋章管理'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />

    <main class="flex-1 px-8 pt-12 pb-32 z-10">
      <view class="mb-10 text-center">
        <view class="font-label text-[20rpx] uppercase tracking-[0.2em] theme-color-6 mb-2">My Journey</view>
        <view class="font-headline italic text-[32rpx] theme-color-1">
          已收集 {{ unlockedCount }} / {{ totalTemplates }} 枚勋章
        </view>
      </view>

      <view v-if="pageLoading" class="py-16 text-center text-sm text-on-surface-variant">加载中…</view>
      <view v-else-if="gridItems.length === 0" class="py-16 text-center text-sm text-on-surface-variant">
        暂无勋章模板
      </view>
      <view v-else class="grid grid-cols-2 gap-x-8 gap-y-12">
        <view
          v-for="item in gridItems"
          :key="item.templateId"
          class="flex flex-col items-center gap-4 group"
          :class="item.unlocked ? '' : 'opacity-40'">
          <view class="relative w-28 h-28 flex items-center justify-center">
            <view
              v-if="item.unlocked"
              class="absolute inset-0 bg-tertiary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700" />
            <view
              class="relative w-20 h-20 rounded-full flex items-center justify-center border-2"
              :class="
                item.unlocked
                  ? 'bg-gradient-to-br from-tertiary to-primary-container border-surface-container-lowest badge-glow'
                  : 'bg-theme-13 border-outline-variant/30'
              ">
              <image
                v-if="item.unlocked && isRemoteIcon(item.icon)"
                class="w-12 h-12 rounded-full"
                :src="item.icon"
                mode="aspectFill" />
              <text
                v-else-if="item.unlocked"
                class="iconfont icon-wind text-[40rpx] theme-color-1"
                style="font-variation-settings: 'FILL' 1" />
              <text
                v-else
                class="iconfont icon-lock text-[40rpx] theme-color-1"
                style="font-variation-settings: 'FILL' 1" />
            </view>
          </view>
          <view class="text-center">
            <text class="font-headline italic text-[28rpx] theme-color-5">{{ item.name }}</text>
            <view class="font-label text-[20rpx] theme-color-6 tracking-wider mt-1">
              {{ item.unlocked ? subtitleFor(item) : '未达成' }}
            </view>
          </view>
        </view>
      </view>

      <view
        class="mt-20 p-6 rounded-[24px] bg-theme-13 backdrop-blur-md border border-outline-variant/10 shadow-sm">
        <view class="flex items-center justify-between mb-4">
          <h3 class="font-headline italic text-primary text-xl">勋章详情</h3>
          <text
            class="iconfont icon-flare text-[40rpx] theme-color-1"
            style="font-variation-settings: 'FILL' 1" />
        </view>
        <view class="font-body text-sm text-on-surface-variant leading-relaxed opacity-80">
          每一枚勋章都是您与内心对话的见证。继续您的冥想旅程，解锁更多属于您的静谧时刻。
        </view>
      </view>
    </main>
  </view>
</template>
<script setup lang="ts">
import { fetchMedalTemplates, fetchUserMedals } from '@/assets/js/api/medal';
import lcrBar from '@/components/lcrBar.vue';
import type { MedalTemplate, UserMedal } from '@/types/api/medal';
import type { MedalGridItem } from '@/types/pages/medal';
import { navigateBack } from '@/utils/navigation';

const pageLoading = ref(true);
const gridItems = ref<MedalGridItem[]>([]);

const unlockedCount = computed(() => gridItems.value.filter((i) => i.unlocked).length);
const totalTemplates = computed(() => gridItems.value.length);

function extractArray(res: unknown): unknown[] {
  if (res == null) return [];
  const body = res as Record<string, unknown>;
  const inner = body.data !== undefined ? body.data : body;
  return Array.isArray(inner) ? inner : [];
}

function bestUserMedalByMedalId(rows: UserMedal[]): Map<number, UserMedal> {
  const m = new Map<number, UserMedal>();
  for (const um of rows) {
    const prev = m.get(um.medalId);
    if (!prev) {
      m.set(um.medalId, um);
      continue;
    }
    if (um.level > prev.level) {
      m.set(um.medalId, um);
    } else if (um.level === prev.level && um.obtainedAt > prev.obtainedAt) {
      m.set(um.medalId, um);
    }
  }
  return m;
}

function buildGridItems(templates: MedalTemplate[], userByMedalId: Map<number, UserMedal>): MedalGridItem[] {
  const active = templates.filter((t) => Number(t.isActive) === 1);
  return active.map((t) => {
    const um = userByMedalId.get(t.id);
    return {
      templateId: t.id,
      name: t.name,
      description: (t.description ?? '').trim(),
      icon: (t.icon ?? '').trim(),
      type: t.type,
      templateLevel: t.level,
      unlocked: Boolean(um),
      userLevel: um?.level,
      obtainedAt: um?.obtainedAt
    };
  });
}

function isRemoteIcon(src: string) {
  return /^https?:\/\//i.test(src);
}

function subtitleFor(item: MedalGridItem) {
  if (item.description) return item.description;
  if (item.userLevel != null) return `等级 Lv.${item.userLevel}`;
  return item.type;
}

async function loadMedalPage() {
  pageLoading.value = true;
  try {
    const [rawUser, rawTpl] = await Promise.all([fetchUserMedals(), fetchMedalTemplates()]);
    const userRows = extractArray(rawUser) as UserMedal[];
    const tplRows = extractArray(rawTpl) as MedalTemplate[];
    const userMap = bestUserMedalByMedalId(userRows);
    gridItems.value = buildGridItems(tplRows, userMap);
  } catch (e) {
    console.error('loadMedalPage', e);
    gridItems.value = [];
  } finally {
    pageLoading.value = false;
  }
}

const onBack = () => {
  navigateBack();
};

onMounted(() => {
  loadMedalPage();
});
</script>
<style scoped lang="scss"></style>
