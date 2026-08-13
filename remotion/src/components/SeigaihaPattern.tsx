import React from 'react';
import { AbsoluteFill } from 'remotion';

interface SeigaihaPatternProps {
  color?: string;
  opacity?: number;
  scale?: number;
  style?: React.CSSProperties;
}

/**
 * Padrão Seigaiha (ondas japonesas) desenhado em SVG — arcos concêntricos
 * repetidos em grid hexagonal. Uso discreto (3%–8% de opacidade) como textura
 * de fundo, nunca como elemento decorativo isolado.
 */
export const SeigaihaPattern: React.FC<SeigaihaPatternProps> = ({
  color = '#171717',
  opacity = 0.05,
  scale = 1,
  style,
}) => {
  const r = 60 * scale;
  const tile = r * 2;
  const rings = [1, 0.72, 0.44];

  return (
    <AbsoluteFill style={{ opacity, ...style }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern
            id="seigaiha"
            x="0"
            y="0"
            width={tile}
            height={tile * 0.72}
            patternUnits="userSpaceOnUse"
          >
            {[0, 1].map((row) =>
              [0, 1, 2].map((col) => (
                <g key={`${row}-${col}`} transform={`translate(${col * tile + (row % 2 ? tile / 2 : 0)}, ${row * tile * 0.5 - tile * 0.25})`}>
                  {rings.map((ringScale) => (
                    <path
                      key={ringScale}
                      d={`M ${-r * ringScale} 0 A ${r * ringScale} ${r * ringScale} 0 0 1 ${r * ringScale} 0`}
                      fill="none"
                      stroke={color}
                      strokeWidth={1.4}
                    />
                  ))}
                </g>
              ))
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#seigaiha)" />
      </svg>
    </AbsoluteFill>
  );
};
