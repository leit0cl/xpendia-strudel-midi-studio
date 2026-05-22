<div align="center">

# `{ Xpendia }` Studio

**Music as code.** A free alternative to producing music with AI.

Made at **Xpendia Labs** · Free software AGPL-3.0 · Powered by [Strudel](https://strudel.cc)

🌐 [Español](./README.es.md) · **English** · [Português](./README.pt.md)

</div>

---

## What is this?

**Xpendia Studio** is a visual panel for making music with code, live. It's built on top of [Strudel](https://strudel.cc) (TidalCycles-style live coding running 100% in the browser) with a friendly studio on top: tracks, segments, a loop library, MP3 export, and a full code mode for those who want to go deep.

The premise: **writing music shouldn't require opaque AI generators**. Here, you decide every note, every bar, every drum bank. The machine just runs what you write — but it gives you tools to do it fast and without starting from scratch.

## Why does it exist?

There are dozens of tools today that promise "compose music with AI in one click". They generate songs from a prompt and return an MP3 with murky authorship, no way to edit the result note by note, trained on music whose authors never gave consent.

**Xpendia Studio** is the opposite answer:

- **Humans compose.** The machine plays.
- **Deterministic.** The same code always produces the same result.
- **Inspectable.** No black box; every line of code that runs is written by you (or chosen from the preset library).
- **Open source.** AGPL-3.0. Anyone can read, modify, redistribute and learn.
- **No cloud dependencies.** Once loaded, it runs offline in your browser.

## Who is it for?

| If you are…              | You'll use it to…                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------- |
| **Musician**             | Sketch rhythmic or harmonic ideas without opening a DAW; export loops as 192 kbps MP3   |
| **Producer**             | Generate beds, drum patterns and arrangements to take into Logic / Ableton / Reaper     |
| **Live coder**           | Get a quick panel with presets while keeping full access to Strudel code                |
| **Music teacher**        | Show polyrhythms, scales, harmonies and arrangements with readable, editable code       |
| **Curious programmer**   | Learn live coding without setting up an environment from scratch                        |
| **Student**              | Compose and export pieces for assignments, audiovisual projects or portfolios           |

## Features

### Studio mode (no code)

- **5 track types** — Drums, Bass, Melody/Arpeggio, Strings and Pad
- **Per-track segments** — split a track into blocks with different lengths (bars) and parameters to build intros, verses, choruses and bridges
- **Silence blocks** — insert rests with a click or double-click on any segment
- **49 drum banks** — Roland (TR-909, 808, 707, 727, 606, 626, 505, etc.), Linn, Akai MPC, Korg, Yamaha, Boss, Alesis, E-mu, Oberheim, Casio, Sequential…
- **80+ drum patterns** — Rock, Pop, Hip-hop, Latin (cumbia, salsa, bossa, bachata, merengue, bolero…), Electronic, Jazz, **Cinematic / Spatial** (interstellar, supernova, trailer hits, Zimmer toms…) and **Rolls / Fills**
- **Curated instrument picker** — category lists (curated / GM soundfonts / synths / external packs) with search
- **Notes and chords** — visual picker with piano keyboard, chord presets and free mode
- **Live mode** — every change is evaluated instantly while it plays

### Code mode

- **Full Strudel editor** — syntax highlighting, autocomplete, evaluate with ⌘/Ctrl+Enter
- **47 ready-to-use loops** — grouped and searchable: Basic, Rock/Metal, Pop, Hip-Hop, Electronic (acid, dnb, dubstep, trance, jungle, garage…), Latin, Jazz, Ambient/Cinematic, Multi-segment
- **Piano roll** — live visualization of the notes that are playing
- **Hydra visuals** — support for generative visuals synced to the pattern
- **Tap BPM** — set the tempo by tapping

### Share and export

- **MP3 192 kbps** — 🎵 mp3 button: pick a duration (8s, 16s, 30s, 1min, 2min or whatever you want), record live from the audio context, encode with [lamejs](https://github.com/zhuker/lamejs) and download. No pop-ups, no server.
- **Dancing mode 💃** — fullscreen with camera-based pose detection (MediaPipe), the body rendered in neon over a black background, a waveform band along the bottom.
- **Local persistence** — your work is saved in localStorage between sessions.
- **Languages and theme** — UI available in Spanish, English and Portuguese, with light and dark modes.

### Sample packs

Beyond the default packs (dirt-samples, tidal-drum-machines, piano salamander, VCSL, etc.) you can enable +30 community Strudel packs with one click from the 📦 packs panel.

## How to run it

```bash
# 1. Clone or enter the directory
cd strudel-panel

# 2. Install dependencies (Node 20+)
npm install

# 3. Dev server with HMR
npm run dev
# → http://localhost:5173

# 4. Production build
npm run build
npm run preview
```

There's no backend. It's a static site: you can host it on any CDN.

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **Strudel** (`@strudel/core`, `@strudel/webaudio`, `@strudel/transpiler`, `@strudel/mini`, `@strudel/tonal`, `@strudel/soundfonts`)
- **superdough** — Web Audio engine + soundfonts
- **CodeMirror 6** for the editor
- **lamejs** (`@breezystack/lamejs`) for client-side 192 kbps MP3 encoding
- **Hydra** for generative visuals

## License

Xpendia Studio uses a **dual-license model**:

### 1. Open source — AGPL-3.0-or-later (free)

For personal, educational, research and AGPL-compatible open source use.

- ✅ Use, modify and redistribute freely
- ✅ Create and export music — your music is yours
- ⚠️ If you host a modified version as a web service, you must publish your modified source under the same license

This is deliberate: we want every improvement to flow back to the community. Strudel is also AGPL-3.0, so we respect its contract. Full text in [LICENSE](./LICENSE).

### 2. Commercial license (paid)

If your use doesn't fit AGPL obligations — proprietary integration, closed-source SaaS, embedding in commercial hardware — you may need a separate commercial license **for the Xpendia-authored code**.

⚠️ **Important scope notice**: the commercial license covers only the code authored by Xpendia Labs. The upstream Strudel / superdough libraries remain AGPL — you must independently comply with them or negotiate with the Strudel maintainers. Many use cases (managed hosting, custom development, support contracts) are fully AGPL-compatible and usually a better fit than buying a commercial license. **Read [LICENSING.md](./LICENSING.md) before contacting us.**

📧 Write to **[contacto@xpendia.cl](mailto:contacto@xpendia.cl)** with: company / project name, brief use description, expected scale. We reply within 48 hours.

### Contributions

By submitting a pull request you accept the [Contributor License Agreement](./CLA.md), which lets us keep offering the code under both licenses (AGPL and commercial). It's non-exclusive — you keep ownership of your contribution.

## Acknowledgments

Without these projects this wouldn't exist:

- **[Strudel](https://strudel.cc)** — Felix Roos, Daniel Roos and community. A masterpiece of live coding.
- **[TidalCycles](https://tidalcycles.org)** — Alex McLean. The original pattern language.
- **[tidal-drum-machines](https://github.com/ritchse/tidal-drum-machines)** — the vintage drum machine catalog.
- **[VCSL](https://github.com/sgossner/VCSL)** — Versilian Community Sample Library, real instrument samples.
- **[lamejs](https://github.com/zhuker/lamejs)** — pure JS MP3 encoder.
- **[MediaPipe Tasks Vision](https://developers.google.com/mediapipe)** — real-time pose and hand detection for Dancing mode.
- **[three.js](https://threejs.org) + [react-three-fiber](https://docs.pmnd.rs/react-three-fiber)** — 3D rendering of the neon skeleton.
- **[i18next](https://www.i18next.com) + [react-i18next](https://react.i18next.com)** — internationalization layer.

### Languages

Xpendia Studio is available in **neutral Spanish**, **English** and **Portuguese**. The UI switches with the header language picker (ES · EN · PT). The language is auto-detected from your browser the first time and saved locally.

---

## About the author

**Leo Cortés Ponce** — Software architect, producer and founder of **Xpendia**.

I build digital platforms, AI systems and cloud-native products from Chile. Xpendia Labs is the experimentation arm: open source tools born from real problems (like this one, when I tried to score a video and didn't want to ask an AI to generate it for me).

🔗 **[xpendia.cl](https://xpendia.cl)**
📧 **contacto@xpendia.cl**
𝕏 **[@weontupodis](https://x.com/weontupodis)**

> "If AI can compose for us, we can still choose to compose ourselves."
