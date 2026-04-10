<template>
  <view class="flex flex-col min-h-screen pb-32 theme-bg meditation-page">
    <HomeBar :title="'冥想设置'" description="进 入 冥 想" :titleIcon="'icon-chaye'" :leftIcon="'icon-Trophy'" />

    <view class="flex-1 px-6 pt-8 flex items-center">
      <view class="flex-1 flex flex-col items-center relative overflow-y-auto no-scrollbar pt-4 pb-32">
        <!-- Interactive Time Selection -->
        <view class="w-full flex flex-col items-center justify-center py-8 relative">
          <view
            class="glow-blob absolute top-1/2 left-1/2 w-full aspect-square bg-primary/5 blur-[100px] rounded-full -z-10"
          />

          <view class="ring-touch-area relative w-full max-w-[320px] aspect-square flex items-center justify-center float-ring">
            <view class="absolute inset-0 rounded-full border border-gray-200 dark:border-primary/10 ring-border-pulse" />

            <!-- 仅环形区域接收拖拽：z-index 低于中间控制区，避免拦截 +/- 的 tap -->
            <view
              class="ring-hit-layer absolute inset-0 z-[5] rounded-full"
              @touchstart.stop="onRingTouch"
              @touchmove.stop.prevent="onRingTouch"
              @touchend.stop="onRingTouch"
              @touchcancel.stop="onRingTouch"
            />

            <!-- 进度环：border 底轨 + conic-gradient 进度（替代 SVG，小程序兼容性更好） -->
            <view class="absolute inset-0 z-10 rounded-full pointer-events-none ring-progress-stack">
              <view class="absolute inset-0 rounded-full ring-track-border" />
              <view class="absolute inset-0 rounded-full ring-progress-conic" :style="ringConicStyle" />
              <view class="absolute rounded-full ring-progress-hole" />
            </view>

            <!-- 环形拖块：臂长 45% 与环半径比例一致 -->
            <view
              class="absolute left-1/2 bottom-1/2 z-20 flex justify-center pointer-events-none"
              style="width: 0; height: 45%; transform-origin: 50% 100%"
              :style="{ transform: `translateX(-50%) rotate(${handleRotateDeg}deg)` }"
            >
              <view
                class="absolute top-[-25rpx] left-1/2 size-5 -ml-2.5 -mt-2.5 rounded-full bg-white dark:bg-background-dark border-2 border-primary shadow-lg handle-dot"
              />
            </view>

            <!-- z-30 盖在 ring-hit 之上，保证 +/- 与数字区域可点 -->
            <view class="text-center z-30 flex flex-col items-center relative px-2 py-1">
              <view class="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2 label-shimmer">设定时长</view>
              <view class="flex items-center gap-3 my-2">
                <view
                  class="size-10 rounded-full bg-white dark:bg-white/5 border border-primary/10 flex items-center justify-center shadow-sm btn-press"
                  hover-class="btn-press-active"
                  role="button"
                  @click.stop="adjustMinutes(-stepMinutes)"
                >
                  <text class="iconfont icon-Remove-1 theme-color-1 font-bold text-[35rpx]" />
                </view>
                <view class="flex flex-col items-center">
                  <view class="text-7xl font-light text-gray-900 dark:text-white tracking-tighter tabular-nums">
                    {{ timeDisplay }}
                  </view>
                  <view class="text-xs text-gray-400 font-medium">分钟</view>
                </view>
                <view
                  class="size-10 rounded-full bg-white dark:bg-white/5 border border-primary/10 flex items-center justify-center shadow-sm btn-press"
                  hover-class="btn-press-active"
                  role="button"
                  @click.stop="adjustMinutes(stepMinutes)"
                >
                  <text class="iconfont icon-add theme-color-1 text-[30rpx]" />
                </view>
              </view>
            </view>
          </view>

          <!-- 仅保留自定义滑轨（与圆环共用 durationMinutes，避免 u-slider 与 v-model 互相覆盖） -->
          <view class="w-full max-w-xs mt-12 px-4">
            <view class="text-center text-[26rpx] font-medium theme-color-1 mb-3 tabular-nums">{{ durationMinutes }} 分钟</view>
            <view
              class="duration-track relative h-2 rounded-full bg-gray-200 dark:bg-primary/20"
              @touchstart.stop.prevent="onBarTouch"
              @touchmove.stop.prevent="onBarTouch"
              @touchend.stop="onBarTouch"
              @touchcancel.stop="onBarTouch"
            >
              <view
                :class="['absolute left-0 top-0 h-full rounded-full bg-primary', barDragging ? '' : 'track-fill-anim']"
                :style="{ width: barPercent + '%' }"
              />
              <view
                class="absolute top-1/2 size-4 rounded-full bg-white border-2 border-primary shadow-md thumb-pulse thumb-center"
                :style="{ left: barPercent + '%' }"
              />
            </view>
            <view class="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
              <view>{{ minLabel }}</view>
              <view>{{ maxLabel }}</view>
            </view>
          </view>
        </view>

        <!-- 疗愈音频 -->
        <view class="w-full mt-4 audio-card-anim">
          <view class="bg-white/30 dark:bg-primary/5 rounded-2xl border border-primary/5 backdrop-blur-sm overflow-hidden">
            <view class="flex items-center justify-between p-4" @click="audioExpanded = !audioExpanded">
              <view class="flex items-center gap-2">
                <view class="iconfont icon-musicnote theme-color-1 text-[40rpx] music-icon-bob" />
                <view class="text-sm font-semibold tracking-wide uppercase opacity-70">疗愈音频</view>
              </view>
              <view class="flex items-center gap-2">
                <view class="text-[10px] font-bold theme-color-1 truncate max-w-[180rpx]">
                  {{ currentTrackTitle }}
                </view>
                <view
                  class="iconfont icon-jinru theme-color-1 text-[20rpx] transition-transform duration-300"
                  :class="audioExpanded ? 'rotate-180' : ''"
                />
              </view>
            </view>
            <view v-show="audioExpanded" class="px-4 pb-4">
              <up-list
                class="music-up-list"
                height="420rpx"
                :lower-threshold="100"
                :show-scrollbar="true"
                @scrolltolower="onMusicScrollToLower"
              >
                <up-list-item v-for="item in audioTracks" :key="item.id" :anchor="String(item.id)">
                  <view
                    class="flex items-center gap-3 p-2 rounded-xl border transition-colors mb-2"
                    :class="
                      playingId === item.id
                        ? 'bg-primary/5 border-primary/10'
                        : 'border-transparent active:bg-white/40 dark:active:bg-white/5'
                    "
                    @click="togglePlay(item)"
                  >
                    <view
                      class="size-10 rounded-lg flex items-center justify-center shrink-0"
                      :class="item.coverClass"
                    >
                      <text
                        :class="playingId === item.id ? 'iconfont icon-pause' : 'iconfont icon-round-play_arrow-p'"
                        class="theme-color-1 text-[30rpx]"
                      />
                    </view>
                    <view class="flex-1 min-w-0">
                      <view class="text-xs font-bold truncate">{{ item.title }}</view>
                      <view class="text-[10px] text-gray-500">{{ item.subtitle }}</view>
                    </view>
                    <view v-if="playingId === item.id" class="size-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                  </view>
                </up-list-item>
                <up-loadmore
                  :status="musicLoadStatus"
                  line
                  @loadmore="loadMoreMusic"
                />
              </up-list>
              <view v-if="!musicFetching && audioTracks.length === 0" class="text-center py-6 text-xs text-gray-400">
                暂无音乐
              </view>
              <view class="block text-center pt-2 text-[10px] font-bold text-primary/60">长按卡片可试听（点击播放/暂停）</view>
            </view>
          </view>
        </view>
      </view>

      <view class="fixed bottom-0 left-0 right-0 z-30">
        <view
          class="p-6 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/95 dark:via-background-dark/95 to-transparent"
        >
          <button
            class="w-full bg-theme-1 text-white font-bold py-4 rounded-[80rpx] shadow-xl shadow-primary/20 flex items-center justify-center gap-2 btn-press-start"
            hover-class="opacity-90"
            @click="onStartMeditation"
          >
            <view class="text-sm tracking-widest uppercase">开始禅修</view>
            <text class="iconfont icon-zap-fast text-white/90 text-[36rpx]" />
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import { getMusicPage } from '@/assets/js/api/user';
import HomeBar from '@/components/homeBar.vue';
import type { MusicPageData } from '@/types/api/music';
import { unwrapApiData } from '@/utils/apiResponse';
import { mapMusicListItemToRow, resolveMusicAssetUrl } from '@/utils/musicPage';

