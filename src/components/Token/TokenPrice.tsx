import React from 'react';
import { Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { formatUsd } from '../../utils/formatUsd';
import { InlineLoader } from '../InlineLoader';

/**
 * Displays the token price (excludes fetching)
 */
export const TokenPrice = ({
  decimalValue,
  symbol,
  usdPrice,
  valueInUsd,
  isFetching,
  error,
}: {
  decimalValue: number;
  symbol: string;
  usdPrice?: number | null;
  valueInUsd?: number | null;
  isFetching?: boolean | null;
  error?: Error | null;
}) => {
  return (
    <OverlayTrigger
      delay={250}
      placement="bottom"
      overlay={
        <Popover id="tooltip">
          <Popover.Content>
            Amount: {decimalValue} {symbol}
            <br />
            Price per coin: {usdPrice != null ? formatUsd(usdPrice) : 'n/a'}
            <br />
            Total price: {valueInUsd != null ? formatUsd(valueInUsd) : 'n/a'}
            <br />
          </Popover.Content>
        </Popover>
      }
    >
      <span>
        {valueInUsd != null
          ? `${valueInUsd.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
            })}`
          : null}
        {isFetching ? <InlineLoader /> : null}
        {error ? <Badge variant="danger">Error</Badge> : null}
      </span>
    </OverlayTrigger>
  );
};
