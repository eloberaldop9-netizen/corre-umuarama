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

// Paleta das Cenas 1 e 2 — tons de azul-escuro, um só acento azul-céu.
export const NV = {
  abyss: '#060B18', // vinheta / sombra
  navy: '#0A1430', // C1 — fundo
  midnight: '#0D1A3A', // C2 — fundo
  card: '#12234A', // cards (base do gradiente)
  cardHi: '#1A2F5E', // cards (topo do gradiente)
  steel: '#2B4A86', // barras, formas
  track: '#1E3566', // trilhos (rosca)
  line: 'rgba(143,179,255,0.16)', // bordas e filetes
  sky: '#8FB3FF', // acento
  azure: '#4F7CFF', // acento forte (gradientes)
  ice: '#E8EEFA', // texto principal
  muted: '#8C9AB8', // texto secundário
} as const;



export const SPRINGS = {
  text: { damping: 14, mass: 0.8 },
  morph: { damping: 12, mass: 1.5 }, // quadrado → esfera (C1)
  card: { damping: 14, mass: 1 }, // UI cards pesantes (C4)
  badge: { damping: 12, mass: 0.7, stiffness: 120 },
} as const;
