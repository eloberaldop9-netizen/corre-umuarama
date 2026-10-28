// Gráficos 2D vs 3D na Comunicação — Paleta Técnica e Springs da decupagem
// (Diretriz VERBO Motion O.S. v5.0). Toda cor e config de física do vídeo sai daqui.

export const G = {
  void: '#0A0A0C', // Cena 1 — tabula rasa
  offWhite: '#F4F4F5', // Cena 2 — tela de software vetorial
  deep: '#050505', // Cena 3 — espaço profundo
  glass: '#111113', // Cena 4 — dark glass
  indigo: '#4F46E5', // accent 2D
  emerald: '#10B981', // accent 3D
  white: '#FFFFFF',
  ink: '#111827',
  black: '#0A0A0C',
} as const;

export const FONT = "'Montserrat', 'Helvetica Neue', Arial, sans-serif";

export const SPRINGS = {
  text: { damping: 14, mass: 0.8 }, // padrão de texto (regra 2)
  impact: { damping: 10, mass: 0.8, stiffness: 120 }, // impacto (regra 2)
  extrude: { damping: 12, mass: 1.2 }, // anéis de extrusão (C1)
  cardThrow: { damping: 10, mass: 1.2, stiffness: 120 }, // cartas jogadas na mesa (C2)
  letters: { damping: 14, mass: 0.6, stiffness: 180 }, // letra a letra rápido (C2)
  emerge: { damping: 14 }, // texto emergindo do abismo (C3)
  panel: { damping: 14, mass: 0.9 }, // placa de vidro (C4)
  cta: { damping: 12, stiffness: 120 }, // CTA pulando na tela (C4)
} as const;
