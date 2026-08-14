import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {COLORS} from '../constants';
import {FONT_POPPINS} from '../fonts';
import {Noise} from '../components/Noise';

const Waves: React.FC<{frame: number}> = ({frame}) => {
  const rings = [0, 1, 2];
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {rings.map((i) => {
        const localFrame = (frame - i * 10) % 30;
        const progress = Math.max(0, localFrame) / 30;
        const scale = interpolate(progress, [0, 1], [0, 2]);
        const opacity = interpolate(progress, [0, 1], [0.5, 0], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 900,
              height: 900,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.05)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              transform: `scale(${scale})`,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Scene1Alerta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ---- ENTRADA: ALERTA! (frames 0-30) ----
  const alertaSpring = spring({
    frame,
    fps,
    config: {damping: 10, mass: 1.5},
  });
  const alertaScale = interpolate(alertaSpring, [0, 1], [3, 1]);
  const alertaOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const alertaBlur = interpolate(alertaSpring, [0, 1], [20, 0]);

  // Jitter during hold (30-65)
  const jitterX = frame >= 30 && frame < 65 ? Math.sin(frame * 0.8) * 3 : 0;

  // ---- ENTRADA: subtitle words (staggered) ----
  const wordSpring = (delay: number) =>
    spring({
      frame: frame - delay,
      fps,
      config: {damping: 14, mass: 0.8},
    });

  const suaSpring = wordSpring(10);
  const iptvSpring = wordSpring(13);
  const parouSpring = wordSpring(16);

  const wordStyle = (s: number): React.CSSProperties => ({
    display: 'inline-block',
    transform: `translateY(${interpolate(s, [0, 1], [80, 0])}px) skewY(${interpolate(
      s,
      [0, 1],
      [10, 0],
    )}deg)`,
    opacity: interpolate(s, [0, 1], [0, 1]),
  });

  // ---- SAÍDA (65-90): Z-Dive ----
  const diveProgress = interpolate(frame, [65, 90], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const alertaScaleFromCamera = interpolate(diveProgress, [0, 1], [1, 4]);
  const alertaExitBlur = interpolate(diveProgress, [0, 1], [0, 30]);

  const bgOpacity = interpolate(frame, [75, 90], [1, 0], {
    easing: Easing.in(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subExitProgress = interpolate(frame, [65, 90], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subTranslateY = interpolate(subExitProgress, [0, 1], [0, 200]);
  const subOpacity = interpolate(subExitProgress, [0, 1], [1, 0]);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill style={{backgroundColor: COLORS.brandRed, opacity: bgOpacity}}>
        <Noise opacity={0.06} />
        <Waves frame={frame} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${alertaScale * alertaScaleFromCamera}) translateX(${jitterX}px)`,
            opacity: alertaOpacity,
            filter: `blur(${(alertaBlur + alertaExitBlur).toFixed(1)}px)`,
            fontFamily: FONT_POPPINS,
            fontWeight: 900,
            fontSize: 180,
            color: COLORS.textPrimary,
            textAlign: 'center',
            lineHeight: 1,
            letterSpacing: '-2px',
          }}
        >
          ALERTA!
        </div>

        <div
          style={{
            position: 'absolute',
            top: '62%',
            display: 'flex',
            gap: 18,
            transform: `translateY(${subTranslateY}px)`,
            opacity: subOpacity,
            fontFamily: FONT_POPPINS,
            fontWeight: 600,
            fontSize: 60,
            color: COLORS.black,
          }}
        >
          <span style={wordStyle(suaSpring)}>Sua</span>
          <span style={wordStyle(iptvSpring)}>IPTV</span>
          <span style={wordStyle(parouSpring)}>parou?</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
