import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// =============================================================================
// UAI TOFU — "O Dashboard Nutricional"
// Vertical 9:16, 60fps, 615 frames (10.25s). Animação standalone — não faz
// parte da série "O Mantra", reutiliza os assets do Defumado já existentes
// (caixinha, fatias, logo em public/uai-tofu/).
//
// Estrutura (Padrão VERBO Motion O.S., decupagem do cliente + ajustes de
// feedback do cliente):
//   Cena 1 (0-120)   — Escaneamento: caixinha + linha de scanner, dolly in,
//                       sai em Z-PUSH (afunda pro fundo enquanto os cards
//                       da Cena 2 "nascem" dela).
//   Cena 2 (113-350) — Dashboard: cards de glassmorphism (proteína em
//                       destaque com CountUp + anel de progresso, mais dois
//                       cards menores), sai em SHATTER (os cards voam pras
//                       bordas da tela).
//   Cena 3 (343-480) — Sabor: uma fatia real grande aterrissa com peso e
//                       fica girando levemente (nunca parada), o slogan da
//                       marca entra letra por letra, dolly out leve.
//   Cena 4 (490-615) — Desfecho: a logo real cresce e domina o quadro
//                       enquanto o fundo termina de voltar pro verde sólido
//                       — o final "cadê a logo?" que faltava na v1. Só
//                       começa DEPOIS que a fatia+slogan já sumiram (sem
//                       overlap — testei com crossfade e ficou uma dupla-
//                       exposição feia, produto e logo brigando pelo centro).
//
// Todos os frames citados nos comentários são ABSOLUTOS (linha do tempo
// mestre), com overlap entre cenas — a cena seguinte já começa a entrar
// antes da anterior terminar de sair.
//
// Notas de implementação (decisões não especificadas na decupagem):
//   - Duração do CountUp/anel: 125->175 (50f), terminando bem antes do
//     micro-pulso em 180.
//   - Duração estendida de 510 -> 615 frames (8.5s -> 10.25s) pra caber a
//     Cena 4 (cartela de logo) que não existia na v1 — o cliente sentiu
//     falta de um desfecho de marca no final.
//   - backdrop-filter testado num still isolado antes do render completo —
//     Chromium headless do Remotion renderiza normalmente.
// =============================================================================

export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 615;

const CENTER_X = 540;
const CENTER_Y = 960;

const clampCfg = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// ---- Paleta técnica --------------------------------------------------------
// Arco de cor (Bloco 1): verde profundo (Cena 1-2, foco em dado/tecnologia)
// -> amarelo quente/laranja (Cena 3, virada pro appetite appeal) -> preto
// (dissolve final). Mesmo par verde/amarelo já aprovado nas peças "O Mantra".
const BG_DEEP = '#183D24';
const BG_DEEP_RGB: [number, number, number] = [24, 61, 36];
const BG_WARM_RGB: [number, number, number] = [230, 128, 40]; // laranja quente — mais "brasa" que o amarelo puro do Mantra
const ACCENT_TECH = '#FFD23F';
const GLASS_BG = 'rgba(255, 255, 255, 0.05)';
const GLASS_BORDER = 'rgba(255, 255, 255, 0.14)';
const TEXT_DATA = '#FDFBF7';
const TEXT_MUTED = 'rgba(253, 251, 247, 0.56)';

function lerp(t: number, a: number, b: number) {
  return interpolate(t, [0, 1], [a, b], clampCfg);
}

function lerpRgb(t: number, c0: [number, number, number], c1: [number, number, number]): [number, number, number] {
  return [lerp(t, c0[0], c1[0]), lerp(t, c0[1], c1[1]), lerp(t, c0[2], c1[2])];
}
function rgbToCss(c: [number, number, number]) {
  return `rgb(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])})`;
}

const fontFamily = 'Lato';

const FontFace: React.FC = () => (
  <style>{`
    @font-face {
      font-family: 'Lato';
      src: url('${staticFile('fonts/Lato-Regular-latin.woff2')}') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: block;
    }
    @font-face {
      font-family: 'Lato';
      src: url('${staticFile('fonts/Lato-Black-latin.woff2')}') format('woff2');
      font-weight: 900;
      font-style: normal;
      font-display: block;
    }
  `}</style>
);

// Ruído procedural (não existe asset pra isso) — feTurbulence + feColorMatrix
// pra converter pra alpha, opacidade final bem baixa (0.05) só pra quebrar o
// gradiente e dar textura de "fumaça".
const NoiseOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity }}>
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

