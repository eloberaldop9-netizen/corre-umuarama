# ACEU Nipon Fest 2026 — Teaser "Vem Aí" (Remotion)

Peça vertical (1080×1920, 30fps, ~21s) para Reels/Stories, anunciando o
ACEU Nipon Fest 2026 (20 e 21 de novembro, Umuarama) sob o tema **Ikigai**.

## Rodar localmente

```bash
cd remotion
npm install
npm start        # abre o Remotion Studio (preview interativo)
npm run build     # renderiza out/nipon-fest-teaser.mp4
npm run still     # renderiza um frame único (out/frame.png)
```

## Editar textos e marca

- `src/config/texts.ts` — todo o texto do vídeo, cena a cena.
- `src/config/brand.ts` — paleta oficial, tipografia, duração de cada cena
  e overlap entre elas (`SCENE_DURATIONS`, `SCENE_OVERLAP`).
- `src/lib/fontData.ts` — fontes da marca (Montserrat, Inter, Noto Sans JP)
  embutidas em base64 (TTF) para que o render headless não dependa de rede.
  Gerado a partir do Google Fonts; não editar à mão.

## Estrutura

```
src/
  compositions/NiponFestTeaser.tsx   orquestra as 8 cenas com overlap
  scenes/Scene01..08*.tsx            uma cena por arquivo, roteiro do briefing
  components/                        SakuraPetals, BrushCircle, SeigaihaPattern,
                                      AnimatedText, LogoReveal, FilmGrain, ...
  lib/animation.ts                   primitivas de entrada/saída (ci, entryUp, exitTo...)
  config/                            brand.ts (paleta/timing) e texts.ts (copy)
public/
  logos/aceu-seal.png                selo oficial ACEU (asset real, nunca redesenhado)
  sakura/branch-0{1,2}.png           galho de sakura oficial do manual de marca
```

## Notas de produção

- O selo ACEU é o asset oficial extraído do manual de marca — nunca é
  redesenhado; o lockup "NIPPON FEST" ao redor dele é tipografia (Montserrat,
  a alternativa geométrica mais próxima da fonte oficial, que não é
  distribuída digitalmente).
- Trilha sonora não está incluída (áudio licenciado fica por conta da
  produção); as cenas já têm pontos de impacto/silêncio pensados para
  sincronizar com uma trilha cinematográfica japonesa contemporânea
  (ver seção 11 do briefing).
- O render headless deste ambiente usa um Chromium enxuto sem decodificador
  Brotli/WOFF2 — por isso as fontes são embutidas como TTF, não WOFF2.
