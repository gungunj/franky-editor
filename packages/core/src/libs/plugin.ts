import { CoreEditor } from '../core-editor';
import { FPlugin, IPluginConfig } from '../schema/plugin';
import { StringMap } from './types';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

const wrapKeymap = (adapter: CoreEditor, keyMaps: StringMap<any>) =>
  Object.keys(keyMaps).reduce((result, key) => {
    result[key] = (
      state: EditorState,
      dispatch: EditorView['dispatch'],
      view: EditorView,
    ) => keyMaps[key](adapter, state, dispatch, view);
    return result;
  }, {} as StringMap<any>);

const parsePluginConfig = (
  pluginConfigs: IPluginConfig[],
  editor: CoreEditor,
) => {
  const initedPlugins: FPlugin[] = [];
  const keyMaps: StringMap<any> = [];
  const commands: StringMap<any> = {};

  const registerPlugin = (plugin: FPlugin) => {
    plugin.init(editor, {});
    initedPlugins.push(plugin);

    const pluginKeyMap = plugin?.$controller?.keymap;
    pluginKeyMap && keyMaps.push(wrapKeymap(editor, pluginKeyMap));
    const pluginCommand = plugin?.$controller?.command;
    pluginCommand && commands.push(pluginCommand);
  };
  const parseConfig = (config: IPluginConfig) => {
    registerPlugin(config.plugin);
  };
  pluginConfigs.forEach(parseConfig);
  return {
    initedPlugins,
    keyMaps,
    commands,
  };
};

export { parsePluginConfig };
