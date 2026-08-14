import {staticFile} from 'remotion';

export const FONT_POPPINS = 'Poppins';
export const FONT_MONTSERRAT = 'Montserrat';

export const fontsCss = `
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  src: url('${staticFile('fonts/poppins-600.woff2')}') format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 900;
  src: url('${staticFile('fonts/poppins-900.woff2')}') format('woff2');
}
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  src: url('${staticFile('fonts/montserrat-500.woff2')}') format('woff2');
}
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  src: url('${staticFile('fonts/montserrat-700.woff2')}') format('woff2');
}
`;
