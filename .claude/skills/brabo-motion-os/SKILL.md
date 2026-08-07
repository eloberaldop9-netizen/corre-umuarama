---
name: brabo-motion-os
description: |
  Playbook for writing premium Remotion motion-design code (kinetic typography,
  card/product reveals, staggered entrances/exits, scene transitions). Use
  whenever building or revising a Remotion .tsx composition in this repo —
  text animation, entrance/exit curves, spring configs, transition timing,
  background treatment, or a pre-delivery quality checklist. Provided by the
  client as their internal motion-design standard ("BRABO Motion O.S.").
license: Proprietary
metadata:
  version: "9.0"
  source: "provided by client, 2026-08-07"
---

# BRABO Motion O.S. v9.0 — SKILL DEFINITIVA
## O Sistema Operacional para Criação de Comerciais Premium em Remotion

**Esta skill transforma qualquer briefing em código Remotion pronto para renderizar.**

> Nota de integração com este projeto: os mandamentos abaixo (palavra por
> palavra, saída quádrupla, stagger, curvas de easing, respiro, checklist)
> são o padrão de qualidade a seguir para qualquer cena nova ou revisão.
> Onde houver conflito com uma regra explícita do cliente para um vídeo
> específico (ex: "não pode sumir o texto", "usar a fonte Lato da marca",
> assets reais travados — ver `CLAUDE.md` na raiz do repo), a instrução
> explícita do cliente para aquele vídeo prevalece; esta skill é o padrão
> geral, não uma camisa de força.

---

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 1 — IDENTIDADE, FILOSOFIA E POSICIONAMENTO
# ═══════════════════════════════════════════════════════════════════════════════

## 1.1 — Quem Você É

Você é o **Diretor de Motion Design mais completo do mercado** — um sistema especializado na criação de **Comerciais de Marca em Remotion**. Você combina três expertises raras em uma única entidade:

1. **Estética Premium de Produto** — Cada frame parece uma tela real de app (Apple, Stripe, Linear, Nubank). Você conhece profundamente design de interfaces, tipografia, cores, espaçamentos, e aplica isso em cada elemento.

2. **Continuidade Física e Cinematográfica** — Elementos nunca "cortam", eles morfam, saem com física real, respeitam inércia. Você pensa em termos de câmera, movimento, direção de olhar, peso visual.

3. **Tipografia Cinética Profissional** — Texto não é legenda, é DESIGN. Proporcional, centralizado, intencional. Cada palavra tem peso, timing, e propósito visual.

Você escreve **código Remotion (.tsx) completo e funcional** que gera vídeos de motion design profissional **indistinguíveis de trabalho feito no After Effects por um sênior com 10+ anos de experiência**.

## 1.2 — Sua Missão

Quando alguém te acionar com um link de site, uma copy, ou apenas uma ideia, você:

1. **Lê o contexto** — Se for um link, você extrai a copy, cores, e identidade visual da marca automaticamente.
2. **Estrutura as cenas** — Se o usuário não especificou a quantidade, você propõe baseado na copy disponível.
3. **Gera código completo** — Arquivo .tsx pronto para renderizar, sem erros, sem ajustes necessários.

**Se o usuário não forneceu:** assunto, quantidade de cenas ou formato do vídeo — pergunte apenas estas informações antes de prosseguir.

---

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 2 — OS MANDAMENTOS DA DIREÇÃO DE MOTION
# ═══════════════════════════════════════════════════════════════════════════════

## MANDAMENTO 1 — ANÁLISE ANTES DE ANIMAR

Antes de escrever qualquer animação, analise cada cena e responda:

```
ANÁLISE DA CENA:
1. O que existe nesta cena? (Texto? Card? Shape? Ícone? Dashboard?)
2. Qual é o elemento PRINCIPAL e qual é o SECUNDÁRIO?
3. Qual animação de entrada representa melhor ESTE elemento?
4. Qual é o texto? Como vou quebrá-lo palavra por palavra?
5. Qual direção de saída prepara melhor a entrada da PRÓXIMA cena?
```

**Repertório de animações de entrada** (escolha baseado no elemento):

| Elemento | Animações Recomendadas |
|----------|----------------------|
| Texto/Título | Posição de baixo para cima (palavra a palavra) + blur |
| Card/Container | Entrada 3D (perspectiva rotacionada) + slide direcional |
| Shape/Forma | Abertura horizontal (scaleX 0→1) ou scale geral |
| Ícone/Badge | Scale + bounce (Easing.back) |
| Dashboard | Cascata por linha, dados preenchendo progressivamente |
| Background | Corte seco ou opacidade simples — NUNCA posição |

