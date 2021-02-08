import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { getCoinMarketChart } from '../../api/coingecko/coins';
import { MIGRATED_COINGECKO_TOKENID } from '../../data/tokenMigrations';

export const fetchCoinPriceFromCoinGecko = async (id: string, date: Date) => {
  if (id === MIGRATED_COINGECKO_TOKENID) {
    const timestamp = dayjs(date).valueOf();
    const price = 0;
    return {
      timestamp,
      price,
    };
  }

  const startDate = dayjs(date).startOf('day').toDate();
  const endDate = dayjs(date).endOf('day').toDate();

  const dayMarketPrices = await getCoinMarketChart(id, startDate, endDate);
  const unixTimestampToMatch = dayjs(date).valueOf();

  let upperBoundMatchIndex = dayMarketPrices.prices.findIndex(
    ([timestamp]) => timestamp >= unixTimestampToMatch
  );

  if (upperBoundMatchIndex === -1) {
    upperBoundMatchIndex = dayMarketPrices.prices.length - 1;
  }

  if (upperBoundMatchIndex === -1) {
    return;
  }

  const lowerBoundMatchIndex = Math.max(upperBoundMatchIndex - 1, 0);
  const differenceUpperBound = Math.abs(
    dayMarketPrices.prices[upperBoundMatchIndex][0] - unixTimestampToMatch
  );
  const differenceLowerBound = Math.abs(
    dayMarketPrices.prices[lowerBoundMatchIndex][0] - unixTimestampToMatch
  );

  let closestMatchTimestamp;
  let closestMatchPrice;
  if (differenceUpperBound < differenceLowerBound) {
    closestMatchTimestamp = dayMarketPrices.prices[upperBoundMatchIndex][0];
    closestMatchPrice = dayMarketPrices.prices[upperBoundMatchIndex][1];
  } else {
    closestMatchTimestamp = dayMarketPrices.prices[lowerBoundMatchIndex][0];
    closestMatchPrice = dayMarketPrices.prices[lowerBoundMatchIndex][1];
  }

  return { price: closestMatchPrice, timestamp: closestMatchTimestamp };
};

/**
 * Note we need to make an exception for Elrond swaps as they had a contract migration from ELD to EGLD
 * We still have ELD, but want to use the price from EGLD / 1000
 */
const fetchPriceForElrond = async (date: Date) => {
  const id = 'elrond-erd';
  const idElrondGold = 'elrond-erd-2';
  const conversionRate = 1000;
  const contractMigration = new Date('2020-09-03 11:00:00 UTC');

  if (dayjs(date).isBefore(contractMigration)) {
    return fetchCoinPriceFromCoinGecko(id, date);
  } else {
    const result = await fetchCoinPriceFromCoinGecko(idElrondGold, date);
    if (!result) {
      return;
    }
    return {
      price: result.price / conversionRate,
      timestamp: result.timestamp,
    };
  }
};

export const fetchPriceCall = async (id: string, date: Date) => {
  let result:
    | {
        price: number;
        timestamp: number;
      }
    | undefined;

  if (id === 'elrond-erd') {
    result = await fetchPriceForElrond(date);
  } else {
    result = await fetchCoinPriceFromCoinGecko(id, date);
  }

  if (!result) {
    throw new Error('No Result');
  }

  return result;
};

export const useCoinDetails = (tokenId?: string, date?: Date) => {
  const [isFetching, setIsFetching] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<number | null>(null);

  const fetchPrice = useCallback(async (id: string, date: Date) => {
    setIsFetching(true);
    try {
      const result = await fetchPriceCall(id, date);
      setPrice(result.price);
      setTimestamp(result.timestamp);
      setHasFetched(true);
    } catch (error) {
      console.error('Error in fetchPrice', error);
      setError(error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    setPrice(null);
    setTimestamp(null);
    setError(null);
    setHasFetched(false);
    setIsFetching(false);
  }, [tokenId, date]);

  useEffect(() => {
    if (tokenId && date) {
      fetchPrice(tokenId, date);
    }
  }, [tokenId, date, fetchPrice]);

  return {
    price,
    timestamp,
    isFetching,
    hasFetched,
    error,
  };
};

export const useMultipleCoinDetails = (tokenIds: (string | undefined)[], date?: Date) => {
  const [isFetching, setIsFetching] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [coinPrices, setCoinPrices] = useState<(number | undefined)[]>([]);
  const [coinTimestamps, setCoinTimestamps] = useState<(number | undefined)[]>([]);

  const fetchPrices = useCallback(async (ids: (string | undefined)[], date: Date) => {
    setIsFetching(true);

    const requests = ids.map(async (id) => {
      if (!id) {
        return;
      }
      try {
        const result = await fetchPriceCall(id, date);
        return result;
      } catch (error) {
        console.error('Error in fetchPrices');
      }
    });

    try {
      const result = await Promise.all(requests);
      setCoinPrices(result.map((singleResult) => singleResult?.price));
      setCoinTimestamps(result.map((singleResult) => singleResult?.timestamp));
      setHasFetched(true);
    } catch (error) {
      console.error('Error in fetchPrices', error);
      setError(error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    setCoinPrices([]);
    setCoinTimestamps([]);
    setError(null);
    setHasFetched(false);
    setIsFetching(false);
  }, [tokenIds, date]);

  useEffect(() => {
    if (tokenIds.length && date) {
      fetchPrices(tokenIds, date);
    }
  }, [tokenIds, date, fetchPrices]);

  return {
    coinPrices,
    coinTimestamps,
    isFetching,
    hasFetched,
    error,
  };
};
