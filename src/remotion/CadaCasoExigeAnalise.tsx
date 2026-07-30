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

const BG_DEEP = '#0B0B0B';
const GRAPHITE = '#1F1F1F';
const GRAY_INSTITUTIONAL = '#6F6F6F';
const WHITE_MAIN = '#FFFFFF';
const WHITE_SOFT = '#F2F2F2';
const ORANGE = '#E65300';
const GOLD = '#B98A3A';

const range = (...values: number[]): readonly number[] => values;

const DROP_SHADOW =
  'drop-shadow(0 2px 4px rgba(0,0,0,0.9)) drop-shadow(0 20px 30px rgba(0,0,0,0.75))';

// ---------- Timing map (30fps, 180 frames / 6.0s) ----------
const T = {
  intro: 4, // "…dependendo da"
  p1: 18, // ORIGEM DO PROBLEMA
  p2: 54, // DAS PROVAS
  p3: 90, // E DOS PRAZOS APLICÁVEIS AO CASO.
  p4: 130, // recap: origem | provas | prazos
  end: 180,
};

const useFall = (frame: number, start: number, damping: number, mass: number, fromY: number) => {
  const s = spring({frame: frame - start, fps: 30, config: {damping, mass}});
  const y = interpolate(s, range(0, 1), range(fromY, 0));
  const blur = interpolate(frame, range(start, start + 14), range(16, 0), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, range(start, start + 10), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return {y, blur, opacity};
};

const usePhaseExit = (frame: number, start: number, duration = 12) =>
  interpolate(frame, range(start, start + duration), range(0, 1), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// ---------- Icons ----------
const FloorPlan: React.FC<{opacity: number}> = ({opacity}) => (
  <svg width={460} height={460} viewBox="0 0 460 460" style={{opacity}}>
    <rect x={20} y={20} width={420} height={420} fill="none" stroke={GRAPHITE} strokeWidth={2} />
    <line x1={20} y1={220} x2={280} y2={220} stroke={GRAPHITE} strokeWidth={1.5} />
    <line x1={280} y1={20} x2={280} y2={440} stroke={GRAPHITE} strokeWidth={1.5} />
    <line x1={160} y1={220} x2={160} y2={440} stroke={GRAPHITE} strokeWidth={1.5} />
  </svg>
);

const Building: React.FC<{scannerProgress: number}> = ({scannerProgress}) => {
  const windows = useMemo(() => {
    const items: {lit: boolean}[] = [];
    for (let i = 0; i < 30; i++) {
      const seed = Math.sin(i * 12.9898) * 43758.5453;
      items.push({lit: seed - Math.floor(seed) > 0.83});
    }
    return items;
  }, []);
  const scannerY = interpolate(scannerProgress, range(0, 1), range(50, 550));
  return (
    <div
      style={{
        position: 'relative',
        width: 440,
        height: 620,
        backgroundColor: GRAPHITE,
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 40px 70px rgba(0,0,0,0.75)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(6, 1fr)',
          padding: 24,
          gap: 12,
        }}
      >
        {windows.map((w, i) => (
          <div
            key={i}
            style={{
              backgroundColor: w.lit ? 'rgba(255,196,120,0.28)' : 'rgba(255,255,255,0.035)',
              borderRadius: 2,
            }}
          />
        ))}
      </div>
      <svg width={440} height={620} style={{position: 'absolute', inset: 0}}>
        <path
          d="M170 180 L195 240 L178 290 L202 350"
          fill="none"
          stroke={ORANGE}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={interpolate(scannerY, range(150, 210), range(0, 0.9), {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: scannerY,
          width: '100%',
          height: 60,
          background: 'linear-gradient(to bottom, transparent, rgba(230,83,0,0.22), transparent)',
          opacity: scannerProgress > 0 && scannerProgress < 1 ? 1 : 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: scannerY,
          width: '100%',
          height: 2,
          backgroundColor: ORANGE,
          boxShadow: '0 0 12px rgba(230,83,0,0.8)',
          opacity: scannerProgress > 0 && scannerProgress < 1 ? 1 : 0,
        }}
      />
    </div>
  );
};

const Document: React.FC<{opacity: number; magnifyProgress: number; checksProgress: number}> = ({
  opacity,
  magnifyProgress,
  checksProgress,
}) => {
  const magX = interpolate(magnifyProgress, range(0, 1), range(-70, 90));
  const magY = interpolate(magnifyProgress, range(0, 1), range(-120, 100));
  return (
    <div
      style={{
        position: 'relative',
        width: 360,
        height: 460,
        backgroundColor: 'rgba(242,242,242,0.06)',
        border: '1px solid rgba(242,242,242,0.18)',
        borderRadius: 6,
        opacity,
        padding: 36,
        boxShadow: '0 30px 55px rgba(0,0,0,0.6)',
      }}
    >
      {new Array(6).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              height: 8,
              width: i === 5 ? '50%' : '85%',
              backgroundColor: 'rgba(242,242,242,0.14)',
              borderRadius: 2,
            }}
          />
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            style={{
              opacity: interpolate(checksProgress, range(i * 0.15, i * 0.15 + 0.3), range(0, 1), {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              flexShrink: 0,
            }}
          >
            <path
              d="M2 8 L6 12 L14 3"
              fill="none"
              stroke={GOLD}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}
      <svg
        width={90}
        height={90}
        viewBox="0 0 90 90"
        style={{
          position: 'absolute',
          left: 140 + magX,
          top: 160 + magY,
          opacity: opacity * 0.95,
        }}
      >
        <circle cx={36} cy={36} r={26} fill="none" stroke={ORANGE} strokeWidth={4} />
        <line x1={55} y1={55} x2={80} y2={80} stroke={ORANGE} strokeWidth={5} strokeLinecap="round" />
      </svg>
    </div>
  );
};

const PrazoRing: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => (
  <svg width={820} height={820} viewBox="0 0 820 820" style={{opacity}}>
    <circle
      cx={410}
      cy={410}
      r={390}
      fill="none"
      stroke="rgba(185,138,58,1)"
      strokeWidth={2}
      strokeDasharray="3 13"
      transform={`rotate(${frame * 0.18} 410 410)`}
    />
    {new Array(12).fill(0).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const x1 = 410 + Math.cos(angle) * 400;
      const y1 = 410 + Math.sin(angle) * 400;
      const x2 = 410 + Math.cos(angle) * 380;
      const y2 = 410 + Math.sin(angle) * 380;
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(185,138,58,0.8)"
          strokeWidth={2}
        />
      );
    })}
  </svg>
);

