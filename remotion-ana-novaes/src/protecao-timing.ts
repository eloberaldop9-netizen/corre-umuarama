// Timing do vídeo "Ana Novais — Proteção à Infância" (Vídeo 04).
//
// ⚠️ ESTIMATIVA PROVISÓRIA: o mp3 da narração ainda não chegou. Os frames
// abaixo foram calculados por peso silábico (≈5,4 sílabas/s, pausa extra em
// vírgula e ponto final) sobre a transcrição oficial. Quando o áudio real
// chegar, só esta tabela muda (alinhamento forçado real, mesmo método dos
// vídeos anteriores) — todas as cenas leem os tempos daqui.
//
// Frames GLOBAIS (30fps). Cada cena converte para local com `local(f, cena)`.

export interface Word {
  w: string;
  f: number;
}

export const WORDS: Word[] = [
  // Frase 1 — Cena 1
  { w: 'Ana', f: 6 },
  { w: 'Novais', f: 17 },
  { w: 'quer', f: 28 },
  { w: 'fortalecer', f: 34 },
  { w: 'o', f: 56 },
  { w: 'combate', f: 62 },
  { w: 'à', f: 78 },
  { w: 'violência', f: 84 },
  { w: 'contra', f: 112 },
  { w: 'crianças', f: 123 },
  { w: 'e', f: 139 },
  { w: 'adolescentes!', f: 145 },
  // Frase 2 — Cena 2 (índices 12–30)
  { w: 'Como', f: 183 },
  { w: 'deputada', f: 194 },
  { w: 'federal,', f: 216 },
  { w: 'pretende', f: 238 },
  { w: 'defender', f: 254 },
  { w: 'mais', f: 271 },
  { w: 'prevenção,', f: 277 },
  { w: 'educação', f: 298 },
  { w: 'nas', f: 320 },
  { w: 'escolas', f: 326 },
  { w: 'e', f: 343 },
  { w: 'ampliação', f: 348 },
  { w: 'do', f: 370 },
  { w: 'atendimento', f: 376 },
  { w: 'psicológico', f: 404 },
  { w: 'e', f: 432 },
  { w: 'social', f: 437 },
  { w: 'às', f: 454 },
  { w: 'vítimas.', f: 459 },
  // Frase 3 — Cena 3 (índices 31–41)
  { w: 'Também', f: 486 },
  { w: 'quer', f: 497 },
  { w: 'trabalhar', f: 503 },
  { w: 'pelo', f: 519 },
  { w: 'fortalecimento', f: 530 },
  { w: 'das', f: 564 },
  { w: 'leis,', f: 569 },
  { w: 'dos', f: 580 },
  { w: 'canais', f: 585 },
  { w: 'de', f: 597 },
  { w: 'denúncia', f: 602 },
  // Frase 4 — Cena 4 (índices 42–54)
  { w: 'e', f: 634 },
  { w: 'da', f: 640 },
  { w: 'atuação', f: 645 },
  { w: 'integrada', f: 668 },
  { w: 'entre', f: 690 },
  { w: 'Conselho', f: 701 },
  { w: 'Tutelar,', f: 718 },
  { w: 'saúde,', f: 739 },
  { w: 'assistência', f: 755 },
  { w: 'social,', f: 783 },
  { w: 'segurança', f: 805 },
  { w: 'e', f: 827 },
  { w: 'Justiça.', f: 833 },
];

/** Frame global de uma palavra pelo índice. */
export const wf = (i: number): number => WORDS[i].f;

// Mapa de cenas — mesma gramática do vídeo aprovado "A Causa" (v7):
// 4 cenas, sem lockup final, fade pro preto no fim.
export const PROTECAO_SCENES = {
  c1: { from: 0, duration: 196 }, // fala 6–173
  c2: { from: 176, duration: 310 }, // fala 183–476
  c3: { from: 478, duration: 160 }, // fala 486–624
  c4: { from: 620, duration: 270 }, // fala 634–849 + fade
} as const;

export const PROTECAO_TOTAL_FRAMES = PROTECAO_SCENES.c4.from + PROTECAO_SCENES.c4.duration;

/** Frame LOCAL de uma palavra dentro de uma cena. */
export const lf = (i: number, scene: { from: number }): number => WORDS[i].f - scene.from;