/** 分钟范围（与 UI 文案 05–60 一致） */
const minMinutes = 5;
const maxMinutes = 60;
const stepMinutes = 1;

/** 默认取区间中间偏下，避免为 min 时进度条/圆环为 0 看起来像「无填充」 */
const durationMinutes = ref(15);
const audioExpanded = ref(true);

const barDragging = ref(false);

const ringProgress = computed(() => {
  const span = maxMinutes - minMinutes;
  if (span <= 0) return 0;
  const cur = Number(durationMinutes.value);
  const base = Number.isNaN(cur) ? minMinutes : cur;
  return Math.min(1, Math.max(0, (base - minMinutes) / span));
});

/** conic-gradient：from -90deg 从 12 点顺时针，与触摸 atan2 一致 */
const ringConicStyle = computed(() => {
  const p = ringProgress.value;
  const deg = 360 * p;
  return {
    backgroundImage: `conic-gradient(from -90deg, var(--color-1) 0deg, var(--color-1) ${deg}deg, transparent ${deg}deg)`
  };
});

/**
 * 圆形拖拽点：旋转角 = 360°×进度 − 90°（与 conic / 触摸顺时针进度对齐所需的相位补偿）。
 */
const handleRotateDeg = computed(() => 360 * ringProgress.value - 90);

