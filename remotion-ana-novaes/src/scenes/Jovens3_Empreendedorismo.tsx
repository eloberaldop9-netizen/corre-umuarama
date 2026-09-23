import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { DustParticles, NoiseOverlay } from '../lib/Background';
import { ED, edIn } from '../lib/editorial';
import { LineIcon } from '../lib/LineIcon';
import { JOVENS_SCENES, WORD } from '../jovens-timing';

// Cena 3 — O Empreendedorismo | frames locais 0–245
// "A proposta também incentiva o empreendedorismo jovem, com cursos, bolsas
// de capacitação, educação financeira, apoio à inovação e iniciativas"
// Composição centralizada na margem de segurança. Roxo escuro com grid
// tecnológico sutil em perspectiva, Z-push contínuo
// (grid 1 → 1.25). EMPREENDEDORISMO JOVEM em amarelo no topo; as cinco
// frentes flutuam como pills (roxo, borda fina amarela, texto branco) em
// profundidades diferentes, cada uma no frame da sua palavra, com ícone
// se desenhando. Terço inferior livre para a legenda. Saída: SUCÇÃO.
const S = JOVENS_SCENES.c3;
const L = (f: number) => f - S.from;
const EXIT = 225; // global 594: "iniciativas" já falada e lida; sucção suave de 20 frames

const PILLS = [
  { text: 'com cursos', icon: 'book', at: WORD.cursos, top: 830, x: -40, depth: 1 },
  { text: 'bolsas de capacitação', icon: 'bolsa', at: WORD.bolsas, top: 952, x: 34, depth: 0.94 },
  { text: 'educação financeira', icon: 'moeda', at: WORD.educacao, top: 1074, x: -34, depth: 1 },
  { text: 'apoio à inovação', icon: 'foguete', at: WORD.apoio, top: 1196, x: 40, depth: 0.94 },
  { text: 'iniciativas', icon: 'alvo', at: WORD.iniciativas - 5, top: 1318, x: 0, depth: 1 },
];

export const Jovens3_Empreendedorismo: React.FC = () => {
  const frame = useCurrentFrame();
  const open = ci(frame, [0, 14], [1, 0], Easing.out(Easing.cubic));
  const push = ci(frame, [0, S.duration], [1, 1.25]);
  const pushC = ci(frame, [0, S.duration], [1, 1.05]);
  const sp = ci(frame, [EXIT, EXIT + 20], [0, 1], Easing.inOut(Easing.cubic));
  const hero = ci(frame, [L(WORD.empreendedorismo) - 4, L(WORD.empreendedorismo) + 22], [0, 1], Easing.out(Easing.cubic));

  return (
    <AbsoluteFill style={{ backgroundColor: ED.void, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${push * (1 - sp)}) rotate(${-15 * sp}deg)`, filter: `blur(${30 * sp}px)` }}>
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(122,75,148,0.45), transparent 70%)' }} />
        {/* grid plano sutil */}
        <AbsoluteFill
          style={{
            opacity: 0.18,
            backgroundImage: 'linear-gradient(rgba(176,132,193,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(176,132,193,0.6) 1px, transparent 1px)',
            backgroundSize: '90px 90px', maskImage: 'radial-gradient(ellipse at 50% 45%, black 20%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 20%, transparent 75%)',
          }}
        />
        {/* piso em perspectiva */}
        <div style={{ position: 'absolute', left: -600, right: -600, bottom: -300, height: 1100, transform: 'perspective(900px) rotateX(64deg)', transformOrigin: '50% 100%' }}>
          <div
            style={{
              position: 'absolute', inset: 0, opacity: 0.35,
              backgroundImage: 'linear-gradient(rgba(252,227,0,0.35) 2px, transparent 2px), linear-gradient(90deg, rgba(176,132,193,0.7) 2px, transparent 2px)',
              backgroundSize: '120px 120px', backgroundPosition: `0 ${frame * 2}px`,
              maskImage: 'linear-gradient(to top, black 10%, transparent 90%)', WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 90%)',
            }}
          />
        </div>
        <NoiseOverlay opacity={0.07} />
        <DustParticles count={26} />
      </AbsoluteFill>

      <AbsoluteFill style={{ transform: `scale(${pushC * (1 - sp)}) rotate(${-15 * sp}deg)`, filter: `blur(${30 * sp}px)` }}>
        <div style={{ position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: ED.sans, fontWeight: 800, fontSize: 48, color: ED.lilac, ...edIn(frame, Math.max(3, L(WORD.proposta)), { trackFrom: -4, trackTo: 1 }) }}>
            A PROPOSTA TAMBÉM
          </div>
          <div style={{ marginTop: 6, fontFamily: ED.sans, fontWeight: 800, fontSize: 48, color: '#FFFFFF', ...edIn(frame, L(WORD.tambem) + 5, { trackFrom: -4, trackTo: 1 }) }}>
            INCENTIVA O
          </div>
          <div
            style={{
              marginTop: 30, fontFamily: ED.sans, fontWeight: 900, fontSize: 74, lineHeight: 1, color: ED.yellow, whiteSpace: 'nowrap',
              textShadow: '0 20px 60px rgba(0,0,0,0.7)', opacity: hero, filter: `blur(${20 * (1 - hero)}px)`, transform: `scale(${1.12 - 0.12 * hero})`, letterSpacing: -6 + 4 * hero,
            }}
          >
            EMPREENDEDORISMO
          </div>
          <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 156, lineHeight: 1, color: '#FFFFFF', textShadow: '0 20px 60px rgba(0,0,0,0.7)', ...edIn(frame, L(WORD.jovem), { y: 20, trackFrom: -10, trackTo: -5 }) }}>
            JOVEM
          </div>
        </div>

        {PILLS.map((p, i) => {
          const at = L(p.at);
          const k = ci(frame, [at - 2, at + 20], [0, 1], Easing.out(Easing.cubic));
          const bob = Math.sin((frame + i * 23) * 0.04) * 6;
          const drift = Math.cos((frame + i * 31) * 0.03) * 5;
          const far = p.depth < 1;
          return (
            <div key={p.text} style={{ position: 'absolute', top: p.top, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 20, padding: '16px 40px 16px 20px', borderRadius: 999,
                  background: 'rgba(58,18,84,0.92)', border: `2px solid ${ED.yellow}`, boxShadow: '0 24px 50px rgba(0,0,0,0.55)',
                  opacity: k * (far ? 0.9 : 1), filter: `blur(${14 * (1 - k) + (far ? 1 : 0)}px)`,
                  transform: `translate(${p.x + drift}px, ${bob + 70 * (1 - k)}px) scale(${p.depth * (0.85 + 0.15 * k)})`,
                }}
              >
                <div style={{ width: 70, height: 70, borderRadius: '50%', border: `2px solid rgba(252,227,0,0.5)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LineIcon name={p.icon} frame={frame} at={at + 2} size={46} color={ED.yellow} stroke={1.8} />
                </div>
                <span style={{ fontFamily: ED.sans, fontWeight: 800, fontSize: 52, letterSpacing: -1, color: '#FFFFFF', whiteSpace: 'nowrap' }}>{p.text}</span>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: ED.void, opacity: open }} />
    </AbsoluteFill>
  );
};
