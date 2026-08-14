import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {MessageCircle} from 'lucide-react';
import {COLORS} from '../constants';
import {FONT_MONTSERRAT} from '../fonts';
import {Captions} from '../components/Captions';
import {scene6Captions} from '../captions';
import {entryFrom} from '../motion';

export const Scene6Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ---- ENTRADA DO GRUPO: da DIREITA (Mandamento 6: 5→6) ----
  const groupEntry = entryFrom(frame, 0, 'right', 420, 26);

  const logoSpring = spring({frame, fps, config: {damping: 13, mass: 0.9}});
  const logoScale = interpolate(logoSpring, [0, 1], [0.8, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  const textSpring = spring({frame: frame - 6, fps, config: {damping: 15, mass: 1}});
  const textTranslateY = interpolate(textSpring, [0, 1], [30, 0]);
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);

  const ctaSpring = spring({frame: frame - 24, fps, config: {damping: 10, mass: 0.8}});
  const ctaScale = interpolate(ctaSpring, [0, 0.7, 1], [0, 1.05, 1]);
  const ctaOpacity = interpolate(ctaSpring, [0, 1], [0, 1]);
  const ctaPulse = 1 + Math.sin(Math.max(0, frame - 24) * 0.12) * 0.025;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.08), transparent 50%)',
        }}
      />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 56,
            ...groupEntry,
          }}
        >
          <div style={{transform: `scale(${logoScale})`, opacity: logoOpacity}}>
            <Img
              src={staticFile('video/v10net-logo-circle.png')}
              style={{width: 200, height: 'auto'}}
            />
          </div>

          <div
            style={{
              width: '84%',
              minHeight: 100,
              transform: `translateY(${textTranslateY}px)`,
              opacity: textOpacity,
            }}
          >
            <Captions chunks={scene6Captions} frame={frame} fontSize={44} />
          </div>

          <div
            style={{
              transform: `scale(${ctaScale * ctaPulse})`,
              opacity: ctaOpacity,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              backgroundColor: COLORS.brandRed,
              borderRadius: 100,
              padding: '26px 52px',
              boxShadow: '0 20px 60px rgba(230,0,11,0.6)',
            }}
          >
            <MessageCircle size={34} color={COLORS.textPrimary} />
            <span
              style={{
                fontFamily: FONT_MONTSERRAT,
                fontWeight: 700,
                fontSize: 36,
                color: COLORS.textPrimary,
              }}
            >
              Fale com a Nossa Equipe
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
