import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn } from '../lib/editorial';
import { EDUCACAO_SCENES, PAUSES, WORD } from '../educacao-timing';
import type { EducacaoAssets } from '../educacao-timing';

// Cena 3 — O Ecossistema Inclusivo (A Grande Rolagem) | frames locais 0–663
// "A proposta também prevê escolas com melhor infraestrutura, tecnologia e
// inovação, além de medidas para melhorar as condições de ensino em sala de
// aula e também fortalecer a presença de psicólogos, assistentes sociais e
// equipes multiprofissionais nas escolas, ampliando o suporte aos estudantes,
// inclusive crianças com autismo, TDAH e outras necessidades específicas."
// A sucção explode no papel off-white com grid fino. Um contêiner alto sobe
// sem parar (Crane Up contínuo): seis "telas" empilhadas, cada uma
// centralizada quando a sua frase é falada. Dentro de cada tela a câmera
// deriva devagar; nas pausas reais da fala ela sobe para a próxima.
//  1 infraestrutura (prédio escolar) · 2 tecnologia e inovação (robótica) ·
//  3 condições de ensino em sala de aula (professora) · 4 psicólogos,
//  assistentes sociais e equipes multiprofissionais (psicóloga com criança) ·
//  5 suporte aos estudantes (apoio em sala) · 6 autismo, TDAH e outras
//  necessidades específicas.
// Saída: DISSOLVE SUJO (blur 0→40, brilho → 0) para o roxo do selo.
const S = EDUCACAO_SCENES.c3;
const L = (f: number) => f - S.from;
const SH = 1920; // altura de cada "tela" no contêiner
const TRANS = 16; // frames de subida entre telas
const DRIFT = 30; // deriva dentro da tela (±px)
const CUTS = [PAUSES.infra, PAUSES.tecnologia, PAUSES.sala, PAUSES.escolas3, PAUSES.estudantes].map(L);
const EXIT = L(1222); // "específicas." termina em 1216

/** Posição Y da câmera: deriva lenta dentro da tela, subida suave nas pausas. */
const cameraY = (f: number) => {
  const starts = [0, ...CUTS.map((c) => c + TRANS)];
  const ends = [...CUTS, S.duration];
  for (let k = 0; k < starts.length; k++) {
    if (k > 0 && f < starts[k]) {
      // subida da tela k-1 para k
      return ci(f, [CUTS[k - 1], starts[k]], [(k - 1) * SH + DRIFT, k * SH - DRIFT], Easing.inOut(Easing.cubic));
    }
    if (f < ends[k] || k === starts.length - 1) {
      return k * SH + ci(f, [starts[k], ends[k]], [-DRIFT, DRIFT]);
    }
  }
  return 0;
};

