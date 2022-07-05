const getIngredients = (recipe) => {
  const ingredientKeys = Object.keys(recipe)
    .filter((key) => Boolean(key.match(/strIngredient\d*/)));

  const validIngredientKeys = ingredientKeys
    .filter((key) => (recipe[key] !== '' && recipe[key] !== null));

  const ingredients = validIngredientKeys
    .map((key) => ({ strIngredient: recipe[key] }));

  return ingredients;
};

export default getIngredients;
