import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn } from '../lib/editorial';
import { LineIcon } from '../lib/LineIcon';
import { BEATS, VM_ASSETS as A, WORD, g } from '../vmulher-timing';

// Vídeo 03 (refeito) — Violência contra a Mulher, na voz da própria Ana.
// Modelo de motion da referência (vídeo do Senado): fotos reais de mulheres
// em ambientes escuros, tela cheia com Ken Burns lento e véu roxo; texto
// branco centralizado em Montserrat; infográficos limpos (calendário,
// pictogramas, linha do tempo, barras) em lilás/amarelo da paleta da Ana.
// Abre e fecha com a CAPA: a foto da mão + UNIDAS CONSEGUIREMOS VENCER ESSA
// BATALHA. Tudo entra com Easing.out(cubic) + blur, sem springs, ancorado
// na palavra falada; trocas de batida nas pausas reais, em crossfade.

type Beat = { from: number; to: number };
const lf = (beat: Beat, audioWord: number) => g(audioWord) - beat.from;

/** Raiz de cada batida: crossfade de 10 frames sobre a anterior. */
const BeatRoot: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = ED.void }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: bg, overflow: 'hidden', opacity: ci(frame, [0, 10], [0, 1]) }}>{children}</AbsoluteFill>;
};

/** Foto em tela cheia no estilo da referência: Ken Burns lento, escurecida, véu roxo. */
const PhotoBg: React.FC<{ file: string; dur: number; pos?: string; zoom?: [number, number]; bright?: number; gray?: boolean; bottomDark?: boolean }> = ({
  file, dur, pos = '50% 50%', zoom = [1.04, 1.14], bright = 0.5, gray = false, bottomDark = false,
}) => {
  const frame = useCurrentFrame();
  const z = ci(frame, [0, dur], zoom);
  return (
    <AbsoluteFill>
      <Img src={staticFile(`assets/${file}`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${z})`, transformOrigin: pos, filter: `brightness(${bright}) saturate(${gray ? 0 : 0.55}) contrast(1.08)` }} />
      <AbsoluteFill style={{ background: 'rgba(60,28,90,0.28)', mixBlendMode: 'multiply' }} />
      <AbsoluteFill style={{ background: bottomDark ? 'linear-gradient(to bottom, rgba(20,8,30,0.55) 0%, rgba(20,8,30,0) 30%, rgba(20,8,30,0.15) 45%, rgba(20,8,30,0.92) 72%)' : 'linear-gradient(to bottom, rgba(20,8,30,0.5) 0%, rgba(20,8,30,0.1) 30%, rgba(20,8,30,0.28) 60%, rgba(20,8,30,0.7) 100%)' }} />
      <NoiseOverlay opacity={0.05} />
    </AbsoluteFill>
  );
};

/** Linha de texto centralizada que "foca" na palavra. */
const Line: React.FC<{ at: number; top: number; size: number; color?: string; weight?: number; track?: [number, number]; children: React.ReactNode }> = ({
  at, top, size, color = '#FFFFFF', weight = 900, track = [-5, -2], children,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', top, left: 0, right: 0, textAlign: 'center' }}>
      <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: weight, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap', textShadow: '0 10px 36px rgba(0,0,0,0.75)', ...edIn(frame, Math.max(2, at), { dur: 22, y: 18, blur: 15, trackFrom: track[0], trackTo: track[1] }) }}>
        {children}
      </span>
    </div>
  );
};

const useIn = (at: number, dur = 20) => {
  const frame = useCurrentFrame();
  return ci(frame, [Math.max(0, at) - 4, Math.max(0, at) + dur], [0, 1], Easing.out(Easing.cubic));
};

/* ─────────────────────────── CAPA ─────────────────────────── */

const PurpleTexture: React.FC = () => (
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 45% 30%, #A97CC6 0%, #8B58A8 55%, #5E2F7A 100%)' }}>
    <AbsoluteFill style={{ opacity: 0.22, mixBlendMode: 'multiply', backgroundImage: 'repeating-linear-gradient(115deg, rgba(40,10,60,0.5) 0 1px, transparent 1px 9px), repeating-linear-gradient(35deg, rgba(40,10,60,0.35) 0 1px, transparent 1px 13px)' }} />
    <NoiseOverlay opacity={0.12} />
  </AbsoluteFill>
);

/** Composição da capa (foto da mão + UNIDAS CONSEGUIREMOS VENCER ESSA BATALHA).
 * `reveal` = frames de entrada de cada palavra; sem reveal tudo já está na tela
 * no frame 0 (a primeira imagem do vídeo é a capa do Reels). */
const CoverArt: React.FC<{ reveal?: number[]; anaIn?: number }> = ({ reveal, anaIn = 1 }) => {
  const frame = useCurrentFrame();
  const word = (i: number) => (reveal ? edIn(frame, reveal[i], { dur: 20, y: 24, blur: 14, trackFrom: 2, trackTo: -2 }) : {});
  const solid: React.CSSProperties = { fontFamily: ED.sans, fontWeight: 900, lineHeight: 0.95, color: '#FFFFFF', whiteSpace: 'nowrap', textShadow: '0 10px 40px rgba(40,10,60,0.45)' };
  const outline: React.CSSProperties = { ...solid, color: 'transparent', WebkitTextStroke: '4px #FFFFFF', textShadow: 'none' };
  const cut = staticFile(`assets/${A.anaMaoCutout}`);
  return (
    <AbsoluteFill>
      <PurpleTexture />
      {/* Ana — corte inferior e lateral direito da foto ficam fora do quadro */}
      <div style={{ position: 'absolute', top: 760, left: -40, width: 1200, opacity: anaIn, transform: `translateY(${120 * (1 - anaIn)}px)` }}>
        <Img src={cut} style={{ display: 'block', width: 1200, filter: 'grayscale(1) contrast(1.12) brightness(1.02) drop-shadow(0 30px 60px rgba(30,5,50,0.5))' }} />
      </div>
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ ...solid, fontSize: 196, letterSpacing: -4, ...word(0) }}>UNIDAS</div>
        <div style={{ ...solid, fontSize: 80, letterSpacing: 1, marginTop: 6, ...word(1) }}>CONSEGUIREMOS</div>
        <div style={{ ...solid, fontSize: 176, letterSpacing: -2, marginTop: 8, ...word(2) }}>VENCER</div>
        <div style={{ ...outline, fontSize: 176, letterSpacing: -2, ...word(3) }}>ESSA</div>
        <div style={{ ...outline, fontSize: 150, letterSpacing: 4, ...word(4) }}>BATALHA</div>
      </div>
    </AbsoluteFill>
  );
};

export const VM_Capa: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = BEATS.capa.to - BEATS.capa.from;
  const z = ci(frame, [0, dur], [1, 1.04]);
  const out = ci(frame, [dur - 16, dur], [1, 0], Easing.in(Easing.cubic));
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, opacity: out }}>
        <CoverArt />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ─────────────── 1 · LEI MARIA DA PENHA (07/08/2006) ─────────────── */

export const VM_Lei: React.FC = () => {
  const B = BEATS.lei;
  const L = (w: number) => lf(B, w);
  const card = useIn(L(WORD.no) + 2, 24);
  const head = useIn(L(WORD.agosto), 16);
  const year = useIn(L(WORD.ano), 16);
  const pill = useIn(L(WORD.penha) + 6, 16);
  const frame = useCurrentFrame();
  return (
    <BeatRoot>
      <PhotoBg file={A.janela} dur={B.to - B.from} pos="40% 40%" bright={0.85} />
      {/* Calendário */}
      <div style={{ position: 'absolute', top: 300, left: 350, width: 380, opacity: card, transform: `translateY(${50 * (1 - card)}px) rotate(-2deg)`, filter: `blur(${12 * (1 - card)}px)` }}>
        <div style={{ background: '#FFFFFF', borderRadius: 26, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.55)' }}>
          <div style={{ background: ED.brandCore, padding: '18px 0 14px', textAlign: 'center', fontFamily: ED.sans, fontWeight: 900, fontSize: 52, color: '#FFFFFF', letterSpacing: 2, opacity: head }}>AGOSTO</div>
          <div style={{ textAlign: 'center', fontFamily: ED.sans, fontWeight: 900, fontSize: 200, lineHeight: 1.05, color: ED.void, letterSpacing: -8, ...edIn(frame, L(WORD.sete), { dur: 18, y: 10, blur: 12, trackFrom: -14, trackTo: -8 }) }}>07</div>
          <div style={{ textAlign: 'center', fontFamily: ED.sans, fontWeight: 800, fontSize: 50, color: ED.brandCore, paddingBottom: 18, opacity: year, letterSpacing: 4 }}>2006</div>
        </div>
      </div>
      <Line at={L(WORD.sancionada) - 2} top={810} size={42} weight={800} color={ED.lilac}>FOI SANCIONADA A</Line>
      <Line at={L(WORD.lei)} top={870} size={116} track={[-7, -3]}>LEI MARIA</Line>
      <Line at={L(WORD.penha) - 8} top={990} size={116} color={ED.yellow} track={[-7, -3]}>DA PENHA</Line>
      <div style={{ position: 'absolute', top: 1140, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: pill, transform: `translateY(${20 * (1 - pill)}px)` }}>
        <div style={{ background: ED.lilac, borderRadius: 999, padding: '12px 36px', fontFamily: ED.sans, fontWeight: 800, fontSize: 44, color: ED.void }}>LEI Nº 11.340</div>
      </div>
    </BeatRoot>
  );
};

/* ─────────────── 2 · COIBIR A VIOLÊNCIA DOMÉSTICA ─────────────── */

export const VM_Violencia: React.FC = () => {
  const B = BEATS.violencia;
  const L = (w: number) => lf(B, w);
  return (
    <BeatRoot>
      <PhotoBg file={A.quarto} dur={B.to - B.from} pos="60% 50%" bright={0.95} zoom={[1.1, 1.18]} />
      <Line at={L(WORD.coibir) - 6} top={740} size={46} weight={800}>QUE VISA COIBIR CASOS DE</Line>
      <Line at={L(WORD.violencia)} top={810} size={130} color={ED.yellow} track={[-8, -4]}>VIOLÊNCIA</Line>
      <Line at={L(WORD.domestica)} top={950} size={98} track={[-6, -3]}>DOMÉSTICA</Line>
      <Line at={L(WORD.familiar) - 4} top={1065} size={76} color={ED.lilac}>E FAMILIAR</Line>
    </BeatRoot>
  );
};

/* ─────────────── 3 · TEMOS QUE AVANÇAR ─────────────── */

export const VM_Avancar: React.FC = () => {
  const B = BEATS.avancar;
  const L = (w: number) => lf(B, w);
  const frame = useCurrentFrame();
  const track = useIn(L(WORD.pontos) - 4, 16);
  const fill = ci(frame, [L(WORD.pontos), B.to - B.from], [0.08, 0.34], Easing.out(Easing.cubic));
  return (
    <BeatRoot>
      <PhotoBg file={A.choro} dur={B.to - B.from} pos="50% 30%" bright={0.7} />
      <Line at={L(WORD.mas)} top={690} size={50} weight={800}>MAS NÓS TEMOS QUE</Line>
      <Line at={L(WORD.avancar)} top={760} size={150} color={ED.yellow} track={[-8, -4]}>AVANÇAR</Line>
      <Line at={L(WORD.muitos) - 4} top={930} size={64}>EM MUITOS PONTOS</Line>
      {/* linha de progresso: ainda há caminho pela frente */}
      <div style={{ position: 'absolute', top: 1080, left: 170, width: 740, height: 60, opacity: track }}>
        <div style={{ position: 'absolute', top: 26, left: 0, right: 0, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.25)' }} />
        <div style={{ position: 'absolute', top: 26, left: 0, width: `${fill * 100}%`, height: 8, borderRadius: 4, background: ED.yellow }} />
        {[0, 0.25, 0.5, 0.75, 1].map((x) => (
          <div key={x} style={{ position: 'absolute', top: 12, left: `calc(${x * 100}% - 18px)`, width: 36, height: 36, borderRadius: '50%', border: `4px solid ${x <= fill ? ED.yellow : 'rgba(255,255,255,0.5)'}`, background: x <= fill ? ED.yellow : ED.void }} />
        ))}
      </div>
    </BeatRoot>
  );
};

/* ─────────────── 4 · COMO VEREADORA — AGOSTO LILÁS ─────────────── */

const Ribbon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill={color} d="M12 2c-2.2 0-4 1.8-4 4 0 1.4.6 2.8 1.5 4.3L5 20l3 1 4-6.5 4 6.5 3-1-4.5-9.7C15.4 8.8 16 7.4 16 6c0-2.2-1.8-4-4-4zm0 2.3c1 0 1.7.8 1.7 1.7 0 .8-.6 2-1.7 3.7-1.1-1.7-1.7-2.9-1.7-3.7 0-.9.7-1.7 1.7-1.7z" />
  </svg>
);

export const VM_Vereadora: React.FC = () => {
  const B = BEATS.vereadora;
  const L = (w: number) => lf(B, w);
  const frame = useCurrentFrame();
  const badge = useIn(L(WORD.agostoLilas) - 2, 22);
  return (
    <BeatRoot>
      <PhotoBg file={A.anaTribuna} dur={B.to - B.from} pos="30% 45%" bright={0.78} zoom={[1.02, 1.1]} bottomDark />
      <Line at={L(WORD.como)} top={250} size={72} track={[-5, -2]}>COMO VEREADORA</Line>
      <Line at={L(WORD.municipio) - 4} top={336} size={44} weight={800} color={ED.lilac}>DESSE MUNICÍPIO,</Line>
      <Line at={L(WORD.criei)} top={1000} size={46} weight={800}>EU CRIEI O PROJETO DE LEI</Line>
      <div style={{ position: 'absolute', top: 1076, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, background: ED.lilac, padding: '22px 46px 22px 30px', borderRadius: 24, boxShadow: '0 30px 70px rgba(0,0,0,0.55)', opacity: badge, transform: `translateY(${40 * (1 - badge)}px) scale(${1.06 - 0.06 * badge})`, filter: `blur(${12 * (1 - badge)}px)` }}>
          <Ribbon size={150} color={ED.void} />
          <div style={{ fontFamily: ED.sans, fontWeight: 900, lineHeight: 0.95, whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 104, color: '#FFFFFF', letterSpacing: -3 }}>AGOSTO</div>
            <div style={{ fontSize: 104, color: ED.void, letterSpacing: -3, ...edIn(frame, L(WORD.lilas) - 4, { dur: 18, y: 10, blur: 10, trackFrom: -8, trackTo: -3 }) }}>LILÁS</div>
          </div>
        </div>
      </div>
      <Line at={L(WORD.combate) - 4} top={1340} size={42} weight={800}>COMBATE À VIOLÊNCIA DOMÉSTICA</Line>
    </BeatRoot>
  );
};

/* ─────────────── 5 · NAS ESCOLAS (pictogramas) ─────────────── */

const Kid: React.FC<{ size: number; color: string; opacity: number }> = ({ size, color, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity }}>
    <circle cx="12" cy="5" r="3.2" fill={color} />
    <path fill={color} d="M7.5 9.5h9a1.5 1.5 0 0 1 1.5 1.6l-.6 6.4h-2.2V23h-2.4v-5h-1.6v5H8.8v-5.5H6.6L6 11.1a1.5 1.5 0 0 1 1.5-1.6z" />
  </svg>
);

export const VM_Escolas: React.FC = () => {
  const B = BEATS.escolas;
  const L = (w: number) => lf(B, w);
  const frame = useCurrentFrame();
  const grid = useIn(L(WORD.escolas), 18);
  const stamp = useIn(L(WORD.lei2) - 2, 16);
  const N = 15;
  return (
    <BeatRoot>
      <PhotoBg file={A.alunos} dur={B.to - B.from} pos="50% 40%" bright={0.6} />
      <Line at={L(WORD.ele)} top={300} size={56}>ELE VAI ATÉ AS ESCOLAS</Line>
      <div style={{ position: 'absolute', top: 420, left: 170, width: 740, display: 'flex', flexWrap: 'wrap', gap: 28, justifyContent: 'center', opacity: grid, transform: `translateY(${30 * (1 - grid)}px)` }}>
        {Array.from({ length: N }).map((_, i) => {
          const at = L(WORD.conscientizar) + (i / N) * (L(WORD.alunos) - L(WORD.conscientizar));
          const f = ci(frame, [at, at + 8], [0, 1]);
          return (
            <div key={i} style={{ position: 'relative', width: 120, height: 120 }}>
              <div style={{ position: 'absolute', inset: 0 }}><Kid size={120} color="#FFFFFF" opacity={0.35} /></div>
              <div style={{ position: 'absolute', inset: 0, transform: `scale(${0.8 + 0.2 * f})` }}><Kid size={120} color={i % 3 === 1 ? ED.yellow : ED.lilac} opacity={f} /></div>
            </div>
          );
        })}
      </div>
      <Line at={L(WORD.conscientizar) - 2} top={900} size={46} weight={800} color={ED.lilac}>PARA CONSCIENTIZAR</Line>
      <Line at={L(WORD.sociedade) - 4} top={960} size={72} color={ED.yellow}>TODA A SOCIEDADE</Line>
      <Line at={L(WORD.alunos) - 10} top={1050} size={72}>E TODOS OS ALUNOS</Line>
      <div style={{ position: 'absolute', top: 1190, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: stamp, transform: `rotate(-3deg) scale(${1.15 - 0.15 * stamp})` }}>
        <div style={{ border: `6px solid ${ED.yellow}`, padding: '14px 30px', fontFamily: ED.sans, fontWeight: 900, fontSize: 52, color: ED.yellow, letterSpacing: 1, whiteSpace: 'nowrap', background: 'rgba(45,22,67,0.6)' }}>LEI DE SUMA IMPORTÂNCIA</div>
      </div>
    </BeatRoot>
  );
};

/* ─────────────── 6 · COMO MULHER — PROTEÇÃO ─────────────── */

export const VM_Mulher: React.FC = () => {
  const B = BEATS.mulher;
  const L = (w: number) => lf(B, w);
  return (
    <BeatRoot>
      <PhotoBg file={A.anaMao} dur={B.to - B.from} pos="45% 35%" bright={0.8} gray zoom={[1.0, 1.08]} bottomDark />
      <Line at={L(WORD.como2)} top={990} size={64}>COMO MULHER,</Line>
      <Line at={L(WORD.lutei) - 10} top={1070} size={44} weight={800} color={ED.lilac}>EU SEMPRE LUTEI PELA</Line>
      <Line at={L(WORD.protecao)} top={1130} size={132} color={ED.yellow} track={[-8, -4]}>PROTEÇÃO</Line>
      <Line at={L(WORD.garantia)} top={1275} size={52} weight={800}>E GARANTIA DE DIREITOS</Line>
      <Line at={L(WORD.mulheres) - 6} top={1342} size={76} color={ED.lilac}>DAS MULHERES</Line>
    </BeatRoot>
  );
};

/* ─────────────── 7 · PATRULHA MARIA DA PENHA ─────────────── */

export const VM_Patrulha: React.FC = () => {
  const B = BEATS.patrulha;
  const L = (w: number) => lf(B, w);
  const frame = useCurrentFrame();
  const shield = useIn(L(WORD.criei2), 16);
  const steps = [
    { label: 'PROJETO DE LEI CRIADO', at: L(WORD.solicitando) - 6, done: true },
    { label: 'SOLICITADO AO PREFEITO', at: L(WORD.prefeito) - 4, done: true },
    { label: 'COLOCAR EM PRÁTICA', at: L(WORD.pratica) - 6, done: false },
  ];
  return (
    <BeatRoot>
      <PhotoBg file={A.patrulha} dur={B.to - B.from} pos="55% 40%" bright={0.72} />
      <div style={{ position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: shield, transform: `scale(${0.8 + 0.2 * shield})` }}>
        <div style={{ width: 128, height: 128, borderRadius: '50%', background: ED.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <LineIcon name="escudo" frame={frame} at={L(WORD.criei2)} size={80} color={ED.void} stroke={2} />
        </div>
      </div>
      <Line at={L(WORD.criei2)} top={410} size={40} weight={800}>CRIEI TAMBÉM O PROJETO DE LEI</Line>
      <Line at={L(WORD.patrulha)} top={470} size={136} track={[-8, -4]}>PATRULHA</Line>
      <Line at={L(WORD.maria2) - 2} top={612} size={90} color={ED.lilac}>MARIA DA PENHA</Line>
      {/* linha do tempo do projeto */}
      <div style={{ position: 'absolute', top: 820, left: 150, width: 800 }}>
        {steps.map((s, i) => {
          const p = ci(frame, [s.at, s.at + 18], [0, 1], Easing.out(Easing.cubic));
          const pulse = s.done ? 1 : 0.75 + 0.25 * Math.sin(frame * 0.18);
          return (
            <div key={s.label} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 30, height: 150, opacity: p, transform: `translateX(${60 * (1 - p)}px)`, filter: `blur(${10 * (1 - p)}px)` }}>
              {i < steps.length - 1 ? <div style={{ position: 'absolute', left: 38, top: 96, width: 6, height: 108, background: s.done ? ED.yellow : 'rgba(255,255,255,0.3)' }} /> : null}
              <div style={{ flex: 'none', width: 82, height: 82, borderRadius: '50%', border: `6px solid ${ED.yellow}`, background: s.done ? ED.yellow : 'rgba(45,22,67,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pulse})` }}>
                {s.done ? (
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={ED.void} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                ) : (
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: ED.yellow }} />
                )}
              </div>
              <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 50, color: s.done ? '#FFFFFF' : ED.yellow, whiteSpace: 'nowrap', textShadow: '0 8px 30px rgba(0,0,0,0.7)' }}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </BeatRoot>
  );
};

