import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { Schema, DOMParser } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { history } from 'prosemirror-history';
import { createSchema } from './schema/normalize';
import { basicSchema } from './schema/basic';
import { EventChannel, IEventChannel } from './event';
import { FrankyApi } from './api';
import { IToolType } from './toolbar';

type IBaseConfig = {
  emitter: EventChannel;
  disabled: boolean;
};
type IOptions = {
  toolbar?: IToolType;
};

// type IPluginConfig = {

// }
class FrankyEditor {
  public root: HTMLElement;
  public view: EditorView;
  public schema: Schema = createSchema(basicSchema);
  private pluginConfig: Array<any>;
  public domParser?: DOMParser;
  public baseConfig: IBaseConfig = {
    emitter: new EventChannel(),
    disabled: false,
  };
  public plugins: Array<Plugin> = [history()];

  constructor(root: HTMLElement, pluginConfig: Array<any> = [], config = []) {
    this.root = root;
    this.pluginConfig = pluginConfig;
    this.view = new EditorView(this.root, {
      state: EditorState.create({
        schema: this.schema,
      }),
    });
  }
  // plugin
  // public installPlugins(api) {

  // }
  public init(api: FrankyApi, initOptions: IOptions = {}) {
    // this.installPlugins();
    // this.installToolbar(initOptions.toolbar);
  }

  // event channel
  public emit = (event: string | symbol, ...args: any[]) => {
    this.baseConfig.emitter.emit(event, ...args);
  };
  public on = (
    event: IEventChannel['editorEvent'],
    listener: (...args: any[]) => void,
  ) => {
    this.baseConfig.emitter.on(event, listener);
  };
  public off = (
    event: IEventChannel['editorEvent'],
    listener: (...args: any[]) => void,
  ) => {
    this.baseConfig.emitter.off(event, listener);
  };
  // event channel end
}

export { FrankyEditor };
