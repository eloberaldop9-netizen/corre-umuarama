import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ci, mergeStyles } from '../lib/motion';
import { WordIn } from '../lib/WordIn';
import { Clipping, clipIn, J, JornalBg, Marked, Rule } from '../lib/jornal';
import { lf, PROTECAO_SCENES } from '../protecao-timing';
import type { ProtecaoAssets } from '../VideoAnaNovaisProtecao';

// Cena 4 — A Rede Integrada | frames locais 0–270
// "e da atuação integrada entre Conselho Tutelar, saúde, assistência social,
// segurança e Justiça."
// Foto das mãos protegendo a roda de pessoas + manchete "Atuação integrada";
// as cinco instituições entram como um índice de jornal, uma por vez, no
// frame em que são faladas. Assinatura discreta e fade final.
const S = PROTECAO_SCENES.c4;
const W = (i: number) => lf(i, S);

const ITEMS = [
  { text: 'Conselho Tutelar', at: 47 },
  { text: 'Saúde', at: 49 },
  { text: 'Assistência Social', at: 50 },
  { text: 'Segurança', at: 52 },
  { text: 'Justiça', at: 54 },
];

export const Protecao4_Rede: React.FC<{ assets: ProtecaoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const small: React.CSSProperties = { fontFamily: J.sans, fontWeight: 800, fontSize: 30, letterSpacing: J.track, color: J.purple };
  const head: React.CSSProperties = { fontFamily: J.serif, fontWeight: 900, fontSize: 112, letterSpacing: J.track, color: J.ink, lineHeight: 1 };
  const fade = ci(frame, [S.duration - 25, S.duration], [1, 0]);
  const signAt = W(54) + 20;

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <JornalBg />

      <div style={{ position: 'absolute', top: 120, left: 80, right: 80 }}>
        <Rule frame={frame} at={0} thick={4} />
        <div style={{ display: 'flex', gap: 10, paddingTop: 16 }}>
          <WordIn at={W(42)} style={small}>E</WordIn>
          <WordIn at={W(43)} style={small}>DA</WordIn>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 250, left: 80, ...mergeStyles(clipIn(frame, W(43), -1)) }}>
        <Clipping file={assets.fotoRede} width={920} height={500} objectPosition="50% 40%" />
      </div>

      <div style={{ position: 'absolute', top: 810, left: 80, right: 80 }}>
        <WordIn at={W(44)} style={head}>Atuação</WordIn>
        <div style={{ marginTop: 6 }}>
          <WordIn at={W(45)} style={head}>
            <Marked frame={frame} at={W(45) + 6}>integrada</Marked>
          </WordIn>
        </div>
        <div style={{ marginTop: 22 }}>
          <WordIn at={W(46)} style={small}>ENTRE</WordIn>
        </div>
      </div>

      {/* Índice de jornal — uma instituição por vez */}
      <div style={{ position: 'absolute', top: 1140, left: 80, right: 80 }}>
        {ITEMS.map((it, k) => {
          const at = W(it.at);
          return (
            <div key={it.text} style={{ padding: '12px 0 10px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                <div
                  style={{
                    width: 18, height: 18, background: J.purple,
                    transform: `scale(${ci(frame, [at, at + 10], [0, 1])})`,
                  }}
                />
                <WordIn at={at} style={{ fontFamily: J.serif, fontWeight: 700, fontSize: 56, letterSpacing: J.track, color: J.ink, lineHeight: 1.1 }}>
                  {k === ITEMS.length - 1 ? <Marked frame={frame} at={at + 6}>{it.text}</Marked> : it.text}
                </WordIn>
              </div>
              <div style={{ marginTop: 12 }}>
                <Rule frame={frame} at={at} thick={1} color="rgba(26,20,38,0.35)" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Assinatura */}
      <div style={{ position: 'absolute', bottom: 110, left: 80, right: 80, textAlign: 'center' }}>
        <Rule frame={frame} at={signAt} thick={3} origin="center" />
        <div style={{ paddingTop: 16 }}>
          <WordIn at={signAt + 4} style={{ fontFamily: J.serif, fontWeight: 900, fontSize: 52, letterSpacing: J.track, color: J.ink }}>
            Ana Novais
          </WordIn>
        </div>
        <WordIn at={signAt + 10} style={{ fontFamily: J.sans, fontWeight: 700, fontSize: 24, letterSpacing: J.track, color: J.purple }}>
          DEPUTADA FEDERAL
        </WordIn>
      </div>
    </AbsoluteFill>
  );
};
