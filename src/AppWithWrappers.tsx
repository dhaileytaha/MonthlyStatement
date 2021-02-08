import React from 'react';
import { ThemeProvider } from 'styled-components';
import App from './App';
import { CoinContextProvider } from './context/CoinContext';
import { GlobalStyle } from './theme/globalStyle';
import { theme } from './theme/theme';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-datepicker/dist/react-datepicker.css';

export const AppWithWrappers = () => {
  return (
    <React.StrictMode>
      <CoinContextProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <App />
        </ThemeProvider>
      </CoinContextProvider>
    </React.StrictMode>
  );
};
