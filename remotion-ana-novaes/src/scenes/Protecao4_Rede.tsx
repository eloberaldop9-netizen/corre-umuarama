import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../lib/motion';
import { Cutout, Dust, Grain, HalftoneDots, NewsprintTexture, tornPolygon } from '../lib/collage';
import { KineticCaption } from '../lib/KineticCaption';
import { COLOR_PROTECAO as C, FONT_PROTECAO as F, TRACK } from '../lib/palette-protecao';
import { CAPTION_PAGES, PROTECAO_SCENES, wf } from '../protecao-timing';
import type { ProtecaoAssets } from '../VideoAnaNovaisProtecao';

// Cena 4 — A Rede Integrada | frames locais 0–246
// "e da atuação integrada entre Conselho Tutelar, saúde, assistência social,
// segurança e Justiça."
// Tiras de papel batem como tábuas e se empilham de baixo pra cima, cada uma
// no frame da instituição falada; um fio amarelo de "quadro de investigação"
// costura a rede. Câmera: Crane Up. Saída: DISSOLVE SUJO.
const S = PROTECAO_SCENES.c4;
const L = (i: number) => wf(i) - S.from;
const EXIT = 228;

const STRIPS = [
  { text: 'CONSELHO TUTELAR', word: 47, bg: C.yellow, from: 'left' },
  { text: 'SAÚDE', word: 49, bg: C.paper, from: 'right' },
  { text: 'ASSISTÊNCIA SOCIAL', word: 50, bg: C.lilac, from: 'left' },
  { text: 'SEGURANÇA', word: 52, bg: C.paper, from: 'right' },
  { text: 'JUSTIÇA', word: 54, bg: C.yellow, from: 'center' },
] as const;

const STRIP_H = 116;
const STRIP_GAP = 22;
const BASE_Y = 1330;

