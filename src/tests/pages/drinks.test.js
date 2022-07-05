import React from 'react';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Drinks from '../../pages/Drinks';

import renderWithRouter from '../utils/renderWithRouter';

import {
  categoriesMock, drinksMock, filteredCategoryMock,
  filteredIngredientMock, filteredFirstLetterMock,
} from '../mocks/drinks';

const categoriesEndpoint = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
const drinksEndpoint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
const filteredCategoryEndpoint = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=';
const filteredIngredientEndpoint = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
const filteredFirstLetterEndpoint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=';
const SEARCH_RECIPE = 'Search Recipe';

describe('Foods Page', () => {
  let history;
  let mockedFetch;

  beforeEach(() => {
    mockedFetch = jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => categoriesMock)
      .mockImplementationOnce(() => drinksMock)
      .mockImplementation(() => filteredCategoryMock);

    ({ history } = renderWithRouter(<Drinks />));
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('should have a header', () => {
    it('containing a title "h1" with text "Drinks"', () => {
      const title = screen.getAllByRole('heading', { level: 1 })[0];

      expect(title).toHaveTextContent('Drinks');
    });

    it('containing a profile icon that redirects to profile page', () => {
      const profileIcon = screen.getByAltText('profile-icon');

      userEvent.click(profileIcon);

      expect(history.location.pathname).toBe('/profile');
    });

    it('containing a search icon that open a search bar', () => {
      const searchIcon = screen.getByAltText('search-icon');

      userEvent.click(searchIcon);

      const searchBar = screen.queryByPlaceholderText(SEARCH_RECIPE);

      expect(searchBar).toBeInTheDocument();
    });
  });

  describe('should have a search bar', () => {
    beforeEach(() => {
      const searchIcon = screen.getByAltText('search-icon');
      userEvent.click(searchIcon);
    });

    it('containing a ingredient radio button that searchs by ingredient', async () => {
      mockedFetch.mockImplementation(() => filteredIngredientMock);
      const searchTerm = 'water';

      userEvent.click(screen.getByRole('radio', { name: 'Ingredient' }));
      userEvent.type(screen.queryByPlaceholderText(SEARCH_RECIPE), searchTerm);
      userEvent.click(screen.getByAltText('search_button_icon'));

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledWith(filteredIngredientEndpoint + searchTerm);
      });
    });

    it('containing a first letter radio buton that searchs by first letter', async () => {
      mockedFetch.mockImplementation(() => filteredFirstLetterMock);
      const searchTerm = 'a';

      userEvent.click(screen.getByRole('radio', { name: 'First Letter' }));
      userEvent.type(screen.queryByPlaceholderText(SEARCH_RECIPE), searchTerm);
      userEvent.click(screen.getByAltText('search_button_icon'));

      await waitFor(() => {
        expect(mockedFetch)
          .toHaveBeenCalledWith(filteredFirstLetterEndpoint + searchTerm);
      });
    });
  });

  describe('should have category buttons for categories', () => {
    it(
      'wich were obtained fetching on "https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list"',
      async () => {
        await waitFor(() => expect(mockedFetch).toHaveBeenCalledWith(categoriesEndpoint));
      },
    );

    it('that applies a category filter when clicked', async () => {
      const categoryButton = await screen
        .findByRole('button', { name: categoriesMock.json().drinks[0].strCategory });

      userEvent.click(categoryButton);

      await waitFor(() => expect(mockedFetch).toHaveBeenCalledWith(
        filteredCategoryEndpoint + categoriesMock.json().drinks[0].strCategory,
      ));
    });
  });

  describe('should have recipe cards for recipes', () => {
    it(
      'wich were obtained fetching on "https://www.thecocktaildb.com/api/json/v1/1/search.php?s="',
      async () => {
        await waitFor(() => expect(mockedFetch).toHaveBeenCalledWith(drinksEndpoint));
      },
    );

    it('that redirects to recipe\'s page', async () => {
      const recipeCard = await screen
        .findByAltText(drinksMock.json().drinks[0].strDrink);

      userEvent.click(recipeCard);

      expect(history.location.pathname)
        .toBe(`/drinks/${drinksMock.json().drinks[0].idDrink}`);
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
