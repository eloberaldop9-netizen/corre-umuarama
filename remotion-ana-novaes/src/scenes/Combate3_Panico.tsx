import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn, outP } from '../lib/editorial';
import { COMBATE_SCENES, WORD } from '../combate-timing';
import type { CombateAssets } from '../combate-timing';

// Cena 3 — O Mecanismo | frames locais 0–160
// Dark UI, macro na mão com o app. Z-push lento e contínuo ancorado no
// botão. Em "botão do pânico" o botão ganha glow e anéis de sonar e o
// lettering acende em amarelo acima dele. Saída: sucção pro centro.
const S = COMBATE_SCENES.c3;
const L = (f: number) => f - S.from;
const EXIT = 136;
// centro do botão vermelho na foto (fração do quadro)
const BX = 0.59;
const BY = 0.45;

export const Combate3_Panico: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const inP = ci(frame, [0, 26], [0, 1], Easing.out(Easing.cubic));
  const push = ci(frame, [0, S.duration], [1.0, 1.15]);
  const sp = outP(frame, EXIT, 24);
  const at = L(WORD.botao);
  const on = ci(frame, [at, at + 20], [0, 1], Easing.out(Easing.cubic));

  const origin = `${BX * 100}% ${BY * 100}%`;
  const suck = { transform: `scale(${1 - sp}) rotate(${-20 * sp}deg)`, filter: `blur(${30 * sp}px)`, opacity: 1 - ci(sp, [0.5, 1], [0, 1]) };

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0612', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transformOrigin: origin, ...suck }}>
        <AbsoluteFill style={{ transform: `scale(${push * 1.12})`, transformOrigin: origin, opacity: inP, filter: `blur(${20 - 16 * inP}px) brightness(0.8)` }}>
          <Img src={staticFile(`assets/${assets.fotoPanico}`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </AbsoluteFill>
        {/* nitidez só no celular: camada sem blur com máscara radial */}
        <AbsoluteFill
          style={{
            transform: `scale(${push * 1.12})`, transformOrigin: origin, opacity: inP,
            maskImage: `radial-gradient(ellipse 26% 22% at ${BX * 100}% ${BY * 100 + 4}%, #000 60%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(ellipse 26% 22% at ${BX * 100}% ${BY * 100 + 4}%, #000 60%, transparent 100%)`,
          }}
        >
          <Img src={staticFile(`assets/${assets.fotoPanico}`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 59% 48%, transparent 25%, rgba(11,6,18,0.85) 75%)' }} />

        {/* Sonar do botão */}
        <div style={{ position: 'absolute', left: `${BX * 100}%`, top: `${BY * 100}%`, opacity: on }}>
          {[0, 1, 2].map((k) => {
            const t = (((frame - at) / 42 + k / 3) % 1 + 1) % 1;
            return (
              <div
                key={k}
                style={{
                  position: 'absolute', width: 220, height: 220, marginLeft: -110, marginTop: -110, borderRadius: '50%',
                  border: `3px solid ${ED.alert}`, transform: `scale(${0.8 + t * 2.2})`, opacity: 0.7 * (1 - t),
                }}
              />
            );
          })}
          <div
            style={{
              position: 'absolute', width: 260, height: 260, marginLeft: -130, marginTop: -130, borderRadius: '50%',
              background: `radial-gradient(circle, rgba(230,57,70,${0.45 + 0.2 * Math.sin(frame * 0.2)}) 0%, transparent 70%)`,
              mixBlendMode: 'screen',
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Lettering */}
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center', ...suck, transformOrigin: '50% 400%' }}>
        <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 104, lineHeight: 1, color: ED.yellow, textShadow: '0 10px 40px rgba(0,0,0,0.8)', ...edIn(frame, at, { trackFrom: -1, trackTo: 2, y: 12 }) }}>
          BOTÃO DO
        </div>
        <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 104, lineHeight: 1, color: ED.yellow, textShadow: '0 10px 40px rgba(0,0,0,0.8)', ...edIn(frame, L(WORD.panico), { trackFrom: -1, trackTo: 2, y: 12 }) }}>
          PÂNICO
        </div>
      </div>
      <NoiseOverlay opacity={0.05} />
    </AbsoluteFill>
  );
};
