import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS} from '../colors';
import {Noise} from '../Noise';
import {CameraStage} from '../Camera';
import {Handshake} from '../icons/Handshake';
import {FONT_FAMILY} from '../fonts';

const Dust: React.FC<{frame: number}> = ({frame}) => {
  const particles = useMemo(
    () =>
      new Array(28).fill(0).map((_, i) => {
        const seed = i * 37.13;
        return {
          x: (Math.sin(seed) * 0.5 + 0.5) * 1080,
          startY: (Math.cos(seed * 1.7) * 0.5 + 0.5) * 1920,
          size: 2 + (i % 4),
          speed: 0.3 + (i % 5) * 0.08,
        };
      }),
    [],
  );

  return (
    <>
      {particles.map((p, i) => {
        const y = ((p.startY - frame * p.speed) % 1920 + 1920) % 1920;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: COLORS.accent,
              opacity: 0.35,
              filter: 'blur(0.5px)',
            }}
          />
        );
      })}
    </>
  );
};

export const Scene3Sossego: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const camDeltaZ = interpolate(frame, [0, 60], [0, -600], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dustOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const handDraw = interpolate(frame, [8, 38], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const handOpacityIn = interpolate(frame, [8, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const handGlow = 17 + Math.sin(frame * 0.02) * 8;

  const eSpring = spring({frame: frame - 15, fps, config: {damping: 15, mass: 0.7}});
  const eY = interpolate(eSpring, [0, 1], [30, 0]);
  const eBlur = interpolate(frame, [15, 35], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const eOpacity = interpolate(frame, [15, 32], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sossegoSpring = spring({
    frame: frame - 19,
    fps,
    config: {damping: 15, mass: 0.7},
  });
  const sossegoY = interpolate(sossegoSpring, [0, 1], [30, 0]);
  const sossegoBlur = interpolate(frame, [19, 39], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sossegoOpacity = interpolate(frame, [19, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textCollapse = interpolate(frame, [62, 87], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textCollapseScale = interpolate(textCollapse, [0, 1], [1, 0.6]);
  const textCollapseBlur = textCollapse * 20;
  const textCollapseOpacity = 1 - textCollapse;
  const textCollapseTracking = interpolate(textCollapse, [0, 1], [-1, -15]);

  const handCollapse = interpolate(frame, [65, 87], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const handCollapseScale = interpolate(handCollapse, [0, 1], [1, 0.2]);
  const handCollapseBlur = handCollapse * 30;
  const handCollapseOpacity = 1 - handCollapse;

  return (
    <AbsoluteFill style={{backgroundColor: '#050505'}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(211,84,0,0.08), transparent 70%)',
        }}
      />
      <Noise opacity={0.035} />
      <AbsoluteFill style={{opacity: dustOpacity}}>
        <Dust frame={frame} />
      </AbsoluteFill>

      <CameraStage translateZ={camDeltaZ}>
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT_FAMILY,
          }}
        >
          <div
            style={{
              transform: `translateZ(20px) translateY(-140px) scale(${handCollapseScale})`,
              opacity: handOpacityIn * handCollapseOpacity,
              filter: `blur(${handCollapseBlur}px)`,
            }}
          >
            <Handshake size={180} draw={handDraw} opacity={1} glow={handGlow} />
          </div>

          <div
            style={{
              transform: `translateZ(20px) scale(${textCollapseScale})`,
              filter: `blur(${textCollapseBlur}px)`,
              fontSize: 90,
              fontWeight: 800,
              color: COLORS.textPrimary,
              letterSpacing: textCollapseTracking,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                transform: `translateY(${eY}px)`,
                filter: `blur(${eBlur}px)`,
                opacity: eOpacity * textCollapseOpacity,
                display: 'inline-block',
                marginRight: '0.3em',
              }}
            >
              E
            </span>
            <span
              style={{
                transform: `translateY(${sossegoY}px)`,
                filter: `blur(${sossegoBlur}px)`,
                opacity: sossegoOpacity * textCollapseOpacity,
                display: 'inline-block',
              }}
            >
              SOSSEGO.
            </span>
          </div>
        </AbsoluteFill>
      </CameraStage>
    </AbsoluteFill>
  );
};
