import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {CameraStage} from './Camera';
import {useMontserratFont, FONT_FAMILY} from './fonts';

const BG_VOID = '#050506';
const SURFACE = '#111113';
const ACCENT = '#D35400';
const STRIPE_IDLE = '#2E2E30';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_SECONDARY = '#C7C7CA';

const CARD_WIDTH = 900;
const CARD_HEIGHT = 180;

type CardData = {
  number: string;
  verb: string;
  detail: string;
  start: number;
  hit: number;
};

const CARDS: CardData[] = [
  {number: '01', verb: 'REGISTRE', detail: 'tudo o que puder.', start: 15, hit: 20},
  {number: '02', verb: 'SOLICITE', detail: 'um laudo técnico.', start: 22, hit: 27},
  {
    number: '03',
    verb: 'NOTIFIQUE',
    detail: 'formalmente a construtora.',
    start: 29,
    hit: 34,
  },
];

const CardShell: React.FC<{
  number: string;
  verb: string;
  detail: string;
  numberOpacity: number;
  stripeColor: string;
  stripeBrightness: number;
  clipPath?: string;
}> = ({number, verb, detail, numberOpacity, stripeColor, stripeBrightness, clipPath}) => (
  <div
    style={{
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 16,
      backgroundColor: SURFACE,
      borderTop: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 40px 50px rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      clipPath,
    }}
  >
    <div
      style={{
        width: 8,
        height: '100%',
        backgroundColor: stripeColor,
        filter: `brightness(${stripeBrightness})`,
        boxShadow: `0 0 ${16 * (stripeBrightness - 1) * 3 + 4}px ${stripeColor}`,
        flexShrink: 0,
      }}
    />
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 36,
        paddingLeft: 48,
      }}
    >
      <div
        style={{
          fontSize: 60,
          fontWeight: 900,
          color: ACCENT,
          opacity: numberOpacity,
          fontFamily: FONT_FAMILY,
          width: 90,
        }}
      >
        {number}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
        <div
          style={{
            fontSize: 46,
            fontWeight: 800,
            color: TEXT_PRIMARY,
            fontFamily: FONT_FAMILY,
            letterSpacing: -0.5,
          }}
        >
          {verb}
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: TEXT_SECONDARY,
            fontFamily: FONT_FAMILY,
          }}
        >
          {detail}
        </div>
      </div>
    </div>
  </div>
);

