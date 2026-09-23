import React from 'react';

/** Folha de jornal rasgada (colagem): papel cinza-claro com colunas de "texto" e borda irregular. */
export const NewsSheet: React.FC<{ w: number; h: number; seed?: number; tone?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  w, h, seed = 1, tone = '#E6E2DA', style, children,
}) => {
  const r = (n: number) => {
    const v = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  const pts: string[] = [];
  const N = 14;
  for (let i = 0; i <= N; i++) pts.push(`${(i / N) * 100}% ${r(i) * 3}%`);
  for (let i = 1; i <= N; i++) pts.push(`${100 - r(i + 30) * 2.5}% ${(i / N) * 100}%`);
  for (let i = 1; i <= N; i++) pts.push(`${100 - (i / N) * 100}% ${100 - r(i + 60) * 3}%`);
  for (let i = 1; i < N; i++) pts.push(`${r(i + 90) * 2.5}% ${100 - (i / N) * 100}%`);
  return (
    <div
      style={{
        position: 'absolute', width: w, height: h, background: tone, clipPath: `polygon(${pts.join(',')})`,
        backgroundImage: `repeating-linear-gradient(180deg, rgba(40,40,40,0.28) 0 3px, transparent 3px 11px),
          repeating-linear-gradient(90deg, transparent 0 190px, ${tone} 190px 214px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Filtro SVG que "rasga" bordas (usado no contorno amarelo do recorte). Renderize uma vez por cena. */
export const RoughFilter: React.FC<{ id: string; scale?: number }> = ({ id, scale = 22 }) => (
  <svg width={0} height={0} style={{ position: 'absolute' }}>
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4} />
      <feDisplacementMap in="SourceGraphic" scale={scale} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);
