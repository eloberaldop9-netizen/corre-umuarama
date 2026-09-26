import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED } from '../lib/editorial';
import { BEATS } from '../vmulher-timing';

// Cena 4 — O Selo (vídeo 03 refeito) | frames locais 0–140
// Arte base da campanha: gradiente radial #9859b3 → #2D1643, pill amarela
// DEPUTADA FEDERAL, nome e 2010 gigante em branco na base curva, entrando
// como bloco único (5 frames entre eles).
// Micro-zoom contínuo e fade solene nos últimos 20 frames.
const S = { duration: BEATS.selo.to - BEATS.selo.from };

export const VM_Selo: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = ci(frame, [0, S.duration], [1, 1.03]);
  const fade = ci(frame, [S.duration - 25, S.duration], [1, 0]); // fade solene nos últimos 25 frames
  const bgIn = ci(frame, [0, 20], [0, 1], Easing.inOut(Easing.cubic)); // dissolve sobre a volta da capa
  const up = (at: number) => ci(frame, [at, at + 30], [0, 1], Easing.out(Easing.cubic));
  const top = up(16);
  const name = up(21);
  const base = up(26);

  return (
    <AbsoluteFill style={{ opacity: fade * bgIn, backgroundColor: ED.void }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #9859b3 0%, #2D1643 85%)' }} />
      <NoiseOverlay opacity={0.04} />
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <div style={{ position: 'absolute', top: 560, left: 0, right: 0, textAlign: 'center', opacity: top, transform: `translateY(${40 * (1 - top)}px)`, filter: `blur(${15 * (1 - top)}px)` }}>
          <div style={{ display: 'inline-block', background: ED.yellow, borderRadius: 999, padding: '16px 46px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <span style={{ fontFamily: ED.sans, fontWeight: 800, fontSize: 36, letterSpacing: -1, color: ED.void }}>DEPUTADA FEDERAL</span>
          </div>
          <div style={{ marginTop: 24, fontFamily: ED.sans, fontWeight: 800, fontSize: 122, letterSpacing: -3, color: '#FFFFFF', textShadow: '0 10px 40px rgba(0,0,0,0.35)', opacity: name, transform: `translateY(${40 * (1 - name)}px)` }}>
            Ana Novais
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 640, opacity: base, transform: `translateY(${40 * (1 - base)}px)` }}>
          <div
            style={{
              position: 'absolute', inset: 0, backgroundColor: ED.void, borderTopLeftRadius: '52% 100px', borderTopRightRadius: '52% 100px',
              boxShadow: '0 -30px 80px rgba(0,0,0,0.35)',
            }}
          />
          <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', fontFamily: ED.sans, fontWeight: 900, fontSize: 240, letterSpacing: -4, color: '#FFFFFF', lineHeight: 1 }}>
            2010
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
