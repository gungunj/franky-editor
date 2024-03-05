import { FrankyEditorApi } from '..';

type FormattableType = new (
  editor: FrankyEditorApi,
  props: any,
) => Formattable<any>;

class FrankPlugin<T = any> {
  public name: string = '';
  public Schema: T;
}

export { FrankPlugin };
