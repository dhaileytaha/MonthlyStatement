import React from 'react';
import { formatUsd } from '../utils/formatUsd';

interface CurrencyProps {
  value: number;
}

export const Currency = ({ value }: CurrencyProps) => {
  return <span>{formatUsd(value)}</span>;
};
