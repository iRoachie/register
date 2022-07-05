import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      error: string;
    };
    border: string;
    sidebarWidth: string;
    headerHeight: string;
  }
}
