// Vídeo 06 — "Ana Novais — Capacitação para Jovens e Primeiro Emprego".
// Transcrição (whisper-small via sherpa-onnx) bate com o roteiro. Tempos por
// alinhamento forçado (aeneas + espeak-ng, por) sobre narracao-jovens.mp3
// (22,23s), conferidos contra as pausas reais do silencedetect — palavras
// logo após pausa ancoradas no fim do silêncio. Frames globais (30fps).
//
// "Ana Novais quer ampliar as oportunidades para os jovens entrarem
// preparados no mercado de trabalho! Como deputada federal, pretende defender
// mais qualificação profissional, inclusão digital e políticas que facilitem
// o acesso ao primeiro emprego! A proposta também incentiva o
// empreendedorismo jovem, com cursos, bolsas de capacitação, educação
// financeira, apoio à inovação e iniciativas para transformar boas ideias em
// novos negócios!"
export const WORD = {
  ana: 6,
  ampliar: 32,
  oportunidades: 48,
  jovens: 72,
  entrarem: 85,
  mercado: 112,
  trabalho: 125,
  como: 156,
  deputada: 164,
  pretende: 182,
  defender: 196,
  mais: 208,
  qualificacao: 215,
  profissional: 233,
  inclusao: 256,
  digital: 269,
  politicas: 288,
  facilitem: 306,
  acesso: 323,
  primeiro: 341,
  emprego: 352,
  proposta: 364,
  tambem: 387,
  empreendedorismo: 413,
  jovem: 434,
  cursos: 451,
  bolsas: 474,
  capacitacao: 485,
  educacao: 510,
  financeira: 521,
  apoio: 543,
  inovacao: 557,
  iniciativas: 576,
  transformar: 602,
  boas: 619,
  ideias: 628,
  novos: 641,
  negocios: 650,
  fim: 667,
} as const;

// Mapa de cenas guiado pela fala — overlap de 7 frames. Cada saída só
// começa depois que a última palavra da cena foi falada E lida. O terço inferior
// fica livre para a legenda da edição final.
export const JOVENS_SCENES = {
  c1: { from: 0, duration: 160 }, // "Ana Novais quer ampliar ... mercado de trabalho!" (6–137)
  c2: { from: 153, duration: 223 }, // "Como deputada federal ... primeiro emprego!" (156–360)
  c3: { from: 369, duration: 245 }, // "A proposta também incentiva ... e iniciativas" (364–597) + leitura
  c4: { from: 604, duration: 103 }, // "para transformar boas ideias em novos negócios!" (598–667) + respiro — entra em crossfade sobre a sucção
  c5: { from: 687, duration: 140 }, // selo + fade (dissolve sobre o fim da c4)
} as const;

export const JOVENS_TOTAL_FRAMES = JOVENS_SCENES.c5.from + JOVENS_SCENES.c5.duration; // 827 ≈ 27,6s

export interface JovensAssets {
  anaCutout: string; // FOTO REAL: Ana entregando certificado a um jovem (rembg + certificado)
  fotoInclusao: string; // FOTO REAL: Ana abraçada com jovem
  fotoMencao: string; // FOTO REAL: Ana na entrega de menção honrosa a estudante
  fotoRua: string; // FOTO REAL: Ana com jovem na rua
  narracao: string;
}

export const JOVENS_ASSETS: JovensAssets = {
  anaCutout: 'jovens-ana-certificado-cutout.png',
  fotoInclusao: 'jovens-real-inclusao.jpg',
  fotoMencao: 'jovens-real-mencao.jpg',
  fotoRua: 'jovens-real-rua.jpg',
  narracao: 'narracao-jovens.mp3',
};
