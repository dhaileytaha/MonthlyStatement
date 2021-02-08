import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';

export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
  return value !== null && value !== undefined;
};

export const sum = (a: number, b: number) => a + b;
export const bigNumberSum = (a: BigNumber, b: BigNumber) => a.plus(b);

export const sortTransactionBydate = <A extends { date: Date }, B extends { date: Date }>(
  a: A,
  b: B
) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf();
