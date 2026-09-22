import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, handheldShake } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { AnimatedText } from '../lib/AnimatedText';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_COMBATE } from '../lib/palette-combate';
import { FONT } from '../lib/palette';
import type { CombateAssets } from '../VideoAnaNovaisCombate';

// Cena 2 — A Rede de Proteção (Colagem/Mesa) | frames locais 0–324 (10.8s)
// VERBO v5.0. Transcrição real (offset from=115) — oração gigante (39
// palavras), por isso a cena é bem mais longa que a diretriz original
// assumia: "pretende"@48 "defender"@61 "mais"@72 "recursos"@83 "e"@97
// "políticas"@97 "públicas"@113 ... "acolhimento"@184 "seguro"@186
// "Patrulhas"@202 "Maria"@223 "da"@233 "Penha"@239 ... "proteção,"@314
// Câmera handheld contínua (nunca parada), luz pendente piscando, cards
// tipo polaroide (borda branca grossa) com fita amarela, batendo na mesa
// exatamente quando a palavra correspondente é dita.
const CARD_SPRING = { damping: 12, mass: 1 };

const heroWordStyle = {
  fontFamily: FONT.sans,
  fontWeight: 800,
  fontSize: 46,
  letterSpacing: -1,
  color: COLOR_COMBATE.yellow,
  textShadow: '0 8px 30px rgba(0,0,0,0.6)',
} as const;

