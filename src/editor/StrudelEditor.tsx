import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { knobPlugin } from './widgets/knobWidget';
import { miniGridPlugin } from './widgets/miniGridWidget';
import { flashField, flashRange } from './widgets/flashField';

export type StrudelEditorHandle = {
  insertAtCursor: (text: string) => void;
  getCode: () => string;
  setCode: (code: string) => void;
  flash: (from: number, to: number) => void;
};

type Props = {
  initialCode: string;
  onChange: (code: string) => void;
  onSubmit: (code: string) => void;
};

export const StrudelEditor = forwardRef<StrudelEditorHandle, Props>(
  ({ initialCode, onChange, onSubmit }, ref) => {
    const hostRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    // Refs so the CodeMirror listener (registered once) always calls the latest
    // callbacks. Without this, the closure captures the original `onChange`
    // with stale `status === 'idle'` and live-mode never recompiles.
    const onChangeRef = useRef(onChange);
    const onSubmitRef = useRef(onSubmit);
    onChangeRef.current = onChange;
    onSubmitRef.current = onSubmit;

    useEffect(() => {
      if (!hostRef.current) return;

      const submitKey = keymap.of([
        {
          key: 'Mod-Enter',
          run: (view) => {
            onSubmitRef.current(view.state.doc.toString());
            return true;
          },
        },
      ]);

      const state = EditorState.create({
        doc: initialCode,
        extensions: [
          lineNumbers(),
          history(),
          highlightActiveLine(),
          javascript(),
          knobPlugin,
          miniGridPlugin,
          flashField,
          keymap.of([...defaultKeymap, ...historyKeymap]),
          submitKey,
          EditorView.lineWrapping,
          EditorView.theme({
            '&': { height: '100%', background: 'var(--panel)' },
            '.cm-scroller': {
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: '13px',
              lineHeight: '1.6',
              color: 'var(--text)',
            },
            '.cm-gutters': {
              background: 'transparent',
              border: 'none',
              color: 'var(--muted)',
            },
            '.cm-activeLine': { background: 'rgba(124,92,255,0.08)' },
            '.cm-activeLineGutter': { background: 'transparent' },
            '&.cm-focused': { outline: 'none' },
            '.cm-content': { caretColor: 'var(--accent)' },
          }),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) onChangeRef.current(u.state.doc.toString());
          }),
        ],
      });

      const view = new EditorView({ state, parent: hostRef.current });
      viewRef.current = view;
      return () => {
        view.destroy();
        viewRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      insertAtCursor(text: string) {
        const view = viewRef.current;
        if (!view) return;
        const { from, to } = view.state.selection.main;
        view.dispatch({
          changes: { from, to, insert: text },
          selection: { anchor: from + text.length },
        });
        view.focus();
      },
      getCode() {
        return viewRef.current?.state.doc.toString() ?? '';
      },
      setCode(code: string) {
        const view = viewRef.current;
        if (!view) return;
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: code },
        });
      },
      flash(from: number, to: number) {
        const view = viewRef.current;
        if (!view) return;
        flashRange(view, from, to);
      },
    }));

    return <div ref={hostRef} className="strudel-editor" />;
  },
);
