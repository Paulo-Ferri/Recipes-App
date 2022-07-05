import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './index.css';

function RecipeCard({ recipe, index, type }) {
  const name = recipe[`str${type}`];
  const imgUrl = recipe[`str${type}Thumb`];
  const id = recipe[`id${type}`];

  return (
    <div className="card-container" data-testid={ `${index}-recipe-card` }>
      <Link to={ `/${type === 'Drink' ? 'drinks' : 'foods'}/${id}` }>
        <img
          className="card-image"
          src={ imgUrl }
          alt={ name }
          data-testid={ `${index}-card-img` }
        />
        <div className="recipe-card-info">
          <h1 className="card-h1" data-testid={ `${index}-card-name` }>{name}</h1>
          <p className="card-category">{recipe.strCategory}</p>
        </div>
      </Link>
    </div>
  );
}

RecipeCard.propTypes = {
  index: PropTypes.number.isRequired,
  recipe: PropTypes.objectOf().isRequired,
  type: PropTypes.string.isRequired,
};

export default RecipeCard;
