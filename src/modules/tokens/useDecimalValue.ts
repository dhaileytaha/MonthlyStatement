import { BigNumber } from 'bignumber.js';
import { formatValue } from './formatValue';

/**
 * This hooks wraps the formatValue function and returns null values as fallback
 */
export const useDecimalValue = ({
  value,
  decimals,
  precision,
}: {
  value?: BigNumber;
  decimals?: number;
  precision?: number | false;
}) => {
  if (!value) {
    return { decimalValue: null, roundedValue: null };
  }

  const roundedValue = formatValue(value, decimals, precision);
  const decimalValue = formatValue(value, decimals, false);

  return { decimalValue, roundedValue };
};
