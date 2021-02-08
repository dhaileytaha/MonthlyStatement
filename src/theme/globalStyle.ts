import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Montserrat&family=Roboto&display=swap');

:root{
  --primary: #00dd00;
}


  body {
    color: ${(props) => props.theme.colors.text};
    margin: 0;
    background: ${(props) => props.theme.colors.background};
    background-attachment: fixed;
    font-family:${(props) => props.theme.fonts.normal};
  }

  h1,h2,h3,h4,h5,h6{
    font-family:${(props) => props.theme.fonts.heading};
  }
`;
