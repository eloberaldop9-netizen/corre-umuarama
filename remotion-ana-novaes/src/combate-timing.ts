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
  recursos: 198,
  atendimento: 215,
  acolhimento: 265,
  patrulhas: 317,
  penha: 354,
  botao: 470,
  panico: 494,
  emprego: 594,
  capacitacao: 602,
  empreendedorismo: 636, // estimado (primeira palavra após a pausa 20,86–21,13s)
  situacao: 720, // estimado (fim da frase, ~24,0s)
} as const;

// Mapa de cenas (decupagem "Corte Editorial High-End"), esticado para caber
// a narração real de 25,4s — overlap de 7 frames entre todas.
export const COMBATE_SCENES = {
  c1: { from: 0, duration: 140 }, // "Ana Novais ... contra as mulheres" (6–115)
  c2: { from: 133, duration: 262 }, // "Como deputada ... Patrulhas Maria da Penha" (122–356)
  c3: { from: 388, duration: 145 }, // "... mecanismos de proteção, como o botão do pânico!" (–510)
  c4: { from: 526, duration: 240 }, // "Por isso ... emprego, capacitação ... empreendedorismo ..." (518–762)
  c5: { from: 759, duration: 140 }, // selo + fade
} as const;

export const TOTAL_FRAMES = COMBATE_SCENES.c5.from + COMBATE_SCENES.c5.duration; // 899 ≈ 30s

export interface CombateAssets {
  retratoStopX: string; // recorte PNG (fundo removido)
  fotoAcolhimento: string;
  fotoPatrulha: string;
  fotoPanico: string;
  fotoCapacitacao: string;
  narracao: string;
}

export const COMBATE_ASSETS: CombateAssets = {
  retratoStopX: 'combate-stopx-cutout.png',
  fotoAcolhimento: 'combate-acolhimento.jpg',
  fotoPatrulha: 'combate-patrulha.jpg',
  fotoPanico: 'combate-panico.jpg',
  fotoCapacitacao: 'combate-capacitacao.jpg',
  narracao: 'narracao-combate.mp3',
};

