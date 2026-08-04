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

// Simple keyframe helper: opts.easing applies to the whole animation unless
// individual keyframes specify their own `easing`.
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
// converts to a single animate() call with proper offsets — this is the
// only safe way to give one element/property multiple phases (in, hold,
// out) without later calls silently overriding earlier ones.
//
// IMPORTANT: easing is set PER KEYFRAME (paces that keyframe's segment to
// the next one), never at the effect/options level. An effect-level easing
// is resolved ONCE across the whole 0→1 timeline before keyframes are
// located — with an ease-out curve like ours that reaches ~1.0 by 35% of
// the duration, everything after that samples as "progress ≈ 1", which
// silently swallows hold segments (a word set to hold, then fade, instead
// starts fading almost immediately). Per-keyframe easing paces each
// segment independently, so a hold segment (same value in and out)
// actually holds.
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

// Splits an element's text into one <span> per character (spaces become
// NBSP so they keep their width) so each letter can be animated on its own.
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

// Fast letter-by-letter cascade: each character pops in with a short
// stagger — the signature "kinetic typography" reveal, punchier and more
// alive than fading the whole word in as one block.
function letterCascade(spans, startT, opts) {
  const stagger = (opts && opts.stagger) || 30;
  const dur = (opts && opts.duration) || 260;
  const easing = (opts && opts.easing) || EASE_OUT;
  const y = (opts && opts.y) || 20;
  const scale = (opts && opts.scale) || .82;
  spans.forEach((span, i) => {
    const t0 = startT + i * stagger;
    T(span, [
      { t: t0,         opacity: 0, transform: `translateY(${y}px) scale(${scale})` },
      { t: t0 + dur,   opacity: 1, transform: 'translateY(0px) scale(1)' },
    ], easing);
  });
  return startT + (spans.length - 1) * stagger + dur;
}

