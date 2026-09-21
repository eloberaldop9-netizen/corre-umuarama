// Paleta Técnica — Diretriz de Decupagem Ana Novais — A Marca
// Cores extraídas do material oficial de campanha (banner Podemos/roxo+dourado).
export const COLOR = {
  void: '#0D0714', // preto com subtom roxo — autoridade (Cenas 1 e 5)
  paper: '#F4F1EC', // documental (Cenas 2 e 3)
  purple: '#5B2E8C', // roxo primário da marca (selo, stamp, linha do lockup)
  indigo: '#46408F', // roxo-azulado secundário (gradiente do nome no material oficial)
  accent: '#F0C93D', // dourado — substitui o vermelho editorial (números hero, destaques)
  textLight: '#FFFFFF',
  textDark: '#1B1330',
  gold: '#F0C93D',
  cinematic: '#0D0714',
  leak: '#E8B23D', // golden hour, tom mais quente que o accent puro
} as const;

export const FONT = {
  sans: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
} as const;

/** Tracking padrão pedido para títulos: -1px, sofisticado e sem serifa. */
export const TRACKING_TIGHT = -1;
