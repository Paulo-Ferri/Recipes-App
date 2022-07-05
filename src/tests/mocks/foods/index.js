import categoriesMockJson from './categoriesMock.json';
import foodsMockJson from './foodsMock.json';
import filteredCategoryMockJson from './filteredCategoryMock.json';
import randomFoodsMockJson from './randomFoodMock.json';
import foodsIngredientsMockJson from './foodsIngredientsMock.json';
import nationalititesMockJson from './nationalitiesMock.json';
import filteredNationalitiesMockJson from './filteredNationalitiesMock.json';

export const categoriesMock = {
  json: () => categoriesMockJson,
};

export const foodsMock = {
  json: () => foodsMockJson,
};

export const filteredCategoryMock = {
  json: () => filteredCategoryMockJson,
};

export const randomFoodMock = {
  json: () => randomFoodsMockJson,
};

export const detailedFoodMock = {
  json: () => ({ meals: [foodsMockJson.meals[0]] }),
};

export const foodsIngredientsMock = {
  json: () => foodsIngredientsMockJson,
};

export const nationalititesMock = {
  json: () => nationalititesMockJson,
};

export const filteredNationalitiesMock = {
  json: () => filteredNationalitiesMockJson,
};
