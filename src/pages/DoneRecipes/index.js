import React, { useEffect, useState } from 'react';
import DoneAndFavoriteCard from '../../components/DoneAndFavoriteCard';
import Header from '../../components/Header';
import { getLocalStorage } from '../../services/localStorage';

function DoneRecipes() {
  const [recipesFromStorage, setRecipesFromStorage] = useState([]);
  const [filteredRecipes, filterRecipes] = useState([]);

  useEffect(() => {
    const getRecipesFromStorage = () => {
      const doneRecipes = getLocalStorage('doneRecipes');
      if (doneRecipes) {
        const results = getLocalStorage('doneRecipes');
        setRecipesFromStorage(results);
        filterRecipes(results);
      }
    };
    getRecipesFromStorage();
  }, []);

  const handleClick = ({ target }) => {
    const { value } = target;
    if (value === 'all') {
      filterRecipes(recipesFromStorage);
    } else {
      const filteredCategory = recipesFromStorage
        .filter((recipe) => (recipe.type === value));
      filterRecipes(filteredCategory);
    }
  };
  return (
    <>
      <Header headerTitle="Done Recipes" isSearchVisible={ false } />
      <div className="all-buttons">
        <button
          className="category-button"
          type="button"
          data-testid="filter-by-all-btn"
          value="all"
          onClick={ handleClick }
        >
          All categories
        </button>
        <button
          className="category-button"
          type="button"
          data-testid="filter-by-food-btn"
          value="food"
          onClick={ handleClick }
        >
          Food
        </button>
        <button
          className="category-button"
          type="button"
          data-testid="filter-by-drink-btn"
          value="drink"
          onClick={ handleClick }
        >
          Drinks
        </button>
      </div>
      <div className="done-fav-cards-container">
        { filteredRecipes.length && filteredRecipes
          .map((recipe, index) => (
            <DoneAndFavoriteCard
              isFavoriteRecipes={ false }
              key={ index }
              setRecipesFromStorage={ setRecipesFromStorage }
              recipe={ recipe }
              index={ index }
            />
          ))}
      </div>
    </>
  );
}

export default DoneRecipes;
