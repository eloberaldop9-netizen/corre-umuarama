import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay, DustParticles } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_COMBATE } from '../lib/palette-combate';
import { FONT } from '../lib/palette';
import type { CombateAssets } from '../VideoAnaNovaisCombate';

// Cena 1 — A Postura (O Combate) | frames locais 0–122 (4.1s) | VERBO v5.0
// Transcrição real (forced alignment real sobre narracao-combate.mp3):
// "Ana"@6 "Novais"@12 "quer"@28 "fortalecer"@38 "o"@56 "combate"@60 "à"@66
// "violência"@72 "contra"@87 "as"@96 "mulheres"@103 (fala termina ~115)
// Toda entrada abaixo é cravada nessas marcas reais — não nas estimativas
// da diretriz (que assumia ~23s de narração total; a real tem 25,4s).
// Câmera viva o tempo todo (dolly in contínuo), poeira subindo, glow
// pulsante — nunca um frame morto.
export const Combate1_Postura: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = ci(frame, [0, 12], [0, 1]);
  const dollyScale = ci(frame, [0, 122], [1, 1.08], Easing.out(Easing.cubic));

  const portraitOp = ci(frame, [0, 20], [0, 1]);
  const portraitBlur = ci(frame, [0, 20], [18, 0], Easing.out(Easing.cubic));
  const portraitY = ci(frame, [0, 20], [40, 0], Easing.out(Easing.cubic));

  // Micro-animações contínuas — a tela nunca fica parada
  const xGlow = 0.5 + Math.max(0, Math.sin(frame * 0.35)) * 0.5; // flicker de alerta
  const comboGlow = 0.1 + Math.max(0, Math.sin(frame * 0.05)) * 0.2;

  const anaSp = spring({ frame, fps, config: { damping: 14, mass: 0.8 }, delay: 6 });
  const novaisSp = spring({ frame, fps, config: { damping: 14, mass: 0.8 }, delay: 12 });
  const fortalecerSp = spring({ frame, fps, config: { damping: 14, mass: 0.8 }, delay: 38 });
  const combateSp = spring({ frame, fps, config: { damping: 10, mass: 1.5, stiffness: 80 }, delay: 60 });
  const violenciaSp = spring({ frame, fps, config: { damping: 14, mass: 0.8 }, delay: 66 });

  // Saída (98–122) — Z-DIVE RASGA: quadruple exit escalonado, "O COMBATE"
  // explode em Z cegando a tela de amarelo.
  const exitRetrato = ci(frame, [98, 120], [0, 1], Easing.in(Easing.exp));
  const exitFortalecer = ci(frame, [101, 121], [0, 1], Easing.in(Easing.exp));
  const exitVilencia = ci(frame, [104, 122], [0, 1], Easing.in(Easing.exp));
  const exitCombate = ci(frame, [108, 122], [0, 1], Easing.in(Easing.exp));
  const flashOp = ci(frame, [104, 122], [0, 1], Easing.in(Easing.exp));

  return (
    <AbsoluteFill style={{ opacity: bgOp, backgroundColor: COLOR_COMBATE.voidDeep }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 40%, rgba(122,75,148,0.4), transparent 70%)`,
        }}
      />
      <NoiseOverlay opacity={0.08} />
      <DustParticles count={26} />

      <AbsoluteFill style={{ transform: `scale(${dollyScale})`, transformOrigin: '50% 50%' }}>
        {/* Ana Novais — abertura real da fala */}
        <div style={{ position: 'absolute', top: 160, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, opacity: 1 - exitFortalecer }}>
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: 40,
                letterSpacing: 5,
                color: COLOR_COMBATE.textLight,
                transform: `translateY(${ci(anaSp, [0, 1], [24, 0])}px)`,
                filter: `blur(${ci(frame - 6, [0, 14], [10, 0])}px)`,
                opacity: ci(frame, [6, 18], [0, 1]),
              }}
            >
              ANA
            </span>
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: 40,
                letterSpacing: 5,
                color: COLOR_COMBATE.textLight,
                transform: `translateY(${ci(novaisSp, [0, 1], [24, 0])}px)`,
                filter: `blur(${ci(frame - 12, [0, 14], [10, 0])}px)`,
                opacity: ci(frame, [12, 24], [0, 1]),
              }}
            >
              NOVAIS
            </span>
          </div>
        </div>

        {/* FORTALECER — atrás do retrato (z inferior) */}
        <div
          style={{
            position: 'absolute',
            top: 440,
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 1,
            opacity: (1 - exitFortalecer) * ci(frame, [38, 54], [0, 1]),
            transform: `translateY(${ci(fortalecerSp, [0, 1], [40, 0])}px) translateX(${exitFortalecer * -1300}px) scale(${1 - exitFortalecer * 0.1})`,
            filter: `blur(${ci(frame - 38, [0, 16], [12, 0])}px) blur(${exitFortalecer * 18}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 400,
              fontSize: 58,
              letterSpacing: 1,
              color: COLOR_COMBATE.textLight,
              textShadow: '0 6px 24px rgba(0,0,0,0.7)',
            }}
          >
            FORTALECER
          </span>
        </div>

        {/* Retrato — Ana, jaqueta vermelha, mão com X (emergindo das sombras) */}
        <div
          style={{
            position: 'absolute',
            top: 550,
            left: '50%',
            width: 800,
            height: 950,
            marginLeft: -400,
            zIndex: 2,
            opacity: portraitOp * (1 - exitRetrato),
            filter: `blur(${portraitBlur + exitRetrato * 20}px)`,
            transform: `translateY(${portraitY}px) translateX(${exitRetrato * -1200}px) skewX(${exitRetrato * -12}deg)`,
            boxShadow: '0 40px 100px rgba(0,0,0,0.9)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <AssetImage
            file={assets.retratoStopX}
            label="RETRATO — ANA NOVAIS (jaqueta vermelha, mão com X)"
            style={{ width: '100%', height: '100%', filter: 'saturate(1.08) contrast(1.08)' }}
            objectFit="cover"
          />
          {/* Glow vermelho pulsante — reforça o X já desenhado na foto (mão, ~29%/69% da caixa) */}
          <div
            style={{
              position: 'absolute',
              top: '69%',
              left: '29%',
              width: 260,
              height: 260,
              marginLeft: -130,
              marginTop: -130,
              opacity: 0.55 * xGlow,
              background: `radial-gradient(circle, rgba(230,57,70,0.9) 0%, transparent 70%)`,
              filter: 'blur(22px)',
              pointerEvents: 'none',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* "O COMBATE" — hero amarelo, cruza a foto (z superior) */}
        <div
          style={{
            position: 'absolute',
            top: 1000,
            left: 60,
            right: 60,
            textAlign: 'center',
            zIndex: 3,
            opacity: ci(frame, [60, 76], [0, 1]) * (1 - exitCombate),
            transform: `scale(${ci(combateSp, [0, 1], [1.3, 1]) * (1 + exitCombate * 22)})`,
            filter: `blur(${ci(frame - 60, [0, 20], [16, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 92,
              letterSpacing: -4,
              lineHeight: 0.95,
              color: COLOR_COMBATE.yellow,
              textShadow: `0 10px 40px rgba(0,0,0,0.85), 0 0 ${20 + comboGlow * 30}px rgba(252,227,0,${comboGlow})`,
            }}
          >
            O COMBATE
          </span>
        </div>

        {/* "À VIOLÊNCIA" — inferior, z superior */}
        <div
          style={{
            position: 'absolute',
            top: 1610,
            left: 40,
            right: 40,
            textAlign: 'center',
            zIndex: 3,
            opacity: ci(frame, [66, 82], [0, 1]) * (1 - exitVilencia),
            transform: `translateX(${ci(violenciaSp, [0, 1], [-60, 0])}px) translateX(${exitVilencia * -1200}px) scale(${1 - exitVilencia * 0.06})`,
            filter: `blur(${ci(frame - 66, [0, 16], [12, 0])}px) blur(${exitVilencia * 18}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 56,
              letterSpacing: -1,
              color: COLOR_COMBATE.textLight,
              textShadow: '0 6px 24px rgba(0,0,0,0.7)',
            }}
          >
            À VIOLÊNCIA
          </span>
        </div>
      </AbsoluteFill>

      {/* Flash amarelo — Z-DIVE cega a tela, entrega a bandeira pra Cena 2 */}
      <AbsoluteFill style={{ backgroundColor: COLOR_COMBATE.yellow, opacity: flashOp }} />
    </AbsoluteFill>
  );
};
