import {
  inter400,
  inter500,
  inter600,
  montserrat500,
  montserrat600,
  montserrat700,
  montserrat800,
  montserrat900,
} from './fontData';

/**
 * Fontes da marca embutidas como data: URI e injetadas via <style> síncrono
 * — sem fetch, sem delayRender/continueRender, sem depender do servidor
 * estático local (que se mostrou instável sob concorrência no render
 * headless). O navegador faz o parse do @font-face junto com o CSS,
 * disponível já no primeiro frame.
 */
export const FONT_DISPLAY = 'Montserrat';
export const FONT_BODY = 'Inter';

const FACES: { family: string; weight: string; base64: string }[] = [
  { family: FONT_DISPLAY, weight: '500', base64: montserrat500 },
  { family: FONT_DISPLAY, weight: '600', base64: montserrat600 },
  { family: FONT_DISPLAY, weight: '700', base64: montserrat700 },
  { family: FONT_DISPLAY, weight: '800', base64: montserrat800 },
  { family: FONT_DISPLAY, weight: '900', base64: montserrat900 },
  { family: FONT_BODY, weight: '400', base64: inter400 },
  { family: FONT_BODY, weight: '500', base64: inter500 },
  { family: FONT_BODY, weight: '600', base64: inter600 },
];

let injected = false;

export const ensureFontsLoaded = (): void => {
  if (injected || typeof document === 'undefined') return;
  injected = true;

  const css = FACES.map(
    ({ family, weight, base64 }) => `
@font-face {
  font-family: '${family}';
  font-weight: ${weight};
  font-style: normal;
  font-display: block;
  src: url(data:font/ttf;base64,${base64}) format('truetype');
}`
  ).join('\n');

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};
