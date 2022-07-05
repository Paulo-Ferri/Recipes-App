import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import Foods from '../../pages/Foods';

import renderWithRouter from '../utils/renderWithRouter';

import { categoriesMock, foodsMock, filteredCategoryMock } from '../mocks/foods';

const categoriesEndpoint = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
const filteredCategoryEndpoint = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=';
const foodsEndpoint = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

describe('Foods Page', () => {
  let history;
  let mockedFetch;

  beforeEach(() => {
    mockedFetch = jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => categoriesMock)
      .mockImplementationOnce(() => foodsMock)
      .mockImplementation(() => filteredCategoryMock);

    ({ history } = renderWithRouter(<Foods />));
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('should have a header', () => {
    it('containing a title "h1" with text "Foods"', () => {
      const title = screen.getAllByRole('heading', { level: 1 })[0];

      expect(title).toHaveTextContent('Foods');
    });

    it('containing a profile icon that redirects to profile page', () => {
      const profileIcon = screen.getByAltText('profile-icon');

      userEvent.click(profileIcon);

      expect(history.location.pathname).toBe('/profile');
    });

    it('containing a search icon that open a search bar', () => {
      const searchIcon = screen.getByAltText('search-icon');

      userEvent.click(searchIcon);

      const searchBar = screen.queryByPlaceholderText('Search Recipe');

      expect(searchBar).toBeInTheDocument();
    });
  });

  describe('should have category buttons for categories', () => {
    it(
      'wich were obtained fetching on "https://www.themealdb.com/api/json/v1/1/list.php?c=list"',
      () => {
        expect(mockedFetch).toHaveBeenCalledWith(categoriesEndpoint);
      },
    );

    it('that applies a category filter when clicked', async () => {
      const categoryButton = await screen
        .findByRole('button', { name: categoriesMock.json().meals[0].strCategory });

      act(() => {
        userEvent.click(categoryButton);
      });

      expect(mockedFetch).toHaveBeenCalledWith(
        filteredCategoryEndpoint + categoriesMock.json().meals[0].strCategory,
      );
    });
  });

  describe('should have recipes cards for recipes', () => {
    it(
      'wich were obtained fetching on "https://www.themealdb.com/api/json/v1/1/search.php?s="',
      () => {
        expect(mockedFetch).toHaveBeenCalledWith(foodsEndpoint);
      },
    );

    it('that redirects to recipe\'s page', async () => {
      const recipeCard = await screen
        .findByAltText(foodsMock.json().meals[0].strMeal);

      userEvent.click(recipeCard);

      expect(history.location.pathname)
        .toBe(`/foods/${foodsMock.json().meals[0].idMeal}`);
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