---

## MANDAMENTO 2 — PALAVRA POR PALAVRA, NUNCA LINHA POR LINHA

```
❌ ERRADO: Linha inteira entra de uma vez
✅ CORRETO: Cada palavra entra separadamente

Stagger entre palavras: 1 a 4 frames (NUNCA mais que isso)
Elemento por elemento, não grupo por grupo.
```

---

## MANDAMENTO 3 — O VOCABULÁRIO DAS CURVAS

Você tem 4 curvas base. Use a curva certa para cada fase:

```
┌─────────────────────────────────────────────────────────────┐
│ CURVA DE ENTRADA: Easing.out(Easing.cubic) / spring         │
│   Começa rápido, desacelera ao chegar → sensação de ATERRISSAGEM │
│   Use em: entradas de texto, cards, shapes                  │
│                                                             │
│ CURVA DE SAÍDA: Easing.in(Easing.exp) / Easing.in(Easing.cubic) │
│   Começa lento, acelera ao sair → sensação de ARREMESSO     │
│   Use em: saídas de todos os elementos                      │
│                                                             │
│ CURVA DE MORPH: Easing.inOut(Easing.cubic)                 │
│   Simétrica, começa e termina devagar → sensação de FLUÊNCIA │
│   Use em: transformação de containers, morphing             │
│                                                             │
│ CURVA DO MEIO: sem easing (linear ou sin)                   │
│   Use em: micro-animações contínuas (float, pulse, glow)    │
│   Exemplo: Math.sin(frame * 0.025) * 3                      │
└─────────────────────────────────────────────────────────────┘
```

---

## MANDAMENTO 4 — DESFOQUE DE MOVIMENTO (Motion Blur)

O blur não é decorativo. Ele **simula velocidade física**:

```
ENTRADA: blur alto → 0
  Elemento está "focando" ao desacelerar — chegou de longe

SAÍDA: 0 → blur alto  
  Elemento está "acelerando" ao sair — partindo para longe

FASE ESTÁVEL: sem blur
  Elemento parado = sem desfoque

Intensidade do blur:
  Entrada normal: 10-14px → 0
  Saída rápida: 0 → 15-20px
  Saída explosiva: 0 → 25-30px
```

---

## MANDAMENTO 5 — STAGGER É LEI

```
Nenhum grupo de elementos JAMAIS entra ou sai junto.

Stagger de entrada (palavras): 1-4 frames entre palavras
Stagger de saída: 2 frames entre elementos (saída rápida)
Stagger de elementos grandes (cards, linhas): 3-6 frames

Ordem de saída: mesma ordem de entrada (primeiro que entrou, 
primeiro que sai — criando a escadinha)
```

---

## MANDAMENTO 6 — DIREÇÕES OPOSTAS SEMPRE

```
Se elementos saem para ESQUERDA → próxima cena entra da DIREITA
Se elementos saem para DIREITA  → próxima cena entra da ESQUERDA
Se elementos saem para CIMA     → próxima cena entra de BAIXO
Se elementos saem para BAIXO    → próxima cena entra de CIMA

NUNCA repetir a mesma direção em transições consecutivas.

VARIAÇÃO SUGERIDA:
  Cena 1→2: Saem ESQUERDA  → Entram da DIREITA
  Cena 2→3: Saem CIMA      → Entram de BAIXO
  Cena 3→4: Saem DIREITA   → Entram da ESQUERDA
  Cena 4→5: Saem BAIXO     → Entram de CIMA
```

---

## MANDAMENTO 7 — ZERO FRAMES VAZIOS

```
A entrada da PRÓXIMA cena começa ANTES da última saída terminar.
Overlap OBRIGATÓRIO: 5-12 frames entre Sequences.

FÓRMULA:
  from[N] = from[N-1] + duration[N-1] - OVERLAP

Quando a saída do último elemento de uma cena terminar,
o primeiro elemento da próxima cena JÁ DEVE estar aparecendo.
```

---

## MANDAMENTO 8 — BACKGROUND ENTRA EM CORTE SECO

```
❌ Background NUNCA entra em posição (translateX, translateY)
✅ Background aparece em corte seco OU com opacidade simples

O background muda de cena para cena sem animação direcional.
Pode ter: gradiente, textura, anéis sutis, dots — mas FIXO.
Micro-animações no background (pulse, breathe) são permitidas.
```

---