function build() {
  const stage = $('stage');

  // ---- global scene fade-in + push-in ----
  A(stage, [{ opacity: 0 }, { opacity: 1 }], { delay: 0, duration: 260, easing: EASE_OUT });
  A(stage, [{ transform: 'scale(1)' }, { transform: 'scale(1.045)' }], { delay: 0, duration: 5000, easing: EASE_INOUT });
  A($('sidelight'), [{ opacity: 0 }, { opacity: .8 }], { delay: 300, duration: 900, easing: EASE_OUT_SOFT });

  // ---- Scene A: "MAS," (150 - 720ms) ----
  T($('sweep-line'), [
    { t: 90,  opacity: 0, transform: 'translate(-50%,-50%) scaleX(0)' },
    { t: 430, opacity: 1, transform: 'translate(-50%,-50%) scaleX(1)' },
    { t: 560, opacity: 1, transform: 'translate(-50%,-50%) scaleX(1)' },
    { t: 720, opacity: 0, transform: 'translate(-50%,-50%) scaleX(1)' },
  ]);

  letterCascade(splitChars($('t-mas')), 150, { stagger: 40, duration: 220, y: 22, scale: .8 });
  T($('t-mas'), [
    { t: 150, opacity: 1, transform: tf(0, 1) },
    { t: 560, opacity: 1, transform: tf(0, 1) },
    { t: 720, opacity: 0, transform: tf(-14, 1.06) },
  ]);

  // ---- Scene B: "CUIDAR DA / AUTOESTIMA" (700 - 1710ms) ----
  // brand icon settles in with a soft fade + gentle scale, then dims to a
  // faint persistent watermark behind the rest of the scene.
  T($('face-contour'), [
    { t: 700,  opacity: 0,   transform: 'translate(-50%,-50%) scale(.94)' },
    { t: 1250, opacity: 1,   transform: 'translate(-50%,-50%) scale(.96)' },
    { t: 1750, opacity: .14, transform: 'translate(-50%,-50%) scale(.96)' },
    { t: 4250, opacity: .14, transform: 'translate(-50%,-50%) scale(.96)' },
    { t: 4600, opacity: 0,   transform: 'translate(-50%,-50%) scale(.97)' },
  ], EASE_OUT_SOFT);

  T($('t-cuidar1'), [
    { t: 730,  opacity: 0, transform: tf(20, 1) },
    { t: 990,  opacity: 1, transform: tf(0, 1) },
    { t: 1560, opacity: 1, transform: tf(0, 1) },
    { t: 1710, opacity: 0, transform: tf(-8, .96) },
  ]);

  letterCascade(splitChars($('t-autoestima')), 900, { stagger: 34, duration: 300, y: 24, scale: .8 });
  T($('t-autoestima'), [
    { t: 900,  opacity: 1, transform: tf(0, 1), letterSpacing: '2px' },
    { t: 1300, opacity: 1, transform: tf(0, 1), letterSpacing: '6px' },
    { t: 1580, opacity: 1, transform: tf(0, 1), letterSpacing: '6px' },
    { t: 1730, opacity: 0, transform: tf(-8, .96), letterSpacing: '6px' },
  ]);

  // ---- Scene C: "TAMBÉM É" (1700 - 2630ms) ----
  A($('connector-path'), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { delay: 1700, duration: 350, easing: EASE_OUT_SOFT });
  A($('connector-path'), [{ opacity: 1 }, { opacity: 0 }], { delay: 2450, duration: 180, easing: EASE_IN });

  T($('connector-dot1'), [
    { t: 1880, opacity: 0 },
    { t: 2030, opacity: 1 },
    { t: 2450, opacity: 1 },
    { t: 2630, opacity: 0 },
  ]);
  T($('connector-dot2'), [
    { t: 2050, opacity: 0 },
    { t: 2200, opacity: 1 },
    { t: 2450, opacity: 1 },
    { t: 2630, opacity: 0 },
  ]);

  letterCascade(splitChars($('t-tambem')), 1720, { stagger: 32, duration: 240, y: 18, scale: .82 });
  T($('t-tambem'), [
    { t: 1720, opacity: 1, transform: tf(0, 1) },
    { t: 2410, opacity: 1, transform: tf(0, 1) },
    { t: 2560, opacity: 0, transform: tf(-8, .96) },
  ]);

  // ---- Scene D: "CUIDAR DA / SAÚDE" (2580 - 4440ms) ----
  A($('glow'), [{ opacity: 0 }, { opacity: .18 }, { opacity: 0 }],
    { delay: 2850, duration: 900, easing: EASE_OUT_SOFT });

  T($('t-cuidar2'), [
    { t: 2580, opacity: 0, transform: tf(-20, 1) },
    { t: 2840, opacity: 1, transform: tf(0, 1) },
    { t: 4260, opacity: 1, transform: tf(0, 1) },
    { t: 4440, opacity: 0, transform: tf(-8, .96) },
  ]);

  letterCascade(splitChars($('t-saude')), 2780, { stagger: 42, duration: 320, y: 30, scale: .78 });
  T($('t-saude'), [
    { t: 2780, opacity: 1, transform: tf(0, 1) },
    { t: 4260, opacity: 1, transform: tf(0, 1) },
    { t: 4440, opacity: 0, transform: tf(-8, .96) },
  ]);

  T($('underline'), [
    { t: 3170, opacity: 0, transform: 'translate(-50%,-50%) scaleX(0)' },
    { t: 3510, opacity: 1, transform: 'translate(-50%,-50%) scaleX(1)' },
    { t: 4260, opacity: 1, transform: 'translate(-50%,-50%) scaleX(1)' },
    { t: 4440, opacity: 0, transform: 'translate(-50%,-50%) scaleX(1)' },
  ]);
  A($('underline'), [{ filter: 'brightness(1)' }, { filter: 'brightness(1.6)' }, { filter: 'brightness(1)' }],
    { delay: 3520, duration: 380, easing: EASE_OUT_SOFT });

  // ---- Scene E: recap + logo (4380 - 5000ms) ----
  A($('recap'), [
    { opacity: 0, transform: 'translate(-50%,-50%) translateY(18px) scale(.97)' },
    { opacity: 1, transform: 'translate(-50%,-50%) translateY(0px) scale(1)' },
  ], { delay: 4380, duration: 340, easing: EASE_OUT });

  A($('recap-rule'), [
    { opacity: 0, transform: 'translate(-50%,-50%) scaleX(0)' },
    { opacity: .9, transform: 'translate(-50%,-50%) scaleX(1)' },
  ], { delay: 4620, duration: 300, easing: EASE_OUT });
  A($('recap-rule'), [{ filter: 'brightness(1)' }, { filter: 'brightness(1.5)' }, { filter: 'brightness(1)' }],
    { delay: 4780, duration: 320, easing: EASE_OUT_SOFT });

  A($('logo'), [
    { opacity: 0, transform: 'translate(-50%,-50%) translateY(12px)' },
    { opacity: .92, transform: 'translate(-50%,-50%) translateY(0px)' },
  ], { delay: 4520, duration: 320, easing: EASE_OUT });
}

function seek(tMs) {
  for (const a of ANIMATIONS) a.currentTime = tMs;
}

build();
window.seek = seek;
window.__ready = true;
seek(0);
