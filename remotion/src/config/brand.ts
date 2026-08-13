/**
 * ACEU Nipon Fest 2026 — identidade visual oficial.
 * Fonte: manual de marca fornecido. Não alterar sem atualizar o manual.
 */
import { FONT_BODY, FONT_DISPLAY, FONT_JP } from '../lib/fonts';

export const BRAND = {
  red: '#D71920', // Akai — energia, cultura japonesa
  brightRed: '#FF3131', // vermelho secundário
  offWhite: '#F8F2F1',
  taupe: '#89635D',
  black: '#171717',
} as const;

export const FONTS = {
  // Fonte oficial do logotipo não distribuída digitalmente — usamos a alternativa
  // geométrica mais próxima já carregada no projeto (Montserrat) para tipografia cinética.
  display: FONT_DISPLAY,
  body: FONT_BODY,
  japanese: FONT_JP,
} as const;

// Duração local de cada cena (frames a 30fps), seguindo o roteiro do briefing.
// S5 é mais longa que os 3s originais do briefing para caber as 3 palavras
// (GERAÇÕES/CULTURAS/HISTÓRIAS) inteiramente sequenciais, sem sobreposição.
export const SCENE_DURATIONS = [60, 90, 90, 90, 116, 90, 90, 90] as const;

// Overlap entre cenas (corte antecipado da próxima cena sobre o fim da
// anterior) — garante zero frames vazios (Mandamento 7).
export const SCENE_OVERLAP = 8;

const totalDuration = SCENE_DURATIONS.reduce(
  (acc, dur, i) => (i === 0 ? dur : acc + dur - SCENE_OVERLAP),
  0
);

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  // Resultado do roteiro com overlaps — dentro da janela de 18–22s pedida.
  durationInFrames: totalDuration,
} as const;

// Respiro mínimo (safe area) para Reels/Stories — evita UI do Instagram.
export const SAFE_AREA = {
  top: 220,
  bottom: 260,
  left: 72,
  right: 72,
} as const;
