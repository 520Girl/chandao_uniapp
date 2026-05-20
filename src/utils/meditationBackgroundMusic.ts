/**
 * 禅修音频（与疗愈音轨隔离）：
 *
 * - **进行中（微信）**：`BackgroundAudioManager` 仅播「全数字静音」切片（`VITE_MEDITATION_SILENCE_URL`，建议约 4 分钟）。
 *   微信后台音频 **无 volume 属性**，不能靠 `volume=0` 静音，素材本身必须无声；`onCanplay` 后再 `play`，避免换源时带出上一首疗愈音。
 * - **进行中（H5/App）**：`InnerAudio` + `loop=true` + `volume=0`。
 * - **结束**：独立 `InnerAudioContext` 渐强疗愈音（约 10s）；与跳转报告页并行，不等待播完。
 */
const envSilenceSrc = (import.meta.env.VITE_MEDITATION_SILENCE_URL || "").trim();

/**
 * 静音切片地址：配置了 `VITE_MEDITATION_SILENCE_URL` 时走网络（真机须 HTTPS + 合法域名）；否则用包内静态文件。
 */
export const MEDITATION_SILENCE_SRC =
  envSilenceSrc.length > 0 ? envSilenceSrc : "/static/silence.mp3";

const BG_MUTE = 0;
/** 结束音渐强总时长（毫秒） */
const END_RAMP_MS = 10000;
const END_VOL_TICK_MS = 80;
const END_VOL_MAX = 0.8;
const END_RAMP_STEPS = Math.max(24, Math.ceil(END_RAMP_MS / END_VOL_TICK_MS));
const BG_FORCE_MUTE_DELAY_MS = 100;
/** 仅 H5/App 静音 InnerAudio 使用；微信 BGM 无 volume，勿依赖 */
const BG_VOLUME_GUARD_MS = 1000;
const WX_SILENCE_PLAY_FALLBACK_MS = 480;

type MeditationAudioPhase = "idle" | "active" | "ending";

let meditationAudioPhase: MeditationAudioPhase = "idle";
let bgOpToken = 0;
let bgVolumeGuardTimer: ReturnType<typeof setInterval> | null = null;

// #ifdef MP-WEIXIN
let wxBgLastHandlers: {
  onPlay: () => void;
  onEnded: () => void;
  onError: (e: unknown) => void;
  onCanplay?: () => void;
  onSeeked?: () => void;
  onPause?: () => void;
  onWaiting?: () => void;
} | null = null;
// #endif

// #ifndef MP-WEIXIN
let silenceInner: UniApp.InnerAudioContext | null = null;
let silenceInnerEnded: (() => void) | null = null;
let silenceInnerError: ((e: unknown) => void) | null = null;
// #endif

let endMusicCtx: UniApp.InnerAudioContext | null = null;
let endMusicFadeTimer: ReturnType<typeof setInterval> | null = null;
let endMusicHandlers: {
  onPlay: () => void;
  onEnded: () => void;
  onError: (e: unknown) => void;
} | null = null;

function isMeditationSilenceActive(): boolean {
  return meditationAudioPhase === "active";
}

function setAudioVolumeSafe(target: unknown, volume: number) {
  const v = Math.min(1, Math.max(0, Number(volume)));
  if (!Number.isFinite(v)) return;
  if (!target || typeof target !== "object") return;
  try {
    (target as { volume?: number }).volume = v;
  } catch {
    /* noop */
  }
}

function clearBgVolumeGuard() {
  if (bgVolumeGuardTimer != null) {
    clearInterval(bgVolumeGuardTimer);
    bgVolumeGuardTimer = null;
  }
}

function clearEndMusicFadeTimer() {
  if (endMusicFadeTimer != null) {
    clearInterval(endMusicFadeTimer);
    endMusicFadeTimer = null;
  }
}

