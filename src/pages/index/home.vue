<template>
    <view class="flex flex-col min-h-screen pb-32 theme-bg meditation-page">
      <HomeBar
        title="云息空间"
        description="极 简 禅 意"
        :leftIcon="'icon-bell'"
        :messageCount="messageUnreadCount"
        titleIcon="icon-Cloudy"
        :handleClick="goProfile" />
  
      <view class="flex-1 px-6 flex items-center">
        <view class="flex-1 flex flex-col items-center relative overflow-y-auto no-scrollbar pt-4">
          <!-- Interactive Time Selection -->
          <view class="w-full flex flex-col items-center justify-center relative">
            <view
              class="glow-blob absolute top-1/2 left-1/2 w-full aspect-square bg-primary/5 blur-[100px] rounded-full -z-10" />
  
            <view
              class="ring-touch-area relative w-full max-w-[320px] aspect-square flex items-center justify-center float-ring">
              <view
                class="absolute inset-0 rounded-full border border-gray-200 dark:border-primary/10 ring-border-pulse" />
  
              <!-- 仅环形区域接收拖拽：z-index 低于中间控制区，避免拦截 +/- 的 tap -->
              <view class="ring-hit-layer absolute inset-0 z-[5] rounded-full" @touchstart.stop="onRingTouch"
                @touchmove.stop.prevent="onRingTouch" @touchend.stop="onRingTouch" @touchcancel.stop="onRingTouch" />
  
              <!-- 进度环：border 底轨 + conic-gradient 进度（替代 SVG，小程序兼容性更好） -->
              <view class="absolute inset-0 z-10 rounded-full pointer-events-none ring-progress-stack">
                <view class="absolute inset-0 rounded-full ring-track-border" />
                <view class="absolute inset-0 rounded-full ring-progress-conic" :style="ringConicStyle" />
                <view class="absolute rounded-full ring-progress-hole" />
              </view>
  
              <!-- 环形拖块：臂长 45% 与环半径比例一致 -->
              <view class="absolute left-1/2 bottom-1/2 z-20 flex justify-center pointer-events-none"
                style="width: 0; height: 45%; transform-origin: 50% 100%"
                :style="{ transform: `translateX(-50%) rotate(${handleRotateDeg}deg)` }">
                <view
                  class="absolute top-[-25rpx] left-1/2 size-5 -ml-2.5 -mt-2.5 rounded-full bg-white dark:bg-background-dark border-2 border-primary shadow-lg handle-dot" />
              </view>
  
              <!-- z-30 盖在 ring-hit 之上，保证 +/- 与数字区域可点 -->
              <view class="text-center z-30 flex flex-col items-center relative px-2 py-1">
                <view class="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2 label-shimmer">设定时长</view>
                <view class="flex items-center gap-3 my-2">
                  <view
                    class="size-10 rounded-full bg-white dark:bg-white/5 border border-primary/10 flex items-center justify-center shadow-sm btn-press"
                    hover-class="btn-press-active" role="button" @click.stop="adjustMinutes(-stepMinutes)">
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
                    hover-class="btn-press-active" role="button" @click.stop="adjustMinutes(stepMinutes)">
                    <text class="iconfont icon-add theme-color-1 text-[30rpx]" />
                  </view>
                </view>
              </view>
            </view>
  
            <!-- 仅保留自定义滑轨（与圆环共用 durationMinutes，避免 u-slider 与 v-model 互相覆盖） -->
            <view class="w-full max-w-xs mt-12 px-4">
              <view class="text-center text-[26rpx] font-medium theme-color-1 mb-3 tabular-nums">{{ durationMinutes }} 分钟
              </view>
              <view class="duration-track relative h-2 rounded-full bg-gray-200 dark:bg-primary/20"
                @touchstart.stop.prevent="onBarTouch" @touchmove.stop.prevent="onBarTouch" @touchend.stop="onBarTouch"
                @touchcancel.stop="onBarTouch">
                <view
                  :class="['absolute left-0 top-0 h-full rounded-full bg-primary', barDragging ? '' : 'track-fill-anim']"
                  :style="{ width: barPercent + '%' }" />
                <view
                  class="absolute top-1/2 size-4 rounded-full bg-white border-2 border-primary shadow-md thumb-pulse thumb-center"
                  :style="{ left: barPercent + '%' }" />
              </view>
              <view class="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                <view>{{ minLabel }}</view>
                <view>{{ maxLabel }}</view>
              </view>
            </view>
          </view>
  
          <!-- 疗愈音频 -->
          <view class="w-full mt-4 audio-card-anim">
            <view
              class="bg-white/30 dark:bg-primary/5 rounded-2xl border border-primary/5 backdrop-blur-sm overflow-hidden">
              <view class="flex items-center justify-between p-4" @click="audioExpanded = !audioExpanded">
                <view class="flex items-center gap-2">
                  <view class="iconfont icon-musicnote theme-color-1 text-[40rpx] music-icon-bob" />
                  <view class="text-sm font-semibold tracking-wide uppercase opacity-70">疗愈音频</view>
                </view>
                <view class="flex items-center gap-2">
                  <view class="text-[10px] font-bold theme-color-1 truncate max-w-[180rpx]">
                    {{ currentTrackTitle }}
                  </view>
                  <view class="iconfont icon-jinru theme-color-1 text-[20rpx] transition-transform duration-300"
                    :class="audioExpanded ? 'rotate-180' : ''" />
                </view>
              </view>
              <view v-show="audioExpanded" class="px-4 pb-4">
                <up-list class="music-up-list" height="420rpx" :lower-threshold="100" :show-scrollbar="true"
                  @scrolltolower="onMusicScrollToLower">
                  <up-list-item v-for="item in audioTracks" :key="item.id" :anchor="String(item.id)">
                    <view class="flex items-center gap-3 p-2 rounded-xl border transition-colors mb-2" :class="playingId === item.id
                        ? 'bg-primary/5 border-primary/10'
                        : 'border-transparent active:bg-white/40 dark:active:bg-white/5'
                      " @click="togglePlay(item)">
                      <view class="size-10 rounded-lg flex items-center justify-center shrink-0" :class="item.coverClass">
                        <text :class="playingId === item.id ? 'iconfont icon-pause' : 'iconfont icon-round-play_arrow-p'"
                          class="theme-color-1 text-[30rpx]" />
                      </view>
                      <view class="flex-1 min-w-0">
                        <view class="text-xs font-bold truncate">{{ item.title }}</view>
                        <view class="text-[10px] text-gray-500">{{ item.subtitle }}</view>
                      </view>
                      <view v-if="playingId === item.id"
                        class="size-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                    </view>
                  </up-list-item>
                  <up-loadmore :status="musicLoadStatus" line @loadmore="loadMoreMusic" />
                </up-list>
                <view v-if="!musicFetching && audioTracks.length === 0" class="text-center py-6 text-xs text-gray-400">
                  暂无音乐
                </view>
                <view class="block text-center pt-2 text-[10px] font-bold text-primary/60">长按卡片可试听（点击播放/暂停）</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="px-6 space-y-6 mt-8">
        <view class="text-[28rpx] font-bold uppercase tracking-widest theme-color-8 px-2">场景化冥想</view>
        <view class="flex gap-6 overflow-x-auto pb-10 pt-2 px-2 snap-x no-scrollbar">
          <view v-for="(item, index) in activeList" :key="index"
            class="relative flex-shrink-0 w-[85%] h-64 cloud-card shadow-2xl shadow-indigo-900/10 snap-center overflow-hidden">
            <view :class="item.bgClass" class="absolute inset-0 bg-gradient-to-tr to-transparent z-0">
            </view>
            <view :class="'bg-[url(\'' + item.imgUrl + '\')]'"
              class="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay">
            </view>
            <view class="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
              <view class="mb-3">
                <text :class="item.btnClass"
                  class="px-3 py-1 rounded-full  text-[20rpx] font-medium tracking-widest border border-white/20">
                  {{ item.endTime }}</text>
              </view>
              <view :class="item.h2Class" class="text-2xl font-medium mb-3 tracking-tight ">{{ item.title }}</view>
              <view :class="item.spanClass" class="text-xs leading-relaxed font-light mb-6">{{ item.subtitle }}</view>
              <view class="flex items-center justify-between">
                <button @click="startMeditation(item)"
                  class="px-[48rpx] py-[20rpx] bg-theme-1 text-white rounded-full text-[20rpx] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 backdrop-blur-sm">
                  开启心流
                </button>
                <view class="text-[20rpx] text-white/40 tracking-widest">{{ item.totalTime }}</view>
              </view>
            </view>
          </view>
          <view
            class="relative flex-shrink-0 w-[85%] h-64 cloud-card shadow-2xl shadow-indigo-900/10 snap-center overflow-hidden">
            <view class="absolute inset-0 bg-gradient-to-tr from-indigo-950/100 via-slate-10/60 to-transparent z-0">
            </view>
            <view
              class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532767153582-b1a0e5145009')] bg-cover bg-center opacity-30 mix-blend-overlay">
            </view>
            <view class="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
              <view class="mb-3">
                <text
                  class="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl  text-[20rpx] font-medium tracking-widest border border-white/20">
                  22:00
                  今晚</text>
              </view>
              <view class="text-2xl font-medium mb-3 tracking-tight text-white">深夜觉察</view>
              <view class="text-xs text-white/60 leading-relaxed font-light mb-6">静坐于此，观照情绪如深夜之云悄然飘过。</view>
              <view class="flex items-center justify-between">
                <button
                  class="px-[48rpx] py-[10rpx] bg-theme-1 text-white rounded-full text-[20rpx] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 backdrop-blur-sm">
                  开启心流
                </button>
                <view class="text-[20rpx] text-white/40 tracking-widest">12 MINS</view>
              </view>
            </view>
          </view>
          <view
            class="relative flex-shrink-0 w-[85%] h-64 cloud-card shadow-2xl shadow-orange-900/5 snap-center overflow-hidden">
            <view class="absolute inset-0 bg-gradient-to-br from-amber-50/100 via-orange-100/60 to-white/10 z-0">
            </view>
            <view
              class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8')] bg-cover bg-center opacity-20 mix-blend-multiply">
            </view>
            <view class="absolute inset-0 p-8 flex flex-col justify-end z-10">
              <view class="mb-3">
                <text
                  class="px-3 py-1 rounded-full bg-theme-10 theme-color-1 text-[20rpx] font-medium tracking-widest border border-primary/10">08:00
                  清晨</text>
              </view>
              <text class="text-2xl font-medium mb-3 tracking-tight text-[#4a4538]">晨间安宁</text>
              <text class="text-xs text-[#1a170f]/80 leading-relaxed font-light mb-6">旭日东升，呼吸之间，回归你本自具足的宁静。</text>
              <view class="flex items-center justify-between">
                <button
                  class="px-[48rpx] py-[10rpx] bg-theme-1 text-white rounded-full text-[20rpx] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 backdrop-blur-sm">
                  开启心流
                </button>
                <text class="text-[20rpx] text-[#918355]/60 tracking-widest">15 MINS</text>
              </view>
            </view>
          </view>
          <view
            class="relative flex-shrink-0 w-[85%] h-64 cloud-card shadow-2xl shadow-blue-900/5 snap-center overflow-hidden">
            <view class="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-white/40 to-transparent z-0">
            </view>
            <view class="absolute inset-0 p-8 flex flex-col justify-end z-10">
              <view class="mb-3">
                <text
                  class="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold tracking-widest border border-blue-500/10">12:00
                  午间</text>
              </view>
              <h3 class="text-2xl font-medium mb-3 tracking-tight text-[#4a4538]">午间小憩</h3>
              <view class="text-xs text-[#1a170f]/80 leading-relaxed font-light mb-6">于白昼繁杂中，寻得一处内心清明之地。
              </view>
              <view class="flex items-center justify-between">
                <button
                  class="px-[48rpx] py-[10rpx] bg-theme-1 text-white rounded-full text-[20rpx] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 backdrop-blur-sm">
                  开启心流
                </button>
                <text class="text-[20rpx] text-[#918355]/60 tracking-widest">5 MINS</text>
              </view>
            </view>
          </view>
          <!-- <view @click="onNavigate('meditation')"
                      class="relative flex-shrink-0 w-80 h-64 rounded-2xl overflow-hidden snap-center group cursor-pointer">
                      <image src="https://picsum.photos/seed/night/800/600"
                          class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer" />
                      <view
                          class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
                          <span
                              class="w-fit px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold mb-3">22:00
                              今晚</span>
                          <text class="text-xl font-bold mb-2">深夜觉察</text>
                          <view class="text-sm text-white/70 leading-relaxed font-light">静坐于此，观照情绪如深夜之云悄然飘过。</view>
                          <view class="mt-4 flex items-center gap-4">
                              <button
                                  class="px-6 py-2 bg-[#d4af35] rounded-full text-black text-xs font-bold uppercase tracking-wider">开启心流</button>
                              <span class="text-xs text-white/50">12 mins</span>
                          </view>
                      </view>
                  </view> -->
        </view>
      </view>
      <!-- //开始按钮 -->
      <view class="fixed bottom-24 right-6 flex flex-col gap-3">
        <button
        @click="onStartMeditation()"
          class="flex items-center justify-center w-[112rpx] h-[112rpx] rounded-full  bg-theme-2 text-background-dark shadow-lg shadow-primary/20 active:scale-95 transition-transform">
          <text class="iconfont icon-zap-fast text-[50rpx] text-white"></text>
        </button>
      </view>
    </view>
  </template>
  
  <script setup lang="ts">
  import { getCurrentInstance } from 'vue';
  import { fetchMessageUnreadCount } from '@/assets/js/api/message';
  import { getMusicList } from '@/assets/js/api/user';
  import { config } from '@/assets/js/config';
  import HomeBar from '@/components/homeBar.vue';
  import { unwrapApiData } from '@/utils/apiResponse';
  
  /** 分钟范围（与 UI 文案 05–60 一致） */
  const minMinutes = 5;
  const maxMinutes = 60;
  const stepMinutes = 1;
  
  /** 默认取区间中间偏下，避免为 min 时进度条/圆环为 0 看起来像「无填充」 */
  const durationMinutes = ref(15);
  const audioExpanded = ref(false);
  
  const barDragging = ref(false);
  
  const ringProgress = computed(() => {
    const span = maxMinutes - minMinutes;
    if (span <= 0) return 0;
    const cur = Number(durationMinutes.value);
    const base = Number.isNaN(cur) ? minMinutes : cur;
    return Math.min(1, Math.max(0, (base - minMinutes) / span));
  });

  /** 首页铃铛未读角标（GET `/app/message/unread-count` 的 data） */
  const messageUnreadCount = ref(0);

  /**
   * 拉取未读消息数。首页为 tabBar 页，应在 `onShow` 调用，从消息页返回时会自动刷新。
   */
  async function loadMessageUnreadCount() {
    try {
      const res = await fetchMessageUnreadCount();
      const inner = unwrapApiData<Record<string, unknown> | number>(res);
      let n = 0;
      if (typeof inner === 'number') {
        n = inner;
      } else if (inner && typeof inner === 'object' && typeof inner.data === 'number') {
        n = inner.data;
      }
      messageUnreadCount.value = Math.max(0, Math.floor(n));
    } catch (e) {
      console.error('fetchMessageUnreadCount', e);
    }
  }

  // 跳转消息中心
  const goProfile = () => {
    uni.navigateTo({
      url: '/pages/message/index'
    });
  };

  const activeList = reactive([
      { id: 1, type:"dark" ,imgUrl:"https://images.unsplash.com/photo-1532767153582-b1a0e5145009",totalTime:"25 MINS",endTime:"22:00 今晚", title: '深夜觉察',url:"",subtitle:"静坐于此，观照情绪如深夜之云悄然飘过。", h2Class:"text-white",spanClass:"text-white/60", bgClass: 'from-indigo-950/100 via-slate-10/60', btnClass: 'bg-white/10 backdrop-blur-xl', icon: 'meditation' },
      { id: 2, type:"light" , imgUrl:"https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",totalTime:"15 MINS",endTime:"08:00 清晨", title: '晨间安宁',url:"",subtitle:"旭日东升，呼吸之间，回归你本自具足的宁静。",  h2Class:"text-[#4a4538]",spanClass:"text-[#1a170f]/80",  bgClass: 'from-amber-50/100 via-orange-100/60', btnClass: 'bg-theme-10 theme-color-1', icon: 'question' },
      { id: 3, type:"simple", imgUrl:"",totalTime:"5 MINS",endTime:"12:00 午间", title: '午间小憩',url:"",subtitle:"于白昼繁杂中，寻得一处内心清明之地。",  h2Class:"text-[#4a4538]",spanClass:"text-[#1a170f]/80",  bgClass: 'from-blue-50/50 via-white/40', btnClass: 'bg-blue-500/10 text-blue-600 ', icon: 'answer' },
  ]);
  //开始禅修
  const startMeditation = (item: any) => {
      console.log("开始禅修：", item);
      uni.switchTab({
          url: `/pages/index/meditation?scene=${item.type}`
      });
      // 这里可以添加实际的导航或功能逻辑
  };
  
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
  
  const MUSIC_PAGE_SIZE = 10;
  
  /** 为 true 时使用本地模拟数据（分页仍走滚动加载）；接好接口后改为 false */
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
  
  function resolveAudioUrl(raw: string | undefined | null): string {
    const u = (raw || '').trim();
    if (!u) return '';
    if (/^https?:\/\//i.test(u)) return u;
    if (u.startsWith('//')) return `https:${u}`;
    const base = config.baseURL.replace(/\/+$/, '');
    const path = u.startsWith('/') ? u : `/${u}`;
    return `${base}${path}`;
  }
  
  function mapMusicItem(raw: Record<string, unknown>, index: number): AudioTrack {
    const id = String(raw.id ?? raw.musicId ?? `idx-${index}`);
    const title = String(raw.title ?? raw.name ?? '未命名');
    const subtitle = String(raw.subtitle ?? raw.artist ?? raw.remark ?? raw.description ?? '');
    const url = resolveAudioUrl(
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
  
  function extractMusicListPayload(res: unknown): {
    list: Record<string, unknown>[];
    total?: number;
    hasNext?: boolean;
  } {
    if (res == null) return { list: [] };
    const body = res as Record<string, unknown>;
    const inner = body.data !== undefined ? body.data : body;
    if (Array.isArray(inner)) {
      return { list: inner as Record<string, unknown>[] };
    }
    const d = inner as Record<string, unknown>;
    const list = (d?.list ?? d?.records ?? d?.rows ?? d?.items ?? d?.data ?? []) as unknown[];
    const total = d?.total ?? d?.totalCount;
    const hasNext = d?.hasNext;
    const hasMore = d?.hasMore;
    let hasNextFlag: boolean | undefined;
    if (typeof hasNext === 'boolean') hasNextFlag = hasNext;
    else if (typeof hasMore === 'boolean') hasNextFlag = hasMore;
    return {
      list: (Array.isArray(list) ? list : []) as Record<string, unknown>[],
      total: typeof total === 'number' ? total : undefined,
      hasNext: hasNextFlag
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
        const res = await getMusicList({ page, pageSize: MUSIC_PAGE_SIZE });
        const { list: rawList, total, hasNext } = extractMusicListPayload(res);
        const startIdx = audioTracks.value.length;
        const mapped = rawList.map((raw, i) => mapMusicItem(raw, startIdx + i));
        audioTracks.value = audioTracks.value.concat(mapped);
  
        const got = mapped.length;
        const reachedTotal = total != null && audioTracks.value.length >= total;
        const noMore =
          hasNext === false ||
          got === 0 ||
          got < MUSIC_PAGE_SIZE ||
          reachedTotal;
  
        if (noMore) {
          musicListFinished.value = true;
          musicLoadStatus.value = 'nomore';
        } else {
          musicNextPage.value = page + 1;
          musicLoadStatus.value = 'loadmore';
        }
      }
    } catch (e) {
      console.error('getMusicList', e);
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

  onShow(() => {
    loadMessageUnreadCount();
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
  