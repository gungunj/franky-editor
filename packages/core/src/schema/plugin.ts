import { FrankyEditor } from '../core-editor';
import { EventChannel } from '../event';
import { StringMap } from '../libs/types';
import { Controller } from './controller';
import { Formattable, SchemaMeta } from './schema';

type ControllerType = new (editor: FrankyEditor, props: any) => Controller<any>;
type FormattableType = new (editor: FrankyEditor, props: any) => Formattable<
  any,
  any
>;
class IPlugin<T = any> {
  public name: string = '';
}

type IPluginProps = {
  controllerProps?: StringMap<any>;
};
type IPluginConfig = {
  plugin: FPlugin;
  controllerProps?: StringMap<any>;
};

const createPluginSchema = (
  Schema: FormattableType,
  editor: FrankyEditor,
  props: StringMap<any>,
) => {
  const $schema = new Schema(editor, props);
  return {
    view: $schema.nodeView,
    schema: $schema,
  };
};
class FPlugin<T = any> {
  public name: string = '';
  public $controller: Controller<any> | null = null;
  public $schema: any = null;
  public $schemaMeta: SchemaMeta<any> | null = null;
  public editor: FrankyEditor | undefined;
  public Schema: FormattableType | null = null;
  public Controller: ControllerType = Controller;
  public $NodeView: Formattable['nodeView'] | null = null;

  private props: T | null = null;

  constructor(props?: T) {
    if (props) {
      this.props = props;
    }
  }

  public init(editor: FrankyEditor, options: IPluginProps) {
    this.editor = editor;
    const props = { ...this.props, ...options.controllerProps };
    if (this.Controller) {
      this.$controller = new this.Controller(editor, props);
      this.editor.on(
        EventChannel.editorEvent.EDITOR_WILL_UNMOUNT,
        this.$controller.editorWillUnmount,
      );
    }

    if (this.Schema) {
      const { view, schema } = createPluginSchema(
        this.Schema,
        this.editor,
        props,
      );
      this.$schema = schema;
      this.$NodeView = view;
    }
  }
}

export { FPlugin };
export type { IPluginConfig };
