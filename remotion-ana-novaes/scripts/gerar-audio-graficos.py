#!/usr/bin/env python3
"""Trilha e efeitos do vídeo "Gráficos 2D vs 3D" (60 s @ 30 fps).

Tudo é sintetizado aqui, de forma determinística (seed fixa), sem arquivos de
terceiros. Os efeitos estão amarrados aos frames das cenas
(src/graficos/scenes/Cine*.tsx) e a trilha muda de arranjo por cena:
  C1 (0–9.8s)   pad escuro + riser até o estouro
  C2 (9.8–25s)  pad + arpejo + pulso leve (o 2D é "estalado")
  C3 (25–45s)   pad aberto, sem pulso (o 3D é contemplativo)
  C4 (45–60s)   pad + arpejo + pulso (resolução) → fade

Uso:  python3 scripts/gerar-audio-graficos.py
Saída: public/assets/graficos-trilha.wav (44.1 kHz, estéreo, 16 bits), depois
convertido para o MP3 que o vídeo usa (o WAV não é versionado):
  LD_LIBRARY_PATH=node_modules/@remotion/compositor-linux-x64-gnu \
  node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg -y \
    -i public/assets/graficos-trilha.wav -f mp3 -c:a libmp3lame -b:a 192k \
    public/assets/graficos-trilha.mp3
"""

import os
import wave

import numpy as np

SR = 44100
FPS = 30
DUR = 60.0
N = int(SR * DUR)
rng = np.random.default_rng(2026)


def t_of(frame: float) -> float:
    return frame / FPS


def env_ad(n: int, attack: float, decay: float) -> np.ndarray:
    """Envelope ataque linear + decaimento exponencial (segundos)."""
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-np.maximum(t - attack, 0) / max(decay, 1e-4))


def svf(x: np.ndarray, cutoff: np.ndarray, q: float = 0.7, mode: str = "bp") -> np.ndarray:
    """Filtro state-variable com corte variável no tempo (para sons curtos)."""
    low = band = 0.0
    out = np.empty_like(x)
    damp = 1.0 / q
    for i in range(len(x)):
        f = 2 * np.sin(np.pi * min(cutoff[i], SR / 6) / SR)
        low += f * band
        high = x[i] - low - damp * band
        band += f * high
        out[i] = band if mode == "bp" else (low if mode == "lp" else high)
    return out


# ── BLOCOS DE EFEITO ──────────────────────────────────────────────────────
def whoosh(dur: float, f0: float, f1: float, q: float = 1.2) -> np.ndarray:
    n = int(SR * dur)
    t = np.linspace(0, 1, n)
    cut = f0 * (f1 / f0) ** t
    y = svf(rng.standard_normal(n), cut, q, "bp")
    shape = np.sin(np.pi * t) ** 1.5
    return y * shape / (np.abs(y).max() + 1e-9)


def thump(dur: float = 0.5, f0: float = 90, f1: float = 42) -> np.ndarray:
    n = int(SR * dur)
    t = np.arange(n) / SR
    freq = f1 + (f0 - f1) * np.exp(-t * 18)
    ph = 2 * np.pi * np.cumsum(freq) / SR
    return np.sin(ph) * env_ad(n, 0.004, dur / 4)


def boom(dur: float = 1.8) -> np.ndarray:
    n = int(SR * dur)
    body = thump(dur, 70, 34) * 1.0
    noise = svf(rng.standard_normal(n), np.full(n, 180.0), 0.8, "lp")
    noise = noise / (np.abs(noise).max() + 1e-9) * env_ad(n, 0.002, 0.35) * 0.6
    return body + noise


def tick(freq: float = 2400, dur: float = 0.05) -> np.ndarray:
    n = int(SR * dur)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * freq * t) * env_ad(n, 0.0008, 0.012)


def pop(f0: float = 520, f1: float = 900, dur: float = 0.12) -> np.ndarray:
    n = int(SR * dur)
    t = np.arange(n) / SR
    freq = f0 + (f1 - f0) * (1 - np.exp(-t * 40))
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * env_ad(n, 0.002, 0.03)


def blip(freq: float, dur: float = 0.14) -> np.ndarray:
    n = int(SR * dur)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(4 * np.pi * freq * t)) * env_ad(n, 0.002, 0.045)


