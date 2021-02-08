import { wait } from '../../utils/wait';

const BASE_URL = 'https://api.coingecko.com/api/v3';

type QueryParams = { [key: string]: unknown };

// Coingecko has a ratelimit of 100 req/minute.
// So we make sure that RETRY_DELAY * MAX_RETRIES is at least a 60s for good measure
const RETRY_DELAY = 10000;
const MAX_RETRIES = 10;

export const coinGeckoGet = async <Result extends unknown>(
  endpoint: string,
  queryParams?: QueryParams,
  retry: number = 0
): Promise<Result> => {
  const queryString = queryParams
    ? Object.entries(queryParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
    : null;

  const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);

  // Ratelimit throttle
  if (response.status === 429) {
    console.warn(`Coingecko request "${endpoint}" failed due to ratelimit retry: ${retry}`);
    if (retry > MAX_RETRIES) {
      console.error('Errored on ratelimit');
      throw new Error('Throttled');
    }
    await wait(RETRY_DELAY);
    return coinGeckoGet(endpoint, queryParams, retry + 1);
  }

  const result: Result = await response.json();

  return result;
};