function destroyEndMusicInner() {
  clearEndMusicFadeTimer();
  const ctx = endMusicCtx;
  endMusicCtx = null;
  endMusicHandlers = null;
  if (!ctx) return;
  try {
    ctx.stop();
  } catch {
    /* noop */
  }
  try {
    ctx.destroy();
  } catch {
    /* noop */
  }
}

function scheduleBgForceMute(token: number) {
  setTimeout(() => {
    if (token !== bgOpToken || !isMeditationSilenceActive()) return;
    if (silenceInner) setAudioVolumeSafe(silenceInner, BG_MUTE);
  }, BG_FORCE_MUTE_DELAY_MS);
}

function startBgVolumeGuard(token: number) {
  clearBgVolumeGuard();
  // #ifndef MP-WEIXIN
  bgVolumeGuardTimer = setInterval(() => {
    if (token !== bgOpToken || !isMeditationSilenceActive()) return;
    if (silenceInner) {
      setAudioVolumeSafe(silenceInner, BG_MUTE);
      scheduleBgForceMute(token);
    }
  }, BG_VOLUME_GUARD_MS);
  // #endif
}

// #ifdef MP-WEIXIN
/** 抢占全局 BGM 单例，避免共修房/旧逻辑残留的疗愈音在换源瞬间被听到 */
function hardStopWxBackgroundAudio(): void {
  try {
    uni.getBackgroundAudioManager().stop();
  } catch {
    /* noop */
  }
}
// #endif

/**
 * 进入禅修页前调用：停止其它页面占用的微信后台音频（疗愈试听等）。
 */
export function preemptBackgroundAudioBeforeMeditation(): void {
  // #ifdef MP-WEIXIN
  hardStopWxBackgroundAudio();
  // #endif
}

/** 仅停后台静音保活，不销毁结束疗愈音（模块级 InnerAudio） */
function stopMeditationSilenceOnly(): void {
  bgOpToken += 1;
  clearBgVolumeGuard();

  // #ifdef MP-WEIXIN
  detachWxBackgroundHandlers();
  try {
    uni.getBackgroundAudioManager().stop();
  } catch {
    /* noop */
  }
  // #endif

  // #ifndef MP-WEIXIN
  destroySilenceInner();
  // #endif
}

// #ifdef MP-WEIXIN
function detachWxBackgroundHandlers() {
  const bg = uni.getBackgroundAudioManager();
  const h = wxBgLastHandlers;
  if (!h) return;
  try {
    const anyBg = bg as {
      offPlay?: (fn: () => void) => void;
      offEnded?: (fn: () => void) => void;
      offError?: (fn: (e: unknown) => void) => void;
      offCanplay?: (fn: () => void) => void;
      offSeeked?: (fn: () => void) => void;
      offPause?: (fn: () => void) => void;
      offWaiting?: (fn: () => void) => void;
    };
    if (h.onPlay && typeof anyBg.offPlay === "function") anyBg.offPlay(h.onPlay);
    if (h.onEnded && typeof anyBg.offEnded === "function") anyBg.offEnded(h.onEnded);
    if (h.onError && typeof anyBg.offError === "function") anyBg.offError(h.onError);
    if (h.onCanplay && typeof anyBg.offCanplay === "function") anyBg.offCanplay(h.onCanplay);
    if (h.onSeeked && typeof anyBg.offSeeked === "function") anyBg.offSeeked(h.onSeeked);
    if (h.onPause && typeof anyBg.offPause === "function") anyBg.offPause(h.onPause);
    if (h.onWaiting && typeof anyBg.offWaiting === "function") anyBg.offWaiting(h.onWaiting);
  } catch {
    /* noop */
  }
  wxBgLastHandlers = null;
}

let wxRecoverLock = false;

