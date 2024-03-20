// eslint-disable-next-line import/no-unresolved
import { FrankyEditorService, IEdtorOptions } from '@franky-editor/core';
import { useMount } from 'ahooks';
import React, { useEffect, useRef } from 'react';

function FrankyEditor(props: IEdtorOptions) {
  const mountDom = React.useRef<HTMLDivElement | null>(null);
  const editor = useRef<any>(null);
  useMount(() => {
    mountDom.current &&
      !editor.current &&
      (editor.current = FrankyEditorService.initEditor(
        mountDom.current,
        props,
      ));
  });
  return (
    <div
      className="syl-editor"
      ref={(el) => (mountDom.current = el)}
      style={{ position: 'relative' }}
    />
  );
}

export { FrankyEditor };
