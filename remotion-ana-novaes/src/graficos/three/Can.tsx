import React, { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { continueRender, delayRender } from 'remotion';
import * as THREE from 'three';
import { P } from '../theme';
import { RimShell } from './Studio';

// ─────────────────────────────────────────────────────────────────────────
// LATA — o mockup 3D clássico da produção gráfica. Perfil de revolução
// (LatheGeometry) com UV re-parametrizado por comprimento de arco, para o
// rótulo 2D (desenhado em canvas) não distorcer. Estágios dirigidos por frame:
// wireframe que se desenha → lata "clay" cinza → rótulo aplicado em wipe
// (plano de corte subindo) → rim light (contorno fresnel).
// ─────────────────────────────────────────────────────────────────────────

/** Perfil (raio, altura) de baixo para cima — unidades de mundo. */
const PROFILE: [number, number][] = [
  [0, -106],
  [36, -106],
  [48, -111],
  [57, -109],
  [63, -102],
  [66, -92],
  [66, 86],
  [63, 96],
  [55, 105],
  [51, 109],
  [52.5, 112.5],
  [50, 115],
  [46.5, 113.5],
  [45.5, 110],
  [0, 110],
];
const BODY = [5, 6] as const; // índices do segmento cilíndrico (onde fica o rótulo)
export const CAN_HEIGHT = 226;

/** Comprimento de arco acumulado (0..1) por ponto do perfil. */
const arcFractions = () => {
  const acc = [0];
  for (let i = 1; i < PROFILE.length; i++) {
    const [r0, y0] = PROFILE[i - 1];
    const [r1, y1] = PROFILE[i];
    acc.push(acc[i - 1] + Math.hypot(r1 - r0, y1 - y0));
  }
  const total = acc[acc.length - 1];
  return acc.map((a) => a / total);
};

const buildLathe = (segments: number) => {
  const geo = new THREE.LatheGeometry(
    PROFILE.map(([r, y]) => new THREE.Vector2(r, y)),
    segments
  );
  const frac = arcFractions();
  const uv = geo.attributes.uv;
  const n = PROFILE.length;
  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j < n; j++) uv.setY(i * n + j, frac[j]);
  }
  uv.needsUpdate = true;
  return geo;
};

/** Rótulo 2D (canvas 2048×1600): frente com tipografia, verso com código de barras. */
const drawLabel = (c: HTMLCanvasElement) => {
    const W = c.width;
    const H = c.height;
    const ctx = c.getContext('2d')!;
    const frac = arcFractions();
    // flipY: topo do canvas = v 1 (topo da lata)
    const top = (1 - frac[BODY[1]]) * H;
    const bot = (1 - frac[BODY[0]]) * H;
    const bh = bot - top;

    // alumínio fora do rótulo
    const metal = ctx.createLinearGradient(0, 0, 0, H);
    metal.addColorStop(0, '#d9dde2');
    metal.addColorStop(0.5, '#b9bec5');
    metal.addColorStop(1, '#d9dde2');
    ctx.fillStyle = metal;
    ctx.fillRect(0, 0, W, H);

    // rótulo
    ctx.fillStyle = P.blueprint;
    ctx.fillRect(0, top, W, bh);

    // faixa diagonal neon dando a volta
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, top, W, bh);
    ctx.clip();
    ctx.fillStyle = P.neon;
    ctx.beginPath();
    ctx.moveTo(0, top + bh * 0.78);
    ctx.lineTo(W, top + bh * 0.62);
    ctx.lineTo(W, top + bh * 0.7);
    ctx.lineTo(0, top + bh * 0.86);
    ctx.closePath();
    ctx.fill();
    // círculo ink atrás da tipografia (frente = u 0.5)
    ctx.fillStyle = P.ink;
    ctx.beginPath();
    ctx.arc(W * 0.5 + 150, top + bh * 0.3, bh * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // filetes
    ctx.fillStyle = P.neon;
    ctx.fillRect(0, top + 18, W, 6);
    ctx.fillRect(0, bot - 24, W, 6);

    // FRENTE — tipografia
    ctx.fillStyle = P.paper;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `900 ${Math.round(bh * 0.3)}px Montserrat, Arial, sans-serif`;
    ctx.fillText('2D', W * 0.5, top + bh * 0.38);
    ctx.fillStyle = P.neon;
    ctx.fillText('3D', W * 0.5, top + bh * 0.62);

    // VERSO — código de barras e linhas de "texto" (sem palavras)
    const bx = 120;
    let x = bx;
    let k = 0;
    ctx.fillStyle = P.paper;
    ctx.fillRect(bx - 24, top + bh * 0.28, 300, bh * 0.26);
    ctx.fillStyle = P.ink;
    while (x < bx + 250) {
      const w = [4, 8, 3, 6, 10, 4][k % 6];
      ctx.fillRect(x, top + bh * 0.3, w, bh * 0.22);
      x += w + [5, 3, 7, 4][k % 4];
      k++;
    }
    ctx.fillStyle = 'rgba(250,250,250,0.55)';
    for (let i = 0; i < 6; i++) ctx.fillRect(1640, top + bh * 0.22 + i * 34, 300 - (i % 3) * 60, 12);

};

