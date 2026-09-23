// Vídeo 05 — "Ana Novais — Cuidado e Proteção" (idosos / Centros-Dia).
// Transcrição (whisper-small via sherpa-onnx) bate com o roteiro. Tempos por
// alinhamento forçado (aeneas + espeak-ng, por) sobre narracao-idosos.mp3
// (21,92s), conferidos contra as pausas reais do silencedetect — palavras
// logo após pausa ancoradas no fim do silêncio. Frames globais (30fps).
//
// "Ana Novais quer fortalecer a proteção e o cuidado com as pessoas idosas!
// Como deputada federal, pretende trabalhar pelo combate à violência, ao
// abandono e à negligência, fortalecendo as leis e a proteção de quem já
// contribuiu tanto com a nossa sociedade! Uma das propostas é criar um
// programa federal para ampliar a implantação de Centros-Dia, oferecendo
// atendimento especializado, acompanhamento, convivência e apoio às famílias."
export const WORD = {
  ana: 6,
  fortalecer: 29,
  protecao: 46,
  cuidado: 68,
  pessoas: 84,
  como: 121,
  deputada: 126,
  pretende: 156,
  combate: 181,
  violencia: 196,
  abandono: 224,
  negligencia: 247,
  fortalecendo: 270,
  leis: 290,
  protecao2: 305,
  quem: 319,
  tanto: 347,
  sociedade: 368,
  uma: 392,
  propostas: 403,
  programa: 431,
  federal: 439,
  centrosDia: 490,
  oferecendo: 515,
  atendimento: 528,
  acompanhamento: 571,
  convivencia: 598,
  apoio: 626,
  fim: 657,
} as const;

// Mapa de cenas guiado pela fala — overlap de 7 frames. O terço inferior das
// cenas com mais fala fica livre para a legenda da edição final.
export const IDOSOS_SCENES = {
  c1: { from: 0, duration: 125 }, // "Ana Novais quer fortalecer a proteção e o cuidado com as pessoas idosas!" (6–108)
  c2: { from: 118, duration: 70 }, // "Como deputada federal, pretende trabalhar pelo" (121–181)
  c3: { from: 181, duration: 104 }, // "combate à violência, ao abandono e à negligência," (181–262)
  c4: { from: 278, duration: 118 }, // "fortalecendo as leis e a proteção de quem já contribuiu ..." (270–386)
  c5: { from: 389, duration: 138 }, // "Uma das propostas é criar um programa federal ... Centros-Dia," (392–509)
  c6: { from: 520, duration: 170 }, // "oferecendo atendimento ... e apoio às famílias." (515–657)
  c7: { from: 683, duration: 140 }, // selo + fade
} as const;

export const IDOSOS_TOTAL_FRAMES = IDOSOS_SCENES.c7.from + IDOSOS_SCENES.c7.duration; // 823 ≈ 27,4s

export interface IdososAssets {
  anaCutout: string; // Ana na Câmara, fundo removido (rembg)
  anaAbraco: string; // Ana abraçando uma idosa (foto real)
  casalIdosos: string; // Adobe Stock — casal de idosos sorrindo
  violencia: string; // Adobe Stock — idoso cobrindo o rosto (VIOLÊNCIA)
  solidao: string; // Adobe Stock — idosa sozinha na janela (ABANDONO)
  maos: string; // Adobe Stock — mãos enrugadas (NEGLIGÊNCIA)
  artesao: string; // Adobe Stock — idoso artesão trabalhando (quem já contribuiu)
  leis: string; // Adobe Stock — martelo e livros
  narracao: string;
}

export const IDOSOS_ASSETS: IdososAssets = {
  anaCutout: 'idosos-ana-camara-cutout.png',
  anaAbraco: 'idosos-ana-abraco.jpg',
  casalIdosos: 'stock-idosos-casal.jpg',
  violencia: 'stock-idoso-violencia.jpg',
  solidao: 'stock-idosa-solidao.jpg',
  maos: 'stock-idosa-maos.jpg',
  artesao: 'stock-idoso-artesao.jpg',
  leis: 'stock-leis.jpg',
  narracao: 'narracao-idosos.mp3',
};
