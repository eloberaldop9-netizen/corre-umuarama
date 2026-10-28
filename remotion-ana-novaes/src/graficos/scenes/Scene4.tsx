import React, { CSSProperties, useLayoutEffect } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../../lib/motion';
import { FONT, G, SPRINGS } from '../theme';
import { SpringWords } from '../SpringWords';
import { AppId, APPS, AppTile } from '../AppBadge';
import { MetalKnot, StudioEnvironment, StudioLights } from '../three/Studio';

// ─────────────────────────────────────────────────────────────────────────
// CENA 4 — Comunicação de Outro Nível (frames 1343–1800, local 0–457)
// Roteiro: peça final com 2D e 3D em harmonia, CTA claro, encerrando com o
// logotipo e os créditos da atividade. Saída: DISSOLVE para o preto.
// ─────────────────────────────────────────────────────────────────────────

/** Créditos da atividade — preencha e o vídeo atualiza sozinho. */
export const CREDITS = {
  /** Arquivo em public/assets (ex.: 'logo-faculdade.png'); null usa o monograma 2D/3D. */
  logo: null as string | null,
  discipline: 'Produção Gráfica e Comunicação Visual',
  /** Ex.: 'Fulana Silva · Ciclano Souza'; null oculta a linha. */
  authors: null as string | null,
  apps: ['blender', 'ae', 'pr'] as AppId[],
};

const T = {
  bgIn: 15,
  panel: 15,
  headline: 25,
  chips: 35,
  cta: 45,
  logo: 55,
  apps: 70,
  credits: 92,
  exit: 410,
  end: 457,
} as const;

const StaticCamera: React.FC = () => {
  const camera = useThree((s) => s.camera);
  useLayoutEffect(() => {
    camera.position.set(0, 0, 620);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
};

const World: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <StudioEnvironment intensity={0.4} />
      <StudioLights accent />
      <StaticCamera />
      <group scale={1.35} rotation={[0.35 + Math.sin(frame * 0.01) * 0.05, frame * 0.01, 0]}>
        <MetalKnot scanY={-9999} wireOpacity={0} ghostWire={0.1} />
      </group>
    </>
  );
};

const Chip: React.FC<{ label: string; color: string; filled: boolean; delay: number; frame: number; fps: number }> = ({
  label,
  color,
  filled,
  delay,
  frame,
  fps,
}) => {
  const s = frame < delay ? 0 : spring({ frame: frame - delay, fps, config: SPRINGS.impact });
  return (
    <div
      style={{
        padding: '10px 26px',
        borderRadius: 999,
        fontSize: 28,
        fontWeight: 800,
        letterSpacing: 1,
        color: filled ? G.white : color,
        backgroundColor: filled ? color : 'transparent',
        border: `2px solid ${color}`,
        transform: `scale(${s})`,
        opacity: ci(frame - delay, [0, 6], [0, 1]),
      }}
    >
      {label}
    </div>
  );
};

const HeartIcon = () => (
  <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={G.emerald} strokeWidth={1.8}>
    <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" />
  </svg>
);

const ShareIcon = () => (
  <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={G.emerald} strokeWidth={1.8}>
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 7l-4-4-4 4M12 3v12" />
  </svg>
);

