import React from 'react';
import { render } from '@testing-library/react';
import { AppWithWrappers } from './AppWithWrappers';

test('Renders the app without crashing', () => {
  render(<AppWithWrappers />);
});
