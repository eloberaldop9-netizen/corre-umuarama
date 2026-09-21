import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, SPRING, countUp, formatPtBrInt, handheldShake } from '../lib/motion';
import { PaperBackground, DustParticles } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { AnimatedText } from '../lib/AnimatedText';
import { COLOR, FONT } from '../lib/palette';
import type { AnaNovaesAssets } from '../VideoAnaNovaes';

// Cena 3 — O Arquivo Investigativo | frames locais 0–230 (7.7s)
// Beat 1 (0–165): fotos de arquivo entram, câmera com handheld, círculo marca a prova.
// Beat 2 (168–230): fotos saem — número aparece sozinho, em fundo limpo, com contagem.
export const Scene3_Arquivo: React.FC<{ assets: AnaNovaesAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const landingScale = ci(frame, [0, 25], [1.18, 1], Easing.out(Easing.cubic));
  const shake = handheldShake(frame, 0.55);

  // Entrada suave do fundo — deixa a saída da Cena 2 visível por baixo.
  const bgFadeIn = ci(frame, [0, 20], [0, 1], Easing.out(Easing.quad));

  const p1 = spring({ frame, fps, config: SPRING.card, delay: 20 });
  const p2 = spring({ frame, fps, config: SPRING.card, delay: 65 });
  const p3 = spring({ frame, fps, config: SPRING.card, delay: 110 });

  const circleP = ci(frame, [118, 145], [0, 1], Easing.out(Easing.cubic));
  const circleFlicker = 0.85 + Math.sin(frame * 0.3) * 0.12;

  // Fotos saem de cena — abrem espaço para o número (140–165)
  const photosExit = ci(frame, [140, 165], [0, 1], Easing.in(Easing.exp));

  // Beat 2 — número em fundo limpo
  const numberIn = ci(frame, [168, 184], [0, 1], Easing.out(Easing.cubic));
  const numberValue = countUp(frame, 168, 26, 1621);
  const captionDelays = [
    { text: 'VOTOS', delay: 196 },
    { text: 'NA', delay: 205 },
    { text: 'ESTREIA', delay: 212 },
  ];

  // Saída geral da cena (205–230) — cede lugar à Cena 4
  const exitAll = ci(frame, [205, 230], [0, 1], Easing.in(Easing.exp));

  const photo = (
    file: string | null | undefined,
    label: string,
    springVal: number,
    baseRotate: number,
    fromRotate: number,
    z: number,
    width: number,
    top: number,
    left: number
  ) => {
    const scale = interp(springVal, 0, 1, 1.8, 1);
    const rotate = interp(springVal, 0, 1, fromRotate, baseRotate);
    const op = interp(springVal, 0, 1, 0, 1);
    const blur = ci(frame, [0, 18], [14, 0]);
    const exitY = photosExit * 900;
    const exitBlur = photosExit * 30;
    return (
      <div
        style={{
          position: 'absolute',
          top,
          left,
          width,
          zIndex: 10 + z,
          opacity: op * (1 - photosExit),
          transform: `rotateZ(${rotate}deg) scale(${scale}) translateY(${exitY}px)`,
          filter: `blur(${blur + exitBlur}px)`,
          transformOrigin: 'center center',
        }}
      >
        <div style={{ border: '12px solid white', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', borderRadius: 4 }}>
          <AssetImage file={file} label={label} tone="light" style={{ width: '100%', height: width * 1.2 }} />
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: 1 - exitAll, filter: `blur(${exitAll * 20}px)` }}>
      <AbsoluteFill style={{ opacity: bgFadeIn }}>
        <PaperBackground dark />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
          <DustParticles count={18} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ transform: `scale(${landingScale}) ${shake.transform}` }}>
        {photo(assets.arquivo?.[0], 'MATERIAL OFICIAL DE CAMPANHA', p1, -12, -25, -100, 620, 260, 90)}
        {photo(assets.arquivo?.[1], 'NOITE DA VITÓRIA — 2020', p2, 8, 20, -50, 640, 420, 220)}
        {photo(assets.arquivo?.[2], 'ANA NA CÂMARA MUNICIPAL', p3, -2, 15, 0, 700, 560, 190)}

        <svg
          width={340}
          height={340}
          viewBox="0 0 340 340"
          style={{
            position: 'absolute',
            top: 660,
            left: 360,
            zIndex: 30,
            opacity: (1 - photosExit) * circleFlicker,
            filter: `blur(${photosExit * 24}px)`,
          }}
        >
          <circle
            cx={170}
            cy={170}
            r={150}
            fill="none"
            stroke={COLOR.accent}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 150}
            strokeDashoffset={(1 - circleP) * 2 * Math.PI * 150}
            transform="rotate(-90 170 170)"
          />
        </svg>
      </AbsoluteFill>

      {/* Beat 2 — número isolado, fundo limpo (sem foto) */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 200 }}>
        <div
          style={{
            textAlign: 'center',
            opacity: numberIn,
            transform: `scale(${ci(numberIn, [0, 1], [0.85, 1])})`,
            filter: `blur(${ci(numberIn, [0, 1], [10, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 168,
              letterSpacing: -3,
              color: COLOR.accent,
              lineHeight: 1,
            }}
          >
            {formatPtBrInt(numberValue)}
          </div>
          <AnimatedText
            text="VOTOS NA ESTREIA"
            wordDelays={captionDelays.map((w) => w.delay)}
            style={{ justifyContent: 'center', marginTop: 14 }}
            wordStyle={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: -1,
              color: COLOR.textLight,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const interp = (v: number, f0: number, f1: number, v0: number, v1: number) => {
  const t = f1 === f0 ? 1 : (v - f0) / (f1 - f0);
  return v0 + (v1 - v0) * t;
};
