export const MIGRATED_COINGECKO_TOKENID = 'Migrated';

interface TokenMigrationToken {
  name: string;
  symbol: string;
  decimals: number;
  contractAddress: string;
  coingeckoId: string;
}
export interface TokenMigration {
  date: Date;
  oldToken: TokenMigrationToken;
  newToken: TokenMigrationToken;
  renamedOldToken: TokenMigrationToken;
  readMore?: string;
}
export type TokenMigrations = TokenMigration[];
/**
 * List of all token migrations that we want to consider.
 * Note: for the renamedOldToken, we assign a manual coingeckoId. So we can check on this when we fetch prices
 */
export const tokenMigrations: TokenMigrations = [
  {
    date: new Date('2020-09-30'),
    oldToken: {
      name: 'UTRUST',
      symbol: 'UTK',
      decimals: 18,
      contractAddress: '0x70a72833d6bf7f508c8224ce59ea1ef3d0ea3a38',
      coingeckoId: 'utrust',
    },
    newToken: {
      name: 'Utrust Token',
      symbol: 'UTK',
      decimals: 18,
      contractAddress: '0xdc9ac3c20d1ed0b540df9b1fedc10039df13f99c',
      coingeckoId: 'utrust',
    },
    renamedOldToken: {
      name: 'Old Utrust Token',
      symbol: 'OLD UTK',
      decimals: 18,
      contractAddress: '0x70a72833d6bf7f508c8224ce59ea1ef3d0ea3a38',
      coingeckoId: MIGRATED_COINGECKO_TOKENID,
    },
    readMore: 'https://utrust.com/token-swap-lp/',
  },
  {
    date: new Date('2020-10-07'),
    oldToken: {
      name: 'Parsiq Token',
      symbol: 'PRQ',
      decimals: 18,
      contractAddress: '0xfe2786d7d1ccab8b015f6ef7392f67d778f8d8d7',
      coingeckoId: 'parsiq',
    },
    newToken: {
      name: 'Parsiq Token',
      symbol: 'PRQ',
      decimals: 18,
      contractAddress: '0x362bc847a3a9637d3af6624eec853618a43ed7d2',
      coingeckoId: 'parsiq',
    },
    renamedOldToken: {
      name: 'Old Parsiq Token',
      symbol: 'OLD PRQ',
      decimals: 18,
      contractAddress: '0x70a72833d6bf7f508c8224ce59ea1ef3d0ea3a38',
      coingeckoId: MIGRATED_COINGECKO_TOKENID,
    },
    readMore: 'https://blog.parsiq.net/coinmetro-hack-mitigation-prq-token-migration-faq/',
  },
];
