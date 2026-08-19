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
// Vertical 9:16, 60fps, 510 frames (8.5s). Animação standalone — não faz
// parte da série "O Mantra", reutiliza os assets do Defumado já existentes
// (caixinha, fatias, logo em public/uai-tofu/).
//
// Estrutura (Padrão VERBO Motion O.S., decupagem do cliente):
//   Cena 1 (0-120)   — Escaneamento: caixinha + linha de scanner, dolly in,
//                       sai em Z-PUSH (afunda pro fundo enquanto os cards
//                       da Cena 2 "nascem" dela).
//   Cena 2 (113-350) — Dashboard: cards de glassmorphism (proteína em
//                       destaque com CountUp + anel de progresso, mais dois
//                       cards menores), sai em SHATTER (os cards voam pras
//                       bordas da tela).
//   Cena 3 (343-510) — Sabor: fatias reais aterrissam com peso, tipografia
//                       de impacto, dolly out leve, DISSOLVE final pro
//                       verde sólido.
//
// Todos os frames citados nos comentários são ABSOLUTOS (linha do tempo
// mestre), com overlap de 7 frames entre cenas — a cena seguinte já começa
// a entrar antes da anterior terminar de sair.
//
// Notas de implementação (decisões não especificadas na decupagem):
//   - Duração do CountUp/anel: 125->175 (50f), terminando bem antes do
//     micro-pulso em 180.
//   - "SABOR SURREAL." entra 20f depois de "NUTRIÇÃO BRUTA." (355->375).
//   - backdrop-filter testado num still isolado antes do render completo —
//     Chromium headless do Remotion renderiza normalmente.
// =============================================================================

export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 510;

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
const BOX_DISPLAY_W = 480;

const SCANNER_START = 20;
const SCANNER_END = 90;
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

  // Scanner: varre de cima a baixo da caixinha, com glow. Micro-textos
  // piscam nas laterais quando a linha passa perto da sua altura.
  const scanT = interpolate(frame, [SCANNER_START, SCANNER_END], [0, 1], {
    ...clampCfg,
    easing: Easing.inOut(Easing.cubic),
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
            const flicker = interpolate(dist, [0, 40, 90], [1, 1, 0], clampCfg) * scanOpacity;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: i === 0 ? -240 : undefined,
                  right: i === 1 ? -230 : undefined,
                  top: h / 2 + m.y - 8,
                  fontFamily,
                  fontWeight: 900,
                  fontSize: 15,
                  letterSpacing: 1.5,
                  color: ACCENT_TECH,
                  opacity: flicker,
                  whiteSpace: 'nowrap',
                }}
              >
                {m.text}
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

// Fatias empilhadas (não espalhadas pela tela como no vídeo "O Mantra") —
// pilha compacta e levemente abanada, no estilo "prontas pra comer".
type StackCfg = { srcIndex: number; dx: number; dy: number; rot: number; long: number };
const STACK: StackCfg[] = [
  { srcIndex: 3, dx: -95, dy: 55, rot: -12, long: 460 },
  { srcIndex: 1, dx: 80, dy: 75, rot: 10, long: 450 },
  { srcIndex: 5, dx: -40, dy: -30, rot: -4, long: 475 },
  { srcIndex: 0, dx: 55, dy: -70, rot: 8, long: 435 },
  { srcIndex: 4, dx: 0, dy: 15, rot: -2, long: 420 },
];

const SLICES_START = 345;
const TITLE1_START = 355;
const TITLE2_START = 375;
const DOLLY_OUT_START = 345;
const DOLLY_OUT_END = 490;
const DISSOLVE_START = 490;
const DISSOLVE_END = 510;

const SLICES_CENTER_Y = 820;

const Scene3: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const sceneOpacity = interpolate(frame, [343, 350], [0, 1], clampCfg);

  // Dolly out leve — recua sutilmente ao longo da cena pra dar respiro à
  // composição (fatias + tipografia), sem chegar a "flutuar" longe demais.
  const dollyZ = interpolate(frame, [DOLLY_OUT_START, DOLLY_OUT_END], [0, -200], { ...clampCfg, easing: Easing.inOut(Easing.cubic) });
  const dollyScale = interpolate(dollyZ, [-200, 0], [0.94, 1]);

  const dissolveT = interpolate(frame, [DISSOLVE_START, DISSOLVE_END], [0, 1], clampCfg);

  const title = (text: string, start: number, top: number) => {
    const s = spring({ frame: frame - start, fps, config: { damping: 12, mass: 1 } });
    const ty = lerp(s, -40, 0);
    const opacity = interpolate(frame, [start, start + 10], [0, 1], clampCfg) * interpolate(dissolveT, [0, 1], [1, 0]);
    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top,
          textAlign: 'center',
          fontFamily,
          fontWeight: 900,
          fontSize: 90,
          letterSpacing: -1,
          color: ACCENT_TECH,
          transform: `translateY(${ty - dissolveT * 20}px)`,
          opacity,
        }}
      >
        {text}
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
            const scale = lerp(s, 1.3, 1);
            const blur = lerp(s, 20, 0);
            const opacity = interpolate(frame, [localStart, localStart + 8], [0, 1], clampCfg) * interpolate(dissolveT, [0, 1], [1, 0]);

            const idlePhase = i * 1.4;
            const idleRot = Math.sin(frame * 0.03 + idlePhase) * 1.6;

            const long = c.long * scale;
            const w = cfg.w * (long / Math.max(cfg.w, cfg.h));
            const h = cfg.h * (long / Math.max(cfg.w, cfg.h));
            const x = CENTER_X + c.dx;
            const y = SLICES_CENTER_Y + c.dy - dissolveT * 20;

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

      {title('NUTRIÇÃO BRUTA.', TITLE1_START, 1330)}
      {title('SABOR SURREAL.', TITLE2_START, 1440)}
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
    </AbsoluteFill>
  );
};
