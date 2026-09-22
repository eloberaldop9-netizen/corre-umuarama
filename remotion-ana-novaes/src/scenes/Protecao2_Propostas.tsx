import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { mergeStyles } from '../lib/motion';
import { WordIn } from '../lib/WordIn';
import { Clipping, clipIn, J, JornalBg, Marked, outUp, Rule } from '../lib/jornal';
import { lf, PROTECAO_SCENES } from '../protecao-timing';
import type { ProtecaoAssets } from '../VideoAnaNovaisProtecao';

// Cena 2 — As Propostas | frames locais 0–310
// "Como deputada federal, pretende defender mais prevenção, educação nas
// escolas e ampliação do atendimento psicológico e social às vítimas."
// Duas batidas na mesma página de jornal:
//  A) duas matérias lado a lado — PREVENÇÃO (mãos dadas) e EDUCAÇÃO (sala de aula);
//  B) matéria principal — ATENDIMENTO psicológico e social às vítimas (psicóloga com criança).
const S = PROTECAO_SCENES.c2;
const W = (i: number) => lf(i, S);
const A_OUT = W(22) - 2; // "e ampliação" — a batida A sai
const EXIT = 292;

export const Protecao2_Propostas: React.FC<{ assets: ProtecaoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const label: React.CSSProperties = { fontFamily: J.serif, fontWeight: 900, fontSize: 76, letterSpacing: J.track, color: J.ink, lineHeight: 1 };
  const small: React.CSSProperties = { fontFamily: J.sans, fontWeight: 800, fontSize: 30, letterSpacing: J.track, color: J.purple };
  const head: React.CSSProperties = { fontFamily: J.serif, fontWeight: 900, fontSize: 112, letterSpacing: J.track, color: J.ink, lineHeight: 1 };
  const deck: React.CSSProperties = { fontFamily: J.sans, fontWeight: 700, fontSize: 46, letterSpacing: J.track, color: J.ink };

  return (
    <AbsoluteFill>
      <JornalBg />

      {/* Cabeçalho da seção */}
      <div style={{ position: 'absolute', top: 120, left: 80, right: 80, ...outUp(frame, EXIT) }}>
        <Rule frame={frame} at={0} thick={4} />
        <div style={{ display: 'flex', gap: 10, paddingTop: 16 }}>
          <WordIn at={W(12)} style={small}>COMO</WordIn>
          <WordIn at={W(13)} style={small}>DEPUTADA</WordIn>
          <WordIn at={W(14)} style={small}>FEDERAL</WordIn>
        </div>
        <div style={{ display: 'flex', gap: 14, paddingTop: 10, ...outUp(frame, A_OUT) }}>
          {[15, 16, 17].map((i) => (
            <WordIn key={i} at={W(i)} style={{ fontFamily: J.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 60, letterSpacing: J.track, color: J.inkSoft }}>
              {['pretende', 'defender', 'mais'][i - 15]}
            </WordIn>
          ))}
        </div>
      </div>

      {/* Batida A — duas matérias */}
      <div style={{ position: 'absolute', top: 440, left: 80, ...mergeStyles(clipIn(frame, W(18) - 4, -1.5), outUp(frame, A_OUT)) }}>
        <Clipping file={assets.fotoPrevencao} width={445} height={680} objectPosition="62% 50%" />
      </div>
      <div style={{ position: 'absolute', top: 1170, left: 80, ...outUp(frame, A_OUT + 2) }}>
        <WordIn at={W(18)} style={label}>
          <Marked frame={frame} at={W(18) + 6}>Prevenção</Marked>
        </WordIn>
      </div>

      <div style={{ position: 'absolute', top: 470, left: 555, ...mergeStyles(clipIn(frame, W(19) - 4, 1.5), outUp(frame, A_OUT + 3)) }}>
        <Clipping file={assets.fotoEscola} width={445} height={680} objectPosition="68% 50%" />
      </div>
      <div style={{ position: 'absolute', top: 1200, left: 555, ...outUp(frame, A_OUT + 5) }}>
        <WordIn at={W(19)} style={label}>
          <Marked frame={frame} at={W(19) + 6}>Educação</Marked>
        </WordIn>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <WordIn at={W(20)} style={{ ...deck, fontSize: 38 }}>nas</WordIn>
          <WordIn at={W(21)} style={{ ...deck, fontSize: 38 }}>escolas</WordIn>
        </div>
      </div>

      {/* Batida B — matéria principal */}
      <div style={{ position: 'absolute', top: 400, left: 80, ...mergeStyles(clipIn(frame, W(23) + 2, -0.8), outUp(frame, EXIT + 3)) }}>
        <Clipping file={assets.fotoPsicologo} width={920} height={700} objectPosition="50% 50%" />
      </div>
      <div style={{ position: 'absolute', top: 1180, left: 80, right: 80, ...outUp(frame, EXIT + 6) }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <WordIn at={W(23)} style={small}>AMPLIAÇÃO</WordIn>
          <WordIn at={W(24)} style={small}>DO</WordIn>
        </div>
        <div style={{ marginTop: 14 }}>
          <WordIn at={W(25)} style={head}>Atendimento</WordIn>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          {[26, 27, 28].map((i) => (
            <WordIn key={i} at={W(i)} style={{ fontFamily: J.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 72, letterSpacing: J.track, color: J.purple }}>
              {['psicológico', 'e', 'social'][i - 26]}
            </WordIn>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', top: 1560, left: 80, right: 80, display: 'flex', gap: 14, ...outUp(frame, EXIT + 9) }}>
        <WordIn at={W(29)} style={deck}>às</WordIn>
        <WordIn at={W(30)} style={deck}>
          <Marked frame={frame} at={W(30) + 4}>vítimas</Marked>
        </WordIn>
      </div>
    </AbsoluteFill>
  );
};
