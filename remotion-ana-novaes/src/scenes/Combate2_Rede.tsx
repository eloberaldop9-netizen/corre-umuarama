import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, handheldShake, SPRING } from '../lib/motion';
import { NoiseOverlay, tornEdgeClipPath } from '../lib/Background';
import { AnimatedText } from '../lib/AnimatedText';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_COMBATE } from '../lib/palette-combate';
import { FONT } from '../lib/palette';
import type { CombateAssets } from '../VideoAnaNovaisCombate';

// Cena 2 — A Rede de Proteção (Mesa de Investigação, estilo jornal) | frames
// locais 0–324 (10.8s) — a maior cena do vídeo, porque a oração real é
// gigante (39 palavras). Transcrição real (forced alignment por blocos —
// esta oração precisou ser sub-dividida em 3 pedaços porque o DTW de uma
// oração de 20 palavras contínuas colapsava algumas palavras-função):
// "Como"@7 "deputada"@13 "federal,"@25 "pretende"@48 "defender"@61 "mais"@72
// "recursos"@83 "e"@97 "políticas"@97 "públicas"@113 "para"@128 "ampliar"@135
// "a"@140 "rede"@142 "de"@145 "proteção"@147 "às"@152 "vítimas,"@161
// "com"@161 "atendimento"@165 "especializado,"@168 "acolhimento"@184
// "seguro,"@186 "Patrulhas"@202 "Maria"@223 "da"@233 "Penha"@239 "e"@250
// "maior"@254 "acesso"@265 "a"@286 "mecanismos"@295 "de"@313 "proteção,"@314
// (fala termina ~323)
//
// Estrutura em 3 blocos (nenhum entra/sai junto — Mandamento 5):
// Bloco A (0–140): legenda fluida estabelece a frase.
// Bloco B (128–260): lettering HERO letra-por-letra "DEFENDER MAIS RECURSOS
//   E POLÍTICAS PÚBLICAS" domina — vira o elemento principal.
// Bloco C (184–324): lettering sai, fotos-recorte-de-jornal (acolhimento,
//   patrulha) com borda rasgada tomam a cena, legenda fluida continua embaixo.

const LETTER_STAGGER = 2;

