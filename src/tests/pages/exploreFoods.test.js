import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExploreFoods from '../../pages/ExploreFoods';

import renderWithRouter from '../utils/renderWithRouter';

import { randomFoodMock } from '../mocks/foods';

const randomFoodEndpoint = 'https://www.themealdb.com/api/json/v1/1/random.php';

describe('Explore Foods Page', () => {
  let history;
  let mockedFetch;

  beforeEach(() => {
    mockedFetch = jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => randomFoodMock);

    ({ history } = renderWithRouter(<ExploreFoods />));
  });

  afterEach(() => {
    cleanup();
  });

  describe('should have a header', () => {
    it('containing a title "h1" with text "Explore Foods"', () => {
      const title = screen.getAllByRole('heading', { level: 1 })[0];

      expect(title).toHaveTextContent('Explore Foods');
    });

    it('containing a profile icon that redirects to profile page', () => {
      const profileIcon = screen.getByAltText('profile-icon');

      userEvent.click(profileIcon);

      expect(history.location.pathname).toBe('/profile');
    });
  });

  describe('should have a explore menu', () => {
    it('containing an explore "by ingredient" button that redirects the page', () => {
      const ingredientsBtn = screen.getByRole('button', { name: 'By Ingredient' });

      userEvent.click(ingredientsBtn);

      expect(history.location.pathname).toBe('/explore/foods/ingredients');
    });

    it('containing an explore "by nationality" button that redirects the page', () => {
      const nationalityBtn = screen.getByRole('button', { name: 'By Nationality' });

      userEvent.click(nationalityBtn);

      expect(history.location.pathname).toBe('/explore/foods/nationalities');
    });

    it('containing a "surprise me" button that fetchs a random recipe', async () => {
      const surpriseBtn = screen.getByRole('button', { name: 'Surprise me!' });

      userEvent.click(surpriseBtn);

      expect(mockedFetch).toHaveBeenCalledWith(randomFoodEndpoint);
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
