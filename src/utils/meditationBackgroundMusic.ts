/**
 * 微信小程序禅修音频策略（与业务音轨严格隔离）：
 *
 * - **后台常驻**：仅 `uni.getBackgroundAudioManager()` 单例，循环静音切片（`VITE_MEDITATION_SILENCE_URL` 或包内 `/static/silence.mp3`），`volume` 恒为 0；
 *   事件与定时器反复强制静音，应对单例被重置、误触通知栏等。
 * - **结束音乐**：仅 `uni.createInnerAudioContext()` 独立实例；0 起线性渐强，4s 内 0→0.8（每 50ms +0.01），播完销毁。
 *
 * 对外入口：`startMeditationBackground` / `stopMeditationBackground`（`stopMeditationBackgroundMusic` 为别名）。
 */

const envSilenceSrc = (import.meta.env.VITE_MEDITATION_SILENCE_URL || "").trim();

/**
 * 静音切片地址：配置了 `VITE_MEDITATION_SILENCE_URL` 时走网络（真机须 HTTPS + 合法域名）；否则用包内静态文件。
 */
export const MEDITATION_SILENCE_SRC =
  envSilenceSrc.length > 0 ? envSilenceSrc : "/static/silence.mp3";

const BG_MUTE = 0;
const END_VOL_STEP = 0.01;
const END_VOL_TICK_MS = 50;
const END_VOL_MAX = 0.8;
const END_RAMP_STEPS = 80;
const BG_FORCE_MUTE_DELAY_MS = 100;
const BG_VOLUME_GUARD_MS = 1000;

let bgOpToken = 0;

let bgVolumeGuardTimer: ReturnType<typeof setInterval> | null = null;

/** 小程序：后台静音循环句柄引用（与 `uni.getBackgroundAudioManager()` 为同一单例，仅用于 off） */
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

/** 非微信：用 InnerAudio 模拟静音保活 */
let silenceInner: UniApp.InnerAudioContext | null = null;
let silenceInnerEnded: (() => void) | null = null;
let silenceInnerError: ((e: unknown) => void) | null = null;

/** 结束音乐（业务） */
let endMusicCtx: UniApp.InnerAudioContext | null = null;
let endMusicFadeTimer: ReturnType<typeof setInterval> | null = null;
let endMusicHandlers: {
  onPlay: () => void;
  onEnded: () => void;
  onError: (e: unknown) => void;
} | null = null;

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
    if (token !== bgOpToken) return;
    // #ifdef MP-WEIXIN
    setAudioVolumeSafe(uni.getBackgroundAudioManager(), BG_MUTE);
    // #endif
    // #ifndef MP-WEIXIN
    if (silenceInner) setAudioVolumeSafe(silenceInner, BG_MUTE);
    // #endif
  }, BG_FORCE_MUTE_DELAY_MS);
}

function startBgVolumeGuard(token: number) {
  clearBgVolumeGuard();
  bgVolumeGuardTimer = setInterval(() => {
    if (token !== bgOpToken) return;
    // #ifdef MP-WEIXIN
    setAudioVolumeSafe(uni.getBackgroundAudioManager(), BG_MUTE);
    scheduleBgForceMute(token);
    // #endif
    // #ifndef MP-WEIXIN
    if (silenceInner) {
      setAudioVolumeSafe(silenceInner, BG_MUTE);
      scheduleBgForceMute(token);
    }
    // #endif
  }, BG_VOLUME_GUARD_MS);
}

