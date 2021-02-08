import dayjs from 'dayjs';
import React, { useCallback, useState, useMemo } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import { useStatementContext } from '../context/StatementContext';
import { isAddress } from '../utils/isAddress';

const StyledDatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
`;

export const getAddressesFromInput = (value: string) => {
  return value
    .split(',')
    .map((value) => value.trim())
    .filter((value) => !!value);
};

interface ErrorMessages {
  startDate: string | null;
  endDate: string | null;
  addressesString: string | null;
}

export const StatementForm = () => {
  const {
    addressesString,
    startDate,
    endDate,
    setAddressesString,
    setStartDate,
    setEndDate,
    isFetching,
    fetchTransactions,
  } = useStatementContext();

  const isDisabled = isFetching;

  const [errors, setErrors] = useState<ErrorMessages>({
    startDate: null,
    endDate: null,
    addressesString: null,
  });
  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      const errors: ErrorMessages = {
        startDate: null,
        endDate: null,
        addressesString: null,
      };
      // Validation checks
      if (!startDate) {
        errors.startDate = 'Start date is required';
      }
      if (!endDate) {
        errors.endDate = 'End date is required';
      }
      if (!addressesString) {
        errors.addressesString = 'Address(es) is required';
      }
      if (endDate && dayjs(endDate).isAfter(dayjs())) {
        errors.endDate = 'End date cannot be in the future';
      }
      if (startDate && dayjs(startDate).isAfter(dayjs())) {
        errors.startDate = 'Start date cannot be in the future';
      }
      if (startDate && endDate && dayjs(endDate).isBefore(startDate)) {
        errors.endDate = 'End date should be after start date';
      }

      const addresses = getAddressesFromInput(addressesString);

      addresses.forEach((address) => {
        if (!isAddress(address)) {
          errors.addressesString = `Invalid address ${address}`;
        }
      });

      setErrors(errors);

      if (Object.values(errors).some((error) => error !== null)) {
        return;
      }

      fetchTransactions();
    },
    [startDate, endDate, addressesString, fetchTransactions]
  );

  const CustomStartDateComponent = useMemo(
    () => (props: any) => (
      <div>
        <Form.Control id="startDate" isInvalid={!!errors.startDate} {...props} />
        {!!errors.startDate && (
          <Form.Control.Feedback type="invalid">{errors.startDate}</Form.Control.Feedback>
        )}
      </div>
    ),
    [errors]
  );

  const CustomEndDateComponent = useMemo(
    () => (props: any) => (
      <div>
        <Form.Control id="endDate" isInvalid={!!errors.endDate} {...props} />
        {!!errors.endDate && (
          <Form.Control.Feedback type="invalid">{errors.endDate}</Form.Control.Feedback>
        )}
      </div>
    ),
    [errors]
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="address">
        <Form.Label>Enter Ethereum addresses:</Form.Label>
        <Form.Control
          as="textarea"
          rows={7}
          value={addressesString}
          onChange={(event) => setAddressesString(event.currentTarget.value)}
          disabled={isDisabled}
          isInvalid={!!errors.addressesString}
        />
        {!!errors.addressesString && (
          <Form.Control.Feedback type="invalid">{errors.addressesString}</Form.Control.Feedback>
        )}
        {!errors.addressesString && <Form.Text muted>Separate addresses with commas</Form.Text>}
      </Form.Group>
      <Row className="row">
        <Col md={{ span: 5 }}>
          <Form.Group controlId="startDate">
            <Form.Label>Start date:</Form.Label>
            <StyledDatePickerWrapper>
              <DatePicker
                locale="en"
                selected={startDate}
                onSelect={(date: Date) =>
                  date && date instanceof Date ? setStartDate(date) : console.error('invalid date')
                }
                onChange={(date: Date) =>
                  date && date instanceof Date ? setStartDate(date) : console.error('invalid date')
                }
                customInput={<CustomStartDateComponent />}
                disabled={isDisabled}
                dateFormat="dd-MM-yyyy"
                maxDate={dayjs().subtract(1, 'day').toDate()}
              />
            </StyledDatePickerWrapper>
          </Form.Group>
        </Col>
        <Col md={{ span: 5, offset: 2 }}>
          <Form.Group controlId="endDate">
            <Form.Label>End date:</Form.Label>
            <StyledDatePickerWrapper>
              <DatePicker
                locale="en"
                selected={endDate}
                onSelect={(date: Date) =>
                  date && date instanceof Date ? setEndDate(date) : console.error('invalid date')
                }
                onChange={(date: Date) =>
                  date && date instanceof Date ? setEndDate(date) : console.error('invalid date')
                }
                customInput={<CustomEndDateComponent />}
                disabled={isDisabled}
                dateFormat="dd-MM-yyyy"
                maxDate={dayjs().subtract(1, 'day').toDate()}
              />
            </StyledDatePickerWrapper>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col style={{ textAlign: 'center' }}>
          <Button variant="primary" size="lg" type="submit" disabled={isDisabled}>
            {isFetching ? 'Fetching' : 'View Statement'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
