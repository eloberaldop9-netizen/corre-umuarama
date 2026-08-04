// Deterministic animation engine for frame-perfect video capture.
// Every motion is authored as ONE Web Animations API animation per
// (element, CSS property) pair — using absolute-time keyframes converted
// to offsets — so nothing fights over the effect stack. Animations are
// paused immediately after creation and scrubbed by writing `.currentTime`
// from window.seek(tMs), which lets a headless renderer step through exact
// timestamps regardless of real wall-clock / rendering performance.

const EASE_OUT      = 'cubic-bezier(.22,.61,.36,1)';
const EASE_OUT_SOFT = 'cubic-bezier(.33,.8,.4,1)';
const EASE_IN       = 'cubic-bezier(.5,0,.75,0)';
const EASE_INOUT    = 'cubic-bezier(.45,0,.15,1)';

const ANIMATIONS = [];

function $(id) { return document.getElementById(id); }

function A(el, keyframes, opts) {
  const anim = el.animate(keyframes, Object.assign({
    fill: 'both',
    easing: EASE_OUT,
    duration: 300,
  }, opts));
  anim.pause();
  ANIMATIONS.push(anim);
  return anim;
}

// Absolute-time keyframe helper: pass [{t: ms, ...cssProps}, ...] and it
// converts to a single animate() call with proper offsets — the only safe
// way to give one element/property multiple phases (in, hold, out)
// without later calls silently overriding earlier ones in the effect stack.
//
// IMPORTANT: the easing is set PER KEYFRAME (paces that keyframe's segment
// to the next one), never at the effect/options level. An effect-level
// easing is resolved ONCE across the whole 0→1 timeline before keyframes
// are located — with an ease-out curve like ours that reaches ~1.0 by 35%
// of the duration, everything after that point samples as "progress ≈ 1",
// which silently swallows hold segments and any keyframes placed after
// them (a word set to hold, then fade, would instead start fading almost
// immediately). Per-keyframe easing paces each segment independently, so a
// hold segment (same value in and out) actually holds.
function T(el, keys, easing) {
  const start = keys[0].t;
  const end = keys[keys.length - 1].t;
  const duration = Math.max(end - start, 1);
  const ease = easing || EASE_OUT;
  const frames = keys.map((k, i) => {
    const { t, ...props } = k;
    const frame = Object.assign({ offset: (t - start) / duration }, props);
    if (i < keys.length - 1) frame.easing = ease;
    return frame;
  });
  return A(el, frames, { delay: start, duration, easing: 'linear' });
}

function tf(y, s) {
  return `translate(-50%,-50%) translateY(${y}px) scale(${s})`;
}

function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  const spans = [];
  for (const ch of text) {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? ' ' : ch;
    span.style.display = 'inline-block';
    spans.push(span);
    el.appendChild(span);
  }
  return spans;
}

// Fast letter-by-letter cascade, rising up — the signature reveal for
// impact words: punchier and more alive than fading the whole word in.
function letterCascade(spans, startT, opts) {
  const stagger = (opts && opts.stagger) || 30;
  const dur = (opts && opts.duration) || 260;
  const easing = (opts && opts.easing) || EASE_OUT;
  const y = (opts && opts.y) || 20;
  const scale = (opts && opts.scale) || .82;
  spans.forEach((span, i) => {
    const t0 = startT + i * stagger;
    T(span, [
      { t: t0,       opacity: 0, transform: `translateY(${y}px) scale(${scale})` },
      { t: t0 + dur, opacity: 1, transform: 'translateY(0px) scale(1)' },
    ], easing);
  });
  return startT + (spans.length - 1) * stagger + dur;
}

// Letter cascade coming in from the right with a small controlled
// overshoot past center before settling — used once, for the take's
// biggest reversal beat ("CONTRÁRIO" arriving against the grain).
function letterCascadeX(spans, startT, opts) {
  const stagger = (opts && opts.stagger) || 30;
  const dur = (opts && opts.duration) || 320;
  const easing = (opts && opts.easing) || EASE_OUT_SOFT;
  const fromX = (opts && opts.fromX) || 70;
  const overshootX = (opts && opts.overshootX) || -10;
  spans.forEach((span, i) => {
    const t0 = startT + i * stagger;
    const t1 = t0 + dur * 0.62;
    const t2 = t0 + dur;
    T(span, [
      { t: t0, opacity: 0, transform: `translateX(${fromX}px) scale(.85)` },
      { t: t1, opacity: 1, transform: `translateX(${overshootX}px) scale(1.02)` },
      { t: t2, opacity: 1, transform: 'translateX(0px) scale(1)' },
    ], easing);
  });
  return startT + (spans.length - 1) * stagger + dur;
}