export const OProtocoloDeDefesa: React.FC = () => {
  useMontserratFont();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const camY = interpolate(frame, [15, 45], [150, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camZ = interpolate(frame, [95, 120], [-700, 300], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const gridOpacity = interpolate(frame, [0, 15], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const gridY = -frame;

  const introSpring = spring({frame: frame - 5, fps, config: {damping: 14, mass: 0.8}});
  const introY = interpolate(introSpring, [0, 1], [-50, 0]);
  const introBlurIn = interpolate(frame, [5, 20], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const introOpacityIn = interpolate(frame, [5, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const introExit = interpolate(frame, [95, 110], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const introScale = interpolate(introExit, [0, 1], [1, 0.9]);

  const stackY = frame >= 45 && frame < 95 ? Math.sin(frame * 0.03) * 3 : 0;

  const blackout = interpolate(frame, [100, 120], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cardMetrics = CARDS.map((c, i) => {
    const s = spring({frame: frame - c.start, fps, config: {damping: 20, mass: 1.8}});
    const enterY = interpolate(s, [0, 1], [-800, 0]);
    const rotX = interpolate(s, [0, 1], [15, 0]);
    const enterBlur = interpolate(frame, [c.start, c.start + 20], [20, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const enterOpacity = interpolate(frame, [c.start, c.start + 15], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const numberOpacity = interpolate(frame, [c.hit, c.hit + 6], [0.3, 1], {
      easing: Easing.out(Easing.exp),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const stripeLit = interpolate(frame, [c.hit, c.hit + 6], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const wavePhase = frame >= 50 && frame < 95 ? frame - i * 8 : -1000;
    const stripeBrightness =
      wavePhase >= 0 ? 1 + Math.max(0, Math.sin(wavePhase * ((2 * Math.PI) / 40))) * 0.15 : 1;

    const exitProgress = interpolate(frame, [95, 120], [0, 1], {
      easing: Easing.in(Easing.exp),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return {
      enterY,
      rotX,
      enterBlur,
      enterOpacity,
      numberOpacity,
      stripeLit,
      stripeBrightness,
      exitProgress,
    };
  });

  const stripeColor = (lit: number) =>
    lit <= 0 ? STRIPE_IDLE : lit >= 1 ? ACCENT : STRIPE_IDLE;

  return (
    <AbsoluteFill style={{backgroundColor: BG_VOID, overflow: 'hidden'}}>
      <CameraStage translateY={camY} translateZ={camZ} perspective={1900}>
        <AbsoluteFill
          style={{
            transform: `translateZ(-100px) translateY(${gridY}px)`,
            opacity: gridOpacity,
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 60px)',
          }}
        />
        <AbsoluteFill
          style={{
            transform: 'translateZ(-90px)',
            opacity: gridOpacity,
            background:
              'radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,0.8) 100%)',
          }}
        />

        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 260,
            fontFamily: FONT_FAMILY,
          }}
        >
          <div
            style={{
              transform: `translateZ(60px) translateY(${introY}px) scale(${introScale})`,
              filter: `blur(${introBlurIn}px)`,
              opacity: introOpacityIn * (1 - introExit),
              fontSize: 50,
              fontWeight: 500,
              color: TEXT_SECONDARY,
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            Ao identificar um v&iacute;cio,
          </div>
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              transform: `translateZ(80px) translateY(${stackY}px)`,
            }}
          >
            {CARDS.map((c, i) => {
              const m = cardMetrics[i];

              if (i === 1) {
                if (frame < 98) {
                  return (
                    <div
                      key={c.number}
                      style={{
                        transform: `translateY(${m.enterY}px) rotateX(${m.rotX}deg)`,
                        filter: `blur(${m.enterBlur}px)`,
                        opacity: m.enterOpacity,
                      }}
                    >
                      <CardShell
                        number={c.number}
                        verb={c.verb}
                        detail={c.detail}
                        numberOpacity={m.numberOpacity}
                        stripeColor={stripeColor(m.stripeLit)}
                        stripeBrightness={m.stripeBrightness}
                      />
                    </div>
                  );
                }
                const splitProgress = interpolate(
                  frame,
                  [98, 120],
                  [0, 1],
                  {
                    easing: Easing.in(Easing.exp),
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  },
                );
                const splitX = interpolate(splitProgress, [0, 1], [0, 600]);
                const splitOpacity = interpolate(splitProgress, [0, 1], [1, 0]);
                return (
                  <div
                    key={c.number}
                    style={{
                      position: 'relative',
                      width: CARD_WIDTH,
                      height: CARD_HEIGHT,
                      transform: `translateY(${m.enterY}px) rotateX(${m.rotX}deg)`,
                      filter: `blur(${m.enterBlur}px)`,
                      opacity: m.enterOpacity,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        transform: `translateX(${-splitX}px)`,
                        opacity: splitOpacity,
                      }}
                    >
                      <CardShell
                        number={c.number}
                        verb={c.verb}
                        detail={c.detail}
                        numberOpacity={m.numberOpacity}
                        stripeColor={stripeColor(m.stripeLit)}
                        stripeBrightness={m.stripeBrightness}
                        clipPath="inset(0 50% 0 0)"
                      />
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        transform: `translateX(${splitX}px)`,
                        opacity: splitOpacity,
                      }}
                    >
                      <CardShell
                        number={c.number}
                        verb={c.verb}
                        detail={c.detail}
                        numberOpacity={m.numberOpacity}
                        stripeColor={stripeColor(m.stripeLit)}
                        stripeBrightness={m.stripeBrightness}
                        clipPath="inset(0 0 0 50%)"
                      />
                    </div>
                  </div>
                );
              }

              const exitDirection = i === 0 ? -1 : 1;
              const exitY = m.exitProgress * 800 * exitDirection;
              const exitBlur = m.exitProgress * 25;
              const exitScale = interpolate(m.exitProgress, [0, 1], [1, 0.9]);

              return (
                <div
                  key={c.number}
                  style={{
                    transform: `translateY(${m.enterY + exitY}px) rotateX(${m.rotX}deg) scale(${exitScale})`,
                    filter: `blur(${m.enterBlur + exitBlur}px)`,
                    opacity: m.enterOpacity,
                  }}
                >
                  <CardShell
                    number={c.number}
                    verb={c.verb}
                    detail={c.detail}
                    numberOpacity={m.numberOpacity}
                    stripeColor={stripeColor(m.stripeLit)}
                    stripeBrightness={m.stripeBrightness}
                  />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </CameraStage>

      <AbsoluteFill style={{backgroundColor: BG_VOID, opacity: blackout}} />
    </AbsoluteFill>
  );
};