// #ifdef MP-WEIXIN
function detachWxBackgroundHandlers() {
  const bg = uni.getBackgroundAudioManager();
  const h = wxBgLastHandlers;
  if (!h) return;
  try {
    const anyBg = bg as any;
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
  if (token !== bgOpToken || wxRecoverLock) return;
  wxRecoverLock = true;
  try {
    const bg = uni.getBackgroundAudioManager();
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
  detachWxBackgroundHandlers();
  const bg = uni.getBackgroundAudioManager();
  const token = meta.token;

  const armMute = () => {
    setAudioVolumeSafe(bg, BG_MUTE);
    scheduleBgForceMute(token);
  };

  const onPlay = () => armMute();
  const onCanplay =
    typeof (bg as any).onCanplay === "function"
      ? () => {
          if (token !== bgOpToken) return;
          armMute();
        }
      : undefined;
  const onSeeked =
    typeof (bg as any).onSeeked === "function"
      ? () => {
          if (token !== bgOpToken) return;
          armMute();
        }
      : undefined;
  const onEnded = () => {
    if (token !== bgOpToken) return;
    recoverWxSilenceLoop(token);
  };
  const onError = (err: unknown) => {
    console.error("禅修后台静音", err);
    if (token !== bgOpToken) return;
    recoverWxSilenceLoop(token);
  };
  const onPause = () => {
    if (token !== bgOpToken) return;
    try {
      setAudioVolumeSafe(bg, BG_MUTE);
      bg.play();
    } catch {
      /* noop */
    }
  };
  const onWaiting = () => {
    if (token !== bgOpToken) return;
    armMute();
  };

  bg.onPlay(onPlay);
  bg.onEnded(onEnded);
  bg.onError(onError);
  if (typeof (bg as any).onCanplay === "function" && onCanplay) (bg as any).onCanplay(onCanplay);
  if (typeof (bg as any).onSeeked === "function" && onSeeked) (bg as any).onSeeked(onSeeked);
  if (typeof (bg as any).onPause === "function") (bg as any).onPause(onPause);
  if (typeof (bg as any).onWaiting === "function") (bg as any).onWaiting(onWaiting);

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
  armMute();
  try {
    bg.play();
  } catch {
    /* noop */
  }
  armMute();
  setTimeout(armMute, 120);
  setTimeout(armMute, 400);
  setTimeout(armMute, 1200);
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
  ctx.src = MEDITATION_SILENCE_SRC;
  const arm = () => {
    if (token !== bgOpToken) return;
    setAudioVolumeSafe(ctx, BG_MUTE);
    scheduleBgForceMute(token);
  };
  arm();
  silenceInnerEnded = () => {
    if (token !== bgOpToken) return;
    try {
      ctx.seek(0);
      ctx.play();
    } catch {
      /* noop */
    }
    arm();
  };
  silenceInnerError = (err: unknown) => {
    console.error("禅修静音 InnerAudio", err);
    if (token !== bgOpToken) return;
    try {
      ctx.src = MEDITATION_SILENCE_SRC;
      arm();
      ctx.play();
    } catch {
      /* noop */
    }
  };
  ctx.onEnded(silenceInnerEnded);
  ctx.onError(silenceInnerError);
  if (typeof (ctx as any).onPlay === "function") {
    (ctx as any).onPlay(arm);
  }
  if (typeof (ctx as any).onCanplay === "function") {
    (ctx as any).onCanplay(arm);
  }
  if (typeof (ctx as any).onSeeked === "function") {
    (ctx as any).onSeeked(arm);
  }
  setTimeout(arm, 120);
  setTimeout(arm, 400);
  ctx.play();
}
// #endif

export type MeditationBackgroundMeta = {
  title?: string;
  epname?: string;
  singer?: string;
  coverImgUrl?: string;
};

/**
 * 启动后台静音保活（微信小程序：`BackgroundAudioManager` + `MEDITATION_SILENCE_SRC` + volume=0）。
 * 会先 `stopMeditationBackground` 清理上一会话，避免单例状态污染。
 */
export function startMeditationBackground(meta?: MeditationBackgroundMeta): void {
  stopMeditationBackground();
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
 * 停止后台静音与结束音乐实例，清除定时器与监听（防泄漏）。
 */
export function stopMeditationBackground(): void {
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

/** @deprecated 与 `stopMeditationBackground` 相同，兼容旧引用 */
export const stopMeditationBackgroundMusic = stopMeditationBackground;

/**
 * 使用独立 `InnerAudioContext` 播放结束曲目：初始 0 音量，每 50ms 线性 +0.01，4s 达 0.8，自然结束后销毁。
 *
 * @param src 疗愈音等完整可播 URL
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
        const v = Math.min(END_VOL_MAX, step * END_VOL_STEP);
        setAudioVolumeSafe(ctx, v);
        if (step >= END_RAMP_STEPS) {
          clearEndMusicFadeTimer();
          setAudioVolumeSafe(ctx, END_VOL_MAX);
        }
      }, END_VOL_TICK_MS);
    };

    const onEnded = () => {
      finish();
    };

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

/** 兼容旧 API：不再用疗愈音做后台，等同 `startMeditationBackground` */
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

/** 已废弃：结束音乐改走 `playMeditationEndMusicLinearFadeIn` */
export function fadeMeditationBackgroundMusicVolume(): Promise<void> {
  return Promise.resolve();
}

/** 正常结束并 `redirectTo` 报告页时为 true，避免禅修页 `onUnload` 误停跨页的结束音乐 */
let leavingMeditationForReportPage = false;

export function setLeavingMeditationForReportPage(value: boolean): void {
  leavingMeditationForReportPage = value;
}

export function isLeavingMeditationForReportPage(): boolean {
  return leavingMeditationForReportPage;
}

export function updateMeditationBackgroundMusicMeta(meta: { title?: string; epname?: string }): void {
  // #ifdef MP-WEIXIN
  const bg = uni.getBackgroundAudioManager();
  if (meta.title != null) bg.title = meta.title;
  if (meta.epname != null) bg.epname = meta.epname;
  // #endif
}
