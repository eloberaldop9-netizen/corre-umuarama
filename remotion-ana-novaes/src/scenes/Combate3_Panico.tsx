import React from 'react';
import { AbsoluteFill, Easing, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn, outP } from '../lib/editorial';
import { COMBATE_SCENES, WORD } from '../combate-timing';
import type { CombateAssets } from '../combate-timing';

// Cena 3 — O Mecanismo | frames locais 0–145
// Preto absoluto, foco macro. O celular real fica só como memória escura ao
// fundo; no centro, um imenso botão vermelho pulsa com anéis de sonar. Em
// "botão do pânico" o lettering amarelo se crava acima. Z-push extremo
// (1 → 1.25). Saída: SUCÇÃO (buraco negro) para o centro.
const S = COMBATE_SCENES.c3;
const L = (f: number) => f - S.from;
const EXIT = 120;

export const Combate3_Panico: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const push = ci(frame, [0, S.duration], [1, 1.25], Easing.inOut(Easing.cubic));
  const btn = spring({ frame, fps, config: { damping: 10, mass: 0.8 }, delay: 2 });
  const glow = 0.55 + 0.25 * Math.sin(frame * 0.22);
  const sp = outP(frame, EXIT, 25);
  const suck = { transform: `scale(${push * (1 - sp)}) rotate(${-15 * sp}deg)`, filter: `blur(${30 * sp}px)` };

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
      {/* memória do celular — escura e desfocada */}
      <AbsoluteFill style={{ transform: `scale(${push * 1.15})`, opacity: 0.22 * (1 - sp), filter: 'blur(14px) saturate(0.6)' }}>
        <Img src={staticFile(`assets/${assets.fotoPanico}`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 55%, rgba(230,57,70,0.12), transparent 55%)' }} />

      <AbsoluteFill style={suck}>
        {/* Sonar */}
        <div style={{ position: 'absolute', left: 540, top: 1060 }}>
          {[0, 1, 2].map((k) => {
            const t = ((Math.max(0, frame - 15) / 45 + k / 3) % 1);
            return (
              <div
                key={k}
                style={{
                  position: 'absolute', width: 440, height: 440, marginLeft: -220, marginTop: -220, borderRadius: '50%',
                  border: `4px solid ${ED.alert}`, transform: `scale(${1 + t * 1.6})`, opacity: frame < 15 ? 0 : 0.6 * (1 - t),
                }}
              />
            );
          })}
          {/* Botão */}
          <div
            style={{
              position: 'absolute', width: 440, height: 440, marginLeft: -220, marginTop: -220, borderRadius: '50%',
              background: `radial-gradient(circle at 38% 32%, #FF7A84 0%, ${ED.alert} 45%, #9E1E2A 100%)`,
              boxShadow: `0 0 ${40 + 50 * glow}px rgba(230,57,70,${glow}), inset 0 -18px 40px rgba(0,0,0,0.35), inset 0 12px 30px rgba(255,255,255,0.25)`,
              transform: `scale(${btn})`, opacity: ci(frame, [2, 8], [0, 1]),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16z" />
              <path d="M10 20a2 2 0 0 0 4 0" />
              <path d="M12 2v1.5M4.2 5.2l1.1 1.1M19.8 5.2l-1.1 1.1" />
            </svg>
          </div>
        </div>

        {/* Lettering */}
        <div style={{ position: 'absolute', top: 360, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 118, lineHeight: 1, color: ED.yellow, textShadow: '0 10px 40px rgba(0,0,0,0.8)', ...edIn(frame, L(WORD.botao), { trackFrom: 0, trackTo: -2, blur: 10, y: 0 }) }}>
            BOTÃO DO
          </div>
          <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 118, lineHeight: 1, color: ED.yellow, textShadow: '0 10px 40px rgba(0,0,0,0.8)', ...edIn(frame, L(WORD.panico), { trackFrom: 0, trackTo: -2, blur: 10, y: 0 }) }}>
            PÂNICO
          </div>
        </div>
      </AbsoluteFill>
      <NoiseOverlay opacity={0.05} />
    </AbsoluteFill>
  );
};
