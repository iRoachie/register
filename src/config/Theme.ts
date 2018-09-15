interface ThemeInterface {
  colors: {
    primary: string;
    error: string;
  };
  sidebarWidth: string;
}

const Theme: ThemeInterface = {
  colors: {
    primary: 'hsl(190, 40%, 41%)',
    error: 'hsl(357, 91%, 55%)',
  },
  sidebarWidth: '200px',
};

export { ThemeInterface };
export default Theme;
