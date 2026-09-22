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
// locais 0–324 (10.8s). Transcrição real (offset de from=115):
// "pretende"@48 "defender"@61 "mais"@72 "recursos"@83 "e"@97 "políticas"@97
// "públicas"@113 ... "com"@161 "atendimento"@165 "especializado"@168
// "acolhimento"@184 "seguro"@186 "Patrulhas"@202 "Maria"@223 "da"@233
// "Penha"@239 ... "botão"@470-115=355 (na Cena 3)
//
// v3: só os LETTRINGS EM DESTAQUE pedidos, um de cada vez, no MESMO padrão
// já aprovado (AnimatedText word-by-word + spring, nunca letra-por-letra,
// nunca vários textos simultâneos brigando pela atenção). Nada de legenda
// corrida cobrindo a fala inteira — só: "DEFENDER MAIS RECURSOS E POLÍTICAS
// PÚBLICAS" → "COM ATENDIMENTO ESPECIALIZADO" → "ACOLHIMENTO SEGURO" →
// "PATRULHAS MARIA DA PENHA", cada um sumindo antes do próximo entrar.
const CARD_SPRING = { damping: 12, mass: 1 };

export const Combate2_Rede: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = ci(frame, [0, 15], [0, 1], Easing.out(Easing.quad));
  const shake = handheldShake(frame, 0.3);

  const cardAcolhimento = spring({ frame, fps, config: CARD_SPRING, delay: 184 });
  const cardPatrulha = spring({ frame, fps, config: CARD_SPRING, delay: 202 });

  // Saída (300–324) — WIPE DIAGONAL: tarja roxa varre a mesa, cards voam pra esquerda
  const wipeP = ci(frame, [300, 324], [0, 1], Easing.in(Easing.exp));
  const wipeX = interp(wipeP, -1400, 1400);
  const exitP = ci(frame, [297, 324], [0, 1], Easing.in(Easing.exp));

  const card = (
    file: string | null | undefined,
    label: string,
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
      </div>
    );
  };

  // Um único slot de "hero" central — as 4 frases se revezam nele, nunca
  // duas ao mesmo tempo (padrão aprovado: entra, segura, sai, próxima entra).
  const hero = (text: string, wordDelays: number[], holdUntil: number, exitDur = 16) => {
    const lastWordEnd = wordDelays[wordDelays.length - 1] + 22;
    const exitStart = Math.max(holdUntil, lastWordEnd + 10);
    const op = ci(frame, [exitStart, exitStart + exitDur], [1, 0], Easing.in(Easing.exp));
    const blur = ci(frame, [exitStart, exitStart + exitDur], [0, 14], Easing.in(Easing.exp));
    const y = ci(frame, [exitStart, exitStart + exitDur], [0, -36], Easing.in(Easing.exp));
    return (
      <div style={{ opacity: op, filter: `blur(${blur}px)`, transform: `translateY(${y}px)` }}>
        <AnimatedText
          text={text}
          wordDelays={wordDelays}
          style={{ justifyContent: 'center', flexWrap: 'wrap' }}
          wordStyle={{
            fontFamily: FONT.sans,
            fontWeight: 900,
            fontSize: 54,
            letterSpacing: -2,
            color: COLOR_COMBATE.yellow,
            textShadow: '0 8px 30px rgba(0,0,0,0.6)',
          }}
        />
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: bgOp }}>
      <AbsoluteFill style={{ backgroundColor: '#2A0F45' }} />
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
        {/* Slot único de hero — centralizado, uma frase de cada vez */}
        <div style={{ position: 'absolute', top: 640, left: 80, right: 80, textAlign: 'center' }}>
          {frame < 168 && hero('DEFENDER MAIS RECURSOS E POLÍTICAS PÚBLICAS', [61, 72, 83, 97, 100, 113], 150)}
          {frame >= 140 && frame < 218 && hero('COM ATENDIMENTO ESPECIALIZADO', [161, 165, 168], 195)}
          {frame >= 175 && frame < 253 && hero('ACOLHIMENTO SEGURO', [184, 186], 235)}
          {frame >= 190 && frame < 303 && hero('PATRULHAS MARIA DA PENHA', [202, 223, 233, 239], 285)}
        </div>

        {card(assets.fotoAcolhimento, 'ACOLHIMENTO SEGURO', cardAcolhimento, -4, 80, 1060)}
        {card(assets.fotoPatrulha, 'PATRULHA MARIA DA PENHA', cardPatrulha, 5, 560, 1360)}
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
