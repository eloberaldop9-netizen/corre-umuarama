import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, handheldShake } from '../lib/motion';
import { NoiseOverlay, HalftoneOverlay } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_CAUSA } from '../lib/palette-causa';
import { FONT } from '../lib/palette';
import type { CausaAssets } from '../VideoAnaNovaisCausa';

// Cena 2 — Os 4 Pilares (A Mesa de Trabalho) | frames locais 0–280 (9.3s)
// Transcrição real (forced alignment real): "Como"@3(~181 global) ...
// "diagnóstico"@102 "atendimento"@145 "inclusão"@194 "apoio"@250 (às famílias.@250-254)
const CARD_SPRING = { damping: 12, mass: 1 };

export const Causa2_Pilares: React.FC<{ assets: CausaAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgFadeIn = ci(frame, [15, 45], [0, 1], Easing.out(Easing.quad));
  const shake = handheldShake(frame, 0.55);

  const captionOp = ci(frame, [20, 40], [0, 1], Easing.out(Easing.cubic));
  const captionY = ci(frame, [20, 40], [20, 0], Easing.out(Easing.cubic));

  const p1 = spring({ frame, fps, config: CARD_SPRING, delay: 102 });
  const p2 = spring({ frame, fps, config: CARD_SPRING, delay: 145 });
  const p3 = spring({ frame, fps, config: CARD_SPRING, delay: 194 });
  const p4 = spring({ frame, fps, config: CARD_SPRING, delay: 250 });

  // Saída (264–280) — TARJA VERMELHA + ATROPELAMENTO
  const wipeP = ci(frame, [264, 280], [0, 1], Easing.in(Easing.exp));
  const wipeX = interp(wipeP, -1400, 1400);
  const cardsExitP = ci(frame, [267, 280], [0, 1], Easing.in(Easing.exp));

  const card = (
    file: string | null | undefined,
    label: string,
    tapeText: string,
    tapeColor: string,
    springVal: number,
    baseRotate: number,
    left: number,
    top: number
  ) => {
    const scale = interp(springVal, 2.5, 1);
    const rotate = interp(springVal, baseRotate * 4, baseRotate);
    const op = ci(springVal, [0, 0.15], [0, 1]);
    const blur = ci(springVal, [0, 1], [10, 0]);
    const exitX = cardsExitP * 1500;
    const exitRotate = cardsExitP * 30;
    return (
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: 460,
          height: 460,
          opacity: op,
          transform: `rotateZ(${rotate + exitRotate}deg) scale(${scale}) translateX(${exitX}px)`,
          filter: `blur(${blur}px)`,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            border: '15px solid white',
            boxShadow: `0 ${30 + op * 30}px 70px rgba(0,0,0,0.5)`,
          }}
        >
          <AssetImage file={file} label={label} tone="light" style={{ width: '100%', height: '100%' }} />
          <div
            style={{
              position: 'absolute',
              top: -22,
              left: '50%',
              transform: `translateX(-50%) rotate(${baseRotate > 0 ? -4 : 4}deg)`,
              backgroundColor: 'rgba(242,240,233,0.92)',
              padding: '8px 18px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
            }}
          >
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: 1,
                color: tapeColor,
                whiteSpace: 'nowrap',
              }}
            >
              {tapeText}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: bgFadeIn }}>
      <AbsoluteFill style={{ backgroundColor: COLOR_CAUSA.paper }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(115deg, rgba(0,0,0,0.035) 0px, transparent 2px, transparent 6px),
            repeating-linear-gradient(25deg, rgba(0,0,0,0.025) 0px, transparent 3px, transparent 9px)`,
          mixBlendMode: 'multiply',
          opacity: 0.4,
        }}
      />
      <NoiseOverlay opacity={0.02} />
      <HalftoneOverlay opacity={0.03} />

      <AbsoluteFill style={{ transform: shake.transform }}>
        <div
          style={{
            position: 'absolute',
            top: 150,
            left: 60,
            right: 60,
            textAlign: 'center',
            opacity: captionOp,
            transform: `translateY(${captionY}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 34,
              lineHeight: 1.3,
              letterSpacing: -0.5,
              color: COLOR_CAUSA.textDark,
            }}
          >
            Como deputada federal, pretende trabalhar
            <br />
            para ampliar o acesso a:
          </span>
        </div>

        {card(assets.cardFrontal, 'ANA — DIAGNÓSTICO', 'DIAGNÓSTICO', COLOR_CAUSA.accent, p1, -5, 60, 520)}
        {card(assets.teaMente, 'ATENDIMENTO ESPECIALIZADO', 'ATENDIMENTO', COLOR_CAUSA.tea, p2, 8, 580, 520)}
        {card(assets.teaGlobo, 'INCLUSÃO', 'INCLUSÃO', COLOR_CAUSA.tea, p3, -2, 60, 1020)}
        {card(assets.cardPerfil, 'ANA — APOIO ÀS FAMÍLIAS', 'APOIO FAMÍLIAS', COLOR_CAUSA.accent, p4, 4, 580, 1020)}
      </AbsoluteFill>

      {/* Tarja vermelha diagonal — transição pra Cena 3 */}
      <AbsoluteFill
        style={{
          opacity: wipeP > 0 ? 1 : 0,
          transform: `translateX(${wipeX}px) skewX(-20deg)`,
          backgroundColor: COLOR_CAUSA.accent,
        }}
      />
    </AbsoluteFill>
  );
};

const interp = (v: number, from: number, to: number) => from + (to - from) * v;
