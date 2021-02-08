import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useCallback } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { useCoinContext } from '../../context/CoinContext';
import { useStatementContext } from '../../context/StatementContext';
import { makeTransactionExport } from './makeTransactionExport';

interface ExportTransactionButtonProps {
  children?: React.ReactNode;
}

export const ExportTransactionButton = ({ children }: ExportTransactionButtonProps) => {
  // TODO: make the makeTransaction and dependencies into a hook, and remove these context dependency over there
  const { runningBalances, startDate, endDate } = useStatementContext();
  const { coins } = useCoinContext();

  const [isMakeTransactionExport, setIsMakeTransactionExport] = useState(false);
  const [transactionExportError, setTransactionExportError] = useState<Error | null>(null);

  const { isFetching, hasFetched, error, transactionsWithinDateRange } = useStatementContext();

  const isFetchedTransactions = !isFetching && hasFetched && !error;
  const canDownloadTransactions = isFetchedTransactions;

  const handleMakeTransactionExport = useCallback(async () => {
    setIsMakeTransactionExport(true);
    setTransactionExportError(null);

    try {
      await makeTransactionExport(
        transactionsWithinDateRange,
        startDate,
        endDate,
        coins!,
        runningBalances ?? undefined
      );
    } catch (error) {
      setTransactionExportError(error);
    } finally {
      setIsMakeTransactionExport(false);
    }
  }, [transactionsWithinDateRange]);

  return (
    <OverlayTrigger overlay={<Tooltip id={`tooltip`}>Download transactions</Tooltip>}>
      <Button
        onClick={handleMakeTransactionExport}
        disabled={!canDownloadTransactions || isMakeTransactionExport}
        variant={transactionExportError ? 'danger' : 'primary'}
      >
        {transactionExportError ? (
          'Error, please try again'
        ) : isMakeTransactionExport ? (
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
        ) : (
          <FontAwesomeIcon icon={faDownload} />
        )}
      </Button>
    </OverlayTrigger>
  );
};
