import { EditorView } from 'prosemirror-view';
import { FrankyEditor } from './editor';
import { DOMParser } from 'prosemirror-model';
import { StringMap } from './libs/types';
import { EditorState } from 'prosemirror-state';
import { IToolType } from './toolbar';

interface options {
  toolbar: StringMap<IToolType>;
  content: string;
}

class FrankyApi {
  public root: HTMLElement;
  public editor: FrankyEditor;
  public view: EditorView;
  public domParser: DOMParser;

  constructor(editor: FrankyEditor, { toolbar, content }: options) {
    this.editor = editor;
    this.root = editor.root;
    this.view = editor.view;
    this.domParser = this.editor.domParser!;
    this.editor.init(this, { toolbar });

    if (content) {
      // if (typeof content === 'string') this.setHTML(content);
    }

    this.view.dom.addEventListener('blur', this.listenBlur);
    this.view.dom.addEventListener('focus', this.listenFocus);
  }
  public listenBlur = () => {
    this.editor.emit('blur');
  };
  public listenFocus = () => {
    this.editor.emit('focus');
  };
  public setContent(value: StringMap<any>) {
    const state: EditorState = EditorState.fromJSON(this.view.state, value);
    this.view.updateState(state);
  }
}

export { FrankyApi };
