# CLAUDE.md

Guidance for Claude Code working in this repo. This project mixes a small
Vite/React landing page (Corre Umuarama) with **Remotion motion design work**
for client brands (UAI Ciência, UAI Tofu). The Remotion notes below are the
important part — read them before touching any `remotion/*.tsx` file.

## Repo layout

- `src/` — Corre Umuarama landing page (Vite + React + Tailwind + Framer Motion).
- `remotion/` — Remotion compositions (motion design deliverables), registered in `remotion/Root.tsx`.
- `public/uai-tofu/`, `public/fonts/` — extracted brand assets used by the Remotion compositions.
- `npm run remotion:studio` / `remotion:render` / `remotion:still` — see `package.json`.

## Environment setup (fresh containers need this every time)

- `poppler-utils` and `imagemagick` are NOT preinstalled — `apt-get install -y poppler-utils imagemagick` before touching PDFs/asset extraction.
- The bundled Playwright ffmpeg (`/opt/pw-browsers/ffmpeg-1011/ffmpeg`) can decode only a few codecs (no h264 demux) — install the full build with `apt-get install -y ffmpeg` and prefer `/usr/bin/ffmpeg` for reading arbitrary source videos (e.g. reference clips the client sends). Keep using the Playwright ffmpeg path for Remotion's own encode step if `PATH` already points there; either works for encoding.
- Remotion's own Chrome download is blocked by the network allowlist. Point it at the pre-installed Playwright browser instead, in `remotion.config.ts`:
  `Config.setBrowserExecutable('/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell')`.
- Google Fonts fetched at render time fail TLS through the proxy — self-host fonts instead (download once with `curl`, commit under `public/fonts/`, load via a local `@font-face` + `staticFile()`), don't rely on `@remotion/google-fonts` fetching live.

## Asset extraction pipeline (product photos, logos, packaging)

When a client sends a PDF/asset sheet with product photography on a flat
brand-color background (this has happened for UAI Tofu and will likely
happen again):

1. Render pages at high res: `pdftoppm -png -r 300 file.pdf page`.
2. **Never** ship a rectangular crop with background-color padding as the
   final asset if that element might ever overlap another layer (a second
   photo, a logo, a glow). It only looks seamless against a perfectly flat,
   unchanging background — the moment two such "rectangle tricks" overlap,
   one's opaque padding cuts a hard rectangular edge into the other. This
   cost real rework on the UAI Tofu ring animation.
3. Instead, chroma-key a **real alpha cutout** with numpy/PIL: compute
   per-pixel distance to the known background RGB, threshold to alpha
   (binary threshold ~35-40 works better than a soft ramp — a soft ramp
   picks up anti-aliased edge pixels that carry a visible color fringe/halo
   from the source photo). Crop tight to the alpha mask + small padding,
   save as RGBA PNG. Do this for every element that will be composited,
   rotated, or overlapped: product photos, logos, packaging.
4. If a design needs a uniform "ring" of repeated elements but you only
   have N real photographed pieces (e.g. 6 tofu slices, reference video
   wants 12): reuse the same real photos twice at interleaved angular
   slots rather than fabricating new artwork. Never invent brand content
   (logos, packaging text) that doesn't exist in the source material —
   when a style reference has a cleaner/simplified logo than reality,
   keep the real logo and give it a plain design treatment (e.g. a white
   circle backing) instead of redrawing the mark.
5. For elements photographed at an angle (not axis-aligned), estimate the
   true rotation via PCA on the alpha mask (`numpy.linalg.eigh` on the
   covariance of foreground pixel coords) if you need to align it
   tangentially/uprightly in a new layout — don't eyeball rotation values.

## Verifying motion, not eyeballing it

- After writing position/scale formulas (especially anything with spring
  overshoot, arcs, or bulges), write a small standalone Node script that
  imports `interpolate`/`spring`/`Easing` from `remotion` and evaluates
  every frame's bounding box for every element, printing min/max
  left/right/top/bottom. Confirms nothing clips the canvas edges before
  spending a render. This caught real out-of-bounds bugs twice.
- Render preview stills at key frames (`remotion still ... --frame=N`) to
  check composition before committing to a full render.
- **Always render the preview you send to the client at full resolution
  and high quality** (`--scale=1 --jpeg-quality=95 --crf=18`). A heavily
  downscaled/compressed preview (`--scale=0.4 --jpeg-quality=75`) can read
  as "not smooth" even when the underlying motion is fine — this caused a
  full round of unnecessary back-and-forth. Use a lower scale only for
  quick internal sanity checks, never for client review.
- When asked to match a reference video/storyboard, extract actual frames
  from it (`ffmpeg -vf fps=N`) and look at them side-by-side with your own
  renders rather than approximating the reference from memory — the
  difference between "close" and "exactly like the reference" usually
  shows up in things you can't guess (slice count, uniform sizing, a white
  disc behind a logo, rotation alignment).

## Motion design preferences for this client (UAI brands)

- Premium/food-ad feel: natural easing (springs with moderate damping,
  ~0.65-0.75 damping ratio — enough overshoot to feel alive, not so much
  it wobbles), no linear/robotic movement, no exaggerated effects.
- Product packaging and logos must never look distorted, stretched, or
  redesigned — treat every brand asset as read-only pixels; only
  reposition/rotate/scale uniformly (preserve aspect ratio) or mask with
  real alpha.
- A ring/orbit of repeated pieces should use fixed evenly-spaced slot
  angles (not each piece's organic native position) and a uniform display
  size per piece for a clean, professional circle — natural photographed
  variation looks messy once elements need to touch or tile.
- End cards: the client likes a bold finish — the logo should visibly grow
  and dominate the frame at the very end (not stay small/timid). A couple
  of fast full spins on a ring right before the logo take-over reads as a
  satisfying "flourish" beat.
- It's fine to extend total duration when a requested new beat needs room
  to breathe — just say so explicitly rather than cramming it into a fixed
  runtime the user hasn't re-confirmed.
- Iterate in small, verifiable steps and send an actual rendered preview
  after each material change — don't describe a change without showing it.
