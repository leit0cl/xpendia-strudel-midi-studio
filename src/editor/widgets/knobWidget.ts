import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
  WidgetType,
} from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';

class KnobWidget extends WidgetType {
  readonly from: number;
  readonly to: number;
  readonly value: number;
  readonly isFloat: boolean;

  constructor(from: number, to: number, value: number, isFloat: boolean) {
    super();
    this.from = from;
    this.to = to;
    this.value = value;
    this.isFloat = isFloat;
  }

  eq(other: KnobWidget) {
    return (
      other.value === this.value &&
      other.from === this.from &&
      other.to === this.to &&
      other.isFloat === this.isFloat
    );
  }

  toDOM(view: EditorView) {
    const el = document.createElement('span');
    el.className = 'cm-knob';
    el.title = `arrastrar vertical · ${this.value}`;
    el.setAttribute('contenteditable', 'false');

    el.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const startY = e.clientY;
      const startVal = this.value;
      let curFrom = this.from;
      let curTo = this.to;
      const step = this.isFloat ? 0.01 : 1;
      const pxPerStep = this.isFloat ? 2 : 6;

      const onMove = (ev: MouseEvent) => {
        const dy = startY - ev.clientY;
        const fine = ev.shiftKey ? 0.1 : 1;
        const ticks = Math.round((dy / pxPerStep) * fine);
        const newVal = startVal + ticks * step;
        const formatted = this.isFloat
          ? Number(newVal.toFixed(3)).toString()
          : String(Math.round(newVal));
        view.dispatch({
          changes: { from: curFrom, to: curTo, insert: formatted },
        });
        curTo = curFrom + formatted.length;
        el.title = `arrastrar vertical · ${formatted}`;
      };

      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        document.body.classList.remove('cm-knob-dragging');
      };

      document.body.classList.add('cm-knob-dragging');
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });

    return el;
  }

  ignoreEvent() {
    return false;
  }
}

function buildKnobs(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  syntaxTree(view.state).iterate({
    enter(node) {
      if (node.name !== 'Number') return;
      const text = view.state.doc.sliceString(node.from, node.to);
      const value = parseFloat(text);
      if (Number.isNaN(value)) return;
      const isFloat = text.includes('.');
      builder.add(
        node.from,
        node.from,
        Decoration.widget({
          widget: new KnobWidget(node.from, node.to, value, isFloat),
          side: -1,
        }),
      );
    },
  });
  return builder.finish();
}

export const knobPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildKnobs(view);
    }
    update(u: ViewUpdate) {
      if (u.docChanged || u.viewportChanged) {
        this.decorations = buildKnobs(u.view);
      }
    }
  },
  { decorations: (v) => v.decorations },
);
