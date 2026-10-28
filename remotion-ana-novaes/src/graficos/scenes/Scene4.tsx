import React, { CSSProperties, useLayoutEffect } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../../lib/motion';
import { FONT, G, SPRINGS } from '../theme';
import { SpringWords } from '../SpringWords';
import { MetalKnot, StudioEnvironment, StudioLights } from '../three/Studio';

// ─────────────────────────────────────────────────────────────────────────
// CENA 4 — Comunicação de Outro Nível (frames 1343–1800, local 0–457)
// 2D COM 3D: escultura girando desfocada ao fundo, placa glassmorphism na
// frente. Saída: DISSOLVE — o vidro evapora e o fundo afunda no preto.
// ─────────────────────────────────────────────────────────────────────────

const T = {
  bgIn: 15,
  panel: 15,
  headline: 25,
  chips: 35,
  cta: 45,
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

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ── ENTRADAS ──────────────────────────────────────────────────────────
  const bgIn = ci(frame, [0, T.bgIn], [0, 1]); // linear 15f — dissipa o blackout
  const sPanel = frame < T.panel ? 0 : spring({ frame: frame - T.panel, fps, config: SPRINGS.panel });
  const panelBlurIn = Math.max(0, 10 * (1 - sPanel));
  const sCta = frame < T.cta ? 0 : spring({ frame: frame - T.cta, fps, config: SPRINGS.cta });

  // ── HOLD ──────────────────────────────────────────────────────────────
  const pulse = frame > T.cta + 30 ? 1 + 0.01 * (1 - Math.cos(((frame - T.cta) / fps) * Math.PI * 2)) : 1;
  const borderAngle = 135 + Math.sin(frame * 0.03) * 40;
  const shine = ((frame - 40) % 120) / 120; // reflexo varrendo o vidro a cada 4s

  // ── SAÍDA — DISSOLVE ──────────────────────────────────────────────────
  const dissolve = ci(frame, [T.exit, T.exit + 40], [0, 1], Easing.in(Easing.cubic));
  const toBlack = ci(frame, [T.exit, T.end], [0, 1], Easing.inOut(Easing.cubic));

  const panelBlur = panelBlurIn + 40 * dissolve;
  const panelStyle: CSSProperties = {
    position: 'absolute',
    left: 80,
    right: 80,
    top: '50%',
    padding: '64px 56px 60px',
    borderRadius: 40,
    border: '1px solid transparent',
    background: `linear-gradient(rgba(20,20,22,0.65), rgba(20,20,22,0.65)) padding-box, linear-gradient(${borderAngle}deg, rgba(255,255,255,0.45), rgba(255,255,255,0.04) 40%, rgba(16,185,129,0.35) 75%, rgba(79,70,229,0.45)) border-box`,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    boxShadow: '0 40px 120px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
    overflow: 'hidden',
    fontFamily: FONT,
    color: G.white,
    transform: `translateY(-50%) translateY(${200 * (1 - sPanel) - 20 * dissolve}px) scale(${interpolate(sPanel, [0, 1], [0.95, 1])})`,
    opacity: ci(frame, [T.panel, T.panel + 10], [0, 1]) * (1 - dissolve),
    filter: panelBlur > 0.05 ? `blur(${panelBlur}px)` : undefined,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 40,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
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
      </AbsoluteFill>

      {/* PAINEL GLASSMORPHISM — o 2D por cima do 3D */}
      <div style={panelStyle}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.09) 50%, transparent 60%)',
            transform: `translateX(${interpolate(shine, [0, 1], [-100, 100])}%)`,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 4,
            color: 'rgba(255,255,255,0.6)',
            textTransform: 'uppercase',
            opacity: ci(frame, [T.panel + 6, T.panel + 18], [0, 1]),
          }}
        >
          Atividade Universitária · Portfólio
        </div>

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

      {/* FADE PARA O PRETO ABSOLUTO */}
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: toBlack }} />
    </AbsoluteFill>
  );
};