function recoverWxSilenceLoop(token: number) {
  if (!isMeditationSilenceActive() || token !== bgOpToken || wxRecoverLock) return;
  wxRecoverLock = true;
  try {
    const bg = uni.getBackgroundAudioManager();
    setAudioVolumeSafe(bg, BG_MUTE);
    try {
      const anyBg = bg as { seek?: (pos: number) => void; play?: () => void };
      if (typeof anyBg.seek === "function") {
        anyBg.seek(0);
        scheduleBgForceMute(token);
        anyBg.play?.();
        return;
      }
    } catch {
      /* 走硬恢复 */
    }
    try {
      bg.stop();
    } catch {
      /* noop */
    }
    try {
      bg.src = MEDITATION_SILENCE_SRC;
      setAudioVolumeSafe(bg, BG_MUTE);
      scheduleBgForceMute(token);
      bg.play();
    } catch (e) {
      console.error("recoverWxSilenceLoop", e);
    }
  } finally {
    wxRecoverLock = false;
  }
}

function wireWxBackgroundSilence(meta: {
  title?: string;
  epname?: string;
  singer?: string;
  coverImgUrl?: string;
  token: number;
}) {
  hardStopWxBackgroundAudio();
  detachWxBackgroundHandlers();
  const bg = uni.getBackgroundAudioManager();
  const token = meta.token;
  let playStarted = false;

  const tryStartSilencePlay = () => {
    if (playStarted || !isMeditationSilenceActive() || token !== bgOpToken) return;
    playStarted = true;
    try {
      bg.play();
    } catch {
      /* noop */
    }
  };

  const onPlay = () => {
    if (!isMeditationSilenceActive() || token !== bgOpToken) return;
  };
  const onCanplay = () => {
    if (!isMeditationSilenceActive() || token !== bgOpToken) return;
    tryStartSilencePlay();
  };
  const onSeeked = () => {
    if (!isMeditationSilenceActive() || token !== bgOpToken) return;
  };
  const onEnded = () => {
    if (!isMeditationSilenceActive() || token !== bgOpToken) return;
    recoverWxSilenceLoop(token);
  };
  const onError = (err: unknown) => {
    console.error("禅修后台静音", err);
    if (!isMeditationSilenceActive() || token !== bgOpToken) return;
    playStarted = false;
    recoverWxSilenceLoop(token);
  };
  const onPause = () => {
    if (!isMeditationSilenceActive() || token !== bgOpToken) return;
    try {
      bg.play();
    } catch {
      /* noop */
    }
  };
  const onWaiting = () => {
    /* noop */
  };

  bg.onPlay(onPlay);
  bg.onEnded(onEnded);
  bg.onError(onError);
  const anyBg = bg as {
    onCanplay?: (fn: () => void) => void;
    onSeeked?: (fn: () => void) => void;
    onPause?: (fn: () => void) => void;
    onWaiting?: (fn: () => void) => void;
  };
  if (typeof anyBg.onCanplay === "function") anyBg.onCanplay(onCanplay);
  if (typeof anyBg.onSeeked === "function") anyBg.onSeeked(onSeeked);
  if (typeof anyBg.onPause === "function") anyBg.onPause(onPause);
  if (typeof anyBg.onWaiting === "function") anyBg.onWaiting(onWaiting);

  wxBgLastHandlers = {
    onPlay,
    onEnded,
    onError,
    onCanplay,
    onSeeked,
    onPause,
    onWaiting,
  };

  bg.title = meta.title ?? "禅修静音保活";
  bg.epname = meta.epname ?? "禅修";
  bg.singer = meta.singer ?? "静心";
  bg.coverImgUrl = meta.coverImgUrl ?? "/static/logo.png";
  bg.src = MEDITATION_SILENCE_SRC;
  setTimeout(() => tryStartSilencePlay(), WX_SILENCE_PLAY_FALLBACK_MS);
}
// #endif

// #ifndef MP-WEIXIN
function destroySilenceInner() {
  const ctx = silenceInner;
  silenceInner = null;
  silenceInnerEnded = null;
  silenceInnerError = null;
  if (!ctx) return;
  try {
    ctx.stop();
  } catch {
    /* noop */
  }
  try {
    ctx.destroy();
  } catch {
    /* noop */
  }
}