export const Combate2_Rede: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = ci(frame, [0, 15], [0, 1], Easing.out(Easing.quad));
  const shake = handheldShake(frame, 0.4);
  const panX = ci(frame, [0, 324], [-20, 30], Easing.inOut(Easing.quad));

  // Luz pendente — flicker contínuo estilo lâmpada de arquivo
  const lampFlicker = 0.35 + Math.sin(frame * 0.08) * 0.05 + Math.sin(frame * 0.23) * 0.03;

  const cardAcolhimento = spring({ frame, fps, config: CARD_SPRING, delay: 184 });
  const cardPatrulha = spring({ frame, fps, config: CARD_SPRING, delay: 202 });

  const tapeRecursosOp = ci(frame, [83, 96], [0, 1], Easing.out(Easing.cubic));
  const tapeRecursosScale = ci(frame, [83, 94], [0, 1], Easing.out(Easing.cubic));
  const tapePatrulhaOp = ci(frame, [202, 215], [0, 1], Easing.out(Easing.cubic));
  const tapePatrulhaScale = ci(frame, [202, 213], [0, 1], Easing.out(Easing.cubic));

  // Saída (290–318) — WIPE VARRE: bloco roxo atropela os cards pra fora
  // exatamente quando o texto some (~290), varrendo até o handoff com a
  // Cena 3 (overlap de 7 frames, local 317) — sem hold morto no meio.
  const wipeP = ci(frame, [292, 318], [0, 1], Easing.in(Easing.exp));
  const wipeX = interp(wipeP, -1400, 1400);
  const exitP = ci(frame, [290, 316], [0, 1], Easing.in(Easing.exp));

  const card = (
    file: string | null | undefined,
    label: string,
    springVal: number,
    baseRotate: number,
    left: number,
    top: number
  ) => {
    const scale = interp(springVal, 2.2, 1);
    const rotate = interp(springVal, baseRotate * 3, baseRotate);
    const op = ci(springVal, [0, 0.15], [0, 1]);
    const blur = ci(springVal, [0, 1], [16, 0]);
    const exitX = exitP * 1500;
    const exitRotate = exitP * (baseRotate < 0 ? -35 : 25);
    return (
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: 440,
          height: 440,
          opacity: op,
          transform: `rotateZ(${rotate + exitRotate}deg) scale(${scale}) translateX(${exitX}px)`,
          filter: `blur(${blur + exitP * 20}px)`,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            border: '16px solid #fff',
            boxShadow: `0 ${30 + op * 30}px 60px rgba(0,0,0,0.8)`,
            overflow: 'hidden',
          }}
        >
          <AssetImage file={file} label={label} tone="light" style={{ width: '100%', height: '100%', filter: 'contrast(1.05)' }} />
        </div>
      </div>
    );
  };

  const tape = (text: string, op: number, scale: number, left: number, top: number, rotate: number) => (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        opacity: op,
        transform: `scaleX(${scale}) rotate(${rotate}deg)`,
        transformOrigin: 'left center',
        backgroundColor: 'rgba(252,227,0,0.95)',
        padding: '10px 28px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
        zIndex: 10,
      }}
    >
      <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 34, letterSpacing: 1, color: COLOR_COMBATE.voidDeep, whiteSpace: 'nowrap' }}>
        {text}
      </span>
    </div>
  );

  return (
    <AbsoluteFill style={{ opacity: bgOp }}>
      <AbsoluteFill style={{ backgroundColor: '#3A1254' }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(115deg, rgba(0,0,0,0.09) 0px, transparent 2px, transparent 5px),
            repeating-linear-gradient(25deg, rgba(0,0,0,0.07) 0px, transparent 3px, transparent 8px)`,
          mixBlendMode: 'multiply',
          opacity: 0.55,
        }}
      />
      {/* Luz pendente — circulo de luz que acompanha a câmera, sempre viva */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          width: 900,
          height: 900,
          marginLeft: -450,
          marginTop: -450,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,235,180,${lampFlicker}) 0%, transparent 65%)`,
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

      <AbsoluteFill style={{ transform: `${shake.transform} translateX(${panX}px)` }}>
        {/* Slot de hero — 4 frases empilhadas na mesma caixa, cada uma com
            seu próprio wordDelays + exitStart (handoff automático). */}
        <div style={{ position: 'absolute', top: 640, left: 80, right: 80, height: 160 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center' }}>
            <AnimatedText
              text="DEFENDER MAIS RECURSOS"
              wordDelays={[61, 72, 83]}
              exitStart={140}
              style={{ justifyContent: 'center' }}
              wordStyle={heroWordStyle}
            />
            <AnimatedText
              text="E POLÍTICAS PÚBLICAS"
              wordDelays={[97, 100, 113]}
              exitStart={140}
              style={{ justifyContent: 'center', marginTop: 4 }}
              wordStyle={heroWordStyle}
            />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center' }}>
            <AnimatedText
              text="COM ATENDIMENTO ESPECIALIZADO"
              wordDelays={[161, 165, 168]}
              exitStart={177}
              style={{ justifyContent: 'center', flexWrap: 'wrap' }}
              wordStyle={heroWordStyle}
            />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center' }}>
            <AnimatedText
              text="ACOLHIMENTO SEGURO"
              wordDelays={[184, 186]}
              exitStart={195}
              style={{ justifyContent: 'center' }}
              wordStyle={heroWordStyle}
            />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center' }}>
            <AnimatedText
              text="PATRULHAS MARIA DA PENHA"
              wordDelays={[202, 223, 233, 239]}
              exitStart={270}
              style={{ justifyContent: 'center', flexWrap: 'wrap' }}
              wordStyle={heroWordStyle}
            />
          </div>
        </div>

        {/* Cards tipo polaroide — batem na mesa quando a palavra é dita */}
        {card(assets.fotoAcolhimento, 'ACOLHIMENTO SEGURO', cardAcolhimento, -6, 90, 1080)}
        {card(assets.fotoPatrulha, 'PATRULHA MARIA DA PENHA', cardPatrulha, 8, 550, 1380)}
        {tape('RECURSOS', tapeRecursosOp, tapeRecursosScale, 90, 990, -3)}
        {tape('PATRULHA', tapePatrulhaOp, tapePatrulhaScale, 560, 1310, 5)}
      </AbsoluteFill>

      {/* Bloco roxo diagonal — WIPE VARRE pra Cena 3 */}
      <AbsoluteFill
        style={{
          opacity: wipeP > 0 ? 1 : 0,
          transform: `translateX(${wipeX}px) skewX(-20deg)`,
          backgroundColor: COLOR_COMBATE.voidDeep,
        }}
      />
    </AbsoluteFill>
  );
};

const interp = (v: number, from: number, to: number) => from + (to - from) * v;
