import React from 'react';
import { Spinner } from 'react-bootstrap';
import styled from 'styled-components';

const Wrapper = styled.span`
  margin-left: 4px;
  margin-right: 4px;
`;

export const InlineLoader = () => {
  return (
    <Wrapper>
      <Spinner animation="border" role="status" variant="secondary" size="sm">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Wrapper>
  );
};
