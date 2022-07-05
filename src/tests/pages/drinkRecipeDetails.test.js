import React from 'react';
import ReactRouter from 'react-router';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DrinkRecipeDetails from '../../pages/DrinkRecipeDetails';

import renderWithRouter from '../utils/renderWithRouter';

import { detailedDrinkMock } from '../mocks/drinks';
import { foodsMock } from '../mocks/foods';

const detailedDrinkEndpoint = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';
const suggestedFoodsEndpoint = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

describe('Drink Recipe Details Page', () => {
  let history;
  let mockedFetch;
  let mockedGetLocalStorage;
  let mockedSetLocalStorage;
  const idDrinkMock = detailedDrinkMock.json().drinks[0].idDrink;

  beforeEach(() => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ id: idDrinkMock });
    mockedFetch = jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => detailedDrinkMock)
      .mockImplementation(() => foodsMock);
    mockedGetLocalStorage = jest.spyOn(Object.getPrototypeOf(localStorage), 'getItem')
      .mockImplementation(() => null);
    mockedSetLocalStorage = jest.spyOn(Object.getPrototypeOf(localStorage), 'setItem');

    ({ history } = renderWithRouter(<DrinkRecipeDetails />, `/drinks/${idDrinkMock}`));
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('should have a header', () => {
    it('wich informations were obtained fetching on correct endpoint', () => {
      expect(mockedFetch).toHaveBeenCalledWith(detailedDrinkEndpoint + idDrinkMock);
    });

    it('wich favorite informations were obtained from localStorage', () => {
      expect(mockedGetLocalStorage).toHaveBeenCalledWith('favoriteRecipes');
    });

    it('containing the recipe image', () => {
      const recipeImg = screen.getByAltText('drink template');

      expect(recipeImg)
        .toHaveAttribute('src', detailedDrinkMock.json().drinks[0].strDrinkThumb);
    });

    it('containing a favorite button that save/unsave the recipe on localStorage', () => {
      const favoriteButton = screen.getByAltText('Favorite Icon');

      userEvent.click(favoriteButton);

      expect(mockedSetLocalStorage).toHaveBeenCalled();
    });

    it('containing a share button that copy the recipe link', () => {
      Object.assign(window.navigator, {
        clipboard: {
          writeText: jest.fn(),
        },
      });

      const shareBtn = screen.getByAltText('Share Icon');

      userEvent.click(shareBtn);

      expect(window.navigator.clipboard.writeText).toHaveBeenCalled();
    });

    it('containing the recipe name', () => {
      const recipeName = screen.getByRole('heading', { level: 1 });

      expect(recipeName).toHaveTextContent(detailedDrinkMock.json().drinks[0].strDrink);
    });
  });

  describe('should have an detailed section', () => {
    it('containing a title "Ingredients"', () => {
      const ingredientTitle = screen.getByRole('heading', { name: 'Ingredients' });

      expect(ingredientTitle).toBeInTheDocument();
    });

    it('containing a title "Instructions"', () => {
      const instructionsTitle = screen.getByRole('heading', { name: 'Instructions' });

      expect(instructionsTitle).toBeInTheDocument();
    });

    it('containing the recipe instructions', () => {
      const instructionsText = screen.getByTestId('instructions');

      expect(instructionsText)
        .toHaveTextContent(detailedDrinkMock.json().drinks[0].strInstructions);
    });
  });

  describe('should have a button on bottom', () => {
    it('that says "Start Recipe" when the user has not started yet', () => {
      const startBtn = screen.getByRole('button', { name: 'Start Recipe' });

      userEvent.click(startBtn);

      expect(history.location.pathname).toBe(`/drinks/${idDrinkMock}/in-progress`);
    });

    it('that says "Continue Recipe" when the user has already started', async () => {
      cleanup();
      jest.spyOn(Object.getPrototypeOf(localStorage), 'getItem').mockImplementation(
        (key) => {
          if (key === 'inProgressRecipes') {
            return JSON.stringify({ cocktails: { [idDrinkMock]: [] } });
          }
          return JSON.stringify([]);
        },
      );
      mockedFetch.mockImplementation(() => detailedDrinkMock);

      renderWithRouter(<DrinkRecipeDetails />, `/drinks/${idDrinkMock}`);

      expect(await screen.findByRole('button', { name: 'Continue Recipe' }))
        .toBeInTheDocument();
    });
  });

  describe('should have a suggested drink recipe cards', () => {
    it('wich informations were obtained fetching on correct endpoint', () => {
      expect(mockedFetch).toHaveBeenCalledWith(suggestedFoodsEndpoint);
    });

    it('that redirects to recipe\'s page', async () => {
      const foodRecipeCard = await screen
        .findByAltText(foodsMock.json().meals[0].strMeal);

      userEvent.click(foodRecipeCard);

      expect(history.location.pathname)
        .toBe(`/foods/${foodsMock.json().meals[0].idMeal}`);
    });
  });
});
