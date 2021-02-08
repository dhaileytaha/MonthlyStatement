import styled from 'styled-components';

export const WrapperRow = styled.div`
  display: flex;
`;

export const IconColumn = styled.div`
  display: flex;
  width: 50px;
  flex-shrink: 0;
  justify-content: center;
  position: relative;
`;

export const VerticalLine = styled.div<{ index: number }>`
  position: absolute;
  left: 50%;
  top: ${(props) => (props.index === 0 ? 20 : 0)}px;
  bottom: 0;
  border-left: 1px solid #666;
`;

export const IconWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  font-size: 0.7em;
  border-radius: 50%;
  background-color: #eee;
  color: #666;
  z-index: 1;
`;

export const ContentRow = styled.div`
  display: flex;
  flex-grow: 1;
  margin-bottom: 20px;
  padding: 4px;
  flex-direction: column;
`;

export const ContentRowMessage = styled.div`
  display: flex;
  flex-grow: 1;
  margin-bottom: 20px;
  padding: 12px;
  border-radius: 4px;
  background: #f5f5f5;
  font-style: italic;
  flex-direction: column;
`;

export const ContentRowTop = styled.div`
  display: flex;
`;

export const TitleColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 2px;
  padding-right: 2px;
`;

export const Title = styled.div<{ isError?: boolean }>`
  color: ${(props) => (props.isError ? props.theme.colors.error : undefined)};
`;

export const TransactionColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 2px;
  padding-right: 2px;
  text-align: right;
  width: 50%;
  min-width: 250px;
`;

export const DebitValue = styled.div`
  color: ${(props) => props.theme.colors.positive};
`;

export const CreditValue = styled.div`
  color: ${(props) => props.theme.colors.negative};
`;

export const GasValue = styled.div`
  opacity: 0.6;
  font-size: 0.9em;
`;

export const ExpandColumn = styled.div`
  display: flex;
  padding-left: 2;
  padding-right: 2;
  width: 50;
  flex-shrink: 0;
`;

export const ExpandButton = styled.button`
  background: none;
  border: 0;
  padding: 8px;
`;

// Needed to account for correcy height measurements of the Collapse component
export const ContentRowExpanded = styled.div``;

export const ContentRowExpandedInner = styled.div`
  max-width: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding: 8px 12px;
  margin-right: 50;
  background: #fafafa;
  font-size: 0.8em;
  color: #555;
  border-radius: 4px;
`;

export const ContentRowExpandedInnerMessage = styled.div`
  max-width: 100%;
  overflow: auto;
  margin-top: 20px;
  box-sizing: border-box;
  margin-right: 50;
  font-size: 0.8em;
  color: #555;
  border-radius: 4px;
`;

export const DateString = styled.div`
  opacity: 0.6;
  font-size: 0.9em;
`;

export const DetailsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;
