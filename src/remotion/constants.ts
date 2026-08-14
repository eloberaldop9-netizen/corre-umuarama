export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_IN_FRAMES = 360;

export const COLORS = {
  brandRed: '#e6000b',
  black: '#000000',
  surfaceDark: '#111113',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A8',
} as const;

// Absolute start frame of each scene on the master timeline (7f overlap between scenes).
export const SCENE_STARTS = {
  scene1: 0,
  scene2: 83,
  scene3: 163,
  scene4: 253,
} as const;

export const SCENE_DURATIONS = {
  scene1: 90,
  scene2: 87,
  scene3: 97,
  scene4: 107,
} as const;
