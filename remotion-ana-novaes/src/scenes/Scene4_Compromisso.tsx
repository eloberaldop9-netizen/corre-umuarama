import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { CinematicBackground } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { AnimatedText } from '../lib/AnimatedText';
import { COLOR, FONT } from '../lib/palette';
import type { AnaNovaesAssets } from '../VideoAnaNovaes';

// Cena 4 — O Compromisso (A Rua e O Povo) | frames locais 0–175 (5.8s)
// Transcrição real (forced alignment real): "compromisso"@4 "com"@20 "a"@24
// "cidade."@25–41 | (sem lettering: "Essa é a marca de quem"@42–68) |
// "trabalha"@73 "de"@78 "verdade"@81–93 | (sem lettering: "pela sua gente."@93–132)
// Câmera: Crane Up sutil
export const Scene4_Compromisso: React.FC<{ assets: AnaNovaesAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  // Crossfade de entrada lenta — a Cena 3 (número 1.621) segue visível por baixo mais tempo.
  const bgFadeIn = ci(frame, [0, 40], [0, 1], Easing.out(Easing.quad));

  const craneY = ci(frame, [0, 175], [50, -50], Easing.inOut(Easing.cubic));
  const gridScale = ci(frame, [5, 30], [0.94, 1], Easing.out(Easing.cubic));

  const exitText = ci(frame, [150, 172], [0, 1], Easing.in(Easing.exp));
  const exitPhotos = ci(frame, [155, 172], [0, 1], Easing.in(Easing.cubic));

  const photos = [assets.rua?.[0], assets.rua?.[1], assets.rua?.[2]];
  const labels = ['ANA COM A COMUNIDADE', 'ANA EM REUNIÃO COM MORADORES', 'ANA ABRAÇANDO MORADORA'];

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: bgFadeIn }}>
        <CinematicBackground />
      </AbsoluteFill>

      <AbsoluteFill style={{ transform: `translateY(${craneY}px)` }}>
        <div
          style={{
            position: 'absolute',
            top: 220,
            left: 60,
            right: 60,
            bottom: 760,
            display: 'flex',
            gap: 16,
            opacity: bgFadeIn,
            transform: `scale(${gridScale * (1 - exitPhotos * 0.05)})`,
            filter: `blur(${exitPhotos * 46}px) brightness(${1 - exitPhotos})`,
          }}
        >
          {photos.map((p, i) => (
            <div
              key={i}
              style={{ flex: 1, position: 'relative', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden' }}
            >
              <AssetImage
                file={p}
                label={labels[i]}
                style={{ width: '100%', height: '100%', filter: 'grayscale(1) contrast(1.2)' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(${i * 60}deg, ${COLOR.leak}4D, transparent 60%)`,
                  mixBlendMode: 'screen',
                }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 480,
            left: 50,
            right: 50,
            textAlign: 'center',
            transform: `scale(${1 + exitText * 0.08})`,
            filter: `blur(${exitText * 26}px)`,
            opacity: 1 - exitText,
          }}
        >
          <AnimatedText
            text="COMPROMISSO COM A CIDADE"
            wordDelays={[4, 20, 24, 25]}
            exitStart={45}
            style={{ justifyContent: 'center', position: 'absolute', left: 0, right: 0, top: 0 }}
            wordStyle={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 48, letterSpacing: -1, color: COLOR.textLight }}
          />
          <AnimatedText
            text="TRABALHA DE VERDADE"
            wordDelays={[73, 78, 81]}
            style={{ justifyContent: 'center', position: 'absolute', left: 0, right: 0, top: 0 }}
            wordStyle={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 48, letterSpacing: -1, color: COLOR.gold }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