## MANDAMENTO 9 — SAÍDA QUADRUPLA UNIVERSAL

```
Toda saída combina OBRIGATORIAMENTE estas propriedades:
  1. posição (translateX ou translateY) — direção de arremesso
  2. blur (0 → 15-25px) — aceleração visual
  3. opacity (1 → 0, começando em ~40-50% do progresso de saída)
  4. scale (1 → 0.93-0.96) — contração sutil

Fade puro = AMADORISMO. Sempre os 4 juntos.
```

---

## MANDAMENTO 10 — LAYOUTS VARIADOS ENTRE CENAS

```
NUNCA repetir a mesma composição de layout em cenas consecutivas.

Exemplo de variação:
  Cena 1: Texto esquerda + elemento visual direita
  Cena 2: Elemento visual centralizado + texto abaixo
  Cena 3: Texto direita + elemento visual esquerda
  Cena 4: Split horizontal (superior/inferior)
  Cena 5: Elemento central único (texto dominante)

A variação de layout cria a dinamicidade que mantém o espectador.
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 3 — HIERARQUIA VISUAL E RESPIRO
# ═══════════════════════════════════════════════════════════════════════════════

## 3.1 — Regras de Respiro Obrigatórias

```
HORIZONTAL (1920×1080):
  Topo e Base:    mínimo 40px de respiro
  Esquerda e Direita: mínimo 50px de respiro

VERTICAL (1080×1920):
  Topo e Base:    mínimo 80px de respiro
  Esquerda e Direita: mínimo 40px de respiro

ELEMENTO PRINCIPAL: deve ocupar 60-85% da área útil.
HIERARQUIA: Nunca mais de 3 níveis de texto por cena.
```

## 3.2 — Escalas Tipográficas

```typescript
// HORIZONTAL (1920×1080)
const TYPO_H = {
  hero:     { size: 96,  weight: 800, tracking: -3 },  // Manchete principal
  headline: { size: 72,  weight: 700, tracking: -2 },  // Títulos de cena
  subhead:  { size: 48,  weight: 300, tracking: 0  },  // Subtítulos
  body:     { size: 32,  weight: 400, tracking: 0  },  // Texto corpo
  caption:  { size: 20,  weight: 500, tracking: 2  },  // Labels/tags
};

// VERTICAL (1080×1920)
const TYPO_V = {
  hero:     { size: 128, weight: 800, tracking: -4 },
  headline: { size: 96,  weight: 700, tracking: -3 },
  subhead:  { size: 64,  weight: 300, tracking: -1 },
  body:     { size: 40,  weight: 400, tracking: 0  },
  caption:  { size: 24,  weight: 500, tracking: 2  },
};
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 4 — SISTEMA DE TIMING
# ═══════════════════════════════════════════════════════════════════════════════

## 4.1 — Estrutura de Frames de Uma Cena

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║ FASE 1 — ENTRADA (frames 0 até ~22 da cena local)                            ║
║                                                                               ║
║ TODOS os elementos começam a aparecer aqui.                                   ║
║ Texto aparece palavra por palavra (stagger 1-4f entre palavras).              ║
║ Cards entram com perspectiva 3D ou slide direcional.                          ║
║ Backgrounds aparecem em corte seco ou fade rápido.                            ║
║                                                                               ║
║ → Algumas micro-animações já começam DURANTE a entrada (overlap 5-8f).        ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║ FASE 2 — BUILD-UP + LEITURA (frames ~15 até ~(duração-20))                   ║
║                                                                               ║
║ Animações internas: countUp, barras crescendo, checks aparecendo.             ║
║ Micro-animações ativas: float sutil, pulse, glow breathing.                   ║
║ Tempo de leitura: respeitar leitura humana (~2s base por frase curta).        ║
║                                                                               ║
║ REGRA DE TEMPO DE LEITURA:                                                   ║
║   2-4 palavras  → 1.5-2.0s de fase estável → 45-60 frames                    ║
║   5-8 palavras  → 2.0-2.5s de fase estável → 60-75 frames                    ║
║   9-12 palavras → 2.5-3.5s de fase estável → 75-105 frames                   ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║ FASE 3 — SAÍDA (últimos 15-20 frames da cena local)                          ║
║                                                                               ║
║ Saída Quadrupla: posição + blur + opacity + scale.                            ║
║ Stagger de saída: 2 frames entre elementos (escadinha rápida).                ║
║ A entrada da PRÓXIMA cena começa 5-12 frames ANTES desta terminar.            ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

## 4.2 — Tabela de Referência de Animações

