import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import NotFound from '../../pages/NotFound';

import renderWithRouterAndProvider from '../utils/renderWithRouter';

describe('Not Found Page', () => {
  beforeEach(() => {
    renderWithRouterAndProvider(<NotFound />);
  });

  afterEach(() => {
    cleanup();
  });

  describe('Should have a h1', () => {
    it('containing text "Not Found"', () => {
      const header = screen.getByRole('heading', { level: 1 });
      expect(header).toHaveTextContent('Not Found');
    });
  });
});
