import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Explore from '../../pages/Explore';

import renderWithRouter from '../utils/renderWithRouter';

describe('Explore Page', () => {
  let history;

  beforeEach(() => {
    ({ history } = renderWithRouter(<Explore />));
  });

  afterEach(() => {
    cleanup();
  });

  describe('should have a header', () => {
    it('containing a title "h1" with text "Explore"', () => {
      const title = screen.getAllByRole('heading', { level: 1 })[0];

      expect(title).toHaveTextContent('Explore');
    });

    it('containing a profile icon that redirects to profile page', () => {
      const profileIcon = screen.getByAltText('profile-icon');

      userEvent.click(profileIcon);

      expect(history.location.pathname).toBe('/profile');
    });
  });

  describe('should have a explore menu', () => {
    it('containing an explore foods button that redirects the page', () => {
      const exploreFoodsBtn = screen.getByRole('button', { name: 'Explore Foods' });

      userEvent.click(exploreFoodsBtn);

      expect(history.location.pathname).toBe('/explore/foods');
    });

    it('containing an explore drinks button that redirects the page', () => {
      const exploreDrinksBtn = screen.getByRole('button', { name: 'Explore Drinks' });

      userEvent.click(exploreDrinksBtn);

      expect(history.location.pathname).toBe('/explore/drinks');
    });
  });

  describe('should have a footer', () => {
    it('containing a drink icon that redirects to drinks page', () => {
      const drinksIcon = screen.getByAltText('drinkIcon');

      userEvent.click(drinksIcon);

      expect(history.location.pathname).toBe('/drinks');
    });

    it('containing a explore icon that redirects to explore page', () => {
      const exploreIcon = screen.getByAltText('exploreIcon');

      userEvent.click(exploreIcon);

      expect(history.location.pathname).toBe('/explore');
    });

    it('containing a food icon that redirects to foods page', () => {
      const foodsIcon = screen.getByAltText('mealIcon');

      userEvent.click(foodsIcon);

      expect(history.location.pathname).toBe('/foods');
    });
  });
});