const timeDisplay = computed(() => {
  const m = Number(durationMinutes.value);
  const safe = Number.isNaN(m) ? minMinutes : m;
  return `${String(safe).padStart(2, '0')}:00`;
});

const minLabel = computed(() => `${String(minMinutes).padStart(2, '0')}:00`);
const maxLabel = computed(() => `${String(maxMinutes).padStart(2, '0')}:00`);

const barPercent = computed(() => ringProgress.value * 100);

function clampMinutes(v: number) {
  return Math.min(maxMinutes, Math.max(minMinutes, Math.round(v)));
}

/** 统一为数字，避免滑条传入 string 时 "15"+1 === "151" */
function setDuration(v: unknown) {
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  if (Number.isNaN(n)) return;
  durationMinutes.value = clampMinutes(n);
}

function adjustMinutes(delta: number) {
  const cur = Number(durationMinutes.value);
  const base = Number.isNaN(cur) ? minMinutes : cur;
  setDuration(base + delta);
}

type AudioTrack = {
  id: string;
  title: string;
  subtitle: string;
  /** 须为 https 或同源可播地址，小程序要求 */
  url: string;
  coverClass: string;
};

const MUSIC_PAGE_SIZE = 20;

/** 为 true 时使用本地模拟数据（分页仍走滚动加载） */
const USE_MUSIC_MOCK = true;

/** 模拟列表（字段与 mapMusicItem 兼容；url 需为 https 以便小程序播放） */
const MOCK_MUSIC_LIST: Record<string, unknown>[] = [
  {
    id: 'mock-1',
    title: 'Return to Stability',
    subtitle: 'Nature & Flow',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'
  },
  {
    id: 'mock-2',
    title: 'Emotion like clouds',
    subtitle: 'Soft Ambient',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'mock-3',
    title: 'Forest Whisper',
    subtitle: 'Organic Echoes',
    url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav'
  },
  ...Array.from({ length: 21 }, (_, i) => ({
    id: `mock-${i + 4}`,
    title: `疗愈音轨 ${String(i + 4).padStart(2, '0')}`,
    subtitle: '模拟数据 · 滚动加载',
    url:
      i % 3 === 0
        ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'
        : i % 3 === 1
          ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
          : 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav'
  }))
];

const audioTracks = ref<AudioTrack[]>([]);
/** loadmore | loading | nomore */
const musicLoadStatus = ref<'loadmore' | 'loading' | 'nomore'>('loadmore');
const musicListFinished = ref(false);
const musicFetching = ref(false);
const musicNextPage = ref(1);

const COVER_CLASS_CYCLE = [
  'bg-gradient-to-br from-primary/30 to-background-dark/20',
  'bg-blue-100 dark:bg-blue-900/20',
  'bg-green-100 dark:bg-green-900/20',
  'bg-purple-100 dark:bg-purple-900/20'
];

function mapMusicItem(raw: Record<string, unknown>, index: number): AudioTrack {
  const id = String(raw.id ?? raw.musicId ?? `idx-${index}`);
  const title = String(raw.title ?? raw.name ?? '未命名');
  const subtitle = String(raw.subtitle ?? raw.artist ?? raw.remark ?? raw.description ?? '');
  const url = resolveMusicAssetUrl(
    (raw.url ?? raw.audioUrl ?? raw.fileUrl ?? raw.src ?? raw.path) as string | undefined
  );
  return {
    id,
    title,
    subtitle,
    url,
    coverClass: COVER_CLASS_CYCLE[index % COVER_CLASS_CYCLE.length]
  };
}

