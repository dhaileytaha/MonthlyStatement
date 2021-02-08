import BigNumber from 'bignumber.js';
import { CombinedTransactions, TransactionType, TransactionStatus } from '..';
import { ERC20Transaction } from '../../../api/etherscan/accounts';
import { tokenMigrations } from '../../../data/tokenMigrations';
import { notEmpty } from '../../../utils/array';
import { getTokensAtDate } from '../../assets/getTokensAtDate';

const makeERC20Transaction = ({
  to,
  from,
  tokenDecimal,
  tokenName,
  tokenSymbol,
  value,
}: {
  to: string;
  tokenDecimal: number;
  tokenName: string;
  tokenSymbol: string;
  from: string;
  value: BigNumber;
}): ERC20Transaction => {
  return {
    blockNumber: '',
    contractAddress: '',
    from: from,
    gas: '',
    gasPrice: '',
    gasUsed: '',
    hash: '',
    input: '',
    timeStamp: '',
    to: to,
    value: value.toString(),
    blockHash: '',
    confirmations: '',
    cumulativeGasUsed: '',
    nonce: '',
    transactionIndex: '',
    tokenDecimal: tokenDecimal.toString(),
    tokenName: tokenName,
    tokenSymbol: tokenSymbol,
  };
};

export const makeMigrationTransactions = (
  address: string,
  transactions: CombinedTransactions
): CombinedTransactions => {
  const migrationTransactions = tokenMigrations.map((migration) => {
    const oldTokenAmount = getTokensAtDate(migration.oldToken.name, migration.date, transactions);

    if (!oldTokenAmount) {
      return null;
    }

    const transaction = {
      type: TransactionType.TokenMigration,
      transaction: null,
      erc20Transactions: [
        makeERC20Transaction({
          from: address,
          to: '',
          tokenSymbol: migration.oldToken.symbol,
          tokenDecimal: migration.oldToken.decimals,
          tokenName: migration.oldToken.name,
          value: oldTokenAmount.value,
        }),
        makeERC20Transaction({
          from: '',
          to: address,
          tokenSymbol: migration.renamedOldToken.symbol,
          tokenDecimal: migration.renamedOldToken.decimals,
          tokenName: migration.renamedOldToken.name,
          value: oldTokenAmount.value,
        }),
      ],
      internalTransactions: [],
      status: TransactionStatus.Success,
      originAddress: address,
      date: migration.date,
      migrationTransaction: migration,
    };

    return transaction;
  });

  return migrationTransactions.filter(notEmpty);
};
