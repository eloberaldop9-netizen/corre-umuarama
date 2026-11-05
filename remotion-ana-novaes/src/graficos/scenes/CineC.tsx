import React, { useLayoutEffect } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { AbsoluteFill, Easing, random, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { ci } from '../../lib/motion';
import { FONT, NV, P } from '../theme';
import { Dust, StudioEnvironment } from '../three/Studio';
import { ProductCan } from '../three/Can';
import { Beats, LABEL_H, LABEL_W, LabelArt } from '../LabelArt';
import { AppBadge } from '../AppBadge';

// ─────────────────────────────────────────────────────────────────────────
// CENA 3 — A Profundidade do 3D (frames 743–1350, local 0–607)
// Objeto de destaque: uma LATA (o mockup 3D clássico da produção gráfica).
// Wireframe ciano se desenha no vazio → órbita 180° → malha vira lata cinza →
// a arte 2D da Cena 2 voa e embrulha a lata (vira textura) → Rim Light →
// Fill quente. A linha de apoio nomeia cada etapa: volume · luz · realismo.
// Saída: WIPE VOLUMÉTRICO — órbita vertiginosa + escala 1→40 (blockout).
// ─────────────────────────────────────────────────────────────────────────

const T = {
  wire: 10,
  title: 50,
  titleStagger: 15,
  orbit: [30, 570] as const,
  solid: [150, 200] as const, // malha → lata cinza (clay)
  cardIn: [162, 192] as const, // a arte 2D da Cena 2 entra voando
  label: [195, 245] as const, // ...e embrulha a lata (o rótulo vira textura)
  rim: [225, 265] as const, // o estúdio acende: recorte
  fill: [255, 295] as const, // ...e preenchimento quente
  app: 120, // selo "Modelado no Blender"
  closeUp: [300, 340, 372, 410] as const, // plano 2: close na textura + luz varrendo
  lowAngle: [382, 422, 458, 500] as const, // plano 3: contra-plongée (herói)
  textExit: 570,
  inflate: 575,
  end: 600,
} as const;

const ORBIT_RADIUS = 800;
const LOOK_AT = new THREE.Vector3(0, 45, 0); // lata um pouco mais alta: libera a base para o selo
const OBJ_SCALE = 1.35; // lata ~900px de altura no hold

const orbitAngle = (frame: number) =>
  ci(frame, [T.orbit[0], T.orbit[1]], [0, Math.PI], Easing.inOut(Easing.cubic)) +
  ci(frame, [T.textExit, T.end], [0, Math.PI * 0.9], Easing.in(Easing.exp)); // acelera vertiginosamente

/** Peso (0→1→0) de um plano: entra e sai em in-out-cubic, sem cortes. */
const shot = (frame: number, [a, b, c, d]: readonly [number, number, number, number]) =>
  ci(frame, [a, b], [0, 1], Easing.inOut(Easing.cubic)) - ci(frame, [c, d], [0, 1], Easing.inOut(Easing.cubic));

/**
 * Planos encadeados sobre a órbita: aberto → close na textura do rótulo →
 * contra-plongée de herói → aberto de novo (a órbita de 180° segue por baixo).
 */
const camPosition = (frame: number) => {
  const a = orbitAngle(frame);
  const close = shot(frame, T.closeUp);
  const low = shot(frame, T.lowAngle);
  const r = ORBIT_RADIUS - 400 * close - 140 * low;
  const y = 150 - 110 * close - 330 * low;
  return new THREE.Vector3(Math.sin(a) * r, y, Math.cos(a) * r);
};

const lookAt = (frame: number) =>
  new THREE.Vector3(0, LOOK_AT.y - 45 * shot(frame, T.closeUp) - 25 * shot(frame, T.lowAngle), 0);

const Rig: React.FC<{ frame: number }> = ({ frame }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    camera.position.copy(camPosition(frame));
    camera.lookAt(lookAt(frame));
    camera.updateProjectionMatrix();
  }, [camera, frame]);
  return null;
};

/**
 * Rim (directional traseiro branco) + Fill (point quente lateral), presos à
 * câmera. O rim fica atrás e de lado (~145° da lente) para desenhar a borda
 * da escultura contra o void; o fill entra a ~70° do outro lado.
 */
/** Direção (mundo) da rim light: atrás e de lado em relação à lente, alta. */
const rimDirection = (frame: number) => {
  const rimA = orbitAngle(frame) + Math.PI - 0.6;
  return new THREE.Vector3(Math.sin(rimA) * 700, 520, Math.cos(rimA) * 700).normalize();
};

