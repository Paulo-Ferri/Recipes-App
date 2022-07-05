import React from 'react';
import ReactRouter from 'react-router';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MealRecipeDetails from '../../pages/MealRecipeDetails';

import renderWithRouter from '../utils/renderWithRouter';

import { detailedFoodMock } from '../mocks/foods';
import { drinksMock } from '../mocks/drinks';

const detailedFoodEndpoint = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
const suggestedDrinksEndpoint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

describe('Meal Recipe Details Page', () => {
  let history;
  let mockedFetch;
  let mockedGetLocalStorage;
  let mockedSetLocalStorage;
  const idFoodMock = detailedFoodMock.json().meals[0].idMeal;

  beforeEach(() => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ id: idFoodMock });
    mockedFetch = jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => drinksMock)
      .mockImplementation(() => detailedFoodMock);
    mockedGetLocalStorage = jest.spyOn(Object.getPrototypeOf(localStorage), 'getItem')
      .mockImplementation(() => null);
    mockedSetLocalStorage = jest.spyOn(Object.getPrototypeOf(localStorage), 'setItem');

    ({ history } = renderWithRouter(<MealRecipeDetails />, `/foods/${idFoodMock}`));
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('should have a header', () => {
    it('wich informations were obtained fetching on correct endpoint', () => {
      expect(mockedFetch).toHaveBeenCalledWith(detailedFoodEndpoint + idFoodMock);
    });

    it('wich favorite informations were obtained from localStorage', () => {
      expect(mockedGetLocalStorage).toHaveBeenCalledWith('favoriteRecipes');
    });

    it('containing the recipe image', () => {
      const recipeImg = screen.getByAltText('food template');

      expect(recipeImg)
        .toHaveAttribute('src', detailedFoodMock.json().meals[0].strMealThumb);
    });

    it('containing a favorite button that save the recipe on localStorage', () => {
      const favoriteButton = screen.getByAltText('Favorite Icon');

      userEvent.click(favoriteButton);

      expect(mockedSetLocalStorage).toHaveBeenCalled();
    });

    it('containing the recipe name', () => {
      const recipeName = screen.getByRole('heading', { level: 1 });

      expect(recipeName).toHaveTextContent(detailedFoodMock.json().meals[0].strMeal);
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
  });

  describe('should have an detailed section', () => {
    it('containing a title "Ingredients"', () => {
      const ingredientTitle = screen.getByRole('heading', { name: 'Ingredients' });

      expect(ingredientTitle).toBeInTheDocument();
    });

    // it('containing all the recipe ingredients', () => {});

    it('containing a title "Instructions"', () => {
      const instructionsTitle = screen.getByRole('heading', { name: 'Instructions' });

      expect(instructionsTitle).toBeInTheDocument();
    });

    it('containing the recipe instructions', () => {
      const instructionsText = screen.getByTestId('instructions');

      expect(instructionsText)
        .toHaveTextContent(detailedFoodMock.json().meals[0].strInstructions);
    });
  });

  describe('should have a button on bottom', () => {
    it('that says "Start Recipe" when the user has not started yet', () => {
      const startBtn = screen.getByRole('button', { name: 'Start Recipe' });

      userEvent.click(startBtn);

      expect(history.location.pathname).toBe(`/foods/${idFoodMock}/in-progress`);
    });

    it('that says "Continue Recipe" when the user has already started', async () => {
      cleanup();
      jest.spyOn(Object.getPrototypeOf(localStorage), 'getItem').mockImplementation(
        (key) => {
          if (key === 'inProgressRecipes') {
            return JSON.stringify({ meals: { [idFoodMock]: [] } });
          }
          return JSON.stringify([]);
        },
      );

      renderWithRouter(<MealRecipeDetails />, `/foods/${idFoodMock}`);

      expect(screen.getByRole('button', { name: 'Continue Recipe' })).toBeInTheDocument();
    });
  });

  describe('should have a suggested drink recipe cards', () => {
    it('wich informations were obtained fetching on correct endpoint', () => {
      expect(mockedFetch).toHaveBeenCalledWith(suggestedDrinksEndpoint);
    });

    it('that redirects to recipe\'s page', async () => {
      const drinkRecipeCard = await screen
        .findByAltText(drinksMock.json().drinks[0].strDrink);

      userEvent.click(drinkRecipeCard);

      expect(history.location.pathname)
        .toBe(`/drinks/${drinksMock.json().drinks[0].idDrink}`);
    });
  });
});
