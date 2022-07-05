import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import fetchAPI from '../../services/fetchAPI';
import ShareButton from '../../components/ShareButton';
import FavoriteButton from '../../components/FavoriteButton';
import {
  getLocalStorage, getInProgressRecipesLocalStorage, setLocalStorage,
} from '../../services/localStorage';

const ingredientsIndexes = [];
const MAXIMUM_INGREDIENTS_INDEX = 15;
for (let index = 1; index <= MAXIMUM_INGREDIENTS_INDEX; index += 1) {
  ingredientsIndexes.push(index);
}
const MAXIMUM_RECIPES = 6;

function DrinkRecipeDetails() {
  const [recipes, setRecipes] = useState([]);
  const [drink, setDrink] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const { id } = useParams();
  const history = useHistory();

  const inProgressRecipes = getInProgressRecipesLocalStorage();
  const doneRecipes = getLocalStorage('doneRecipes') || [];
  const favoritedRecipes = getLocalStorage('favoriteRecipes') || [];

  const [isFavorite, setIsFavorite] = useState(
    favoritedRecipes.some((favorite) => favorite.id === id),
  );

  useEffect(() => {
    const newIngredients = ingredientsIndexes.map((index) => {
      const newIngredient = {
        strIngredient: drink[`strIngredient${index}`],
        strMeasure: drink[`strMeasure${index}`],
      };
      return newIngredient;
    }).filter((ingredient) => ingredient.strIngredient !== null);
    setIngredients(newIngredients);
  }, [drink]);

  // identifica se a receita é favoritada
  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favoriteRecipes) {
      const isRecipeFavorited = favoriteRecipes.some((recipe) => +recipe.id === +id);
      if (isRecipeFavorited) {
        setIsFavorite(true);
      }
    }
  }, [id]);

  useEffect(() => {
    async function fetchById() {
      const drinkById = await fetchAPI(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`, 'drinks');
      setDrink(drinkById[0]);
    }
    fetchById();
  }, [id]);

  useEffect(() => {
    async function fetchCategories() {
      const dataFetched = await fetchAPI('https://www.themealdb.com/api/json/v1/1/search.php?s=', 'meals');
      setRecipes(dataFetched);
    }
    fetchCategories();
  }, []);

  const handleShare = () => {
    const mealUrl = history.location.pathname;
    const formatedUrl = `http://localhost:3000${mealUrl}`;
    navigator.clipboard.writeText(formatedUrl);
    setIsCopied(true);
  };

  const handleFavorite = () => {
    const { strCategory, strDrink, strDrinkThumb, strAlcoholic } = drink;

    const objToFavorite = {
      id,
      type: 'drink',
      nationality: '',
      category: strCategory,
      alcoholicOrNot: strAlcoholic,
      name: strDrink,
      image: strDrinkThumb,
    };

    let newFavoriteRecipes;
    if (isFavorite) {
      newFavoriteRecipes = favoritedRecipes.filter((favorite) => favorite.id !== id);
    } else {
      newFavoriteRecipes = [...favoritedRecipes, objToFavorite];
    }

    setLocalStorage('favoriteRecipes', newFavoriteRecipes);
    setIsFavorite(!isFavorite);
  };

  const renderDetails = () => {
    const {
      strDrink,
      strDrinkThumb,
      strCategory,
      strInstructions,
      strAlcoholic,
    } = drink;
    return (
      <div className="recipe_details_component">
        <img
          src={ strDrinkThumb }
          alt="drink template"
          data-testid="recipe-photo"
          width="360"
        />
        <div key={ strDrink } className="recipe_container">
          <div className="recipe_info">
            <h1 data-testid="recipe-title">{strDrink}</h1>
            <h4 data-testid="recipe-category">{`| ${strCategory} - ${strAlcoholic}`}</h4>
          </div>
          <div className="share_and_favorite_btn">
            <FavoriteButton
              handleFavorite={ handleFavorite }
              isFavorite={ isFavorite }
            />
            <ShareButton
              handleShare={ handleShare }
            />
            {isCopied && <p>Link copied!</p>}

          </div>
          <div className="recipe_follow_up">
            <h4>Ingredients</h4>
            <ul>
              {ingredients
                .map(({ strIngredient, strMeasure }, index) => (
                  <li
                    key={ index }
                    data-testid={ `${index}-ingredient-name-and-measure` }
                  >
                    {`${strIngredient} - ${strMeasure}`}
                  </li>
                ))}
            </ul>
            <h4>Instructions</h4>
            <p data-testid="instructions">
              {strInstructions}
            </p>
          </div>
          <h4 className="recommended">Recommended</h4>
          <div
            className="recipe_recomendations"
          >
            {
              recipes && recipes
                .filter((_, index) => index < MAXIMUM_RECIPES)
                .map(({ idMeal, strMeal, strMealThumb }, index) => (
                  <Link key={ index } to={ `/foods/${idMeal}` }>
                    <div
                      data-testid={ `${index}-recomendation-card` }
                      className="recipe_card"
                    >
                      <h4 data-testid={ `${index}-recomendation-title` }>{strMeal}</h4>
                      <img
                        src={ strMealThumb }
                        alt={ strMeal }
                        className="recipe_card_img"
                      />
                    </div>
                  </Link>
                ))
            }
          </div>
        </div>
      </div>
    );
  };

  const renderButton = () => {
    if (!inProgressRecipes.cocktails) {
      inProgressRecipes.cocktails = { [id]: [] };
    }

    if (!inProgressRecipes.cocktails[id]
      && doneRecipes.every((recipe) => recipe.id !== id)) {
      return (
        <button
          data-testid="start-recipe-btn"
          type="button"
          className="start_recipe_btn"
          onClick={ () => history.push(`/drinks/${id}/in-progress`) }
        >
          Start Recipe
        </button>
      );
    }
    if (doneRecipes.every((recipe) => recipe.id !== id)) {
      return (
        <button
          data-testid="start-recipe-btn"
          type="button"
          className="start_recipe_btn"
          onClick={ () => history.push(`/drinks/${id}/in-progress`) }
        >
          Continue Recipe
        </button>
      );
    }
  };

  return (
    <main>
      {drink.strDrink && renderDetails()}
      {renderButton()}
    </main>
  );
}

export default DrinkRecipeDetails;
