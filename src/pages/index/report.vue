<template>
    <view class="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden box-border pb-32 theme-bg meditation-page">
        <HomeBar :title="'报告'" description="回 顾 历 史" :titleIcon="'icon-chaye'" :leftIcon="'icon-Trophy'" />

        <view class="flex-1 w-full max-w-full min-w-0 box-border px-6 flex flex-col">
            <view class="w-full max-w-full min-w-0 pt-6 space-y-8 box-border">
                <!-- Health Dashboard Cards -->
                <view class="grid grid-cols-2 gap-4 w-full min-w-0">
                    <!-- Left Card: Recent -->
                    <view
                        class="relative glass-card rounded-3xl p-5 bg-theme-13 space-y-3 flex flex-col justify-between aspect-square border border-white/20 min-w-0 overflow-hidden">
                        <view class="absolute -right-4 -top-4 text-primary/10 select-none">
                            <text class="icon-shijian  iconfont text-8xl"></text>
                        </view>
                        <view class="space-y-1">
                            <view class="text-[10px] tracking-[0.15rem] uppercase text-on-surface-variant/60 font-medium"></view>
                            <view class="font-headline text-[40rpx] theme-color-7">最近冥想</view>
                        </view>
                        <view class="space-y-1 theme-color-6">
                            <view class="text-[48rpx] font-semibold text-primary">18<span
                                    class="text-[24rpx] ml-1 font-normal opacity-70">分钟</span>
                            </view>
                            <view class="text-[24rpx] text-on-surface-variant flex items-center gap-1">
                                <span class="iconfont icon-shijian text-[24rpx]"></span>
                                专注85分
                            </view>
                        </view>
                    </view>
                    <!-- Right Card: Monthly Trend -->
                    <view
                        class="relative bg-theme-13 rounded-3xl p-5 space-y-3 flex flex-col justify-between aspect-square min-w-0 overflow-hidden">
                        <view class="absolute -right-4 -top-4 text-primary/10 select-none">
                            <text class="icon-pingfenxiangguanli  iconfont text-8xl"></text>
                        </view>
                        <view class="space-y-1">
                            <view class="text-[10px] tracking-[0.15rem] uppercase text-on-surface-variant/60 font-medium"></view>
                            <view class="font-headline text-[40rpx] theme-color-7">本月趋势</view>
                        </view>
                        <view class="space-y-1 theme-color-6">
                            <view class="text-[48rpx] font-semibold text-primary">82<span
                                    class="text-[24rpx] ml-1 font-normal opacity-70">分 ↑</span>
                            </view>
                            <view class="text-[24rpx] text-on-surface-variant flex items-center gap-1">
                                <span class="iconfont icon-pingfenxiangguanli text-[24rpx]"></span>
                                压力62分
                            </view>
                        </view>
                    </view>
                </view>
                <!-- Filter Bar -->
                <view
                    class="flex justify-center items-center bg-surface-container-low/50 rounded-full p-1.5 max-w-full mx-auto px-1 box-border">
                    <view
                        class="px-6 py-1.5 rounded-full text-sm text-on-surface-variant/50 transition-all">日</view>
                    <view
                        class="px-8 py-1.5 rounded-full text-sm font-semibold bg-white text-primary shadow-sm ring-1 ring-black/5">周</view>
                    <view
                        class="px-6 py-1.5 rounded-full text-sm text-on-surface-variant/50 transition-all">月</view>
                </view>
                <!-- Duration Chart -->
                <view class="space-y-4 w-full max-w-full min-w-0 box-border">
                    <view class="flex justify-between items-end gap-2 px-2 min-w-0">
                        <view class="font-headline text-[40rpx] theme-color-7">冥想时长</view>
                        <view class="text-xs font-label tracking-widest text-on-surface-variant/60">分钟 / 日期</view>
                    </view>
                    <view class="bg-white/30 rounded-[32px] p-4 w-full max-w-full min-w-0 overflow-hidden box-border">
                        <view class="w-full max-w-full min-w-0 box-border" style="height: 190px">
                            <qiun-data-charts
                                type="column"
                                canvas-id="weeklyDurationChart"
                                :canvas2d="true"
                                background="transparent"
                                :chart-data="durationChartData"
                                :opts="durationOpts" />
                        </view>
                    </view>
                </view>
                <!-- Data Comparison -->
                <view class="space-y-6 w-full max-w-full min-w-0">
                    <view class="flex justify-between items-center gap-2 min-w-0">
                        <view class="font-headline text-[40rpx] theme-color-7 shrink-0">数据对比</view>
                        <view class="flex gap-2 shrink-0">
                            <view class="flex items-center gap-1 px-3 py-1.5 bg-surface-container-low rounded-full">
                                <span class="text-[10px] text-on-surface font-medium">上周</span>
                                <span class="icon-expand_more_px_rounded iconfont text-[24rpx]"></span>
                            </view>
                            <view class="flex items-center gap-1 px-3 py-1.5 bg-surface-container-low rounded-full">
                                <span class="text-[10px] text-on-surface font-medium">本周</span>
                                <span class="icon-expand_more_px_rounded iconfont text-[24rpx]"></span>
                            </view>
                        </view>
                    </view>
                    <view
                        class="relative w-full max-w-full min-w-0 h-40 bg-surface-container-lowest/20 flex items-center justify-center border border-white/30 box-border overflow-hidden">
                        <view class="w-full max-w-full min-w-0 box-border" style="height: 130px">
                            <qiun-data-charts
                                type="line"
                                canvas-id="weeklyCompareChart"
                                :canvas2d="true"
                                background="transparent"
                                :chart-data="compareChartData"
                                :opts="compareOpts" />
                        </view>
                        <view class="absolute bottom-4 left-4 flex gap-4">
                            <view class="flex items-center gap-1.5">
                                <view class="w-2 h-2 rounded-full bg-primary/20"></view>
                                <span class="text-[9px] font-label text-on-surface-variant/60">LAST WEEK</span>
                            </view>
                            <view class="flex items-center gap-1.5">
                                <view class="w-2 h-2 rounded-full bg-primary"></view>
                                <span class="text-[9px] font-label text-on-surface font-bold">THIS WEEK</span>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- Aesthetic Quote/Insight Footer -->
                <view class="pb-12 text-center">
                    <view
                        class="font-headline theme-color-8 italic text-on-surface-variant/40 text-sm max-w-[200px] mx-auto leading-relaxed">
                        “数据不是生活的终点，而是觉知的镜子。”
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import { getMusicList } from '@/assets/js/api/user';
import { config } from '@/assets/js/config';
import HomeBar from '@/components/homeBar.vue';