export const Educacao3_Ecossistema: React.FC<{ assets: EducacaoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const light = ci(frame, [0, 14], [1, 0], Easing.out(Easing.cubic));
  const cam = cameraY(frame);
  const d = ci(frame, [EXIT, S.duration], [0, 1], Easing.in(Easing.cubic));

  const line = (text: string, at: number, size: number, color: string, top: number, k: number) => (
    <div style={{ position: 'absolute', top: k * SH + top, left: 0, right: 0, textAlign: 'center' }}>
      <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap', ...edIn(frame, Math.max(3, L(at)), { dur: 22, y: 16, blur: 15, trackFrom: -5, trackTo: -2 }) }}>
        {text}
      </span>
    </div>
  );
  const block = (text: string, at: number, size: number, top: number, k: number, kind: 'yellow' | 'void' | 'yellowBorder' = 'yellow', rot = -1.5) => {
    const p = ci(frame, [Math.max(3, L(at)) - 4, Math.max(3, L(at)) + 18], [0, 1], Easing.out(Easing.cubic));
    const bg = kind === 'void' ? ED.void : ED.yellow;
    const fg = kind === 'void' ? ED.yellow : ED.void;
    return (
      <div style={{ position: 'absolute', top: k * SH + top, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            background: bg, border: kind === 'yellowBorder' ? `7px solid ${ED.void}` : 'none', padding: '14px 40px 8px', boxShadow: '0 26px 54px rgba(45,22,67,0.35)',
            opacity: p, filter: `blur(${14 * (1 - p)}px)`, transform: `translateY(${30 * (1 - p)}px) rotate(${rot}deg) scale(${1.06 - 0.06 * p})`,
          }}
        >
          <span style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: -3, color: fg, whiteSpace: 'nowrap' }}>{text}</span>
        </div>
      </div>
    );
  };
  const photo = (file: string, at: number, w: number, h: number, top: number, k: number, pos: string, rot: number, zoom = 1) => {
    const p = ci(frame, [Math.max(0, L(at)) - 4, Math.max(0, L(at)) + 22], [0, 1], Easing.out(Easing.cubic));
    return (
      <div style={{ position: 'absolute', top: k * SH + top, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#FFFFFF', padding: 14, boxShadow: '0 34px 70px rgba(45,22,67,0.32)', opacity: p, filter: `blur(${15 * (1 - p)}px)`, transform: `translateY(${50 * (1 - p)}px) rotate(${rot}deg)` }}>
          <div style={{ width: w, height: h, overflow: 'hidden' }}>
            <Img src={staticFile(`assets/${file}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'contrast(1.06) saturate(0.92)', transform: `scale(${zoom})`, transformOrigin: pos }} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: ED.paper, overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: `blur(${40 * d}px) brightness(${1 - d})` }}>
        <AbsoluteFill style={{ transform: `translateY(${-cam}px)` }}>
          <div
            style={{
              position: 'absolute', top: -SH, left: 0, width: 1080, height: SH * 8,
              backgroundImage: 'linear-gradient(rgba(45,22,67,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(45,22,67,0.05) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Tela 1 — infraestrutura */}
          {line('A PROPOSTA TAMBÉM PREVÊ', WORD.proposta, 50, ED.brandCore, 380, 0)}
          {line('ESCOLAS COM MELHOR', WORD.escolas2, 66, ED.void, 460, 0)}
          {block('INFRAESTRUTURA', WORD.infraestrutura, 82, 552, 0, 'yellowBorder')}
          {photo(assets.escola, WORD.escolas2, 880, 520, 730, 0, '50% 60%', 1.2)}

          {/* Tela 2 — tecnologia e inovação */}
          {photo(assets.robotica, WORD.tecnologia - 8, 880, 540, 390, 1, '50% 90%', -1.2, 1.35)}
          {line('TECNOLOGIA', WORD.tecnologia, 112, ED.void, 1010, 1)}
          {block('E INOVAÇÃO', WORD.inovacao, 90, 1140, 1, 'yellow', 1.5)}

          {/* Tela 3 — condições de ensino em sala de aula */}
          {line('MEDIDAS PARA MELHORAR', WORD.medidas, 56, ED.brandCore, 360, 2)}
          {line('AS CONDIÇÕES', WORD.condicoes2, 88, ED.void, 436, 2)}
          {line('DE ENSINO', WORD.ensino, 88, ED.void, 530, 2)}
          {block('EM SALA DE AULA', WORD.sala, 74, 640, 2, 'void')}
          {photo(assets.aula, WORD.sala - 6, 880, 500, 800, 2, '60% 40%', 1)}

          {/* Tela 4 — psicólogos, assistentes sociais, equipes multiprofissionais */}
          {line('E TAMBÉM FORTALECER', WORD.tambem, 48, ED.brandCore, 270, 3)}
          {line('A PRESENÇA DE', WORD.presenca, 48, ED.brandCore, 326, 3)}
          {block('PSICÓLOGOS,', WORD.psicologos, 96, 400, 3, 'void')}
          {line('ASSISTENTES', WORD.assistentes, 96, ED.void, 560, 3)}
          {line('SOCIAIS', WORD.sociais, 96, ED.void, 656, 3)}
          {line('E EQUIPES', WORD.equipes, 48, ED.brandCore, 784, 3)}
          {block('MULTIPROFISSIONAIS', WORD.multiprofissionais, 58, 842, 3, 'yellow', 1.2)}
          {line('NAS ESCOLAS,', WORD.escolas3, 48, ED.brandCore, 940, 3)}
          {photo(assets.psicologa, WORD.psicologos, 800, 400, 1024, 3, '50% 45%', -1)}

          {/* Tela 5 — suporte aos estudantes */}
          {line('AMPLIANDO O SUPORTE', WORD.ampliando, 62, ED.void, 400, 4)}
          {block('AOS ESTUDANTES,', WORD.estudantes, 70, 484, 4, 'yellow')}
          {photo(assets.inclusao, WORD.ampliando, 880, 580, 650, 4, '55% 40%', 1)}

          {/* Tela 6 — inclusão */}
          {line('INCLUSIVE', WORD.inclusive, 54, ED.brandCore, 430, 5)}
          <div style={{ position: 'absolute', top: 5 * SH + 510, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            {(() => {
              const p = ci(frame, [L(WORD.criancas) - 4, L(WORD.criancas) + 18], [0, 1], Easing.out(Easing.cubic));
              return (
                <div style={{ background: ED.void, padding: '26px 50px 20px', textAlign: 'center', boxShadow: '0 36px 70px rgba(45,22,67,0.45)', opacity: p, filter: `blur(${14 * (1 - p)}px)`, transform: `translateY(${30 * (1 - p)}px) rotate(-1.5deg)` }}>
                  <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 70, lineHeight: 1, color: '#FFFFFF', whiteSpace: 'nowrap' }}>CRIANÇAS COM</div>
                  <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 124, lineHeight: 1, color: ED.yellow, whiteSpace: 'nowrap', ...edIn(frame, L(WORD.autismo) - 2, { dur: 20, y: 12, blur: 15, trackFrom: -8, trackTo: -4 }) }}>AUTISMO,</div>
                </div>
              );
            })()}
          </div>
          {line('TDAH', WORD.tdah, 220, ED.void, 800, 5)}
          {line('E OUTRAS NECESSIDADES', WORD.outras, 58, ED.void, 1060, 5)}
          {block('ESPECÍFICAS.', WORD.especificas - 4, 88, 1140, 5, 'yellowBorder', 1.5)}
        </AbsoluteFill>
        <NoiseOverlay opacity={0.035} />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: ED.void, opacity: ci(d, [0.5, 1], [0, 1]) }} />
      <AbsoluteFill style={{ backgroundColor: '#FFFFFF', opacity: light }} />
    </AbsoluteFill>
  );
};
