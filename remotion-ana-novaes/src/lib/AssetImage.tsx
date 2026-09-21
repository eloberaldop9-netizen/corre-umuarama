import React from 'react';
import { Img, staticFile } from 'remotion';

interface AssetImageProps {
  /** Nome do arquivo dentro de /public/assets (ex: "retrato-ana.png"), ou null se ainda não recebemos o asset. */
  file?: string | null;
  label: string;
  style?: React.CSSProperties;
  tone?: 'dark' | 'light';
  objectFit?: React.CSSProperties['objectFit'];
}

/**
 * Wrapper universal de mídia. Enquanto o asset real não chega, renderiza um
 * placeholder visual no mesmo espaço/proporção — assim a cena já fica
 * composta corretamente e a troca pelo arquivo real é apenas preencher
 * `file` (ou o objeto ASSETS em VideoAnaNovaes.tsx).
 */
export const AssetImage: React.FC<AssetImageProps> = ({
  file,
  label,
  style,
  tone = 'dark',
  objectFit = 'cover',
}) => {
  if (file) {
    return <Img src={staticFile(`assets/${file}`)} style={{ objectFit, ...style }} />;
  }

  const isDark = tone === 'dark';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark
          ? 'linear-gradient(145deg, #2A2A2E 0%, #17171A 100%)'
          : 'linear-gradient(145deg, #E4E1D6 0%, #D2CEBF 100%)',
        border: `2px dashed ${isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'}`,
        color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)',
        fontFamily: "'Inter', sans-serif",
        fontSize: 22,
        fontWeight: 600,
        textAlign: 'center',
        padding: 20,
        letterSpacing: 0.5,
        ...style,
      }}
    >
      {label}
    </div>
  );
};
