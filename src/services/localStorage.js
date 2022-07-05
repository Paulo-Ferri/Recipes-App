export const setLocalStorage = (key, info) => {
  localStorage.setItem(key, JSON.stringify(info));
};

export const getLocalStorage = (key) => JSON.parse(localStorage.getItem(key));

export const getInProgressRecipesLocalStorage = (type, id) => {
  let inProgressRecipes = getLocalStorage('inProgressRecipes');

  if (!inProgressRecipes) {
    inProgressRecipes = { meals: {}, cocktails: {} };
  }

  if (!inProgressRecipes.meals) {
    inProgressRecipes = { ...inProgressRecipes, meals: {} };
  }
  if (!inProgressRecipes.cocktails) {
    inProgressRecipes = { ...inProgressRecipes, cocktails: {} };
  }

  if (type && id && !inProgressRecipes[type][id]) {
    inProgressRecipes[type][id] = [];
  }

  setLocalStorage('inProgressRecipes', inProgressRecipes);

  return inProgressRecipes;
};