async function fetchMusicPage(reset: boolean) {
  if (musicFetching.value) return;
  if (musicListFinished.value && !reset) return;

  musicFetching.value = true;
  if (reset) {
    musicNextPage.value = 1;
    audioTracks.value = [];
    musicListFinished.value = false;
  }
  musicLoadStatus.value = 'loading';

  try {
    const page = musicNextPage.value;

    if (USE_MUSIC_MOCK) {
      await new Promise<void>((resolve) => setTimeout(resolve, 260));
      const start = (page - 1) * MUSIC_PAGE_SIZE;
      const slice = MOCK_MUSIC_LIST.slice(start, start + MUSIC_PAGE_SIZE);
      const startIdx = audioTracks.value.length;
      const mapped = slice.map((raw, i) => mapMusicItem(raw, startIdx + i));
      audioTracks.value = audioTracks.value.concat(mapped);
      const got = mapped.length;
      const total = MOCK_MUSIC_LIST.length;
      const noMore = got === 0 || audioTracks.value.length >= total;
      if (noMore) {
        musicListFinished.value = true;
        musicLoadStatus.value = 'nomore';
      } else {
        musicNextPage.value = page + 1;
        musicLoadStatus.value = 'loadmore';
      }
    } else {
      const res = await getMusicPage({ page, size: MUSIC_PAGE_SIZE });
      const data = unwrapApiData<MusicPageData>(res);
      if (!data || !Array.isArray(data.list)) {
        throw new Error('music page: invalid data');
      }
      const startIdx = audioTracks.value.length;
      const mapped = data.list.map((item, i) =>
        mapMusicListItemToRow(item, startIdx + i, COVER_CLASS_CYCLE),
      );
      audioTracks.value = audioTracks.value.concat(mapped);

      const got = mapped.length;
      const total = data.pagination?.total;
      const noMore =
        got === 0 ||
        got < MUSIC_PAGE_SIZE ||
        (typeof total === 'number' && total >= 0 && audioTracks.value.length >= total);

      if (noMore) {
        musicListFinished.value = true;
        musicLoadStatus.value = 'nomore';
      } else {
        musicNextPage.value = page + 1;
        musicLoadStatus.value = 'loadmore';
      }
    }
  } catch (e) {
    console.error('getMusicPage', e);
    musicLoadStatus.value = audioTracks.value.length ? 'nomore' : 'loadmore';
    uni.showToast({ title: '音乐列表加载失败', icon: 'none' });
  } finally {
    musicFetching.value = false;
  }
}

function onMusicScrollToLower() {
  if (!musicListFinished.value && !musicFetching.value) {
    fetchMusicPage(false);
  }
}

function loadMoreMusic() {
  if (musicLoadStatus.value === 'loadmore' && !musicListFinished.value && !musicFetching.value) {
    fetchMusicPage(false);
  }
}

onMounted(() => {
  fetchMusicPage(true);
});

const playingId = ref<string | null>(null);
let innerAudio: UniApp.InnerAudioContext | null = null;

const currentTrackTitle = computed(() => {
  const t = audioTracks.value.find((x: AudioTrack) => x.id === playingId.value);
  return t?.title || '未播放';
});

function ensureAudio() {
  if (innerAudio) return innerAudio;
  innerAudio = uni.createInnerAudioContext();
  innerAudio.obeyMuteSwitch = false;
  innerAudio.onEnded(() => {
    playingId.value = null;
  });
  innerAudio.onError((err) => {
    console.error('audio error', err);
    playingId.value = null;
    uni.showToast({ title: '音频无法播放，请检查网络或更换地址', icon: 'none' });
  });
  return innerAudio;
}

function stopAudio() {
  if (!innerAudio) return;
  try {
    innerAudio.stop();
  } catch {
    /* noop */
  }
}

function togglePlay(track: AudioTrack) {
  if (!track.url) {
    uni.showToast({ title: '无效音频地址', icon: 'none' });
    return;
  }
  const ctx = ensureAudio();
  if (playingId.value === track.id) {
    ctx.pause();
    playingId.value = null;
    return;
  }
  stopAudio();
  ctx.src = track.url;
  playingId.value = track.id;
  ctx.play();
}

function onStartMeditation() {
  const selected = audioTracks.value.find((x) => x.id === playingId.value) || audioTracks.value[0];
  const query = [
    `duration=${Number(durationMinutes.value)}`,
    selected?.id ? `trackId=${encodeURIComponent(selected.id)}` : '',
    selected?.title ? `trackTitle=${encodeURIComponent(selected.title)}` : '',
    selected?.url ? `trackUrl=${encodeURIComponent(selected.url)}` : ''
  ]
    .filter(Boolean)
    .join('&');

  try {
    uni.setStorageSync('meditation_duration_minutes', Number(durationMinutes.value));
  } catch {
    /* noop */
  }
  uni.navigateTo({
    url: `/pages/meditation/startMeditaiton?${query}`
  });
}

