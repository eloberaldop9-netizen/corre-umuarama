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
