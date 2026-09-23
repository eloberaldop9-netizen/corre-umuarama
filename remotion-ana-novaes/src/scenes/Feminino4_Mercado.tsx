import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn } from '../lib/editorial';
import { FEMININO_SCENES, WORD } from '../feminino-timing';
import type { FemininoAssets } from '../feminino-timing';

// Cena 4 — A Expansão para o Mercado | frames locais 0–269
// "A proposta também busca ampliar o acesso ao crédito, às ferramentas
// digitais e às oportunidades de participação em feiras, novos mercados e
// compras públicas!"
// Papel off-white com grid estrutural fino, Crane Up lento. Grid editorial
// organizado de fotos (blocos com moldura branca, sombra precisa), cada uma
// entrando na palavra que ilustra, com fita amarela/bloco roxo colando o
// letreiro. Duas batidas:
//  A) AMPLIAR O ACESSO AO / CRÉDITO + maquininha de cartão e app no celular
//     (FERRAMENTAS DIGITAIS).
//  B) ÀS OPORTUNIDADES DE / PARTICIPAÇÃO EM: + feira (FEIRAS), pedidos
//     sendo despachados (NOVOS MERCADOS) e contrato assinado (COMPRAS
//     PÚBLICAS!).
// Saída: SUCÇÃO suave para o centro, o papel escurece para o roxo do selo.
const S = FEMININO_SCENES.c4;
const L = (f: number) => f - S.from;
const B_AT = L(610); // depois de DIGITAIS lido (pausa 606–612)
const EXIT = L(752); // "públicas!" termina em ~750