function wireSilenceInnerLoop(token: number) {
  destroySilenceInner();
  const ctx = uni.createInnerAudioContext();
  silenceInner = ctx;
  ctx.obeyMuteSwitch = false;
  ctx.loop = true;
  ctx.volume = BG_MUTE;
  let playStarted = false;
  const arm = () => {
    if (!isMeditationSilenceActive() || token !== bgOpToken) return;
    setAudioVolumeSafe(ctx, BG_MUTE);
    scheduleBgForceMute(token);
  };
  const tryPlay = () => {
    if (playStarted || !isMeditationSilenceActive() || token !== bgOpToken) return;
    playStarted = true;
    arm();
    try {
      ctx.play();
    } catch {
      /* noop */
    }
  };
  silenceInnerEnded = () => {
    if (!isMeditationSilenceActive() || token !== bgOpToken) return;
    playStarted = false;
    try {
      ctx.seek(0);
      tryPlay();
    } catch {
      /* noop */
    }
    arm();
  };
  silenceInnerError = (err: unknown) => {
    console.error("禅修静音 InnerAudio", err);
    if (!isMeditationSilenceActive() || token !== bgOpToken) return;
    playStarted = false;
    try {
      ctx.src = MEDITATION_SILENCE_SRC;
      arm();
      tryPlay();
    } catch {
      /* noop */
    }
  };
  ctx.onEnded(silenceInnerEnded);
  ctx.onError(silenceInnerError);
  if (typeof (ctx as { onPlay?: (fn: () => void) => void }).onPlay === "function") {
    (ctx as { onPlay: (fn: () => void) => void }).onPlay(arm);
  }
  if (typeof (ctx as { onCanplay?: (fn: () => void) => void }).onCanplay === "function") {
    (ctx as { onCanplay: (fn: () => void) => void }).onCanplay(() => {
      arm();
      tryPlay();
    });
  }
  if (typeof (ctx as { onSeeked?: (fn: () => void) => void }).onSeeked === "function") {
    (ctx as { onSeeked: (fn: () => void) => void }).onSeeked(arm);
  }
  ctx.src = MEDITATION_SILENCE_SRC;
  arm();
  setTimeout(() => tryPlay(), WX_SILENCE_PLAY_FALLBACK_MS);
}
// #endif

export type MeditationBackgroundMeta = {
  title?: string;
  epname?: string;
  singer?: string;
  coverImgUrl?: string;
};

/**
 * 启动后台静音保活（会先完整清理上一会话）。
 */
export function startMeditationBackground(meta?: MeditationBackgroundMeta): void {
  // #ifdef MP-WEIXIN
  hardStopWxBackgroundAudio();
  // #endif
  stopMeditationBackground();
  meditationAudioPhase = "active";
  bgOpToken += 1;
  const token = bgOpToken;

  // #ifdef MP-WEIXIN
  wireWxBackgroundSilence({
    title: meta?.title,
    epname: meta?.epname,
    singer: meta?.singer,
    coverImgUrl: meta?.coverImgUrl,
    token,
  });
  startBgVolumeGuard(token);
  // #endif

  // #ifndef MP-WEIXIN
  wireSilenceInnerLoop(token);
  startBgVolumeGuard(token);
  // #endif
}

/**
 * 禅修正常结束：停静音保活并解除监听，**不**销毁正在渐强的结束音；可与跳转报告并行调用。
 */
export function prepareMeditationSessionEnd(): void {
  meditationAudioPhase = "ending";
  stopMeditationSilenceOnly();
}

/**
 * 停止静音与结束音乐，清除全部监听（异常退出、未跳转报告时）。
 */
