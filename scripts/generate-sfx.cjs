const fs = require('fs');
const path = require('path');

const SR = 44100;
const OUT_DIR = path.resolve(__dirname, '../public/sfx');
fs.mkdirSync(OUT_DIR, {recursive: true});

function writeWav(filename, samples) {
  const numSamples = samples.length;
  const buffer = Buffer.alloc(44 + numSamples * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SR, 24);
  buffer.writeUInt32LE(SR * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  fs.writeFileSync(filename, buffer);
}

const N = (seconds) => Math.round(seconds * SR);
const zeros = (seconds) => new Float32Array(N(seconds));

function mix(...tracks) {
  const len = Math.max(...tracks.map((t) => t.length));
  const out = new Float32Array(len);
  for (const t of tracks) {
    for (let i = 0; i < t.length; i++) out[i] += t[i];
  }
  return out;
}

function expEnv(len, attackSamples, tau) {
  const env = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    if (i < attackSamples) {
      env[i] = i / attackSamples;
    } else {
      env[i] = Math.exp(-(i - attackSamples) / tau);
    }
  }
  return env;
}

function sineWave(freqFn, len) {
  const out = new Float32Array(len);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const f = freqFn(i / len);
    phase += (2 * Math.PI * f) / SR;
    out[i] = Math.sin(phase);
  }
  return out;
}

function whiteNoise(len, seed) {
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s / 4294967296) * 2 - 1;
  };
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) out[i] = rand();
  return out;
}

// One-pole lowpass filter, cutoff can vary per-sample.
function lowpassVarying(input, cutoffFn) {
  const out = new Float32Array(input.length);
  let prev = 0;
  for (let i = 0; i < input.length; i++) {
    const cutoff = cutoffFn(i / input.length);
    const rc = 1 / (2 * Math.PI * cutoff);
    const dt = 1 / SR;
    const alpha = dt / (rc + dt);
    prev = prev + alpha * (input[i] - prev);
    out[i] = prev;
  }
  return out;
}

function applyEnv(signal, env) {
  const out = new Float32Array(signal.length);
  for (let i = 0; i < signal.length; i++) out[i] = signal[i] * env[i % env.length];
  return out;
}

function gain(signal, g) {
  const out = new Float32Array(signal.length);
  for (let i = 0; i < signal.length; i++) out[i] = signal[i] * g;
  return out;
}

// ---------------------------------------------------------------------------
// 1. Impact hit — punchy low thud with a bit of noise crack (ALERTA slam)
function impactHit() {
  const dur = 0.4;
  const len = N(dur);
  const tone = sineWave((t) => 130 - t * 70, len);
  const env = expEnv(len, N(0.002), N(0.14));
  const body = applyEnv(tone, env);

  const noiseLen = N(0.03);
  const crack = applyEnv(whiteNoise(noiseLen, 7), expEnv(noiseLen, N(0.001), N(0.01)));

  return gain(mix(body, crack), 0.9);
}

// 2. Whoosh — filtered noise sweep, used for dives / wipes / pans
function whoosh(rising = true) {
  const dur = 0.55;
  const len = N(dur);
  const noise = whiteNoise(len, 42);
  const filtered = lowpassVarying(noise, (t) => (rising ? 400 + t * 4000 : 4200 - t * 3800));
  const env = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / len;
    env[i] = Math.sin(Math.PI * t) ** 1.3;
  }
  return gain(applyEnv(filtered, env), 1.1);
}

// 3. Click / tick — short high tick for the cursor click
function clickTick() {
  const dur = 0.07;
  const len = N(dur);
  const tone = sineWave(() => 1500, len);
  const env = expEnv(len, N(0.001), N(0.012));
  return gain(applyEnv(tone, env), 0.5);
}

// 4. Chime / ping — pleasant two-tone bell (Wi-Fi ok, success)
function chime(f1 = 880, f2 = 1108) {
  const dur = 0.9;
  const len = N(dur);
  const t1 = applyEnv(sineWave(() => f1, len), expEnv(len, N(0.006), N(0.35)));
  const t2 = applyEnv(sineWave(() => f2, len), expEnv(len, N(0.006), N(0.3)));
  return gain(mix(t1, gain(t2, 0.6)), 0.55);
}

// 5. Glitch crackle — stuttering gated noise
function glitchCrackle() {
  const dur = 0.5;
  const len = N(dur);
  const noise = whiteNoise(len, 99);
  const filtered = lowpassVarying(noise, () => 3000);
  let s = 12345;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const gate = new Float32Array(len);
  let i = 0;
  while (i < len) {
    const segLen = Math.round((0.006 + rand() * 0.02) * SR);
    const on = rand() > 0.35;
    for (let j = 0; j < segLen && i < len; j++, i++) {
      gate[i] = on ? 1 : 0;
    }
  }
  const overallEnv = expEnv(len, N(0.002), N(0.22));
  const out = new Float32Array(len);
  for (let k = 0; k < len; k++) out[k] = filtered[k] * gate[k] * overallEnv[k];
  return gain(out, 0.8);
}

// 6. Pop — quick upward chirp for UI icons appearing
function pop() {
  const dur = 0.14;
  const len = N(dur);
  const tone = sineWave((t) => 320 + t * 650, len);
  const env = expEnv(len, N(0.002), N(0.05));
  return gain(applyEnv(tone, env), 0.55);
}

// 7. Stamp thud — heavier punch for "BLOQUEIOS"
function stampThud() {
  const dur = 0.35;
  const len = N(dur);
  const tone = sineWave((t) => 95 - t * 40, len);
  const env = expEnv(len, N(0.001), N(0.1));
  const body = applyEnv(tone, env);
  const noiseLen = N(0.05);
  const crack = applyEnv(whiteNoise(noiseLen, 21), expEnv(noiseLen, N(0.001), N(0.018)));
  return gain(mix(body, gain(crack, 1.3)), 1.0);
}

// 8. Success ding — single clean bell for the CTA click confirmation
function ding() {
  const dur = 0.7;
  const len = N(dur);
  const t1 = applyEnv(sineWave(() => 1318.5, len), expEnv(len, N(0.004), N(0.3)));
  const t2 = applyEnv(sineWave(() => 2637, len), expEnv(len, N(0.004), N(0.22)));
  return gain(mix(t1, gain(t2, 0.35)), 0.5);
}

writeWav(path.join(OUT_DIR, 'impact.wav'), impactHit());
writeWav(path.join(OUT_DIR, 'whoosh-up.wav'), whoosh(true));
writeWav(path.join(OUT_DIR, 'whoosh-down.wav'), whoosh(false));
writeWav(path.join(OUT_DIR, 'click.wav'), clickTick());
writeWav(path.join(OUT_DIR, 'chime.wav'), chime());
writeWav(path.join(OUT_DIR, 'glitch.wav'), glitchCrackle());
writeWav(path.join(OUT_DIR, 'pop.wav'), pop());
writeWav(path.join(OUT_DIR, 'stamp.wav'), stampThud());
writeWav(path.join(OUT_DIR, 'ding.wav'), ding());

console.log('SFX generated in', OUT_DIR);