/**
 * A tipografia do rótulo usa Montserrat: o render espera a fonte carregar
 * (delayRender), redesenha o canvas e força um novo frame do WebGL.
 */
const useLabelTexture = () => {
  const advance = useThree((s) => s.advance);
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 1600;
    drawLabel(c);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
  useEffect(() => {
    const handle = delayRender('Fonte do rótulo da lata');
    document.fonts
      .load('900 200px Montserrat')
      .catch(() => undefined)
      .then(() => {
        drawLabel(tex.image as HTMLCanvasElement);
        tex.needsUpdate = true;
        advance(performance.now());
        continueRender(handle);
      });
  }, [tex, advance]);
  return tex;
};

interface ProductCanProps {
  wireDraw: number;
  wireOpacity: number;
  /** Lata cinza "clay" (sem rótulo). */
  solidOpacity: number;
  /** 0→1: o rótulo é aplicado de baixo para cima. */
  labelWipe: number;
  rimGlow?: number;
  rimDir?: THREE.Vector3;
  shadows?: boolean;
}

const DEFAULT_RIM = new THREE.Vector3(0, 1, -1);

export const ProductCan: React.FC<ProductCanProps> = ({
  wireDraw,
  wireOpacity,
  solidOpacity,
  labelWipe,
  rimGlow = 0,
  rimDir = DEFAULT_RIM,
  shadows,
}) => {
  const label = useLabelTexture();
  const solidGeo = useMemo(() => buildLathe(160), []);
  const wireGeo = useMemo(() => new THREE.WireframeGeometry(buildLathe(40)), []);
  const wireCount = wireGeo.attributes.position.count;
  wireGeo.setDrawRange(0, Math.floor((wireCount * Math.min(1, Math.max(0, wireDraw))) / 2) * 2);

  // Wipe do rótulo: plano definido no espaço LOCAL da lata (y sobe de baixo
  // para cima) e convertido para mundo a cada draw — clippingPlanes é em mundo
  // e o grupo pai escala/inclina/infla a lata.
  const localPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), []);
  const worldPlane = useMemo(() => new THREE.Plane(), []);
  localPlane.constant = -CAN_HEIGHT / 2 - 8 + (CAN_HEIGHT + 16) * Math.min(1, Math.max(0, labelWipe));
  const syncPlane = function (this: THREE.Object3D) {
    worldPlane.copy(localPlane).applyMatrix4(this.matrixWorld);
  };

  return (
    <group>
      {solidOpacity > 0.001 ? (
        <mesh geometry={solidGeo} castShadow={shadows}>
          <meshStandardMaterial
            color="#8d929a"
            metalness={0.75}
            roughness={0.38}
            transparent={solidOpacity < 1}
            opacity={solidOpacity}
            depthWrite={solidOpacity > 0.5}
          />
        </mesh>
      ) : null}
      {labelWipe > 0.001 ? (
        <mesh
          geometry={solidGeo}
          scale={1.002}
          castShadow={shadows}
          onBeforeRender={syncPlane}
        >
          <meshStandardMaterial
            map={label}
            metalness={0.55}
            roughness={0.3}
            clippingPlanes={labelWipe < 0.999 ? [worldPlane] : []}
            userData={{ envScale: 1 }}
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
