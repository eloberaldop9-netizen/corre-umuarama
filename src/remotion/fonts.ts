import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';
import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';

const {fontFamily: poppinsFontFamily} = loadPoppins('normal', {
  weights: ['600', '900'],
});

const {fontFamily: montserratFontFamily} = loadMontserrat('normal', {
  weights: ['500', '700', '800'],
});

export const FONT_POPPINS = poppinsFontFamily;
export const FONT_MONTSERRAT = montserratFontFamily;
