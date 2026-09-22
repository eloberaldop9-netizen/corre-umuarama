import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../lib/motion';
import { Cutout, Dust, Grain, HalftoneDots, NewsprintTexture, Tape, tornPolygon } from '../lib/collage';
import { KineticCaption } from '../lib/KineticCaption';
import { COLOR_PROTECAO as C, FONT_PROTECAO as F, TRACK } from '../lib/palette-protecao';
import { CAPTION_PAGES, PROTECAO_SCENES, wf } from '../protecao-timing';
import type { ProtecaoAssets } from '../VideoAnaNovaisProtecao';

// Cena 1 — A Manchete Investigativa | frames locais 0–188
// "Ana Novais quer fortalecer o combate à violência contra crianças e adolescentes!"
// Letterings hero cravados na fala: FORTALECER (serifa) → COMBATE (gigante,
// atrás da Ana) → carimbo VIOLÊNCIA → recortes CRIANÇAS / ADOLESCENTES.
// Saída: Z-DIVE RASGA — retrato rasga pra esquerda, COMBATE engole a câmera.
const S = PROTECAO_SCENES.c1;
const L = (i: number) => wf(i) - S.from;
const EXIT = 166;

export const Protecao1_Manchete: React.FC<{ assets: ProtecaoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Câmera — Dolly In dramático
  const dolly = ci(frame, [0, S.duration], [1, 1.09], Easing.out(Easing.cubic));
  const phase = Math.sin(frame * 0.6) * 2.5; // "fervo" da retícula

  // Retrato
  const pOp = ci(frame, [0, 18], [0, 1]);
  const pBl = ci(frame, [0, 22], [20, 0], Easing.out(Easing.cubic));
  const pSc = ci(frame, [0, 22], [1.1, 1], Easing.out(Easing.cubic));

  // FORTALECER (serifa itálica)
  const fortSp = spring({ frame, fps, config: { damping: 14, mass: 0.8 }, delay: L(3) });
  // COMBATE — soco pesado
  const combSp = spring({ frame, fps, config: { damping: 10, mass: 1.5 }, delay: L(5) });
  const combPar = Math.sin(frame * 0.05) * 5;
  // Carimbo VIOLÊNCIA
  const stampSp = spring({ frame, fps, config: { damping: 9, mass: 1, stiffness: 160 }, delay: L(7) });
  // Recortes
  const kidsSp = spring({ frame, fps, config: { damping: 12, mass: 1.1 }, delay: L(9) });
  const teenSp = spring({ frame, fps, config: { damping: 12, mass: 1.1 }, delay: L(11) });

  // Saída
  const xp = ci(frame, [EXIT + 2, S.duration], [0, 1], Easing.in(Easing.exp));
  const portraitExit = `skewX(${-25 * xp}deg) translateX(${-1300 * xp}px)`;
  const exitBlur = 22 * xp;
  const exitOp = ci(xp, [0.3, 1], [1, 0]);
  const combExitScale = ci(frame, [EXIT + 6, S.duration], [1, 30], Easing.in(Easing.exp));
  const yellowCover = ci(frame, [EXIT + 12, S.duration], [0, 1], Easing.in(Easing.cubic));

  const slap = (sp: number, rot: number) => ({
    opacity: ci(sp, [0, 0.12], [0, 1]),
    transform: `scale(${ci(sp, [0, 1], [2.6, 1])}) rotate(${ci(sp, [0, 1], [rot * 3, rot])}deg)`,
    filter: `blur(${ci(sp, [0, 1], [16, 0])}px)`,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.voidDeep, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 38%, rgba(122,75,148,0.55), transparent 70%)` }} />
      <HalftoneDots size={9} opacity={0.18} color="rgba(0,0,0,1)" phase={phase} />
      <Grain opacity={0.16} />
      <Dust frame={frame} />

      <AbsoluteFill style={{ transform: `scale(${dolly})` }}>
        {/* Papéis rasgados de fundo (colagem) */}
        <div
          style={{
            position: 'absolute', top: 140, left: -60, width: 620, height: 260,
            background: C.brandCore, clipPath: tornPolygon(11, 6), transform: 'rotate(-7deg)', opacity: pOp * 0.9,
          }}
        >
          <NewsprintTexture opacity={0.2} />
        </div>
        <div
          style={{
            position: 'absolute', top: 1180, right: -80, width: 560, height: 300,
            background: C.newsprint, clipPath: tornPolygon(23, 5), transform: 'rotate(6deg)', opacity: pOp * 0.85,
          }}
        >
          <NewsprintTexture opacity={0.45} />
        </div>

        {/* COMBATE — hero gigante, ATRÁS da Ana */}
        <div
          style={{
            position: 'absolute', top: 360, left: -40, right: -40, textAlign: 'center',
            transform: `translateX(${combPar}px) rotate(-4deg)`,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily: F.sans, fontWeight: 900, fontSize: 188, letterSpacing: -6, lineHeight: 1,
              color: C.yellow,
              opacity: ci(frame, [L(5), L(5) + 6], [0, 1]) * ci(frame, [S.duration - 6, S.duration], [1, 0]),
              transform: `scale(${ci(combSp, [0, 1], [3, 1]) * combExitScale})`,
              filter: `blur(${ci(frame, [L(5), L(5) + 14], [30, 0])}px)`,
              textShadow: '0 16px 0 rgba(0,0,0,0.35)',
            }}
          >
            COMBATE
          </span>
        </div>

        {/* Retrato halftone da Ana */}
        <div
          style={{
            position: 'absolute', top: 560, left: 190, width: 700, height: 960,
            opacity: pOp * exitOp,
            transform: `scale(${pSc}) ${portraitExit}`,
            filter: `blur(${pBl + exitBlur}px)`,
            transformOrigin: 'bottom center',
          }}
        >
          <Cutout
            file={assets.retratoAna}
            width={700}
            height={960}
            seed={4}
            border={16}
            mono
            tint="rgba(176,132,193,0.55)"
            objectPosition="50% 12%"
          >
            <HalftoneDots size={6} opacity={0.3} phase={phase} />
          </Cutout>
        </div>

        {/* FORTALECER — serifa editorial sobre o retrato */}
        <div style={{ position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block', fontFamily: F.serif, fontStyle: 'italic', fontWeight: 900, fontSize: 104,
              letterSpacing: TRACK, color: C.textLight,
              opacity: ci(frame, [L(3), L(3) + 6], [0, 1]) * exitOp,
              transform: `translateY(${ci(fortSp, [0, 1], [40, 0])}px) translateX(${-900 * xp}px)`,
              filter: `blur(${ci(frame, [L(3), L(3) + 10], [12, 0]) + exitBlur}px)`,
              textShadow: '0 8px 30px rgba(0,0,0,0.6)',
            }}
          >
            fortalecer
          </span>
        </div>

        {/* Carimbo VIOLÊNCIA */}
        <div
          style={{
            position: 'absolute', top: 640, right: 90,
            opacity: ci(frame, [L(7), L(7) + 3], [0, 1]) * exitOp,
            transform: `rotate(9deg) scale(${ci(stampSp, [0, 1], [2.2, 1])}) translateX(${900 * xp}px)`,
            filter: `blur(${exitBlur}px)`,
          }}
        >
          <div
            style={{
              border: `7px solid ${C.yellow}`, padding: '10px 22px 6px',
              fontFamily: F.type, fontSize: 62, letterSpacing: TRACK, color: C.yellow,
              background: 'rgba(45,22,67,0.6)',
              maskImage: 'repeating-linear-gradient(35deg, #000 0 14px, rgba(0,0,0,0.75) 14px 17px)',
            }}
          >
            VIOLÊNCIA
          </div>
        </div>

        {/* Recorte CRIANÇAS */}
        <div style={{ position: 'absolute', top: 1010, left: 30, width: 270, height: 540, ...slap(kidsSp, -6) }}>
          <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-1100 * xp}px)`, filter: `blur(${exitBlur}px)`, opacity: exitOp }}>
            <Cutout file={assets.fotoCriancas} width={270} height={540} seed={31} border={12} objectPosition="50% 30%" />
            <Tape width={330} height={78} rotate={-8} style={{ top: 440, left: -30 }}>
              <span style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 50, letterSpacing: TRACK, color: C.voidDeep }}>CRIANÇAS</span>
            </Tape>
          </div>
        </div>

        {/* Recorte ADOLESCENTES */}
        <div style={{ position: 'absolute', top: 1060, right: 30, width: 300, height: 400, ...slap(teenSp, 5) }}>
          <div style={{ position: 'absolute', inset: 0, transform: `translateX(${1100 * xp}px)`, filter: `blur(${exitBlur}px)`, opacity: exitOp }}>
            <Cutout file={assets.fotoCaminho} width={300} height={400} seed={47} border={12} />
            <Tape width={400} height={78} rotate={6} color="rgba(217,194,230,0.95)" style={{ top: 330, left: -120 }}>
              <span style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 46, letterSpacing: TRACK, color: C.voidDeep }}>ADOLESCENTES</span>
            </Tape>
          </div>
        </div>
      </AbsoluteFill>

      {/* Legenda viva — palavra por palavra */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 72%, rgba(29,12,44,0.92) 90%)' }} />
      <KineticCaption
        pages={CAPTION_PAGES.c1}
        sceneFrom={S.from}
        variant="void"
        exitAt={EXIT}
        top={1600}
        emphasis={{ 3: 'yellow', 5: 'box', 7: 'yellow', 9: 'yellow', 11: 'yellow' }}
      />

      {/* Amarelo cega a tela — entrega pra Cena 2 */}
      <AbsoluteFill style={{ backgroundColor: C.yellow, opacity: yellowCover }} />
    </AbsoluteFill>
  );
};