/* ─────────────── 8 · MAIS UM MECANISMO ─────────────── */

export const VM_Mecanismo: React.FC = () => {
  const B = BEATS.mecanismo;
  const L = (w: number) => lf(B, w);
  return (
    <BeatRoot>
      <PhotoBg file={A.telefone} dur={B.to - B.from} pos="35% 35%" bright={0.7} />
      <Line at={L(WORD.eMais)} top={800} size={58}>É MAIS UM</Line>
      <Line at={L(WORD.mecanismo) - 4} top={872} size={124} color={ED.yellow} track={[-8, -4]}>MECANISMO</Line>
      <Line at={L(WORD.combate2)} top={1006} size={84}>DE COMBATE</Line>
      <Line at={L(WORD.violencia3)} top={1110} size={46} weight={800} color={ED.lilac}>À VIOLÊNCIA CONTRA A MULHER</Line>
    </BeatRoot>
  );
};

/* ─────────────── 9 · FUNDO ESPECIAL — CAPACITAÇÃO ─────────────── */

export const VM_Fundo: React.FC = () => {
  const B = BEATS.fundo;
  const L = (w: number) => lf(B, w);
  const frame = useCurrentFrame();
  const blk = useIn(L(WORD.fundo) - 2, 20);
  const chart = useIn(L(WORD.capacitacao) - 10, 16);
  const pill = useIn(L(WORD.mercado) - 4, 16);
  const bars = [0.38, 0.56, 0.76, 1];
  return (
    <BeatRoot>
      <PhotoBg file={A.capacitacao} dur={B.to - B.from} pos="50% 40%" bright={0.62} />
      <Line at={L(WORD.alem)} top={290} size={48} weight={800}>ALÉM DISSO, CRIEI UM</Line>
      <div style={{ position: 'absolute', top: 370, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, background: ED.yellow, padding: '20px 44px 20px 26px', boxShadow: '0 30px 70px rgba(0,0,0,0.55)', transform: `rotate(-1.5deg) translateY(${40 * (1 - blk)}px) scale(${1.06 - 0.06 * blk})`, opacity: blk, filter: `blur(${12 * (1 - blk)}px)` }}>
          <div style={{ width: 118, height: 118, borderRadius: '50%', background: ED.void, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LineIcon name="moeda" frame={frame} at={L(WORD.fundo)} size={76} color={ED.yellow} stroke={2} />
          </div>
          <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 100, lineHeight: 0.95, color: ED.void, letterSpacing: -3, whiteSpace: 'nowrap' }}>
            FUNDO
            <div style={{ ...edIn(frame, L(WORD.especial) - 4, { dur: 18, y: 10, blur: 10, trackFrom: -7, trackTo: -3 }) }}>ESPECIAL</div>
          </div>
        </div>
      </div>
      {/* barras crescendo: capacitação → mercado de trabalho */}
      <div style={{ position: 'absolute', top: 680, left: 290, width: 500, height: 260, display: 'flex', alignItems: 'flex-end', gap: 30, opacity: chart }}>
        {bars.map((h, i) => {
          const at = L(WORD.capacitacao) - 6 + i * 6;
          const p = ci(frame, [at, at + 20], [0, 1], Easing.out(Easing.cubic));
          return <div key={i} style={{ flex: 1, height: 250 * h * p, borderRadius: '10px 10px 0 0', background: i === bars.length - 1 ? ED.yellow : ED.lilac, boxShadow: '0 16px 30px rgba(0,0,0,0.4)' }} />;
        })}
      </div>
      <div style={{ position: 'absolute', top: 946, left: 270, width: 540, height: 6, background: 'rgba(255,255,255,0.6)', opacity: chart }} />
      <Line at={L(WORD.capacitacao) - 8} top={990} size={44} weight={800}>PARA A CAPACITAÇÃO DA</Line>
      <Line at={L(WORD.maoDeObra) - 2} top={1050} size={62} color={ED.lilac}>MÃO DE OBRA FEMININA</Line>
      <div style={{ position: 'absolute', top: 1160, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: pill, transform: `translateY(${20 * (1 - pill)}px)` }}>
        <div style={{ background: '#FFFFFF', borderRadius: 999, padding: '14px 40px', fontFamily: ED.sans, fontWeight: 900, fontSize: 50, color: ED.void, whiteSpace: 'nowrap' }}>NO MERCADO DE TRABALHO</div>
      </div>
    </BeatRoot>
  );
};