const Tile: React.FC<{ frame: number; at: number; file: string; w: number; h: number; pos: string; rot: number; children?: React.ReactNode }> = ({
  frame, at, file, w, h, pos, rot, children,
}) => {
  const p = ci(frame, [at - 4, at + 20], [0, 1], Easing.out(Easing.cubic));
  return (
    <div style={{ position: 'relative', opacity: p, filter: `blur(${12 * (1 - p)}px)`, transform: `translateY(${50 * (1 - p)}px) rotate(${rot}deg)` }}>
      <div style={{ background: '#FFFFFF', padding: 12, boxShadow: '0 30px 60px rgba(45,22,67,0.3)' }}>
        <div style={{ width: w, height: h, overflow: 'hidden' }}>
          <Img src={staticFile(`assets/${file}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'contrast(1.08) saturate(0.9)' }} />
        </div>
      </div>
      {children}
    </div>
  );
};

/** Fita/bloco com o letreiro, revelado da esquerda p/ direita (nada aparece antes da palavra). */
const Tape: React.FC<{ frame: number; at: number; bg: string; color: string; size: number; lines: string[]; style: React.CSSProperties; rot?: number }> = ({
  frame, at, bg, color, size, lines, style, rot = -2,
}) => {
  const t = ci(frame, [at, at + 12], [0, 100], Easing.out(Easing.cubic));
  return (
    <div style={{ position: 'absolute', opacity: t > 0 ? 1 : 0, clipPath: `inset(-20px ${100 - t}% -20px -20px)`, ...style }}>
      <div style={{ background: bg, padding: '12px 26px 8px', transform: `rotate(${rot}deg)`, boxShadow: '0 12px 28px rgba(45,22,67,0.3)' }}>
        {lines.map((l) => (
          <div key={l} style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: size, lineHeight: 1.02, letterSpacing: -2, color, whiteSpace: 'nowrap' }}>{l}</div>
        ))}
      </div>
    </div>
  );
};

export const Feminino4_Mercado: React.FC<{ assets: FemininoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const crane = ci(frame, [0, S.duration], [40, -40], Easing.inOut(Easing.cubic));
  const aOut = ci(frame, [B_AT, B_AT + 18], [0, 1], Easing.inOut(Easing.cubic));
  const sp = ci(frame, [EXIT, S.duration], [0, 1], Easing.inOut(Easing.cubic));
  const cred = ci(frame, [L(WORD.credito) - 4, L(WORD.credito) + 18], [0, 1], Easing.out(Easing.cubic));
  const part = ci(frame, [L(WORD.participacao) - 4, L(WORD.participacao) + 18], [0, 1], Easing.out(Easing.cubic));

  return (
    <AbsoluteFill style={{ backgroundColor: ED.paper, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          backgroundImage: 'linear-gradient(rgba(45,22,67,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(45,22,67,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px', backgroundPosition: `0 ${crane}px`,
        }}
      />
      <NoiseOverlay opacity={0.035} />

      <AbsoluteFill style={{ transform: `translateY(${crane}px) scale(${1 - sp}) rotate(${-15 * sp}deg)`, filter: `blur(${30 * sp}px)` }}>
        {/* Batida A — crédito e ferramentas digitais */}
        <AbsoluteFill style={{ opacity: 1 - aOut, transform: `translateY(${-160 * aOut}px)`, filter: `blur(${20 * aOut}px)` }}>
          <div style={{ position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontFamily: ED.sans, fontWeight: 800, fontSize: 44, color: ED.brandCore, ...edIn(frame, 3, { y: 12, trackFrom: -3, trackTo: 1 }) }}>
              A PROPOSTA TAMBÉM BUSCA
            </div>
            <div style={{ marginTop: 10, fontFamily: ED.sans, fontWeight: 900, fontSize: 66, color: ED.void, whiteSpace: 'nowrap', ...edIn(frame, L(WORD.ampliar2) - 2, { y: 16, trackFrom: -6, trackTo: -2 }) }}>
              AMPLIAR O ACESSO AO
            </div>
            <div
              style={{
                marginTop: 14, background: ED.yellow, border: `7px solid ${ED.void}`, padding: '14px 44px 6px', boxShadow: '0 30px 60px rgba(45,22,67,0.35)',
                opacity: cred, filter: `blur(${14 * (1 - cred)}px)`, transform: `translateY(${40 * (1 - cred)}px) rotate(-2deg) scale(${1.08 - 0.08 * cred})`,
              }}
            >
              <span style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 116, lineHeight: 1, letterSpacing: -4, color: ED.void, whiteSpace: 'nowrap' }}>CRÉDITO</span>
            </div>
          </div>
          <div style={{ position: 'absolute', top: 730, left: 80 }}>
            <Tile frame={frame} at={L(WORD.acesso)} file={assets.credito} w={420} h={500} pos="55% 50%" rot={-1.5} />
          </div>
          <div style={{ position: 'absolute', top: 750, left: 556 }}>
            <Tile frame={frame} at={L(WORD.ferramentas)} file={assets.digital} w={420} h={500} pos="30% 50%" rot={1.5}>
              <Tape frame={frame} at={L(WORD.ferramentas) + 4} bg={ED.void} color="#FFFFFF" size={40} lines={['ÀS FERRAMENTAS']} style={{ left: -30, bottom: 96 }} />
              <Tape frame={frame} at={L(WORD.digitais) - 2} bg={ED.yellow} color={ED.void} size={66} lines={['DIGITAIS']} style={{ left: -10, bottom: 18 }} rot={1.5} />
            </Tile>
          </div>
        </AbsoluteFill>

        {/* Batida B — participação em feiras, novos mercados e compras públicas */}
        <AbsoluteFill>
          <div style={{ position: 'absolute', top: 320, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 58, color: ED.void, whiteSpace: 'nowrap', ...edIn(frame, L(WORD.oportunidades2) + 4, { y: 16, trackFrom: -5, trackTo: -2 }) }}>
              ÀS OPORTUNIDADES DE
            </div>
            <div style={{ marginTop: 12, background: ED.void, padding: '12px 34px 6px', opacity: part, filter: `blur(${12 * (1 - part)}px)`, transform: `translateY(${30 * (1 - part)}px) rotate(-1.5deg)`, boxShadow: '0 24px 50px rgba(45,22,67,0.35)' }}>
              <span style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 76, lineHeight: 1, letterSpacing: -3, color: '#FFFFFF', whiteSpace: 'nowrap' }}>PARTICIPAÇÃO EM:</span>
            </div>
          </div>
          <div style={{ position: 'absolute', top: 560, left: 80 }}>
            <Tile frame={frame} at={L(WORD.feiras) - 2} file={assets.feira} w={896} h={380} pos="50% 35%" rot={-1}>
              <Tape frame={frame} at={L(WORD.feiras)} bg={ED.yellow} color={ED.void} size={84} lines={['FEIRAS']} style={{ left: -16, bottom: 26 }} />
            </Tile>
          </div>
          <div style={{ position: 'absolute', top: 1000, left: 80 }}>
            <Tile frame={frame} at={L(WORD.novos) - 2} file={assets.mercados} w={420} h={330} pos="50% 45%" rot={1}>
              <Tape frame={frame} at={L(WORD.novos) + 2} bg={ED.yellow} color={ED.void} size={50} lines={['NOVOS', 'MERCADOS']} style={{ left: -20, bottom: 20 }} />
            </Tile>
          </div>
          <div style={{ position: 'absolute', top: 1010, left: 556 }}>
            <Tile frame={frame} at={L(WORD.compras) - 2} file={assets.compras} w={420} h={330} pos="55% 60%" rot={-1}>
              <Tape frame={frame} at={L(WORD.compras) + 2} bg={ED.yellow} color={ED.void} size={50} lines={['COMPRAS', 'PÚBLICAS!']} style={{ right: -20, bottom: 20 }} rot={2} />
            </Tile>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: ED.void, opacity: ci(sp, [0.3, 1], [0, 1]) }} />
    </AbsoluteFill>
  );
};
