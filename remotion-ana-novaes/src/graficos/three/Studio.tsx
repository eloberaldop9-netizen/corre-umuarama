import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { random } from 'remotion';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { P } from '../theme';

// Peças 3D compartilhadas: HDRI de estúdio procedural, o morfo quadrado→esfera
// (C1) e a escultura wireframe→sólido (C3/C4). Tudo dirigido por frame.

/** Ambiente HDRI procedural (RoomEnvironment) — reflexos sem baixar arquivos. */
export const StudioEnvironment: React.FC<{ intensity: number; rotationY?: number }> = ({ intensity, rotationY = 0 }) => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromScene(new RoomEnvironment(), 0.04);
    pmrem.dispose();
    return rt;
  }, [gl]);

  useLayoutEffect(() => {
    scene.environment = env.texture;
    scene.environmentIntensity = intensity;
    scene.environmentRotation.set(0, rotationY, 0);
  }, [scene, env, intensity, rotationY]);

  useEffect(
    () => () => {
      scene.environment = null;
      env.dispose();
    },
    [scene, env]
  );

  return null;
};

// ─────────────────────────────────────────────────────────────────────────
// MORFO — cubo subdividido com morph targets de "caixa arredondada": cada
// target é a mesma caixa com borderRadius r (0 → 50% do lado). r = 50% é a
// esfera. De frente, com material emissivo chapado, r = 0 é um quadrado 2D.
// ─────────────────────────────────────────────────────────────────────────
const MORPH_STEPS = 12;

/** Ponto da caixa unitária com raio de canto r (0..0.5) e sua normal. */
const roundedBoxPoint = (p: THREE.Vector3, r: number, outP: THREE.Vector3, outN: THREE.Vector3) => {
  const inner = 0.5 - r;
  const core = new THREE.Vector3(
    Math.max(-inner, Math.min(inner, p.x)),
    Math.max(-inner, Math.min(inner, p.y)),
    Math.max(-inner, Math.min(inner, p.z))
  );
  const d = p.clone().sub(core);
  if (d.lengthSq() < 1e-12) {
    // Vértice dentro do núcleo (só ocorre com r = 0.5 no centro das faces): usa a face dominante.
    const ax = Math.abs(p.x), ay = Math.abs(p.y), az = Math.abs(p.z);
    d.set(ax >= ay && ax >= az ? Math.sign(p.x) : 0, ay > ax && ay >= az ? Math.sign(p.y) : 0, az > ax && az > ay ? Math.sign(p.z) : 0);
  }
  d.normalize();
  outN.copy(d);
  outP.copy(core).addScaledVector(d, r);
};

const useMorphGeometry = () =>
  useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1, 1, 48, 48, 48);
    const pos = geo.attributes.position;
    const nrm = geo.attributes.normal;
    const v = new THREE.Vector3();
    const op = new THREE.Vector3();
    const on = new THREE.Vector3();
    const positions: THREE.BufferAttribute[] = [];
    const normals: THREE.BufferAttribute[] = [];
    for (let k = 1; k <= MORPH_STEPS; k++) {
      const r = (0.5 * k) / MORPH_STEPS;
      const ps = new Float32Array(pos.count * 3);
      const ns = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        roundedBoxPoint(v, r, op, on);
        // Morph targets relativos: deslocamento a partir do cubo base.
        ps[i * 3] = op.x - v.x;
        ps[i * 3 + 1] = op.y - v.y;
        ps[i * 3 + 2] = op.z - v.z;
        ns[i * 3] = on.x - nrm.getX(i);
        ns[i * 3 + 1] = on.y - nrm.getY(i);
        ns[i * 3 + 2] = on.z - nrm.getZ(i);
      }
      positions.push(new THREE.BufferAttribute(ps, 3));
      normals.push(new THREE.BufferAttribute(ns, 3));
    }
    geo.morphAttributes.position = positions;
    geo.morphAttributes.normal = normals;
    geo.morphTargetsRelative = true;
    return geo;
  }, []);

/** Pesos dos targets para um borderRadius contínuo t (0..1): interpola entre os dois vizinhos. */
const morphWeights = (t: number) => {
  const x = t * MORPH_STEPS;
  const lo = Math.floor(x);
  const frac = x - lo;
  return Array.from({ length: MORPH_STEPS }, (_, i) => {
    const k = i + 1;
    if (k === lo) return 1 - frac;
    if (k === lo + 1) return frac;
    return 0;
  });
};

const FLAT_BLUE = new THREE.Color(P.blueprint);
const BLACK = new THREE.Color('#000000');
const CHROME = new THREE.Color('#e9edf2');

interface MorphShapeProps {
  /** 0→1: quadrado chapado → esfera cromada (geometria + material). */
  morph: number;
  /** 0→1: o cromo "estoura" de volta no azul chapado (Z-dive → Cena 2). */
  flatten?: number;
  size: number;
  y: number;
  z?: number;
  scale: number;
}

