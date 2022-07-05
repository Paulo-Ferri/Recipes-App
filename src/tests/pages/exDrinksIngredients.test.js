import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExDrinksIngredients from '../../pages/ExDrinksIngredients';

import renderWithRouter from '../utils/renderWithRouter';

import { drinksIngredientsMock } from '../mocks/drinks';

const drinksIngredientsEndpoint = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list';

describe('Explore Ingredients Drinks Page', () => {
  let history;
  let mockedFetch;

  beforeEach(() => {
    mockedFetch = jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => drinksIngredientsMock);

    ({ history } = renderWithRouter(<ExDrinksIngredients />));
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('should have a header', () => {
    it('containing a title "h1" with text "Explore Ingredients"', () => {
      const title = screen.getAllByRole('heading', { level: 1 })[0];

      expect(title).toHaveTextContent('Explore Ingredients');
    });

    it('containing a profile icon that redirects to profile page', () => {
      const profileIcon = screen.getByAltText('profile-icon');

      userEvent.click(profileIcon);

      expect(history.location.pathname).toBe('/profile');
    });
  });

  describe('should have ingredient cards', () => {
    it('wich informations were obtained fetching on correct endpoint', () => {
      expect(mockedFetch).toHaveBeenCalledWith(drinksIngredientsEndpoint);
    });

    it('containing ingredient name', () => {
      const nameH1 = screen.getByRole(
        'heading',
        { name: drinksIngredientsMock.json().drinks[0].strIngredient1 },
      );

      expect(nameH1).toBeInTheDocument();
    });

    it('that redirects to foods page', async () => {
      const recipeCard = await screen.findByAltText(
        drinksIngredientsMock.json().drinks[0].strIngredient1,
      );

      userEvent.click(recipeCard);

      expect(history.location.pathname).toBe('/drinks');
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