const StudioLights: React.FC<{ frame: number }> = ({ frame }) => {
  const rim = ci(frame, [T.rim[0], T.rim[1]], [0, 5], Easing.inOut(Easing.cubic));
  const fill = ci(frame, [T.fill[0], T.fill[1]], [0, 2.4], Easing.inOut(Easing.cubic));
  const a = orbitAngle(frame);
  const fillA = a + 1.2;
  const rimPos = rimDirection(frame).multiplyScalar(890);
  const fillPos: [number, number, number] = [Math.sin(fillA) * 650, 120, Math.cos(fillA) * 650];
  // Durante o close, uma luz de estúdio varre o rótulo da esquerda para a
  // direita: o brilho correndo pela superfície mostra textura e volume.
  const close = shot(frame, T.closeUp);
  const sweepA = a + ci(frame, [T.closeUp[0], T.closeUp[3]], [-1.1, 1.1], Easing.inOut(Easing.sin));
  const sweepPos: [number, number, number] = [Math.sin(sweepA) * 420, 60, Math.cos(sweepA) * 420];
  return (
    <>
      <ambientLight intensity={0.05} />
      <directionalLight position={rimPos} intensity={rim} color="#ffffff" />
      <pointLight position={fillPos} intensity={fill} color="#FFB37A" decay={0} />
      <pointLight position={sweepPos} intensity={2.6 * close} color="#DCE8FF" decay={0} />
    </>
  );
};

const World: React.FC = () => {
  const frame = useCurrentFrame();
  const wireDraw = ci(frame, [T.wire, T.wire + 100], [0, 1], Easing.out(Easing.sin));
  const wireIn = ci(frame, [T.wire, T.wire + 40], [0, 1], Easing.out(Easing.sin));
  const swap = ci(frame, [T.solid[0], T.solid[1]], [0, 1], Easing.inOut(Easing.cubic));
  const label = ci(frame, [T.label[0], T.label[1]], [0, 1], Easing.inOut(Easing.cubic));
  const gl = useThree((s) => s.gl);
  gl.localClippingEnabled = true;
  const inflate = ci(frame, [T.inflate, T.end], [1, 40], Easing.in(Easing.exp));
  return (
    <>
      <StudioEnvironment intensity={0.18 + ci(frame, [T.fill[0], T.fill[1]], [0, 0.32], Easing.inOut(Easing.cubic))} />
      <StudioLights frame={frame} />
      <Rig frame={frame} />
      <group scale={OBJ_SCALE * inflate} rotation={[0, 0, 0.1]}>
        <ProductCan
          wireDraw={wireDraw}
          wireOpacity={wireIn * (1 - swap)}
          solidOpacity={swap}
          labelWipe={label}
          rimGlow={ci(frame, [T.rim[0], T.rim[1]], [0, 1], Easing.inOut(Easing.cubic))}
          rimDir={rimDirection(frame)}
        />
      </group>
      <Dust frame={frame} seed="c3-dust" count={220} spread={1800} size={4} opacity={0.35} />
    </>
  );
};

// ── BACKGROUND — névoa noise + focos de luz piscando ─────────────────────
const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const FOCI = [
  { x: 20, y: 30, r: 520, seed: 'f1' },
  { x: 82, y: 58, r: 620, seed: 'f2' },
  { x: 40, y: 86, r: 480, seed: 'f3' },
];

const Atmosphere: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {FOCI.map((f, i) => {
      const flicker = 0.5 + 0.35 * Math.sin(frame * 0.05 + i * 2.1) + 0.15 * (random(`${f.seed}-${Math.floor(frame / 3)}`) - 0.5);
      return (
        <div
          key={f.seed}
          style={{
            position: 'absolute',
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.r,
            height: f.r,
            marginLeft: -f.r / 2,
            marginTop: -f.r / 2,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.10), transparent 65%)',
            opacity: flicker,
          }}
        />
      );
    })}
    <AbsoluteFill
      style={{
        backgroundImage: NOISE,
        backgroundSize: '1024px 1024px',
        opacity: 0.05,
        transform: `translateY(${ci(frame, [0, T.end], [0, -100])}px)`,
        mixBlendMode: 'screen',
      }}
    />
  </>
);

// ── TIPOGRAFIA — overlay flat flutuando livre na lente ───────────────────
const TitleLine: React.FC<{ text: string; start: number; frame: number; style: React.CSSProperties }> = ({
  text,
  start,
  frame,
  style,
}) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.26em', ...style }}>
    {text.split(' ').map((word, i) => {
      const s = start + i * 3;
      const p = ci(frame, [s, s + 24], [0, 1], Easing.out(Easing.cubic));
      return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            opacity: p,
            transform: `scale(${ci(p, [0, 1], [1.1, 1])})`,
            filter: p < 0.999 ? `blur(${20 * (1 - p)}px)` : undefined,
          }}
        >
          {word}
        </span>
      );
    })}
  </div>
);

