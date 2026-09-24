import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { NewsSheet, RoughFilter } from '../lib/Newsprint';
import { TornPhoto } from '../lib/TornPhoto';
import { LineIcon } from '../lib/LineIcon';
import { ED, edIn } from '../lib/editorial';
import { EDUCACAO_SCENES, WORD } from '../educacao-timing';
import type { EducacaoAssets } from '../educacao-timing';

// Cena 1 — O Compromisso Público | frames 0–240
// "Ana Novais propõe fortalecer a educação pública e garantir que os recursos
// destinados às escolas cheguem onde realmente precisam!"
// Capa de jornal no papel off-white/lilás, Dolly In lento. A Ana (recorte de
// jornal P&B + retícula, contorno amarelo rasgado) domina a base da tela —
// os cortes da foto (base e lateral direita) ficam FORA do quadro, ela nunca
// flutua. Atrás das manchetes, fotos rasgadas de alunos em sala a 60%.
// Letterings: ANA NOVAIS propõe · bloco roxo FORTALECER A EDUCAÇÃO PÚBLICA ·
// RECURSOS (bloco amarelo com moeda) · "cheguem onde realmente precisam!".
// Saída: WIPE EDITORIAL roxo da direita para a esquerda.
const S = EDUCACAO_SCENES.c1;
const EXIT = 222; // "precisam!" termina em 222

