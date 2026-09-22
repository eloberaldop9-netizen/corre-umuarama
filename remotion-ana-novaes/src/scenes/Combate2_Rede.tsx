import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, handheldShake, SPRING } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { AnimatedText } from '../lib/AnimatedText';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_COMBATE } from '../lib/palette-combate';
import { FONT } from '../lib/palette';
import type { CombateAssets } from '../VideoAnaNovaisCombate';

// Cena 2 — A Rede de Proteção (Mesa de Investigação) | frames locais 0–250 (8.3s)
// Transcrição real: "Como"@7 "deputada"@13 "federal,"@25 "pretende"@48 "defender"@61
// "mais"@72 "recursos"@83 "atendimento"@100 "especializado"@121 "acolhimento"@150
// "seguro,"@187 "Patrulhas"@202 "Maria"@223 "da"@233 "Penha"@239 (fala termina ~241)
const CARD_SPRING = { damping: 12, mass: 1 };

export const Combate2_Rede: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = ci(frame, [0, 15], [0, 1], Easing.out(Easing.quad));
  const shake = handheldShake(frame, 0.6);

  const tapeRecursosOp = ci(frame, [78, 95], [0, 1], Easing.out(Easing.cubic));
  const cardAcolhimento = spring({ frame, fps, config: CARD_SPRING, delay: 150 });
  const cardPatrulha = spring({ frame, fps, config: CARD_SPRING, delay: 202 });

  // Saída (225–250) — WIPE DIAGONAL: tarja roxa varre a mesa, cards voam pra esquerda
  const wipeP = ci(frame, [225, 250], [0, 1], Easing.in(Easing.exp));
  const wipeX = interp(wipeP, -1400, 1400);
  const exitP = ci(frame, [222, 250], [0, 1], Easing.in(Easing.exp));

  const card = (
    file: string | null | undefined,
    label: string,
    tapeText: string,
    springVal: number,
    baseRotate: number,
    left: number,
    top: number
  ) => {
    const scale = interp(springVal, 2.2, 1);
    const rotate = interp(springVal, baseRotate * 4, baseRotate);
    const op = ci(springVal, [0, 0.15], [0, 1]);
    const blur = ci(springVal, [0, 1], [10, 0]);
    const exitX = exitP * 1500;
    const exitRotate = exitP * 30;
    return (
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: 480,
          height: 480,
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
            boxShadow: `0 ${30 + op * 30}px 70px rgba(0,0,0,0.55)`,
          }}
        >
          <AssetImage file={file} label={label} tone="light" style={{ width: '100%', height: '100%' }} />
          <div
            style={{
              position: 'absolute',
              top: -26,
              left: '50%',
              transform: `translateX(-50%) rotate(${baseRotate > 0 ? -4 : 4}deg)`,
              backgroundColor: 'rgba(252,227,0,0.92)',
              padding: '10px 24px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            }}
          >
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 900,
                fontSize: 30,
                letterSpacing: 1,
                color: COLOR_COMBATE.textDark,
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
    <AbsoluteFill style={{ opacity: bgOp }}>
      <AbsoluteFill style={{ backgroundColor: '#3A1254' }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(115deg, rgba(0,0,0,0.06) 0px, transparent 2px, transparent 6px),
            repeating-linear-gradient(25deg, rgba(0,0,0,0.045) 0px, transparent 3px, transparent 9px)`,
          mixBlendMode: 'multiply',
          opacity: 0.5,
        }}
      />
      <NoiseOverlay opacity={0.06} />

      <AbsoluteFill style={{ transform: shake.transform }}>
        <div style={{ position: 'absolute', top: 190, left: 40, right: 40, textAlign: 'center' }}>
          <AnimatedText
            text="Como deputada federal,"
            wordDelays={[7, 13, 25]}
            style={{ justifyContent: 'center' }}
            wordStyle={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 52, letterSpacing: -0.5, color: COLOR_COMBATE.textLight }}
          />
          <AnimatedText
            text="pretende defender"
            wordDelays={[48, 61]}
            style={{ justifyContent: 'center', marginTop: 8 }}
            wordStyle={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 52, letterSpacing: -0.5, color: COLOR_COMBATE.textLight }}
          />
        </div>

        {/* Tarja "MAIS RECURSOS" — bate quando ela diz "recursos" */}
        <div style={{ position: 'absolute', top: 400, left: 0, right: 0, textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: COLOR_COMBATE.yellow,
              padding: '14px 40px',
              opacity: tapeRecursosOp,
              transform: `scaleX(${ci(frame, [78, 92], [0, 1], Easing.out(Easing.cubic))})`,
              boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
            }}
          >
            <span style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 44, letterSpacing: -1, color: COLOR_COMBATE.textDark }}>
              MAIS RECURSOS
            </span>
          </div>
        </div>

        {card(assets.fotoAcolhimento, 'ACOLHIMENTO SEGURO', 'ACOLHIMENTO', cardAcolhimento, -5, 70, 700)}
        {card(assets.fotoPatrulha, 'PATRULHA MARIA DA PENHA', 'PATRULHA', cardPatrulha, 6, 530, 1160)}
      </AbsoluteFill>

      {/* Tarja roxa diagonal — transição pra Cena 3 */}
      <AbsoluteFill
        style={{
          opacity: wipeP > 0 ? 1 : 0,
          transform: `translateX(${wipeX}px) skewX(-20deg)`,
          backgroundColor: COLOR_COMBATE.brandCore,
        }}
      />
    </AbsoluteFill>
  );
};

const interp = (v: number, from: number, to: number) => from + (to - from) * v;
