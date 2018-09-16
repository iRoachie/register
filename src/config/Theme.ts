interface ThemeInterface {
  colors: {
    primary: string;
    error: string;
  };
  border: string;
  sidebarWidth: string;
}

const Theme: ThemeInterface = {
  colors: {
    primary: 'hsl(209, 100%, 54%)',
    error: 'hsl(357, 91%, 55%)',
  },
  sidebarWidth: '200px',
  border: '1px solid rgba(0,0,0,0.1)',
};

export { ThemeInterface };
export default Theme;