def ding(freq: float = 1318.5, dur: float = 1.4) -> np.ndarray:
    n = int(SR * dur)
    t = np.arange(n) / SR
    partials = [(1, 1.0, 0.5), (2.76, 0.35, 0.25), (5.4, 0.18, 0.12), (8.93, 0.08, 0.07)]
    y = sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t / d) for r, a, d in partials)
    return y * np.clip(t / 0.002, 0, 1)


def riser(dur: float) -> np.ndarray:
    n = int(SR * dur)
    t = np.linspace(0, 1, n)
    noise = svf(rng.standard_normal(n), 300 * (30 ** t), 1.5, "bp")
    noise /= np.abs(noise).max() + 1e-9
    tone = np.sin(2 * np.pi * np.cumsum(180 * (4 ** t)) / SR) * 0.35
    return (noise * 0.8 + tone) * t ** 2.2


def shimmer(dur: float, density: float = 9, base: float = 880) -> np.ndarray:
    """Cintilar digital: blips pentatônicos agudos espalhados (malha se desenhando)."""
    n = int(SR * dur)
    y = np.zeros(n)
    penta = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2]
    for _ in range(int(dur * density)):
        at = int(rng.uniform(0, n - SR * 0.2))
        b = blip(base * penta[rng.integers(len(penta))] * rng.choice([1, 2]), 0.18)
        y[at : at + len(b)] += b * rng.uniform(0.25, 0.6)
    fade = np.minimum(1, np.linspace(0, 3, n)) * np.minimum(1, np.linspace(3, 0, n))
    return y * fade


# ── TRILHA ────────────────────────────────────────────────────────────────
BPM = 90
BEAT = 60 / BPM
BAR = 4 * BEAT
NOTE = {"A2": 110.0, "C3": 130.81, "D3": 146.83, "E3": 164.81, "F3": 174.61, "G3": 196.0,
        "A3": 220.0, "B3": 246.94, "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23,
        "G4": 392.0, "A4": 440.0, "B4": 493.88, "C5": 523.25, "E5": 659.25}
CHORDS = [  # lá menor: Am – F – C – G
    ("A2", ["A3", "C4", "E4"], ["A4", "C5", "E5", "C5"]),
    ("F3", ["F3", "A3", "C4"], ["F4", "A4", "C5", "A4"]),
    ("C3", ["C4", "E4", "G4"], ["C5", "E5", "G4", "E4"]),
    ("G3", ["G3", "B3", "D4"], ["G4", "B4", "D4", "B4"]),
]

C2_IN, C3_IN, C4_IN = t_of(293), t_of(743), t_of(1343)


def section_brightness(t: np.ndarray) -> np.ndarray:
    """Quantos harmônicos o pad 'abre' por cena (escuro → brilhante → aberto)."""
    b = np.full_like(t, 3.0)
    b = np.where(t >= C2_IN, 5.0, b)
    b = np.where(t >= C3_IN, 6.5, b)
    b = np.where(t >= C4_IN, 5.5, b)
    return b


def pad() -> np.ndarray:
    t = np.arange(N) / SR
    out = np.zeros((N, 2))
    bright = section_brightness(t)
    n_bars = int(np.ceil(DUR / BAR)) + 1
    for k in range(n_bars):
        root, triad, _ = CHORDS[k % 4]
        s0 = int(k * BAR * SR)
        s1 = min(N, int((k + 1) * BAR * SR + 0.8 * SR))
        if s0 >= N:
            break
        seg_t = t[s0:s1] - t[s0]
        env = np.clip(seg_t / 0.9, 0, 1) * np.clip((BAR + 0.8 - seg_t) / 0.8, 0, 1)
        for i, name in enumerate(triad + [root]):
            f = NOTE[name] * (0.5 if name == root else 1)
            for ch, det in ((0, 0.997), (1, 1.003)):
                v = np.zeros(s1 - s0)
                for h in range(1, 8):
                    w = np.clip(bright[s0:s1] - h + 1, 0, 1) / h ** 1.4
                    v += w * np.sin(2 * np.pi * f * det * h * seg_t + i + h)
                out[s0:s1, ch] += v * env * (0.9 if name == root else 0.55)
    return out


