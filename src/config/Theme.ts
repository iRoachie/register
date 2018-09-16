interface ThemeInterface {
  colors: {
    primary: string;
    error: string;
  };
  sidebarWidth: string;
}

const Theme: ThemeInterface = {
  colors: {
    primary: 'hsl(209, 100%, 54%)',
    error: 'hsl(357, 91%, 55%)',
  },
  sidebarWidth: '200px',
};

export { ThemeInterface };
export default Theme;
