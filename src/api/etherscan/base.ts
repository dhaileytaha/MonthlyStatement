const API_KEY = 'ER835NHR17PQJ7R9ZCU3XYFCK99HC6PGXG';
const BASE_URL = 'https://api.etherscan.io/api';

type QueryParams = { [key: string]: unknown };

enum ApiResponseStatus {
  NOTOK = '0',
  OK = '1',
}

interface ApiSuccessResponse<Result extends unknown> {
  result: Result;
  status: ApiResponseStatus.OK;
}

interface ApiErrorResponse<Result extends unknown> {
  result: string;
  status: ApiResponseStatus.NOTOK;
  message: string;
}

type ApiResponse<Result extends unknown> = ApiErrorResponse<Result> | ApiSuccessResponse<Result>;

export const etherScanGet = async <Result extends unknown>(
  module: string,
  action: string,
  queryParams: QueryParams
) => {
  const queryParamsWithApiKey: QueryParams = {
    module,
    action,
    ...queryParams,
    apiKey: API_KEY,
  };

  const queryString = Object.entries(queryParamsWithApiKey)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const url = `${BASE_URL}?${queryString}}`;

  const response = await fetch(url);
  const result: ApiResponse<Result> = await response.json();

  if (result.status === ApiResponseStatus.NOTOK) {
    throw new Error(`${typeof result.result === 'string' ? result.result : result.message}`);
  }

  return result.result;
};
