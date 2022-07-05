import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profile from '../../pages/Profile';

import renderWithRouter from '../utils/renderWithRouter';

import userMock from '../mocks/userMock.json';

describe('Profile Page', () => {
  let history;
  let mockedGetLocalStorage;

  beforeEach(() => {
    mockedGetLocalStorage = jest
      .spyOn(Object.getPrototypeOf(localStorage), 'getItem')
      .mockImplementation(() => JSON.stringify(userMock));

    ({ history } = renderWithRouter(<Profile />));
  });

  afterEach(() => {
    cleanup();
  });

  describe('should have a header', () => {
    it('containing a title "h1" with text "Profile"', () => {
      const title = screen.getAllByRole('heading', { level: 1 })[0];

      expect(title).toHaveTextContent('Profile');
    });

    it('containing a profile icon that redirects to profile page', () => {
      const profileIcon = screen.getByAltText('profile-icon');

      userEvent.click(profileIcon);

      expect(history.location.pathname).toBe('/profile');
    });
  });

  describe('should have a user section', () => {
    it('containing a "User:" header', () => {
      const userH3 = screen.getAllByRole('heading', { level: 3 })[0];

      expect(userH3).toHaveTextContent('User:');
    });

    it('containing the logged in user e-mail', () => {
      expect(mockedGetLocalStorage).toHaveBeenCalledWith('user');

      const userEmailH3 = screen.getAllByRole('heading', { level: 3 })[1];

      expect(userEmailH3).toHaveTextContent(userMock.email);
    });
  });

  describe('should have a menu', () => {
    it('containing a "done recipes" button that redirects the page', () => {
      const doneRecipesBtn = screen.getByRole('button', { name: 'Done Recipes' });

      userEvent.click(doneRecipesBtn);

      expect(history.location.pathname).toBe('/done-recipes');
    });

    it('containing an explore "favorite recipes" button that redirects the page', () => {
      const favoriteRecipesBtn = screen.getByRole('button', { name: 'Favorite Recipes' });

      userEvent.click(favoriteRecipesBtn);

      expect(history.location.pathname).toBe('/favorite-recipes');
    });

    it(
      'containing a logout button that logout the user and redirects to login page',
      async () => {
        const logoutButton = screen.getByRole('button', { name: 'Logout' });

        userEvent.click(logoutButton);

        expect(history.location.pathname).toBe('/');
      },
    );
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