def arp_and_kick() -> np.ndarray:
    out = np.zeros((N, 2))
    active = [(C2_IN, C3_IN - 0.3), (C4_IN + 0.6, 57.0)]
    for start, end in active:
        k0 = int(np.ceil(start / (BEAT / 2)))
        k1 = int(end / (BEAT / 2))
        for k in range(k0, k1):
            at = k * BEAT / 2
            chord = CHORDS[int(at // BAR) % 4]
            note = NOTE[chord[2][k % 4]]
            b = blip(note, 0.32) * 0.22
            s = int(at * SR)
            pan = 0.35 if k % 2 else -0.35
            e = min(N, s + len(b))
            out[s:e, 0] += b[: e - s] * (1 - pan)
            out[s:e, 1] += b[: e - s] * (1 + pan)
            if k % 4 == 0:  # pulso leve nos tempos 1 e 3
                kk = thump(0.35, 110, 45) * 0.5
                e = min(N, s + len(kk))
                out[s:e] += kk[: e - s, None]
    return out


# ── EFEITOS NOS FRAMES DO VÍDEO ───────────────────────────────────────────
def fx_track() -> np.ndarray:
    out = np.zeros((N, 2))

    def put(sig: np.ndarray, frame: float, gain: float, pan: float = 0.0) -> None:
        s = int(t_of(frame) * SR)
        if s >= N:
            return
        e = min(N, s + len(sig))
        out[s:e, 0] += sig[: e - s] * gain * (1 - pan)
        out[s:e, 1] += sig[: e - s] * gain * (1 + pan)

    # C1 — o quadrado infla e vira cubo; texto; mergulho na lente
    put(whoosh(0.55, 300, 2800), 26, 0.35)
    put(thump(0.6, 120, 40), 36, 0.8)
    for f, p in ((45, -0.2), (48, 0.0), (51, 0.2)):
        put(tick(2200), f, 0.18, p)
    put(pop(700, 1100), 56, 0.25)
    put(riser(0.9), 266, 0.55)
    put(boom(), 293, 0.85)
    put(ding(1760, 0.6), 293, 0.12)

    # C2 — título, cards se encaixando, dados crescendo, reorganização
    c2 = 293
    for i in range(6):
        put(tick(2600), c2 + 8 + i * 3, 0.12, -0.3 + i * 0.12)
    for f, p in ((40, -0.5), (52, 0.5), (60, 0.5), (70, 0.0)):
        put(whoosh(0.32, 600, 4200, 1.6), c2 + f - 4, 0.22, p)
        put(pop(380, 620, 0.1), c2 + f + 18, 0.2, p)
    for i, fr in enumerate((76, 80, 84, 88, 92)):  # barras crescendo
        put(blip(523.25 * (1.122 ** i)), c2 + fr, 0.16, 0.4)
    put(whoosh(0.9, 900, 2600, 2.5), c2 + 86, 0.1, 0.4)  # rosca enchendo
    put(whoosh(1.4, 400, 1600, 2.0), c2 + 94, 0.08, -0.2)  # linha desenhando
    for f in (62, 82, 102):  # organiza · explica · dá clareza
        put(tick(1800), c2 + f, 0.16)
    put(pop(600, 1000), c2 + 112, 0.22)  # selo After Effects
    put(whoosh(0.6, 500, 3500), c2 + 208, 0.3, -0.6)  # linha sai
    put(whoosh(0.7, 3500, 500), c2 + 230, 0.3, 0.6)  # linha volta
    for i in range(5):  # dados se atualizam
        put(blip(659.25 * (1.06 ** i)), c2 + 300 + i * 3, 0.13, 0.3)
    put(whoosh(0.8, 200, 5000, 0.9), c2 + 418, 0.55)  # lâminas rasgam

    # C3 — malha se desenha, cartaz voa e embrulha, luzes, planos de câmera
    c3 = 743
    put(shimmer(3.2), c3 + 10, 0.35)
    for i in range(3):
        put(tick(2000), c3 + 50 + i * 15, 0.12)
    put(whoosh(1.2, 120, 900, 1.0), c3 + 145, 0.25)  # vira lata cinza
    put(whoosh(0.9, 3000, 700, 1.4), c3 + 160, 0.4, 0.5)  # cartaz voando
    put(whoosh(1.6, 800, 5000, 3.0), c3 + 195, 0.22)  # rótulo embrulhando
    put(ding(1046.5, 1.6), c3 + 228, 0.2)  # rim light acende
    put(whoosh(1.2, 200, 1200, 1.2), c3 + 255, 0.15)  # fill quente
    put(whoosh(1.0, 300, 1800), c3 + 296, 0.25)  # close na textura
    put(whoosh(2.6, 1500, 6000, 4.0), c3 + 330, 0.1, -0.3)  # luz varrendo
    put(whoosh(1.0, 1800, 300), c3 + 380, 0.25)  # contra-plongée
    put(whoosh(1.0, 300, 1500), c3 + 456, 0.2)  # volta ao aberto
    put(pop(500, 850), c3 + 120, 0.2)  # selo Blender
    put(riser(0.85), c3 + 572, 0.6)  # a lata infla
    put(boom(2.0), c3 + 600, 0.9)

    # C4 — vidro, peça final, CTA e cliques
    c4 = 1343
    put(whoosh(0.7, 2500, 9000, 2.0), c4 + 0, 0.25)
    put(whoosh(0.7, 9000, 2500, 2.0), c4 + 18, 0.2)
    put(thump(0.6, 80, 38), c4 + 14, 0.5)
    for f, p in ((34, -0.5), (44, 0.5), (54, -0.5), (64, 0.5)):
        put(pop(420, 700, 0.11), c4 + f + 10, 0.2, p)
    for i in range(4):
        put(tick(2400), c4 + 56 + i * 3, 0.12)
    for i in range(3):
        put(pop(650, 1050), c4 + 102 + i * 4, 0.15, -0.3 + i * 0.3)
    put(whoosh(0.9, 2000, 400), c4 + 232, 0.25)  # peça recua
    put(whoosh(0.6, 500, 3000), c4 + 248, 0.25)  # painel CTA
    put(pop(500, 900), c4 + 272, 0.2, -0.2)
    put(pop(560, 980), c4 + 278, 0.2, 0.2)
    put(tick(3200, 0.04), c4 + 322, 0.5, -0.2)  # clique curtir
    put(ding(1567.98, 1.2), c4 + 323, 0.3, -0.2)
    put(tick(3200, 0.04), c4 + 366, 0.5, 0.2)  # clique compartilhar
    put(whoosh(0.5, 900, 6000, 2.0), c4 + 367, 0.3, 0.2)
    put(ding(2093.0, 1.0), c4 + 368, 0.18, 0.2)
    return out


def reverb(x: np.ndarray, seconds: float = 2.2, wet: float = 0.22) -> np.ndarray:
    n = int(SR * seconds)
    t = np.arange(n) / SR
    out = np.empty_like(x)
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-t / (seconds / 6))
        ir[0] = 0
        ir /= np.sqrt((ir ** 2).sum())
        y = np.fft.irfft(np.fft.rfft(x[:, ch], size) * np.fft.rfft(ir, size), size)[: len(x)]
        out[:, ch] = x[:, ch] + wet * y
    return out


def main() -> None:
    music = pad() * 0.05 + arp_and_kick() * 0.5
    t = np.arange(N) / SR
    music *= np.clip(t / 2.5, 0, 1)[:, None]  # entra devagar
    music *= np.clip((DUR - 0.3 - t) / 3.0, 0, 1)[:, None]  # sai no fade final
    fx = fx_track()
    mix = reverb(music * 0.55 + fx * 0.6, 2.4, 0.25)
    mix *= np.clip((DUR - 0.05 - t) / 0.8, 0, 1)[:, None]  # silêncio no último frame
    # Limitador suave (tanh): sobe o volume percebido para o padrão de Reels
    # sem estourar nos impactos; depois pico em -1 dBFS.
    mix = mix / np.abs(mix).max()
    drive = 3.2
    mix = np.tanh(mix * drive) / np.tanh(drive)
    mix = mix / np.abs(mix).max() * 0.89
    pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
    dest = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "graficos-trilha.wav")
    with wave.open(dest, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    rms = np.sqrt((mix ** 2).mean())
    print(f"ok: {os.path.normpath(dest)}  pico -1 dBFS  rms {20 * np.log10(rms):.1f} dBFS")
    for name, a, b in (("C1", 0, C2_IN), ("C2", C2_IN, C3_IN), ("C3", C3_IN, C4_IN), ("C4", C4_IN, DUR)):
        seg = mix[int(a * SR) : int(b * SR)]
        print(f"  {name}: rms {20 * np.log10(np.sqrt((seg ** 2).mean()) + 1e-9):.1f} dBFS")


if __name__ == "__main__":
    main()
