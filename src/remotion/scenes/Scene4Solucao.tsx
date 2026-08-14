import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {COLORS} from '../constants';
import {FONT_POPPINS, FONT_MONTSERRAT} from '../fonts';

export const Scene4Solucao: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ---- CÂMERA: Orbit 15° -> 0° (local 0-47) ----
  const orbitProgress = interpolate(frame, [0, 47], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const orbitRotateY = interpolate(orbitProgress, [0, 1], [-15, 0]);

  // ---- ENTRADA ----
  const textSpring = spring({frame, fps, config: {damping: 15, mass: 1}});
  const textTranslateY = interpolate(textSpring, [0, 1], [40, 0]);
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);
  const textBlur = interpolate(textSpring, [0, 1], [10, 0]);

  const logoSpring = spring({frame: frame - 10, fps, config: {damping: 13, mass: 0.9}});
  const logoScale = interpolate(logoSpring, [0, 1], [0.8, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);
  const logoTranslateZ = interpolate(logoSpring, [0, 1], [-200, 0]);

  const ctaSpring = spring({
    frame: frame - 22,
    fps,
    config: {damping: 10, mass: 0.8},
  });
  const ctaScale = interpolate(
    ctaSpring,
    [0, 0.7, 1],
    [0, 1.05, 1],
  );
  const ctaOpacity = interpolate(ctaSpring, [0, 1], [0, 1]);

  // ---- HOLD: glare sweep on "INTERNET." around local frame 47 ----
  const glareProgress = interpolate(frame, [37, 67], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glareX = interpolate(glareProgress, [0, 1], [-150, 150]);

  // CTA infinite pulse
  const ctaPulse = 1 + Math.sin(Math.max(0, frame - 22) * 0.12) * 0.025;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.08), transparent 50%)',
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 1200,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 56,
            transform: `translateY(${textTranslateY}px)`,
            opacity: textOpacity,
            filter: `blur(${textBlur}px)`,
          }}
        >
          <div style={{textAlign: 'center'}}>
            <div
              style={{
                fontFamily: FONT_MONTSERRAT,
                fontWeight: 500,
                fontSize: 48,
                color: COLORS.textPrimary,
              }}
            >
              A culpa é da sua
            </div>
            <div
              style={{
                position: 'relative',
                fontFamily: FONT_POPPINS,
                fontWeight: 900,
                fontSize: 90,
                color: COLORS.brandRed,
                overflow: 'hidden',
              }}
            >
              INTERNET.
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: `${glareX}%`,
                  width: '40%',
                  height: '100%',
                  background:
                    'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
                  mixBlendMode: 'screen',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          <div
            style={{
              transform: `scale(${logoScale}) translateZ(${logoTranslateZ}px) rotateY(${orbitRotateY}deg)`,
              opacity: logoOpacity,
              transformStyle: 'preserve-3d',
            }}
          >
            <Img
              src={staticFile('video/v10net-logo.png')}
              style={{width: 280, height: 'auto', borderRadius: 40}}
            />
          </div>

          <div
            style={{
              transform: `scale(${ctaScale * ctaPulse})`,
              opacity: ctaOpacity,
              backgroundColor: COLORS.brandRed,
              borderRadius: 100,
              padding: '28px 64px',
              boxShadow: '0 20px 60px rgba(230,0,11,0.6)',
            }}
          >
            <span
              style={{
                fontFamily: FONT_MONTSERRAT,
                fontWeight: 700,
                fontSize: 40,
                color: COLORS.textPrimary,
              }}
            >
              Assine Fibra Agora
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
