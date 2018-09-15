interface ThemeInterface {
  colors: {
    primary: string;
    error: string;
  };
}

const Theme: ThemeInterface = {
  colors: {
    primary: 'hsl(220, 94%, 16%)',
    error: 'hsl(357, 91%, 55%)',
  },
};

export { ThemeInterface };
export default Theme;
