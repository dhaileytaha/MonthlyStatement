import React from 'react';
import { Spinner } from 'react-bootstrap';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const Loader = () => {
  return (
    <Wrapper>
      <Spinner animation="border" role="status" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Wrapper>
  );
};
