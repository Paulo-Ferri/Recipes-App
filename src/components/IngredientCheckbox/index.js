import PropTypes from 'prop-types';
import React/* , { useState, useEffect } */ from 'react';
import './style.css';

function IngredientCheckbox({
  ingredient,
  measure,
  index,
  handleIngredientClick,
  usedIngredients,
}) {
  const isIngredientUsed = usedIngredients.includes(ingredient);

  return (
    <label
      htmlFor={ `ingredient-${index}` }
      className={
        `ingredients-checkboxes ${isIngredientUsed ? 'ingredient-is-done' : ''}`
      }
      key={ index }
      data-testid={ `${index}-ingredient-step` }
    >
      <input
        className="check"
        type="checkbox"
        id={ `ingredient-${index}` }
        value={ ingredient }
        onChange={ (e) => handleIngredientClick(e.target) }
        checked={ isIngredientUsed }
      />
      { `${ingredient} - ${measure}` }
    </label>
  );
}

IngredientCheckbox.propTypes = {
  handleIngredientClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  ingredient: PropTypes.string.isRequired,
  measure: PropTypes.string.isRequired,
  usedIngredients: PropTypes.instanceOf(Object).isRequired,
};

export default IngredientCheckbox;
