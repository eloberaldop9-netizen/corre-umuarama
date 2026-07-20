import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS} from '../colors';
import {Noise} from '../Noise';
import {CameraStage} from '../Camera';
import {FONT_FAMILY} from '../fonts';

export const Scene1Saude: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const camZ = interpolate(frame, [0, 90], [-1000, -400], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camDelta = camZ + 1000;

  const bgLiveOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const saudeSpring = spring({
    frame: frame - 10,
    fps,
    config: {damping: 12, mass: 1.5},
  });
  const saudeY = interpolate(saudeSpring, [0, 1], [100, 0]);
  const saudeBlurIn = interpolate(frame, [10, 30], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const saudeOpacityIn = interpolate(frame, [10, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const commaProgress = interpolate(frame, [14, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const commaColor = interpolateColors(
    commaProgress,
    [0, 1],
    [COLORS.textPrimary, COLORS.accent],
  );
  const commaOpacity = interpolate(frame, [14, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lineSpring = spring({
    frame: frame - 18,
    fps,
    config: {damping: 14, mass: 0.8},
  });

  const holdWindow = interpolate(frame, [60, 65], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const microY = Math.sin(frame * 0.03) * 3 * holdWindow;
  const glowPulse = 0.15 + Math.sin(frame * 0.05) * 0.05;
  const ringPulse = 1 + Math.sin(frame * 0.015) * 0.05;

  const exitProgress = interpolate(frame, [65, 90], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitX = exitProgress * -1200;
  const exitBlur = exitProgress * 25;
  const exitOpacity = 1 - exitProgress;
  const exitScale = 1 - exitProgress * 0.06;

  const lineExitProgress = interpolate(frame, [68, 90], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lineX = lineExitProgress * -1200;
  const lineOpacity = (1 - lineExitProgress) * lineSpring;

  const ringExitProgress = interpolate(frame, [70, 90], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringScale = ringPulse * interpolate(ringExitProgress, [0, 1], [1, 0.5]);
  const ringOpacity = bgLiveOpacity * (1 - ringExitProgress);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bgBase}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(211,84,0,${glowPulse}), transparent 60%)`,
          opacity: bgLiveOpacity,
        }}
      />
      <Noise opacity={0.04} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: ringOpacity,
        }}
      >
        {[1, 1.35, 1.7].map((r, i) => (
          <svg
            key={i}
            width={900}
            height={900}
            style={{
              position: 'absolute',
              transform: `scale(${ringScale * r})`,
            }}
          >
            <circle
              cx={450}
              cy={450}
              r={380}
              fill="none"
              stroke={COLORS.accent}
              strokeWidth={1}
              opacity={0.1}
            />
          </svg>
        ))}
      </AbsoluteFill>

      <CameraStage translateZ={camDelta}>
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT_FAMILY,
          }}
        >
          <div
            style={{
              transform: `translateZ(120px) translateY(${
                saudeY + microY
              }px) translateX(${exitX}px) scale(${exitScale})`,
              filter: `blur(${saudeBlurIn + exitBlur}px)`,
              opacity: saudeOpacityIn * exitOpacity,
              fontSize: 140,
              fontWeight: 800,
              color: COLORS.textPrimary,
              letterSpacing: -3,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            SA&Uacute;DE
            <span style={{color: commaColor, opacity: commaOpacity}}>,</span>
          </div>
        </AbsoluteFill>
      </CameraStage>

      <div
        style={{
          position: 'absolute',
          bottom: 260,
          left: '50%',
          width: 500,
          height: 3,
          background: COLORS.accent,
          transform: `translateX(calc(-50% + ${lineX}px)) scaleX(${lineSpring})`,
          opacity: lineOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