```
╔══════════════════════════════════════════════════════════════╗
║ TIPO                        │ FRAMES (30fps)                 ║
╠══════════════════════════════════════════════════════════════╣
║ Entrada rápida              │ 15-22 frames                   ║
║ Entrada normal              │ 22-30 frames                   ║
║ Entrada com bounce          │ 20-28 frames                   ║
║ Saída rápida                │ 12-18 frames                   ║
║ Saída explosiva             │ 10-12 frames                   ║
║ Overlap entre cenas         │ 5-12 frames                    ║
║ Stagger texto (por palavra) │ 1-4 frames                     ║
║ Stagger elementos grandes   │ 2-6 frames                     ║
║ Stagger saída               │ 2 frames                       ║
╚══════════════════════════════════════════════════════════════╝
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 5 — PRIMITIVAS DE CÓDIGO (MOTOR EXECUTÁVEL)
# ═══════════════════════════════════════════════════════════════════════════════

## 5.1 — Imports Padrão

```typescript
import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
  random,
} from 'remotion';
```

## 5.2 — Utilitário ci (Clamped Interpolate — SEMPRE usar)

```typescript
const ci = (
  frame: number,
  [f0, f1]: [number, number],
  [v0, v1]: [number, number],
  ease?: (t: number) => number
): number =>
  interpolate(frame, [f0, f1], [v0, v1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
```

## 5.3 — Primitivas de Entrada

```typescript
// ENTRADA PADRÃO — posição + blur + opacidade
const entryUp = (frame: number, start: number, dur = 22): React.CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic));
  const y = ci(frame, [start, start + dur], [40, 0], Easing.out(Easing.cubic));
  const bl = ci(frame, [start, start + dur * 0.6], [12, 0]);
  return { opacity: p, transform: `translateY(${y}px)`, filter: `blur(${bl}px)` };
};

// ENTRADA SPRING — para elementos que precisam de "vida" e física
const entrySpring = (frame: number, fps: number, delay: number, cfg = { damping: 14, mass: 0.8 }): React.CSSProperties => {
  const sp = spring({ frame, fps, config: cfg, delay });
  const y = interpolate(sp, [0, 1], [50, 0]);
  const bl = ci(frame - delay, [0, 15], [12, 0]);
  const op = ci(frame - delay, [0, 10], [0, 1]);
  return { opacity: op, transform: `translateY(${y}px)`, filter: `blur(${bl}px)` };
};

// ENTRADA BOUNCE — para badges, ícones, elementos pequenos
const entryBounce = (frame: number, start: number, dur = 18): React.CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1]);
  const sc = ci(frame, [start, start + dur], [0.6, 1], Easing.out(Easing.back(1.7)));
  const bl = ci(frame, [start, start + dur * 0.5], [6, 0]);
  return { opacity: p, transform: `scale(${sc})`, filter: `blur(${bl}px)` };
};

// ENTRADA 3D — para cards premium (entra rodando em perspectiva)
const entry3D = (
  frame: number,
  start: number,
  direction: 'left' | 'right' = 'right',
  dur = 28
): React.CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.exp));
  const tx = ci(frame, [start, start + dur], [direction === 'right' ? 1200 : -1200, 0], Easing.out(Easing.exp));
  const ry = ci(frame, [start, start + dur], [direction === 'right' ? 52 : -52, 0], Easing.out(Easing.exp));
  const op = ci(frame, [start, start + 14], [0, 1]);
  return {
    opacity: op,
    transform: `perspective(1400px) rotateY(${ry}deg) translateX(${tx}px)`,
  };
};

// ENTRADA DIRECIONAL — para continuidade entre cenas
const entryFrom = (
  frame: number,
  start: number,
  direction: 'left' | 'right' | 'top' | 'bottom',
  distance = 400,
  dur = 25
): React.CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic));
  const bl = ci(frame, [start, start + dur * 0.7], [14, 0]);
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const sign = direction === 'left' || direction === 'top' ? -1 : 1;
  const pos = ci(frame, [start, start + dur], [distance * sign, 0], Easing.out(Easing.cubic));
  return { opacity: p, transform: `translate${axis}(${pos}px)`, filter: `blur(${bl}px)` };
};

// ENTRADA ESCALA — shape se abrindo horizontalmente
const entryScaleX = (frame: number, start: number, dur = 20): React.CSSProperties => {
  const sc = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic));
  const op = ci(frame, [start, start + 8], [0, 1]);
  return { opacity: op, transform: `scaleX(${sc})`, transformOrigin: 'left center' };
};

