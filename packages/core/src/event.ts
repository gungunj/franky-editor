import { EventEmitter } from 'eventemitter3';

enum EditorEvent {
  EDITOR_CREATED = 'editor-created',
  TEXT_CHANGED = 'text-change',
  SELECTION_CHANGED = 'selection-change',
  ON_CHANGE = 'state-change',
  ON_BLUR = 'blur',
  ON_FOCUS = 'focus',
  EDITOR_WILL_UNMOUNT = 'editor-will-unmount',
}

class EventChannel extends EventEmitter {
  static editorEvent = EditorEvent;
}

type IEventChannel = {
  editorEvent: EditorEvent;
};

export { EditorEvent, EventChannel };
export type { IEventChannel };