function build() {
  const stage = $('stage');

  // ---- global scene fade-in + dolly-in (builds through "totalmente",
  // micro-impact bump right as "contrário" lands, then settles) ----
  A(stage, [{ opacity: 0 }, { opacity: 1 }], { delay: 0, duration: 260, easing: EASE_OUT });
  T(stage, [
    { t: 0,    transform: 'scale(1)' },
    { t: 2600, transform: 'scale(1.015)' },
    { t: 3800, transform: 'scale(1.04)' },
    { t: 4000, transform: 'scale(1.058)' },
    { t: 4500, transform: 'scale(1.05)' },
    { t: 6000, transform: 'scale(1.05)' },
  ], EASE_INOUT);
  A($('sidelight'), [{ opacity: 0 }, { opacity: .8 }], { delay: 300, duration: 900, easing: EASE_OUT_SOFT });

  // ---- Scene A: "NA VERDADE" (0 - 800ms) ----
  T($('sweep-line'), [
    { t: 90,  opacity: 0, transform: 'translate(-50%,-50%) scaleX(0)' },
    { t: 430, opacity: 1, transform: 'translate(-50%,-50%) scaleX(1)' },
    { t: 650, opacity: 1, transform: 'translate(-50%,-50%) scaleX(1)' },
    { t: 790, opacity: 0, transform: 'translate(-50%,-50%) scaleX(1)' },
  ]);

  T($('t-na'), [
    { t: 150, opacity: 0, transform: tf(0, 1) },
    { t: 350, opacity: 1, transform: tf(0, 1) },
    { t: 650, opacity: 1, transform: tf(0, 1) },
    { t: 800, opacity: 0, transform: tf(-8, 1) },
  ]);

  letterCascade(splitChars($('t-verdade')), 250, { stagger: 34, duration: 260, y: 22, scale: .82 });
  T($('t-verdade'), [
    { t: 250, opacity: 1, transform: tf(0, .96) },
    { t: 540, opacity: 1, transform: tf(0, 1) },
    { t: 650, opacity: 1, transform: tf(0, 1) },
    { t: 800, opacity: 0, transform: tf(-10, 1.05) },
  ]);

  // ---- Scene B: "A HARMONIZAÇÃO MASCULINA" (800 - 2600ms) ----
  // brand icon settles in as a faint background layer — kept subtle the
  // whole time (never full black) so it never fights the bold "MASCULINA"
  // letters it sits behind.
  T($('face'), [
    { t: 850,  opacity: 0,   transform: 'translate(-50%,-50%) scale(.90)' },
    { t: 1300, opacity: .22, transform: 'translate(-50%,-50%) scale(.96)' },
    { t: 2550, opacity: .22, transform: 'translate(-50%,-50%) scale(.96)' },
    { t: 2900, opacity: .14, transform: 'translate(-50%,-50%) scale(.97)' },
    { t: 5450, opacity: .14, transform: 'translate(-50%,-50%) scale(.97)' },
    { t: 5750, opacity: 0,   transform: 'translate(-50%,-50%) scale(.98)' },
  ], EASE_OUT_SOFT);

  T($('t-a-harm'), [
    { t: 850,  opacity: 0, transform: 'translate(-50%,-50%) translateX(-46px)', filter: 'blur(6px)' },
    { t: 1150, opacity: 1, transform: 'translate(-50%,-50%) translateX(0px)',   filter: 'blur(0px)' },
    { t: 2420, opacity: 1, transform: 'translate(-50%,-50%) translateX(0px)',   filter: 'blur(0px)' },
    { t: 2560, opacity: 0, transform: 'translate(-50%,-50%) translateX(0px) translateY(-8px)', filter: 'blur(0px)' },
  ]);

  letterCascade(splitChars($('t-masculina')), 1700, { stagger: 40, duration: 340, y: 30, scale: .8 });
  T($('t-masculina'), [
    { t: 1700, opacity: 1, transform: tf(0, 1) },
    { t: 2420, opacity: 1, transform: tf(0, 1) },
    { t: 2560, opacity: 0, transform: tf(-8, .96) },
  ]);

  // ---- Scene C: "É TOTALMENTE" (2600 - 3800ms) ----
  T($('t-e'), [
    { t: 2620, opacity: 0, transform: tf(0, 1) },
    { t: 2800, opacity: 1, transform: tf(0, 1) },
    { t: 3650, opacity: 1, transform: tf(0, 1) },
    { t: 3790, opacity: 0, transform: tf(-8, 1) },
  ]);

  letterCascade(splitChars($('t-totalmente')), 2650, { stagger: 30, duration: 260, y: 20, scale: .84 });
  T($('t-totalmente'), [
    { t: 2650, opacity: 1, transform: 'translate(-50%,-50%) scaleX(.98)' },
    { t: 3220, opacity: 1, transform: 'translate(-50%,-50%) scaleX(1)' },
    { t: 3650, opacity: 1, transform: 'translate(-50%,-50%) scaleX(1)' },
    { t: 3790, opacity: 0, transform: 'translate(-50%,-50%) scaleX(1) translateY(-8px)' },
  ]);

  A($('seg-a'), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { delay: 2700, duration: 950, easing: EASE_OUT_SOFT });
  T($('rdot1'), [
    { t: 2900, opacity: 0 },
    { t: 3080, opacity: 1 },
    { t: 3700, opacity: 1 },
    { t: 3830, opacity: 0 },
  ]);

  // ---- Scene D: "AO CONTRÁRIO" (3800 - 5400ms) ----
  // the champagne line reverses direction — segment B curves back the
  // opposite way exactly as "CONTRÁRIO" locks into place.
  A($('seg-b'), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { delay: 3850, duration: 500, easing: EASE_OUT_SOFT });
  T($('rdot2'), [
    { t: 4080, opacity: 0 },
    { t: 4260, opacity: 1 },
    { t: 5250, opacity: 1 },
    { t: 5390, opacity: 0 },
  ]);
  T($('seg-a'), [{ t: 5250, opacity: 1 }, { t: 5390, opacity: 0 }]);
  T($('seg-b'), [{ t: 5250, opacity: 1 }, { t: 5390, opacity: 0 }]);

  T($('t-ao'), [
    { t: 3820, opacity: 0, transform: tf(0, 1) },
    { t: 4000, opacity: 1, transform: tf(0, 1) },
    { t: 5250, opacity: 1, transform: tf(0, 1) },
    { t: 5390, opacity: 0, transform: tf(-8, 1) },
  ]);

  letterCascadeX(splitChars($('t-contrario')), 3900, { stagger: 34, duration: 340, fromX: 80, overshootX: -12 });
  T($('t-contrario'), [
    { t: 3900, opacity: 1, transform: tf(0, .97) },
    { t: 4450, opacity: 1, transform: tf(0, 1) },
    { t: 5250, opacity: 1, transform: tf(0, 1) },
    { t: 5390, opacity: 0, transform: tf(-8, .96) },
  ]);

  T($('underline'), [
    { t: 4350, opacity: 0, transform: 'translate(-50%,-50%) scaleX(0)' },
    { t: 4680, opacity: 1, transform: 'translate(-50%,-50%) scaleX(1)' },
    { t: 5250, opacity: 1, transform: 'translate(-50%,-50%) scaleX(1)' },
    { t: 5390, opacity: 0, transform: 'translate(-50%,-50%) scaleX(1)' },
  ]);
  A($('underline'), [{ filter: 'brightness(1)' }, { filter: 'brightness(1.6)' }, { filter: 'brightness(1)' }],
    { delay: 4700, duration: 380, easing: EASE_OUT_SOFT });

  // ---- Scene E: recap + logo (5400 - 6000ms) ----
  A($('recap'), [
    { opacity: 0, transform: 'translate(-50%,-50%) translateY(18px) scale(.97)' },
    { opacity: 1, transform: 'translate(-50%,-50%) translateY(0px) scale(1)' },
  ], { delay: 5430, duration: 340, easing: EASE_OUT });

  A($('recap-rule'), [
    { opacity: 0, transform: 'translate(-50%,-50%) scaleX(0)' },
    { opacity: .9, transform: 'translate(-50%,-50%) scaleX(1)' },
  ], { delay: 5650, duration: 280, easing: EASE_OUT });
  A($('recap-rule'), [{ filter: 'brightness(1)' }, { filter: 'brightness(1.5)' }, { filter: 'brightness(1)' }],
    { delay: 5800, duration: 300, easing: EASE_OUT_SOFT });

  A($('logo'), [
    { opacity: 0, transform: 'translate(-50%,-50%) translateY(12px)' },
    { opacity: .92, transform: 'translate(-50%,-50%) translateY(0px)' },
  ], { delay: 5580, duration: 300, easing: EASE_OUT });
}

function seek(tMs) {
  for (const a of ANIMATIONS) a.currentTime = tMs;
}

build();
window.seek = seek;
window.__ready = true;
seek(0);
