import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay, HalftoneOverlay } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { WordIn } from '../lib/WordIn';
import { COLOR_CAUSA } from '../lib/palette-causa';
import { FONT } from '../lib/palette';
import { lf, PROTECAO_SCENES } from '../protecao-timing';
import type { ProtecaoAssets } from '../VideoAnaNovaisProtecao';

// Cena 1 — O Combate | frames locais 0–196
// "Ana Novais quer fortalecer o combate à violência contra crianças e adolescentes!"
// Mesma composição do vídeo aprovado "A Causa": degradê lilás → roxo do
// banner oficial, manchete no topo, retrato emoldurado no centro e só as
// palavras-chave na tela (nada por cima da foto).
const S = PROTECAO_SCENES.c1;
const W = (i: number) => lf(i, S);
const BG_LIGHT = '#F3EEFA';
const BG_DEEP = '#3B1F73';
const TEXT_ON_LIGHT = '#2A1B52';

export const Protecao1_Combate: React.FC<{ assets: ProtecaoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = ci(frame, [0, 18], [0, 1], Easing.inOut(Easing.quad));
  const dolly = ci(frame, [0, S.duration], [0.96, 1.03], Easing.out(Easing.cubic));

  const portraitOp = ci(frame, [0, 24], [0, 1]);
  const portraitBlur = ci(frame, [0, 24], [20, 0], Easing.out(Easing.cubic));
  const portraitScale = ci(frame, [0, 24], [1.1, 1], Easing.out(Easing.cubic));

  // "CRIANÇAS" — hero branco, entra como o "AUTISTA" do vídeo aprovado
  const kidsAt = W(9);
  const kidsSp = spring({ frame, fps, config: { damping: 10, mass: 1.2, stiffness: 80 }, delay: kidsAt });

  // Tarja amarela "E ADOLESCENTES"
  const tagAt = W(10) - 4;
  const tagOp = ci(frame, [tagAt, tagAt + 12], [0, 1], Easing.out(Easing.cubic));
  const tagScale = ci(frame, [tagAt, tagAt + 14], [0.85, 1], Easing.out(Easing.cubic));

  // Saída — dissolve + engole em Z
  const exitBlur = ci(frame, [172, 194], [0, 30], Easing.in(Easing.exp));
  const exitScale = ci(frame, [172, 196], [1, 1.12], Easing.in(Easing.exp));
  const exitOp = ci(frame, [175, 194], [1, 0]);

  const headline: React.CSSProperties = { fontFamily: FONT.sans, fontWeight: 900, fontSize: 60, letterSpacing: -1, color: TEXT_ON_LIGHT };

  return (
    <AbsoluteFill style={{ opacity: bgOp, backgroundColor: BG_LIGHT }}>
      <AbsoluteFill
        style={{ background: `linear-gradient(165deg, ${BG_LIGHT} 0%, #E3D6F2 22%, #B79FE0 48%, #7B4FB8 68%, ${BG_DEEP} 92%)` }}
      />
      <NoiseOverlay opacity={0.05} />
      <HalftoneOverlay opacity={0.025} />

      <AbsoluteFill style={{ transform: `scale(${dolly * exitScale})`, filter: `blur(${exitBlur}px)`, opacity: exitOp }}>
        {/* Manchete */}
        <div style={{ position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center' }}>
          <WordIn at={W(3)} style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 36, letterSpacing: -1, color: TEXT_ON_LIGHT, opacity: 0.85 }}>
            FORTALECER O
          </WordIn>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 6 }}>
            <WordIn at={W(5)} style={headline}>COMBATE</WordIn>
            <WordIn at={W(6)} style={headline}>À</WordIn>
            <WordIn at={W(7)} style={headline}>VIOLÊNCIA</WordIn>
          </div>
        </div>

        {/* Retrato emoldurado */}
        <div
          style={{
            position: 'absolute', top: 320, left: '50%', width: 540, height: 740, marginLeft: -270,
            opacity: portraitOp, filter: `blur(${portraitBlur}px)`, transform: `scale(${portraitScale})`,
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%', border: '14px solid #FFFFFF', boxShadow: '0 30px 90px rgba(0,0,0,0.85)', overflow: 'hidden' }}>
            <AssetImage file={assets.retratoAna} label="RETRATO — ANA NOVAIS" style={{ width: '100%', height: '100%', objectPosition: '50% 30%' }} />
          </div>
          <div
            style={{
              position: 'absolute', bottom: -18, right: -18, width: 84, height: 84, borderRadius: '50%',
              border: `2px solid ${COLOR_CAUSA.gold}`, backgroundColor: 'rgba(10,10,12,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)',
            }}
          >
            <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 12, letterSpacing: 1, color: COLOR_CAUSA.gold, textAlign: 'center', lineHeight: 1.2 }}>
              ANA
              <br />
              NOVAIS
            </span>
          </div>
        </div>

        {/* CRIANÇAS — hero branco */}
        <div style={{ position: 'absolute', top: 1130, left: 0, right: 0, textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block', fontFamily: FONT.sans, fontWeight: 900, fontSize: 104, letterSpacing: -2,
              color: COLOR_CAUSA.textLight, textShadow: '0 4px 22px rgba(0,0,0,0.35)',
              opacity: ci(frame, [kidsAt, kidsAt + 8], [0, 1]),
              transform: `scale(${ci(kidsSp, [0, 1], [1.6, 1])})`,
              filter: `blur(${ci(frame - kidsAt, [0, 20], [10, 0])}px)`,
            }}
          >
            CRIANÇAS
          </span>
        </div>

        {/* E ADOLESCENTES — tarja amarela do banner oficial */}
        <div style={{ position: 'absolute', top: 1280, left: 0, right: 0, textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex', gap: 14, padding: '16px 40px', backgroundColor: COLOR_CAUSA.gold, borderRadius: 16,
              opacity: tagOp, transform: `scale(${tagScale})`, boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            }}
          >
            <WordIn at={W(10)} style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 50, letterSpacing: -1, color: TEXT_ON_LIGHT }}>E</WordIn>
            <WordIn at={W(11)} style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 50, letterSpacing: -1, color: TEXT_ON_LIGHT }}>ADOLESCENTES</WordIn>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
