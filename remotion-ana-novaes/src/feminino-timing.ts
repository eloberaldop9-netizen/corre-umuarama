// Vídeo 07 — "Ana Novais — Fomento ao Empreendedorismo Feminino".
// Transcrição (whisper-small via sherpa-onnx) bate com o roteiro. Tempos por
// alinhamento forçado (aeneas + espeak-ng, por) sobre narracao-feminino.mp3
// (25,03s), conferidos contra as pausas reais do silencedetect — palavras
// logo após pausa ancoradas no fim do silêncio. Frames globais (30fps).
//
// "Ana Novais quer ampliar as oportunidades para mulheres que sonham em abrir
// ou fazer crescer o próprio negócio! Como deputada federal, pretende defender
// o fortalecimento de programas de empreendedorismo feminino, com capacitação
// gratuita em gestão, marketing e vendas, incentivo à formalização e
// orientação jurídica e contábil! A proposta também busca ampliar o acesso ao
// crédito, às ferramentas digitais e às oportunidades de participação em
// feiras, novos mercados e compras públicas!"
export const WORD = {
  ana: 6,
  ampliar: 37,
  oportunidades: 48,
  mulheres: 67,
  sonham: 84,
  abrir: 98,
  crescer: 124,
  proprio: 138,
  negocio: 148,
  como: 165,
  deputada: 172,
  pretende: 198,
  defender: 209,
  fortalecimento: 222,
  programas: 246,
  empreendedorismo: 268,
  feminino: 286,
  capacitacao: 313,
  gratuita: 331,
  gestao: 345,
  marketing: 365,
  vendas: 383,
  incentivo: 404,
  formalizacao: 428,
  orientacao: 446,
  juridica: 460,
  contabil: 479,
  proposta: 500,
  busca: 516,
  ampliar2: 528,
  acesso: 539,
  credito: 552,
  ferramentas: 571, // "às ferramentas" (após a pausa 564–571)
  digitais: 593,
  oportunidades2: 613, // "e às oportunidades" (após a pausa 606–612)
  participacao: 644,
  feiras: 668,
  novos: 688,
  mercados: 703,
  compras: 719, // "e compras" (após a pausa 714–719)
  publicas: 733,
  fim: 750,
} as const;

// Mapa de cenas guiado pela fala — overlap de 7 frames. Cada saída só começa
// depois que a última palavra da cena foi falada E lida, com easing suave.
// Composições grandes e centralizadas dentro da margem de segurança do Reels.
export const FEMININO_SCENES = {
  c1: { from: 0, duration: 176 }, // "Ana Novais quer ampliar ... o próprio negócio!" (6–160)
  c2: { from: 169, duration: 157 }, // "Como deputada federal ... empreendedorismo feminino," (165–299)
  c3: { from: 315, duration: 201 }, // "com capacitação ... jurídica e contábil!" (309–488)
  c4: { from: 509, duration: 269 }, // "A proposta também busca ... compras públicas!" (494–750)
  c5: { from: 770, duration: 150 }, // selo + fade
} as const;

export const FEMININO_TOTAL_FRAMES = FEMININO_SCENES.c5.from + FEMININO_SCENES.c5.duration; // 920 ≈ 30,7s

export interface FemininoAssets {
  anaCutout: string; // Ana em frente à Câmara, fundo removido (rembg)
  anaTribuna: string; // Ana falando na tribuna (retrato institucional)
  padaria: string; // Adobe Stock — dona de padaria sorrindo
  laptop: string; // Adobe Stock — empreendedora com caixas e computador
  credito: string; // Adobe Stock — maquininha de cartão
  digital: string; // Adobe Stock — app de análise no celular
  feira: string; // Adobe Stock — vendedora numa feira de artesanato
  mercados: string; // Adobe Stock — empreendedora despachando pedidos
  compras: string; // Adobe Stock — aperto de mão / assinatura de contrato
  narracao: string;
}

export const FEMININO_ASSETS: FemininoAssets = {
  anaCutout: 'feminino-ana-cutout.png',
  anaTribuna: 'idosos-ana-camara.jpg',
  padaria: 'stock-fem-padaria.jpg',
  laptop: 'stock-fem-laptop.jpg',
  credito: 'stock-fem-credito.jpg',
  digital: 'stock-fem-digital.jpg',
  feira: 'stock-fem-feira.jpg',
  mercados: 'stock-fem-mercados.jpg',
  compras: 'stock-fem-compras.jpg',
  narracao: 'narracao-feminino.mp3',
};
