import React, { CSSProperties } from 'react';
import { FONT, NV } from './theme';

// Selos dos softwares citados no roteiro: After Effects (2D), Blender (3D) e
// Premiere Pro (montagem). Tiles desenhados em código — nada de arquivo externo.

export type AppId = 'ae' | 'blender' | 'pr';

export const APPS: Record<AppId, { short: string; name: string; role: string }> = {
  ae: { short: 'Ae', name: 'After Effects', role: 'Motion 2D' },
  blender: { short: '', name: 'Blender', role: 'Modelagem 3D' },
  pr: { short: 'Pr', name: 'Premiere Pro', role: 'Montagem' },
};

const ADOBE = { ae: { bg: '#00005B', fg: '#9999FF' }, pr: { bg: '#00005B', fg: '#9999FF' } } as const;
const BLENDER = { bg: '#1E1E22', orange: '#E87D0D', blue: '#265787' } as const;

// Marca do Blender (contorno do pacote simple-icons, CC0) nas cores oficiais:
// laranja #E87D0D, aro branco e centro azul #265787.
const BLENDER_OUTER =
  'M7.35 14.831c.006.314.106.922.256 1.398a7.372 7.372 0 0 0 1.593 2.757 8.227 8.227 0 0 0 2.787 2.001 8.947 8.947 0 0 0 3.66.76 8.964 8.964 0 0 0 3.657-.772 8.285 8.285 0 0 0 2.785-2.01 7.428 7.428 0 0 0 1.592-2.762 6.964 6.964 0 0 0 .25-3.074 7.123 7.123 0 0 0-1.016-2.779 7.764 7.764 0 0 0-1.852-2.043h.002L13.566 2.55l-.02-.015c-.492-.378-1.319-.376-1.86.002-.547.382-.609 1.015-.123 1.415l-.001.001 3.126 2.543-9.53.01h-.013c-.788.001-1.545.518-1.695 1.172-.154.665.38 1.217 1.2 1.22V8.9l4.83-.01-8.62 6.617-.034.025c-.813.622-1.075 1.658-.563 2.313.52.667 1.625.668 2.447.004L7.414 14s-.069.52-.063.831zm12.09 1.741c-.97.988-2.326 1.548-3.795 1.55-1.47.004-2.827-.552-3.797-1.538a4.51 4.51 0 0 1-1.036-1.622 4.282 4.282 0 0 1 .282-3.519 4.702 4.702 0 0 1 1.153-1.371c.942-.768 2.141-1.183 3.396-1.185 1.256-.002 2.455.41 3.398 1.175.48.391.87.854 1.152 1.367a4.28 4.28 0 0 1 .522 1.706 4.236 4.236 0 0 1-.239 1.811 4.54 4.54 0 0 1-1.035 1.626';
const BLENDER_EYE =
  'M12.51 13.214c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 0 1 2.212-.79c.85 0 1.631.3 2.211.79.592.5.983 1.206 1.028 2.005.045.823-.285 1.586-.865 2.153a3.389 3.389 0 0 1-2.374.938 3.393 3.393 0 0 1-2.376-.938c-.58-.567-.91-1.33-.865-2.152';

const BlenderGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24">
    <circle cx={15.75} cy={13.36} r={4.3} fill="#FFFFFF" />
    <path d={BLENDER_OUTER} fill={BLENDER.orange} fillRule="evenodd" />
    <path d={BLENDER_EYE} fill={BLENDER.blue} />
  </svg>
);

export const AppTile: React.FC<{ app: AppId; size: number; style?: CSSProperties }> = ({ app, size, style }) => {
  const isAdobe = app !== 'blender';
  const colors = isAdobe ? ADOBE[app] : null;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        backgroundColor: colors ? colors.bg : BLENDER.bg,
        border: colors ? `${Math.max(2, size * 0.035)}px solid ${colors.fg}` : `${Math.max(2, size * 0.035)}px solid #3a3a42`,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size * 0.44,
        letterSpacing: -size * 0.01,
        color: colors ? colors.fg : '#fff',
        flexShrink: 0,
        ...style,
      }}
    >
      {isAdobe ? APPS[app].short : <BlenderGlyph size={size} />}
    </div>
  );
};

interface AppBadgeProps {
  app: AppId;
  size?: number;
  variant: 'brutal' | 'glass' | 'flat';
  /** Linha pequena acima do nome. */
  kicker?: string;
  /** Tipografia reduzida (créditos em linha). */
  compact?: boolean;
  style?: CSSProperties;
}

/** Selo "Feito no ..." — versão brutalista (Cena 2) ou vidro (Cenas 3/4). */
export const AppBadge: React.FC<AppBadgeProps> = ({ app, size = 72, variant, kicker, compact, style }) => {
  const brutal = variant === 'brutal' || variant === 'flat';
  const flat = variant === 'flat';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 12 : 16,
        padding: brutal ? '12px 26px 12px 12px' : compact ? '8px 20px 8px 8px' : '10px 24px 10px 10px',
        fontFamily: FONT,
        borderRadius: brutal ? 0 : 999,
        backgroundColor: brutal ? '#FFFFFF' : 'rgba(18,35,74,0.7)',
        border: brutal ? `${flat ? 3 : 4}px solid #0A0A0C` : `1px solid ${NV.line}`,
        boxShadow: flat ? 'none' : brutal ? '8px 8px 0 0 #0A0A0C' : '0 14px 40px rgba(2,5,14,0.5)',
        backdropFilter: brutal ? undefined : 'blur(16px)',
        ...style,
      }}
    >
      <AppTile app={app} size={size} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontSize: compact ? 13 : 16,
            fontWeight: 600,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            color: flat ? '#1D4ED8' : brutal ? '#4F46E5' : NV.sky,
          }}
        >
          {kicker ?? APPS[app].role}
        </span>
        <span style={{ fontSize: compact ? 22 : 28, fontWeight: 800, letterSpacing: -0.5, color: brutal ? '#111827' : NV.ice }}>
          {APPS[app].name}
        </span>
      </div>
    </div>
  );
};
