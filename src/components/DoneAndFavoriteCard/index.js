import React, { useState } from 'react';
import PropTypes, { array, oneOfType, string } from 'prop-types';
import { Link } from 'react-router-dom';
import shareIcon from '../../images/shareIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import { getLocalStorage, setLocalStorage } from '../../services/localStorage';
import './index.css';

function DoneAndFavoriteCard({ index, setRecipesFromStorage,
  isFavoriteRecipes, recipe }) {
  const { name, id, image, type, tags, alcoholicOrNot,
    nationality, category, doneDate } = recipe;
  const [isCopied, setIsCopied] = useState(false);
  const TIMER = 2000;
  const copyLink = () => {
    const path = `http://localhost:3000/${type === 'drink' ? 'drinks' : 'foods'}/${id}`;
    navigator.clipboard.writeText(path);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, TIMER);
  };
  const removeFavorites = () => {
    const favorites = getLocalStorage('favoriteRecipes');
    const newFavorites = favorites.filter(({ id: recipeId }) => recipeId !== id);
    setLocalStorage('favoriteRecipes', newFavorites);
    setRecipesFromStorage(newFavorites);
  };

  return (
    <div className="done-recipe-container">
      <Link to={ `/${type === 'drink' ? 'drinks' : 'foods'}/${id}` }>
        <img
          className="done-recipe-image"
          src={ image }
          alt={ name }
          data-testid={ `${index}-horizontal-image` }
        />
      </Link>
      <div className="done-recipe-info">
        <Link to={ `/${type === 'drink' ? 'drinks' : 'foods'}/${id}` }>
          <h1 className="card-h1" data-testid={ `${index}-horizontal-name` }>
            {name}
          </h1>
        </Link>
        <h3 className="done-card-category" data-testid={ `${index}-horizontal-top-text` }>
          {type === 'food'
            ? `${nationality} - ${category}`
            : `${alcoholicOrNot}`}
        </h3>
        {(!isFavoriteRecipes && type === 'food') && (
          tags.map((tagName) => (
            <p
              data-testid={ `${index}-${tagName}-horizontal-tag` }
              key={ id }
            >
              {tagName}
            </p>))) }
        {!isFavoriteRecipes && (
          <p
            data-testid={ `${index}-horizontal-done-date` }
          >
            {doneDate}
          </p>
        )}
        <div className="done-recipe-share">
          {isFavoriteRecipes && (
            <button type="button" onClick={ removeFavorites }>
              <img
                src={ blackHeartIcon }
                alt="blackHeartIcon"
                data-testid={ `${index}-horizontal-favorite-btn` }
              />
            </button>
          )}
          <button type="button" onClick={ copyLink }>
            <img
              alt="shareIcon"
              data-testid={ `${index}-horizontal-share-btn` }
              src={ shareIcon }
            />
          </button>
          {isCopied && <p>Link copied!</p>}
        </div>
      </div>
    </div>
  );
}

DoneAndFavoriteCard.propTypes = {
  recipe: PropTypes.objectOf(oneOfType([
    string,
    array,
  ])).isRequired,
  index: PropTypes.number.isRequired,
  setRecipesFromStorage: PropTypes.func.isRequired,
  isFavoriteRecipes: PropTypes.bool,
};

DoneAndFavoriteCard.defaultProps = {
  isFavoriteRecipes: true,
};

export default DoneAndFavoriteCard;
