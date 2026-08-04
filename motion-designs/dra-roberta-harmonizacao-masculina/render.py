import os, sys, subprocess
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
FRAMES_DIR = os.path.join(HERE, "frames")
FPS = 30
DURATION_MS = 6000
N_FRAMES = int(DURATION_MS / 1000 * FPS)

os.makedirs(FRAMES_DIR, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    # (pin to installed browser build; python playwright's bundled version pointer can drift)
    page = browser.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
    page.goto(f"file://{HERE}/index.html")
    page.wait_for_function("window.__ready === true")
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(200)

    for i in range(N_FRAMES):
        t = round(i / FPS * 1000, 2)
        page.evaluate(f"window.seek({t})")
        page.screenshot(path=os.path.join(FRAMES_DIR, f"frame_{i:04d}.png"))
        if i % 15 == 0:
            print(f"frame {i}/{N_FRAMES} t={t}ms", flush=True)

    browser.close()

print("Rendering frames complete.")