function touchViewportXY(touch: Touch) {
  const anyTouch = touch as Touch & { x?: number; y?: number };
  const x = anyTouch.clientX ?? anyTouch.pageX ?? anyTouch.x;
  const y = anyTouch.clientY ?? anyTouch.pageY ?? anyTouch.y;
  return { x: x ?? 0, y: y ?? 0 };
}

function createPageSelectorQuery() {
  const inst = getCurrentInstance();
  const q = uni.createSelectorQuery();
  return inst?.proxy ? q.in(inst.proxy) : q;
}

function minutesFromClientX(clientX: number, rect: UniApp.NodeInfo) {
  const w = rect.width || 1;
  const x = clientX - (rect.left || 0);
  const ratio = Math.min(1, Math.max(0, x / w));
  return clampMinutes(minMinutes + ratio * (maxMinutes - minMinutes));
}

function onBarTouch(e: TouchEvent) {
  const type = e.type;
  if (type === 'touchstart') barDragging.value = true;
  if (type === 'touchend' || type === 'touchcancel') barDragging.value = false;

  const touch = e.touches?.[0] || e.changedTouches?.[0];
  if (!touch) return;
  const { x: clientX } = touchViewportXY(touch);
  createPageSelectorQuery()
    .select('.duration-track')
    .boundingClientRect((rect) => {
      if (!rect || Array.isArray(rect)) return;
      setDuration(minutesFromClientX(clientX, rect));
    })
    .exec();
}

function onRingTouch(e: TouchEvent) {
  const touch = e.touches?.[0] || e.changedTouches?.[0];
  if (!touch) return;
  const { x: clientX, y: clientY } = touchViewportXY(touch);
  createPageSelectorQuery()
    .select('.ring-touch-area')
    .boundingClientRect((rect) => {
      if (!rect || Array.isArray(rect)) return;
      const cx = (rect.left || 0) + (rect.width || 0) / 2;
      const cy = (rect.top || 0) + (rect.height || 0) / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      let theta = Math.atan2(dx, -dy);
      // 拖拽点显示角度做了 -90°，触摸换算对应补 +90°，保证手指与拖拽点一致
      theta += Math.PI / 2;
      if (theta < 0) theta += 2 * Math.PI;
      if (theta >= 2 * Math.PI) theta -= 2 * Math.PI;
      const ratio = theta / (2 * Math.PI);
      setDuration(minMinutes + ratio * (maxMinutes - minMinutes));
    })
    .exec();
}

function disposeAudio() {
  stopAudio();
  if (innerAudio) {
    innerAudio.destroy();
    innerAudio = null;
  }
}

onUnload(disposeAudio);
onBeforeUnmount(disposeAudio);
</script>

<style scoped lang="scss">
.meditation-page {
  --meditation-glow: rgba(212, 175, 53, 0.35);
}

.music-up-list {
  width: 100%;
}


.glow-blob {
  animation: meditation-glow 5s ease-in-out infinite;
}

.float-ring {
  animation: meditation-float 6s ease-in-out infinite;
}

.label-shimmer {
  animation: label-shimmer 3s ease-in-out infinite;
}

.ring-border-pulse {
  animation: ring-border-pulse 4s ease-in-out infinite;
}

.thumb-pulse {
  animation: thumb-pulse 2.2s ease-in-out infinite;
}

/* 与填充右边缘对齐：圆点中心 = 进度比例位置 */
.thumb-center {
  transform: translate(-50%, -50%);
}

.music-icon-bob {
  animation: music-bob 2.5s ease-in-out infinite;
}

.handle-dot {
  transition: transform 0.2s ease-out;
}

/* 进度环：与 ring-track-border / ring-progress-hole 同宽，保证与 conic 同心 */
.ring-progress-stack {
  --ring-band: 12rpx;
}

.ring-track-border {
  box-sizing: border-box;
  border: var(--ring-band) solid var(--color-10);
  border-radius: 50%;
}

.ring-progress-conic {
  border-radius: 50%;
}

.ring-progress-hole {
  position: absolute;
  left: var(--ring-band);
  right: var(--ring-band);
  top: var(--ring-band);
  bottom: var(--ring-band);
  z-index: 1;
  background-color: var(--color-11);
  box-sizing: border-box;
}

.track-fill-anim {
  transition: width 0.2s ease-out;
}

.btn-press {
  transition: transform 0.15s ease;
}

.btn-press-active {
  transform: scale(0.92);
}

.btn-press-start {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.btn-press-start:active {
  transform: scale(0.98);
}

.audio-card-anim {
  animation: meditation-float 8s ease-in-out infinite;
  animation-delay: -2s;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

</style>
