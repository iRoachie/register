import * as styledComponents from 'styled-components';
import { ThemeInterface } from 'config';

const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<
  ThemeInterface
>;

export { css, injectGlobal, keyframes, ThemeProvider };
export default styled;
