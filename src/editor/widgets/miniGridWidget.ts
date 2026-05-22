import {
  Decoration,
  type DecorationSet,
  EditorView,
  WidgetType,
} from '@codemirror/view';
import { RangeSetBuilder, StateField } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import type { EditorState } from '@codemirror/state';

const SIMPLE_TOKEN = /^([a-zA-Z][a-zA-Z0-9_]*(:[0-9]+)?|~|-)$/;
const SAMPLE_FNS = new Set(['s', 'note', 'n']);

function isSimpleMini(content: string): boolean {
  const tokens = content.trim().split(/\s+/);
  if (tokens.length === 0) return false;
  return tokens.every((t) => SIMPLE_TOKEN.test(t));
}

class MiniGridWidget extends WidgetType {
  readonly stringFrom: number;
  readonly stringTo: number;
  readonly tokens: string[];
  readonly defaultSample: string;

  constructor(
    stringFrom: number,
    stringTo: number,
    tokens: string[],
    defaultSample: string,
  ) {
    super();
    this.stringFrom = stringFrom;
    this.stringTo = stringTo;
    this.tokens = tokens;
    this.defaultSample = defaultSample;
  }

  eq(other: MiniGridWidget) {
    return (
      other.stringFrom === this.stringFrom &&
      other.stringTo === this.stringTo &&
      other.tokens.length === this.tokens.length &&
      other.tokens.every((t, i) => t === this.tokens[i])
    );
  }

  toDOM(view: EditorView) {
    const wrap = document.createElement('div');
    wrap.className = 'cm-minigrid';
    wrap.setAttribute('contenteditable', 'false');

    const replace = (newTokens: string[]) => {
      const doc = view.state.doc.toString();
      const openQuote = doc[this.stringFrom];
      const closeQuote = doc[this.stringTo - 1];
      const insert = openQuote + newTokens.join(' ') + closeQuote;
      view.dispatch({
        changes: { from: this.stringFrom, to: this.stringTo, insert },
      });
    };

    this.tokens.forEach((tok, i) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cm-minigrid-cell';
      const active = tok !== '~' && tok !== '-';
      if (active) cell.classList.add('active');
      cell.textContent = active ? tok : '·';
      cell.title = active ? tok : 'silencio';
      cell.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const newTokens = [...this.tokens];
        newTokens[i] = active ? '~' : this.defaultSample;
        replace(newTokens);
      });
      wrap.appendChild(cell);
    });

    // botón "agregar paso"
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'cm-minigrid-add';
    addBtn.textContent = '+';
    addBtn.title = 'añadir paso';
    addBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      replace([...this.tokens, '~']);
    });
    wrap.appendChild(addBtn);

    return wrap;
  }

  ignoreEvent() {
    return false;
  }
}

type StringTarget = {
  stringFrom: number;
  stringTo: number;
  content: string;
};

function findSampleStrings(state: EditorState): StringTarget[] {
  const out: StringTarget[] = [];
  syntaxTree(state).iterate({
    enter(node) {
      if (node.name !== 'CallExpression') return;
      const callee = node.node.firstChild;
      if (!callee || callee.name !== 'VariableName') return;
      const fn = state.doc.sliceString(callee.from, callee.to);
      if (!SAMPLE_FNS.has(fn)) return;
      const args = callee.nextSibling;
      if (!args || args.name !== 'ArgList') return;
      let arg = args.firstChild;
      while (arg && (arg.name === '(' || arg.name === ',')) arg = arg.nextSibling;
      if (!arg || arg.name !== 'String') return;
      const content = state.doc.sliceString(arg.from + 1, arg.to - 1);
      out.push({ stringFrom: arg.from, stringTo: arg.to, content });
    },
  });
  return out;
}

function buildMiniGrids(state: EditorState): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const targets = findSampleStrings(state);
  for (const t of targets) {
    if (!isSimpleMini(t.content)) continue;
    const tokens = t.content.trim().split(/\s+/);
    const defaultSample =
      tokens.find((tok) => tok !== '~' && tok !== '-') ?? 'bd';
    const line = state.doc.lineAt(t.stringFrom);
    builder.add(
      line.to,
      line.to,
      Decoration.widget({
        widget: new MiniGridWidget(t.stringFrom, t.stringTo, tokens, defaultSample),
        block: true,
        side: 1,
      }),
    );
  }
  return builder.finish();
}

export const miniGridPlugin = StateField.define<DecorationSet>({
  create(state) {
    return buildMiniGrids(state);
  },
  update(deco, tr) {
    if (tr.docChanged) return buildMiniGrids(tr.state);
    return deco;
  },
  provide: (f) => EditorView.decorations.from(f),
});
