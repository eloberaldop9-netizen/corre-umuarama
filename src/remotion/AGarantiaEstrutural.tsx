import React, {useMemo} from 'react';
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

const BG_BASE = '#0A0A0C';
const SURFACE = '#151517';
const ACCENT = '#D35400';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_SECONDARY = '#8B8B8D';

const SHIELD_PATH =
  'M180 8 L338 68 V218 C338 320 258 378 180 408 C102 378 22 320 22 218 V68 Z';

const Dust: React.FC<{frame: number}> = ({frame}) => {
  const particles = useMemo(
    () =>
      new Array(22).fill(0).map((_, i) => {
        const seed = i * 47.9;
        return {
          x: (Math.sin(seed) * 0.5 + 0.5) * 1080,
          startY: (Math.cos(seed * 1.7) * 0.5 + 0.5) * 1920,
          size: 1.5 + (i % 3),
        };
      }),
    [],
  );
  return (
    <>
      {particles.map((p, i) => {
        const y = ((p.startY - frame * 0.5) % 1920 + 1920) % 1920;
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
              background: '#FFFFFF',
              opacity: 0.25,
            }}
          />
        );
      })}
    </>
  );
};

export const AGarantiaEstrutural: React.FC = () => {
  useMontserratFont();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const camX = interpolate(frame, [0, 80], [150, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camYPos = interpolate(frame, [0, 80], [50, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camRotYDeg = interpolate(frame, [0, 80], [-15, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camRotY = (camRotYDeg * Math.PI) / 180;
  const camZExit = interpolate(frame, [95, 120], [-800, 400], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camZ = frame < 95 ? -800 : camZExit;
  const camDelta = camZ + 800;

  const bgOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bgBlur = interpolate(frame, [0, 18], [20, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const borderDraw = interpolate(frame, [5, 40], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bodySpring = spring({
    frame: frame - 15,
    fps,
    config: {damping: 21, mass: 1.5},
  });
  const bodyScale = interpolate(bodySpring, [0, 1], [0.9, 1]);
  const bodyOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const holdWindow = interpolate(frame, [90, 95], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glowPulse = (Math.sin(frame * 0.04) * 0.5 + 0.5) * holdWindow;
  const shieldGlow = 10 + glowPulse * 20;

  const sweepX = interpolate(frame, [60, 78], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const shieldBodyExit = interpolate(frame, [105, 118], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const line = (
    text: string,
    start: number,
    opts: {
      fontSize: number;
      fontWeight: number;
      color: string;
      letterSpacing: number;
      uppercase?: boolean;
      z: number;
      damping?: number;
      mass?: number;
      fromY?: number;
    },
  ) => {
    const {
      fontSize,
      fontWeight,
      color,
      letterSpacing,
      uppercase,
      damping = 14,
      mass = 0.8,
      fromY = -100,
    } = opts;
    const s = spring({frame: frame - start, fps, config: {damping, mass}});
    const offset = interpolate(s, [0, 1], [fromY, 0]);
    const blurIn = interpolate(frame, [start, start + 15], [10, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const opacityIn = interpolate(frame, [start, start + 13], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return (
      <div
        style={{
          transform: `translateZ(${opts.z}px) translateY(${offset}px)`,
          filter: `blur(${blurIn}px)`,
          opacity: opacityIn,
          fontSize,
          fontWeight,
          color,
          letterSpacing,
          textTransform: uppercase ? 'uppercase' : 'none',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    );
  };

  const timeExit = interpolate(frame, [95, 118], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const timeExitY = timeExit * -400;
  const timeExitBlur = timeExit * 20;
  const timeExitOpacity = interpolate(timeExit, [0, 1], [1, 0]);

  const solidezExit = interpolate(frame, [98, 120], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const solidezExitX = solidezExit * -800;
  const solidezExitSkew = solidezExit * -10;
  const solidezExitBlur = solidezExit * 25;
  const solidezExitOpacity = interpolate(solidezExit, [0, 1], [1, 0]);

  const segurancaExitX = solidezExit * 800;
  const segurancaExitSkew = solidezExit * 10;

  const supportFadeOut = interpolate(frame, [105, 119], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: BG_BASE, overflow: 'hidden'}}>
      <AbsoluteFill style={{opacity: bgOpacity, filter: `blur(${bgBlur}px)`}}>
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(135deg, rgba(211,84,0,0.15) 0%, transparent 60%)',
          }}
        />
        <Noise opacity={0.1} baseFrequency={0.9} />
        <Dust frame={frame} />
      </AbsoluteFill>

      <CameraStage
        translateX={camX}
        translateY={camYPos}
        translateZ={camDelta}
        rotateY={camRotY}
        perspective={2200}
      >
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT_FAMILY,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div style={{opacity: timeExitOpacity}}>
              {line('O prazo de', 18, {
                fontSize: 40,
                fontWeight: 400,
                color: TEXT_SECONDARY,
                letterSpacing: 0,
                z: 40,
              })}
            </div>
            <div
              style={{
                transform: `translateZ(60px) translateY(${
                  interpolate(
                    spring({frame: frame - 21, fps, config: {damping: 21, mass: 1.5}}),
                    [0, 1],
                    [-150, 0],
                  ) + timeExitY
                }px)`,
                filter: `blur(${
                  interpolate(frame, [21, 36], [15, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }) + timeExitBlur
                }px)`,
                opacity:
                  interpolate(frame, [21, 34], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }) * timeExitOpacity,
                fontSize: 80,
                fontWeight: 900,
                color: ACCENT,
                letterSpacing: -2,
                textTransform: 'uppercase',
              }}
            >
              5 anos,
            </div>

            <div style={{height: 10}} />

            <div
              style={{
                position: 'relative',
                width: 360,
                height: 420,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width={360}
                height={420}
                viewBox="0 0 360 420"
                style={{
                  position: 'absolute',
                  transform: `translateZ(0px) scale(${bodyScale})`,
                  opacity: bodyOpacity * (1 - shieldBodyExit),
                  filter: 'drop-shadow(30px 40px 30px rgba(0,0,0,0.8))',
                }}
              >
                <path d={SHIELD_PATH} fill={SURFACE} />
                <path
                  d={SHIELD_PATH}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={2}
                />
              </svg>
              <svg
                width={360}
                height={420}
                viewBox="0 0 360 420"
                style={{
                  position: 'absolute',
                  transform: 'translateZ(4px)',
                  opacity: 1 - shieldBodyExit,
                }}
              >
                <path
                  d={SHIELD_PATH}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth={6}
                  strokeDasharray={1600}
                  strokeDashoffset={1600 * (1 - borderDraw)}
                  style={{
                    filter: `drop-shadow(0 0 ${shieldGlow}px rgba(211,84,0,0.6))`,
                  }}
                />
              </svg>

              <div
                style={{
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: '0 20px',
                  opacity: supportFadeOut,
                }}
              >
                {line('previsto no Código Civil,', 24, {
                  fontSize: 35,
                  fontWeight: 400,
                  color: TEXT_SECONDARY,
                  letterSpacing: 0,
                  z: 40,
                })}
                {line('está relacionado à garantia de', 27, {
                  fontSize: 30,
                  fontWeight: 300,
                  color: TEXT_SECONDARY,
                  letterSpacing: 1,
                  z: 40,
                })}

                <div style={{display: 'flex', alignItems: 'baseline'}}>
                  <div
                    style={{
                      position: 'relative',
                      transform: `translateZ(80px) translateY(${
                        interpolate(
                          spring({
                            frame: frame - 32,
                            fps,
                            config: {damping: 25, mass: 2.0},
                          }),
                          [0, 1],
                          [200, 0],
                        )
                      }px) translateX(${solidezExitX}px) skewX(${solidezExitSkew}deg)`,
                      filter: `blur(${
                        interpolate(frame, [32, 52], [20, 0], {
                          extrapolateLeft: 'clamp',
                          extrapolateRight: 'clamp',
                        }) + solidezExitBlur
                      }px)`,
                      opacity:
                        interpolate(frame, [32, 45], [0, 1], {
                          extrapolateLeft: 'clamp',
                          extrapolateRight: 'clamp',
                        }) * solidezExitOpacity,
                      fontSize: 66,
                      fontWeight: 900,
                      color: TEXT_PRIMARY,
                      letterSpacing: -3,
                      textTransform: 'uppercase',
                      marginRight: 20,
                    }}
                  >
                    Solidez
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                          'linear-gradient(100deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)',
                        backgroundSize: '250% 100%',
                        backgroundPosition: `${sweepX}% 0`,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      Solidez
                    </div>
                  </div>
                  <div
                    style={{
                      transform: `translateZ(80px) translateY(${
                        interpolate(
                          spring({
                            frame: frame - 36,
                            fps,
                            config: {damping: 25, mass: 2.0},
                          }),
                          [0, 1],
                          [200, 0],
                        )
                      }px) translateX(${segurancaExitX}px) skewX(${segurancaExitSkew}deg)`,
                      filter: `blur(${
                        interpolate(frame, [36, 56], [20, 0], {
                          extrapolateLeft: 'clamp',
                          extrapolateRight: 'clamp',
                        }) + solidezExitBlur
                      }px)`,
                      opacity:
                        interpolate(frame, [36, 49], [0, 1], {
                          extrapolateLeft: 'clamp',
                          extrapolateRight: 'clamp',
                        }) * solidezExitOpacity,
                      fontSize: 66,
                      fontWeight: 900,
                      color: TEXT_PRIMARY,
                      letterSpacing: -3,
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    e Segurança
                  </div>
                </div>

                {line('da obra.', 40, {
                  fontSize: 40,
                  fontWeight: 600,
                  color: TEXT_SECONDARY,
                  letterSpacing: 0,
                  z: 60,
                  damping: 18,
                  mass: 1.0,
                  fromY: 100,
                })}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </CameraStage>
    </AbsoluteFill>
  );
};
