// Legenda cinética do Vídeo 04 — CADA palavra falada bate na tela no frame
// exato da fala (tabela WORDS). As palavras são agrupadas em "páginas": a
// página entra palavra por palavra e sai (quádrupla: posição + blur +
// opacity + scale, stagger 1f) quando a próxima página começa.
import React from 'react';
import { Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from './motion';
import { WORDS } from '../protecao-timing';
import { COLOR_PROTECAO, FONT_PROTECAO, TRACK } from './palette-protecao';

type Variant = 'void' | 'ransom';
export type Emphasis = 'yellow' | 'tape' | 'box';

interface Props {
  pages: readonly (readonly number[])[];
  /** Frame global onde a cena começa (converte WORDS para frame local). */
  sceneFrom: number;
  variant: Variant;
  /** Frame LOCAL em que a última página sai junto com a cena. */
  exitAt: number;
  top: number;
  emphasis?: Record<number, Emphasis>;
  fontSize?: number;
}

const RANSOM_STYLES: React.CSSProperties[] = [
  { background: COLOR_PROTECAO.paper, color: COLOR_PROTECAO.ink, fontFamily: FONT_PROTECAO.type, fontWeight: 400 },
  { background: COLOR_PROTECAO.ink, color: COLOR_PROTECAO.textLight, fontFamily: FONT_PROTECAO.sans, fontWeight: 900 },
  { background: COLOR_PROTECAO.newsprint, color: COLOR_PROTECAO.voidDeep, fontFamily: FONT_PROTECAO.serif, fontWeight: 900, fontStyle: 'italic' },
  { background: COLOR_PROTECAO.lilacSoft, color: COLOR_PROTECAO.ink, fontFamily: FONT_PROTECAO.sans, fontWeight: 800 },
];

export const KineticCaption: React.FC<Props> = ({
  pages,
  sceneFrom,
  variant,
  exitAt,
  top,
  emphasis = {},
  fontSize = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = (i: number) => WORDS[i].f - sceneFrom;

  return (
    <>
      {pages.map((page, p) => {
        const start = local(page[0]);
        const end = p < pages.length - 1 ? local(pages[p + 1][0]) - 3 : exitAt;
        if (frame < start - 2 || frame > end + 16) return null;
        return (
          <div
            key={p}
            style={{
              position: 'absolute',
              top,
              left: 60,
              right: 60,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: variant === 'ransom' ? 14 : 4,
              columnGap: variant === 'ransom' ? 12 : 18,
            }}
          >
            {page.map((wi, k) => {
              const ws = local(wi);
              const next = wi + 1 < WORDS.length ? WORDS[wi + 1].f - sceneFrom : ws + 20;
              const sp = spring({ frame, fps, config: { damping: 14, mass: 0.8 }, delay: ws });
              const y = ci(sp, [0, 1], [34, 0]);
              const sc = ci(sp, [0, 1], [0.82, 1]);
              const bl = ci(frame, [ws, ws + 7], [10, 0]);
              const op = ci(frame, [ws, ws + 4], [0, 1]);

              const es = end + k;
              const ex = ci(frame, [es, es + 10], [0, 1], Easing.in(Easing.exp));
              const exY = ci(ex, [0, 1], [0, -60]);
              const exBl = ci(ex, [0, 1], [0, 18]);
              const exOp = ci(ex, [0.2, 0.9], [1, 0]);
              const exSc = ci(ex, [0, 1], [1, 0.94]);

              const active = frame >= ws && frame < next;
              const emph = emphasis[wi];
              const word = WORDS[wi].w.toUpperCase();

              const base: React.CSSProperties = {
                display: 'inline-block',
                fontSize,
                letterSpacing: TRACK,
                lineHeight: 1.05,
                opacity: op * exOp,
                transform: `translateY(${y + exY}px) scale(${sc * exSc})`,
                filter: `blur(${bl + exBl}px)`,
              };

              if (variant === 'void') {
                const isYellow = emph === 'yellow' || emph === 'tape';
                return (
                  <span
                    key={wi}
                    style={{
                      ...base,
                      fontFamily: FONT_PROTECAO.sans,
                      fontWeight: 800,
                      color: isYellow ? COLOR_PROTECAO.yellow : COLOR_PROTECAO.textLight,
                      textShadow: '0 6px 24px rgba(0,0,0,0.75)',
                      padding: emph === 'box' ? '2px 14px' : undefined,
                      background: emph === 'box' ? COLOR_PROTECAO.yellow : undefined,
                      ...(emph === 'box' ? { color: COLOR_PROTECAO.voidDeep, textShadow: 'none' } : {}),
                      // palavra falada agora: sublinhado marca-texto
                      boxShadow: active && emph !== 'box' ? `inset 0 -12px 0 ${COLOR_PROTECAO.brandCore}` : undefined,
                    }}
                  >
                    {word}
                  </span>
                );
              }

              // RANSOM — cada palavra é um recorte de papel diferente
              const rot = ((wi * 37) % 7) - 3;
              const style =
                emph === 'tape' || emph === 'yellow'
                  ? { background: COLOR_PROTECAO.yellow, color: COLOR_PROTECAO.voidDeep, fontFamily: FONT_PROTECAO.sans, fontWeight: 900 }
                  : emph === 'box'
                    ? { background: COLOR_PROTECAO.voidDeep, color: COLOR_PROTECAO.yellow, fontFamily: FONT_PROTECAO.sans, fontWeight: 900 }
                    : RANSOM_STYLES[wi % RANSOM_STYLES.length];
              return (
                <span
                  key={wi}
                  style={{
                    ...base,
                    ...style,
                    padding: '6px 14px 4px',
                    transform: `${base.transform} rotate(${rot}deg)`,
                    boxShadow: active
                      ? `6px 6px 0 ${COLOR_PROTECAO.brandCore}`
                      : '4px 4px 0 rgba(0,0,0,0.35)',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        );
      })}
    </>
  );
};
