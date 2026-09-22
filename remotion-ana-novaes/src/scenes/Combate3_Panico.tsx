import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay, RadarPulse } from '../lib/Background';
import { AnimatedText } from '../lib/AnimatedText';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_COMBATE } from '../lib/palette-combate';
import { FONT } from '../lib/palette';
import type { CombateAssets } from '../VideoAnaNovaisCombate';

// Cena 3 — O Mecanismo (Botão do Pânico) | frames locais 0–79 (2.6s)
// VERBO v5.0. Transcrição real (offset from=432): "como"@14 "o"@23
// "botão"@38 "do"@59 "pânico!"@62 (fala termina ~78). Z-Push extremo
// contínuo, sonar em loop, glow do botão respirando — nunca estático.
export const Combate3_Panico: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  const bgOp = ci(frame, [0, 10], [0, 1], Easing.out(Easing.quad));
  const zPush = ci(frame, [0, 79], [1, 1.25], Easing.inOut(Easing.cubic));
  const uiBlur = ci(frame, [0, 14], [20, 4], Easing.out(Easing.cubic));

  const buttonScale = ci(frame, [10, 32], [0, 1], Easing.out(Easing.cubic));

  // Glow respirando — contínuo, acelerado (coração acelerado)
  const buttonGlow = 12 + Math.max(0, Math.sin(frame * 0.35)) * 28;

  // Saída (62–79) — SUCÇÃO: tudo colapsa pro centro
  const collapseP = ci(frame, [62, 79], [0, 1], Easing.in(Easing.exp));
  const textCollapse = ci(frame, [62, 76], [0, 1], Easing.in(Easing.exp));
  const buttonCollapse = ci(frame, [65, 79], [0, 1], Easing.in(Easing.exp));
  const uiCollapse = ci(frame, [69, 79], [0, 1], Easing.in(Easing.exp));

  return (
    <AbsoluteFill style={{ opacity: bgOp, backgroundColor: '#0A0A0C' }}>
      <AbsoluteFill
        style={{
          transform: `scale(${zPush * (1 - uiCollapse * 0.5)})`,
          filter: `blur(${uiBlur}px) brightness(0.55)`,
          opacity: 1 - uiCollapse,
        }}
      >
        <AssetImage
          file={assets.fotoPanico}
          label="CELULAR — APP BOTÃO DO PÂNICO"
          style={{ width: '100%', height: '100%' }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(10,10,12,0.7) 0%, transparent 25%, transparent 65%, rgba(10,10,12,0.9) 100%)',
        }}
      />
      <NoiseOverlay opacity={0.05} />

      {/* Botão vermelho — coração pulsante da cena, sonar em loop contínuo */}
      <div
        style={{
          position: 'absolute',
          left: '46%',
          top: '56%',
          transform: `translate(-50%,-50%) scale(${buttonScale * (1 - buttonCollapse)})`,
          opacity: 1 - buttonCollapse,
          filter: `blur(${buttonCollapse * 40}px)`,
        }}
      >
        <RadarPulse frame={frame} loopFrames={35} color={COLOR_COMBATE.alertRed} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 90,
            height: 90,
            marginLeft: -45,
            marginTop: -45,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(230,57,70,0.95) 0%, transparent 70%)`,
            boxShadow: `0 0 ${buttonGlow}px rgba(230,57,70,0.9)`,
            filter: 'blur(10px)',
          }}
        />
      </div>

      <AbsoluteFill
        style={{
          transform: `scale(${1 - textCollapse * 0.9}) rotateZ(${textCollapse * -12}deg)`,
          filter: `blur(${textCollapse * 30}px)`,
          opacity: 1 - textCollapse,
        }}
      >
        <div style={{ position: 'absolute', bottom: 260, left: 0, right: 0, textAlign: 'center' }}>
          <AnimatedText
            text="O BOTÃO DO PÂNICO!"
            wordDelays={[23, 38, 59, 62]}
            style={{ justifyContent: 'center', flexWrap: 'wrap', padding: '0 80px' }}
            wordStyle={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 60,
              letterSpacing: -2,
              color: COLOR_COMBATE.yellow,
              textShadow: `0 6px 26px rgba(0,0,0,0.8), 0 0 ${18 + Math.max(0, Math.sin(frame * 0.3)) * 20}px rgba(230,57,70,0.55)`,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
