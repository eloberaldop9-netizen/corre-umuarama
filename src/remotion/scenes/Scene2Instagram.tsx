import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS} from '../colors';
import {FONT_FAMILY} from '../fonts';
import {CursorTouch, CursorRipple} from '../icons/CursorTouch';

const IG = {
  blue: '#0095F6',
  active: '#363636',
  textSecondary: '#A8A8A8',
};

const HEADER_TOP = 625;
const PROFILE_TOP = 775;
const AVATAR_SIZE = 180;
const BIO_TOP = 995;
const BUTTON_TOP = 1215;
const BUTTON_WIDTH = 400;
const BUTTON_HEIGHT = 80;
const BUTTON_CENTER_X = 540;
const BUTTON_CENTER_Y = BUTTON_TOP + BUTTON_HEIGHT / 2;

const Stat: React.FC<{value: React.ReactNode; label: string}> = ({
  value,
  label,
}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <div style={{fontSize: 40, fontWeight: 700, color: COLORS.textPrimary}}>
      {value}
    </div>
    <div style={{fontSize: 26, color: IG.textSecondary, marginTop: 4}}>
      {label}
    </div>
  </div>
);

export const Scene2Instagram: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const mockupSpring = spring({
    frame,
    fps,
    config: {damping: 18, mass: 1.2},
  });
  const mockupY = interpolate(mockupSpring, [0, 1], [1200, 0]);
  const mockupBlurIn = interpolate(frame, [0, 25], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const mockupOpacityIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cursorEntrance = interpolate(frame, [18, 43], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorX = interpolate(cursorEntrance, [0, 1], [400, 0]);
  const cursorY = interpolate(cursorEntrance, [0, 1], [500, 0]);
  const cursorOpacityIn = interpolate(frame, [18, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const pressProgress = interpolate(frame, [42, 47], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const buttonPressScale = interpolate(pressProgress, [0, 1], [1, 0.94]);
  const cursorPressScale = interpolate(pressProgress, [0, 1], [1, 0.8]);

  const releaseSpring = spring({
    frame: frame - 47,
    fps,
    config: {damping: 18, stiffness: 200},
  });
  const buttonReleaseScale = interpolate(releaseSpring, [0, 1], [0.94, 1]);
  const buttonScale = frame < 47 ? buttonPressScale : buttonReleaseScale;

  const isFollowing = frame >= 47;

  const rippleProgress = interpolate(frame, [47, 58], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rippleScale = interpolate(rippleProgress, [0, 1], [1, 3]);
  const rippleOpacity = interpolate(rippleProgress, [0, 1], [0.5, 0]);

  const cursorFadeOut = interpolate(frame, [47, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorScale = (frame < 42 ? 1 : cursorPressScale) + cursorFadeOut * 1;
  const cursorOpacity = cursorOpacityIn * (1 - cursorFadeOut);

  const counterProgress = interpolate(frame, [50, 58], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const oldCountY = interpolate(counterProgress, [0, 1], [0, -20]);
  const oldCountOpacity = interpolate(counterProgress, [0, 1], [1, 0]);
  const newCountY = interpolate(counterProgress, [0, 1], [20, 0]);
  const newCountOpacity = interpolate(counterProgress, [0, 1], [0, 1]);
  const countBrightness = interpolate(frame, [50, 55], [1.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitProgress = interpolate(frame, [77, 107], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.98]);
  const exitBlur = exitProgress * 15;
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        transform: `translateY(${mockupY}px) scale(${exitScale})`,
        filter: `blur(${mockupBlurIn + exitBlur}px)`,
        opacity: mockupOpacityIn * exitOpacity,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: HEADER_TOP,
          left: 60,
          right: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <span style={{fontSize: 45, color: COLORS.textPrimary, fontWeight: 300}}>
          &#8249;
        </span>
        <span style={{fontSize: 45, fontWeight: 700, color: COLORS.textPrimary}}>
          drjarbascugula
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          top: PROFILE_TOP,
          left: 60,
          right: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 40,
        }}
      >
        <div
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: '50%',
            border: `3px solid ${COLORS.accent}`,
            padding: 6,
            flexShrink: 0,
            boxSizing: 'border-box',
          }}
        >
          <Img
            src={staticFile('images/avatar-jarbas.png')}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        </div>

        <div style={{display: 'flex', flex: 1, justifyContent: 'space-around'}}>
          <Stat value="27" label="posts" />
          <Stat
            value={
              <div
                style={{position: 'relative', height: 48, overflow: 'hidden'}}
              >
                <div
                  style={{
                    transform: `translateY(${oldCountY}px)`,
                    opacity: oldCountOpacity,
                  }}
                >
                  108
                </div>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `translateY(${newCountY}px)`,
                    opacity: newCountOpacity,
                    filter: `brightness(${countBrightness})`,
                  }}
                >
                  109
                </div>
              </div>
            }
            label="seguidores"
          />
          <Stat value="104" label="seguindo" />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: BIO_TOP,
          left: 60,
          right: 60,
          fontSize: 35,
          lineHeight: 1.4,
          color: COLORS.textPrimary,
        }}
      >
        <div style={{fontWeight: 700}}>Dr Jarbas Cugula</div>
        <div style={{color: IG.textSecondary}}>
          Advogado | Especialista em Direito Civil,
          <br />
          Imobili&aacute;rio e Condominial.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: BUTTON_TOP,
          left: BUTTON_CENTER_X - BUTTON_WIDTH / 2,
          width: BUTTON_WIDTH,
          height: BUTTON_HEIGHT,
          borderRadius: 16,
          backgroundColor: isFollowing ? IG.active : IG.blue,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${buttonScale})`,
        }}
      >
        <span style={{fontSize: 32, fontWeight: 800, color: '#FFFFFF'}}>
          {isFollowing ? 'Seguindo' : 'Seguir'}
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: BUTTON_CENTER_X,
          top: BUTTON_CENTER_Y,
          transform: `translate(-50%, -50%) translate(${cursorX}px, ${cursorY}px)`,
          opacity: cursorOpacity,
        }}
      >
        <CursorRipple scale={rippleScale} opacity={rippleOpacity} />
        <CursorTouch scale={cursorScale} opacity={0.6 * cursorOpacityIn} />
      </div>
    </AbsoluteFill>
  );
};