export const MorphShape: React.FC<MorphShapeProps> = ({ morph, flatten = 0, size, y, z = 0, scale }) => {
  const geometry = useMorphGeometry();
  const t = Math.min(1, Math.max(0, morph));
  const f = Math.min(1, Math.max(0, flatten));
  const chrome = t * (1 - f);
  const color = useMemo(() => new THREE.Color(), []);
  color.copy(BLACK).lerp(CHROME, chrome);
  return (
    <mesh geometry={geometry} morphTargetInfluences={morphWeights(t)} position={[0, y, z]} scale={size * scale}>
      <meshStandardMaterial
        color={color}
        emissive={FLAT_BLUE}
        emissiveIntensity={1 - chrome}
        metalness={chrome}
        roughness={1 - 0.93 * chrome}
        envMapIntensity={chrome}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// ESCULTURA — TorusKnot (3,5) complexo. Wireframe que se desenha (drawRange)
// → sólido chumbo texturizado (roughness 0.4).
// ─────────────────────────────────────────────────────────────────────────
export const SCULPT = { radius: 150, tube: 34, p: 3, q: 5 } as const;

/** Textura procedural de metal fosco escovado (roughness/bump), seed fixa. */
export const useBrushedTexture = () =>
  useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = 'rgb(120,120,120)';
    ctx.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < 1600; i++) {
      const v = Math.round(60 + random(`brush-v-${i}`) * 140);
      ctx.fillStyle = `rgba(${v},${v},${v},${0.25 + random(`brush-a-${i}`) * 0.5})`;
      ctx.fillRect(
        random(`brush-x-${i}`) * c.width,
        random(`brush-y-${i}`) * c.height,
        30 + random(`brush-w-${i}`) * 260,
        1 + random(`brush-h-${i}`) * 1.5
      );
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(14, 1);
    return tex;
  }, []);

interface SculptureProps {
  /** 0→1: quanto da malha já foi "desenhado". */
  wireDraw: number;
  wireOpacity: number;
  solidOpacity: number;
  shadows?: boolean;
  /** 0→1: contorno de luz de recorte (fresnel) — a "Rim Light" do roteiro. */
  rimGlow?: number;
  /** Direção (mundo) de onde vem o recorte. */
  rimDir?: THREE.Vector3;
}

// Recorte fotográfico: fresnel aditivo, mais forte nas bordas voltadas para a
// luz traseira. Cor = Luz Rim da paleta (rgba(255,255,255,0.85)).
const RIM_VERTEX = `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const RIM_FRAGMENT = `
  uniform float uGlow;
  uniform vec3 uDir;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec3 n = normalize(vN);
    if (!gl_FrontFacing) n = -n;
    float fres = pow(1.0 - clamp(dot(n, normalize(vV)), 0.0, 1.0), 3.0);
    float side = 0.35 + 0.65 * clamp(dot(n, normalize(uDir)) * 0.5 + 0.5, 0.0, 1.0);
    gl_FragColor = vec4(vec3(0.85) * fres * side * uGlow, 1.0);
  }
`;

const RimShell: React.FC<{ geometry: THREE.BufferGeometry; glow: number; dir: THREE.Vector3 }> = ({ geometry, glow, dir }) => {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uGlow: { value: 0 }, uDir: { value: new THREE.Vector3(0, 1, -1) } },
        vertexShader: RIM_VERTEX,
        fragmentShader: RIM_FRAGMENT,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        depthFunc: THREE.LessEqualDepth,
        toneMapped: false,
      }),
    []
  );
  material.uniforms.uGlow.value = glow;
  material.uniforms.uDir.value.copy(dir);
  return <mesh geometry={geometry} material={material} renderOrder={2} />;
};

const DEFAULT_RIM_DIR = new THREE.Vector3(0, 1, -1);

export const Sculpture: React.FC<SculptureProps> = ({
  wireDraw,
  wireOpacity,
  solidOpacity,
  shadows,
  rimGlow = 0,
  rimDir = DEFAULT_RIM_DIR,
}) => {
  const brushed = useBrushedTexture();
  const solidGeo = useMemo(
    () => new THREE.TorusKnotGeometry(SCULPT.radius, SCULPT.tube, 480, 56, SCULPT.p, SCULPT.q),
    []
  );
  const wireGeo = useMemo(
    () =>
      new THREE.WireframeGeometry(
        new THREE.TorusKnotGeometry(SCULPT.radius, SCULPT.tube, 220, 14, SCULPT.p, SCULPT.q)
      ),
    []
  );
  const wireCount = wireGeo.attributes.position.count;
  // Desenha em pares de vértices (cada segmento de linha = 2 vértices).
  wireGeo.setDrawRange(0, Math.floor((wireCount * Math.min(1, Math.max(0, wireDraw))) / 2) * 2);

  return (
    <group>
      {solidOpacity > 0.001 ? (
        <mesh geometry={solidGeo} castShadow={shadows} receiveShadow={false}>
          <meshStandardMaterial
            color="#4a4e55"
            metalness={0.55}
            roughness={0.4}
            roughnessMap={brushed}
            bumpMap={brushed}
            bumpScale={0.5}
            transparent={solidOpacity < 1}
            opacity={solidOpacity}
            depthWrite={solidOpacity > 0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : null}
      {rimGlow > 0.001 && solidOpacity > 0.5 ? <RimShell geometry={solidGeo} glow={rimGlow * solidOpacity} dir={rimDir} /> : null}
      {wireOpacity > 0.001 ? (
        <lineSegments geometry={wireGeo}>
          <lineBasicMaterial color={P.wire} transparent opacity={wireOpacity} toneMapped={false} depthWrite={false} />
        </lineSegments>
      ) : null}
    </group>
  );
};

/** Poeira de estúdio: sprites suaves flutuando lentamente. */
export const Dust: React.FC<{ frame: number; seed: string; count: number; spread: number; size: number; opacity: number }> = ({
  frame,
  seed,
  count,
  spread,
  size,
  opacity,
}) => {
  const map = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.45)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (random(`${seed}-x-${i}`) - 0.5) * spread;
      arr[i * 3 + 1] = (random(`${seed}-y-${i}`) - 0.5) * spread * 1.6;
      arr[i * 3 + 2] = (random(`${seed}-z-${i}`) - 0.5) * spread;
    }
    return arr;
  }, [count, seed, spread]);
  return (
    <points position={[0, frame * 0.12, 0]} rotation={[0, frame * 0.0015, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        map={map}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#dbeafe"
      />
    </points>
  );
};
