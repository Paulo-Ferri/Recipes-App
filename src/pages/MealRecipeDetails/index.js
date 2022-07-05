import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import fetchAPI from '../../services/fetchAPI';
import './index.css';
import ShareButton from '../../components/ShareButton';
import FavoriteButton from '../../components/FavoriteButton';
import {
  getLocalStorage, getInProgressRecipesLocalStorage, setLocalStorage,
} from '../../services/localStorage';

const ingredientsIndexes = [];
const MAXIMUM_INGREDIENTS_INDEX = 20;
for (let index = 1; index <= MAXIMUM_INGREDIENTS_INDEX; index += 1) {
  ingredientsIndexes.push(index);
}

const MAXIMUM_RECIPES = 6;

function MealRecipeDetails() {
  const [recipes, setRecipes] = useState([]);
  const [meal, setMeal] = useState({});
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
        strIngredient: meal[`strIngredient${index}`],
        strMeasure: meal[`strMeasure${index}`],
      };
      return newIngredient;
    }).filter(({ strIngredient }) => strIngredient !== '' && strIngredient !== null);
    setIngredients(newIngredients);
  }, [meal]);

  // identifica se a receita é favoritada
  useEffect(() => {
    const favoriteRecipes = getLocalStorage('favoriteRecipes');
    if (favoriteRecipes) {
      const isRecipeFavorited = favoriteRecipes.some((recipe) => +recipe.id === +id);
      if (isRecipeFavorited) {
        setIsFavorite(true);
      }
    }
  }, [id]);

  useEffect(() => {
    async function fetchCategories() {
      const dataFetched = await fetchAPI('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=', 'drinks');
      setRecipes(dataFetched);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchById() {
      const mealById = await fetchAPI(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`, 'meals');
      setMeal(mealById[0]);
    }
    fetchById();
  }, [id]);

  const handleShare = () => {
    const mealUrl = history.location.pathname;
    const formatedUrl = `http://localhost:3000${mealUrl}`;
    navigator.clipboard.writeText(formatedUrl);
    setIsCopied(true);
  };

  const handleFavorite = () => {
    const { strArea, strCategory, strMeal, strMealThumb } = meal;

    const objToFavorite = {
      id,
      type: 'food',
      nationality: strArea,
      category: strCategory,
      alcoholicOrNot: '',
      name: strMeal,
      image: strMealThumb,
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
    const { strMeal, strMealThumb, strCategory, strInstructions, strYoutube } = meal;
    const splittedVideo = strYoutube.split('watch?v=');
    const embededVideo = `${splittedVideo[0]}embed/${splittedVideo[1]}`;
    return (
      <div className="recipe_details_component">
        <img
          src={ strMealThumb }
          alt="food template"
          data-testid="recipe-photo"
          width="360"
          className="recipe_thumb"
        />
        <div key={ strMeal } className="recipe_container">
          <div className="recipe_info">
            <h1 data-testid="recipe-title">{strMeal}</h1>
            <h4 data-testid="recipe-category">{`| ${strCategory}`}</h4>
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
            <ul className="recipe_ingredients">
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
          <iframe
            className="recipe_video"
            width="360"
            height="315"
            src={ embededVideo }
            title="YouTube video player"
            frameBorder="0"
            allowFullScreen
            data-testid="video"
          />
          <h4 className="recommended">Recommended</h4>
          <div
            className="recipe_recomendations"
          >
            {
              recipes && recipes
                .filter((_, index) => index < MAXIMUM_RECIPES)
                .map(({ idDrink: id2, strDrink, strDrinkThumb }, index) => (
                  <Link key={ id2 } to={ `/drinks/${id2}` }>
                    <div
                      data-testid={ `${index}-recomendation-card` }
                      className="recipe_card"
                    >
                      <h4 data-testid={ `${index}-recomendation-title` }>{strDrink}</h4>
                      <img
                        src={ strDrinkThumb }
                        alt={ strDrink }
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
    if (!inProgressRecipes.meals[id]
      && doneRecipes.every((recipe) => recipe.id !== id)) {
      return (
        <button
          data-testid="start-recipe-btn"
          type="button"
          className="start_recipe_btn"
          onClick={ () => history.push(`/foods/${id}/in-progress`) }
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
          onClick={ () => history.push(`/foods/${id}/in-progress`) }
        >
          Continue Recipe
        </button>
      );
    }
  };

  return (
    <main>
      {meal.strMeal && renderDetails()}
      {renderButton()}
    </main>
  );
}

export default MealRecipeDetails;