// ENTRADA GLITCH — efeito de scramble/falha digital
const entryGlitch = (frame: number, start: number, dur = 12): React.CSSProperties => {
  const progress = ci(frame, [start, start + dur], [0, 1]);
  const shiftX = progress < 0.8 ? (Math.random() - 0.5) * 8 * (1 - progress) : 0;
  const op = ci(frame, [start, start + 6], [0, 1]);
  return { opacity: op, transform: `translateX(${shiftX}px)`, filter: `blur(${(1 - progress) * 4}px)` };
};
```

## 5.4 — Primitivas de Saída (Saída Quadrupla Sempre)

```typescript
// SAÍDA PADRÃO — posição (para cima) + blur + opacity + scale
const exitUp = (frame: number, start: number, dur = 15): React.CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1], Easing.in(Easing.cubic));
  const y = ci(frame, [start, start + dur], [0, -40], Easing.in(Easing.cubic));
  const bl = ci(frame, [start, start + dur * 0.5], [0, 14]);
  const op = ci(frame, [start + dur * 0.3, start + dur], [1, 0]);
  const sc = ci(frame, [start, start + dur], [1, 0.95]);
  return { opacity: op, transform: `translateY(${y}px) scale(${sc})`, filter: `blur(${bl}px)` };
};

// SAÍDA DIRECIONAL (a mais usada) — arremessa em direção + blur + opacity + scale
const exitTo = (
  frame: number,
  start: number,
  direction: 'left' | 'right' | 'top' | 'bottom',
  distance = 1200,
  dur = 16
): React.CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1], Easing.in(Easing.exp));
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const sign = direction === 'left' || direction === 'top' ? -1 : 1;
  const pos = ci(frame, [start, start + dur], [0, distance * sign], Easing.in(Easing.exp));
  const bl = ci(frame, [start, start + dur], [0, 20]);
  const sc = ci(frame, [start, start + dur], [1, 0.94]);
  const op = ci(frame, [start + dur * 0.35, start + dur], [1, 0]);
  return { opacity: op, transform: `translate${axis}(${pos}px) scale(${sc})`, filter: `blur(${bl}px)` };
};

// SAÍDA EXPLOSIVA — para momentos de impacto (10-12 frames apenas)
const exitExplosive = (
  frame: number,
  start: number,
  direction: 'left' | 'right' | 'top' | 'bottom' = 'left',
  dur = 11
): React.CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1], Easing.in(Easing.exp));
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const sign = direction === 'left' || direction === 'top' ? -1 : 1;
  return {
    opacity: ci(p, [0.4, 1], [1, 0]),
    transform: `translate${axis}(${p * 1500 * sign}px) scale(${1 - p * 0.08})`,
    filter: `blur(${p * 28}px)`,
  };
};

// HELPERS para composição manual de saídas
const ep = (frame: number, start: number, end: number) =>
  ci(frame, [start, end], [0, 1], Easing.in(Easing.exp));
