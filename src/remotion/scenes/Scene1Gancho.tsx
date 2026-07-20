import React from 'react';
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
import {FONT_FAMILY} from '../fonts';

const SECOND_LINE_WORDS: {text: string; accent?: boolean}[] = [
  {text: 'Então'},
  {text: 'me'},
  {text: 'siga', accent: true},
  {text: 'aqui'},
  {text: 'para'},
  {text: 'saber'},
  {text: 'mais.'},
];

export const Scene1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const camZ = interpolate(frame, [0, 80], [-300, -800], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camDelta = camZ + 300;

  const bgOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glowPulse = interpolate(frame, [30, 55], [0.08, 0.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glow = 0.1 + Math.sin(frame * 0.06) * 0.02 * (glowPulse / 0.1);

  const headlineSpring = spring({
    frame: frame - 5,
    fps,
    config: {damping: 14, mass: 0.9},
  });
  const headlineY = interpolate(headlineSpring, [0, 1], [40, 0]);
  const headlineBlur = interpolate(frame, [5, 22], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headlineOpacityIn = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textExit = interpolate(frame, [55, 80], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textExitY = textExit * -1200;
  const textExitBlur = textExit * 20;
  const textExitOpacity = interpolate(textExit, [0, 1], [1, 0.2]);

  const bgExit = interpolate(frame, [58, 80], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bgExitY = bgExit * -1200;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.bgBase,
          opacity: bgOpacity,
          transform: `translateY(${bgExitY}px)`,
        }}
      >
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 120%, rgba(211,84,0,${glow}), transparent 60%)`,
          }}
        />
        <Noise opacity={0.04} />
      </AbsoluteFill>

      <CameraStage translateZ={camDelta}>
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT_FAMILY,
            transform: `translateY(${textExitY}px)`,
            filter: `blur(${textExitBlur}px)`,
            opacity: textExitOpacity,
          }}
        >
          <div
            style={{
              transform: `translateY(${headlineY}px)`,
              filter: `blur(${headlineBlur}px)`,
              opacity: headlineOpacityIn,
              fontSize: 70,
              fontWeight: 800,
              color: COLORS.textPrimary,
              letterSpacing: -1,
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            Gostou deste
            <br />
            conte&uacute;do?
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 45,
              fontWeight: 400,
              color: COLORS.textSecondary,
              textAlign: 'center',
              maxWidth: 820,
              lineHeight: 1.3,
            }}
          >
            {SECOND_LINE_WORDS.map((word, i) => {
              const start = 12 + i * 3;
              const wSpring = spring({
                frame: frame - start,
                fps,
                config: {damping: 14, mass: 0.8},
              });
              const wY = interpolate(wSpring, [0, 1], [40, 0]);
              const wBlur = interpolate(frame, [start, start + 15], [10, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const wOpacity = interpolate(frame, [start, start + 13], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    transform: `translateY(${wY}px)`,
                    filter: `blur(${wBlur}px)`,
                    opacity: wOpacity,
                    marginRight: '0.3em',
                    fontWeight: word.accent ? 800 : 400,
                    color: word.accent ? COLORS.accent : COLORS.textSecondary,
                  }}
                >
                  {word.text}
                </span>
              );
            })}
          </div>
        </AbsoluteFill>
      </CameraStage>
    </AbsoluteFill>
  );
};
