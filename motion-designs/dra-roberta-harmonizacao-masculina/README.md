# Dra. Roberta Rodrigues — Cena 02: "na verdade, a harmonização masculina é totalmente ao contrário"

Motion design vertical 9:16 (1080×1920), 6s, kinetic typography sincronizada com a fala.
Mesma identidade visual e engine da cena 01 (`../dra-roberta-mas-saude/`): Montserrat local,
ícone oficial da marca como motivo de fundo, reveal letra-por-letra nas palavras de impacto.

Elementos específicos desta cena:

- **"VERDADE", "MASCULINA", "TOTALMENTE", "CONTRÁRIO"** entram letra por letra; "CONTRÁRIO"
  entra da direita com um leve overshoot (passa do ponto e trava no centro).
- **Linha champagne que muda de direção** (`#reverse-line`, dois `<path>` — `seg-a` reto,
  `seg-b` fazendo a curva de volta) — o símbolo visual da inversão "ao contrário", desenhada
  via stroke-dashoffset exatamente quando a palavra aparece.
- **Dolly-in de câmera** sutil que acelera até "totalmente" e dá um micro impacto em "contrário".
- Recap final com 3 linhas + logo.

## Pré-visualizar / re-renderizar

Igual à cena 01 — abra `index.html` no navegador para rodar em tempo real, ou:

```bash
pip install playwright   # se ainda não tiver
python3 render.py        # gera frames/frame_0000.png ... frame_0179.png (30fps × 6s)
ffmpeg -y -framerate 30 -i frames/frame_%04d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 16 -preset slow -movflags +faststart \
  dra_roberta_cena02_harmonizacao_masculina.mp4
rm -rf frames
```

## Nota sobre o motor de animação (`timeline.js`)

O helper `T()` aplica o easing **por keyframe**, nunca no nível do efeito. Um easing
"ease-out" no nível do efeito é resolvido *uma vez* sobre a linha do tempo 0→1 inteira antes
de localizar os keyframes — como a curva usada aqui atinge ~1.0 em ~35% da duração, qualquer
keyframe de "hold" (segurar o valor) posicionado depois disso era silenciosamente ignorado e o
elemento começava a sumir quase imediatamente após aparecer. Manter o easing por keyframe é o
que faz um trecho de "hold" (mesmo valor de entrada e saída) realmente segurar. Ao adicionar
novas animações multi-fase, use sempre `T()` (nunca `A()` com mais de 2 keyframes) por esse motivo.
