const formatSetHTML = (html: string) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  // // this replace break element with \n in codeblock
  // handleDOMSpec(div);
  // // used to avoid when `keepLastLine` is true, click after `setHTML` will cause emit confuse `text-change` event
  // config.keepLastLine && insertEmptyPTagAtTheEndOfHtml(div);
  // config.mergeEmpty && mergeContinuesEmptyLine(div);
  return div;
};

const parseHTML = (html: string) => {
  // const { view, baseConfig } = api.editor;
  // todo: config配置
  // const config = {};
  const htmlNode = formatSetHTML(html);

  // const docNode = api.domParser.parse(htmlNode);

  // removeBrInEnd(docNode);

  return htmlNode;
};

export { parseHTML };
