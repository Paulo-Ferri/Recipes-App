import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import copy from 'clipboard-copy';
import fetchAPI from '../../services/fetchAPI';
import './index.css';
import {
  getLocalStorage, getInProgressRecipesLocalStorage, setLocalStorage,
} from '../../services/localStorage';
import IngredientCheckbox from '../../components/IngredientCheckbox';
import FavoriteButton from '../../components/FavoriteButton';
import ShareButton from '../../components/ShareButton';

const ingredientsIndexes = [];
const MAXIMUM_INGREDIENTS_INDEX = 20;
for (let index = 1; index <= MAXIMUM_INGREDIENTS_INDEX; index += 1) {
  ingredientsIndexes.push(index);
}

function FoodsInProgress() {
  const [meal, setMeal] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams();
  const history = useHistory();

  const inProgressRecipes = getInProgressRecipesLocalStorage('meals', id);
  const [usedIngredients, setUsedIngredients] = useState(inProgressRecipes.meals[id]);

  useEffect(() => {
    if (meal.strMeal) {
      const newIngredients = ingredientsIndexes.map((index) => {
        const newIngredient = {
          strIngredient: meal[`strIngredient${index}`],
          strMeasure: meal[`strMeasure${index}`],
        };
        return newIngredient;
      }).filter(({ strIngredient }) => strIngredient !== '' && strIngredient !== null);
      setIngredients(newIngredients);
    }
  }, [meal]);

  useEffect(() => {
    async function fetchById() {
      const mealById = await fetchAPI(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`, 'meals');
      setMeal(mealById[0]);
    }
    fetchById();
  }, [id]);

  useEffect(() => {
    const favoriteRecipes = getLocalStorage('favoriteRecipes');
    if (favoriteRecipes) {
      const isRecipeFavorited = favoriteRecipes.some((recipe) => +recipe.id === +id);
      if (isRecipeFavorited) {
        setIsFavorite(true);
      }
    }
  }, [id]);

  const handleShare = () => {
    const mealUrl = history.location.pathname;
    const splittedUrl = mealUrl.split('/in-progress');
    const formatedUrl = `http://localhost:3000${splittedUrl[0]}`;
    copy(formatedUrl);
    setIsCopied(true);
  };

  const handleFavorite = () => {
    const { strArea, strCategory, strMeal, strMealThumb } = meal;
    const favoritedRecipes = localStorage.getItem('favoriteRecipes');
    setIsFavorite(!isFavorite);

    const objToFavorite = {
      id,
      type: 'food',
      nationality: strArea,
      category: strCategory,
      alcoholicOrNot: '',
      name: strMeal,
      image: strMealThumb,
    };

    if (favoritedRecipes === null) {
      setLocalStorage('favoriteRecipes', [objToFavorite]);
    } else if (favoritedRecipes.includes(id)) {
      const favoritesWithoutPresentFood = JSON.parse(favoritedRecipes)
        .filter((food) => food.id !== id);
      setLocalStorage('favoriteRecipes', favoritesWithoutPresentFood);
    } else {
      setLocalStorage(
        'favoriteRecipes',
        [...JSON.parse(favoritedRecipes), objToFavorite],
      );
    }
  };

  const handleIngredientClick = (target) => {
    const clickedIngredient = target.value;

    let newUsedIngredients;
    if (!usedIngredients.includes(clickedIngredient)) {
      target.parentElement.className = 'ingredient-is-done';
      newUsedIngredients = [...usedIngredients, clickedIngredient];
      const newInProgressRecipes = {
        ...inProgressRecipes,
        meals: {
          ...inProgressRecipes.meals,
          [id]: newUsedIngredients,
        },
      };

      setUsedIngredients(newUsedIngredients);
      setLocalStorage('inProgressRecipes', newInProgressRecipes);
    }
  };

  const handleClick = () => {
    const { strArea, strCategory, strMeal, strMealThumb, strTags } = meal;
    const doneRecipe = {
      id,
      type: 'food',
      nationality: strArea,
      category: strCategory,
      alcoholicOrNot: '',
      name: strMeal,
      image: strMealThumb,
      doneDate: new Date().toDateString(),
      tags: strTags !== null ? [strTags] : [],
    };
    const doneRecipes = getLocalStorage('doneRecipes');
    if (doneRecipes === null) {
      setLocalStorage('doneRecipes', [doneRecipe]);
    } else {
      setLocalStorage(
        'doneRecipes', [...doneRecipes, doneRecipe],
      );
    }
    history.push('/done-recipes');
  };

  const renderDetails = () => {
    const { strMeal, strMealThumb, strCategory, strInstructions } = meal;
    return (
      <div className="recipe_details_component">
        <img
          src={ strMealThumb }
          alt="food template"
          data-testid="recipe-photo"
          width="360"
        />
        <div key={ strMeal } className="recipe_container">
          <div className="recipe_info">
            <h1 data-testid="recipe-title">{strMeal}</h1>
            <h4 data-testid="recipe-category">{`| ${strCategory}`}</h4>
          </div>
          <div className="share_and_favorite_btn">
            <FavoriteButton
              isFavorite={ isFavorite }
              handleFavorite={ handleFavorite }
            />
            <ShareButton
              handleShare={ handleShare }
            />
            {isCopied && <p>Link copied!</p>}
          </div>
        </div>
        <div className="recipe_follow_up">
          <h4>Ingredients</h4>
          {ingredients
            .map(({ strIngredient, strMeasure }, index) => (
              <IngredientCheckbox
                key={ index }
                index={ index }
                ingredient={ strIngredient }
                measure={ strMeasure || 'at will' }
                handleIngredientClick={ handleIngredientClick }
                usedIngredients={ usedIngredients }
              />
            ))}
          <h4 className="instructions">Instructions</h4>
          <p data-testid="instructions">
            {strInstructions}
          </p>
        </div>
        <button
          className="finish_recipe_btn"
          type="button"
          disabled={ usedIngredients.length !== ingredients.length }
          data-testid="finish-recipe-btn"
          onClick={ handleClick }
        >
          Finish Recipe
        </button>
      </div>
    );
  };

  return (
    <main>{(meal.strMeal && ingredients.length) && renderDetails()}</main>);
}

export default FoodsInProgress;