const weeklyDurationCategories = ['05.10', '05.11', '05.12', '05.13', '05.14', '05.15', '05.16'];
const weeklyDurationSeries = [
    {
        name: '时长',
        data: [16, 24, 32, 20, 28, 12, 18]
    }
];
const durationChartData = {
    categories: weeklyDurationCategories,
    series: weeklyDurationSeries
};
const durationOpts = {
    color: ['#705900'],
    legend: { show: false },
    padding: [12, 12, 8, 6],
    xAxis: {
        disableGrid: true,
        fontSize: 10,
        fontColor: '#7d7463'
    },
    yAxis: {
        data: [
            {
                min: 0,
                max: 40,
                title: '分钟',
                titleFontSize: 10,
                titleFontColor: '#7d7463',
                axisLine: false
            }
        ],
        gridType: 'dash',
        dashLength: 4,
        fontSize: 10,
        fontColor: '#7d7463'
    },
    extra: {
        column: {
            type: 'group',
            width: 18,
            borderRadius: [8, 8, 8, 8]
        }
    }
};
const weeklyCompareCategories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const weeklyCompareSeries = [
    {
        name: '上周',
        data: [58, 55, 62, 60, 66, 69, 65]
    },
    {
        name: '本周',
        data: [54, 60, 67, 72, 76, 82, 79]
    }
];
const compareChartData = {
    categories: weeklyCompareCategories,
    series: weeklyCompareSeries
};
const compareOpts = {
    color: ['rgba(112,89,0,0.25)', '#705900'],
    legend: { show: false },
    padding: [8, 8, 4, 4],
    xAxis: {
        disableGrid: true,
        fontSize: 10,
        fontColor: '#7d7463'
    },
    yAxis: {
        data: [{ min: 45, max: 90, axisLine: false }],
        splitNumber: 3,
        gridType: 'dash',
        dashLength: 3,
        fontSize: 10,
        fontColor: '#7d7463'
    },
    extra: {
        line: {
            type: 'curve',
            width: 2,
            activeType: 'hollow'
        }
    }
};

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
const activeList = reactive([
    { id: 1, type: "dark", imgUrl: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009", totalTime: "25 MINS", endTime: "22:00 今晚", title: '深夜觉察', url: "", subtitle: "静坐于此，观照情绪如深夜之云悄然飘过。", viewClass: "text-white", spanClass: "text-white/60", bgClass: 'from-indigo-950/100 via-slate-10/60', btnClass: 'bg-white/10 backdrop-blur-xl', icon: 'meditation' },
    { id: 2, type: "light", imgUrl: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8", totalTime: "15 MINS", endTime: "08:00 清晨", title: '晨间安宁', url: "", subtitle: "旭日东升，呼吸之间，回归你本自具足的宁静。", viewClass: "text-[#4a4538]", spanClass: "text-[#1a170f]/80", bgClass: 'from-amber-50/100 via-orange-100/60', btnClass: 'bg-theme-10 theme-color-1', icon: 'question' },
    { id: 3, type: "simple", imgUrl: "", totalTime: "5 MINS", endTime: "12:00 午间", title: '午间小憩', url: "", subtitle: "于白昼繁杂中，寻得一处内心清明之地。", viewClass: "text-[#4a4538]", spanClass: "text-[#1a170f]/80", bgClass: 'from-blue-50/50 via-white/40', btnClass: 'bg-blue-500/10 text-blue-600 ', icon: 'answer' },
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