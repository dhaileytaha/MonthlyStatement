import React from 'react';
import { Button, Col, Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import styled from 'styled-components';
import { useStatementContext } from '../context/StatementContext';
import { EndAssetsResult, StartAssetsResult } from './AssetsResult';
import { ExportAssetsButton } from './CSVExports/ExportAssetsButton';
import { ErrorMessage } from './ErrorMessage';
import { Loader } from './Loader';
import { StatementForm } from './StatementForm';
import { TransactionList } from './TransactionList';

const Title = styled.h1`
  margin-bottom: 1em;
  text-align: center;
  color: white;
`;

const Wrapper = styled.div`
  width: 95%;
  max-width: 800px;
  background-color: white;
  padding: 80px 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  margin: 60px auto;
`;

export const Statement = () => {
  const {
    startDate,
    endDate,
    isFetching,
    error,
    hasFetched,
    startAssetsData,
    endAssetsData,
    transactionsWithinDateRange,
    allTransactions,
  } = useStatementContext();

  return (
    <Container style={{ marginBottom: 50 }}>
      <Row>
        <Col lg={{ span: 12 }}>
          <Title>
            Get your Crypto Statement Instantly
            <OverlayTrigger
              delay={250}
              placement="bottom"
              overlay={
                <Tooltip id="tooltip">
                  Time is relative. Expect the results atleast somewhere within the foreseeable
                  future, depending on the number of transactions and response time of the apis.
                </Tooltip>
              }
            >
              <span>*</span>
            </OverlayTrigger>
          </Title>
        </Col>
      </Row>
      <Wrapper>
        {!isFetching && (
          <Row>
            <Col lg={{ span: 8, offset: 2 }}>{<StatementForm />}</Col>
          </Row>
        )}

        {isFetching && (
          <Row>
            <Col lg={{ span: 12 }}>{<Loader />}</Col>
          </Row>
        )}
        {error && !isFetching && (
          <Row>
            <Col lg={{ span: 12 }}>
              <ErrorMessage error={error} />
            </Col>
          </Row>
        )}

        {hasFetched && !isFetching && !error && (
          <Row>
            <Col>{<hr />}</Col>
          </Row>
        )}

        <Row>
          {!isFetching && hasFetched && !error && (startAssetsData.assets || endAssetsData.assets) && (
            <Col lg={{ span: 12 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '50px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ width: 50 }}></div>
                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ margin: 0, textAlign: 'center' }}>Summary of all assets</h3>
                </div>
                <div style={{ width: 50 }}>
                  <ExportAssetsButton />
                </div>
              </div>
            </Col>
          )}
        </Row>
        <Row>
          <Col lg={{ span: 6 }}>
            {!isFetching && hasFetched && !error && startAssetsData.assets && <StartAssetsResult />}
          </Col>
          <Col lg={{ span: 6 }}>
            {!isFetching && hasFetched && !error && endAssetsData.assets && <EndAssetsResult />}
          </Col>
        </Row>

        {!isFetching && hasFetched && !error && (
          <Row>
            <Col lg={{ span: 12 }}>
              <TransactionList
                transactions={transactionsWithinDateRange}
                allTransactions={allTransactions}
                startDate={startDate}
                endDate={endDate}
              />
            </Col>
          </Row>
        )}
      </Wrapper>
    </Container>
  );
};
