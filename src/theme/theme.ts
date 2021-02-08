import 'styled-components';

const colors = {
  primary: '#442db7',
  background: 'linear-gradient(166deg, #002853 0%, #44488E 30%, #212853 100%)',
  text: '#333333',
  error: '#d32421',
  positive: '#12b759',
  negative: '#d32421',
};

const fonts = {
  normal: "'Roboto', sans-serif",
  heading: "'Montserrat', sans-serif",
};

export const theme = {
  colors,
  fonts,
} as const;

// Define the theme type in styled-components
declare module 'styled-components' {
  type Theme = typeof theme;
  export interface DefaultTheme extends Theme {}
}
