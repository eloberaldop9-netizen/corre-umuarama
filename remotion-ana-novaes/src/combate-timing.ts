// Timing e assets do vídeo 03 — arquivo separado para as cenas importarem
// sem dependência circular com VideoAnaNovaisCombate.tsx.

// "Ana Novais — Combate e Recomeço" — Corte Editorial: sem legendas, só
// Hero Letterings (Montserrat, Easing.out cubic) ancorados na narração.
// Transcrição COMPLETA (whisper-small via sherpa-onnx) + alinhamento forçado
// (aeneas + espeak-ng, por), conferido contra as pausas reais medidas com
// ffmpeg silencedetect — palavras logo após pausa ancoradas no fim do
// silêncio. A v1 usava uma transcrição incompleta (faltava "e políticas
// públicas para ampliar a rede de proteção às vítimas" e o final "para
// mulheres em situação de violência"), por isso os tempos antigos estavam
// deslocados. Frames globais (30fps).
//
// "Ana Novais quer fortalecer o combate à violência contra as mulheres!
// Como deputada federal, pretende defender mais recursos e políticas
// públicas para ampliar a rede de proteção às vítimas, com atendimento
// especializado, acolhimento seguro, Patrulhas Maria da Penha e maior
// acesso a mecanismos de proteção, como o botão do pânico. Por isso, Ana
// propõe incentivar emprego, capacitação profissional e empreendedorismo
// para mulheres em situação de violência."
export const WORD = {
  ana: 6,
  combate: 57,
  violencia: 71,
  mulheres: 101,
  como: 122,
  mais: 186,
  recursos: 198,
  politicas: 214,
  publicas: 228,
  rede: 279,
  vitimas: 298,
  atendimento: 323,
  especializado: 338,
  acolhimento: 365,
  seguro: 380,
  patrulhas: 400,
  penha: 428,
  mecanismos: 474,
  botao: 532,
  panico: 540,
  emprego: 616,
  capacitacao: 634,
  profissional: 652,
  empreendedorismo: 673,
  mulheresFim: 708,
  situacao: 724,
  violenciaFim: 743,
} as const;

// Mapa de cenas guiado pela narração (25,4s) — overlap de 7 frames.
export const COMBATE_SCENES = {
  c1: { from: 0, duration: 122 }, // "Ana Novais ... contra as mulheres!" (6–116)
  c2: { from: 115, duration: 205 }, // "Como deputada ... rede de proteção às vítimas," (122–311)
  c3: { from: 313, duration: 250 }, // "com atendimento ... como o botão do pânico." (317–553)
  c4: { from: 556, duration: 215 }, // "Por isso ... para mulheres em situação de violência." (558–762)
  c5: { from: 764, duration: 140 }, // selo + fade
} as const;

export const TOTAL_FRAMES = COMBATE_SCENES.c5.from + COMBATE_SCENES.c5.duration; // 904 ≈ 30,1s

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

