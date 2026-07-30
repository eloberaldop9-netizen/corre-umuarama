import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Noise} from './Noise';
import {CameraStage} from './Camera';
import {useMontserratFont, FONT_FAMILY} from './fonts';

const BG_VOID = '#050506';
const ACCENT = '#D35400';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_SECONDARY = '#B9B9BC';

const DROP_SHADOW = 'drop-shadow(0 30px 40px rgba(0,0,0,0.8))';

type ExitMetrics = {progress: number; opacity: number};

const useExit = (frame: number, start: number, duration = 18): ExitMetrics => {
  const progress = interpolate(frame, [start, start + duration], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = progress < 0.5 ? 1 : interpolate(progress, [0.5, 1], [1, 0]);
  return {progress, opacity};
};

const FallWord: React.FC<{
  text: string;
  fontSize: number;
  fontWeight: number;
  tracking: number;
  color: string;
  z: number;
  enterStart: number;
  exitStart: number;
  enterFromY: number;
  enterBlur: number;
  enterDamping: number;
  enterMass: number;
  frame: number;
  fps: number;
}> = ({
  text,
  fontSize,
  fontWeight,
  tracking,
  color,
  z,
  enterStart,
  exitStart,
  enterFromY,
  enterBlur,
  enterDamping,
  enterMass,
  frame,
  fps,
}) => {
  const s = spring({
    frame: frame - enterStart,
    fps,
    config: {damping: enterDamping, mass: enterMass},
  });
  const enterYRange: readonly number[] = [enterFromY, 0];
  const enterY = interpolate(s, [0, 1], enterYRange);
  const enterBlurRange: readonly number[] = [enterBlur, 0];
  const enterBlurV = interpolate(frame, [enterStart, enterStart + 18], enterBlurRange, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const enterOpacity = interpolate(frame, [enterStart, enterStart + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const {progress: exitProgress, opacity: exitOpacity} = useExit(frame, exitStart);
  const exitY = exitProgress * -1200;
  const exitBlur = exitProgress * 20;

  return (
    <div
      style={{
        transform: `translateZ(${z}px) translateY(${enterY + exitY}px)`,
        filter: `blur(${enterBlurV + exitBlur}px) ${DROP_SHADOW}`,
        opacity: enterOpacity * exitOpacity,
        fontSize,
        fontWeight,
        letterSpacing: tracking,
        color,
        fontFamily: FONT_FAMILY,
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  );
};

const RiseWord: React.FC<{
  text: string;
  fontSize: number;
  fontWeight: number;
  tracking: number;
  z: number;
  enterStart: number;
  exitStart: number;
  exitScaleTo: number;
  exitBlurTo: number;
  glow: number;
  frame: number;
  fps: number;
}> = ({
  text,
  fontSize,
  fontWeight,
  tracking,
  z,
  enterStart,
  exitStart,
  exitScaleTo,
  exitBlurTo,
  glow,
  frame,
  fps,
}) => {
  const s = spring({frame: frame - enterStart, fps, config: {damping: 22, mass: 2.0}});
  const enterY = interpolate(s, [0, 1], [200, 0]);
  const enterBlurV = interpolate(frame, [enterStart, enterStart + 20], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const enterOpacity = interpolate(frame, [enterStart, enterStart + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const {progress: exitProgress, opacity: exitOpacity} = useExit(frame, exitStart);
  const exitScaleRange: readonly number[] = [1, exitScaleTo];
  const exitScale = interpolate(exitProgress, [0, 1], exitScaleRange);
  const exitBlur = exitProgress * exitBlurTo;

  return (
    <div
      style={{
        transform: `translateZ(${z}px) translateY(${enterY}px) scale(${exitScale})`,
        filter: `blur(${enterBlurV + exitBlur}px) ${DROP_SHADOW} drop-shadow(0 0 ${glow}px rgba(211,84,0,0.5))`,
        opacity: enterOpacity * exitOpacity,
        fontSize,
        fontWeight,
        letterSpacing: tracking,
        color: ACCENT,
        fontFamily: FONT_FAMILY,
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  );
};

export const OUltimatoJuridico: React.FC = () => {
  useMontserratFont();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const camZPhase1 = interpolate(frame, [0, 95], [-800, -300], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camZPhase2 = interpolate(frame, [95, 120], [-300, 600], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camZ = frame < 95 ? camZPhase1 : camZPhase2;
  const camRotX = (2 * Math.PI) / 180;

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bgScale = interpolate(frame, [0, 20], [0.5, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bgExit = interpolate(frame, [105, 120], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ringRotation = frame * 0.2;
  const ringFlash = interpolate(frame, [38, 43, 48], [0.15, 0.6, 0.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const inHold = frame >= 50 && frame < 95;
  const upperMicroY = inHold ? Math.sin(frame * 0.02) * 2 : 0;
  const lowerMicroY = inHold ? Math.cos(frame * 0.03) * 1.5 : 0;
  const urgencyGlow = inHold ? 10 + (0.5 + 0.5 * Math.sin(frame * 0.05)) * 25 : 10;

  const flashOverlay = interpolate(frame, [108, 120], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: BG_VOID, overflow: 'hidden'}}>
      <CameraStage translateZ={camZ} rotateX={camRotX} perspective={1850}>
        <AbsoluteFill
          style={{
            transform: 'translateZ(-150px) scale(' + bgScale + ')',
            opacity: bgOpacity * bgExit,
          }}
        >
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(circle at 50% 60%, rgba(211,84,0,0.06), transparent 65%)',
            }}
          />
          <Noise opacity={0.05} />
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
            <svg width={800} height={800} viewBox="0 0 800 800">
              <circle
                cx={400}
                cy={400}
                r={390}
                fill="none"
                stroke={`rgba(211,84,0,${ringFlash})`}
                strokeWidth={2}
                strokeDasharray="4 12"
                transform={`rotate(${ringRotation} 400 400)`}
              />
            </svg>
          </AbsoluteFill>
        </AbsoluteFill>

        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transform: `translateY(${upperMicroY}px)`,
              }}
            >
              <FallWord
                text="PROCURE"
                fontSize={75}
                fontWeight={800}
                tracking={-1}
                color={TEXT_PRIMARY}
                z={40}
                enterStart={8}
                exitStart={95}
                enterFromY={-200}
                enterBlur={20}
                enterDamping={18}
                enterMass={1.5}
                frame={frame}
                fps={fps}
              />
              <FallWord
                text="ORIENTA&Ccedil;&Atilde;O"
                fontSize={85}
                fontWeight={900}
                tracking={-2}
                color={TEXT_PRIMARY}
                z={60}
                enterStart={12}
                exitStart={98}
                enterFromY={-200}
                enterBlur={20}
                enterDamping={18}
                enterMass={1.5}
                frame={frame}
                fps={fps}
              />
              <FallWord
                text="JUR&Iacute;DICA"
                fontSize={85}
                fontWeight={900}
                tracking={-2}
                color={TEXT_PRIMARY}
                z={60}
                enterStart={16}
                exitStart={101}
                enterFromY={-200}
                enterBlur={20}
                enterDamping={18}
                enterMass={1.5}
                frame={frame}
                fps={fps}
              />

              <div style={{height: 20}} />

              <FallWord
                text="e analise"
                fontSize={40}
                fontWeight={400}
                tracking={0}
                color={TEXT_SECONDARY}
                z={40}
                enterStart={22}
                exitStart={105}
                enterFromY={-100}
                enterBlur={10}
                enterDamping={14}
                enterMass={0.8}
                frame={frame}
                fps={fps}
              />
              <FallWord
                text="o caso"
                fontSize={40}
                fontWeight={400}
                tracking={0}
                color={TEXT_SECONDARY}
                z={40}
                enterStart={26}
                exitStart={105}
                enterFromY={-100}
                enterBlur={10}
                enterDamping={14}
                enterMass={0.8}
                frame={frame}
                fps={fps}
              />
            </div>

            <div style={{height: 40}} />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transform: `translateY(${lowerMicroY}px)`,
              }}
            >
              <RiseWord
                text="O QUANTO"
                fontSize={95}
                fontWeight={900}
                tracking={-3}
                z={80}
                enterStart={32}
                exitStart={95}
                exitScaleTo={15}
                exitBlurTo={25}
                glow={urgencyGlow}
                frame={frame}
                fps={fps}
              />
              <RiseWord
                text="ANTES."
                fontSize={95}
                fontWeight={900}
                tracking={-3}
                z={80}
                enterStart={36}
                exitStart={98}
                exitScaleTo={20}
                exitBlurTo={30}
                glow={urgencyGlow}
                frame={frame}
                fps={fps}
              />
            </div>
          </div>
        </AbsoluteFill>

        <AbsoluteFill
          style={{transform: 'translateZ(500px)', backgroundColor: ACCENT, opacity: flashOverlay}}
        />
      </CameraStage>
    </AbsoluteFill>
  );
};
