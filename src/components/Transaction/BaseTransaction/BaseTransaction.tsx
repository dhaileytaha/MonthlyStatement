import { IconDefinition, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Badge, Collapse } from 'react-bootstrap';
import { CombinedTransaction } from '../../../modules/transactions/combineTransactions/combineTransactions';
import { Address } from '../../Address';
import { ExternalLink } from '../../ExternalLink';
import { Token } from '../../Token';
import { Tx } from '../../Tx';
import {
  WrapperRow,
  IconColumn,
  VerticalLine,
  IconWrapper,
  ContentRow,
  ContentRowTop,
  TitleColumn,
  Title,
  DateString,
  TransactionColumn,
  DebitValue,
  CreditValue,
  GasValue,
  ExpandColumn,
  ExpandButton,
  ContentRowExpanded,
  ContentRowExpandedInner,
  DetailsList,
} from './styledComponents';

interface BaseTransactionProps {
  title: string;
  date: Date;
  debitToken?: Token;
  creditToken?: Token;
  gas?: BigNumber | null;
  from?: string | null;
  to?: string | null;
  contract?: string | null;
  details?: string | null;
  oldContract?: string | null;
  newContract?: string | null;
  readMore?: string | null;
  address?: string | null;
  hash?: string;
  isError: boolean;
  index: number;
  icon: IconDefinition;
  // Provide CombinedTransaction for debugging access
  transaction: CombinedTransaction;
}
export const BaseTransaction = ({
  title,
  date,
  debitToken,
  creditToken,
  gas,
  from,
  to,
  hash,
  isError,
  index,
  icon,
  contract,
  transaction,
  details,
  oldContract,
  newContract,
  readMore,
  address,
}: BaseTransactionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dateString = dayjs(date).format('MMMM D, YYYY HH:mm:ss');

  return (
    <WrapperRow>
      <IconColumn>
        <VerticalLine index={index} />
        <IconWrapper>
          <FontAwesomeIcon fixedWidth icon={icon} />
        </IconWrapper>
      </IconColumn>
      <ContentRow>
        <ContentRowTop>
          <TitleColumn>
            <Title isError={isError}>
              {title}
              {isError && (
                <>
                  {' '}
                  <Badge variant="danger">Failed</Badge>
                </>
              )}
            </Title>
            <DateString> {dateString}</DateString>
          </TitleColumn>
          <TransactionColumn>
            {debitToken && !isError && (
              <DebitValue>
                +{' '}
                <Token
                  value={debitToken.value}
                  decimals={debitToken.decimals}
                  symbol={debitToken.symbol}
                  name={debitToken.name}
                  date={date}
                />
              </DebitValue>
            )}
            {creditToken && !isError && (
              <CreditValue>
                -{' '}
                <Token
                  value={creditToken.value}
                  decimals={creditToken.decimals}
                  symbol={creditToken.symbol}
                  name={creditToken.name}
                  date={date}
                />
              </CreditValue>
            )}
            {gas && (
              <GasValue>
                fee:{' '}
                <Token
                  value={new BigNumber(gas)}
                  decimals={18}
                  symbol={'ETH'}
                  name="Ethereum"
                  date={date}
                />
              </GasValue>
            )}
          </TransactionColumn>

          <ExpandColumn>
            <ExpandButton onClick={() => setIsExpanded(!isExpanded)}>
              <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
            </ExpandButton>
          </ExpandColumn>
        </ContentRowTop>
        <Collapse in={isExpanded}>
          <ContentRowExpanded>
            <ContentRowExpandedInner>
              <DetailsList>
                {details && (
                  <li style={{ display: 'flex' }}>
                    <div style={{ marginRight: 8 }}>Details: </div>
                    <div>{details}</div>
                  </li>
                )}
                {hash && (
                  <li>
                    Transaction: <Tx hash={hash} />
                  </li>
                )}
                {from && (
                  <li>
                    From: <Address address={from} />
                  </li>
                )}
                {to && (
                  <li>
                    To: <Address address={to} />
                  </li>
                )}
                {address && (
                  <li>
                    Address: <Address address={address} />
                  </li>
                )}
                {contract && (
                  <li>
                    Contract: <Address address={contract} />
                  </li>
                )}
                {newContract && (
                  <li>
                    New contract: <Address address={newContract} />
                  </li>
                )}
                {oldContract && (
                  <li>
                    Old contract: <Address address={oldContract} />
                  </li>
                )}
                {readMore && (
                  <li>
                    <ExternalLink href={readMore}>Read more</ExternalLink>
                  </li>
                )}
              </DetailsList>
              {(window as any).debug === true && transaction && (
                <pre style={{ marginTop: 8 }}>{JSON.stringify(transaction, null, 2)}</pre>
              )}
            </ContentRowExpandedInner>
          </ContentRowExpanded>
        </Collapse>
      </ContentRow>
    </WrapperRow>
  );
};