/**
 * O cartaz 2D da Cena 2 entra voando e pousa sobre a lata; enquanto o rótulo
 * 3D é aplicado de baixo para cima, o cartaz some na mesma direção — a arte
 * plana "passa" para o volume. Sombreado cilíndrico ao pousar.
 */
const LABEL_SCREEN = { x: 540, y: 1088, w: 508 }; // frente do rótulo na tela durante o wipe
const FlyingLabel: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < T.cardIn[0] || frame > T.label[1] + 2) return null;
  const p = ci(frame, [T.cardIn[0], T.cardIn[1]], [0, 1], Easing.out(Easing.cubic));
  const wipe = ci(frame, [T.label[0], T.label[1]], [0, 1], Easing.inOut(Easing.cubic));
  const k = LABEL_SCREEN.w / LABEL_W;
  const x = 1250 + (LABEL_SCREEN.x - 1250) * p;
  const y = 420 + (LABEL_SCREEN.y - 420) * p;
  const scale = 0.62 + (k - 0.62) * p;
  const rot = 14 + (-5.7 - 14) * p;
  const bl = 12 * (1 - p);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - LABEL_W / 2,
        top: y - LABEL_H / 2,
        width: LABEL_W,
        height: LABEL_H,
        transform: `rotate(${rot}deg) scale(${scale})`,
        opacity: ci(frame, [T.cardIn[0], T.cardIn[0] + 8], [0, 1]),
        filter: bl > 0.05 ? `blur(${bl}px)` : undefined,
        clipPath: `inset(0 0 ${wipe * 100}% 0)`,
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <LabelArt build={999} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 30%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.45) 100%)',
          opacity: p,
        }}
      />
    </div>
  );
};

const TITLE: React.CSSProperties = { fontSize: 88, fontWeight: 800, letterSpacing: -2, color: '#FFFFFF', lineHeight: 1.08 };

export const CineC: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const textExit = ci(frame, [T.textExit, T.textExit + 18], [0, 1], Easing.in(Easing.exp));
  // Saída Quádrupla: o roteiro pede opacity + blur 25; a skill completa com
  // posição (sobe, contrária à massa que avança) e contração sutil.
  const textExitStyle: React.CSSProperties = {
    opacity: ci(textExit, [0.35, 1], [1, 0]),
    filter: textExit > 0.01 ? `blur(${25 * textExit}px)` : undefined,
    transform: `translateY(${-120 * textExit}px) scale(${1 - 0.05 * textExit})`,
  };
  const blockout = ci(frame, [586, T.end], [0, 1], Easing.in(Easing.cubic));
  const float = Math.sin(frame * 0.03) * 6;

  return (
    <AbsoluteFill style={{ backgroundColor: P.void, overflow: 'hidden', fontFamily: FONT }}>
      <Atmosphere frame={frame} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 45, near: 1, far: 8000, position: [0, 150, ORBIT_RADIUS] }}
        gl={{ antialias: true }}
      >
        <World />
      </ThreeCanvas>

      {/* véu escuro no topo: mantém o título legível quando a lata enche o quadro */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(5,5,10,0.85) 0%, rgba(5,5,10,0.55) 22%, rgba(5,5,10,0) 36%)', ...textExitStyle }} />
      {/* TÍTULO — flutua livre na lente */}
      <div style={{ position: 'absolute', top: 200, left: 40, right: 40, ...textExitStyle }}>
        <div style={{ transform: `translateY(${float}px)` }}>
          <TitleLine text="A Profundidade e" start={T.title} frame={frame} style={TITLE} />
          <TitleLine text="o Impacto do 3D" start={T.title + T.titleStagger} frame={frame} style={TITLE} />
          {/* a resposta: o que o 3D acrescenta, cada palavra no seu estágio */}
          <Beats
            frame={frame}
            items={[
              { text: 'volume', at: T.solid[0] },
              { text: 'luz', at: T.rim[0] },
              { text: 'realismo', at: T.fill[0] + 10 },
            ]}
            style={{ justifyContent: 'center', marginTop: 16, fontSize: 46, fontWeight: 600, letterSpacing: 0.5, color: NV.sky }}
          />
        </div>
      </div>

      <FlyingLabel frame={frame} />

      {/* selo do software 3D — embaixo, na mesma altura do selo da Cena 2 */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1650, ...textExitStyle }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            opacity: ci(frame, [T.app, T.app + 16], [0, 1]),
            transform: `translateY(${ci(frame, [T.app, T.app + 24], [70, 0], Easing.out(Easing.cubic))}px)`,
          }}
        >
          <AppBadge app="blender" variant="glass" size={84} kicker="Modelado no" />
        </div>
      </div>

      {/* BLOCKOUT — a massa chumbo tapa a lente por completo */}
      <AbsoluteFill style={{ backgroundColor: P.lead, opacity: blockout }} />
    </AbsoluteFill>
  );
};
