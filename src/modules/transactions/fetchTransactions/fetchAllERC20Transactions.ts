import { ERC20Transactions, getAllERC20Transactions } from '../../../api/etherscan/accounts';
import { TokenDefinition } from '../../../components/Token';
import { wait } from '../../../utils/wait';

export const erc20TokensByContractAddress = new Map<string, TokenDefinition>();

export const fetchAllERC20Transactions = async ({ address }: { address: string }) => {
  // Note: we fetch the complete history to calculate the assets afterwards
  const startBlock = 0;
  const endBlock = 99999999;
  const batchSize = 1000;
  let isFetching = true;
  let fetchesBeforeTimeout = 0;
  let page = 1;
  let transactions: ERC20Transactions = [];

  while (isFetching) {
    const newTransactions = await getAllERC20Transactions(
      address,
      startBlock,
      endBlock,
      page,
      batchSize
    );
    transactions = [...transactions, ...newTransactions];
    fetchesBeforeTimeout += 1;
    page += 1;
    if (newTransactions.length !== batchSize) {
      isFetching = false;
      break;
    }
    if (fetchesBeforeTimeout === 5) {
      fetchesBeforeTimeout = 0;
      await wait(1000);
    }
  }

  transactions.forEach((transaction) => {
    erc20TokensByContractAddress.set(transaction.contractAddress, {
      name: transaction.tokenName,
      symbol: transaction.tokenSymbol,
      decimals: Number(transaction.tokenDecimal),
    });
  });

  return transactions;
};
