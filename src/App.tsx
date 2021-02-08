import React from 'react';
import { Navigation } from './components/Navigation';
import { ErrorMessage } from './components/ErrorMessage';
import { Loader } from './components/Loader';
import { Statement } from './components/Statement';
import { useCoinContext } from './context/CoinContext';
import { StatementContextProvider } from './context/StatementContext';

const App = () => {
  const { isFetching, error } = useCoinContext();

  return (
    <div>
      <header>
        <Navigation />
      </header>
      <main style={{ marginTop: 50 }}>
        {isFetching ? (
          <Loader />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : (
          <div id="statement">
            <StatementContextProvider>
              <Statement />
            </StatementContextProvider>
          </div>
        )}
      </main>
      <footer></footer>
    </div>
  );
};

export default App;
