import BigNumber from 'bignumber.js';

const DEFAULT_PRECISION = 3;
const DEFAULT_DECIMALS = 18;

/**
 * Format the value, based on the provided number of decimalsPropTypes.any,
 * By default, a precision of 3 decimals is used, the precision argument can change it
 * When precision is set to false, no rounding is used and the full value is returned
 */
export const formatValue = (
  value: BigNumber,
  decimals: number = DEFAULT_DECIMALS,
  precision: number | false = DEFAULT_PRECISION
) => {
  const rawValue = value.dividedBy(10 ** decimals);
  const decimalValue = rawValue.toNumber();
  const roundedValue = precision === false ? decimalValue : Number(rawValue.toFixed(precision));

  return roundedValue;
};
