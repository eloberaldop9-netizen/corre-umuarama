// Timing do vídeo "Ana Novais — O Dossiê da Proteção" (Vídeo 04).
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

// Mapa de cenas — overlap de 7 frames entre todas (Mandamento 7).
export const PROTECAO_SCENES = {
  c1: { from: 0, duration: 188 }, // fala 6–173
  c2: { from: 181, duration: 309 }, // fala 183–476
  c3: { from: 483, duration: 148 }, // fala 486–624
  c4: { from: 624, duration: 246 }, // fala 634–849
  c5: { from: 863, duration: 120 }, // lockup
} as const;

export const PROTECAO_TOTAL_FRAMES = PROTECAO_SCENES.c5.from + PROTECAO_SCENES.c5.duration;

/**
 * Páginas de legenda (grupos de índices de WORDS). Cada página aparece
 * palavra por palavra no frame exato da fala e sai quando a próxima página
 * começa — NENHUMA palavra falada fica sem legenda.
 */
export const CAPTION_PAGES = {
  c1: [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
  ],
  c2: [
    [12, 13, 14],
    [15, 16, 17, 18],
    [19, 20, 21],
    [22, 23, 24, 25],
    [26, 27, 28, 29, 30],
  ],
  c3: [
    [31, 32, 33, 34],
    [35, 36, 37],
    [38, 39, 40, 41],
  ],
  c4: [
    [42, 43, 44, 45, 46],
    [47, 48],
    [49, 50, 51],
    [52, 53, 54],
  ],
} as const;
