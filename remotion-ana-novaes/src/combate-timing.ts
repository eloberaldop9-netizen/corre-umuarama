// Timing e assets do vídeo 03 — arquivo separado para as cenas importarem
// sem dependência circular com VideoAnaNovaisCombate.tsx.

// "Ana Novais — Combate e Recomeço" — CORTE EDITORIAL (v2).
// Sem legendas: só os Hero Letterings, com entrada editorial (blur +
// tracking + Easing.out cubic, zero springs) e parallax entre foto, papel e
// tipografia. Timing ancorado no alinhamento forçado real de
// narracao-combate.mp3 (25,39s) feito na v1; o trecho final (depois de
// "capacitação profissional", 21,13s–25,39s) ainda não tem transcrição, então
// EMPREENDEDORISMO e "em situação de violência" estão em tempos estimados.
export const WORD = {
  ana: 6,
  combate: 60,
  violencia: 72,
  mulheres: 103,
  como: 122,
  mais: 187,
  recursos: 198,
  atendimento: 215,
  acolhimento: 265,
  patrulhas: 317,
  penha: 354,
  mecanismos: 410,
  botao: 470,
  panico: 494,
  emprego: 594,
  capacitacao: 602,
  empreendedorismo: 636, // estimado (primeira palavra após a pausa 20,86–21,13s)
} as const;

// Mapa de cenas v5 (Corte Editorial Puro), esticado para a narração real de
// 25,4s — overlap de 7 frames entre todas.
export const COMBATE_SCENES = {
  c1: { from: 0, duration: 122 }, // "Ana Novais ... contra as mulheres" (6–115)
  c2: { from: 115, duration: 115 }, // "Como deputada federal, pretende defender mais recursos" (122–210)
  c3: { from: 223, duration: 300 }, // atendimento → acolhimento → patrulhas → botão do pânico (215–510)
  c4: { from: 516, duration: 250 }, // "Por isso ... emprego, capacitação ... empreendedorismo ..." (518–762)
  c5: { from: 759, duration: 140 }, // selo + fade
} as const;

export const TOTAL_FRAMES = COMBATE_SCENES.c5.from + COMBATE_SCENES.c5.duration; // 899 ≈ 30s

export interface CombateAssets {
  retratoStopX: string; // recorte PNG (fundo removido)
  fotoAcolhimento: string; // escritório, mão no ombro — ATENDIMENTO
  fotoAbraco: string; // abraço no banco (Adobe Stock) — ACOLHIMENTO
  fotoPatrulha: string;
  fotoPanico: string;
  fotoCapacitacao: string;
  narracao: string;
}

export const COMBATE_ASSETS: CombateAssets = {
  retratoStopX: 'combate-stopx-cutout.png',
  fotoAcolhimento: 'combate-acolhimento.jpg',
  fotoAbraco: 'stock-acolhimento-abraco.jpg',
  fotoPatrulha: 'combate-patrulha.jpg',
  fotoPanico: 'combate-panico.jpg',
  fotoCapacitacao: 'combate-capacitacao.jpg',
  narracao: 'narracao-combate.mp3',
};

