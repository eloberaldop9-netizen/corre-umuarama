import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {COLORS} from '../constants';
import {FONT_POPPINS} from '../fonts';
import {Noise} from '../components/Noise';
import {Captions} from '../components/Captions';
import {scene1Captions} from '../captions';

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

  // ---- ENTRADA: ALERTA! (frames 0-20) ----
  const alertaSpring = spring({frame, fps, config: {damping: 10, mass: 1.5}});
  const alertaScale = interpolate(alertaSpring, [0, 1], [3, 1]);
  const alertaOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const alertaBlur = interpolate(alertaSpring, [0, 1], [20, 0]);

  // Jitter during hold
  const jitterX = frame >= 20 && frame < 75 ? Math.sin(frame * 0.8) * 3 : 0;

  // ---- SAÍDA (75-97): Z-Dive ----
  const diveProgress = interpolate(frame, [75, 97], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const alertaScaleFromCamera = interpolate(diveProgress, [0, 1], [1, 4]);
  const alertaExitBlur = interpolate(diveProgress, [0, 1], [0, 30]);

  const bgOpacity = interpolate(frame, [82, 97], [1, 0], {
    easing: Easing.in(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill style={{backgroundColor: COLORS.brandRed, opacity: bgOpacity}}>
        <Noise opacity={0.06} />
        <Waves frame={frame} />
      </AbsoluteFill>

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
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

        <div style={{position: 'absolute', top: '62%', width: '84%'}}>
          <Captions chunks={scene1Captions} frame={frame} fontSize={56} style={{color: COLORS.black}} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
