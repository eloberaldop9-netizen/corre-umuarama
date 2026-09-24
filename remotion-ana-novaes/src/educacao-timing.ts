// Vídeo 08 — "Ana Novais — Educação".
// Transcrição (whisper-small via sherpa-onnx) bate com o roteiro. Tempos por
// alinhamento forçado (aeneas + espeak-ng, por) sobre narracao-educacao.mp3
// (40,59s), conferidos contra as pausas reais do silencedetect — palavras
// logo após pausa ancoradas no fim do silêncio. Frames globais (30fps).
export const WORD = {
  ana: 5,
  propoe: 25,
  fortalecer: 36,
  educacao: 60,
  publica: 72,
  garantir: 91,
  recursos: 115,
  escolas: 149,
  cheguem: 171,
  onde: 186,
  realmente: 193,
  precisam: 209,
  // "Como deputada federal, pretende defender ..."
  como: 231,
  deputada: 239,
  pretende: 271,
  defender: 286,
  mais: 296,
  investimentos: 306,
  uniao: 329,
  fiscalizacao: 347,
  rigorosa: 368,
  recursos2: 392,
  publicos: 403,
  valorizacao: 426,
  professores: 454,
  condicoes: 482,
  cumprimento: 508,
  piso: 527,
  salarial: 534,
  magisterio: 551,
  // "A proposta também prevê ..."
  proposta: 572,
  preve: 602,
  escolas2: 608,
  infraestrutura: 636,
  tecnologia: 668,
  inovacao: 692,
  alem: 722,
  medidas: 736,
  melhorar: 751,
  condicoes2: 769,
  ensino: 785,
  sala: 798,
  aula: 810,
  tambem: 825,
  fortalecer2: 838,
  presenca: 857,
  psicologos: 878,
  assistentes: 903,
  sociais: 918,
  equipes: 944,
  multiprofissionais: 962,
  escolas3: 995,
  ampliando: 1015,
  suporte: 1036,
  estudantes: 1050,
  inclusive: 1073,
  criancas: 1087,
  autismo: 1112,
  tdah: 1133,
  outras: 1159,
  necessidades: 1172,
  especificas: 1196,
  fim: 1216,
} as const;

// Pausas reais usadas para as trocas de "tela" da rolagem da cena 3.
export const PAUSES = { infra: 659, tecnologia: 711, sala: 818, escolas3: 1009, estudantes: 1066 } as const;

// Mapa de cenas guiado pela fala — overlap de 7 frames. Saídas só depois da
// leitura, com easing suave; composições grandes e centralizadas.
export const EDUCACAO_SCENES = {
  c1: { from: 0, duration: 240 }, // "Ana Novais propõe ... realmente precisam!" (5–222)
  c2: { from: 233, duration: 355 }, // "Como deputada federal ... piso salarial do magistério." (231–567)
  c3: { from: 581, duration: 663 }, // "A proposta também prevê ... necessidades específicas." (572–1216)
  c4: { from: 1237, duration: 150 }, // selo + fade
} as const;

export const EDUCACAO_TOTAL_FRAMES = EDUCACAO_SCENES.c4.from + EDUCACAO_SCENES.c4.duration; // 1387 ≈ 46,2s

export interface EducacaoAssets {
  anaCutout: string; // Ana sentada, camisa branca (foto enviada), fundo removido
  alunos: string; // Adobe Stock — alunos levantando a mão
  carteiras: string; // Adobe Stock — turma nas carteiras
  escola: string; // Adobe Stock — sala de aula equipada e colorida (infraestrutura)
  tecnologia: string; // Adobe Stock — alunos usando notebooks em sala
  aula: string; // Adobe Stock — professora dando aula
  psicologa: string; // Adobe Stock — psicóloga escolar atendendo aluno na escola
  inclusao: string; // Adobe Stock — criança com apoio da professora
  narracao: string;
}

export const EDUCACAO_ASSETS: EducacaoAssets = {
  anaCutout: 'educacao-ana-cutout.png',
  alunos: 'stock-edu-alunos.jpg',
  carteiras: 'stock-edu-carteiras.jpg',
  escola: 'stock-edu-escola.jpg',
  tecnologia: 'stock-edu-tecnologia.jpg',
  aula: 'stock-edu-aula.jpg',
  psicologa: 'stock-edu-psicologa.jpg',
  inclusao: 'stock-edu-inclusao.jpg',
  narracao: 'narracao-educacao.mp3',
};
