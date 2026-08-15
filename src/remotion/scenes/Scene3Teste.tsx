import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Instagram, Wifi, Youtube} from 'lucide-react';
import {COLORS} from '../constants';
import {Noise} from '../components/Noise';
import {DynamicSubtitle} from '../components/DynamicSubtitle';
import {scene3Captions} from '../captions';
import {ci} from '../motion';

const LOCAL_DURATION = 253;
const EXIT_START = 218;

// Janelas derivadas da distribuição de palavras em captions.ts (scene3Captions).
const WIFI_IN = 97;
const APPS_IN = 133;

const AppIcon: React.FC<{
  icon: React.ReactNode;
  color: string;
  revealFrame: number;
  frame: number;
  offsetX: number;
}> = ({icon, color, revealFrame, frame, offsetX}) => {
  const p = ci(frame, [revealFrame, revealFrame + 16], [0, 1]);
  const scale = interpolate(
    frame,
    [revealFrame, revealFrame + 10, revealFrame + 16],
    [0, 1.2, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return (
    <div
      style={{
        position: 'absolute',
        top: 210,
        left: '50%',
        transform: `translateX(${offsetX - 28}px) scale(${scale})`,
        opacity: p,
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 8px 20px ${color}66`,
      }}
    >
      {icon}
    </div>
  );
};

const PhoneMockup: React.FC<{frame: number}> = ({frame}) => {
  const entryP = ci(frame, [0, 26], [0, 1], Easing.out(Easing.back(1.3)));
  const entryScale = ci(frame, [0, 26], [0.5, 1], Easing.out(Easing.back(1.3)));

  const wifiP = ci(frame, [WIFI_IN, WIFI_IN + 12], [0, 1], Easing.out(Easing.back(2)));
  const wifiRing = ci(frame, [WIFI_IN, WIFI_IN + 30], [0, 1]);

  return (
    <div
      style={{
        position: 'relative',
        width: 340,
        height: 620,
        opacity: entryP,
        transform: `scale(${entryScale})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 46,
          backgroundColor: COLORS.surfaceDark,
          border: `2px solid rgba(255,255,255,0.14)`,
          boxShadow: '0 40px 90px rgba(0,0,0,0.6)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          right: 14,
          bottom: 14,
          borderRadius: 34,
          backgroundColor: '#0a0a0d',
          overflow: 'hidden',
        }}
      >
        {/* Wi-Fi central, acende verde + anéis concêntricos */}
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {[0, 1, 2].map((i) => {
            const ringP = ((wifiRing * 60 - i * 18) % 60) / 60;
            const ringScale = ci(Math.max(0, ringP), [0, 1], [0.4, 2.4]);
            const ringOpacity = frame >= WIFI_IN ? ci(Math.max(0, ringP), [0, 1], [0.5, 0]) : 0;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  border: `2px solid ${COLORS.success}`,
                  opacity: ringOpacity,
                  transform: `scale(${ringScale})`,
                }}
              />
            );
          })}
          <Wifi
            size={64}
            color={frame >= WIFI_IN ? COLORS.success : COLORS.trailGray}
            strokeWidth={2.4}
            style={{
              filter: frame >= WIFI_IN ? `drop-shadow(0 0 ${10 * wifiP}px ${COLORS.success})` : 'none',
              transform: `scale(${1 + wifiP * 0.15})`,
            }}
          />
        </div>

        <AppIcon
          icon={<Youtube size={30} color={COLORS.white} />}
          color="#FF3B3B"
          revealFrame={APPS_IN}
          frame={frame}
          offsetX={-40}
        />
        <AppIcon
          icon={<Instagram size={26} color={COLORS.white} />}
          color="#C13584"
          revealFrame={APPS_IN + 8}
          frame={frame}
          offsetX={40}
        />
      </div>
    </div>
  );
};

export const Scene3Teste: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- SAÍDA: colapso gravitacional ----
  const exitP = ci(frame, [EXIT_START, LOCAL_DURATION], [0, 1], Easing.in(Easing.cubic));
  const exitScale = ci(exitP, [0, 1], [1, 0]);
  const exitRotate = ci(exitP, [0, 1], [0, 90]);
  const exitOpacity = ci(exitP, [0, 1], [1, 0]);
  const exitBlur = ci(exitP, [0, 1], [0, 10]);

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
          transform: `scale(${exitScale}) rotate(${exitRotate}deg)`,
          filter: `blur(${exitBlur}px)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 56,
          }}
        >
          <PhoneMockup frame={frame} />

          <div style={{width: '84%', minHeight: 90}}>
            <DynamicSubtitle
              chunks={scene3Captions}
              frame={frame}
              fontSize={44}
              style={{justifyContent: 'center', textAlign: 'center'}}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
