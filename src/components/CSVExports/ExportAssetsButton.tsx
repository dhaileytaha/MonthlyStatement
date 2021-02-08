import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useCallback } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { useCoinContext } from '../../context/CoinContext';
import { useStatementContext } from '../../context/StatementContext';
import { makeAssetsExport } from './makeAssetsExport';

interface ExportAssetsButtonProps {
  children?: React.ReactNode;
}

export const ExportAssetsButton = ({ children }: ExportAssetsButtonProps) => {
  // TODO: make the makeTransaction and dependencies into a hook, and remove these context dependency over there
  const { startAssetsData, endAssetsData, startDate, endDate } = useStatementContext();

  const startTokenAndPrices = startAssetsData.tokensAndPrices;
  const startTotalValue = startAssetsData.totalValueOfAllTokens;
  const endTokenAndPrices = endAssetsData.tokensAndPrices;
  const endTotalValue = endAssetsData.totalValueOfAllTokens;

  const [isMakeAssetsExport, setIsMakeAssetsExport] = useState(false);
  const [AssetsExportError, setAssetsExportError] = useState<Error | null>(null);

  const isFetchedStartAssets =
    !startAssetsData.isFetching && (startAssetsData.hasFetched || startAssetsData.tokensAndPrices?.length === 0) && !startAssetsData.error;
  const isFetchedEndAssets =
    !endAssetsData.isFetching && (endAssetsData.hasFetched || endAssetsData.tokensAndPrices?.length === 0) && !endAssetsData.error;
  const canDownloadTransactions = isFetchedStartAssets && isFetchedEndAssets;

  const handleMakeAssetsExport = useCallback(async () => {
    setIsMakeAssetsExport(true);
    setAssetsExportError(null);

    try {
      await makeAssetsExport(
        startTokenAndPrices,
        endTokenAndPrices,
        startTotalValue,
        endTotalValue,
        startDate,
        endDate
      );
    } catch (error) {
      setAssetsExportError(error);
    } finally {
      setIsMakeAssetsExport(false);
    }
  }, [startTokenAndPrices, endTokenAndPrices]);

  return (
    <OverlayTrigger overlay={<Tooltip id={`tooltip`}>Download assets</Tooltip>}>
      <Button
        onClick={handleMakeAssetsExport}
        disabled={!canDownloadTransactions || isMakeAssetsExport}
        variant={AssetsExportError ? 'danger' : 'primary'}
      >
        {AssetsExportError ? (
          'Error, please try again'
        ) : isMakeAssetsExport ? (
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
        ) : (
          <FontAwesomeIcon icon={faDownload} />
        )}
      </Button>
    </OverlayTrigger>
  );
};
