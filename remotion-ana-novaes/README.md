# Ana Novaes — A Marca (Remotion)

Vídeo institucional de 24s (720 frames @ 30fps, 1080×1920) construído em
Remotion seguindo o **BRABO Motion O.S. v9.0** e a decupagem
"Ana Novaes — A Marca".

## Rodar o preview

```bash
cd remotion-ana-novaes
npm install
npm start
```

Abre o Remotion Studio com a composição `AnaNovaes-AMarca`.

## Renderizar o vídeo final

```bash
npm run build
# gera out/ana-novaes-a-marca.mp4
```

## Como plugar os assets reais

Hoje todas as cenas rodam com **placeholders visuais** (mesma posição,
proporção e sombra dos elementos finais) porque ainda não recebemos:

- Retrato da Ana (PNG recortado, fundo transparente) — Cena 1
- Fotos/prints de arquivo (3 imagens) — Cena 3
- Fotos da rua/comunidade (3 imagens) — Cena 4
- Áudio de narração — trilha inteira

Assim que os arquivos chegarem:

1. Coloque-os em `public/assets/`.
2. Preencha o objeto `ASSETS` em `src/VideoAnaNovaes.tsx` com os nomes de
   arquivo correspondentes (ex: `retratoAna: 'retrato-ana.png'`).
3. O vídeo passa a usar os arquivos reais automaticamente — nenhuma outra
   mudança de código é necessária.

O mapa de Umuarama (Cena 2) tem um placeholder vetorial próprio
(`AbstractMap` em `src/scenes/Scene2_Eco.tsx`) e pode ser substituído por um
SVG/mapa real do mesmo jeito, via `ASSETS.mapaUmuarama`.

## Estrutura

```
src/
  lib/
    motion.ts        primitivas de entrada/saída/spring (Motion O.S. Parte 5 e 7)
    AnimatedText.tsx  texto palavra-por-palavra (Mandamento 2)
    Background.tsx    camadas de fundo (void, papel, cinematográfico, radar, poeira)
    AssetImage.tsx    wrapper de mídia com placeholder automático
    palette.ts        cores e fontes da decupagem
  scenes/
    Scene1_Manchete.tsx
    Scene2_Eco.tsx
    Scene3_Arquivo.tsx
    Scene4_Compromisso.tsx
    Scene5_Assinatura.tsx
  VideoAnaNovaes.tsx  composição final (Sequences com overlap de 7f)
  Root.tsx
  index.ts
```

## Mapa de cenas (overlap de 7 frames entre todas)

| Cena | from | duration | até |
|---|---|---|---|
| 1 — Manchete | 0 | 180 | 180 |
| 2 — Eco | 173 | 157 | 330 |
| 3 — Arquivo | 323 | 157 | 480 |
| 4 — Compromisso | 473 | 127 | 600 |
| 5 — Assinatura | 593 | 127 | 720 |

---

# Gráficos 2D e 3D na Comunicação (Remotion + Three.js)

Vídeo vertical de 60s (1800 frames @ 30fps, 1080×1920), projeto didático.
Segue o "Pensamento de Vídeo" (Roteiro final). Composição: `Graficos2D-vs-3D`.

```bash
npm start                       # Studio → escolha Graficos2D-vs-3D
npm run build:graficos          # gera out/graficos-2d-vs-3d.mp4
# sem GPU (container/CI):
npx remotion render src/index.ts Graficos2D-vs-3D out/graficos-2d-vs-3d.mp4 --gl=swangle
```

| Cena | from | duration | até | Saída |
|---|---|---|---|---|
| 1 — O Nascimento da Massa (CineA) | 0 | 300 | 300 | Z-Dive massivo |
| 2 — A Força do 2D (CineB) | 293 | 457 | 750 | Colapso lateral |
| 3 — A Profundidade do 3D (CineC) | 743 | 607 | 1350 | Wipe volumétrico |
| 4 — Comunicação de Outro Nível (CineD) | 1343 | 457 | 1800 | Dissolve |

```
src/graficos/
  theme.ts              paleta + springs do Pensamento de Vídeo
  SpringWords.tsx       texto palavra a palavra
  AppBadge.tsx          selo After Effects
  Grain.tsx             grão de filme global
  three/Studio.tsx      morfo quadrado→esfera, escultura wireframe→sólido, HDRI procedural
  scenes/CineA..D.tsx   uma cena por arquivo
  VideoGraficos2D3D.tsx Sequences com overlap de 7f
```

**Créditos:** edite `CREDITS` em `src/graficos/scenes/CineD.tsx`.
