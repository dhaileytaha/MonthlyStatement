export const formatUsd = (value?: number | null) => {
  if (value == null) {
    return value;
  }

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
};
