import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ci, mergeStyles } from '../lib/motion';
import { WordIn } from '../lib/WordIn';
import { Clipping, clipIn, J, JornalBg, Marked, outUp, Rule } from '../lib/jornal';
import { lf, PROTECAO_SCENES } from '../protecao-timing';
import type { ProtecaoAssets } from '../VideoAnaNovaisProtecao';

// Cena 1 — A Manchete | frames locais 0–196
// "Ana Novais quer fortalecer o combate à violência contra crianças e adolescentes!"
// Capa de jornal limpa: o nome da Ana vira o cabeçalho do jornal quando é
// falado, a foto da matéria assenta na página e a manchete "Combate à
// violência" ganha marca-texto. Só palavras-chave, muito respiro.
const S = PROTECAO_SCENES.c1;
const W = (i: number) => lf(i, S);
const EXIT = 122;

export const Protecao1_Manchete: React.FC<{ assets: ProtecaoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const head: React.CSSProperties = { fontFamily: J.serif, fontWeight: 900, fontSize: 118, letterSpacing: J.track, color: J.ink, lineHeight: 1 };
  const deck: React.CSSProperties = { fontFamily: J.sans, fontWeight: 700, fontSize: 46, letterSpacing: J.track, color: J.ink };

  return (
    <AbsoluteFill>
      <JornalBg />

      {/* Cabeçalho do jornal */}
      <div style={{ position: 'absolute', top: 120, left: 80, right: 80, ...outUp(frame, EXIT) }}>
        <Rule frame={frame} at={0} thick={6} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 26, padding: '18px 0 12px' }}>
          <WordIn at={W(0)} style={{ fontFamily: J.serif, fontWeight: 900, fontSize: 104, letterSpacing: J.track, color: J.ink, lineHeight: 1 }}>Ana</WordIn>
          <WordIn at={W(1)} style={{ fontFamily: J.serif, fontWeight: 900, fontSize: 104, letterSpacing: J.track, color: J.ink, lineHeight: 1 }}>Novais</WordIn>
        </div>
        <Rule frame={frame} at={8} thick={2} origin="right" />
        <div style={{ textAlign: 'center', paddingTop: 12 }}>
          <WordIn at={W(1) + 6} style={{ fontFamily: J.sans, fontWeight: 700, fontSize: 36, letterSpacing: J.track, color: J.purple }}>
            DEPUTADA FEDERAL · PROPOSTAS
          </WordIn>
        </div>
      </div>

      {/* Foto da matéria */}
      <div style={{ position: 'absolute', top: 460, left: 80, ...mergeStyles(clipIn(frame, W(2), -1.2), outUp(frame, EXIT + 3)) }}>
        <Clipping file={assets.fotoViolencia} width={920} height={700} objectPosition="40% 55%" />
      </div>

      {/* Manchete */}
      <div style={{ position: 'absolute', top: 1220, left: 80, right: 80, ...outUp(frame, EXIT + 6) }}>
        <WordIn at={W(3)} style={{ fontFamily: J.sans, fontWeight: 800, fontSize: 48, letterSpacing: J.track, color: J.purple }}>
          FORTALECER O
        </WordIn>
        <div style={{ marginTop: 14, display: 'flex', gap: 28 }}>
          <WordIn at={W(5)} style={head}>Combate</WordIn>
          <WordIn at={W(6)} style={head}>à</WordIn>
        </div>
        <div style={{ marginTop: 6 }}>
          <WordIn at={W(7)} style={head}>
            <Marked frame={frame} at={W(7) + 8}>violência</Marked>
          </WordIn>
        </div>
      </div>

      {/* Linha fina */}
      <div style={{ position: 'absolute', top: 1610, left: 80, right: 80, ...outUp(frame, EXIT + 9) }}>
        <div style={{ width: 90, height: 6, background: J.purple, marginBottom: 22, transform: `scaleX(${ci(frame, [W(8), W(8) + 14], [0, 1])})`, transformOrigin: 'left' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <WordIn at={W(8)} style={deck}>contra</WordIn>
          <WordIn at={W(9)} style={deck}>
            <Marked frame={frame} at={W(9) + 4}>crianças</Marked>
          </WordIn>
          <WordIn at={W(10)} style={deck}>e</WordIn>
          <WordIn at={W(11)} style={deck}>
            <Marked frame={frame} at={W(11) + 4}>adolescentes</Marked>
          </WordIn>
        </div>
      </div>
    </AbsoluteFill>
  );
};
