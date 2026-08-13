import React from 'react';
import { Easing, Img, staticFile } from 'remotion';
import { ci } from '../lib/animation';

interface LogoRevealProps {
  frame: number;
  start: number;
  negative?: boolean; // versão negativa oficial (fundos escuros/vermelhos)
  scale?: number;
  instant?: boolean; // já revelado, sem animação de construção (uso em telas subsequentes)
}

const WORDMARK_ASPECT = 5202 / 1735;
const KICKER_ASPECT = 1657 / 350;

/**
 * Lockup oficial "ACEU / NIPPON FEST" — recortado em altíssima resolução
 * diretamente do manual de marca (PDF), preservando a fonte exata do
 * logotipo (não redistribuída digitalmente). Nunca é redesenhado ou
 * retipografado: a imagem é revelada por máscara + luz, nunca deformada.
 * A versão negativa usa um filtro CSS (invert) sobre o mesmo asset, já que
 * o manual não fornece um PNG separado para a variante negativa.
 */
export const LogoReveal: React.FC<LogoRevealProps> = ({ frame, start, negative = false, scale = 1, instant = false }) => {
  const kickerP = instant ? 1 : ci(frame, [start, start + 20], [0, 1], Easing.out(Easing.cubic));
  const kickerY = instant ? 0 : ci(frame, [start, start + 20], [24, 0], Easing.out(Easing.cubic));

  const maskStart = start + 14;
  const maskDur = 34;
  const maskP = instant ? 100 : ci(frame, [maskStart, maskStart + maskDur], [0, 100], Easing.out(Easing.cubic));
  const sweepX = instant ? -100 : ci(frame, [maskStart, maskStart + maskDur + 6], [-20, 120], Easing.out(Easing.cubic));
  const wordmarkOpacity = instant ? 1 : ci(frame, [maskStart, maskStart + 6], [0, 1]);

  const wordmarkWidth = 620 * scale;
  const kickerWidth = wordmarkWidth * 0.32;

  // A versão negativa não tem asset próprio no manual — aplicamos um
  // invert+hue-rotate calibrado para transformar preto/off-white em
  // off-white/preto mantendo o vermelho da marca intacto.
  const negativeFilter = negative ? 'invert(1) hue-rotate(180deg)' : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          width: kickerWidth,
          opacity: kickerP,
          transform: `translateY(${kickerY}px)`,
          marginBottom: 10 * scale,
          filter: negativeFilter,
        }}
      >
        <Img
          src={staticFile('logos/aceu-kicker.png')}
          style={{ width: '100%', height: kickerWidth / KICKER_ASPECT, objectFit: 'contain', display: 'block' }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          width: wordmarkWidth,
          clipPath: `inset(0 ${100 - maskP}% 0 0)`,
        }}
      >
        <Img
          src={staticFile('logos/nippon-fest-wordmark.png')}
          style={{
            width: '100%',
            height: wordmarkWidth / WORDMARK_ASPECT,
            objectFit: 'contain',
            display: 'block',
            opacity: wordmarkOpacity,
            filter: negativeFilter,
          }}
        />
        {sweepX > -20 && sweepX < 120 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(100deg, transparent ${sweepX - 18}%, rgba(255,255,255,0.55) ${sweepX}%, transparent ${sweepX + 18}%)`,
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </div>
    </div>
  );
};
