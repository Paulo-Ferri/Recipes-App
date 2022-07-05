import React from 'react';
import ReactRouter from 'react-router';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DrinksInProgress from '../../pages/DrinksInProgress';

import renderWithRouter from '../utils/renderWithRouter';
import getIngredients from '../utils/getIngredients';

import { detailedDrinkMock } from '../mocks/drinks';
import getInProgressMock from '../utils/getInProgressMock';

const ingredientsMock = getIngredients(detailedDrinkMock.json().drinks[0]);

const detailedDrinkEndpoint = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';
const FINISH_RECIPE = 'Finish Recipe';

describe('Drinks in Progress Page', () => {
  let history;
  let mockedFetch;
  let mockedGetLocalStorage;
  let mockedSetLocalStorage;
  const idDrinkMock = detailedDrinkMock.json().drinks[0].idDrink;

  beforeEach(() => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ id: idDrinkMock });
    mockedFetch = jest.spyOn(global, 'fetch')
      .mockImplementation(() => detailedDrinkMock);
    mockedGetLocalStorage = jest.spyOn(Object.getPrototypeOf(localStorage), 'getItem')
      .mockImplementation(() => null);
    mockedSetLocalStorage = jest.spyOn(Object.getPrototypeOf(localStorage), 'setItem');

    ({ history } = renderWithRouter(
      <DrinksInProgress />, `/drinks/${idDrinkMock}/in-progress`,
    ));
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

    it('containing the recipe image', async () => {
      const recipeImg = await screen.findByAltText('drink template');

      expect(recipeImg)
        .toHaveAttribute('src', detailedDrinkMock.json().drinks[0].strDrinkThumb);
    });

    it('containing a favorite button that save the recipe on localStorage', async () => {
      const favoriteButton = await screen.findByAltText('Favorite Icon');

      userEvent.click(favoriteButton);

      expect(mockedSetLocalStorage).toHaveBeenCalled();
    });

    it('containing the recipe name', async () => {
      const recipeName = await screen.findByRole('heading', { level: 1 });

      expect(recipeName).toHaveTextContent(detailedDrinkMock.json().drinks[0].strDrink);
    });
  });

  describe('should have an detailed section', () => {
    it('containing a title "Ingredients"', async () => {
      const ingredientTitle = await screen.findByRole('heading', { name: 'Ingredients' });

      expect(ingredientTitle).toBeInTheDocument();
    });

    it('containing all the recipe ingredients', async () => {
      const ingredientBoxes = await screen.findAllByRole('checkbox');

      expect(ingredientBoxes.length).toBe(ingredientsMock.length);
    });

    it('containing a title "Instructions"', async () => {
      const instructionsTitle = await screen
        .findByRole('heading', { name: 'Instructions' });

      expect(instructionsTitle).toBeInTheDocument();
    });

    it('containing the recipe instructions', async () => {
      const instructionsText = await screen.findByTestId('instructions');

      expect(instructionsText)
        .toHaveTextContent(detailedDrinkMock.json().drinks[0].strInstructions);
    });
  });

  describe('should have ingredient checkboxes', () => {
    const inProgressRecipesAfterClick = JSON
      .stringify({ cocktails: { [idDrinkMock]: ['Galliano'] }, meals: {} });

    it('that, when clicked, saves the ingredient used on localStorage', async () => {
      const ingredientCheckBox = (await screen.findAllByRole('checkbox'))[0];

      userEvent.click(ingredientCheckBox);

      expect(mockedSetLocalStorage).toHaveBeenCalled();
    });

    it('in case 2', async () => {
      const inProgressRecipes = getInProgressMock('cocktails', '2', idDrinkMock);
      mockedGetLocalStorage.mockImplementation(() => inProgressRecipes);

      userEvent.click((await screen.findAllByRole('checkbox'))[0]);

      expect(mockedSetLocalStorage).toHaveBeenCalledWith(
        'inProgressRecipes',
        JSON.stringify({ meals: {}, cocktails: { [idDrinkMock]: ['Galliano'] } }),
      );
    });

    it('in case 3', async () => {
      const inProgressRecipes = getInProgressMock('cocktails', '3', idDrinkMock);

      mockedGetLocalStorage.mockImplementation(() => inProgressRecipes);
      userEvent.click((await screen.findAllByRole('checkbox'))[0]);

      expect(mockedSetLocalStorage)
        .toHaveBeenCalledWith('inProgressRecipes', inProgressRecipesAfterClick);
    });

    it('in case 4', async () => {
      const inProgressRecipes = getInProgressMock('cocktails', '4', idDrinkMock);
      mockedGetLocalStorage.mockImplementation(() => inProgressRecipes);

      userEvent.click((await screen.findAllByRole('checkbox'))[0]);

      expect(mockedSetLocalStorage)
        .toHaveBeenCalledWith('inProgressRecipes', inProgressRecipesAfterClick);
    });
  });

  describe('should have a "Finish Recipe" button', () => {
    it('that is disabled while all ingredients aren\'t checked', async () => {
      const ingredientBoxes = await screen.findAllByRole('checkbox');
      const finishBtn = screen.getByRole('button', { name: FINISH_RECIPE });

      userEvent.click(ingredientBoxes[0]);

      expect(finishBtn).toHaveAttribute('disabled');
    });

    it('that is active after all ingredients have been checked', async () => {
      const ingredientBoxes = await screen.findAllByRole('checkbox');
      const finishBtn = screen.getByRole('button', { name: FINISH_RECIPE });

      ingredientBoxes.forEach((ingredientBox) => {
        userEvent.click(ingredientBox);
      });

      expect(finishBtn).not.toHaveAttribute('disabled');
    });

    it(
      'that, when clicked, saves the recipe and redirects to done recipes page ',
      async () => {
        const ingredientBoxes = await screen.findAllByRole('checkbox');
        const finishBtn = screen.getByRole('button', { name: FINISH_RECIPE });

        ingredientBoxes.forEach((ingredientBox) => {
          userEvent.click(ingredientBox);
        });
        userEvent.click(finishBtn);

        expect(mockedSetLocalStorage).toHaveBeenCalled();
        expect(history.location.pathname).toBe('/done-recipes');
      },
    );
  });
});