const JusticeScale: React.FC<{opacity: number}> = ({opacity}) => (
  <svg width={150} height={190} viewBox="0 0 150 190" style={{opacity}}>
    <line x1={75} y1={10} x2={75} y2={160} stroke={GOLD} strokeWidth={2} />
    <line x1={20} y1={42} x2={130} y2={42} stroke={GOLD} strokeWidth={2} />
    <line x1={20} y1={42} x2={10} y2={84} stroke={GOLD} strokeWidth={1.5} />
    <line x1={20} y1={42} x2={30} y2={84} stroke={GOLD} strokeWidth={1.5} />
    <path d="M10 84 Q20 104 30 84" fill="none" stroke={GOLD} strokeWidth={1.5} />
    <line x1={130} y1={42} x2={120} y2={84} stroke={GOLD} strokeWidth={1.5} />
    <line x1={130} y1={42} x2={140} y2={84} stroke={GOLD} strokeWidth={1.5} />
    <path d="M120 84 Q130 104 140 84" fill="none" stroke={GOLD} strokeWidth={1.5} />
    <line x1={48} y1={160} x2={102} y2={160} stroke={GOLD} strokeWidth={2} />
    <line x1={75} y1={160} x2={75} y2={176} stroke={GOLD} strokeWidth={2} />
  </svg>
);

