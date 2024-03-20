import { IEditorProps, CoreEditor } from './core-editor';
import { IPluginConfig } from './schema/plugin';

interface IEdtorOptions extends Partial<IEditorProps> {
  plugins?: IPluginConfig[];
  disabled?: boolean;
  getEditor?: (editor: IEditorProps) => void;
}

const updateEditorConfig = (
  editor: CoreEditor,
  newConfig: Partial<IEdtorOptions>,
) => {
  editor.update({ ...newConfig });
};

const initEditor = (mount: HTMLElement, options: IEdtorOptions) => {
  const { plugins } = options;
  const editor = new CoreEditor(mount, plugins, options);
  options.getEditor?.(editor);
  return editor;
};
const FrankyEditorService = {
  initEditor,
  updateEditorConfig,
};

export { FrankyEditorService };
export type { IEdtorOptions };
