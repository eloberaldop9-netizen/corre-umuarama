import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../lib/motion';
import { Cutout, Grain, NewsprintTexture, Tape, tornPolygon } from '../lib/collage';
import { KineticCaption } from '../lib/KineticCaption';
import { COLOR_PROTECAO as C, FONT_PROTECAO as F, TRACK } from '../lib/palette-protecao';
import { CAPTION_PAGES, PROTECAO_SCENES, wf } from '../protecao-timing';
import type { ProtecaoAssets } from '../VideoAnaNovaisProtecao';

// Cena 2 — O Dossiê da Prevenção | frames locais 0–309
// "Como deputada federal, pretende defender mais prevenção, educação nas
// escolas e ampliação do atendimento psicológico e social às vítimas."
// Mesa de recortes em papel jornal, câmera em Pan horizontal. Cada foto e
// cada recorte-manchete cai na mesa no frame da palavra. Legenda estilo
// "carta de resgate" (cada palavra um recorte diferente).
// Saída: WIPE RASGADO — folha roxa rasgada varre da direita e arrasta tudo.
const S = PROTECAO_SCENES.c2;
const L = (i: number) => wf(i) - S.from;
const EXIT = 290;
const HEAVY = { damping: 12, mass: 1.3 };

export const Protecao2_Dossie: React.FC<{ assets: ProtecaoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flash = ci(frame, [0, 10], [1, 0], Easing.out(Easing.quad)); // resto do amarelo da Cena 1
  const pan = ci(frame, [0, S.duration], [80, -540], Easing.inOut(Easing.quad));

  // Saída
  const xp = ci(frame, [EXIT + 3, S.duration], [0, 1], Easing.in(Easing.exp));
  const wipeX = ci(frame, [EXIT, S.duration], [1250, -320], Easing.in(Easing.exp));
  const stageExit = `translateX(${-1500 * xp}px) rotate(${-15 * xp}deg)`;
  const exitBlur = 20 * xp;

  // Queda de foto na mesa (spring pesado)
  const drop = (delay: number, rot: number) => {
    const sp = spring({ frame, fps, config: HEAVY, delay });
    return {
      opacity: ci(frame, [delay, delay + 5], [0, 1]),
      transform: `scale(${ci(sp, [0, 1], [3, 1])}) rotate(${ci(sp, [0, 1], [rot + 15, rot])}deg)`,
      filter: `blur(${ci(frame, [delay, delay + 12], [20, 0])}px)`,
    };
  };
  // Recorte-manchete: pop com back
  const pop = (delay: number, rot: number) => {
    const sc = ci(frame, [delay, delay + 14], [0.7, 1], Easing.out(Easing.back(1.5)));
    return {
      opacity: ci(frame, [delay, delay + 4], [0, 1]),
      transform: `scale(${sc}) rotate(${rot}deg)`,
      filter: `blur(${ci(frame, [delay, delay + 8], [10, 0])}px)`,
    };
  };
  // Fita amarela que abre L→R revelando o texto
  const tapeWipe = (delay: number) => ci(frame, [delay, delay + 12], [0, 100], Easing.out(Easing.cubic));

  // Masthead
  const mastSp = spring({ frame, fps, config: { damping: 14, mass: 0.8 }, delay: L(13) });
  const ruleW = ci(frame, [L(12), L(12) + 18], [0, 100], Easing.out(Easing.cubic));

  const atendW = tapeWipe(L(25));

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: 'hidden' }}>
      <NewsprintTexture opacity={0.12} />
      <Grain opacity={0.35} blend="multiply" />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(45,22,67,0.18) 100%)' }} />

      {/* Masthead de jornal — "DEPUTADA FEDERAL" */}
      <div style={{ position: 'absolute', top: 100, left: 60, right: 60, filter: `blur(${exitBlur}px)`, transform: `translateX(${-1200 * xp}px)` }}>
        <div style={{ height: 6, width: `${ruleW}%`, background: C.ink }} />
        <div
          style={{
            textAlign: 'center', padding: '14px 0 8px',
            fontFamily: F.serif, fontWeight: 900, fontSize: 96, letterSpacing: TRACK, color: C.ink, lineHeight: 1,
            opacity: ci(frame, [L(13), L(13) + 5], [0, 1]),
            transform: `translateY(${ci(mastSp, [0, 1], [30, 0])}px)`,
          }}
        >
          Deputada Federal
        </div>
        <div style={{ height: 2, width: `${ruleW}%`, background: C.ink, marginLeft: 'auto' }} />
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', padding: '8px 4px 0',
            fontFamily: F.type, fontSize: 26, letterSpacing: TRACK, color: C.ink,
            opacity: ci(frame, [L(14), L(14) + 8], [0, 0.85]),
          }}
        >
          <span>DOSSIÊ Nº 04</span>
          <span>PROPOSTAS · ANA NOVAIS</span>
        </div>
      </div>

      {/* MESA — Pan horizontal */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, width: 1700, height: 1920,
          transform: `translateX(${pan}px) ${stageExit}`, filter: `blur(${exitBlur}px)`,
        }}
      >
        {/* Retalhos de fundo */}
        <div style={{ position: 'absolute', top: 470, left: 330, width: 720, height: 420, background: C.lilacSoft, clipPath: tornPolygon(5, 4), transform: 'rotate(3deg)' }}>
          <NewsprintTexture opacity={0.25} />
        </div>
        <div style={{ position: 'absolute', top: 360, left: 1020, width: 520, height: 300, background: C.yellow, clipPath: tornPolygon(9, 5), transform: 'rotate(-5deg)', opacity: 0.9 }} />

        {/* PREVENÇÃO — laço roxo + tarja preta */}
        <div style={{ position: 'absolute', top: 420, left: 110, width: 250, height: 400, ...drop(L(18) - 4, -6) }}>
          <Cutout file={assets.fotoLaco} width={250} height={400} seed={61} border={10} />
        </div>
        <div style={{ position: 'absolute', top: 850, left: 70, ...pop(L(18), 3) }}>
          <div style={{ background: C.ink, padding: '12px 24px 8px', boxShadow: '8px 8px 0 rgba(122,75,148,0.9)' }}>
            <span style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 70, letterSpacing: TRACK, color: C.textLight }}>PREVENÇÃO</span>
          </div>
        </div>

        {/* EDUCAÇÃO NAS ESCOLAS */}
        <div style={{ position: 'absolute', top: 380, left: 470, width: 500, height: 580, ...drop(L(19) - 3, 4) }}>
          <Cutout file={assets.fotoEscola} width={500} height={580} seed={71} border={14} objectPosition="40% 40%" />
        </div>
        <div style={{ position: 'absolute', top: 990, left: 470, ...pop(L(19), -4) }}>
          <Tape width={500} height={104} rotate={0} seed={8}>
            <span style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 74, letterSpacing: TRACK, color: C.voidDeep }}>EDUCAÇÃO</span>
          </Tape>
        </div>
        <div style={{ position: 'absolute', top: 1085, left: 610, ...pop(L(21), 5) }}>
          <div style={{ background: C.paper, padding: '6px 18px 2px', border: `3px solid ${C.ink}` }}>
            <span style={{ fontFamily: F.type, fontSize: 48, letterSpacing: TRACK, color: C.ink }}>nas escolas</span>
          </div>
        </div>

        {/* ATENDIMENTO psicológico e social */}
        <div style={{ position: 'absolute', top: 420, left: 880, width: 540, height: 500, ...drop(L(25) - 5, -5) }}>
          <Cutout file={assets.fotoAtendimento} width={540} height={500} seed={83} border={14} />
        </div>
        <div style={{ position: 'absolute', top: 300, left: 880, width: 600, height: 110, opacity: ci(frame, [L(25), L(25) + 2], [0, 1]) }}>
          <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - atendW}% 0 0)` }}>
            <Tape width={600} height={110} rotate={-2} seed={12}>
              <span style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 70, letterSpacing: TRACK, color: C.voidDeep }}>ATENDIMENTO</span>
            </Tape>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 960, left: 1260, width: 300, height: 280, ...drop(L(26) - 2, 7) }}>
          <Cutout file={assets.fotoMente} width={300} height={280} seed={97} border={10} />
        </div>
        <div style={{ position: 'absolute', top: 1000, left: 1000, ...pop(L(26), -3) }}>
          <div style={{ background: C.voidDeep, padding: '8px 18px 4px' }}>
            <span style={{ fontFamily: F.serif, fontStyle: 'italic', fontWeight: 900, fontSize: 52, letterSpacing: TRACK, color: C.yellow }}>psicológico</span>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 1110, left: 1060, ...pop(L(28), 4) }}>
          <div style={{ background: C.lilac, padding: '8px 18px 4px' }}>
            <span style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 52, letterSpacing: TRACK, color: C.ink }}>e SOCIAL</span>
          </div>
        </div>
      </div>

      {/* Recorte de jornal em primeiro plano — base da mesa */}
      <div
        style={{
          position: 'absolute', top: 1520, left: -40, right: -40, height: 480, background: C.newsprint,
          clipPath: tornPolygon(41, 4), transform: `rotate(-2deg) translateX(${-1500 * xp}px)`, filter: `blur(${exitBlur}px) drop-shadow(0 -10px 20px rgba(0,0,0,0.2))`,
        }}
      >
        <NewsprintTexture opacity={0.5} />
        <div style={{ position: 'absolute', top: 60, left: 80, right: 80, height: 10, background: C.voidDeep }} />
      </div>
      <div style={{ position: 'absolute', top: 1470, left: 110, transform: `rotate(-6deg) translateX(${-1500 * xp}px)`, opacity: 0.95 }}>
        <Tape width={220} height={56} color="rgba(217,194,230,0.9)" />
      </div>

      {/* Legenda "carta de resgate" — fixa, fora do pan */}
      <div style={{ position: 'absolute', top: 1190, left: 0, right: 0, bottom: 0 }}>
        <KineticCaption
          pages={CAPTION_PAGES.c2}
          sceneFrom={S.from}
          variant="ransom"
          exitAt={EXIT}
          top={40}
          fontSize={58}
          emphasis={{ 18: 'tape', 19: 'tape', 25: 'box', 30: 'box' }}
        />
      </div>

      {/* WIPE RASGADO — folha roxa com borda rasgada varre da direita */}
      <div
        style={{
          position: 'absolute', top: -200, bottom: -200, left: 0, width: 1800,
          transform: `translateX(${wipeX}px) rotate(-6deg)`,
          background: C.voidDeep,
          clipPath: 'polygon(6% 0%, 2% 8%, 7% 15%, 1% 24%, 5% 33%, 0% 42%, 6% 51%, 2% 60%, 7% 69%, 1% 78%, 5% 87%, 0% 95%, 4% 100%, 100% 100%, 100% 0%)',
          filter: 'drop-shadow(-20px 0 30px rgba(0,0,0,0.5))',
        }}
      >
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 110, background: C.paper, clipPath: 'polygon(0% 0%, 60% 5%, 20% 12%, 70% 20%, 10% 30%, 55% 40%, 15% 50%, 65% 60%, 5% 70%, 50% 80%, 20% 90%, 60% 100%, 0% 100%)', opacity: 0.8 }} />
      </div>

      <AbsoluteFill style={{ backgroundColor: C.yellow, opacity: flash }} />
    </AbsoluteFill>
  );
};
