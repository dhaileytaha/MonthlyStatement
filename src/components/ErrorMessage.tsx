import React from 'react';
import { Alert } from 'react-bootstrap';

interface ErrorMessageProps {
  error: Error;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  return <Alert variant="danger">{error.message}</Alert>;
};
