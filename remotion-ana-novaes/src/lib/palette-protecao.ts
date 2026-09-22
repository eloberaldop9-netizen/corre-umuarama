// Paleta Técnica — "Ana Novais — O Dossiê da Proteção" (Vídeo 04)
// Estética de colagem documental: o vermelho "true crime" das referências
// foi substituído pelo roxo/lilás da identidade da Ana. Amarelo = marca-texto.
export const COLOR_PROTECAO = {
  voidDeep: '#2D1643', // Roxo profundo — fundos de impacto (Cenas 1, 3, 4)
  brandCore: '#7A4B94', // Roxo médio — lockup e overlays
  lilac: '#B084C1', // Lilás — tiras, nome no lockup
  lilacSoft: '#D9C2E6', // Lilás claro — papel tingido
  paper: '#F4EEF8', // Off-white documental (Cena 2)
  newsprint: '#E9E4DA', // papel jornal envelhecido
  yellow: '#FCE300', // Amarelo — letterings hero, marca-texto
  ink: '#111111', // tinta de impressão
  textLight: '#FFFFFF',
} as const;

export const FONT_PROTECAO = {
  sans: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
  serif: "'Playfair Display', Georgia, serif",
  type: "'Special Elite', 'Courier New', monospace",
} as const;

/** Tracking pedido: -1 em TODA a tipografia deste vídeo. */
export const TRACK = -1;
