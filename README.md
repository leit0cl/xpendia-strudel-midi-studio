<div align="center">

# `{ Xpendia }` Studio

**Música en código.** Una alternativa libre a producir música con IA.

Hecho en **Xpendia Labs** · Software libre AGPL-3.0 · Powered by [Strudel](https://strudel.cc)

🌐 **Español** · [English](./README.en.md) · [Português](./README.pt.md)

</div>

---

## ¿Qué es esto?

**Xpendia Studio** es un panel visual para hacer música con código en tiempo real. Está construido sobre el motor [Strudel](https://strudel.cc) (live-coding al estilo TidalCycles, corriendo 100% en el navegador) y le pone encima un estudio amigable: pistas, segmentos, librería de loops, exportación a MP3 y un modo código completo para quienes quieren ir al fondo.

La premisa: **escribir música no debería requerir generadores opacos de IA**. Aquí tú decides cada nota, cada compás, cada banco de batería. La máquina solo ejecuta lo que escribes — pero te da herramientas para hacerlo rápido y sin partir desde cero.

## ¿Por qué existe?

Hoy hay decenas de herramientas que prometen "componer música con IA en un click". Generan canciones a partir de un prompt y devuelven un MP3 con autoría difusa, sin posibilidad de editar el resultado nota por nota y entrenadas sobre música de gente que nunca dio su consentimiento.

**Xpendia Studio** es la respuesta al revés:

- **El humano compone.** La máquina suena.
- **Determinista.** El mismo código produce siempre el mismo resultado.
- **Inspeccionable.** No hay caja negra; todo el código que se ejecuta lo escribes tú (o lo eliges de la librería de presets).
- **Open source.** AGPL-3.0. Cualquiera puede leer, modificar, redistribuir y aprender.
- **Sin dependencias en la nube.** Una vez cargado, corre offline en tu navegador.

## ¿A quién le sirve?

| Si eres…                   | Lo vas a usar para…                                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| **Músico/a**               | Esbozar ideas rítmicas o armónicas sin abrir un DAW; exportar loops a MP3 192kbps        |
| **Productor/a**            | Generar bases, drum patterns y arreglos para llevarlos a Logic / Ableton / Reaper        |
| **Live coder**             | Tener un panel rápido con presets, pero seguir teniendo acceso completo al código Strudel |
| **Docente de música**      | Mostrar polirritmias, escalas, armonías y arreglos con código legible y editable          |
| **Programador/a curioso/a**| Aprender live-coding sin tener que armar un entorno desde cero                            |
| **Estudiante**             | Componer y exportar piezas para tareas, audiovisuales o portfolios                        |

## Funcionalidades

### Modo Estudio (sin código)

- **5 tipos de pista** — Drums, Bajo, Melodía/Arpegio, Cuerdas y Pad
- **Segmentos por pista** — divide una pista en bloques con distinta duración (compases) y distintos parámetros para construir intros, versos, coros y bridges
- **Bloques de silencio** — inserta pausas con un click o doble-click sobre cualquier segmento
- **49 bancos de batería** — Roland (TR-909, 808, 707, 727, 606, 626, 505, etc.), Linn, Akai MPC, Korg, Yamaha, Boss, Alesis, E-mu, Oberheim, Casio, Sequential…
- **80+ patrones de batería** — Rock, Pop, Hip-hop, Latin (cumbia, salsa, bossa, bachata, merengue, bolero…), Electrónica, Jazz, **Espacial / Cinemático** (interestelar, supernova, trailer hit, Zimmer toms…) y **Redobles / Fills**
- **Selector de instrumentos curado** — listas por categoría (curados / soundfonts GM / synths / packs externos) con buscador
- **Notas y acordes** — picker visual con teclado de piano, presets de acordes y modo libre
- **Live mode** — cualquier cambio se evalúa al instante mientras suena

### Modo Código

- **Editor Strudel completo** — sintaxis highlight, autocompletado, evaluar con ⌘/Ctrl+Enter
- **47 loops listos para usar** — agrupados y con buscador: Básico, Rock/Metal, Pop, Hip-Hop, Electrónica (acid, dnb, dubstep, trance, jungle, garage…), Latin, Jazz, Ambient/Cinematic, Multi-segmento
- **Piano roll** — visualización en vivo de las notas que están sonando
- **Hydra visuals** — soporte para visuales generativos sincronizados al patrón
- **Tap BPM** — fija el tempo dando golpecitos

### Compartir y exportar

- **MP3 192 kbps** — botón 🎵 mp3: elige duración (8s, 16s, 30s, 1min, 2min o lo que quieras), graba en tiempo real desde el audio context, encodea con [lamejs](https://github.com/zhuker/lamejs) y descarga. Sin pop-ups, sin servidor.
- **Modo Dancing 💃** — pantalla completa con detección de pose por cámara (MediaPipe), cuerpo renderizado en neón sobre fondo negro, banda inferior con el waveform.
- **Persistencia local** — tu trabajo queda guardado en localStorage entre sesiones.
- **Idiomas y tema** — interfaz disponible en español, English y português, con modo claro y modo oscuro.

### Sample packs

Aparte de los packs por defecto (dirt-samples, tidal-drum-machines, piano salamander, VCSL, etc.) puedes activar +30 packs comunitarios de Strudel con un click desde el panel 📦 packs.

## Cómo correrlo

```bash
# 1. Clona o entra al directorio
cd strudel-panel

# 2. Instala dependencias (Node 20+)
npm install

# 3. Dev server con HMR
npm run dev
# → http://localhost:5173

# 4. Build de producción
npm run build
npm run preview
```

No hay backend. Es un sitio estático: puedes alojarlo en cualquier CDN.

## Stack técnico

- **React 19** + **TypeScript** + **Vite**
- **Strudel** (`@strudel/core`, `@strudel/webaudio`, `@strudel/transpiler`, `@strudel/mini`, `@strudel/tonal`, `@strudel/soundfonts`)
- **superdough** — engine de audio Web Audio + soundfonts
- **CodeMirror 6** para el editor
- **lamejs** (`@breezystack/lamejs`) para encoding MP3 192kbps client-side
- **Hydra** para visuales generativos

## Licencia

Xpendia Studio se ofrece bajo un **modelo de doble licencia**:

### 1. Licencia open source — AGPL-3.0-or-later (gratis)

Para uso personal, educativo, investigación y proyectos open source compatibles con AGPL.

- ✅ Puedes usarlo, modificarlo y redistribuirlo libremente
- ✅ Puedes usarlo para crear y exportar música (la música que hagas es tuya)
- ⚠️ Si alojas una versión modificada de este software como servicio web, tienes que publicar el código de tu versión bajo la misma licencia

Esta licencia es deliberada: queremos que cualquier mejora que se le haga a este estudio vuelva a la comunidad. Strudel también es AGPL-3.0, así que respetamos su contrato. El texto completo está en [LICENSE](./LICENSE).

### 2. Licencia comercial (de pago)

Si tu uso del software no encaja con las obligaciones de la AGPL — por ejemplo:

- Integrarlo en un **producto propietario** o **app comercial** cerrada.
- Ofrecerlo como **SaaS comercial** sin abrir tus modificaciones.
- Embeberlo en **hardware comercial** o un plugin propietario.

…necesitás una **licencia comercial** separada. Es un acuerdo firmado, royalty-free para la versión cubierta, con soporte prioritario incluido.

📧 Escribinos a **[contacto@xpendia.cl](mailto:contacto@xpendia.cl)** con: nombre de empresa/proyecto, descripción breve del uso y escala esperada. Respondemos en 48 horas con un tier que se ajuste a tu caso.

Detalles completos del modelo dual en [LICENSING.md](./LICENSING.md).

### Contribuciones

Al enviar un pull request aceptás el [Contributor License Agreement](./CLA.md), que nos permite seguir ofreciendo el código bajo ambas licencias (AGPL y comercial). Es no-exclusivo: vos seguís siendo dueño/a de tu contribución.

## Agradecimientos

Sin estos proyectos esto no existiría:

- **[Strudel](https://strudel.cc)** — Felix Roos, Daniel Roos y comunidad. Una obra maestra de live-coding.
- **[TidalCycles](https://tidalcycles.org)** — Alex McLean. Lenguaje original de patterns.
- **[tidal-drum-machines](https://github.com/ritchse/tidal-drum-machines)** — el catálogo de cajas vintage.
- **[VCSL](https://github.com/sgossner/VCSL)** — Versilian Community Sample Library, samples de instrumentos reales.
- **[lamejs](https://github.com/zhuker/lamejs)** — encoder MP3 en JS puro.
- **[MediaPipe Tasks Vision](https://developers.google.com/mediapipe)** — detección de pose y manos en tiempo real para el modo Dancing.
- **[three.js](https://threejs.org) + [react-three-fiber](https://docs.pmnd.rs/react-three-fiber)** — render 3D del esqueleto neón.
- **[i18next](https://www.i18next.com) + [react-i18next](https://react.i18next.com)** — sistema de internacionalización.

### Idiomas

Xpendia Studio está disponible en **español neutral**, **English** y **português**. La interfaz cambia con el selector de idioma del header (ES · EN · PT). El idioma se detecta automáticamente desde tu navegador la primera vez y se guarda localmente.

Available in **neutral Spanish**, **English** and **Portuguese** — pick your language from the header switcher.

Disponível em **espanhol neutro**, **English** e **português** — escolha o idioma no seletor do cabeçalho.

---

## Sobre el autor

**Leo Cortés Ponce** — Arquitecto de software, productor y founder de **Xpendia**.

Construyo plataformas digitales, sistemas de IA y productos cloud-native desde Chile. Xpendia Labs es la rama de experimentación: herramientas open source que nacen de problemas reales (como este, cuando intenté hacerle música a un video y no quise pedirle a una IA que me lo generara por mí).

🔗 **[xpendia.cl](https://xpendia.cl)**
📧 **contacto@xpendia.cl**
𝕏 **[@weontupodis](https://x.com/weontupodis)**

> "Si la IA puede componer por nosotros, todavía podemos elegir componer nosotros."
