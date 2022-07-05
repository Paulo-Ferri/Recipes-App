import React from 'react';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FavoriteRecipes from '../../pages/FavoriteRecipes';

import renderWithRouter from '../utils/renderWithRouter';

import favoriteRecipesMock from '../mocks/favoriteRecipesMock.json';

describe('Profile Page', () => {
  let history;
  let mockedGetLocalStorage;

  beforeEach(() => {
    mockedGetLocalStorage = jest
      .spyOn(Object.getPrototypeOf(localStorage), 'getItem')
      .mockImplementation(() => JSON.stringify(favoriteRecipesMock));

    ({ history } = renderWithRouter(<FavoriteRecipes />));
  });

  afterEach(() => {
    cleanup();
  });

  describe('should have a header', () => {
    it('containing a title "h1" with text "Favorite Recipes"', () => {
      const title = screen.getAllByRole('heading', { level: 1 })[0];

      expect(title).toHaveTextContent('Favorite Recipes');
    });

    it('containing a profile icon that redirects to profile page', () => {
      const profileIcon = screen.getByAltText('profile-icon');

      userEvent.click(profileIcon);

      expect(history.location.pathname).toBe('/profile');
    });
  });

  describe('should have a categories menu', () => {
    const foodNameMock = favoriteRecipesMock.find(({ type }) => type === 'food').name;
    const drinkNameMock = favoriteRecipesMock.find(({ type }) => type === 'drink').name;

    it('containing a Food button that filters the recipes', async () => {
      userEvent.click(screen.getByRole('button', { name: 'Food' }));

      await waitFor(() => {
        expect(screen.queryByAltText(drinkNameMock)).not.toBeInTheDocument();
      });
    });

    it('containing a Drink button that filters the recipes', async () => {
      userEvent.click(screen.getByRole('button', { name: 'Drinks' }));

      await waitFor(() => {
        expect(screen.queryByAltText(foodNameMock)).not.toBeInTheDocument();
      });
    });

    it('containing an "All categories" button that clears the filter', async () => {
      userEvent.click(screen.getByRole('button', { name: 'Drinks' }));
      userEvent.click(screen.getByRole('button', { name: 'All categories' }));

      await waitFor(() => {
        expect(screen.queryByAltText(foodNameMock)).toBeInTheDocument();
        expect(screen.queryByAltText(drinkNameMock)).toBeInTheDocument();
      });
    });
  });

  describe('should have recipe cards for favorite recipes', () => {
    it('wich were obtained searching on localStorage', () => {
      expect(mockedGetLocalStorage).toHaveBeenCalledWith('favoriteRecipes');
    });

    it('that redirects to recipe\'s page', () => {
      const recipeCard = screen.getByAltText(favoriteRecipesMock[0].name);

      userEvent.click(recipeCard);

      expect(history.location.pathname)
        .toBe(`/foods/${favoriteRecipesMock[0].id}`);
    });

    it('containing a share button that saves the recipe link', () => {
      Object.assign(window.navigator, {
        clipboard: {
          writeText: jest.fn(),
        },
      });

      const shareBtn = screen.getAllByAltText('shareIcon')[0];

      userEvent.click(shareBtn);

      expect(window.navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });
});
