import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Headphones, MousePointer2, Phone} from 'lucide-react';
import {COLORS} from '../constants';
import {FONT_MONTSERRAT} from '../fonts';
import {DynamicSubtitle} from '../components/DynamicSubtitle';
import {scene6Captions} from '../captions';
import {ci} from '../motion';

const CLICK_AT = 53; // início de "equipe." (distribuição ponderada, ver captions.ts)

export const Scene6Cta: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- Logo assenta acima do cluster de contato ----
  const logoP = ci(frame, [0, 20], [0, 1], Easing.out(Easing.cubic));
  const logoY = ci(frame, [0, 20], [30, 0], Easing.out(Easing.cubic));

  // ---- Avatar de suporte entra da esquerda, colado ao botão ----
  const avatarP = ci(frame, [10, 30], [0, 1], Easing.out(Easing.back(1.6)));
  const avatarX = ci(frame, [10, 30], [-80, 0], Easing.out(Easing.back(1.6)));

  // ---- Botão de contato: bounce brutal ----
  const ctaP = ci(frame, [22, 40], [0, 1]);
  const ctaScale = interpolate(frame, [22, 30, 40], [0, 1.1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ---- Cursor clicando no botão, sincronizado com a última palavra ----
  const cursorP = ci(frame, [CLICK_AT - 14, CLICK_AT], [0, 1], Easing.out(Easing.cubic));
  const cursorOpacity = frame >= CLICK_AT - 14 && frame < CLICK_AT + 14 ? 1 : 0;
  const isPressed = frame >= CLICK_AT && frame < CLICK_AT + 6;
  const pressScale = isPressed ? 0.92 : 1;
  const clickGlowP = ci(frame, [CLICK_AT, CLICK_AT + 22], [0, 1], Easing.out(Easing.cubic));

  // ---- Respiração contínua pós-entrada ----
  const breathe = frame > 40 ? 1 + Math.sin((frame - 40) * 0.12) * 0.025 : 1;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ice}}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #FFFFFF 0%, #E4E6EA 100%)',
        }}
      />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 28,
          }}
        >
          <div
            style={{
              transform: `translateY(${logoY}px)`,
              opacity: logoP,
            }}
          >
            <Img
              src={staticFile('video/v10net-logo-circle.png')}
              style={{width: 130, height: 'auto'}}
            />
          </div>

          <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 20}}>
            <div
              style={{
                transform: `translateX(${avatarX}px)`,
                opacity: avatarP,
                width: 96,
                height: 96,
                borderRadius: '50%',
                backgroundColor: COLORS.surfaceDark,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 16px 36px rgba(0,0,0,0.18)',
                flexShrink: 0,
              }}
            >
              <Headphones size={42} color={COLORS.white} />
            </div>

            <div style={{position: 'relative'}}>
              {/* Glow do clique */}
              <div
                style={{
                  position: 'absolute',
                  inset: -20,
                  borderRadius: 100,
                  border: `3px solid ${COLORS.brandRed}`,
                  opacity: clickGlowP > 0 ? (1 - clickGlowP) * 0.8 : 0,
                  transform: `scale(${1 + clickGlowP * 0.4})`,
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  transform: `scale(${ctaScale * breathe * pressScale})`,
                  opacity: ctaP,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  backgroundColor: COLORS.brandRed,
                  borderRadius: 100,
                  padding: '26px 48px',
                  boxShadow: '0 20px 50px rgba(230,0,11,0.35)',
                }}
              >
                <Phone size={30} color={COLORS.white} />
                <span
                  style={{
                    fontFamily: FONT_MONTSERRAT,
                    fontWeight: 700,
                    fontSize: 38,
                    color: COLORS.white,
                  }}
                >
                  (44) 99945-1266
                </span>
              </div>

              {/* Cursor digital que "clica" */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -10,
                  right: ci(cursorP, [0, 1], [-60, 10]),
                  opacity: cursorOpacity,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                }}
              >
                <MousePointer2 size={36} color={COLORS.black} fill={COLORS.white} />
              </div>
            </div>
          </div>

          <div style={{width: '84%', minHeight: 100, marginTop: 8}}>
            <DynamicSubtitle
              chunks={scene6Captions}
              frame={frame}
              fontSize={44}
              activeColor={COLORS.brandRed}
              trailColor={COLORS.trailGrayLight}
              style={{justifyContent: 'center', textAlign: 'center'}}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
