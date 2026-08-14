import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {CheckCircle2, Smartphone, Wifi} from 'lucide-react';
import {COLORS} from '../constants';
import {FONT_POPPINS} from '../fonts';
import {Noise} from '../components/Noise';
import {Captions} from '../components/Captions';
import {scene3Captions} from '../captions';

const LOCAL_DURATION = 253;
const EXIT_START = 234;

const ChecklistRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  revealFrame: number;
  frame: number;
}> = ({icon, label, revealFrame, frame}) => {
  const s = spring({frame: frame - revealFrame, fps: 30, config: {damping: 14, mass: 0.8}});
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const translateX = interpolate(s, [0, 1], [-40, 0]);
  const checkOpacity = interpolate(
    spring({frame: frame - revealFrame - 12, fps: 30, config: {damping: 12, mass: 0.6}}),
    [0, 1],
    [0, 1],
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        width: 720,
        padding: '28px 36px',
        borderRadius: 28,
        backgroundColor: COLORS.surfaceDark,
        border: '1px solid rgba(255,255,255,0.1)',
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      <div style={{color: COLORS.textPrimary, flexShrink: 0}}>{icon}</div>
      <div
        style={{
          fontFamily: FONT_POPPINS,
          fontWeight: 600,
          fontSize: 34,
          color: COLORS.textPrimary,
          flex: 1,
        }}
      >
        {label}
      </div>
      <div style={{opacity: checkOpacity, flexShrink: 0}}>
        <CheckCircle2 size={44} color="#3ddc84" />
      </div>
    </div>
  );
};

export const Scene3Teste: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const introSpring = spring({frame, fps, config: {damping: 15, mass: 1}});
  const introOpacity = interpolate(introSpring, [0, 1], [0, 1]);
  const introY = interpolate(introSpring, [0, 1], [30, 0]);

  const exitProgress = interpolate(frame, [EXIT_START, LOCAL_DURATION], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.9]);
  const exitBlur = interpolate(exitProgress, [0, 1], [0, 20]);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(230,0,11,0.12), transparent 60%)',
        }}
      />
      <Noise opacity={0.04} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: exitOpacity,
          transform: `scale(${exitScale})`,
          filter: `blur(${exitBlur}px)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 64,
          }}
        >
          <div
            style={{
              width: '80%',
              minHeight: 90,
              opacity: introOpacity,
              transform: `translateY(${introY}px)`,
            }}
          >
            <Captions chunks={scene3Captions} frame={frame} fontSize={44} />
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
            <ChecklistRow
              icon={<Wifi size={40} />}
              label="Wi-Fi conectado"
              revealFrame={80}
              frame={frame}
            />
            <ChecklistRow
              icon={<Smartphone size={40} />}
              label="Apps funcionando"
              revealFrame={142}
              frame={frame}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