// Início da virada de cor pro amarelo/laranja quente — timed com a entrada
// da Cena 3 (fatias + tipografia), como no arco do Bloco 1.
const COLOR_SHIFT_START = 343;
const COLOR_SHIFT_END = 390;

// Névoa/brasa ambiente: radial-gradient laranja + ruído, compartilhada entre
// a Cena 1 e a Cena 2 ("fundo mantém a fumaça defumada desfocada" — Bloco 3,
// Cena 2). Fica num layer próprio no nível raiz (não dentro da Cena 1) pra
// não ser cortada quando o conteúdo da Cena 1 sai; some conforme a Cena 3
// assume o fundo quente.
const AmbientSmoke: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [COLOR_SHIFT_START, COLOR_SHIFT_END], [1, 0], clampCfg);
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 900px 900px at 50% 42%, rgba(255,138,61,0.22) 0%, transparent 70%)',
        }}
      />
      <NoiseOverlay />
    </AbsoluteFill>
  );
};

// =============================================================================
// CENA 1 — O Escaneamento (0-120)
// =============================================================================
const BOX = { src: 'box.png', w: 557, h: 705 };
const BOX_DISPLAY_W = 580;

const SCANNER_START = 15;
const SCANNER_END = 95;
const BOX_EXIT_START = 100;
const BOX_EXIT_END = 120;

const Scene1: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const w = BOX_DISPLAY_W;
  const h = w * (BOX.h / BOX.w);

  // Entrada da caixinha: pousa com peso (spring), desfocada -> nítida.
  const s = spring({ frame, fps, config: { damping: 12, mass: 1 } });
  const entranceScale = lerp(s, 1.5, 1);
  const entranceBlur = lerp(s, 20, 0);

  // Câmera (dolly in): empurra o grupo caixinha+scanner pra mais perto nos
  // primeiros 100f, e então CONTINUA o mesmo eixo Z pro Z-PUSH OUT
  // (100->120) — um único percurso de profundidade, sem transform aninhado.
  const dollyZ = interpolate(frame, [0, 100], [-800, -400], { ...clampCfg, easing: Easing.out(Easing.cubic) });
  const exitZ = interpolate(frame, [BOX_EXIT_START, BOX_EXIT_END], [-400, -1500], {
    ...clampCfg,
    easing: Easing.in(Easing.exp),
  });
  const z = frame < BOX_EXIT_START ? dollyZ : exitZ;

  const exitT = interpolate(frame, [BOX_EXIT_START, BOX_EXIT_END], [0, 1], clampCfg);
  const exitBlur = lerp(exitT, 0, 20);
  const exitOpacity = lerp(exitT, 1, 0);

  const blur = entranceBlur + exitBlur;
  const opacity = interpolate(frame, [0, 8], [0, 1], clampCfg) * exitOpacity;

  // Scanner: varre de cima a baixo da caixinha, com glow. Easing senoidal
  // (em vez de cúbico) — movimento mais suave, sem a "freada" mais brusca
  // do cúbico nas pontas. Micro-textos piscam nas laterais quando a linha
  // passa perto da sua altura.
  const scanT = interpolate(frame, [SCANNER_START, SCANNER_END], [0, 1], {
    ...clampCfg,
    easing: Easing.inOut(Easing.sin),
  });
  const scanY = lerp(scanT, -300, 300);
  const scanOpacity = interpolate(frame, [SCANNER_START - 4, SCANNER_START, SCANNER_END, SCANNER_END + 6], [0, 1, 1, 0], clampCfg);

  const microTexts = [
    { text: '100% VEGETAL', y: -150 },
    { text: 'NON-GMO', y: 150 },
  ];

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, perspective: 1200, transformStyle: 'preserve-3d' }}>
        <div
          style={{
            position: 'absolute',
            left: CENTER_X - w / 2,
            top: CENTER_Y - h / 2,
            width: w,
            height: h,
            transform: `translateZ(${z}px) scale(${entranceScale})`,
            filter: `blur(${blur}px)`,
            opacity,
          }}
        >
          <Img src={staticFile(`uai-tofu/${BOX.src}`)} style={{ width: w, height: h }} />

          <div
            style={{
              position: 'absolute',
              left: -50,
              right: -50,
              top: h / 2 + scanY,
              height: 2,
              background: ACCENT_TECH,
              boxShadow: `0 0 40px 8px ${ACCENT_TECH}`,
              opacity: scanOpacity,
            }}
          />

          {microTexts.map((m, i) => {
            const dist = Math.abs(h / 2 + scanY - (h / 2 + m.y));
            // Envelope de visibilidade (mais largo pra combinar com o texto
            // maior) + um "pop" com leve overshoot bem na hora em que o
            // scanner cruza a altura do texto, e um deslizar de fora pra
            // dentro — leitura de HUD, não um flicker simples.
            const flicker = interpolate(dist, [0, 60, 130], [1, 1, 0], clampCfg) * scanOpacity;
            const popScale = interpolate(dist, [0, 25, 90], [1, 1.1, 0.7], clampCfg);
            const side = i === 0 ? -1 : 1;
            const slideX = interpolate(dist, [0, 90], [0, side * -50], clampCfg);
            const tickScale = interpolate(dist, [0, 50], [1, 0], clampCfg);
            const glow = interpolate(dist, [0, 30], [1, 0], clampCfg);

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: i === 0 ? -320 : undefined,
                  right: i === 1 ? -310 : undefined,
                  top: h / 2 + m.y - 14,
                  display: 'flex',
                  flexDirection: i === 0 ? 'row' : 'row-reverse',
                  alignItems: 'center',
                  gap: 10,
                  transform: `translateX(${slideX}px) scale(${popScale})`,
                  opacity: flicker,
                  whiteSpace: 'nowrap',
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 28,
                    background: ACCENT_TECH,
                    transform: `scaleY(${tickScale})`,
                    boxShadow: `0 0 ${12 + glow * 16}px ${ACCENT_TECH}`,
                  }}
                />
                <div
                  style={{
                    fontFamily,
                    fontWeight: 900,
                    fontSize: 30,
                    letterSpacing: 1.5,
                    color: ACCENT_TECH,
                    textShadow: `0 0 ${glow * 20}px ${ACCENT_TECH}`,
                  }}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =============================================================================
// CENA 2 — O Dashboard Nutricional (113-350)
// =============================================================================
const CARD_MAIN_START = 115;
const COUNTER_START = 125;
const COUNTER_END = 175; // duração não especificada na decupagem — 50f, termina bem antes do pulso em 180
const RING_START = COUNTER_START;
const RING_END = COUNTER_END;
const CARDS_MINOR_START = 135;
const PULSE_FRAME = 180;
const SHATTER_MAIN_START = 330;
const SHATTER_MINOR_START = 333;
const SHATTER_TRAVEL = 60; // continua além do fim nominal da cena — cobre o overlap com a Cena 3

const GlassCard: React.FC<{
  left: number; top: number; width: number; height: number; children: React.ReactNode; style?: React.CSSProperties;
}> = ({ left, top, width, height, children, style }) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width,
      height,
      borderRadius: 24,
      background: GLASS_BG,
      border: `1px solid ${GLASS_BORDER}`,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
      ...style,
    }}
  >
    {children}
  </div>
);

