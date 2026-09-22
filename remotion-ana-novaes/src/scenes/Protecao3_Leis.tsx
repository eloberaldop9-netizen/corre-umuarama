import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { mergeStyles } from '../lib/motion';
import { WordIn } from '../lib/WordIn';
import { Clipping, clipIn, J, JornalBg, Marked, outUp, Rule } from '../lib/jornal';
import { lf, PROTECAO_SCENES } from '../protecao-timing';
import type { ProtecaoAssets } from '../VideoAnaNovaisProtecao';

// Cena 3 — As Leis | frames locais 0–160
// "Também quer trabalhar pelo fortalecimento das leis, dos canais de denúncia"
// Página de jornal: foto do martelo da Justiça + manchete "Leis" gigante;
// embaixo, nota menor com a foto do telefone e "canais de denúncia".
const S = PROTECAO_SCENES.c3;
const W = (i: number) => lf(i, S);
const EXIT = 138;

export const Protecao3_Leis: React.FC<{ assets: ProtecaoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const small: React.CSSProperties = { fontFamily: J.sans, fontWeight: 800, fontSize: 30, letterSpacing: J.track, color: J.purple };
  const deck: React.CSSProperties = { fontFamily: J.sans, fontWeight: 700, fontSize: 42, letterSpacing: J.track, color: J.ink };

  return (
    <AbsoluteFill>
      <JornalBg />

      <div style={{ position: 'absolute', top: 120, left: 80, right: 80, ...outUp(frame, EXIT) }}>
        <Rule frame={frame} at={0} thick={4} />
        <div style={{ display: 'flex', gap: 10, paddingTop: 16 }}>
          {[31, 32, 33, 34].map((i) => (
            <WordIn key={i} at={W(i)} style={small}>
              {['TAMBÉM', 'QUER', 'TRABALHAR', 'PELO'][i - 31]}
            </WordIn>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', top: 250, left: 80, ...mergeStyles(clipIn(frame, W(35) - 8, 1), outUp(frame, EXIT + 3)) }}>
        <Clipping file={assets.fotoLeis} width={920} height={560} objectPosition="70% 50%" />
      </div>

      <div style={{ position: 'absolute', top: 870, left: 80, right: 80, ...outUp(frame, EXIT + 5) }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <WordIn at={W(35)} style={{ fontFamily: J.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 70, letterSpacing: J.track, color: J.purple }}>
            fortalecimento
          </WordIn>
          <WordIn at={W(36)} style={{ fontFamily: J.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 70, letterSpacing: J.track, color: J.purple }}>
            das
          </WordIn>
        </div>
        <WordIn at={W(37)} style={{ fontFamily: J.serif, fontWeight: 900, fontSize: 230, letterSpacing: J.track, color: J.ink, lineHeight: 1 }}>
          <Marked frame={frame} at={W(37) + 6}>Leis</Marked>
        </WordIn>
      </div>

      <div style={{ position: 'absolute', top: 1300, left: 80, right: 80, ...outUp(frame, EXIT + 8) }}>
        <Rule frame={frame} at={W(38) - 6} thick={2} />
      </div>
      <div style={{ position: 'absolute', top: 1350, left: 80, ...mergeStyles(clipIn(frame, W(38), -2), outUp(frame, EXIT + 9)) }}>
        <Clipping file={assets.fotoDenuncia} width={400} height={300} objectPosition="50% 50%" />
      </div>
      <div style={{ position: 'absolute', top: 1380, left: 530, right: 60, ...outUp(frame, EXIT + 11) }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <WordIn at={W(38)} style={deck}>dos</WordIn>
          <WordIn at={W(39)} style={deck}>canais</WordIn>
          <WordIn at={W(40)} style={deck}>de</WordIn>
        </div>
        <WordIn at={W(41)} style={{ fontFamily: J.serif, fontWeight: 900, fontSize: 92, letterSpacing: J.track, color: J.ink, lineHeight: 1.1 }}>
          <Marked frame={frame} at={W(41) + 5}>denúncia</Marked>
        </WordIn>
      </div>
    </AbsoluteFill>
  );
};
