// Timing do vídeo "Ana Novais — Proteção à Infância" (Vídeo 04).
//
// Alinhamento forçado REAL (aeneas + espeak-ng, idioma por) sobre
// narracao-protecao.mp3 (20,87s), conferido contra as pausas reais medidas
// com ffmpeg silencedetect (4.14–4.54, 11.44–11.64, 14.05–14.28,
// 17.65–17.87, 18.34–18.56, 19.43–19.65s). Palavras logo depois de uma
// pausa foram ancoradas no fim do silêncio. Frames GLOBAIS (30fps).

export interface Word {
  w: string;
  f: number;
}

export const WORDS: Word[] = [
  { w: 'Ana', f: 6 },
  { w: 'Novais', f: 10 },
  { w: 'quer', f: 24 },
  { w: 'fortalecer', f: 30 },
  { w: 'o', f: 54 },
  { w: 'combate', f: 59 },
  { w: 'à', f: 65 },
  { w: 'violência', f: 71 },
  { w: 'contra', f: 83 },
  { w: 'crianças', f: 91 },
  { w: 'e', f: 104 },
  { w: 'adolescentes!', f: 107 },
  { w: 'Como', f: 136 },
  { w: 'deputada', f: 142 },
  { w: 'federal,', f: 152 },
  { w: 'pretende', f: 167 },
  { w: 'defender', f: 181 },
  { w: 'mais', f: 194 },
  { w: 'prevenção,', f: 203 },
  { w: 'educação', f: 218 },
  { w: 'nas', f: 233 },
  { w: 'escolas', f: 236 },
  { w: 'e', f: 257 },
  { w: 'ampliação', f: 263 },
  { w: 'do', f: 274 },
  { w: 'atendimento', f: 277 },
  { w: 'psicológico', f: 290 },
  { w: 'e', f: 311 },
  { w: 'social', f: 313 },
  { w: 'às', f: 326 },
  { w: 'vítimas.', f: 334 },
  { w: 'Também', f: 349 },
  { w: 'quer', f: 355 },
  { w: 'trabalhar', f: 361 },
  { w: 'pelo', f: 374 },
  { w: 'fortalecimento', f: 380 },
  { w: 'das', f: 404 },
  { w: 'leis,', f: 412 },
  { w: 'dos', f: 428 },
  { w: 'canais', f: 434 },
  { w: 'de', f: 444 },
  { w: 'denúncia', f: 448 },
  { w: 'e', f: 462 },
  { w: 'da', f: 463 },
  { w: 'atuação', f: 470 },
  { w: 'integrada', f: 482 },
  { w: 'entre', f: 499 },
  { w: 'Conselho', f: 505 },
  { w: 'Tutelar,', f: 516 },
  { w: 'saúde,', f: 536 },
  { w: 'assistência', f: 557 },
  { w: 'social,', f: 570 },
  { w: 'segurança', f: 590 },
  { w: 'e', f: 607 },
  { w: 'Justiça.', f: 611 },
];

/** Frame global de uma palavra pelo índice. */
export const wf = (i: number): number => WORDS[i].f;

// Mapa de cenas — overlaps de 7 frames. A narração é rápida (20,9s), então
// cada cena segura a palavra-chave um pouco depois da fala para dar tempo de
// leitura, e o final ganha ~3,5s de respiro com a assinatura antes do fade.
export const PROTECAO_SCENES = {
  c1: { from: 0, duration: 140 }, // fala 6–130
  c2: { from: 133, duration: 237 }, // fala 136–346 (+ leitura de "vítimas")
  c3: { from: 363, duration: 115 }, // fala 349–462
  c4: { from: 471, duration: 314 }, // fala 462–626 + assinatura + fade
} as const;

export const PROTECAO_TOTAL_FRAMES = PROTECAO_SCENES.c4.from + PROTECAO_SCENES.c4.duration;

/** Frame LOCAL de uma palavra dentro de uma cena (palavras faladas antes da cena existir entram logo no início dela). */
export const lf = (i: number, scene: { from: number }): number => Math.max(3, WORDS[i].f - scene.from);