const ProgressRing: React.FC<{ size: number; strokeWidth: number; progress: number }> = ({ size, strokeWidth, progress }) => {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const dashoffset = circumference * (1 - progress);
  return (
    <svg width={size} height={size} style={{ position: 'absolute', left: 0, top: 0, transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={ACCENT_TECH}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashoffset}
      />
    </svg>
  );
};

type MinorCardSpec = { label: string; value: string; x: number };
const MINOR_CARDS: MinorCardSpec[] = [
  { label: 'COLESTEROL', value: '0mg', x: 60 },
  { label: 'FERRO', value: '2.4mg', x: 560 },
];

const Scene2: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const sceneOpacity = interpolate(frame, [113, 120], [0, 1], clampCfg);

  // Card central (Proteína)
  const mainS = spring({ frame: frame - CARD_MAIN_START, fps, config: { damping: 13, mass: 1 } });
  const mainScale = lerp(mainS, 0.5, 1);
  const mainBlur = lerp(mainS, 10, 0);
  const mainOpacity = interpolate(frame, [CARD_MAIN_START, CARD_MAIN_START + 12], [0, 1], clampCfg);

  const countT = interpolate(frame, [COUNTER_START, COUNTER_END], [0, 1], { ...clampCfg, easing: Easing.out(Easing.cubic) });
  const countValue = Math.round(lerp(countT, 0, 15));
  const ringProgress = lerp(interpolate(frame, [RING_START, RING_END], [0, 1], { ...clampCfg, easing: Easing.out(Easing.cubic) }), 0, 0.75);

  // Micro-pulso no fim da contagem — marca "carregamento completo".
  const pulseS = spring({ frame: frame - PULSE_FRAME, fps, config: { damping: 9, mass: 0.6 } });
  const pulse = frame >= PULSE_FRAME ? interpolate(pulseS, [0, 0.5, 1], [1, 1.12, 1]) : 1;

  // Parallax flutuante contínuo (idle) — nunca fica estático durante o hold.
  const idleMain = Math.sin(frame * 0.05) * 6;

  // Shatter (saída): card principal sobe e gira; cards menores fogem pros
  // lados. Easing.in(exp) — arranca rápido, sem desacelerar.
  const shatterMainT = interpolate(frame, [SHATTER_MAIN_START, SHATTER_MAIN_START + SHATTER_TRAVEL], [0, 1], {
    ...clampCfg,
    easing: Easing.in(Easing.exp),
  });
  const shatterMainY = lerp(shatterMainT, 0, -1200);
  const shatterMainRot = lerp(shatterMainT, 0, 15);
  const shatterMainOpacity = interpolate(shatterMainT, [0, 0.7, 1], [1, 1, 0]);

  const mainW = 820;
  const mainH = 760;
  const mainLeft = CENTER_X - mainW / 2;
  const mainTop = 380;

  const ringSize = 400;

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <GlassCard
        left={mainLeft}
        top={mainTop}
        width={mainW}
        height={mainH}
        style={{
          transform: `translateY(${idleMain + shatterMainY}px) rotate(${shatterMainRot}deg) scale(${mainScale * pulse})`,
          filter: `blur(${mainBlur}px)`,
          opacity: mainOpacity * shatterMainOpacity,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 46,
            textAlign: 'center',
            fontFamily,
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: 3,
            color: TEXT_MUTED,
          }}
        >
          PORÇÃO DE 100g
        </div>

        <div style={{ position: 'absolute', left: mainW / 2 - ringSize / 2, top: 100, width: ringSize, height: ringSize }}>
          <ProgressRing size={ringSize} strokeWidth={16} progress={ringProgress} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily,
              fontWeight: 900,
              fontSize: 160,
              color: ACCENT_TECH,
              lineHeight: 1,
            }}
          >
            {countValue}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 100 + ringSize + 26,
            textAlign: 'center',
            fontFamily,
            fontWeight: 900,
            fontSize: 32,
            color: TEXT_DATA,
          }}
        >
          g de Proteína
        </div>
      </GlassCard>

      {MINOR_CARDS.map((c, i) => {
        const s = spring({ frame: frame - CARDS_MINOR_START - i * 4, fps, config: { damping: 12, mass: 1 } });
        const scale = lerp(s, 0, 1);
        const ty = lerp(s, 40, 0);
        const opacity = interpolate(frame, [CARDS_MINOR_START + i * 4, CARDS_MINOR_START + i * 4 + 12], [0, 1], clampCfg);
        const idle = Math.sin(frame * 0.045 + i * 2.1) * 6;

        const shatterDir = i === 0 ? -1 : 1;
        const shatterT = interpolate(frame, [SHATTER_MINOR_START, SHATTER_MINOR_START + SHATTER_TRAVEL], [0, 1], {
          ...clampCfg,
          easing: Easing.in(Easing.exp),
        });
        const shatterX = lerp(shatterT, 0, shatterDir * 800);
        const shatterOpacity = interpolate(shatterT, [0, 0.7, 1], [1, 1, 0]);

        return (
          <GlassCard
            key={c.label}
            left={c.x}
            top={1220}
            width={460}
            height={260}
            style={{
              transform: `translate(${shatterX}px, ${ty + idle}px) scale(${scale})`,
              opacity: opacity * shatterOpacity,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 44,
                textAlign: 'center',
                fontFamily,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 2.5,
                color: TEXT_MUTED,
              }}
            >
              {c.label}
            </div>
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 100,
                textAlign: 'center',
                fontFamily,
                fontWeight: 900,
                fontSize: 64,
                color: TEXT_DATA,
              }}
            >
              {c.value}
            </div>
          </GlassCard>
        );
      })}
    </AbsoluteFill>
  );
};

