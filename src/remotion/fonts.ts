import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

export const FONT_FAMILY = 'Montserrat';

export const useMontserratFont = () => {
  const [handle] = useState(() => delayRender('Loading Montserrat font'));

  useEffect(() => {
    const font = new FontFace(
      FONT_FAMILY,
      `url(${staticFile('fonts/Montserrat-Variable.woff2')})`,
      {weight: '100 900', style: 'normal'},
    );

    font
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        continueRender(handle);
      })
      .catch((err) => {
        console.log('Error loading font', err);
        continueRender(handle);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
