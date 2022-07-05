import categoriesMockJson from './categoriesMock.json';
import drinksMockJson from './drinksMock.json';
import filteredCategoryMockJson from './filteredCategoryMock.json';
import filteredIngredientMockJson from './filteredIngredientMock.json';
import filteredFirstLetterMockJson from './filteredFirstLetterMock.json';
import randomDrinkMockJson from './randomDrinkMock.json';
import drinksIngredientsMockJson from './drinksIngredientsMock.json';

export const categoriesMock = {
  json: () => categoriesMockJson,
};

export const drinksMock = {
  json: () => drinksMockJson,
};

export const filteredCategoryMock = {
  json: () => filteredCategoryMockJson,
};

export const filteredIngredientMock = {
  json: () => filteredIngredientMockJson,
};

export const filteredFirstLetterMock = {
  json: () => filteredFirstLetterMockJson,
};

export const randomDrinkMock = {
  json: () => randomDrinkMockJson,
};

export const detailedDrinkMock = {
  json: () => ({ drinks: [drinksMockJson.drinks[0]] }),
};

export const drinksIngredientsMock = {
  json: () => drinksIngredientsMockJson,
};