export const CadaCasoExigeAnalise: React.FC = () => {
  useMontserratFont();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ---------- Camera: continuous slow dolly-in, extra push during PRAZOS ----------
  const camZBase = interpolate(frame, range(0, T.end), range(-550, -180), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camZPrazos = interpolate(frame, range(T.p3, T.p3 + 24), range(0, -60), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camZ = camZBase + camZPrazos;

  // ---------- Background ----------
  const bgOpacity = interpolate(frame, range(0, 14), range(0, 1), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const floorplanOpacity = interpolate(frame, range(0, 20), range(0, 0.3), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scannerProgress = interpolate(frame, range(T.p1 + 6, T.p1 + 30), range(0, 1), {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const buildingOpacity = interpolate(frame, range(T.p1 - 6, T.p1 + 10), range(0, 0.85), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }) * (1 - usePhaseExit(frame, T.p2, 14));

  const documentOpacity = interpolate(frame, range(T.p2, T.p2 + 14), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }) * (1 - usePhaseExit(frame, T.p3, 14));
  const magnifyProgress = interpolate(frame, range(T.p2 + 8, T.p2 + 30), range(0, 1), {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const checksProgress = interpolate(frame, range(T.p2 + 10, T.p2 + 30), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const prazoRingOpacity = interpolate(frame, range(T.p3 - 8, T.p3 + 10), range(0, 0.12), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scaleOpacity = interpolate(frame, range(T.p4, T.p4 + 20), range(0, 0.14), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const connectLineOpacity = interpolate(frame, range(T.p4 + 4, T.p4 + 16), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const recapOpacity = interpolate(frame, range(T.p4, T.p4 + 14), range(0, 0.8), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const finalFade = interpolate(frame, range(T.end - 8, T.end), range(0, 1), {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ---------- Intro ----------
  const introY = interpolate(frame, range(T.intro, T.intro + 12), range(20, 0), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const introOpacityIn = interpolate(frame, range(T.intro, T.intro + 10), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const introExit = usePhaseExit(frame, T.p1, 12);
  const introLineW = interpolate(frame, range(T.intro + 6, T.intro + 16), range(0, 1), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ---------- Phase 1: ORIGEM DO PROBLEMA ----------
  const origemSpring = spring({frame: frame - T.p1, fps, config: {damping: 18, mass: 1.5}});
  const origemY = interpolate(origemSpring, range(0, 1), range(90, 0));
  const origemBlur = interpolate(frame, range(T.p1, T.p1 + 16), range(16, 0), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const origemOpacityIn = interpolate(frame, range(T.p1, T.p1 + 12), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const doProblema = useFall(frame, T.p1 + 6, 18, 1.5, -60);
  const p1Exit = usePhaseExit(frame, T.p2);

  // ---------- Phase 2: DAS PROVAS ----------
  const das = useFall(frame, T.p2, 14, 0.8, -40);
  const provasBlurIn = interpolate(frame, range(T.p2 + 6, T.p2 + 16), range(18, 0), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const provasOpacityIn = interpolate(frame, range(T.p2 + 6, T.p2 + 16), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const p2Exit = usePhaseExit(frame, T.p3);

  // ---------- Phase 3: E DOS PRAZOS APLICÁVEIS AO CASO. ----------
  const eDos = useFall(frame, T.p3, 14, 0.8, -40);
  const prazosSpring = spring({frame: frame - (T.p3 + 6), fps, config: {damping: 22, mass: 2.0}});
  const prazosZ = interpolate(prazosSpring, range(0, 1), range(-700, 0));
  const prazosBlur = interpolate(frame, range(T.p3 + 6, T.p3 + 28), range(24, 0), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const prazosOpacityIn = interpolate(frame, range(T.p3 + 6, T.p3 + 20), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const aplicaveisOpacityIn = interpolate(frame, range(T.p3 + 16, T.p3 + 26), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const aplicaveisScaleY = interpolate(frame, range(T.p3 + 16, T.p3 + 24), range(0, 1), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const p3Exit = usePhaseExit(frame, T.p4, 14);

  return (
    <AbsoluteFill style={{backgroundColor: BG_DEEP, overflow: 'hidden'}}>
      <CameraStage translateZ={camZ} perspective={1750}>
        <AbsoluteFill style={{transform: 'translateZ(-450px)', opacity: bgOpacity}}>
          <AbsoluteFill style={{backgroundColor: BG_DEEP}} />
          <AbsoluteFill
            style={{
              background: 'radial-gradient(circle at 50% 45%, rgba(230,83,0,0.05), transparent 65%)',
            }}
          />
          <Noise opacity={0.045} />
        </AbsoluteFill>

        <AbsoluteFill style={{transform: 'translateZ(-400px)', alignItems: 'center', justifyContent: 'center'}}>
          <FloorPlan opacity={floorplanOpacity} />
        </AbsoluteFill>

        <AbsoluteFill style={{transform: 'translateZ(-380px)', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{opacity: buildingOpacity}}>
            <Building scannerProgress={scannerProgress} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill style={{transform: 'translateZ(-360px)', alignItems: 'center', justifyContent: 'center'}}>
          <PrazoRing frame={frame} opacity={prazoRingOpacity} />
        </AbsoluteFill>

        <AbsoluteFill style={{transform: 'translateZ(-340px)', alignItems: 'center', justifyContent: 'center'}}>
          <JusticeScale opacity={scaleOpacity} />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            transform: 'translateZ(-190px)',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'radial-gradient(ellipse 620px 720px at 50% 50%, rgba(11,11,11,0.7), rgba(11,11,11,0) 72%)',
          }}
        />

        <AbsoluteFill style={{transform: 'translateZ(-150px)', alignItems: 'center', justifyContent: 'center'}}>
          <Document opacity={documentOpacity} magnifyProgress={magnifyProgress} checksProgress={checksProgress} />
        </AbsoluteFill>

        {/* Connecting line for the triad recap */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '52%',
            width: 620,
            height: 3,
            transform: 'translateZ(-40px) translate(-50%, -50%)',
            backgroundColor: ORANGE,
            opacity: connectLineOpacity,
            boxShadow: '0 0 10px rgba(230,83,0,0.6)',
          }}
        />

        {/* Recap triad row (background, phase 4) */}
        <AbsoluteFill
          style={{
            transform: 'translateZ(-30px)',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: recapOpacity,
          }}
        >
          <div style={{display: 'flex', gap: 56, fontFamily: FONT_FAMILY}}>
            <span style={{fontSize: 22, fontWeight: 800, color: ORANGE}}>ORIGEM</span>
            <span style={{fontSize: 22, fontWeight: 800, color: WHITE_SOFT}}>PROVAS</span>
            <span style={{fontSize: 22, fontWeight: 800, color: ORANGE}}>PRAZOS</span>
          </div>
        </AbsoluteFill>

        {/* ---- Intro text ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 280}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              filter: `blur(${introExit * 14}px)`,
              opacity: 1 - introExit,
            }}
          >
            <div
              style={{
                transform: `translateZ(50px) translateY(${introY}px)`,
                opacity: introOpacityIn,
                filter: DROP_SHADOW,
                fontSize: 34,
                fontWeight: 700,
                color: WHITE_SOFT,
                fontFamily: FONT_FAMILY,
                letterSpacing: 1,
              }}
            >
              DEPENDENDO DA
            </div>
            <div
              style={{
                height: 3,
                width: 160 * introLineW,
                backgroundColor: ORANGE,
                boxShadow: '0 0 10px rgba(230,83,0,0.6)',
              }}
            />
          </div>
        </AbsoluteFill>

        {/* ---- Phase 1: ORIGEM DO PROBLEMA ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              filter: `blur(${p1Exit * 16}px)`,
              opacity: 1 - p1Exit,
            }}
          >
            <div
              style={{
                transform: `translateZ(80px) translateY(${origemY}px)`,
                filter: `blur(${origemBlur}px) drop-shadow(0 40px 45px rgba(0,0,0,0.85))`,
                opacity: origemOpacityIn,
                fontSize: 84,
                fontWeight: 900,
                color: ORANGE,
                fontFamily: FONT_FAMILY,
                letterSpacing: -1,
              }}
            >
              ORIGEM
            </div>
            <div
              style={{
                transform: `translateZ(60px) translateY(${doProblema.y}px)`,
                filter: `blur(${doProblema.blur}px) ${DROP_SHADOW}`,
                opacity: doProblema.opacity,
                fontSize: 50,
                fontWeight: 700,
                color: WHITE_MAIN,
                fontFamily: FONT_FAMILY,
              }}
            >
              DO PROBLEMA
            </div>
          </div>
        </AbsoluteFill>

        {/* ---- Phase 2: DAS PROVAS ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              filter: `blur(${p2Exit * 16}px)`,
              opacity: 1 - p2Exit,
            }}
          >
            <div
              style={{
                transform: `translateZ(60px) translateY(${das.y}px)`,
                filter: `blur(${das.blur}px) ${DROP_SHADOW}`,
                opacity: das.opacity,
                fontSize: 42,
                fontWeight: 500,
                color: GRAY_INSTITUTIONAL,
                fontFamily: FONT_FAMILY,
              }}
            >
              DAS
            </div>
            <div
              style={{
                transform: 'translateZ(80px)',
                filter: `blur(${provasBlurIn}px) drop-shadow(0 40px 45px rgba(0,0,0,0.85))`,
                opacity: provasOpacityIn,
                fontSize: 88,
                fontWeight: 900,
                color: WHITE_MAIN,
                fontFamily: FONT_FAMILY,
                letterSpacing: -1,
              }}
            >
              PROVAS
            </div>
          </div>
        </AbsoluteFill>

        {/* ---- Phase 3: E DOS PRAZOS APLICÁVEIS AO CASO. ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              filter: `blur(${p3Exit * 16}px)`,
              opacity: 1 - p3Exit,
            }}
          >
            <div
              style={{
                transform: `translateZ(60px) translateY(${eDos.y}px)`,
                filter: `blur(${eDos.blur}px) ${DROP_SHADOW}`,
                opacity: eDos.opacity,
                fontSize: 42,
                fontWeight: 500,
                color: GRAY_INSTITUTIONAL,
                fontFamily: FONT_FAMILY,
              }}
            >
              E DOS
            </div>
            <div
              style={{
                transform: `translateZ(${80 + prazosZ * 0.14}px)`,
                filter: `blur(${prazosBlur}px) drop-shadow(0 45px 50px rgba(0,0,0,0.9))`,
                opacity: prazosOpacityIn,
                fontSize: 90,
                fontWeight: 900,
                color: ORANGE,
                fontFamily: FONT_FAMILY,
                letterSpacing: -1,
              }}
            >
              PRAZOS
            </div>
            <div
              style={{
                transform: `translateZ(60px) scaleY(${aplicaveisScaleY})`,
                filter: DROP_SHADOW,
                opacity: aplicaveisOpacityIn,
                fontSize: 38,
                fontWeight: 700,
                color: WHITE_MAIN,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
              }}
            >
              APLIC&Aacute;VEIS AO CASO.
            </div>
          </div>
        </AbsoluteFill>

      </CameraStage>

      <AbsoluteFill style={{backgroundColor: BG_DEEP, opacity: finalFade}} />
    </AbsoluteFill>
  );
};