/* ─────────────── 10 · POLÍTICAS PÚBLICAS ─────────────── */

export const VM_Politicas: React.FC = () => {
  const B = BEATS.politicas;
  const L = (w: number) => lf(B, w);
  return (
    <BeatRoot>
      <PhotoBg file={A.punhos} dur={B.to - B.from} pos="50% 40%" bright={0.75} />
      <Line at={L(WORD.mulheres2)} top={700} size={124} color={ED.lilac} track={[-8, -4]}>MULHERES,</Line>
      <Line at={L(WORD.precisamos)} top={850} size={66}>PRECISAMOS AVANÇAR</Line>
      <Line at={L(WORD.politicas) - 8} top={950} size={74} color={ED.yellow}>NESSAS POLÍTICAS</Line>
      <Line at={L(WORD.publicas) - 4} top={1040} size={116} color={ED.yellow} track={[-8, -4]}>PÚBLICAS</Line>
    </BeatRoot>
  );
};

/* ─────────────── 11 · UNIDAS (volta à capa) ─────────────── */

export const VM_Unidas: React.FC = () => {
  const B = BEATS.unidas;
  const L = (w: number) => lf(B, w);
  const frame = useCurrentFrame();
  const ana = ci(frame, [0, 26], [0, 1], Easing.out(Easing.cubic));
  const out = ci(frame, [B.to - B.from - 14, B.to - B.from], [1, 0], Easing.in(Easing.cubic));
  return (
    <BeatRoot bg="#000">
      <AbsoluteFill style={{ opacity: out, transform: `scale(${ci(frame, [0, B.to - B.from], [1, 1.04])})` }}>
        <CoverArt anaIn={ana} reveal={[L(WORD.unidas), L(WORD.conseguiremos), L(WORD.vencer), L(WORD.essa), L(WORD.batalha)]} />
      </AbsoluteFill>
    </BeatRoot>
  );
};
