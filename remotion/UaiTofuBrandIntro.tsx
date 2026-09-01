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

// Vinheta de marca (logo sting) — versão NATIVAMENTE horizontal (1920x1080)
// para vinheta oficial de YouTube. Não é um crop/pillarbox de uma versão
// vertical: o layout foi recomposto lado a lado (selo com a logo à esquerda,
// bloco de marca à direita) para usar bem a largura do frame 16:9.
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 60;
export const DURATION = 360;

const BG = '#FBBD3C';
const GREEN = '#20402F';
const RED = '#C6281F';
const CREAM = '#FFFDF6';
const GOLD = '#E8A317';

const clampCfg = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

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

// Selo (disco branco) com a logo real, à esquerda — nasce de um ponto e
// "estoura" com spring, igual à referência da vinheta vertical.
const BADGE_CX = 540;
const BADGE_CY = 540;
const BADGE_D = 640;
const LOGO_RATIO = 1264 / 1549;
const LOGO_W = 350;
const LOGO_H = LOGO_W * LOGO_RATIO;

const BADGE_POP_START = 0;
const LOGO_START = 42;
const TAGLINE_START = 78;
const ICONS_START = 108;
const ICON_STAGGER = 10;
const HANDLE_START = 160;

const Badge: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - BADGE_POP_START), fps, config: { damping: 12, mass: 0.8, stiffness: 120 } });
  const scale = interpolate(s, [0, 1], [0, 1]);
  const shadowOpacity = interpolate(s, [0, 1], [0, 0.22]);

  const logoS = spring({ frame: Math.max(0, frame - LOGO_START), fps, config: { damping: 13, mass: 0.7, stiffness: 130 } });
  const logoScale = interpolate(logoS, [0, 1], [0.7, 1]);
  const logoOpacity = interpolate(frame, [LOGO_START, LOGO_START + 20], [0, 1], clampCfg);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: BADGE_CX - BADGE_D * 0.34,
          top: BADGE_CY + (BADGE_D / 2) * scale - 4,
          width: BADGE_D * 0.68,
          height: BADGE_D * 0.14,
          opacity: shadowOpacity,
          background: 'radial-gradient(ellipse at center, rgba(60,35,10,0.55) 0%, rgba(60,35,10,0) 72%)',
          filter: 'blur(16px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: BADGE_CX - (BADGE_D * scale) / 2,
          top: BADGE_CY - (BADGE_D * scale) / 2,
          width: BADGE_D * scale,
          height: BADGE_D * scale,
          borderRadius: '50%',
          background: CREAM,
          boxShadow: '0 16px 32px rgba(70,40,10,0.2)',
        }}
      />
      <Img
        src={staticFile('uai-tofu/logo.png')}
        style={{
          position: 'absolute',
          left: BADGE_CX - (LOGO_W * logoScale) / 2,
          top: BADGE_CY - (LOGO_H * logoScale) / 2,
          width: LOGO_W * logoScale,
          height: LOGO_H * logoScale,
          opacity: logoOpacity,
        }}
      />
    </>
  );
};

// Bloco de marca à direita: tagline + selos + handle, numa coluna centralizada
// verticalmente ao lado do selo — layout pensado para o frame 16:9, não uma
// pilha vertical espremida no centro.
const COL_LEFT = 1060;
const COL_WIDTH = 760;

const Tagline: React.FC<{ frame: number }> = ({ frame }) => {
  const t = interpolate(frame, [TAGLINE_START, TAGLINE_START + 22], [0, 1], {
    ...clampCfg,
    easing: Easing.out(Easing.cubic),
  });
  const opacity = t;
  const translateX = interpolate(t, [0, 1], [36, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        fontFamily,
        fontWeight: 900,
        fontSize: 58,
        lineHeight: 1.16,
        letterSpacing: 0.5,
        color: GREEN,
      }}
    >
      <div>TOFU ARTESANAL</div>
      <div>FEITO EM MINAS GERAIS</div>
    </div>
  );
};

type IconKind = 'vegano' | 'proteico' | 'amor';

const CowIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={44} height={38} viewBox="0 0 32 28" fill="none">
    <path d="M9 8 Q3 4 5 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <path d="M23 8 Q29 4 27 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <rect x={4} y={8} width={24} height={17} rx={8.5} stroke={color} strokeWidth={1.8} />
    <path d="M10 14 q2.2 -3.4 4.4 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    <path d="M17.6 14 q2.2 -3.4 4.4 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    <path d="M13 21.5 q3 2.2 6 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    <circle cx={14} cy={18.5} r={0.9} fill={color} />
    <circle cx={18} cy={18.5} r={0.9} fill={color} />
  </svg>
);

const ProteinIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={40} height={40} viewBox="0 0 24 24" fill="none">
    <rect x={2} y={5} width={4} height={14} rx={2} fill={color} />
    <rect x={6} y={10.5} width={12} height={3} rx={1.5} fill={color} />
    <rect x={18} y={5} width={4} height={14} rx={2} fill={color} />
  </svg>
);

const HeartIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={38} height={38} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={color}
    />
  </svg>
);

