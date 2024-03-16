import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { Schema, DOMParser } from 'prosemirror-model';
import { parsePluginConfig } from './libs/plugin';
import { Plugin } from 'prosemirror-state';
import { history } from 'prosemirror-history';
import { createSchema, updateSchema } from './schema/normalize';
import { basicSchema } from './schema/basic';
import { EventChannel, IEventChannel } from './event';
import { IToolType } from './toolbar';
import { FPlugin } from './schema/plugin';
import { SchemaMeta } from './schema/schema';
import { parseHTML } from './transformers';
import { StringMap } from './libs/types';

interface IEditorProps {
  emitter?: EventChannel;
  disabled?: boolean;
  content?: string;
  toolbar?: IToolType;
  onBlur?: () => void;
  onFocus?: () => void;
}
class CoreEditor {
  public root: HTMLElement;
  public view: EditorView;
  public schema: Schema = createSchema(basicSchema);
  private pluginConfig: Array<any>;
  private pluginInstances: FPlugin[] = [];
  public domParser?: DOMParser;
  public emitter: EventChannel = new EventChannel();

  public plugins: Array<Plugin> = [history()];

  constructor(
    root: HTMLElement,
    pluginConfig: Array<any> = [],
    config: IEditorProps = {},
  ) {
    const { content } = config;
    this.root = root;
    this.pluginConfig = pluginConfig;
    this.update(config);
    this.view = new EditorView(this.root, {
      state: EditorState.create({
        schema: this.schema,
      }),
    });

    this.initManager();

    if (content) {
      if (typeof content === 'string') this.setHTML(content);
      else this.setContent(content);
    }

    this.view.dom.addEventListener('blur', this.listenBlur);
    this.view.dom.addEventListener('focus', this.listenFocus);

    this.emit(EventChannel.editorEvent.EDITOR_CREATED);
  }
  public setContent(content: StringMap<any>) {
    const state: EditorState = EditorState.fromJSON(this.view.state, content);
    this.view.updateState(state);
  }

  public setHTML(html: string) {
    const docNode = this.domParser?.parse(parseHTML(html));
    const { view } = this;
    const newState = EditorState.create({
      schema: view.state.schema,
      storedMarks: view.state.storedMarks,
      plugins: view.state.plugins,
      doc: docNode,
    });
    view.updateState(newState);
  }

  // plugin
  public installPlugins() {
    const { initedPlugins, keyMaps, commands } = parsePluginConfig(
      this.pluginConfig,
      this,
    );
    this.pluginInstances = initedPlugins;
    this.schema = createSchema(
      updateSchema(
        this.schema.spec,
        this.pluginInstances
          .map((plugin) => plugin.$schemaMeta)
          .filter((p) => p) as SchemaMeta[],
      ),
    );

    const newState = EditorState.create({
      schema: this.schema,
      plugins: this.plugins,
    });
  }
  public update(config: IEditorProps) {
    // todo: update config
  }

  private constructParser() {
    const domParse = DOMParser.fromSchema(this.view.state.schema);
    /* const originParseSlice = domParse.parseSlice.bind(domParse);
    domParse.parseSlice = (dom: HTMLElement, _option) => {

      handleDOMSpec(dom);
      const slice = originParseSlice(dom, _option);
      removeBrInEnd(slice);
      return slice;
    };
 */
    this.domParser = domParse;
  }

  private listenBlur = () => {
    this.emit('blur');
  };

  private listenFocus = () => {
    this.emitter.emit('focus');
  };

  // event channel
  public emit = (event: string | symbol, ...args: any[]) => {
    this.emitter.emit(event, ...args);
  };
  public on = (
    event: IEventChannel['editorEvent'],
    listener: (...args: any[]) => void,
  ) => {
    this.emitter.on(event, listener);
  };
  public off = (
    event: IEventChannel['editorEvent'],
    listener: (...args: any[]) => void,
  ) => {
    this.emitter.off(event, listener);
  };
  private initManager() {
    this.constructParser();
    this.installPlugins();
  }
  // event channel end
}

export { CoreEditor };
export type { IEditorProps };
