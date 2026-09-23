import React from 'react';
import { Easing } from 'remotion';
import { ci } from './motion';

// Ícones de linha (viewBox 24) que se DESENHAM no frame da palavra:
// cada traço usa pathLength=1 e o dashoffset vai de 1 → 0.
export const ICON_PATHS: Record<string, string[]> = {
  diploma: ['M2 9l10-5 10 5-10 5z', 'M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5', 'M22 9v6'],
  laptop: ['M5.5 5h13a1.5 1.5 0 0 1 1.5 1.5V16H4V6.5A1.5 1.5 0 0 1 5.5 5z', 'M2 19h20', 'M10 8.5l-2.5 2.5 2.5 2.5', 'M14 8.5l2.5 2.5-2.5 2.5'],
  briefcase: ['M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z', 'M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2', 'M3 13h18', 'M11 13v2h2v-2'],
  book: ['M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z', 'M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z'],
  bolsa: ['M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z'],
  moeda: ['M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z', 'M15 8.5c-.6-.9-1.7-1.5-3-1.5-1.9 0-3 1-3 2.3 0 3.2 6 1.7 6 4.9 0 1.3-1.2 2.3-3 2.3-1.4 0-2.5-.6-3.1-1.6', 'M12 5.5v13'],
  foguete: ['M12 3c3 2 5 5.5 5 9.5L15 16H9l-2-3.5C7 8.5 9 5 12 3z', 'M12 9.5a1.5 1.5 0 1 0 0 .01', 'M9 16l-2.5 3.5M15 16l2.5 3.5M12 17v4'],
  alvo: ['M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z', 'M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 1 0 0-9z', 'M12 11.2a.8.8 0 1 0 0 1.6.8.8 0 1 0 0-1.6z'],
  lampada: ['M9 18h6', 'M10 21h4', 'M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z'],
};

export const LineIcon: React.FC<{ name: keyof typeof ICON_PATHS | string; frame: number; at: number; size: number; color: string; stroke?: number; dur?: number }> = ({
  name, frame, at, size, color, stroke = 1.8, dur = 22,
}) => {
  const paths = ICON_PATHS[name] ?? [];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((d, i) => {
        const s = at + i * 4;
        const p = ci(frame, [s, s + dur], [0, 1], Easing.out(Easing.cubic));
        return <path key={i} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={p > 0 ? 1 : 0} />;
      })}
    </svg>
  );
};
