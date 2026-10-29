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
// MORFO — cubo subdividido com morph target para esfera. De frente, com
// material emissivo chapado, é um quadrado 2D perfeito; ao inflar, vira esfera.
// ─────────────────────────────────────────────────────────────────────────
const useMorphGeometry = () =>
  useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1, 1, 48, 48, 48);
    const pos = geo.attributes.position;
    const sphere = new Float32Array(pos.count * 3);
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).normalize().multiplyScalar(0.5);
      sphere[i * 3] = v.x;
      sphere[i * 3 + 1] = v.y;
      sphere[i * 3 + 2] = v.z;
    }
    geo.morphAttributes.position = [new THREE.BufferAttribute(sphere, 3)];
    const normals = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).normalize();
      normals[i * 3] = v.x;
      normals[i * 3 + 1] = v.y;
      normals[i * 3 + 2] = v.z;
    }
    geo.morphAttributes.normal = [new THREE.BufferAttribute(normals, 3)];
    return geo;
  }, []);

const FLAT_BLUE = new THREE.Color(P.blueprint);
const BLACK = new THREE.Color('#000000');
const CHROME = new THREE.Color('#e9edf2');

export const MorphShape: React.FC<{ morph: number; size: number; y: number; scale: number }> = ({
  morph,
  size,
  y,
  scale,
}) => {
  const geometry = useMorphGeometry();
  const t = Math.min(1, Math.max(0, morph));
  const color = useMemo(() => new THREE.Color(), []);
  color.copy(BLACK).lerp(CHROME, t);
  return (
    <mesh geometry={geometry} morphTargetInfluences={[t]} position={[0, y, 0]} scale={size * scale}>
      <meshStandardMaterial
        color={color}
        emissive={FLAT_BLUE}
        emissiveIntensity={1 - t}
        metalness={t}
        roughness={1 - 0.93 * t}
        envMapIntensity={t}
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
}

export const Sculpture: React.FC<SculptureProps> = ({ wireDraw, wireOpacity, solidOpacity, shadows }) => {
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