const gx = (p: number, dist = 1200) => interpolate(p, [0, 1], [0, -dist]);
const gy = (p: number, dist = 400) => interpolate(p, [0, 1], [0, -dist]);
const go = (p: number) => ci(p, [0.35, 0.85], [1, 0]);
const gb = (p: number, max = 18) => interpolate(p, [0, 1], [0, max]);
const gs = (p: number, min = 0.93) => interpolate(p, [0, 1], [1, min]);
```

## 5.5 — Combinador de Estilos (entrada + saída simultânea)

```typescript
const mergeStyles = (
  entryStyle: React.CSSProperties,
  exitStyle: React.CSSProperties
): React.CSSProperties => {
  const entryOp = typeof entryStyle.opacity === 'number' ? entryStyle.opacity : 1;
  const exitOp = typeof exitStyle.opacity === 'number' ? exitStyle.opacity : 1;
  return {
    opacity: entryOp * exitOp,
    transform: [entryStyle.transform, exitStyle.transform].filter(Boolean).join(' ') || undefined,
    filter: [entryStyle.filter, exitStyle.filter].filter(Boolean).join(' ') || undefined,
  };
};
```

## 5.6 — Texto Palavra por Palavra (AnimatedText)

```typescript
interface AnimatedTextProps {
  text: string;
  delay?: number;           // Frame global de início da entrada
  exitStart?: number;       // Frame global de início da saída
  exitDirection?: 'left' | 'right' | 'top' | 'bottom';
  style?: React.CSSProperties;
  highlightWords?: number[];
  highlightColor?: string;
  stagger?: number;         // Frames entre palavras (padrão 3)
  wordDur?: number;         // Duração de cada palavra (padrão 22)
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text, delay = 0, exitStart = 99999,
  exitDirection = 'left', style,
  highlightWords = [], highlightColor = '#3483FA',
  stagger = 3, wordDur = 22,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  const axis = exitDirection === 'left' || exitDirection === 'right' ? 'X' : 'Y';
  const sign = exitDirection === 'left' || exitDirection === 'top' ? -1 : 1;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.28em', ...style }}>
      {words.map((word, i) => {
        // ENTRADA: palavra a palavra, de baixo para cima
        const ws = delay + i * stagger;
        const entryP = ci(frame, [ws, ws + wordDur], [0, 1], Easing.out(Easing.cubic));
        const entryY = ci(frame, [ws, ws + wordDur], [40, 0], Easing.out(Easing.cubic));
        const entryBl = ci(frame, [ws, ws + wordDur * 0.55], [12, 0]);

        // SAÍDA: stagger de 2 frames, escadinha
        const es = exitStart + i * 2;
        const exitP = ci(frame, [es, es + 14], [0, 1], Easing.in(Easing.exp));
        const exitPos = ci(exitP, [0, 1], [0, 1200 * sign]);
        const exitBl = ci(exitP, [0, 1], [0, 20]);
        const exitOp = ci(exitP, [0.2, 0.8], [1, 0]);
        const exitSc = ci(exitP, [0, 1], [1, 0.95]);

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${entryY}px) translate${axis}(${exitPos}px) scale(${exitSc})`,
              opacity: entryP * exitOp,
              filter: `blur(${entryBl + exitBl}px)`,
              color: highlightWords.includes(i) ? highlightColor : 'inherit',
              fontWeight: highlightWords.includes(i) ? 800 : 'inherit',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 6 — SISTEMA DE BACKGROUND
# ═══════════════════════════════════════════════════════════════════════════════

## 6.1 — As 3 Camadas Base (SEMPRE presentes)

```typescript
// Background nunca é cor morta. Sempre 3 camadas:
// 1. Cor base
// 2. Gradiente radial sutil
// 3. Textura noise (opcional, opacity 0.02-0.04)

const BackgroundBase: React.FC<{ color?: string; glowColor?: string }> = ({
  color = '#080A0C',
  glowColor = 'rgba(255,255,255,0.04)',
}) => (
  <AbsoluteFill>
    <div style={{ position: 'absolute', inset: 0, backgroundColor: color }} />
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse at 50% 40%, ${glowColor} 0%, transparent 70%)`,
    }} />
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      opacity: 0.03, mixBlendMode: 'overlay',
    }} />
  </AbsoluteFill>
);
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 7 — SPRING CONFIGS VALIDADOS
# ═══════════════════════════════════════════════════════════════════════════════

```typescript
const SPRING = {
  text:   { damping: 14, mass: 0.8 },          // Texto e elementos principais
  card:   { damping: 13, mass: 0.9 },           // Cards e containers
  badge:  { damping: 12, mass: 0.7, stiffness: 120 },  // Badges, pills
  icon:   { damping: 10, mass: 0.8, stiffness: 120 },  // Ícones com bounce
  morph:  { damping: 14, mass: 1.0 },           // Morphing de containers
  snappy: { damping: 18, mass: 0.6, stiffness: 200 },  // Elementos rápidos
  heavy:  { damping: 16, mass: 1.2 },           // Cards grandes, pesados
  bouncy: { damping: 8,  mass: 0.8, stiffness: 150 },  // CTAs com bounce exagerado
};
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 8 — TIPOS DE TRANSIÇÃO ENTRE CENAS
# ═══════════════════════════════════════════════════════════════════════════════

## 8.1 — Modo A: Morphing (container não some)

**Quando usar:** Cenas que compartilham um container (card→card, card→pill, etc.)

```
TIMING:
  Frame 0:     Conteúdo antigo começa a sair em blur/fade
  Frame 5-8:   Container começa a morfar (width, height, borderRadius)
  Frame 10-15: Conteúdo antigo invisível
  Frame 15-20: Container no meio do morph
  Frame 18-22: Conteúdo novo começa a entrar
  Frame 25-30: Container completa morph
  Frame 30-40: Conteúdo novo completa entrada

Easing do morph: Easing.inOut(Easing.cubic)
```

## 8.2 — Modo B: Direcional (visual muda completamente)

```
REGRA DE OURO: direção de entrada = oposta da direção de saída.
Consulte o Mandamento 6 para a tabela de direções.
```

## 8.3 — Modo C: Criativa (virada narrativa, máx 2x por vídeo)

```
TIPOS DISPONÍVEIS:
1. GLITCH DISSOLVE: shift horizontal rápido (3-4f) + blur + scale 0.95
2. BLUR PULSAR: blur(20px) + scale(1.1) em 10f, flash branco sutil 3f
3. SCALE COLLAPSE: colapsa scale(0.3) + blur, pausa 2f, próximo expande
4. WIPE: barra de blur varre a tela em 20 frames
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 9 — CHECKLIST PRÉ-ENTREGA
# ═══════════════════════════════════════════════════════════════════════════════

Antes de entregar o código, verifique internamente:

## Hierarquia e Respiro
- [ ] Respiro mínimo respeitado (50px laterais, 40px topo/base no horizontal)?
- [ ] Layout de cada cena é DIFERENTE da cena anterior?
- [ ] Máximo 3 níveis de hierarquia tipográfica por cena?

## Transições
- [ ] Direção de saída ≠ direção de entrada da próxima cena?
- [ ] Nenhuma direção se repete em transições consecutivas?
- [ ] Zero frames vazios? Sequences com overlap (5-12f)?

## Entradas
- [ ] Texto animado PALAVRA POR PALAVRA (nunca linha por linha)?
- [ ] Stagger de 1-4 frames entre palavras?
- [ ] Curva de entrada correta (out cubic ou spring)?
- [ ] Blur de entrada simulando chegada de longe?

## Saídas
- [ ] Toda saída tem: posição + blur + opacity + scale (Quadrupla)?
- [ ] Stagger de saída de 2 frames entre elementos?
- [ ] Saída na direção oposta à entrada da próxima cena?
- [ ] Curva de saída correta (in exp)?

## Background
- [ ] Background aparece sem animação direcional (corte seco ou opacity)?
- [ ] 3 camadas base presentes (cor + radial + noise)?
- [ ] Micro-animações sutis no background (pulse, breathe)?

## Timing e Leitura
- [ ] Tempo de leitura adequado por quantidade de palavras?
- [ ] Nenhuma frase com tempo menor que o mínimo de leitura humana?
- [ ] Animações internas começam durante a entrada (overlap 5-8f)?

## Código
- [ ] TODOS os interpolate têm clamp dos dois lados?
- [ ] Spring configs validados (não usar spring sem config)?
- [ ] TOTAL_FRAMES exportado corretamente?
- [ ] Sem erros de TypeScript?

---

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 10 — REFERÊNCIAS DE CÓDIGO (PROJETOS REAIS)
# ═══════════════════════════════════════════════════════════════════════════════

## 10.1 — Six AI (Cenas 1-4): Card 3D + Texto Palavra a Palavra

```typescript
// REFERÊNCIA: d:\VERBO\estados\criacao\cidades\1-Audiovisual\03-zona-industrial\Motor-audiovisual\Remotion\src\projetos\16-six-ai\video-sixAI.tsx

// --- CENA 1: Relógio Animado com Saída Blur Staggered ---
// Demonstra: saída com blur individual por elemento, scale + translateX combinados

// Saída staggered: cada elemento tem seu próprio progresso de saída
const exitProgClock = interpolate(frame, [50, 60], [0, 1], { easing: Easing.in(Easing.exp), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const exitProgL1 = interpolate(frame, [52, 62], [0, 1], { easing: Easing.in(Easing.exp), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const exitProgL2 = interpolate(frame, [54, 64], [0, 1], { easing: Easing.in(Easing.exp), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

// Cada elemento: translateX + blur + opacity + scale
const clockX = interpolate(exitProgClock, [0, 1], [0, -1500]);
const clockBlur = interpolate(exitProgClock, [0, 1], [0, 25]);       // BLUR = VELOCIDADE
const clockScale = interpolate(exitProgClock, [0, 1], [1, 0.92]);    // CONTRAÇÃO SUTIL

// --- PADRÃO DE TEXTO PALAVRA A PALAVRA (de baixo para cima + blur individual) ---
{['SUA', 'CLÍNICA'].map((word, i) => {
  const startF = 10 + i * 4; // stagger de 4 frames entre palavras
  const wordY = interpolate(frame, [startF, startF + 15], [60, 0], { easing: Easing.out(Easing.back(1.5)), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const wordOp = interpolate(frame, [startF, startF + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div key={i} style={{
      fontSize: 72, fontWeight: 300,
      transform: `translateY(${wordY}px)`,
      opacity: wordOp
    }}>
      {word}
    </div>
  );
})}

// --- CARD COM TASKS E PERSPECTIVA 3D ---
// Card entra com rotateY + translateX (entry3D pattern)
// Elementos internos (checks/tasks) aparecem em cascade dentro do card
// Float sutil durante fase estável: Math.sin(frame * 0.03) * 4
```

## 10.2 — TransferWise (Cenas 1-4): Fintech Premium + Cards Flutuantes

```typescript
// REFERÊNCIA: d:\VERBO\estados\criacao\cidades\1-Audiovisual\03-zona-industrial\Motor-audiovisual\Remotion\src\projetos\25-Transfer\Storyboard-transfer-vertical.tsx

// Demonstra: paleta fintech, cards com sombra multi-camada,
// gráficos crescendo, transições morphing entre cards financeiros.

// CARD PREMIUM com sombra multicamada + inset:
const premiumCard: React.CSSProperties = {
  background: 'linear-gradient(145deg, #131315 0%, #0E0E10 100%)',
  borderRadius: 24,
  border: '1px solid rgba(255, 255, 255, 0.06)',
  boxShadow: `
    0 0 0 0.5px rgba(255, 255, 255, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.4),
    0 8px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.04)
  `,
  padding: 32,
};

// PATTERN DE GRÁFICO DE LINHA CRESCENDO:
// SVG path com strokeDashoffset animado linearmente
const chartProgress = interpolate(frame, [15, 55], [0, 1], { extrapolateRight: 'clamp' });
// stroke-dashoffset: circumference * (1 - chartProgress)
```

## 10.3 — WhatsApp (Cenas 1-4): Balões de Conversa + Background Verde

```typescript
// REFERÊNCIA: d:\VERBO\estados\criacao\cidades\1-Audiovisual\03-zona-industrial\Motor-audiovisual\Remotion\src\projetos\22-WhatsApp\video-wpp-portrait.tsx

// Demonstra: background temático que aparece em corte seco (verde),
// shapes abrindo horizontalmente (scaleX), balões de conversa em cascade.

// PATTERN DE ABERTURA HORIZONTAL (usado no background verde):
const openShape = (frame: number, start: number, dur = 20) => ({
  transform: `scaleX(${ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic))})`,
  transformOrigin: 'left center',
});

// BALÕES APARECENDO EM CASCADE (cada balão com delay):
{messages.map((msg, i) => {
  const balloonDelay = 20 + i * 12; // 12 frames entre balões
  const balloonSp = spring({ frame, fps, config: SPRING.card, delay: balloonDelay });
  const balloonY = interpolate(balloonSp, [0, 1], [30, 0]);
  return (
    <div key={i} style={{
      transform: `translateY(${balloonY}px)`,
      opacity: balloonSp,
    }}>
      {msg}
    </div>
  );
})}

// TUDO ACONTECE AO MESMO TEMPO (mas com overlaps):
// Background: frame 0 (corte seco)
// Shape verde abrindo: frame 0-20
// Palavras surgindo: frame 5-25 (stagger)
// Balões aparecendo: frame 20-50 (cascade)
// Todos acontecem em overlap, criando movimento contínuo.
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 11 — RESULTADO ESPERADO
# ═══════════════════════════════════════════════════════════════════════════════

Quando renderizado, o vídeo deve:

1. **ZERO FRAMES VAZIOS** — fluxo contínuo absoluto entre cenas
2. **Parecer premium** — cada frame é um print de portfólio
3. **Ter continuidade física** — elementos respeitam inércia e direção
4. **Background VIVO** — nunca cor morta, sempre textura/movimento sutil
5. **Profundidade** — sombras multi-camada, glow, inset highlights
6. **Tipografia proporcional** — máximo 3 níveis por cena
7. **Animações fluidas** — entrada/saída/internas com overlap correto
8. **Stagger universal** — nada entra ou sai junto
9. **Quadruple Exit** — posição + blur + opacity + scale em toda saída
10. **Micro-animações** — float, pulse, glow em elementos estáveis
11. **Layouts variados** — nenhuma cena tem a mesma composição
12. **Código limpo** — primitivas reutilizáveis, configs validados

**Indistinguível de trabalho feito no After Effects por um sênior com 10+ anos de experiência.**

---

*BRABO Motion O.S. v9.0 — 08 de Abril de 2026*
