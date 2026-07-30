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
const ORANGE_DARK = '#D73516';
const GOLD = '#B98A3A';

const range = (a: number, b: number): readonly number[] => [a, b];

const DROP_SHADOW =
  'drop-shadow(0 2px 4px rgba(0,0,0,0.9)) drop-shadow(0 20px 30px rgba(0,0,0,0.75))';

// ---------- Timing map (30fps, 210 frames / 7s) ----------
const T = {
  vocesabiaIn: 6,
  vocesabiaOut: 34,

  umaIn: 24,
  construtoraIn: 28,
  aindaPodeIn: 33,
  phaseBOut: 52,

  scannerStart: 58,
  scannerEnd: 84,
  serRespIn: 60,
  problemasIn: 68,
  noImovelIn: 74,
  phaseCOut: 90,

  cincoAnosBgIn: 88,
  scaleIn: 94,
  mesmoDepoisIn: 96,
  cincoAnosMainIn: 104,
  phaseDOut: 130,

  floorplanIn: 128,
  entregaObraIn: 130,
  neqIn: 140,
  fimRespIn: 146,
  phaseEOut: 168,

  ctaIn: 170,
  nomeIn: 182,
  fadeStart: 198,
  fadeEnd: 210,
};

// ---------- Small text helpers ----------
const useFall = (frame: number, start: number, damping: number, mass: number, fromY: number) => {
  const s = spring({frame: frame - start, fps: 30, config: {damping, mass}});
  const y = interpolate(s, range(0, 1), range(fromY, 0));
  const blur = interpolate(frame, range(start, start + 16), range(18, 0), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, range(start, start + 12), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return {y, blur, opacity};
};

const useBlockExit = (frame: number, start: number, duration = 14) => {
  const progress = interpolate(frame, range(start, start + duration), range(0, 1), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return progress;
};

// ---------- Building ----------
const Building: React.FC<{scannerProgress: number}> = ({scannerProgress}) => {
  const windows = useMemo(() => {
    const cols = 6;
    const rows = 12;
    const items: {col: number; row: number; lit: boolean}[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const seed = Math.sin((r * cols + c) * 12.9898) * 43758.5453;
        const frac = seed - Math.floor(seed);
        items.push({col: c, row: r, lit: frac > 0.82});
      }
    }
    return items;
  }, []);

  const buildingHeight = 1100;
  const buildingWidth = 620;
  const scannerY = interpolate(scannerProgress, range(0, 1), range(60, buildingHeight - 60));

  return (
    <div
      style={{
        position: 'relative',
        width: buildingWidth,
        height: buildingHeight,
        backgroundColor: GRAPHITE,
        boxShadow: '0 60px 100px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 2px, transparent 2px, transparent 34px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'repeat(12, 1fr)',
          padding: 28,
          gap: 14,
        }}
      >
        {windows.map((w, i) => (
          <div
            key={i}
            style={{
              backgroundColor: w.lit ? 'rgba(255,196,120,0.4)' : 'rgba(255,255,255,0.04)',
              boxShadow: w.lit ? '0 0 8px rgba(255,196,120,0.25)' : 'none',
              borderRadius: 2,
            }}
          />
        ))}
      </div>

      {/* Fissura */}
      <svg
        width={buildingWidth}
        height={buildingHeight}
        style={{position: 'absolute', inset: 0}}
      >
        <path
          d="M180 240 L205 300 L188 350 L212 410"
          fill="none"
          stroke={ORANGE_DARK}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={interpolate(scannerY, range(200, 260), range(0, 0.8), {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />
      </svg>

      {/* Mancha de infiltração */}
      <div
        style={{
          position: 'absolute',
          left: 380,
          top: 520,
          width: 90,
          height: 70,
          borderRadius: '50% 40% 55% 45%',
          background: 'radial-gradient(circle, rgba(115,80,40,0.45), transparent 70%)',
          opacity: interpolate(scannerY, range(480, 540), range(0, 1), {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />

      {/* Alerta jurídico minimalista */}
      <svg
        width={40}
        height={40}
        viewBox="0 0 40 40"
        style={{
          position: 'absolute',
          left: 240,
          top: 760,
          opacity: interpolate(scannerY, range(720, 780), range(0, 1), {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <path
          d="M20 4 L37 34 L3 34 Z"
          fill="none"
          stroke={ORANGE}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <line x1={20} y1={16} x2={20} y2={24} stroke={ORANGE} strokeWidth={2} />
        <circle cx={20} cy={28} r={1.4} fill={ORANGE} />
      </svg>

      {/* Scanner line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: scannerY,
          width: '100%',
          height: 90,
          background: `linear-gradient(to bottom, transparent, rgba(230,83,0,0.25), transparent)`,
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
          boxShadow: '0 0 14px rgba(230,83,0,0.8)',
          opacity: scannerProgress > 0 && scannerProgress < 1 ? 1 : 0,
        }}
      />
    </div>
  );
};

const PrazoRing: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => (
  <svg width={900} height={900} viewBox="0 0 900 900" style={{opacity}}>
    <circle
      cx={450}
      cy={450}
      r={430}
      fill="none"
      stroke={`rgba(185,138,58,1)`}
      strokeWidth={2}
      strokeDasharray="3 14"
      transform={`rotate(${frame * 0.15} 450 450)`}
    />
  </svg>
);

const JusticeScale: React.FC<{opacity: number}> = ({opacity}) => (
  <svg width={140} height={180} viewBox="0 0 140 180" style={{opacity}}>
    <line x1={70} y1={10} x2={70} y2={150} stroke={GOLD} strokeWidth={2} />
    <line x1={20} y1={40} x2={120} y2={40} stroke={GOLD} strokeWidth={2} />
    <line x1={20} y1={40} x2={12} y2={78} stroke={GOLD} strokeWidth={1.5} />
    <line x1={20} y1={40} x2={28} y2={78} stroke={GOLD} strokeWidth={1.5} />
    <path d="M12 78 Q20 96 28 78" fill="none" stroke={GOLD} strokeWidth={1.5} />
    <line x1={120} y1={40} x2={112} y2={78} stroke={GOLD} strokeWidth={1.5} />
    <line x1={120} y1={40} x2={128} y2={78} stroke={GOLD} strokeWidth={1.5} />
    <path d="M112 78 Q120 96 128 78" fill="none" stroke={GOLD} strokeWidth={1.5} />
    <line x1={45} y1={150} x2={95} y2={150} stroke={GOLD} strokeWidth={2} />
    <line x1={70} y1={150} x2={70} y2={165} stroke={GOLD} strokeWidth={2} />
  </svg>
);

const FloorPlan: React.FC<{opacity: number}> = ({opacity}) => (
  <svg width={420} height={420} viewBox="0 0 420 420" style={{opacity}}>
    <rect x={20} y={20} width={380} height={380} fill="none" stroke={GRAY_INSTITUTIONAL} strokeWidth={1.5} />
    <line x1={20} y1={200} x2={260} y2={200} stroke={GRAY_INSTITUTIONAL} strokeWidth={1} />
    <line x1={260} y1={20} x2={260} y2={400} stroke={GRAY_INSTITUTIONAL} strokeWidth={1} />
    <line x1={150} y1={200} x2={150} y2={400} stroke={GRAY_INSTITUTIONAL} strokeWidth={1} />
  </svg>
);

export const AResponsabilidadeCincoAnos: React.FC = () => {
  useMontserratFont();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Camera: progressive dolly-in until 5.8s (frame 174), then a gentle push-in for the CTA
  const camZ1 = interpolate(frame, range(0, 174), range(-500, -50), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camZ2 = interpolate(frame, range(174, 210), range(-50, 40), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camZ = frame < 174 ? camZ1 : camZ2;

  const bgOpacity = interpolate(frame, range(0, 18), range(0, 1), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scannerProgress = interpolate(frame, range(T.scannerStart, T.scannerEnd), range(0, 1), {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const darkenPhaseD = interpolate(frame, range(T.cincoAnosBgIn, T.cincoAnosBgIn + 20), range(0, 0.35), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const finalFade = interpolate(frame, range(T.fadeStart, T.fadeEnd), range(0, 1), {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ---- Phase A: "VOCÊ SABIA?" ----
  const vsOpacityIn = interpolate(frame, range(T.vocesabiaIn, T.vocesabiaIn + 14), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const vsY = interpolate(frame, range(T.vocesabiaIn, T.vocesabiaIn + 14), range(24, 0), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const vsBlur = interpolate(frame, range(T.vocesabiaIn, T.vocesabiaIn + 14), range(8, 0), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const vsExit = useBlockExit(frame, T.vocesabiaOut, 14);
  const vsOpacity = vsOpacityIn * (1 - vsExit);

  // ---- Phase B: "UMA CONSTRUTORA AINDA PODE" ----
  const uma = useFall(frame, T.umaIn, 18, 1.5, -80);
  const aindaPode = useFall(frame, T.aindaPodeIn, 18, 1.5, -80);
  const construtoraSpring = spring({frame: frame - T.construtoraIn, fps, config: {damping: 20, mass: 1.2}});
  const construtoraScale = interpolate(construtoraSpring, range(0, 1), range(0.94, 1));
  const construtoraY = interpolate(construtoraSpring, range(0, 1), range(60, 0));
  const construtoraOpacityIn = interpolate(frame, range(T.construtoraIn, T.construtoraIn + 10), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const underlineW = interpolate(construtoraSpring, range(0, 1), range(0, 1));

  const phaseBExit = useBlockExit(frame, T.phaseBOut, 16);
  const umaOpacity = uma.opacity * (1 - phaseBExit);
  const aindaOpacity = aindaPode.opacity * (1 - phaseBExit);
  const construtoraOpacity = construtoraOpacityIn * (1 - phaseBExit);

  // ---- Phase C: scanner + "SER RESPONSABILIZADA POR PROBLEMAS NO IMÓVEL" ----
  const serResp = useFall(frame, T.serRespIn, 18, 1.5, -60);
  const noImovel = useFall(frame, T.noImovelIn, 14, 0.8, -50);
  const problemasBlur = interpolate(frame, range(T.problemasIn, T.problemasIn + 8), range(16, 0), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const problemasOpacityIn = interpolate(frame, range(T.problemasIn, T.problemasIn + 8), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const phaseCExit = useBlockExit(frame, T.phaseCOut, 16);
  const serRespOpacity = serResp.opacity * (1 - phaseCExit);
  const problemasOpacity = problemasOpacityIn * (1 - phaseCExit);
  const noImovelOpacity = noImovel.opacity * (1 - phaseCExit);

  // ---- Phase D: "5 ANOS" Z-dive + justice scale ----
  const cincoAnosBgOpacity = interpolate(frame, range(T.cincoAnosBgIn, T.cincoAnosBgIn + 20), range(0, 0.18), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cincoAnosBgX = interpolate(frame, range(T.cincoAnosBgIn, T.phaseDOut), range(-20, 20));
  const scaleOpacity = interpolate(frame, range(T.scaleIn, T.scaleIn + 16), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const mesmoDepois = useFall(frame, T.mesmoDepoisIn, 18, 1.5, -60);
  const cincoAnosSpring = spring({frame: frame - T.cincoAnosMainIn, fps, config: {damping: 22, mass: 2.0}});
  const cincoAnosZ = interpolate(cincoAnosSpring, range(0, 1), range(-900, 0));
  const cincoAnosBlur = interpolate(frame, range(T.cincoAnosMainIn, T.cincoAnosMainIn + 20), range(22, 0), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cincoAnosOpacityIn = interpolate(frame, range(T.cincoAnosMainIn, T.cincoAnosMainIn + 14), range(0, 1), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const phaseDExit = useBlockExit(frame, T.phaseDOut, 16);
  const mesmoDepoisOpacity = mesmoDepois.opacity * (1 - phaseDExit);
  const cincoAnosOpacity = cincoAnosOpacityIn * (1 - phaseDExit);
  const scaleOpacityOut = scaleOpacity * (1 - phaseDExit);
  const cincoAnosBgOpacityOut = cincoAnosBgOpacity * (1 - phaseDExit);

  // ---- Phase E: "ENTREGA DA OBRA ≠ FIM DA RESPONSABILIDADE" ----
  const entregaObra = useFall(frame, T.entregaObraIn, 14, 0.8, -50);
  const floorplanOpacity = interpolate(frame, range(T.floorplanIn, T.floorplanIn + 20), range(0, 0.22), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const neqProgress = interpolate(frame, range(T.neqIn, T.neqIn + 10), range(0, 1), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fimResp = useFall(frame, T.fimRespIn, 18, 1.5, -60);
  const phaseEExit = useBlockExit(frame, T.phaseEOut, 16);
  const entregaObraOpacity = entregaObra.opacity * (1 - phaseEExit);
  const neqOpacity = neqProgress * (1 - phaseEExit);
  const fimRespOpacity = fimResp.opacity * (1 - phaseEExit);
  const floorplanOpacityOut = floorplanOpacity * (1 - phaseEExit);

  // ---- Phase F: CTA final ----
  const entendaDireitos = useFall(frame, T.ctaIn, 18, 1.5, -50);
  const nomeBlock = useFall(frame, T.nomeIn, 14, 0.8, -40);
  const ctaBarWidth = interpolate(frame, range(T.ctaIn, T.ctaIn + 20), range(0, 1), {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: BG_DEEP, overflow: 'hidden'}}>
      <CameraStage translateZ={camZ} perspective={1700}>
        <AbsoluteFill style={{transform: 'translateZ(-400px)', opacity: bgOpacity}}>
          <AbsoluteFill style={{backgroundColor: BG_DEEP}} />
          <AbsoluteFill
            style={{
              background: 'radial-gradient(circle at 50% 40%, rgba(230,83,0,0.05), transparent 65%)',
            }}
          />
          <Noise opacity={0.045} />
          <AbsoluteFill style={{opacity: darkenPhaseD, backgroundColor: '#000'}} />
        </AbsoluteFill>

        <AbsoluteFill style={{transform: 'translateZ(-380px)', alignItems: 'center', justifyContent: 'center'}}>
          <PrazoRing frame={frame} opacity={0.08 * bgOpacity} />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            transform: `translateZ(-300px) translateX(${cincoAnosBgX}px)`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 260,
              fontWeight: 900,
              color: 'transparent',
              WebkitTextStroke: `2px rgba(185,138,58,${cincoAnosBgOpacityOut})`,
              fontFamily: FONT_FAMILY,
              letterSpacing: -6,
            }}
          >
            5 ANOS
          </div>
        </AbsoluteFill>

        <AbsoluteFill style={{transform: 'translateZ(-200px)', alignItems: 'center', justifyContent: 'center'}}>
          <Building scannerProgress={scannerProgress} />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            transform: 'translateZ(-190px)',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'radial-gradient(ellipse 640px 720px at 50% 50%, rgba(11,11,11,0.72), rgba(11,11,11,0) 72%)',
          }}
        />

        <AbsoluteFill
          style={{
            transform: 'translateZ(-150px)',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 620,
          }}
        >
          <JusticeScale opacity={scaleOpacityOut} />
        </AbsoluteFill>

        <AbsoluteFill style={{transform: 'translateZ(-140px)', alignItems: 'center', justifyContent: 'center'}}>
          <FloorPlan opacity={floorplanOpacityOut} />
        </AbsoluteFill>

        {/* ---- Phase A ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 300}}>
          <div
            style={{
              transform: `translateZ(50px) translateY(${vsY}px)`,
              filter: `blur(${vsBlur}px) ${DROP_SHADOW}`,
              opacity: vsOpacity,
              fontSize: 34,
              fontWeight: 700,
              color: WHITE_SOFT,
              fontFamily: FONT_FAMILY,
              letterSpacing: 1,
            }}
          >
            VOC&Ecirc; SABIA?
          </div>
        </AbsoluteFill>

        {/* ---- Phase B ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              filter: `blur(${phaseBExit * 16}px)`,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 18,
                transform: `translateZ(60px) translateY(${uma.y}px)`,
                filter: `blur(${uma.blur}px) ${DROP_SHADOW}`,
                opacity: umaOpacity,
              }}
            >
              <span style={{fontSize: 52, fontWeight: 400, color: WHITE_MAIN, fontFamily: FONT_FAMILY}}>
                UMA
              </span>
            </div>
            <div
              style={{
                position: 'relative',
                transform: `translateZ(80px) translateY(${construtoraY}px) scale(${construtoraScale})`,
                filter: DROP_SHADOW,
                opacity: construtoraOpacity,
              }}
            >
              <span
                style={{
                  fontSize: 82,
                  fontWeight: 900,
                  color: ORANGE,
                  fontFamily: FONT_FAMILY,
                  letterSpacing: -2,
                }}
              >
                CONSTRUTORA
              </span>
              <div
                style={{
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  height: 4,
                  width: `${underlineW * 100}%`,
                  transform: 'translateX(-50%)',
                  backgroundColor: ORANGE,
                  boxShadow: '0 0 12px rgba(230,83,0,0.7)',
                }}
              />
            </div>
            <div
              style={{
                transform: `translateZ(60px) translateY(${aindaPode.y}px)`,
                filter: `blur(${aindaPode.blur}px) ${DROP_SHADOW}`,
                opacity: aindaOpacity,
                fontSize: 52,
                fontWeight: 700,
                color: WHITE_MAIN,
                fontFamily: FONT_FAMILY,
                marginTop: 6,
              }}
            >
              AINDA PODE
            </div>
          </div>
        </AbsoluteFill>

        {/* ---- Phase C ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              filter: `blur(${phaseCExit * 16}px)`,
            }}
          >
            <div
              style={{
                transform: `translateZ(60px) translateY(${serResp.y}px)`,
                filter: `blur(${serResp.blur}px) ${DROP_SHADOW}`,
                opacity: serRespOpacity,
                fontSize: 62,
                fontWeight: 900,
                color: WHITE_MAIN,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
                letterSpacing: -1,
              }}
            >
              SER RESPONSABILIZADA
            </div>
            <div
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'baseline',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  transform: `translateZ(70px)`,
                  filter: `blur(${problemasBlur}px) ${DROP_SHADOW}`,
                  opacity: problemasOpacity,
                  fontSize: 62,
                  fontWeight: 900,
                  color: ORANGE,
                  fontFamily: FONT_FAMILY,
                  display: 'inline-block',
                }}
              >
                POR PROBLEMAS
              </span>
            </div>
            <div
              style={{
                transform: `translateZ(60px) translateY(${noImovel.y}px)`,
                filter: `blur(${noImovel.blur}px) ${DROP_SHADOW}`,
                opacity: noImovelOpacity,
                fontSize: 44,
                fontWeight: 700,
                color: WHITE_SOFT,
                fontFamily: FONT_FAMILY,
              }}
            >
              NO IM&Oacute;VEL
            </div>
          </div>
        </AbsoluteFill>

        {/* ---- Phase D ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              filter: `blur(${phaseDExit * 16}px)`,
            }}
          >
            <div
              style={{
                transform: `translateZ(60px) translateY(${mesmoDepois.y}px)`,
                filter: `blur(${mesmoDepois.blur}px) ${DROP_SHADOW}`,
                opacity: mesmoDepoisOpacity,
                fontSize: 50,
                fontWeight: 400,
                color: WHITE_MAIN,
                fontFamily: FONT_FAMILY,
              }}
            >
              MESMO DEPOIS
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                transform: `translateZ(${80 + cincoAnosZ * 0.15}px)`,
                filter: `blur(${cincoAnosBlur}px) drop-shadow(0 40px 50px rgba(0,0,0,0.85))`,
                opacity: cincoAnosOpacity,
              }}
            >
              <span
                style={{
                  fontSize: 108,
                  fontWeight: 900,
                  color: ORANGE,
                  fontFamily: FONT_FAMILY,
                  letterSpacing: -3,
                }}
              >
                DE 5 ANOS
              </span>
              <span
                style={{
                  fontSize: 108,
                  fontWeight: 900,
                  color: GOLD,
                  fontFamily: FONT_FAMILY,
                }}
              >
                ?
              </span>
            </div>
          </div>
        </AbsoluteFill>

        {/* ---- Phase E ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              filter: `blur(${phaseEExit * 16}px)`,
            }}
          >
            <div
              style={{
                transform: `translateZ(60px) translateY(${entregaObra.y}px)`,
                filter: `blur(${entregaObra.blur}px) ${DROP_SHADOW}`,
                opacity: entregaObraOpacity,
                fontSize: 56,
                fontWeight: 400,
                color: WHITE_SOFT,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
              }}
            >
              ENTREGA DA OBRA
            </div>
            <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 24}}>
              <span
                style={{
                  fontSize: 70,
                  fontWeight: 900,
                  color: ORANGE,
                  fontFamily: FONT_FAMILY,
                  opacity: neqOpacity,
                }}
              >
                &ne;
              </span>
              <div
                style={{
                  position: 'absolute',
                  left: -10,
                  top: '50%',
                  width: 90,
                  height: 4,
                  backgroundColor: ORANGE,
                  transform: `translateY(-50%) rotate(-30deg) scaleX(${neqProgress})`,
                  transformOrigin: 'left center',
                  boxShadow: '0 0 10px rgba(230,83,0,0.7)',
                }}
              />
            </div>
            <div
              style={{
                transform: `translateZ(70px) translateY(${fimResp.y}px)`,
                filter: `blur(${fimResp.blur}px) ${DROP_SHADOW}`,
                opacity: fimRespOpacity,
                fontSize: 54,
                fontWeight: 900,
                color: WHITE_MAIN,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
                letterSpacing: -1,
              }}
            >
              FIM DA RESPONSABILIDADE
            </div>
          </div>
        </AbsoluteFill>

        {/* ---- Phase F: CTA ---- */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
            <div
              style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                justifyContent: 'center',
                transform: `translateZ(60px) translateY(${entendaDireitos.y}px)`,
                filter: `blur(${entendaDireitos.blur}px) ${DROP_SHADOW}`,
                opacity: entendaDireitos.opacity,
              }}
            >
              <span style={{fontSize: 56, fontWeight: 800, color: WHITE_MAIN, fontFamily: FONT_FAMILY}}>
                ENTENDA
              </span>
              <span style={{fontSize: 56, fontWeight: 900, color: ORANGE, fontFamily: FONT_FAMILY}}>
                SEUS DIREITOS
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                transform: `translateZ(60px) translateY(${nomeBlock.y}px)`,
                filter: `blur(${nomeBlock.blur}px) ${DROP_SHADOW}`,
                opacity: nomeBlock.opacity,
              }}
            >
              <div style={{fontSize: 40, fontWeight: 700, color: WHITE_MAIN, fontFamily: FONT_FAMILY}}>
                Dr. Jarbas Cugula
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 400,
                  color: GRAY_INSTITUTIONAL,
                  fontFamily: FONT_FAMILY,
                  letterSpacing: 2,
                }}
              >
                ADVOCACIA
              </div>
              <div
                style={{
                  height: 3,
                  width: 120 * ctaBarWidth,
                  backgroundColor: ORANGE,
                  marginTop: 10,
                  boxShadow: '0 0 10px rgba(230,83,0,0.6)',
                }}
              />
            </div>
          </div>
        </AbsoluteFill>
      </CameraStage>

      <AbsoluteFill style={{backgroundColor: '#000', opacity: finalFade}} />
    </AbsoluteFill>
  );
};
