import React from 'react';
import { Easing, Img, staticFile } from 'remotion';
import { ci } from '../lib/animation';
import { BRAND, FONTS } from '../config/brand';

interface LogoRevealProps {
  frame: number;
  start: number;
  negative?: boolean; // versão negativa oficial (texto branco, para fundos escuros/vermelhos)
  scale?: number;
  instant?: boolean; // já revelado, sem animação de construção (uso em telas subsequentes)
}

/**
 * Reconstrói o lockup oficial "ACEU NIPPON FEST" respeitando as duas
 * versões do manual (cores / negativa). O selo ACEU nunca é redesenhado —
 * é o asset oficial (public/logos/aceu-seal.png), apenas escalado/animado
 * como uma "estampa" que se encaixa no lugar do O de NIPPON.
 */
export const LogoReveal: React.FC<LogoRevealProps> = ({ frame, start, negative = false, scale = 1, instant = false }) => {
  const wordColor = negative ? BRAND.offWhite : BRAND.red;
  const kickerColor = negative ? BRAND.offWhite : BRAND.black;

  const kickerP = instant ? 1 : ci(frame, [start, start + 20], [0, 1], Easing.out(Easing.cubic));
  const kickerY = instant ? 0 : ci(frame, [start, start + 20], [24, 0], Easing.out(Easing.cubic));

  const maskStart = start + 14;
  const maskDur = 30;
  const maskP = instant ? 100 : ci(frame, [maskStart, maskStart + maskDur], [0, 100], Easing.out(Easing.cubic));
  const sweepX = instant ? -100 : ci(frame, [maskStart, maskStart + maskDur + 6], [-20, 120], Easing.out(Easing.cubic));

  const sealDelay = maskStart + 20;
  const sealScale = instant ? 1 : ci(frame, [sealDelay, sealDelay + 22], [0.4, 1], Easing.out(Easing.back(1.6)));
  const sealRot = instant ? 0 : ci(frame, [sealDelay, sealDelay + 22], [-40, 0], Easing.out(Easing.back(1.4)));
  const sealOpacity = instant ? 1 : ci(frame, [sealDelay, sealDelay + 10], [0, 1]);

  const festStart = maskStart + 16;
  const festP = instant ? 100 : ci(frame, [festStart, festStart + maskDur], [0, 100], Easing.out(Easing.cubic));

  const wordStyle: React.CSSProperties = {
    fontFamily: FONTS.display,
    fontWeight: 800,
    textTransform: 'uppercase',
    color: wordColor,
    letterSpacing: '-0.01em',
    lineHeight: 0.94,
  };

  const fontSize = 128 * scale;
  const sealSize = fontSize * 1.02;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          fontFamily: FONTS.display,
          fontWeight: 600,
          fontSize: 40 * scale,
          letterSpacing: '0.5em',
          color: kickerColor,
          opacity: kickerP,
          transform: `translateY(${kickerY}px)`,
          marginBottom: 18 * scale,
          marginLeft: '0.5em',
        }}
      >
        ACEU
      </div>

      <div style={{ position: 'relative', clipPath: `inset(0 ${100 - maskP}% 0 0)` }}>
        <div style={{ ...wordStyle, fontSize, display: 'flex', alignItems: 'center' }}>
          <span>NIPP</span>
          <span
            style={{
              display: 'inline-flex',
              width: sealSize,
              height: sealSize,
              margin: `0 ${0.01 * fontSize}px`,
              opacity: sealOpacity,
              transform: `scale(${sealScale}) rotate(${sealRot}deg)`,
            }}
          >
            <Img src={staticFile('logos/aceu-seal.png')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </span>
          <span>N</span>
        </div>
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

      <div style={{ clipPath: `inset(0 ${100 - festP}% 0 0)` }}>
        <div style={{ ...wordStyle, fontSize }}>FEST</div>
      </div>
    </div>
  );
};
