# Dra. Roberta Rodrigues — Cena 01: "MAS, cuidar da autoestima também é cuidar da saúde"

Motion design vertical 9:16 (1080×1920), 5s, kinetic typography sincronizada com a fala,
seguindo a identidade visual da Dra. Roberta (paleta branco-gelo/grafite/champagne,
Montserrat, motivo de rosto em linha fina com circuitos, logo da marca).

- `dra_roberta_cena01_mas_saude.mp4` — render final (H.264, 1080×1920, 30fps).
- `index.html` + `timeline.js` — a cena em si. Toda a animação é código (Web Animations
  API), não vídeo pré-gravado, então dá pra ajustar timing, texto, cores etc. e re-renderizar.
- `render.py` — script Playwright que varre a linha do tempo frame a frame (30fps) e
  tira screenshots determinísticos via `window.seek(tMs)`, depois `ffmpeg` monta o mp4.

## Pré-visualizar no navegador

Abra `index.html` direto no Chrome/Edge (ele já roda em tempo real, sem precisar de servidor).

## Re-renderizar após editar

```bash
pip install playwright   # se ainda não tiver
python3 render.py        # gera frames/frame_0000.png ... frame_0149.png
ffmpeg -y -framerate 30 -i frames/frame_%04d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 16 -preset slow -movflags +faststart \
  dra_roberta_cena01_mas_saude.mp4
rm -rf frames
```

`render.py` aponta para o Chromium instalado em `/opt/pw-browsers/chromium-*/chrome-linux/chrome`;
ajuste o `executable_path` se rodar em outra máquina.
