import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, SPRING, countUp, formatPtBrInt, handheldShake } from '../lib/motion';
import { PaperBackground, DustParticles, HalftoneOverlay, TapeStrip, tornEdgeClipPath } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR, FONT } from '../lib/palette';
import type { AnaNovaesAssets } from '../VideoAnaNovaes';

// Cena 3 — O Arquivo Investigativo | frames locais 0–280 (9.3s)
// Transcrição real (forced alignment real, ancorada nas pausas reais do
// áudio — "1.621" é falado entre os frames 153 e 207, 54 frames / 1.8s,
// bem mais devagar que a estimativa anterior de 32 frames):
// "Mas"@5 "essa"@13 "trajetória"@22 "começou"@39 "antes:"@51 "em"@65 "sua"@72
// "estreia"@78 "na"@90 "política,"@95 "Ana"@113 "já"@117 "havia"@126
// "conquistado"@135 "1.621"@153–207 "votos,"@207–212
export const Scene3_Arquivo: React.FC<{ assets: AnaNovaesAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgFadeIn = ci(frame, [0, 20], [0, 1], Easing.out(Easing.quad));
  const landingScale = ci(frame, [0, 25], [1.15, 1], Easing.out(Easing.cubic));
  const shake = handheldShake(frame, 0.5);

  const p1 = spring({ frame, fps, config: SPRING.card, delay: 5 });
  const p2 = spring({ frame, fps, config: SPRING.card, delay: 40 });
  const p3 = spring({ frame, fps, config: SPRING.card, delay: 75 });
  const p4 = spring({ frame, fps, config: SPRING.card, delay: 100 });

  // "estreia" — pequena legenda, sincronizada com a palavra real
  const estreiaOp = ci(frame, [78, 94], [0, 1], Easing.out(Easing.cubic));

  // Fotos saem — abrem espaço enquanto "conquistado" é dito, terminando
  // exatamente quando "1.621" começa a ser falado
  const photosExit = ci(frame, [120, 153], [0, 1], Easing.inOut(Easing.cubic));

  // Número — contagem real, sincronizada com "1.621" (54 frames / 1.8s:
  // "mil, seiscentos e vinte e um")
  const numberOp = ci(frame, [153, 167], [0, 1], Easing.out(Easing.cubic));
  const numberBlur = ci(frame, [153, 171], [10, 0], Easing.out(Easing.cubic));
  const numberValue = countUp(frame, 153, 54, 1621);
  const votosOp = ci(frame, [207, 222], [0, 1], Easing.out(Easing.cubic));
  const votosY = ci(frame, [207, 222], [18, 0], Easing.out(Easing.cubic));

  const exitAll = ci(frame, [252, 278], [0, 1], Easing.in(Easing.exp));

  const photo = (
    file: string | null | undefined,
    label: string,
    springVal: number,
    baseRotate: number,
    fromRotate: number,
    z: number,
    width: number,
    top: number,
    left: number,
    tape?: boolean,
    heightRatio = 1.2
  ) => {
    const scale = interp(springVal, 0, 1, 1.7, 1);
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
        <div
          style={{
            position: 'relative',
            border: '12px solid white',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            borderRadius: 2,
            clipPath: tornEdgeClipPath(z, 'top'),
          }}
        >
          <AssetImage file={file} label={label} tone="light" style={{ width: '100%', height: width * heightRatio }} />
          {tape && <TapeStrip top={-16} left={width / 2 - 60} width={120} rotate={-4} />}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: 1 - exitAll, filter: `blur(${exitAll * 20}px)` }}>
      <AbsoluteFill style={{ opacity: bgFadeIn }}>
        <PaperBackground dark />
        <HalftoneOverlay opacity={0.04} dark />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
          <DustParticles count={18} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ transform: `scale(${landingScale}) ${shake.transform}` }}>
        {photo(assets.arquivo?.[0], 'MATERIAL OFICIAL DE CAMPANHA', p1, -12, -25, -100, 620, 260, 90, true)}
        {photo(assets.arquivo?.[1], 'NOITE DA VITÓRIA — 2020', p2, 8, 20, -50, 640, 420, 220)}
        {photo(assets.arquivo?.[2], 'ANA NA CÂMARA MUNICIPAL', p3, -2, 15, 0, 700, 560, 190)}
        {photo(assets.materiaJornal, 'MATÉRIA — UMUARAMA ILUSTRADO', p4, 3, -18, 60, 660, 230, 210, true, 0.9)}

        <div
          style={{
            position: 'absolute',
            top: 210,
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 40,
            opacity: estreiaOp * (1 - ci(frame, [108, 124], [0, 1])),
          }}
        >
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: 6,
              color: COLOR.accent,
              backgroundColor: 'rgba(13,7,20,0.6)',
              padding: '8px 18px',
              borderRadius: 6,
            }}
          >
            ESTREIA NA POLÍTICA
          </span>
        </div>
      </AbsoluteFill>

      {/* Número — em fundo limpo, sincronizado com a fala real */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 160 }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 168,
              letterSpacing: -3,
              color: COLOR.accent,
              lineHeight: 1,
              opacity: numberOp,
              filter: `blur(${numberBlur}px)`,
            }}
          >
            {formatPtBrInt(numberValue)}
          </div>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 38,
              letterSpacing: -1,
              color: COLOR.textLight,
              marginTop: 12,
              opacity: votosOp,
              transform: `translateY(${votosY}px)`,
            }}
          >
            votos na estreia
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const interp = (v: number, f0: number, f1: number, v0: number, v1: number) => {
  const t = f1 === f0 ? 1 : (v - f0) / (f1 - f0);
  return v0 + (v1 - v0) * t;
};
