import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, handheldShake } from '../lib/motion';
import { NoiseOverlay, HalftoneOverlay } from '../lib/Background';
import { AnimatedText } from '../lib/AnimatedText';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_CAUSA } from '../lib/palette-causa';
import { FONT } from '../lib/palette';
import { lf, PROTECAO_SCENES } from '../protecao-timing';
import type { ProtecaoAssets } from '../VideoAnaNovaisProtecao';

// Cena 2 — As Propostas (A Mesa de Trabalho) | frames locais 0–310
// "Como deputada federal, pretende defender mais prevenção, educação nas
// escolas e ampliação do atendimento psicológico e social às vítimas."
// Mesma mesa de trabalho do vídeo aprovado "A Causa": frase de abertura
// palavra por palavra no topo e 4 fotos (moldura branca + etiqueta) que
// caem na mesa no frame exato de cada palavra-chave.
const S = PROTECAO_SCENES.c2;
const W = (i: number) => lf(i, S);
const CARD_SPRING = { damping: 12, mass: 1 };

export const Protecao2_Propostas: React.FC<{ assets: ProtecaoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgFadeIn = ci(frame, [15, 45], [0, 1], Easing.out(Easing.quad));
  const shake = handheldShake(frame, 0.55);

  const p1 = spring({ frame, fps, config: CARD_SPRING, delay: W(18) }); // prevenção
  const p2 = spring({ frame, fps, config: CARD_SPRING, delay: W(19) }); // educação
  const p3 = spring({ frame, fps, config: CARD_SPRING, delay: W(25) }); // atendimento
  const p4 = spring({ frame, fps, config: CARD_SPRING, delay: W(28) }); // social / vítimas

  // Saída (292–310) — tarja roxa + atropelamento, depois de "vítimas"
  const wipeP = ci(frame, [292, 310], [0, 1], Easing.in(Easing.exp));
  const wipeX = interp(wipeP, -1400, 1400);
  const cardsExitP = ci(frame, [294, 310], [0, 1], Easing.in(Easing.exp));

  const card = (
    file: string | null | undefined,
    label: string,
    tapeText: string,
    tapeColor: string,
    springVal: number,
    baseRotate: number,
    left: number,
    top: number
  ) => {
    const scale = interp(springVal, 2.5, 1);
    const rotate = interp(springVal, baseRotate * 4, baseRotate);
    const op = ci(springVal, [0, 0.15], [0, 1]);
    const blur = ci(springVal, [0, 1], [10, 0]);
    const exitX = cardsExitP * 1500;
    const exitRotate = cardsExitP * 30;
    return (
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: 460,
          height: 460,
          opacity: op,
          transform: `rotateZ(${rotate + exitRotate}deg) scale(${scale}) translateX(${exitX}px)`,
          filter: `blur(${blur}px)`,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            border: '15px solid white',
            boxShadow: `0 ${30 + op * 30}px 70px rgba(0,0,0,0.5)`,
          }}
        >
          <AssetImage file={file} label={label} tone="light" style={{ width: '100%', height: '100%' }} />
          <div
            style={{
              position: 'absolute',
              top: -26,
              left: '50%',
              transform: `translateX(-50%) rotate(${baseRotate > 0 ? -4 : 4}deg)`,
              backgroundColor: 'rgba(242,240,233,0.95)',
              padding: '10px 22px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
            }}
          >
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 900,
                fontSize: 30,
                letterSpacing: -1,
                color: tapeColor,
                whiteSpace: 'nowrap',
              }}
            >
              {tapeText}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: bgFadeIn }}>
      <AbsoluteFill style={{ backgroundColor: COLOR_CAUSA.paper }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(115deg, rgba(0,0,0,0.035) 0px, transparent 2px, transparent 6px),
            repeating-linear-gradient(25deg, rgba(0,0,0,0.025) 0px, transparent 3px, transparent 9px)`,
          mixBlendMode: 'multiply',
          opacity: 0.4,
        }}
      />
      <NoiseOverlay opacity={0.02} />
      <HalftoneOverlay opacity={0.03} />

      <AbsoluteFill style={{ transform: shake.transform }}>
        <div style={{ position: 'absolute', top: 260, left: 40, right: 40, textAlign: 'center' }}>
          <AnimatedText
            text="Como deputada federal,"
            wordDelays={[W(12), W(13), W(14)]}
            style={{ justifyContent: 'center' }}
            wordStyle={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 50, letterSpacing: -1, color: COLOR_CAUSA.textDark }}
          />
          <AnimatedText
            text="pretende defender mais:"
            wordDelays={[W(15), W(16), W(17)]}
            style={{ justifyContent: 'center', marginTop: 8 }}
            wordStyle={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 50, letterSpacing: -1, color: COLOR_CAUSA.textDark }}
          />
        </div>

        {card(assets.fotoMaos, 'PREVENÇÃO', 'PREVENÇÃO', COLOR_CAUSA.accent, p1, -5, 60, 470)}
        {card(assets.fotoEscola, 'EDUCAÇÃO NAS ESCOLAS', 'EDUCAÇÃO', COLOR_CAUSA.tea, p2, 8, 580, 470)}
        {card(assets.fotoAtendimento, 'ATENDIMENTO PSICOLÓGICO', 'ATENDIMENTO', COLOR_CAUSA.tea, p3, -2, 60, 970)}
        {card(assets.fotoAcolhimento, 'APOIO ÀS VÍTIMAS', 'APOIO ÀS VÍTIMAS', COLOR_CAUSA.accent, p4, 4, 580, 970)}
      </AbsoluteFill>

      {/* Tarja roxa diagonal — transição pra Cena 3 */}
      <AbsoluteFill
        style={{
          opacity: wipeP > 0 ? 1 : 0,
          transform: `translateX(${wipeX}px) skewX(-20deg)`,
          backgroundColor: COLOR_CAUSA.accent,
        }}
      />
    </AbsoluteFill>
  );
};

const interp = (v: number, from: number, to: number) => from + (to - from) * v;