export const Protecao4_Rede: React.FC<{ assets: ProtecaoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const crane = ci(frame, [0, S.duration], [-140, 90], Easing.inOut(Easing.cubic));
  const bgOp = ci(frame, [0, 8], [0, 1]);

  const txtExit = ci(frame, [EXIT, EXIT + 14], [0, 1], Easing.in(Easing.exp));
  const txtExitStyle = { filter: `blur(${20 * txtExit}px)`, opacity: 1 - txtExit, transform: `translateY(${-40 * txtExit}px) scale(${1 - 0.05 * txtExit})` };

  const atuSp = spring({ frame, fps, config: { damping: 14, mass: 0.8 }, delay: L(44) });
  const intSp = spring({ frame, fps, config: { damping: 10, mass: 1.2 }, delay: L(45) });
  const handsSp = spring({ frame, fps, config: { damping: 12, mass: 1.2 }, delay: L(45) + 4 });

  // Fio amarelo: cresce até a última tira que já entrou
  const landed = STRIPS.filter((s) => frame >= L(s.word)).length;
  const threadTop = BASE_Y - (Math.max(landed, 1) - 1) * (STRIP_H + STRIP_GAP) + STRIP_H / 2;
  const threadGrow = ci(frame, [L(47), L(54) + 10], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.voidDeep, opacity: bgOp, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(122,75,148,0.5), transparent 70%)' }} />
      <HalftoneDots size={9} opacity={0.16} color="rgba(0,0,0,1)" />
      <Grain opacity={0.16} />
      <Dust frame={frame} />

      {/* Cabeçalho hero: ATUAÇÃO INTEGRADA (fora do crane, fixo como título) */}
      <div style={{ position: 'absolute', top: 150, left: 70, ...txtExitStyle }}>
        <div
          style={{
            fontFamily: F.serif, fontStyle: 'italic', fontWeight: 900, fontSize: 110, letterSpacing: TRACK, color: C.textLight, lineHeight: 1,
            opacity: ci(frame, [L(44), L(44) + 5], [0, 1]),
            transform: `translateY(${ci(atuSp, [0, 1], [40, 0])}px)`,
            filter: `blur(${ci(frame, [L(44), L(44) + 10], [12, 0])}px)`,
          }}
        >
          atuação
        </div>
        <div
          style={{
            marginTop: 8, display: 'inline-block', background: C.yellow, padding: '8px 22px 2px', clipPath: tornPolygon(19, 3),
            opacity: ci(frame, [L(45), L(45) + 4], [0, 1]),
            transform: `scale(${ci(intSp, [0, 1], [2.2, 1])}) rotate(-3deg)`,
            transformOrigin: 'left center',
          }}
        >
          <span style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 118, letterSpacing: -3, color: C.voidDeep }}>INTEGRADA</span>
        </div>
      </div>

      {/* Mãos dadas — símbolo da rede */}
      <div
        style={{
          position: 'absolute', top: 420, right: 50, width: 320, height: 220,
          opacity: ci(frame, [L(45) + 4, L(45) + 9], [0, 1]) * (1 - txtExit),
          transform: `scale(${ci(handsSp, [0, 1], [2.4, 1])}) rotate(${ci(handsSp, [0, 1], [20, 6])}deg)`,
          filter: `blur(${ci(frame, [L(45) + 4, L(45) + 16], [16, 0]) + 30 * txtExit}px)`,
        }}
      >
        <Cutout file={assets.fotoMaos} width={320} height={220} seed={101} border={10} objectPosition="45% 60%" />
      </div>

      {/* PILHA DA REDE — Crane Up */}
      <AbsoluteFill style={{ transform: `translateY(${crane}px)` }}>
        {/* Fio de investigação */}
        <div
          style={{
            position: 'absolute', left: 78, width: 6, background: C.yellow,
            top: threadTop, height: Math.max(0, (BASE_Y + STRIP_H / 2 - threadTop) * Math.min(1, threadGrow * 3)),
            boxShadow: '0 0 12px rgba(252,227,0,0.6)',
            opacity: 1 - txtExit,
          }}
        />
        {STRIPS.map((s, i) => {
          const d = L(s.word);
          const sp = spring({ frame, fps, config: { damping: 12, mass: 1 }, delay: d });
          const top = BASE_Y - i * (STRIP_H + STRIP_GAP);
          let tr: string;
          if (s.from === 'center') {
            const sc = frame < d + 8 ? ci(frame, [d, d + 8], [0, 1.1], Easing.out(Easing.cubic)) : ci(frame, [d + 8, d + 16], [1.1, 1], Easing.inOut(Easing.cubic));
            tr = `scale(${sc})`;
          } else {
            const sign = s.from === 'left' ? -1 : 1;
            tr = `translateX(${ci(sp, [0, 1], [900 * sign, 0])}px) skewX(${ci(sp, [0, 1], [20 * sign, 0])}deg)`;
          }
          // Dissolve sujo — de baixo pra cima, 3f de stagger
          const dx = ci(frame, [EXIT + 4 + i * 3, EXIT + 18 + i * 3], [0, 1], Easing.in(Easing.cubic));
          return (
            <div
              key={s.text}
              style={{
                position: 'absolute', top, left: 54, width: 972, height: STRIP_H,
                opacity: ci(frame, [d, d + 4], [0, 1]) * ci(dx, [0.3, 1], [1, 0]),
                transform: `${tr} rotate(${i % 2 ? 1.2 : -1.2}deg) scale(${1 + 0.1 * dx})`,
                filter: `blur(${40 * dx}px) brightness(${1 - dx}) drop-shadow(0 16px 20px rgba(0,0,0,0.55))`,
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: s.bg, clipPath: tornPolygon(200 + i * 7, 4) }}>
                <NewsprintTexture opacity={s.bg === C.paper ? 0.18 : 0.08} />
              </div>
              {/* alfinete */}
              <div style={{ position: 'absolute', top: STRIP_H / 2 - 14, left: 14, width: 28, height: 28, borderRadius: '50%', background: C.voidDeep, border: `4px solid ${C.yellow}` }} />
              <div style={{ position: 'absolute', top: 12, left: 60, fontFamily: F.type, fontSize: 26, letterSpacing: TRACK, color: C.voidDeep, opacity: 0.7 }}>
                0{i + 1}
              </div>
              <div
                style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: F.sans, fontWeight: 900, fontSize: 70, letterSpacing: TRACK, color: C.voidDeep,
                  filter: `blur(${20 * txtExit}px)`,
                }}
              >
                {s.text}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 76%, rgba(20,8,32,0.9) 92%)' }} />
      <KineticCaption
        pages={CAPTION_PAGES.c4}
        sceneFrom={S.from}
        variant="void"
        exitAt={EXIT}
        top={1650}
        fontSize={56}
        emphasis={{ 44: 'yellow', 45: 'yellow', 54: 'box' }}
      />
    </AbsoluteFill>
  );
};