/** Monograma padrão: quadrado plano (2D) + cubo em wireframe (3D). */
const Monogram: React.FC = () => (
  <svg width={150} height={84} viewBox="0 0 150 84">
    <rect x={6} y={14} width={56} height={56} rx={6} fill={G.indigo} />
    <g fill="none" stroke={G.emerald} strokeWidth={3} strokeLinejoin="round">
      <path d="M90 26 L114 14 L138 26 L114 38 Z" />
      <path d="M90 26 V56 L114 70 V38" />
      <path d="M138 26 V56 L114 70" />
    </g>
    <path d="M70 42 H82 M76 36 V48" stroke="rgba(255,255,255,0.7)" strokeWidth={3} strokeLinecap="round" />
  </svg>
);

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ── ENTRADAS ──────────────────────────────────────────────────────────
  const bgIn = ci(frame, [0, T.bgIn], [0, 1]); // linear 15f — dissipa o blackout
  const sPanel = frame < T.panel ? 0 : spring({ frame: frame - T.panel, fps, config: SPRINGS.panel });
  const panelBlurIn = Math.max(0, 10 * (1 - sPanel));
  const sCta = frame < T.cta ? 0 : spring({ frame: frame - T.cta, fps, config: SPRINGS.cta });
  const sLogo = frame < T.logo ? 0 : spring({ frame: frame - T.logo, fps, config: SPRINGS.panel });

  // ── HOLD ──────────────────────────────────────────────────────────────
  const pulse = frame > T.cta + 30 ? 1 + 0.01 * (1 - Math.cos(((frame - T.cta) / fps) * Math.PI * 2)) : 1;
  const borderAngle = 135 + Math.sin(frame * 0.03) * 40;
  const shine = (Math.max(0, frame - 40) % 120) / 120; // reflexo varrendo o vidro a cada 4s
  const float = Math.sin(frame * 0.03) * 4;

  // ── SAÍDA — DISSOLVE (cada bloco evapora; stagger 3f) ─────────────────
  const dissolveAt = (offset: number) => ci(frame, [T.exit + offset, T.exit + offset + 40], [0, 1], Easing.in(Easing.cubic));
  const dissolveStyle = (offset: number, baseBlur = 0): CSSProperties => {
    const d = dissolveAt(offset);
    const blur = baseBlur + 40 * d;
    return { opacity: 1 - d, filter: blur > 0.05 ? `blur(${blur}px)` : undefined };
  };
  const toBlack = ci(frame, [T.exit, T.end], [0, 1], Easing.inOut(Easing.cubic));

  const dPanel = dissolveAt(3);
  const panelStyle: CSSProperties = {
    position: 'absolute',
    left: 80,
    right: 80,
    top: 640,
    padding: '60px 56px 56px',
    borderRadius: 40,
    border: '1px solid transparent',
    background: `linear-gradient(rgba(20,20,22,0.65), rgba(20,20,22,0.65)) padding-box, linear-gradient(${borderAngle}deg, rgba(255,255,255,0.45), rgba(255,255,255,0.04) 40%, rgba(16,185,129,0.35) 75%, rgba(79,70,229,0.45)) border-box`,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    boxShadow: '0 40px 120px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
    overflow: 'hidden',
    fontFamily: FONT,
    color: G.white,
    transform: `translateY(${200 * (1 - sPanel) - 20 * dPanel + float}px) scale(${interpolate(sPanel, [0, 1], [0.95, 1])})`,
    ...dissolveStyle(3, panelBlurIn),
    opacity: ci(frame, [T.panel, T.panel + 10], [0, 1]) * (1 - dPanel),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 40,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', fontFamily: FONT }}>
      {/* FUNDO VIVO — render 3D contínuo, fora de foco */}
      <AbsoluteFill style={{ opacity: bgIn }}>
        <AbsoluteFill style={{ backgroundColor: G.glass }} />
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(circle at 30% 35%, rgba(79,70,229,0.22), transparent 50%), radial-gradient(circle at 70% 70%, rgba(16,185,129,0.18), transparent 55%)',
          }}
        />
        <AbsoluteFill style={{ filter: 'blur(15px)', transform: 'scale(1.06)' }}>
          <ThreeCanvas width={width} height={height} camera={{ fov: 50, near: 1, far: 5000, position: [0, 0, 620] }}>
            <World />
          </ThreeCanvas>
        </AbsoluteFill>
        {/* véu para o texto respirar sobre o 3D */}
        <AbsoluteFill
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0) 30%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.55))' }}
        />
      </AbsoluteFill>

      {/* LOGOTIPO */}
      <div
        style={{
          position: 'absolute',
          top: 270,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          transform: `translateY(${-60 * (1 - sLogo)}px)`,
          ...dissolveStyle(0, Math.max(0, 12 * (1 - sLogo))),
          opacity: ci(frame, [T.logo, T.logo + 10], [0, 1]) * (1 - dissolveAt(0)),
        }}
      >
        {CREDITS.logo ? (
          <Img src={staticFile(`assets/${CREDITS.logo}`)} style={{ height: 120, objectFit: 'contain' }} />
        ) : (
          <>
            <Monogram />
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 6, color: 'rgba(255,255,255,0.75)' }}>
              GRÁFICOS 2D & 3D
            </div>
          </>
        )}
      </div>

      {/* PAINEL GLASSMORPHISM — o 2D por cima do 3D */}
      <div style={panelStyle}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.09) 50%, transparent 60%)',
            transform: `translateX(${interpolate(shine, [0, 1], [-100, 100])}%)`,
            pointerEvents: 'none',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Chip label="2D" color={G.indigo} filled delay={T.chips} frame={frame} fps={fps} />
          <div style={{ fontSize: 34, fontWeight: 300, opacity: ci(frame, [T.chips + 2, T.chips + 10], [0, 0.7]) }}>+</div>
          <Chip label="3D" color={G.emerald} filled={false} delay={T.chips + 4} frame={frame} fps={fps} />
        </div>

        <SpringWords
          text="Comunicação de Outro Nível!"
          start={T.headline}
          ease={{ dur: 20, fn: Easing.out(Easing.cubic) }}
          from={{ y: 40 }}
          style={{ fontSize: 80, fontWeight: 700, letterSpacing: -2, lineHeight: 1.08, color: G.white, textAlign: 'center' }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '16px 34px',
            borderRadius: 999,
            border: '1.5px solid rgba(16,185,129,0.55)',
            backgroundColor: 'rgba(16,185,129,0.08)',
            transform: `scale(${sCta * pulse})`,
            opacity: ci(frame, [T.cta, T.cta + 6], [0, 1]),
          }}
        >
          <HeartIcon />
          <span style={{ fontSize: 30, fontWeight: 300, color: G.emerald, letterSpacing: 1 }}>Curta e Compartilhe</span>
          <ShareIcon />
        </div>
      </div>

      {/* CRÉDITOS — softwares + atividade */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          bottom: 130,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 30,
          color: G.white,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            ...dissolveStyle(6),
            opacity: ci(frame, [T.apps - 6, T.apps + 6], [0, 1]) * (1 - dissolveAt(6)),
          }}
        >
          Produzido com
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 56 }}>
          {CREDITS.apps.map((app, i) => {
            const at = T.apps + i * 5;
            const s = frame < at ? 0 : spring({ frame: frame - at, fps, config: SPRINGS.impact });
            const d = dissolveAt(6 + i * 3);
            return (
              <div
                key={app}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  transform: `translateY(${(1 - s) * 40}px) scale(${interpolate(s, [0, 1], [0.6, 1])})`,
                  opacity: ci(frame - at, [0, 8], [0, 1]) * (1 - d),
                  filter: d > 0.01 ? `blur(${40 * d}px)` : undefined,
                }}
              >
                <AppTile app={app} size={84} />
                <div style={{ fontSize: 22, fontWeight: 700 }}>{APPS[app].name}</div>
                <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                  {APPS[app].role}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.7)',
            transform: `translateY(${(1 - ci(frame, [T.credits, T.credits + 18], [0, 1], Easing.out(Easing.cubic))) * 24}px)`,
            opacity: ci(frame, [T.credits, T.credits + 14], [0, 1]) * (1 - dissolveAt(15)),
          }}
        >
          <div style={{ fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', fontSize: 18 }}>Atividade Universitária</div>
          <div>{CREDITS.discipline}</div>
          {CREDITS.authors ? <div style={{ color: G.white, fontWeight: 600 }}>{CREDITS.authors}</div> : null}
        </div>
      </div>

      {/* FADE PARA O PRETO ABSOLUTO */}
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: toBlack }} />
    </AbsoluteFill>
  );
};
