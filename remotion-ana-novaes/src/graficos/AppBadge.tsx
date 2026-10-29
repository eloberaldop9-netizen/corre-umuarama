import React, { CSSProperties } from 'react';
import { FONT } from './theme';

// Selos dos softwares citados no roteiro: After Effects (2D), Blender (3D) e
// Premiere Pro (montagem). Tiles desenhados em código — nada de arquivo externo.

export type AppId = 'ae' | 'blender' | 'pr';

export const APPS: Record<AppId, { short: string; name: string; role: string }> = {
  ae: { short: 'Ae', name: 'After Effects', role: 'Motion 2D' },
  blender: { short: '', name: 'Blender', role: 'Modelagem 3D' },
  pr: { short: 'Pr', name: 'Premiere Pro', role: 'Montagem' },
};

const ADOBE = { ae: { bg: '#00005B', fg: '#9999FF' }, pr: { bg: '#00005B', fg: '#9999FF' } } as const;
const BLENDER = { bg: '#1E1E22', orange: '#F5792A', blue: '#265787' } as const;

/** Ícone genérico de "órbita 3D" nas cores do Blender (não reproduz a marca). */
const BlenderGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 40 40">
    <ellipse cx={20} cy={20} rx={16} ry={7} fill="none" stroke={BLENDER.orange} strokeWidth={3.2} transform="rotate(-28 20 20)" />
    <circle cx={20} cy={20} r={8.5} fill={BLENDER.orange} />
    <circle cx={20} cy={20} r={4.2} fill={BLENDER.blue} />
    <circle cx={20} cy={20} r={1.6} fill="#fff" />
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
  style?: CSSProperties;
}

/** Selo "Feito no ..." — versão brutalista (Cena 2) ou vidro (Cenas 3/4). */
export const AppBadge: React.FC<AppBadgeProps> = ({ app, size = 72, variant, kicker, style }) => {
  const brutal = variant === 'brutal' || variant === 'flat';
  const flat = variant === 'flat';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: brutal ? '12px 26px 12px 12px' : '10px 24px 10px 10px',
        fontFamily: FONT,
        borderRadius: brutal ? 0 : 999,
        backgroundColor: brutal ? '#FFFFFF' : 'rgba(20,20,22,0.6)',
        border: brutal ? `${flat ? 3 : 4}px solid #0A0A0C` : '1px solid rgba(255,255,255,0.16)',
        boxShadow: flat ? 'none' : brutal ? '8px 8px 0 0 #0A0A0C' : '0 12px 40px rgba(0,0,0,0.45)',
        backdropFilter: brutal ? undefined : 'blur(16px)',
        ...style,
      }}
    >
      <AppTile app={app} size={size} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            color: flat ? '#1D4ED8' : brutal ? '#4F46E5' : 'rgba(255,255,255,0.55)',
          }}
        >
          {kicker ?? APPS[app].role}
        </span>
        <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: brutal ? '#111827' : '#FFFFFF' }}>
          {APPS[app].name}
        </span>
      </div>
    </div>
  );
};
