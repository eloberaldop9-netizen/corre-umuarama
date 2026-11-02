// Gráficos 2D e 3D na Comunicação — Paleta Técnica e física do "Pensamento de
// Vídeo" (Padrão VERBO Motion O.S.). Toda cor e config de spring sai daqui.

export const P = {
  paper: '#FAFAFA', // Cena 1 — a prancheta do designer
  blueprint: '#1D4ED8', // Cena 2 — azul ultramarino / cartazes
  void: '#05050A', // Cena 3 — preto abissal
  ice: '#E5E7EB', // Cena 4 — cinza gelo
  neon: '#CCFF00', // accent ácido
  ink: '#111827', // texto flat
  wire: '#38BDF8', // malhas wireframe
  rim: 'rgba(255,255,255,0.85)',
  gray: '#8A8A8E',
  slate: '#4B5563',
  lead: '#1F2125', // chumbo do blockout C3 → C4
} as const;

export const FONT = "'Montserrat', 'Helvetica Neue', Arial, sans-serif";

// Paleta editorial das Cenas 1 e 2 — sóbria, profissional: osso, grafite,
// azul-meia-noite e champanhe como único acento.
export const ED = {
  bone: '#F2EFE9', // C1 — papel quente
  stone: '#DCD6CB', // trilhos, aros, divisórias
  ink: '#141416', // tipografia principal
  graphite: '#2B2B30', // barras, formas
  muted: '#8A8780', // texto secundário
  midnight: '#101A2C', // C2 — fundo
  night: '#0A1220', // C2 — card escuro
  champagne: '#C9A96E', // acento sobre fundo escuro
  bronze: '#8C6A36', // acento sobre fundo claro (contraste)
} as const;

export const SANS = "'Inter', 'Helvetica Neue', Arial, sans-serif";
export const SERIF = "'Playfair Display', Georgia, serif";

export const SPRINGS = {
  text: { damping: 14, mass: 0.8 },
  morph: { damping: 12, mass: 1.5 }, // quadrado → esfera (C1)
  card: { damping: 14, mass: 1 }, // UI cards pesantes (C4)
  badge: { damping: 12, mass: 0.7, stiffness: 120 },
} as const;