const ICONS: { kind: IconKind; label: string[]; bg: string; ring: string; icon: string }[] = [
  { kind: 'vegano', label: ['Vegano'], bg: GREEN, ring: GOLD, icon: GOLD },
  { kind: 'proteico', label: ['Protéico'], bg: 'transparent', ring: RED, icon: RED },
  { kind: 'amor', label: ['Feito com', 'amor'], bg: RED, ring: CREAM, icon: CREAM },
];

const IconBadge: React.FC<{ frame: number; fps: number; index: number; cfg: (typeof ICONS)[number] }> = ({
  frame,
  fps,
  index,
  cfg,
}) => {
  const start = ICONS_START + index * ICON_STAGGER;
  const s = spring({ frame: Math.max(0, frame - start), fps, config: { damping: 12, mass: 0.7, stiffness: 160 } });
  const scale = interpolate(s, [0, 1], [0.4, 1]);
  const opacity = interpolate(frame, [start, start + 14], [0, 1], clampCfg);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity, transform: `scale(${scale})` }}>
      <div
        style={{
          width: 108,
          height: 108,
          borderRadius: '50%',
          background: cfg.bg,
          border: `3px solid ${cfg.ring}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {cfg.kind === 'vegano' && <CowIcon color={cfg.icon} />}
        {cfg.kind === 'proteico' && <ProteinIcon color={cfg.icon} />}
        {cfg.kind === 'amor' && <HeartIcon color={cfg.icon} />}
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily,
          fontWeight: 900,
          fontSize: 22,
          letterSpacing: 0.4,
          color: cfg.kind === 'vegano' ? GREEN : RED,
          textAlign: 'center',
          lineHeight: 1.15,
        }}
      >
        {cfg.label.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
};

const Handle: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [HANDLE_START, HANDLE_START + 18], [0, 1], clampCfg);
  const translateY = interpolate(frame, [HANDLE_START, HANDLE_START + 18], [10, 0], clampCfg);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily,
        fontWeight: 900,
        fontSize: 34,
        letterSpacing: 0.5,
        color: GREEN,
      }}
    >
      @uaitofu
    </div>
  );
};

// Arcos decorativos nos cantos — a mesma assinatura visual da vinheta
// original, replicados nos dois cantos opostos para equilibrar a
// composição no frame largo (16:9).
const CornerArcs: React.FC<{ frame: number; corner: 'tr' | 'bl'; opacityMax: number }> = ({
  frame,
  corner,
  opacityMax,
}) => {
  const opacity = interpolate(frame, [0, 20], [0, opacityMax], clampCfg);
  const isTR = corner === 'tr';
  const cx = isTR ? WIDTH + 60 : -60;
  const cy = isTR ? -80 : HEIGHT + 80;

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}
    >
      <circle cx={cx} cy={cy} r={260} fill="none" stroke={RED} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={380} fill="none" stroke={RED} strokeWidth={2} />
    </svg>
  );
};

type SparkleDot = { x: number; y: number; size: number; freq: number; phase: number };

const SPARKLE_DOTS: SparkleDot[] = [
  { x: 210, y: 180, size: 7, freq: 0.06, phase: 0.4 },
  { x: 900, y: 140, size: 5, freq: 0.07, phase: 2.1 },
  { x: 1750, y: 260, size: 6, freq: 0.065, phase: 1.1 },
  { x: 140, y: 920, size: 6, freq: 0.055, phase: 3.4 },
  { x: 940, y: 970, size: 5, freq: 0.075, phase: 4.2 },
  { x: 1820, y: 860, size: 7, freq: 0.06, phase: 0.9 },
  { x: 640, y: 90, size: 5, freq: 0.08, phase: 2.6 },
];

const Sparkles: React.FC<{ frame: number }> = ({ frame }) => {
  const envelope = interpolate(frame, [ICONS_START, ICONS_START + 30], [0, 1], clampCfg);
  if (envelope <= 0) return null;

  return (
    <>
      {SPARKLE_DOTS.map((d, i) => {
        const twinkle = 0.35 + 0.65 * Math.max(0, Math.sin(frame * d.freq + d.phase));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: d.x - d.size / 2,
              top: d.y - d.size / 2,
              width: d.size,
              height: d.size,
              borderRadius: '50%',
              background: CREAM,
              opacity: envelope * twinkle,
              boxShadow: '0 0 6px 1px rgba(255,253,246,0.8)',
            }}
          />
        );
      })}
    </>
  );
};

export const UaiTofuBrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <FontFace />
      <CornerArcs frame={frame} corner="tr" opacityMax={1} />
      <CornerArcs frame={frame} corner="bl" opacityMax={0.5} />
      <Sparkles frame={frame} />

      <Badge frame={frame} fps={fps} />

      <div
        style={{
          position: 'absolute',
          left: COL_LEFT,
          top: 0,
          bottom: 0,
          width: COL_WIDTH,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Tagline frame={frame} />
        <div style={{ display: 'flex', flexDirection: 'row', gap: 56, marginTop: 46 }}>
          {ICONS.map((cfg, i) => (
            <IconBadge key={cfg.kind} frame={frame} fps={fps} index={i} cfg={cfg} />
          ))}
        </div>
        <div style={{ marginTop: 40 }}>
          <Handle frame={frame} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
