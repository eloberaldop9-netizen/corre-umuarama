import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { random } from 'remotion';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { G } from '../theme';

// Peças 3D compartilhadas pelas Cenas 3 e 4: escultura TorusKnot (wireframe →
// metal PBR), estúdio de luz e poeira. Tudo dirigido por frame, sem useFrame,
// para o render ser determinístico.

export const KNOT = { radius: 140, tube: 42, p: 2, q: 3 } as const;

/** Ponto da curva central do TorusKnot (mesma fórmula do three.js). */
export const knotCurvePoint = (u: number): THREE.Vector3 => {
  const { radius, p, q } = KNOT;
  const qu = (q / p) * u;
  const cs = Math.cos(qu);
  return new THREE.Vector3(
    radius * (2 + cs) * 0.5 * Math.cos(u),
    radius * (2 + cs) * Math.sin(u) * 0.5,
    radius * Math.sin(qu) * 0.5
  );
};

/** Ambiente HDRI procedural (RoomEnvironment) — reflexos sem baixar arquivos. */
export const StudioEnvironment: React.FC<{ intensity: number }> = ({ intensity }) => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  gl.localClippingEnabled = true;

  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromScene(new RoomEnvironment(), 0.04);
    pmrem.dispose();
    return rt;
  }, [gl]);

  useLayoutEffect(() => {
    scene.environment = env.texture;
    scene.environmentIntensity = intensity;
  }, [scene, env, intensity]);

  useEffect(
    () => () => {
      scene.environment = null;
      env.dispose();
    },
    [scene, env]
  );

  return null;
};

interface MetalKnotProps {
  /** Altura (Y, mundo) do scanner: acima vira metal, abaixo continua malha. */
  scanY: number;
  wireOpacity: number;
  /** Malha fantasma sobre o metal (Cena 4 — 2D + 3D juntos). */
  ghostWire?: number;
}

/** Textura de metal escovado (roughness/bump) gerada em canvas, seed fixa. */
const useBrushedTexture = () =>
  useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = 'rgb(120,120,120)';
    ctx.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < 1400; i++) {
      const v = Math.round(70 + random(`brush-v-${i}`) * 120);
      ctx.fillStyle = `rgba(${v},${v},${v},${0.25 + random(`brush-a-${i}`) * 0.5})`;
      const x = random(`brush-x-${i}`) * c.width;
      const y = random(`brush-y-${i}`) * c.height;
      ctx.fillRect(x, y, 30 + random(`brush-w-${i}`) * 260, 1 + random(`brush-h-${i}`) * 1.5);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 1);
    return tex;
  }, []);

export const MetalKnot: React.FC<MetalKnotProps> = ({ scanY, wireOpacity, ghostWire = 0 }) => {
  const brushed = useBrushedTexture();
  const solidGeo = useMemo(
    () => new THREE.TorusKnotGeometry(KNOT.radius, KNOT.tube, 360, 56, KNOT.p, KNOT.q),
    []
  );
  const wireGeo = useMemo(
    () => new THREE.TorusKnotGeometry(KNOT.radius, KNOT.tube, 128, 14, KNOT.p, KNOT.q),
    []
  );
  const solidPlanes = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)], []);
  const wirePlanes = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)], []);
  solidPlanes[0].constant = -scanY; // mantém y >= scanY
  wirePlanes[0].constant = scanY; // mantém y <= scanY

  return (
    <group>
      <mesh geometry={solidGeo}>
        <meshStandardMaterial
          color="#0b0e0d"
          metalness={0.9}
          roughness={0.32}
          roughnessMap={brushed}
          bumpMap={brushed}
          bumpScale={0.6}
          clippingPlanes={solidPlanes}
        />
      </mesh>
      {wireOpacity > 0 ? (
        <mesh geometry={wireGeo}>
          <meshBasicMaterial
            color={G.emerald}
            wireframe
            transparent
            opacity={wireOpacity}
            clippingPlanes={wirePlanes}
            toneMapped={false}
          />
        </mesh>
      ) : null}
      {ghostWire > 0 ? (
        <mesh geometry={wireGeo} scale={1.004}>
          <meshBasicMaterial color={G.emerald} wireframe transparent opacity={ghostWire} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );
};

/** Rim lights verdes laterais + key fria. `accent` adiciona o indigo do 2D. */
export const StudioLights: React.FC<{ accent?: boolean }> = ({ accent }) => (
  <>
    <ambientLight intensity={0.04} />
    <pointLight position={[-420, 90, 140]} color={G.emerald} intensity={3.2} decay={0} />
    <pointLight position={[400, -140, -280]} color={G.emerald} intensity={2.2} decay={0} />
    <directionalLight position={[200, 420, 320]} color="#dfe7ff" intensity={0.7} />
    {accent ? <pointLight position={[320, 260, 260]} color={G.indigo} intensity={2.4} decay={0} /> : null}
  </>
);

const useSoftDotTexture = () =>
  useMemo(() => {
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
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

interface DustProps {
  frame: number;
  seed: string;
  count: number;
  spread: number;
  size: number;
  opacity: number;
}

/** Poeira 3D: sprites suaves (bokeh) flutuando devagar pela lente. */
export const Dust: React.FC<DustProps> = ({ frame, seed, count, spread, size, opacity }) => {
  const map = useSoftDotTexture();
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
        color="#cffbe8"
      />
    </points>
  );
};
