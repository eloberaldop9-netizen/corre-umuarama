import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {CheckCircle2, Smartphone, Wifi} from 'lucide-react';
import {COLORS} from '../constants';
import {FONT_POPPINS} from '../fonts';
import {Noise} from '../components/Noise';
import {Captions} from '../components/Captions';
import {scene3Captions} from '../captions';
import {ci, mergeStyles} from '../motion';

const LOCAL_DURATION = 253;
const EXIT_START = 232;

const ChecklistRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  revealFrame: number;
  frame: number;
  exitDelay: number;
}> = ({icon, label, revealFrame, frame, exitDelay}) => {
  const entryDur = 20;
  const entryP = ci(frame, [revealFrame, revealFrame + entryDur], [0, 1]);
  const entryScale = ci(frame, [revealFrame, revealFrame + entryDur], [0.6, 1], Easing.out(Easing.back(1.7)));
  const entryBlur = ci(frame, [revealFrame, revealFrame + entryDur * 0.5], [6, 0]);
  const checkP = ci(frame, [revealFrame + 12, revealFrame + 24], [0, 1], Easing.out(Easing.back(2)));

  const exitStart = EXIT_START + exitDelay;
  const exitP = ci(frame, [exitStart, exitStart + 14], [0, 1], Easing.in(Easing.exp));
  const exitY = ci(exitP, [0, 1], [0, -30]);
  const exitBlur = ci(exitP, [0, 1], [0, 16]);
  const exitOp = ci(exitP, [0.3, 1], [1, 0]);
  const exitScale = ci(exitP, [0, 1], [1, 0.95]);

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
        opacity: entryP * exitOp,
        transform: `translateY(${exitY}px) scale(${entryScale * exitScale})`,
        filter: `blur(${entryBlur + exitBlur}px)`,
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
      <div style={{opacity: checkP, flexShrink: 0}}>
        <CheckCircle2 size={44} color="#3ddc84" />
      </div>
    </div>
  );
};

export const Scene3Teste: React.FC = () => {
  const frame = useCurrentFrame();

  const groupEntry = mergeStyles(
    {opacity: ci(frame, [0, 20], [0, 1], Easing.out(Easing.cubic))},
    {transform: `translateY(${ci(frame, [0, 26], [420, 0], Easing.out(Easing.cubic))}px)`},
  );

  const exitP = ci(frame, [EXIT_START, LOCAL_DURATION], [0, 1], Easing.in(Easing.exp));
  const exitX = ci(exitP, [0, 1], [0, 1200]);
  const exitBlur = ci(exitP, [0, 1], [0, 20]);
  const exitOpacity = ci(exitP, [0.35, 1], [1, 0]);
  const exitScale = ci(exitP, [0, 1], [1, 0.94]);

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
          transform: `translateX(${exitX}px) scale(${exitScale})`,
          filter: `blur(${exitBlur}px)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 64,
            opacity: groupEntry.opacity,
            transform: groupEntry.transform,
          }}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
            <ChecklistRow
              icon={<Wifi size={40} />}
              label="Wi-Fi conectado"
              revealFrame={80}
              exitDelay={0}
              frame={frame}
            />
            <ChecklistRow
              icon={<Smartphone size={40} />}
              label="Apps funcionando"
              revealFrame={142}
              exitDelay={4}
              frame={frame}
            />
          </div>

          <div style={{width: '80%', minHeight: 90}}>
            <Captions chunks={scene3Captions} frame={frame} fontSize={44} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