// =============================================================================
// CENA 3 — O Sabor Brutal (343-510)
// =============================================================================
type SliceSrc = { src: string; w: number; h: number };
const SLICE_SRCS: SliceSrc[] = [
  { src: 'slice1.png', w: 362, h: 300 },
  { src: 'slice2.png', w: 368, h: 206 },
  { src: 'slice3.png', w: 334, h: 272 },
  { src: 'slice4.png', w: 256, h: 346 },
  { src: 'slice5.png', w: 286, h: 313 },
  { src: 'slice6.png', w: 388, h: 286 },
];

// Uma única fatia grande (em vez da pilha de 5 — ficava estranho, muito
// amontoado) — pouso de peso, bem no centro, protagonista sozinha. Fica
// girando bem devagar e levemente o tempo todo depois de pousar (pedido do
// cliente: "não pode só surgir e ficar parada").
type StackCfg = { srcIndex: number; dx: number; dy: number; rot: number; long: number };
const STACK: StackCfg[] = [{ srcIndex: 0, dx: 0, dy: 0, rot: -3, long: 920 }];

const SLICES_START = 345;
const TITLE_START = 358;
const LETTER_STAGGER = 1.4; // frames entre cada letra no reveal do slogan

// A fatia e o slogan têm sua PRÓPRIA saída (encolhem/desfocam e somem) bem
// antes da Cena 4 (logo) entrar — não dependem mais do dissolve final, que
// agora acontece bem mais tarde, durante o hold da logo.
const SLICE_EXIT_START = 452;
const SLICE_EXIT_END = 480;

