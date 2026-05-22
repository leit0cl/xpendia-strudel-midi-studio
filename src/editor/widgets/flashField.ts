import { StateEffect, StateField } from '@codemirror/state';
import { Decoration, type DecorationSet, EditorView } from '@codemirror/view';

export const addFlash = StateEffect.define<{ from: number; to: number }>();
export const clearFlash = StateEffect.define<{ from: number; to: number }>();

const flashMark = Decoration.mark({ class: 'cm-flash' });

export const flashField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(deco, tr) {
    let next = deco.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(addFlash)) {
        next = next.update({
          add: [flashMark.range(e.value.from, e.value.to)],
        });
      } else if (e.is(clearFlash)) {
        next = next.update({
          filter: (from, to) => !(from === e.value.from && to === e.value.to),
        });
      }
    }
    return next;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export function flashRange(
  view: EditorView,
  from: number,
  to: number,
  durationMs = 380,
) {
  if (from === to || from < 0 || to > view.state.doc.length) return;
  view.dispatch({ effects: addFlash.of({ from, to }) });
  window.setTimeout(() => {
    view.dispatch({ effects: clearFlash.of({ from, to }) });
  }, durationMs);
}
