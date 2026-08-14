export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Master timeline is driven by the real voiceover (39.81s), which was measured
// from the decoded waveform. Each scene's start/duration is anchored to the
// detected speech pause boundaries in that recording, not to arbitrary frame
// counts, so the visuals track the spoken script line by line.
export const DURATION_IN_FRAMES = 1215; // 40.5s, gives ~0.7s tail after the VO ends

export const COLORS = {
  brandRed: '#e6000b',
  black: '#000000',
  surfaceDark: '#111113',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A8',
} as const;

// Absolute start frame of each scene on the master timeline.
export const SCENE_STARTS = {
  scene1Alerta: 0, // "Alerta: sua IPTV parou de funcionar?" (0.16s-2.80s)
  scene2Problema: 90, // "Antes de achar que o problema é a sua internet..." (3.40s-15.44s)
  scene3Teste: 471, // "Então, faça um teste simples..." (16.00s-23.50s)
  scene4Conclusao: 717, // "Se a resposta for sim... não está na sua internet." (24.14s-29.28s)
  scene5V10Net: 888, // "A V10 Net continua entregando..." (29.72s-36.80s)
  scene6Cta: 1113, // "Qualquer dúvida, entre em contato..." (37.22s-39.62s)
} as const;

export const SCENE_DURATIONS = {
  scene1Alerta: 97, // -> ends 87 (overlaps scene2 by 7f)
  scene2Problema: 388, // -> ends 478 (overlaps scene3 by 7f)
  scene3Teste: 253, // -> ends 724 (overlaps scene4 by 7f)
  scene4Conclusao: 178, // -> ends 895 (overlaps scene5 by 7f)
  scene5V10Net: 232, // -> ends 1120 (overlaps scene6 by 7f)
  scene6Cta: 102, // -> ends 1215
} as const;