const HeroWord: React.FC<{ text: string; startFrame: number; style?: React.CSSProperties }> = ({
  text,
  startFrame,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <span style={{ display: 'inline-flex', ...style }}>
      {text.split('').map((ch, i) => {
        const ws = startFrame + i * LETTER_STAGGER;
        const p = ci(frame, [ws, ws + 14], [0, 1], Easing.out(Easing.cubic));
        const y = ci(frame, [ws, ws + 14], [34, 0], Easing.out(Easing.cubic));
        const bl = ci(frame, [ws, ws + 9], [10, 0]);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${y}px)`,
              filter: `blur(${bl}px)`,
              whiteSpace: 'pre',
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};

const CARD_SPRING = { damping: 12, mass: 1 };

export const Combate2_Rede: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = ci(frame, [0, 15], [0, 1], Easing.out(Easing.quad));
  const shake = handheldShake(frame, 0.35);

  // Bloco B — lettering hero entra em grupo (defender@61) e sai antes das fotos dominarem
  const heroOp = ci(frame, [58, 74], [0, 1], Easing.out(Easing.cubic));
  const heroExitOp = ci(frame, [235, 258], [1, 0], Easing.in(Easing.exp));
  const heroExitY = ci(frame, [235, 258], [0, -50], Easing.in(Easing.exp));
  const heroExitBlur = ci(frame, [235, 258], [0, 16], Easing.in(Easing.exp));

  const cardAcolhimento = spring({ frame, fps, config: CARD_SPRING, delay: 184 });
  const cardPatrulha = spring({ frame, fps, config: CARD_SPRING, delay: 202 });

  // Saída (300–324) — WIPE DIAGONAL: tarja roxa varre a mesa, cards voam pra esquerda
  const wipeP = ci(frame, [300, 324], [0, 1], Easing.in(Easing.exp));
  const wipeX = interp(wipeP, -1400, 1400);
  const exitP = ci(frame, [297, 324], [0, 1], Easing.in(Easing.exp));

  const card = (
    file: string | null | undefined,
    label: string,
    creditText: string,
    springVal: number,
    baseRotate: number,
    left: number,
    top: number
  ) => {
    const scale = interp(springVal, 1.8, 1);
    const rotate = interp(springVal, baseRotate * 4, baseRotate);
    const op = ci(springVal, [0, 0.15], [0, 1]);
    const blur = ci(springVal, [0, 1], [10, 0]);
    const exitX = exitP * 1500;
    const exitRotate = exitP * 30;
    return (
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: 440,
          height: 420,
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
            backgroundColor: '#fff',
            padding: 14,
            boxShadow: `0 ${26 + op * 28}px 60px rgba(0,0,0,0.5)`,
            clipPath: tornEdgeClipPath(baseRotate + left, 'top'),
          }}
        >
          <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <AssetImage file={file} label={label} tone="light" style={{ width: '100%', height: '100%', filter: 'grayscale(0.15) contrast(1.05)' }} />
          </div>
        </div>
        {/* Legenda estilo crédito de foto de jornal */}
        <div
          style={{
            position: 'absolute',
            bottom: -34,
            left: 14,
            right: 14,
            textAlign: 'left',
            opacity: op,
          }}
        >
          <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: COLOR_COMBATE.yellow }}>
            {creditText}
          </span>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: bgOp }}>
      <AbsoluteFill style={{ backgroundColor: '#2A0F45' }} />
      {/* Textura de jornal — trama cruzada mais forte que qualquer outra cena do vídeo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(115deg, rgba(0,0,0,0.09) 0px, transparent 2px, transparent 5px),
            repeating-linear-gradient(25deg, rgba(0,0,0,0.07) 0px, transparent 3px, transparent 8px)`,
          mixBlendMode: 'multiply',
          opacity: 0.6,
        }}
      />
      <NoiseOverlay opacity={0.06} />

      {/* Kicker editorial — reforça o "estilo jornal" pedido */}
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: ci(frame, [0, 16], [0, 0.5]),
        }}
      >
        <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 22, letterSpacing: 8, color: COLOR_COMBATE.yellow }}>
          A REDE DE PROTEÇÃO
        </span>
      </div>

      <AbsoluteFill style={{ transform: shake.transform }}>
        {/* Bloco A — legenda fluida no topo, contínua ao longo da cena */}
        <div style={{ position: 'absolute', top: 168, left: 50, right: 50, textAlign: 'center' }}>
          <AnimatedText
            text="Como deputada federal, pretende"
            wordDelays={[7, 13, 25, 48]}
            exitStart={56}
            style={{ justifyContent: 'center', flexWrap: 'wrap' }}
            wordStyle={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 42, letterSpacing: -0.5, color: COLOR_COMBATE.textLight }}
          />
        </div>

        {/* Bloco B — HERO letra-por-letra */}
        <div
          style={{
            position: 'absolute',
            top: 620,
            left: 50,
            right: 50,
            textAlign: 'center',
            opacity: heroOp * heroExitOp,
            transform: `translateY(${heroExitY}px)`,
            filter: `blur(${heroExitBlur}px)`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 20px' }}>
            <HeroWord
              text="DEFENDER"
              startFrame={61}
              style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 88, letterSpacing: -2, color: COLOR_COMBATE.yellow, textShadow: '0 8px 30px rgba(0,0,0,0.6)' }}
            />
            <HeroWord
              text="MAIS"
              startFrame={72}
              style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 88, letterSpacing: -2, color: COLOR_COMBATE.yellow, textShadow: '0 8px 30px rgba(0,0,0,0.6)' }}
            />
            <HeroWord
              text="RECURSOS"
              startFrame={83}
              style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 88, letterSpacing: -2, color: COLOR_COMBATE.yellow, textShadow: '0 8px 30px rgba(0,0,0,0.6)' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 18px', marginTop: 4 }}>
            <HeroWord
              text="E"
              startFrame={97}
              style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 62, letterSpacing: -1, color: COLOR_COMBATE.textLight, textShadow: '0 6px 24px rgba(0,0,0,0.6)' }}
            />
            <HeroWord
              text="POLÍTICAS"
              startFrame={100}
              style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 62, letterSpacing: -1, color: COLOR_COMBATE.textLight, textShadow: '0 6px 24px rgba(0,0,0,0.6)' }}
            />
            <HeroWord
              text="PÚBLICAS"
              startFrame={113}
              style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 62, letterSpacing: -1, color: COLOR_COMBATE.textLight, textShadow: '0 6px 24px rgba(0,0,0,0.6)' }}
            />
          </div>
        </div>

        {/* Bloco A (continuação) — legenda fluida do restante da frase, abaixo do hero */}
        <div style={{ position: 'absolute', top: 930, left: 50, right: 50, textAlign: 'center' }}>
          <AnimatedText
            text="para ampliar a rede de proteção às vítimas,"
            wordDelays={[128, 135, 140, 142, 145, 147, 152, 161]}
            exitStart={205}
            style={{ justifyContent: 'center', flexWrap: 'wrap' }}
            wordStyle={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 34, letterSpacing: 0, color: 'rgba(255,255,255,0.88)' }}
          />
        </div>

        {/* Bloco C — fotos estilo recorte de jornal (borda rasgada) */}
        {card(assets.fotoAcolhimento, 'ACOLHIMENTO SEGURO', 'ATENDIMENTO ESPECIALIZADO · ACOLHIMENTO', cardAcolhimento, -4, 80, 1060)}
        {card(assets.fotoPatrulha, 'PATRULHA MARIA DA PENHA', 'PATRULHAS MARIA DA PENHA', cardPatrulha, 5, 560, 1360)}

        {/* Legenda fluida final — ponte pra Cena 3 */}
        <div style={{ position: 'absolute', top: 250, left: 50, right: 50, textAlign: 'center' }}>
          <AnimatedText
            text="e maior acesso a mecanismos de proteção,"
            wordDelays={[250, 254, 265, 286, 295, 313, 314]}
            style={{ justifyContent: 'center', flexWrap: 'wrap' }}
            wordStyle={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 38, letterSpacing: -0.3, color: COLOR_COMBATE.textLight }}
          />
        </div>
      </AbsoluteFill>

      {/* Tarja roxa diagonal — transição pra Cena 3 */}
      <AbsoluteFill
        style={{
          opacity: wipeP > 0 ? 1 : 0,
          transform: `translateX(${wipeX}px) skewX(-20deg)`,
          backgroundColor: COLOR_COMBATE.brandCore,
        }}
      />
    </AbsoluteFill>
  );
};

const interp = (v: number, from: number, to: number) => from + (to - from) * v;
