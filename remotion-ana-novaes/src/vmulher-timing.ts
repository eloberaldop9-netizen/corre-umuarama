// Vídeo 03 (refeito) — "Ana Novais — Violência contra a Mulher".
// Áudio: a própria Ana falando (vídeo enviado), recortado da fala 2,2s–54,2s.
// Transcrição (whisper-small) conferida com a legenda do vídeo original;
// tempos por alinhamento forçado (aeneas, por) + pausas reais (silencedetect).
// Frames do ÁUDIO (30fps). O vídeo abre com a CAPA (foto da mão + "UNIDAS
// CONSEGUIREMOS VENCER ESSA BATALHA") e o áudio entra em OFFSET.
export const OFFSET = 60;
export const g = (audioFrame: number) => audioFrame + OFFSET;

export const WORD = {
  no: 6, sete: 11, agosto: 36, ano: 60, sancionada: 89, lei: 110, penha: 138,
  visa: 156, coibir: 164, violencia: 192, domestica: 206, familiar: 229,
  mas: 255, avancar: 275, muitos: 293, pontos: 300,
  como: 322, vereadora: 330, municipio: 356, criei: 380, projeto: 392, agostoLilas: 424, lilas: 448,
  visa2: 471, combate: 505, violencia2: 530, domestica2: 545,
  ele: 564, escolas: 584, conscientizar: 611, sociedade: 640, alunos: 667, lei2: 691, importancia: 710,
  como2: 738, mulher: 751, lutei: 773, protecao: 792, garantia: 811, direitos: 842, mulheres: 858,
  criei2: 871, projeto2: 888, patrulha: 912, maria2: 928, solicitando: 967, prefeito: 995, pratica: 1051,
  eMais: 1066, mecanismo: 1114, combate2: 1120, violencia3: 1135, mulher2: 1152,
  alem: 1174, criei3: 1193, fundo: 1206, especial: 1217, capacitacao: 1255, maoDeObra: 1266, feminina: 1286, mercado: 1330, trabalho: 1340,
  mulheres2: 1361, precisamos: 1378, avancar2: 1398, politicas: 1434, publicas: 1451,
  unidas: 1471, conseguiremos: 1492, vencer: 1511, essa: 1528, batalha: 1540, fim: 1552,
} as const;

// Batidas (frames GLOBAIS). Cada batida entra em crossfade de 10 frames sobre
// a anterior; as trocas caem nas pausas reais da fala.
export const BEATS = {
  capa: { from: 0, to: g(8) },
  lei: { from: g(0), to: g(160) },
  violencia: { from: g(152), to: g(250) },
  avancar: { from: g(244), to: g(318) },
  vereadora: { from: g(312), to: g(560) },
  escolas: { from: g(554), to: g(733) },
  mulher: { from: g(727), to: g(868) },
  patrulha: { from: g(862), to: g(1063) },
  mecanismo: { from: g(1057), to: g(1170) },
  fundo: { from: g(1164), to: g(1358) },
  politicas: { from: g(1352), to: g(1466) },
  unidas: { from: g(1460), to: g(1595) },
  selo: { from: g(1585), to: g(1585) + 150 },
} as const;

export const VMULHER_TOTAL_FRAMES = BEATS.selo.to; // ≈ 59,5s

export const VM_ASSETS = {
  narracao: 'narracao-mulheres-ana.mp3',
  anaMaoCutout: 'vm-ana-mao-cutout.png',
  anaMao: 'vm-ana-mao.jpg',
  anaTribuna: 'idosos-ana-camara.jpg',
  janela: 'stock-vm-janela.jpg', // silhueta de mulher na janela
  quarto: 'stock-vm-quarto.jpg', // mulher encolhida no quarto escuro
  choro: 'stock-vm-choro.jpg', // mulher cobrindo o rosto
  alunos: 'stock-edu-alunos.jpg', // alunos em sala (Agosto Lilás nas escolas)
  patrulha: 'combate-patrulha.jpg', // policiais em visita a uma casa
  telefone: 'stock-vm-telefone.jpg', // vítima pedindo ajuda ao telefone
  capacitacao: 'combate-capacitacao.jpg', // turma de mulheres em capacitação
  punhos: 'stock-vm-punhos.jpg', // punhos erguidos
} as const;
