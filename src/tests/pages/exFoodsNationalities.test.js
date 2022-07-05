import React from 'react';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExFoodsNationalities from '../../pages/ExFoodsNationalities';

import renderWithRouter from '../utils/renderWithRouter';

import { nationalititesMock, foodsMock, filteredNationalitiesMock } from '../mocks/foods';

const nationalitiesEndpoint = 'https://www.themealdb.com/api/json/v1/1/list.php?a=list';
const foodsEndpoint = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const filteredNationalitiesEndpoint = 'https://www.themealdb.com/api/json/v1/1/filter.php?a=';

describe('Foods Page', () => {
  let history;
  let mockedFetch;

  beforeEach(() => {
    mockedFetch = jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => nationalititesMock)
      .mockImplementationOnce(() => foodsMock)
      .mockImplementation(() => filteredNationalitiesMock);

    ({ history } = renderWithRouter(<ExFoodsNationalities />));
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('should have a header', () => {
    it('containing a title "h1" with text "Explore Nationalities"', () => {
      const title = screen.getAllByRole('heading', { level: 1 })[0];

      expect(title).toHaveTextContent('Explore Nationalities');
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

  describe('should have a dropdown for nationalities', () => {
    it(
      'wich were obtained fetching on "https://www.themealdb.com/api/json/v1/1/list.php?a=list"',
      () => {
        expect(mockedFetch).toHaveBeenCalledWith(nationalitiesEndpoint);
      },
    );

    it('that applies a nationality filter when clicked', async () => {
      const nationalityDropdown = await screen.findByRole('combobox');

      userEvent
        .selectOptions(nationalityDropdown, nationalititesMock.json().meals[0].strArea);

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledWith(
          filteredNationalitiesEndpoint + nationalititesMock.json().meals[0].strArea,
        );
      });
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