export const Educacao1_Compromisso: React.FC<{ assets: EducacaoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const dolly = ci(frame, [0, S.duration], [1, 1.06], Easing.out(Easing.cubic));
  const bgIn = ci(frame, [0, 24], [0, 1], Easing.out(Easing.cubic));
  const anaIn = ci(frame, [10, 40], [0, 1], Easing.out(Easing.cubic));
  const wipe = ci(frame, [EXIT, S.duration], [2000, 0], Easing.inOut(Easing.cubic));
  const cut = staticFile(`assets/${assets.anaCutout}`);
  const blockIn = ci(frame, [WORD.fortalecer - 4, WORD.fortalecer + 18], [0, 1], Easing.out(Easing.cubic));
  const rec = ci(frame, [WORD.recursos - 4, WORD.recursos + 18], [0, 1], Easing.out(Easing.cubic));
  const pill = ci(frame, [WORD.cheguem - 4, WORD.cheguem + 16], [0, 1], Easing.out(Easing.cubic));
  const mark = ci(frame, [WORD.realmente, WORD.realmente + 14], [0, 100], Easing.out(Easing.cubic));
  const heroWord = (at: number): React.CSSProperties => ({
    fontFamily: ED.sans, fontWeight: 900, fontSize: 118, lineHeight: 0.98, color: ED.yellow, whiteSpace: 'nowrap',
    ...edIn(frame, at, { dur: 22, y: 16, blur: 15, trackFrom: -8, trackTo: -4 }),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: ED.paper, overflow: 'hidden' }}>
      <AbsoluteFill style={{ mixBlendMode: 'multiply', opacity: 0.6, backgroundImage: 'repeating-linear-gradient(115deg, rgba(60,30,80,0.05) 0 2px, transparent 2px 7px), repeating-linear-gradient(25deg, rgba(60,30,80,0.035) 0 3px, transparent 3px 10px)' }} />
      <NoiseOverlay opacity={0.04} />
      <RoughFilter id="rough-ana-e" />

      <AbsoluteFill style={{ transform: `scale(${dolly})` }}>
        {/* Colagem de fundo: escola real (P&B, retícula, 60%) */}
        <div style={{ opacity: bgIn, filter: `blur(${20 * (1 - bgIn)}px)` }}>
          <NewsSheet w={520} h={420} seed={21} style={{ top: 330, left: 520, transform: 'rotate(4deg)' }} />
          <NewsSheet w={460} h={360} seed={13} tone="#D9D4CB" style={{ top: 640, left: 20, transform: 'rotate(-5deg)' }} />
        </div>
        <div style={{ position: 'absolute', top: 330, left: 20 }}>
          <TornPhoto frame={frame} at={0} file={assets.alunos} w={620} h={420} pos="60% 40%" seed={5} rot={-4} opacity={0.6} />
        </div>
        <div style={{ position: 'absolute', top: 600, left: 470 }}>
          <TornPhoto frame={frame} at={WORD.garantir - 10} file={assets.carteiras} w={600} h={360} pos="55% 45%" seed={9} rot={4} opacity={0.6} />
        </div>

        {/* Ana — domina a base; corte inferior e lateral direito fora do quadro */}
        <div style={{ position: 'absolute', top: 1030, left: 140, width: 1000 }}>
          <div style={{ opacity: anaIn, transform: `translateY(${60 * (1 - anaIn)}px)`, filter: `blur(${16 * (1 - anaIn)}px)`, position: 'relative' }}>
            <div
              style={{
                position: 'absolute', inset: 0, background: ED.yellow, transform: 'scale(1.05) translate(0px, -4px)', transformOrigin: '50% 60%',
                maskImage: `url(${cut})`, WebkitMaskImage: `url(${cut})`, maskSize: '100% 100%', WebkitMaskSize: '100% 100%',
                filter: 'url(#rough-ana-e) drop-shadow(0 40px 100px rgba(0,0,0,0.5))',
              }}
            />
            <div style={{ position: 'relative' }}>
              <Img src={cut} style={{ display: 'block', width: 1000, filter: 'grayscale(1) contrast(1.15) brightness(1.04)' }} />
              <div
                style={{
                  position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.24,
                  backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1.1px, transparent 1.7px)', backgroundSize: '6px 6px',
                  maskImage: `url(${cut})`, WebkitMaskImage: `url(${cut})`, maskSize: '100% 100%', WebkitMaskSize: '100% 100%',
                }}
              />
            </div>
          </div>
        </div>

        {/* ANA NOVAIS / propõe */}
        <div style={{ position: 'absolute', top: 218, left: 0, right: 0, textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 300, fontSize: 60, color: ED.void, ...edIn(frame, WORD.ana, { trackFrom: 0, trackTo: 6, y: 20, blur: 8 }) }}>
            ANA NOVAIS
          </span>
          <div style={{ marginTop: 4 }}>
            <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 800, fontSize: 56, color: ED.brandCore, ...edIn(frame, WORD.propoe - 4, { y: 14, trackFrom: -4, trackTo: -1 }) }}>
              propõe
            </span>
          </div>
        </div>

        {/* FORTALECER A EDUCAÇÃO PÚBLICA */}
        <div style={{ position: 'absolute', top: 428, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: ED.void, padding: '26px 48px 22px', textAlign: 'center', boxShadow: '0 40px 80px rgba(45,22,67,0.45)', opacity: blockIn, transform: `translateY(${40 * (1 - blockIn)}px) rotate(-1.5deg)`, filter: `blur(${12 * (1 - blockIn)}px)` }}>
            <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 54, color: '#FFFFFF', ...edIn(frame, WORD.fortalecer, { dur: 20, y: 10, trackFrom: -4, trackTo: -1 }) }}>FORTALECER A</div>
            <div style={heroWord(WORD.educacao - 4)}>EDUCAÇÃO</div>
            <div style={heroWord(WORD.publica - 2)}>PÚBLICA</div>
          </div>
        </div>

        {/* RECURSOS */}
        <div style={{ position: 'absolute', top: 830, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, background: ED.yellow, padding: '14px 40px 14px 18px', boxShadow: '0 24px 50px rgba(45,22,67,0.35)', opacity: rec, transform: `scale(${0.9 + 0.1 * rec}) rotate(2deg)`, filter: `blur(${10 * (1 - rec)}px)` }}>
            <div style={{ width: 92, height: 92, borderRadius: '50%', background: ED.void, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LineIcon name="moeda" frame={frame} at={WORD.recursos} size={60} color={ED.yellow} stroke={2} />
            </div>
            <span style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 88, lineHeight: 1, letterSpacing: -3, color: ED.void }}>RECURSOS</span>
          </div>
        </div>

        {/* cheguem onde realmente precisam! */}
        <div style={{ position: 'absolute', top: 960, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: '#FFFFFF', borderRadius: 999, padding: '14px 36px', boxShadow: '0 20px 40px rgba(45,22,67,0.3)', opacity: pill, transform: `translateY(${24 * (1 - pill)}px)`, filter: `blur(${10 * (1 - pill)}px)` }}>
            <span style={{ fontFamily: ED.sans, fontWeight: 800, fontSize: 44, color: ED.void, whiteSpace: 'nowrap' }}>
              cheguem onde{' '}
              <span style={{ position: 'relative', display: 'inline-block', opacity: ci(frame, [WORD.realmente - 4, WORD.realmente + 6], [0, 1]) }}>
                <span style={{ position: 'absolute', left: -6, right: -6, top: '18%', bottom: '8%', background: ED.yellow, clipPath: `inset(0 ${100 - mark}% 0 0)` }} />
                <span style={{ position: 'relative', fontWeight: 900 }}>realmente precisam!</span>
              </span>
            </span>
          </div>
        </div>
      </AbsoluteFill>

      <div style={{ position: 'absolute', top: -200, bottom: -200, left: -300, width: 1800, background: ED.void, transform: `translateX(${wipe}px) rotate(-4deg)`, boxShadow: '-40px 0 80px rgba(0,0,0,0.35)' }} />
    </AbsoluteFill>
  );
};
