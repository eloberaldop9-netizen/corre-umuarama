import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay, RadarPulse } from '../lib/Background';
import { AnimatedText } from '../lib/AnimatedText';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_COMBATE } from '../lib/palette-combate';
import { FONT } from '../lib/palette';
import type { CombateAssets } from '../VideoAnaNovaisCombate';

// Cena 3 — O Mecanismo (Botão do Pânico) | frames locais 0–160 (5.3s)
// Transcrição real: "e"@7 "maior"@11 "acesso"@22 "a"@43 "mecanismos"@52 "de"@70
// "proteção,"@71 "como"@88 "o"@97 "botão"@112 "do"@133 "pânico!"@136 (fala termina ~152)
export const Combate3_Panico: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  const bgOp = ci(frame, [0, 15], [0, 1], Easing.out(Easing.quad));
  const zPush = ci(frame, [0, 160], [1.02, 1.18], Easing.inOut(Easing.quad));

  const panicoGlow = 0.25 + Math.max(0, Math.sin(frame * 0.22)) * 0.55;

  // Saída (140–160) — SUCÇÃO: tudo é sugado pro centro (buraco negro)
  const collapseP = ci(frame, [140, 160], [0, 1], Easing.in(Easing.exp));
  const collapseScale = ci(collapseP, [0, 1], [1, 0]);
  const collapseBlur = ci(collapseP, [0, 1], [0, 30]);
  const collapseOp = ci(frame, [140, 160], [1, 0]);

  return (
    <AbsoluteFill style={{ opacity: bgOp * collapseOp, backgroundColor: '#0A0509' }}>
      <AbsoluteFill
        style={{
          transform: `scale(${zPush * collapseScale})`,
          filter: `blur(${collapseBlur}px)`,
        }}
      >
        <AssetImage
          file={assets.fotoPanico}
          label="CELULAR — APP BOTÃO DO PÂNICO"
          style={{ width: '100%', height: '100%' }}
        />
        <div style={{ position: 'absolute', left: '46%', top: '56%', transform: 'translate(-50%,-50%)' }}>
          <RadarPulse frame={frame} loopFrames={40} color={COLOR_COMBATE.alertRed} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: '46%',
            top: '56%',
            width: 90,
            height: 90,
            marginLeft: -45,
            marginTop: -45,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(230,57,70,${panicoGlow}) 0%, transparent 70%)`,
            filter: 'blur(14px)',
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(10,5,9,0.75) 0%, transparent 22%, transparent 68%, rgba(10,5,9,0.85) 100%)',
          transform: `scale(${collapseScale})`,
          opacity: collapseOp,
        }}
      />
      <NoiseOverlay opacity={0.05} />

      <AbsoluteFill style={{ transform: `scale(${collapseScale})`, opacity: collapseOp }}>
        <div style={{ position: 'absolute', top: 150, left: 40, right: 40, textAlign: 'center' }}>
          <AnimatedText
            text="e maior acesso a"
            wordDelays={[7, 11, 22, 43]}
            style={{ justifyContent: 'center' }}
            wordStyle={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 46, letterSpacing: -0.5, color: COLOR_COMBATE.textLight }}
          />
          <AnimatedText
            text="mecanismos de proteção,"
            wordDelays={[52, 70, 71]}
            style={{ justifyContent: 'center', marginTop: 6 }}
            wordStyle={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 46, letterSpacing: -0.5, color: COLOR_COMBATE.textLight }}
          />
        </div>

        <div style={{ position: 'absolute', bottom: 220, left: 0, right: 0, textAlign: 'center' }}>
          <AnimatedText
            text="como o BOTÃO DO PÂNICO"
            wordDelays={[88, 97, 112, 133, 136]}
            style={{ justifyContent: 'center', flexWrap: 'wrap', padding: '0 50px' }}
            wordStyle={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 58,
              letterSpacing: -1,
              color: COLOR_COMBATE.yellow,
              textShadow: `0 6px 26px rgba(0,0,0,0.75), 0 0 ${18 + panicoGlow * 20}px rgba(230,57,70,0.5)`,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
