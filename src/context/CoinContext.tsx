import React, { useContext, useEffect, useState } from 'react';
import { Coin, getAllCoins } from '../api/coingecko/coins';

interface CoinContext {
  coins: Coin[] | null;
  hasFetched: boolean;
  isFetching: boolean;
  error: null | Error;
}

const CoinContext = React.createContext<CoinContext | null>(null);

export const CoinContextProvider: React.FC = ({ children }) => {
  const [hasFetched, setHasFetched] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [coins, setCoins] = useState<Coin[] | null>(null);

  useEffect(() => {
    const fetchAndSetCoins = async () => {
      setIsFetching(true);
      setError(null);

      try {
        const coins = await getAllCoins();
        setCoins(coins);
        setHasFetched(true);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchAndSetCoins();
  }, []);

  return (
    <CoinContext.Provider
      value={{
        coins,
        hasFetched,
        isFetching,
        error,
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};

export const useCoinContext = () => {
  const context = useContext(CoinContext);

  if (!context) {
    throw new Error('No Context Provider for CoinContext found');
  }

  return context;
};
