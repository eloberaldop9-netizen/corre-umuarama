import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, SPRING, handheldShake } from '../lib/motion';
import { PaperBackground, DustParticles } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { AnimatedText } from '../lib/AnimatedText';
import { COLOR, FONT } from '../lib/palette';
import type { AnaNovaesAssets } from '../VideoAnaNovaes';

// Cena 3 — O Arquivo Investigativo | frames locais 0–157 (5.2s)
// Câmera: Handheld contínuo + Z-Dive de aterrissagem (z: 500 → 0 em [0,25])
export const Scene3_Arquivo: React.FC<{ assets: AnaNovaesAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const landingScale = ci(frame, [0, 25], [1.35, 1], Easing.out(Easing.cubic));
  const shake = handheldShake(frame, 1);

  // Entradas das 3 provas
  const p1 = spring({ frame, fps, config: SPRING.card, delay: 8 });
  const p2 = spring({ frame, fps, config: SPRING.card, delay: 16 });
  const p3 = spring({ frame, fps, config: SPRING.card, delay: 24 });

  const circleP = ci(frame, [40, 66], [0, 1], Easing.out(Easing.cubic));
  const numSp = spring({ frame, fps, config: SPRING.text, delay: 50 });
  const numScale = ci(numSp, [0, 1], [0.7, 1]);
  const numOp = ci(frame, [50, 62], [0, 1]);

  const circleFlicker = 0.85 + Math.sin(frame * 0.4) * 0.15;

  // Saída — FLIP 3D CORTINA (135–157)
  const exitText = ci(frame, [135, 157], [0, 1], Easing.in(Easing.exp));
  const exitStack = ci(frame, [138, 157], [0, 1], Easing.in(Easing.exp));
  const flashOp = ci(frame, [154, 157], [0, 1]);

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
    const scale = interp(springVal, 0, 1, 3, 1);
    const rotate = interp(springVal, 0, 1, fromRotate, baseRotate);
    const op = interp(springVal, 0, 1, 0, 1);
    const blur = ci(frame, [0, 20], [20, 0]);
    return (
      <div
        style={{
          position: 'absolute',
          top,
          left,
          width,
          zIndex: 10 + z,
          opacity: op * (1 - exitStack),
          transform: `rotateZ(${rotate}deg) scale(${scale}) rotateX(${exitStack * 90}deg) translateY(${exitStack * 1200}px)`,
          filter: `blur(${blur + exitStack * 40}px)`,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            border: '12px solid white',
            boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
            borderRadius: 4,
          }}
        >
          <AssetImage file={file} label={label} tone="light" style={{ width: '100%', height: width * 1.2 }} />
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <PaperBackground dark />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
        <DustParticles count={18} />
      </div>

      <AbsoluteFill
        style={{
          transform: `scale(${landingScale}) ${shake.transform}`,
        }}
      >
        {photo(assets.arquivo?.[0], 'FOTO DE ARQUIVO 1', p1, -12, -25, -100, 620, 260, 90)}
        {photo(assets.arquivo?.[1], 'PRINT DE NOTÍCIA 2', p2, 8, 20, -50, 640, 420, 220)}
        {photo(assets.arquivo?.[2], 'FOTO DE ARQUIVO 3 (TOPO)', p3, -2, 15, 0, 700, 560, 190)}

        {/* Círculo de caneta vermelha, desenhando sobre a foto do topo */}
        <svg
          width={340}
          height={340}
          viewBox="0 0 340 340"
          style={{
            position: 'absolute',
            top: 660,
            left: 360,
            zIndex: 30,
            opacity: (1 - exitText) * circleFlicker,
            filter: `blur(${exitText * 30}px)`,
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

        <div
          style={{
            position: 'absolute',
            top: 900,
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 35,
            opacity: numOp * (1 - exitText),
            transform: `scale(${numScale * (1 - exitText * 0.3)}) translateZ(0) translateY(${-exitText * 200}px)`,
            filter: `blur(${exitText * 30}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT.marker,
              fontWeight: 400,
              fontSize: 180,
              color: COLOR.accent,
              lineHeight: 1,
            }}
          >
            1.621
          </div>
          <AnimatedText
            text="VOTOS NA ESTREIA"
            delay={55}
            stagger={3}
            wordDur={18}
            style={{ justifyContent: 'center', marginTop: 10 }}
            wordStyle={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 32,
              color: COLOR.textLight,
              letterSpacing: 1,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Flash de câmera fotográfica ao final — transição para a Cena 4 */}
      <AbsoluteFill style={{ backgroundColor: '#FFFFFF', opacity: flashOp }} />
    </AbsoluteFill>
  );
};

const interp = (v: number, f0: number, f1: number, v0: number, v1: number) => {
  const t = f1 === f0 ? 1 : (v - f0) / (f1 - f0);
  return v0 + (v1 - v0) * t;
};