export function stopMeditationBackground(): void {
  meditationAudioPhase = "idle";
  bgOpToken += 1;
  clearBgVolumeGuard();
  destroyEndMusicInner();

  // #ifdef MP-WEIXIN
  detachWxBackgroundHandlers();
  try {
    uni.getBackgroundAudioManager().stop();
  } catch {
    /* noop */
  }
  // #endif

  // #ifndef MP-WEIXIN
  destroySilenceInner();
  // #endif
}

/** @deprecated 与 `stopMeditationBackground` 相同 */
export const stopMeditationBackgroundMusic = stopMeditationBackground;

/**
 * 独立 InnerAudio 播放结束疗愈音（0→渐强），不阻塞；页面 `redirectTo` 后可继续播放。
 *
 * @param src 疗愈音完整 URL
 */
export function playMeditationEndMusicLinearFadeIn(src: string): Promise<void> {
  const url = (src || "").trim();
  if (!url) return Promise.resolve();

  return new Promise((resolve) => {
    destroyEndMusicInner();
    const ctx = uni.createInnerAudioContext();
    endMusicCtx = ctx;
    ctx.obeyMuteSwitch = false;
    ctx.volume = 0;
    ctx.src = url;

    let settled = false;
    let rampStarted = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      destroyEndMusicInner();
      resolve();
    };

    const onPlay = () => {
      if (rampStarted) return;
      rampStarted = true;
      setAudioVolumeSafe(ctx, 0);
      setTimeout(() => setAudioVolumeSafe(ctx, 0), BG_FORCE_MUTE_DELAY_MS);
      let step = 0;
      clearEndMusicFadeTimer();
      endMusicFadeTimer = setInterval(() => {
        step += 1;
        const t = Math.min(1, step / END_RAMP_STEPS);
        const k = t * t * (3 - 2 * t);
        const v = Math.min(END_VOL_MAX, END_VOL_MAX * k);
        setAudioVolumeSafe(ctx, v);
        if (step >= END_RAMP_STEPS) {
          clearEndMusicFadeTimer();
          setAudioVolumeSafe(ctx, END_VOL_MAX);
        }
      }, END_VOL_TICK_MS);
    };

    const onEnded = () => finish();
    const onError = (e: unknown) => {
      console.error("禅修结束音乐", e);
      finish();
    };

    ctx.onPlay(onPlay);
    ctx.onEnded(onEnded);
    ctx.onError(onError);
    endMusicHandlers = { onPlay, onEnded, onError };

    try {
      ctx.play();
    } catch (e) {
      console.error("playMeditationEndMusicLinearFadeIn", e);
      finish();
    }

    setTimeout(() => {
      if (!settled && endMusicCtx === ctx && !rampStarted) {
        onPlay();
      }
    }, 320);

    setTimeout(() => {
      if (!settled && endMusicCtx === ctx) {
        finish();
      }
    }, 600000);
  });
}

/** 兼容旧 API：仅用静音保活，不使用疗愈音 URL */
export function startMutedMeditationBackgroundMusic(params: {
  src: string;
  title: string;
  epname?: string;
  singer?: string;
  coverImgUrl?: string;
}): void {
  void params.src;
  startMeditationBackground({
    title: params.title,
    epname: params.epname,
    singer: params.singer,
    coverImgUrl: params.coverImgUrl,
  });
}

/** @deprecated */
export function fadeMeditationBackgroundMusicVolume(): Promise<void> {
  return Promise.resolve();
}

let leavingMeditationForReportPage = false;

export function setLeavingMeditationForReportPage(value: boolean): void {
  leavingMeditationForReportPage = value;
}

export function isLeavingMeditationForReportPage(): boolean {
  return leavingMeditationForReportPage;
}

export function updateMeditationBackgroundMusicMeta(meta: { title?: string; epname?: string }): void {
  if (meditationAudioPhase !== "active") return;
  // #ifdef MP-WEIXIN
  const bg = uni.getBackgroundAudioManager();
  if (meta.title != null) bg.title = meta.title;
  if (meta.epname != null) bg.epname = meta.epname;
  // #endif
}
