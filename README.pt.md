<div align="center">

# `{ Xpendia }` Studio

**Música em código.** Uma alternativa livre para produzir música com IA.

Feito no **Xpendia Labs** · Software livre AGPL-3.0 · Powered by [Strudel](https://strudel.cc)

🌐 [Español](./README.es.md) · [English](./README.en.md) · **Português**

</div>

---

## O que é isso?

**Xpendia Studio** é um painel visual para fazer música com código em tempo real. É construído sobre o motor [Strudel](https://strudel.cc) (live coding no estilo TidalCycles, rodando 100% no navegador) e coloca em cima dele um estúdio amigável: pistas, segmentos, biblioteca de loops, exportação para MP3 e um modo código completo para quem quiser ir fundo.

A premissa: **escrever música não deveria exigir geradores opacos de IA**. Aqui você decide cada nota, cada compasso, cada banco de bateria. A máquina só executa o que você escreve — mas te dá ferramentas para fazer isso rápido e sem partir do zero.

## Por que existe?

Hoje há dezenas de ferramentas que prometem "compor música com IA num clique". Geram músicas a partir de um prompt e devolvem um MP3 com autoria difusa, sem possibilidade de editar o resultado nota por nota, e treinadas em cima da música de pessoas que nunca deram seu consentimento.

**Xpendia Studio** é a resposta ao contrário:

- **O humano compõe.** A máquina toca.
- **Determinístico.** O mesmo código sempre produz o mesmo resultado.
- **Inspecionável.** Não há caixa preta; todo o código que roda é escrito por você (ou escolhido da biblioteca de presets).
- **Open source.** AGPL-3.0. Qualquer um pode ler, modificar, redistribuir e aprender.
- **Sem dependências na nuvem.** Uma vez carregado, roda offline no seu navegador.

## Pra quem serve?

| Se você é…               | Vai usar para…                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| **Músico/a**             | Esboçar ideias rítmicas ou harmônicas sem abrir uma DAW; exportar loops para MP3 192 kbps |
| **Produtor/a**           | Gerar bases, drum patterns e arranjos para levar pra Logic / Ableton / Reaper             |
| **Live coder**           | Ter um painel rápido com presets mas mantendo acesso completo ao código Strudel           |
| **Professor/a de música**| Mostrar polirritmias, escalas, harmonias e arranjos com código legível e editável         |
| **Programador/a curioso/a** | Aprender live coding sem ter que montar um ambiente do zero                            |
| **Estudante**            | Compor e exportar peças para trabalhos, audiovisuais ou portfólios                        |

## Funcionalidades

### Modo Estúdio (sem código)

- **5 tipos de pista** — Drums, Baixo, Melodia/Arpejo, Cordas e Pad
- **Segmentos por pista** — divide uma pista em blocos com duração (compassos) e parâmetros diferentes para montar intros, versos, refrões e pontes
- **Blocos de silêncio** — insere pausas com um clique ou duplo-clique sobre qualquer segmento
- **49 bancos de bateria** — Roland (TR-909, 808, 707, 727, 606, 626, 505, etc.), Linn, Akai MPC, Korg, Yamaha, Boss, Alesis, E-mu, Oberheim, Casio, Sequential…
- **80+ padrões de bateria** — Rock, Pop, Hip-hop, Latin (cumbia, salsa, bossa, bachata, merengue, bolero…), Eletrônica, Jazz, **Espacial / Cinematográfico** (interestelar, supernova, trailer hit, Zimmer toms…) e **Rolls / Fills**
- **Seletor de instrumentos curado** — listas por categoria (curados / soundfonts GM / synths / packs externos) com busca
- **Notas e acordes** — picker visual com teclado de piano, presets de acordes e modo livre
- **Live mode** — qualquer mudança é avaliada na hora enquanto toca

### Modo Código

- **Editor Strudel completo** — syntax highlight, autocomplete, avaliar com ⌘/Ctrl+Enter
- **47 loops prontos para usar** — agrupados e com busca: Básico, Rock/Metal, Pop, Hip-Hop, Eletrônica (acid, dnb, dubstep, trance, jungle, garage…), Latin, Jazz, Ambient/Cinematic, Multi-segmento
- **Piano roll** — visualização ao vivo das notas que estão tocando
- **Hydra visuals** — suporte a visuais generativos sincronizados com o padrão
- **Tap BPM** — fixa o tempo dando toquinhos

### Compartilhar e exportar

- **MP3 192 kbps** — botão 🎵 mp3: escolha a duração (8s, 16s, 30s, 1min, 2min ou o que quiser), grava em tempo real do audio context, codifica com [lamejs](https://github.com/zhuker/lamejs) e baixa. Sem pop-ups, sem servidor.
- **Modo Dancing 💃** — tela cheia com detecção de pose pela câmera (MediaPipe), corpo renderizado em neon sobre fundo preto, faixa inferior com a waveform.
- **Persistência local** — seu trabalho é salvo no localStorage entre sessões.
- **Idiomas e tema** — interface disponível em espanhol, English e português, com modo claro e escuro.

### Sample packs

Além dos packs padrão (dirt-samples, tidal-drum-machines, piano salamander, VCSL, etc.) você pode ativar +30 packs comunitários de Strudel com um clique no painel 📦 packs.

## Como rodar

```bash
# 1. Clone ou entre no diretório
cd strudel-panel

# 2. Instale as dependências (Node 20+)
npm install

# 3. Dev server com HMR
npm run dev
# → http://localhost:5173

# 4. Build de produção
npm run build
npm run preview
```

Não tem backend. É um site estático: você pode hospedar em qualquer CDN.

## Stack técnica

- **React 19** + **TypeScript** + **Vite**
- **Strudel** (`@strudel/core`, `@strudel/webaudio`, `@strudel/transpiler`, `@strudel/mini`, `@strudel/tonal`, `@strudel/soundfonts`)
- **superdough** — engine de áudio Web Audio + soundfonts
- **CodeMirror 6** para o editor
- **lamejs** (`@breezystack/lamejs`) para encoding MP3 192 kbps client-side
- **Hydra** para visuais generativos

## Licença

Xpendia Studio é oferecido sob um **modelo de dupla licença**:

### 1. Open source — AGPL-3.0-or-later (grátis)

Para uso pessoal, educacional, pesquisa e projetos open source compatíveis com AGPL.

- ✅ Use, modifique e redistribua livremente
- ✅ Crie e exporte música — a música que você fizer é sua
- ⚠️ Se você hospedar uma versão modificada como serviço web, tem que publicar o código da sua versão sob a mesma licença

Esta licença é deliberada: queremos que toda melhoria volte para a comunidade. Strudel também é AGPL-3.0, então respeitamos o contrato dele. Texto completo em [LICENSE](./LICENSE).

### 2. Licença comercial (paga)

Se seu uso não encaixa nas obrigações da AGPL — integração proprietária, SaaS comercial fechado, embarcado em hardware comercial — você pode precisar de uma licença comercial separada **para o código autorado pela Xpendia**.

⚠️ **Aviso importante de escopo**: a licença comercial cobre apenas o código autorado pelo Xpendia Labs. As bibliotecas upstream Strudel / superdough permanecem AGPL — você precisa cumprir independentemente ou negociar com os mantenedores do Strudel. Muitos casos de uso (hospedagem gerenciada, desenvolvimento sob medida, contratos de suporte) são totalmente compatíveis com AGPL e geralmente uma escolha melhor do que comprar uma licença comercial. **Leia [LICENSING.md](./LICENSING.md) antes de entrar em contato.**

📧 Escreva para **[contacto@xpendia.cl](mailto:contacto@xpendia.cl)** com: nome da empresa / projeto, descrição breve do uso, escala esperada. Respondemos em 48 horas.

### Contribuições

Ao enviar um pull request você aceita o [Contributor License Agreement](./CLA.md), que nos permite continuar oferecendo o código sob ambas as licenças (AGPL e comercial). É não-exclusivo — você continua dono/a da sua contribuição.

## Agradecimentos

Sem estes projetos isto não existiria:

- **[Strudel](https://strudel.cc)** — Felix Roos, Daniel Roos e comunidade. Uma obra-prima de live coding.
- **[TidalCycles](https://tidalcycles.org)** — Alex McLean. Linguagem original de patterns.
- **[tidal-drum-machines](https://github.com/ritchse/tidal-drum-machines)** — o catálogo de drum machines vintage.
- **[VCSL](https://github.com/sgossner/VCSL)** — Versilian Community Sample Library, samples de instrumentos reais.
- **[lamejs](https://github.com/zhuker/lamejs)** — encoder MP3 em JS puro.
- **[MediaPipe Tasks Vision](https://developers.google.com/mediapipe)** — detecção de pose e mãos em tempo real para o modo Dancing.
- **[three.js](https://threejs.org) + [react-three-fiber](https://docs.pmnd.rs/react-three-fiber)** — render 3D do esqueleto neon.
- **[i18next](https://www.i18next.com) + [react-i18next](https://react.i18next.com)** — sistema de internacionalização.

### Idiomas

Xpendia Studio está disponível em **espanhol neutro**, **English** e **português**. A interface muda com o seletor de idioma do cabeçalho (ES · EN · PT). O idioma é detectado automaticamente do seu navegador na primeira vez e salvo localmente.

---

## Sobre o autor

**Leo Cortés Ponce** — Arquiteto de software, produtor e founder do **Xpendia**.

Construo plataformas digitais, sistemas de IA e produtos cloud-native desde o Chile. Xpendia Labs é o braço de experimentação: ferramentas open source que nascem de problemas reais (como este, quando tentei fazer música para um vídeo e não quis pedir pra uma IA gerar pra mim).

🔗 **[xpendia.cl](https://xpendia.cl)**
📧 **contacto@xpendia.cl**
𝕏 **[@weontupodis](https://x.com/weontupodis)**

> "Se a IA pode compor por nós, ainda podemos escolher compor nós mesmos."
