import { etherScanGet } from './base';

type Block = string;

// Returns up to a maximum of the last 10000 transactions only
export const getBlockByTimestamp = (
  // timestamp format: Unix timestamps in seconds
  timestamp: number,
  // Round to the block after or before the timestamp
  closest: 'before' | 'after'
) =>
  etherScanGet<Block>('block', 'getblocknobytime', {
    timestamp,
    closest,
  });
