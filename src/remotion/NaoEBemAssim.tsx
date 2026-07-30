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

// ---------- Timing map (30fps, 234 frames / 7.8s), synced to the VO ----------
const T = {
  p1: 2, // "MUITAS PESSOAS"
  p2: 24, // "ACREDITAM QUE"
  p3: 54, // "DEPOIS DESSE PERÍODO"
  p4: 84, // "A RESPONSABILIDADE DA CONSTRUTORA"
  p5: 132, // "TERMINA AUTOMATICAMENTE"
  p6: 168, // "MAS"
  p7: 192, // "NÃO É BEM ASSIM."
  end: 234,
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

const usePhaseExit = (frame: number, start: number, duration = 12) => {
  const progress = interpolate(frame, range(start, start + duration), range(0, 1), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return progress;
};

// ---------- Minimalist person icon ----------
const PersonIcon: React.FC<{opacity: number; scale: number}> = ({opacity, scale}) => (
  <svg width={44} height={64} viewBox="0 0 44 64" style={{opacity, transform: `scale(${scale})`}}>
    <circle cx={22} cy={14} r={11} fill="none" stroke={GRAY_INSTITUTIONAL} strokeWidth={2.4} />
    <path
      d="M4 60 Q4 34 22 34 Q40 34 40 60"
      fill="none"
      stroke={GRAY_INSTITUTIONAL}
      strokeWidth={2.4}
      strokeLinecap="round"
    />
  </svg>
);

const CROWD = new Array(9).fill(0).map((_, i) => {
  const seed = Math.sin(i * 17.31) * 43758.5453;
  const frac = seed - Math.floor(seed);
  return {
    x: (Math.sin(i * 2.1) * 0.5 + 0.5) * 760 - 380,
    y: (Math.cos(i * 3.7) * 0.5 + 0.5) * 320 - 160,
    z: -60 - frac * 220,
    delay: i * 3,
  };
});

const Building: React.FC = () => {
  const windows = useMemo(() => {
    const items: {lit: boolean}[] = [];
    for (let i = 0; i < 42; i++) {
      const seed = Math.sin(i * 12.9898) * 43758.5453;
      items.push({lit: seed - Math.floor(seed) > 0.85});
    }
    return items;
  }, []);
  return (
    <div
      style={{
        width: 520,
        height: 900,
        backgroundColor: GRAPHITE,
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 50px 90px rgba(0,0,0,0.8)',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridTemplateRows: 'repeat(7, 1fr)',
        padding: 26,
        gap: 12,
      }}
    >
      {windows.map((w, i) => (
        <div
          key={i}
          style={{
            backgroundColor: w.lit ? 'rgba(255,196,120,0.3)' : 'rgba(255,255,255,0.035)',
            borderRadius: 2,
          }}
        />
      ))}
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
    <text
      x={410}
      y={440}
      textAnchor="middle"
      fontSize={220}
      fontWeight={900}
      fill="none"
      stroke="rgba(185,138,58,0.5)"
      strokeWidth={1.5}
      fontFamily={FONT_FAMILY}
    >
      5
    </text>
  </svg>
);

const Document: React.FC<{opacity: number; stampProgress: number}> = ({opacity, stampProgress}) => (
  <div
    style={{
      position: 'relative',
      width: 380,
      height: 500,
      backgroundColor: 'rgba(242,242,242,0.06)',
      border: '1px solid rgba(242,242,242,0.18)',
      borderRadius: 6,
      opacity,
      padding: 40,
      boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
    }}
  >
    {new Array(7).fill(0).map((_, i) => (
      <div
        key={i}
        style={{
          height: 8,
          width: i === 6 ? '55%' : '90%',
          backgroundColor: 'rgba(242,242,242,0.14)',
          marginBottom: 20,
          borderRadius: 2,
        }}
      />
    ))}
    <svg
      width={120}
      height={120}
      viewBox="0 0 120 120"
      style={{
        position: 'absolute',
        right: 20,
        bottom: 30,
        opacity: stampProgress,
        transform: `scale(${0.6 + stampProgress * 0.4}) rotate(-12deg)`,
      }}
    >
      <circle cx={60} cy={60} r={52} fill="none" stroke={GOLD} strokeWidth={3} />
      <circle cx={60} cy={60} r={40} fill="none" stroke={GOLD} strokeWidth={1.5} />
    </svg>
  </div>
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

export const NaoEBemAssim: React.FC = () => {
  useMontserratFont();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ---------- Camera ----------
  const camZDolly = interpolate(frame, range(0, T.p6), range(-600, -200), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const masImpact = interpolate(
    frame,
    range(T.p6, T.p6 + 3, T.p6 + 10),
    range(0, 1, 0),
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const camZPush = interpolate(frame, range(T.p7, T.end), range(-200, -70), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camZ = (frame < T.p7 ? camZDolly : camZPush) - masImpact * 40;

  const shakeFrames = frame - T.p6;
  const shakeX =
    shakeFrames >= 0 && shakeFrames < 8
      ? Math.sin(shakeFrames * 3.4) * 3 * (1 - shakeFrames / 8)
      : 0;

  // ---------- Background ----------
  const bgOpacity = interpolate(frame, range(0, 16), range(0, 1), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const buildingOpacity = interpolate(frame, range(T.p4 - 10, T.p4 + 14), range(0.25, 0.6), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const documentOpacity = interpolate(frame, range(T.p4, T.p4 + 16), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const documentExit = usePhaseExit(frame, T.p5, 12);
  const stampProgress = interpolate(frame, range(T.p4 + 20, T.p4 + 30), range(0, 1), {
    easing: Easing.out(Easing.back(1.4)),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const linkPulse = interpolate(frame, range(T.p4 + 10, T.p4 + 16, T.p4 + 24), range(0, 1, 0.4), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const linkOpacityIn = interpolate(frame, range(T.p4, T.p4 + 12), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const linkExit = usePhaseExit(frame, T.p5, 12);
  const linkOpacity = linkOpacityIn * (1 - linkExit);

  const scaleOpacity = interpolate(frame, range(T.p7, T.p7 + 18), range(0, 0.9), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ---------- Diagonal cut line: builds through phase 5, snaps at MAS ----------
  const cutBuild = interpolate(frame, range(T.p5 + 10, T.p6), range(0, 0.4), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cutSnap = interpolate(frame, range(T.p6, T.p6 + 6), range(0, 1), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cutScaleX = cutBuild + cutSnap * (1 - cutBuild);
  const cutOpacity = interpolate(frame, range(T.p5 + 10, T.p6 + 6, T.p7), range(0, 1, 0.3), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ---------- Grafite flash on rupture ----------
  const flashOpacity = interpolate(frame, range(T.p6 - 2, T.p6 + 2, T.p6 + 10), range(0, 0.55, 0), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ---------- Phase 1: "MUITAS PESSOAS" ----------
  const muitas = useFall(frame, T.p1, 18, 1.5, -50);
  const pessoas = useFall(frame, T.p1 + 6, 14, 0.8, -40);
  const p1Exit = usePhaseExit(frame, T.p2);
  const crowdOpacity = interpolate(frame, range(T.p1, T.p1 + 16), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }) * (1 - p1Exit);

  // ---------- Phase 2: "ACREDITAM QUE" ----------
  const acreditamSpring = spring({frame: frame - T.p2, fps, config: {damping: 20, mass: 1.0}});
  const acreditamScale = interpolate(acreditamSpring, range(0, 1), range(0.96, 1));
  const acreditamOpacityIn = interpolate(frame, range(T.p2, T.p2 + 10), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const que = useFall(frame, T.p2 + 6, 14, 0.8, -30);
  const p2Exit = usePhaseExit(frame, T.p3);
  const pulseRing = interpolate(frame, range(T.p2 + 2, T.p2 + 16), range(0.6, 0), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulseScale = interpolate(frame, range(T.p2 + 2, T.p2 + 16), range(0.6, 1.5), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ---------- Phase 3: "DEPOIS DESSE PERÍODO" ----------
  const depois = useFall(frame, T.p3, 18, 1.5, -70);
  const dessePeriodoSpring = spring({frame: frame - (T.p3 + 8), fps, config: {damping: 22, mass: 2.0}});
  const dessePeriodoY = interpolate(dessePeriodoSpring, range(0, 1), range(140, 0));
  const dessePeriodoBlur = interpolate(frame, range(T.p3 + 8, T.p3 + 24), range(20, 0), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dessePeriodoOpacityIn = interpolate(frame, range(T.p3 + 8, T.p3 + 18), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const p3Exit = usePhaseExit(frame, T.p4);
  const prazoRingOpacity = interpolate(frame, range(T.p3 - 10, T.p3 + 10), range(0, 0.12), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ---------- Phase 4: "A RESPONSABILIDADE DA CONSTRUTORA" ----------
  const aResp = useFall(frame, T.p4, 18, 1.5, -60);
  const construtoraSpring = spring({frame: frame - (T.p4 + 8), fps, config: {damping: 22, mass: 2.0}});
  const construtoraY = interpolate(construtoraSpring, range(0, 1), range(120, 0));
  const construtoraBlur = interpolate(frame, range(T.p4 + 8, T.p4 + 24), range(18, 0), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const construtoraOpacityIn = interpolate(frame, range(T.p4 + 8, T.p4 + 18), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const p4Exit = usePhaseExit(frame, T.p5);

  // ---------- Phase 5: "TERMINA AUTOMATICAMENTE" ----------
  const termina = useFall(frame, T.p5, 18, 1.5, -90);
  const automaticamenteOpacityIn = interpolate(frame, range(T.p5 + 8, T.p5 + 20), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const automaticamenteTracking = interpolate(frame, range(T.p5 + 8, T.p5 + 24), range(6, 2), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const p5Exit = usePhaseExit(frame, T.p6, 8);

  // ---------- Phase 6: "MAS" ----------
  const masSpring = spring({frame: frame - T.p6, fps, config: {damping: 15, mass: 1.1}});
  const masScale = interpolate(masSpring, range(0, 1), range(0.92, 1));
  const masOpacityIn = interpolate(frame, range(T.p6, T.p6 + 6), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const p6Exit = usePhaseExit(frame, T.p7, 10);

  // ---------- Phase 7: "NÃO É BEM ASSIM." ----------
  const naoE = useFall(frame, T.p7, 18, 1.5, -70);
  const bemAssimSpring = spring({frame: frame - (T.p7 + 8), fps, config: {damping: 22, mass: 2.0}});
  const bemAssimY = interpolate(bemAssimSpring, range(0, 1), range(130, 0));
  const bemAssimBlur = interpolate(frame, range(T.p7 + 8, T.p7 + 24), range(18, 0), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bemAssimOpacityIn = interpolate(frame, range(T.p7 + 8, T.p7 + 18), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const underlineW = interpolate(frame, range(T.p7 + 18, T.p7 + 30), range(0, 1), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const finalFade = interpolate(frame, range(T.end - 14, T.end), range(0, 1), {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: BG_DEEP, overflow: 'hidden'}}>
      <CameraStage translateZ={camZ} translateX={shakeX} perspective={1700}>
        <AbsoluteFill style={{transform: 'translateZ(-420px)', opacity: bgOpacity}}>
          <AbsoluteFill style={{backgroundColor: BG_DEEP}} />
          <AbsoluteFill
            style={{
              background: 'radial-gradient(circle at 50% 45%, rgba(230,83,0,0.05), transparent 65%)',
            }}
          />
          <Noise opacity={0.045} />
        </AbsoluteFill>

        <AbsoluteFill style={{transform: 'translateZ(-320px)', alignItems: 'center', justifyContent: 'center'}}>
          <PrazoRing frame={frame} opacity={prazoRingOpacity} />
        </AbsoluteFill>

        <AbsoluteFill
          style={{transform: 'translateZ(-300px)', alignItems: 'center', justifyContent: 'flex-end', opacity: buildingOpacity}}
        >
          <div style={{marginBottom: -80}}>
            <Building />
          </div>
        </AbsoluteFill>

        <AbsoluteFill style={{transform: 'translateZ(-260px)', alignItems: 'center', justifyContent: 'center'}}>
          {CROWD.map((c, i) => {
            const s = spring({frame: frame - (T.p1 + c.delay), fps, config: {damping: 16, mass: 0.9}});
            const iconOpacity = interpolate(s, range(0, 1), range(0, 1)) * crowdOpacity;
            const iconScale = interpolate(s, range(0, 1), range(0.7, 1));
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  transform: `translate3d(${c.x}px, ${c.y}px, ${c.z}px)`,
                }}
              >
                <PersonIcon opacity={iconOpacity} scale={iconScale} />
              </div>
            );
          })}
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            transform: 'translateZ(-190px)',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'radial-gradient(ellipse 640px 760px at 50% 50%, rgba(11,11,11,0.7), rgba(11,11,11,0) 72%)',
          }}
        />

        <AbsoluteFill style={{transform: 'translateZ(-150px)', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{opacity: documentOpacity * (1 - documentExit)}}>
            <Document opacity={1} stampProgress={stampProgress} />
          </div>
        </AbsoluteFill>

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '38%',
            width: 3,
            height: 260 + linkPulse * 20,
            backgroundColor: ORANGE,
            opacity: linkOpacity,
            transform: 'translateZ(-140px) translateX(-50%) rotate(8deg)',
            boxShadow: '0 0 12px rgba(230,83,0,0.6)',
          }}
        />

        <AbsoluteFill
          style={{
            transform: 'translateZ(-130px)',
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: 640,
          }}
        >
          <JusticeScale opacity={scaleOpacity} />
        </AbsoluteFill>

        {/* Diagonal rupture line */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 1300,
            height: 6,
            backgroundColor: ORANGE,
            opacity: cutOpacity,
            transform: `translateZ(90px) translate(-50%, -50%) rotate(-24deg) scaleX(${cutScaleX})`,
            boxShadow: '0 0 24px rgba(230,83,0,0.8)',
          }}
        />

        {/* Rupture flash */}
        <AbsoluteFill style={{backgroundColor: GRAPHITE, opacity: flashOpacity}} />

        {/* ---- Phase 1 text ---- */}
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
                transform: `translateZ(60px) translateY(${muitas.y}px)`,
                filter: `blur(${muitas.blur}px) ${DROP_SHADOW}`,
                opacity: muitas.opacity,
                fontSize: 74,
                fontWeight: 800,
                color: WHITE_MAIN,
                fontFamily: FONT_FAMILY,
              }}
            >
              MUITAS
            </div>
            <div
              style={{
                transform: `translateZ(60px) translateY(${pessoas.y}px)`,
                filter: `blur(${pessoas.blur}px) ${DROP_SHADOW}`,
                opacity: pessoas.opacity,
                fontSize: 60,
                fontWeight: 700,
                color: GRAY_INSTITUTIONAL,
                fontFamily: FONT_FAMILY,
              }}
            >
              PESSOAS
            </div>
          </div>
        </AbsoluteFill>

        {/* ---- Phase 2 text ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              filter: `blur(${p2Exit * 16}px)`,
              opacity: 1 - p2Exit,
            }}
          >
            <svg
              width={260}
              height={260}
              viewBox="0 0 260 260"
              style={{position: 'absolute', opacity: pulseRing}}
            >
              <circle
                cx={130}
                cy={130}
                r={110}
                fill="none"
                stroke={GRAPHITE}
                strokeWidth={2}
                transform={`scale(${pulseScale})`}
                transform-origin="130 130"
              />
            </svg>
            <div
              style={{
                transform: `translateZ(70px) scale(${acreditamScale})`,
                filter: DROP_SHADOW,
                opacity: acreditamOpacityIn,
                fontSize: 68,
                fontWeight: 900,
                color: WHITE_SOFT,
                fontFamily: FONT_FAMILY,
                letterSpacing: -1,
              }}
            >
              ACREDITAM
            </div>
            <div
              style={{
                transform: `translateZ(60px) translateY(${que.y}px)`,
                filter: `blur(${que.blur}px) ${DROP_SHADOW}`,
                opacity: que.opacity,
                fontSize: 42,
                fontWeight: 500,
                color: GRAY_INSTITUTIONAL,
                fontFamily: FONT_FAMILY,
              }}
            >
              QUE
            </div>
          </div>
        </AbsoluteFill>

        {/* ---- Phase 3 text ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              filter: `blur(${p3Exit * 16}px)`,
              opacity: 1 - p3Exit,
            }}
          >
            <div
              style={{
                transform: `translateZ(60px) translateY(${depois.y}px)`,
                filter: `blur(${depois.blur}px) ${DROP_SHADOW}`,
                opacity: depois.opacity,
                fontSize: 60,
                fontWeight: 700,
                color: WHITE_MAIN,
                fontFamily: FONT_FAMILY,
              }}
            >
              DEPOIS
            </div>
            <div
              style={{
                transform: `translateZ(80px) translateY(${dessePeriodoY}px)`,
                filter: `blur(${dessePeriodoBlur}px) drop-shadow(0 40px 45px rgba(0,0,0,0.85))`,
                opacity: dessePeriodoOpacityIn,
                fontSize: 66,
                fontWeight: 900,
                color: ORANGE,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
                letterSpacing: -1,
              }}
            >
              DESSE PER&Iacute;ODO
            </div>
          </div>
        </AbsoluteFill>

        {/* ---- Phase 4 text ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              filter: `blur(${p4Exit * 16}px)`,
              opacity: 1 - p4Exit,
            }}
          >
            <div
              style={{
                transform: `translateZ(60px) translateY(${aResp.y}px)`,
                filter: `blur(${aResp.blur}px) ${DROP_SHADOW}`,
                opacity: aResp.opacity,
                fontSize: 54,
                fontWeight: 900,
                color: WHITE_MAIN,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
                letterSpacing: -1,
              }}
            >
              A RESPONSABILIDADE
            </div>
            <div
              style={{
                transform: `translateZ(80px) translateY(${construtoraY}px)`,
                filter: `blur(${construtoraBlur}px) drop-shadow(0 40px 45px rgba(0,0,0,0.85))`,
                opacity: construtoraOpacityIn,
                fontSize: 58,
                fontWeight: 900,
                color: ORANGE,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
              }}
            >
              DA CONSTRUTORA
            </div>
          </div>
        </AbsoluteFill>

        {/* ---- Phase 5 text ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              filter: `blur(${p5Exit * 16}px)`,
              opacity: 1 - p5Exit,
            }}
          >
            <div
              style={{
                transform: `translateZ(60px) translateY(${termina.y}px)`,
                filter: `blur(${termina.blur}px) ${DROP_SHADOW}`,
                opacity: termina.opacity,
                fontSize: 92,
                fontWeight: 900,
                color: WHITE_MAIN,
                fontFamily: FONT_FAMILY,
                letterSpacing: -2,
              }}
            >
              TERMINA
            </div>
            <div
              style={{
                transform: 'translateZ(50px)',
                filter: DROP_SHADOW,
                opacity: automaticamenteOpacityIn,
                fontSize: 40,
                fontWeight: 700,
                color: GRAY_INSTITUTIONAL,
                fontFamily: FONT_FAMILY,
                letterSpacing: automaticamenteTracking,
              }}
            >
              AUTOMATICAMENTE
            </div>
          </div>
        </AbsoluteFill>

        {/* ---- Phase 6 text: "MAS" ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              transform: `translateZ(100px) scale(${masScale})`,
              filter: `drop-shadow(0 2px 6px rgba(0,0,0,0.95)) drop-shadow(0 30px 45px rgba(0,0,0,0.85))`,
              opacity: masOpacityIn * (1 - p6Exit),
              fontSize: 150,
              fontWeight: 900,
              color: ORANGE,
              fontFamily: FONT_FAMILY,
            }}
          >
            MAS
          </div>
        </AbsoluteFill>

        {/* ---- Phase 7 text ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
            <div
              style={{
                transform: `translateZ(60px) translateY(${naoE.y}px)`,
                filter: `blur(${naoE.blur}px) ${DROP_SHADOW}`,
                opacity: naoE.opacity,
                fontSize: 68,
                fontWeight: 900,
                color: WHITE_MAIN,
                fontFamily: FONT_FAMILY,
              }}
            >
              N&Atilde;O &Eacute;
            </div>
            <div style={{position: 'relative'}}>
              <div
                style={{
                  transform: `translateZ(80px) translateY(${bemAssimY}px)`,
                  filter: `blur(${bemAssimBlur}px) drop-shadow(0 40px 45px rgba(0,0,0,0.85))`,
                  opacity: bemAssimOpacityIn,
                  fontSize: 72,
                  fontWeight: 900,
                  color: ORANGE,
                  fontFamily: FONT_FAMILY,
                }}
              >
                BEM ASSIM.
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: -12,
                  left: '50%',
                  height: 4,
                  width: `${underlineW * 100}%`,
                  transform: 'translateX(-50%)',
                  backgroundColor: ORANGE,
                  boxShadow: '0 0 12px rgba(230,83,0,0.7)',
                }}
              />
            </div>
          </div>
        </AbsoluteFill>
      </CameraStage>

      <AbsoluteFill style={{backgroundColor: BG_DEEP, opacity: finalFade}} />
    </AbsoluteFill>
  );
};
