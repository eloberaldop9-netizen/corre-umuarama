import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { CinematicBackground } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { AnimatedText } from '../lib/AnimatedText';
import { COLOR, FONT } from '../lib/palette';
import type { AnaNovaesAssets } from '../VideoAnaNovaes';

// Cena 4 — O Compromisso (A Rua e O Povo) | frames locais 0–127 (4.2s)
// Câmera: Crane Up — y: -400 → +200 em [0,127], Easing.inOut(cubic)
export const Scene4_Compromisso: React.FC<{ assets: AnaNovaesAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  const craneY = ci(frame, [0, 127], [90, -90], Easing.inOut(Easing.cubic));

  const gridScale = ci(frame, [5, 30], [0.9, 1], Easing.out(Easing.cubic));

  // Saída — Burn / Derrete (105–127)
  const exitText = ci(frame, [105, 127], [0, 1], Easing.in(Easing.exp));
  const exitPhotos = ci(frame, [110, 127], [0, 1], Easing.in(Easing.cubic));
  const exitLeaks = ci(frame, [115, 127], [0, 1]);

  const photos = [assets.rua?.[0], assets.rua?.[1], assets.rua?.[2]];
  const labels = ['FOTO — ANA NA RUA', 'FOTO — COM A COMUNIDADE', 'FOTO — AÇÃO REAL'];

  return (
    <AbsoluteFill>
      <CinematicBackground />

      <AbsoluteFill style={{ transform: `translateY(${craneY}px)`, opacity: 1 - exitLeaks * 0 }}>
        <div
          style={{
            position: 'absolute',
            top: 220,
            left: 60,
            right: 60,
            bottom: 620,
            display: 'flex',
            gap: 16,
            transform: `scale(${gridScale * (1 - exitPhotos * 0.05)})`,
            filter: `blur(${exitPhotos * 50}px) brightness(${1 - exitPhotos})`,
          }}
        >
          {photos.map((p, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.15)',
                overflow: 'hidden',
              }}
            >
              <AssetImage
                file={p}
                label={labels[i]}
                style={{
                  width: '100%',
                  height: '100%',
                  filter: 'grayscale(1) contrast(1.25)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(${i * 60}deg, ${COLOR.leak}55, transparent 60%)`,
                  mixBlendMode: 'screen',
                }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 260,
            left: 60,
            right: 60,
            textAlign: 'center',
            transform: `scale(${1 + exitText * 0.1})`,
            filter: `blur(${exitText * 30}px)`,
            opacity: 1 - exitText,
          }}
        >
          <AnimatedText
            text="COMPROMISSO COM A CIDADE"
            delay={20}
            stagger={4}
            wordDur={22}
            style={{ justifyContent: 'center' }}
            wordStyle={{ fontFamily: FONT.sans, fontWeight: 300, fontSize: 42, color: COLOR.textLight, letterSpacing: 2 }}
          />
          <AnimatedText
            text="TRABALHA DE VERDADE"
            delay={32}
            stagger={4}
            wordDur={22}
            style={{ justifyContent: 'center', marginTop: 8 }}
            wordStyle={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 42, color: COLOR.gold, letterSpacing: 2 }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