const DOLLY_OUT_START = 345;
const DOLLY_OUT_END = 452;

const SLICES_CENTER_Y = 820;

// Slogan real da marca — duas linhas curtas em vez da frase técnica
// original, fonte bem menor pra caber confortável na largura do canvas.
const SLOGAN_LINE1 = 'Cuidar de você nunca';
const SLOGAN_LINE2 = 'foi tão gostoso.';

const Scene3: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const sceneOpacity = interpolate(frame, [343, 350], [0, 1], clampCfg);

  // Dolly out leve — recua sutilmente ao longo da cena pra dar respiro à
  // composição (fatia + tipografia), sem chegar a "flutuar" longe demais.
  const dollyZ = interpolate(frame, [DOLLY_OUT_START, DOLLY_OUT_END], [0, -200], { ...clampCfg, easing: Easing.inOut(Easing.cubic) });
  const dollyScale = interpolate(dollyZ, [-200, 0], [0.94, 1]);

  // Saída compartilhada da fatia + slogan: encolhe, desfoca e sobe um
  // pouco, liberando o centro do quadro pra Cena 4.
  const exitT = interpolate(frame, [SLICE_EXIT_START, SLICE_EXIT_END], [0, 1], { ...clampCfg, easing: Easing.in(Easing.cubic) });
  const exitOpacity = interpolate(exitT, [0, 1], [1, 0]);
  const exitScale = interpolate(exitT, [0, 1], [1, 0.85]);
  const exitBlur = interpolate(exitT, [0, 1], [0, 10]);
  const exitYShift = interpolate(exitT, [0, 1], [0, -50]);

  // Slogan letra por letra: cada caractere nasce com seu próprio spring,
  // com um pequeno atraso em relação ao anterior.
  const titleLine = (text: string, start: number, top: number) => {
    const chars = Array.from(text);
    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: top + exitYShift,
          textAlign: 'center',
          fontFamily,
          fontWeight: 900,
          fontSize: 62,
          color: ACCENT_TECH,
          whiteSpace: 'nowrap',
          filter: exitBlur > 0.1 ? `blur(${exitBlur}px)` : undefined,
        }}
      >
        {chars.map((ch, idx) => {
          if (ch === ' ') return <span key={idx} style={{ display: 'inline-block', width: '0.28em' }} />;
          const charStart = start + idx * LETTER_STAGGER;
          const cs = spring({ frame: frame - charStart, fps, config: { damping: 14, mass: 0.6 } });
          const ty = lerp(cs, 22, 0);
          const rot = lerp(cs, 10, 0);
          const charOpacity = interpolate(frame, [charStart, charStart + 6], [0, 1], clampCfg) * exitOpacity;
          return (
            <span
              key={idx}
              style={{
                display: 'inline-block',
                transform: `translateY(${ty}px) rotate(${rot}deg)`,
                opacity: charOpacity,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <div style={{ position: 'absolute', inset: 0, perspective: 1400, transformStyle: 'preserve-3d' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateZ(${dollyZ}px) scale(${dollyScale})`,
          }}
        >
          {STACK.map((c, i) => {
            const cfg = SLICE_SRCS[c.srcIndex];
            const localStart = SLICES_START + i * 3;
            const s = spring({ frame: frame - localStart, fps, config: { damping: 10, mass: 1.2 } });
            const landScale = lerp(s, 1.3, 1);
            const landBlur = lerp(s, 20, 0);
            const landOpacity = interpolate(frame, [localStart, localStart + 8], [0, 1], clampCfg);

            const scale = landScale * exitScale;
            const opacity = landOpacity * exitOpacity;
            const blur = landBlur + exitBlur;

            // Giro contínuo e bem leve — nunca fica parada depois de pousar.
            const idlePhase = i * 1.4;
            const idleRot = Math.sin(frame * 0.018 + idlePhase) * 9;

            const long = c.long * scale;
            const w = cfg.w * (long / Math.max(cfg.w, cfg.h));
            const h = cfg.h * (long / Math.max(cfg.w, cfg.h));
            const x = CENTER_X + c.dx;
            const y = SLICES_CENTER_Y + c.dy + exitYShift;

            return (
              <Img
                key={i}
                src={staticFile(`uai-tofu/${cfg.src}`)}
                style={{
                  position: 'absolute',
                  left: x - w / 2,
                  top: y - h / 2,
                  width: w,
                  height: h,
                  transform: `rotate(${c.rot + idleRot}deg)`,
                  filter: `blur(${blur}px) drop-shadow(0 30px 40px rgba(0,0,0,0.45))`,
                  opacity,
                }}
              />
            );
          })}
        </div>
      </div>

      {titleLine(SLOGAN_LINE1, TITLE_START, 1350)}
      {titleLine(SLOGAN_LINE2, TITLE_START + 30, 1425)}
    </AbsoluteFill>
  );
};

// =============================================================================
// CENA 4 — Desfecho: a logo (490-615)
// SÓ DEPOIS que a fatia + o slogan já saíram a logo real cresce, dominante,
// no centro — o "cadê a marca no final?" que faltava na v1. Mesmo
// tratamento (spring + glow) já aprovado nas peças "O Mantra".
// =============================================================================
const LOGO = { src: 'logo.png', w: 460, h: 376 };
const LOGO_DISPLAY_W = 480;
// Só começa DEPOIS que a fatia + slogan já sumiram por completo (saem em
// 452->480) — um pequeno respiro de tela vazia antes da logo, sem
// sobrepor o produto (testei com overlap e ficou uma dupla-exposição feia).
const LOGO_START = 490;

const DISSOLVE_START = 575;
const DISSOLVE_END = 600;

const Scene4: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const local = frame - LOGO_START;
  const s = spring({ frame: Math.max(0, local), fps, config: { damping: 16, mass: 1, stiffness: 95 } });
  const scale = lerp(s, 0.5, 1);
  const opacity = interpolate(frame, [LOGO_START, LOGO_START + 18], [0, 1], clampCfg);

  const glow = interpolate(local, [0, 18, 70], [0, 0.4, 0.22], clampCfg);

  const w = LOGO_DISPLAY_W * scale;
  const h = w * (LOGO.h / LOGO.w);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: glow,
          mixBlendMode: 'screen',
          background: `radial-gradient(circle at 50% 50%, #ffffff 0%, ${ACCENT_TECH} 45%, transparent 72%)`,
        }}
      />
      <Img
        src={staticFile(`uai-tofu/${LOGO.src}`)}
        style={{
          position: 'absolute',
          left: CENTER_X - w / 2,
          top: CENTER_Y - h / 2,
          width: w,
          height: h,
          opacity,
        }}
      />
    </AbsoluteFill>
  );
};

// =============================================================================
// Composição principal
// =============================================================================
export const UaiTofuDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Arco de cor do Bloco 1: verde profundo (Cenas 1-2) -> amarelo/laranja
  // quente (Cena 3) -> de volta pro verde sólido no DISSOLVE final (a
  // decupagem pede explicitamente "fundo volta pra verde sólido", não um
  // fade pra preto).
  const toWarmT = interpolate(frame, [COLOR_SHIFT_START, COLOR_SHIFT_END], [0, 1], clampCfg);
  const warmRgb = lerpRgb(toWarmT, BG_DEEP_RGB, BG_WARM_RGB);
  const backToGreenT = interpolate(frame, [DISSOLVE_START, DISSOLVE_END], [0, 1], clampCfg);
  const bgColor = rgbToCss(lerpRgb(backToGreenT, warmRgb, BG_DEEP_RGB));

  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: bgColor }}>
      <FontFace />
      <AmbientSmoke frame={frame} />

      <Scene1 frame={frame} fps={fps} />
      <Scene2 frame={frame} fps={fps} />
      <Scene3 frame={frame} fps={fps} />
      <Scene4 frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
