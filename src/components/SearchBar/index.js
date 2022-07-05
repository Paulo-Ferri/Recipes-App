import React, { useContext, useState } from 'react';
import myContext from '../../context/myContext';
import './index.css';
import searchIcon from '../../images/searchIcon.svg';

const FIRST_LETTER = 'first-letter';

function SearchBar() {
  const [localSearchInput, setLocalSearchInput] = useState('');
  const [localSearchType, setLocalSearchType] = useState('name');

  const { setSearch } = useContext(myContext);

  const handleClick = () => {
    if (localSearchType === FIRST_LETTER && localSearchInput.length !== 1) {
      global.alert('Your search must have only 1 (one) character');
    } else {
      setSearch({ input: localSearchInput, type: localSearchType });
    }
  };

  return (
    <div className="searchbar-container">
      <div className="search-types-container">
        <div>
          <input
            className="search_radio_btn"
            id="search-ingredient"
            type="radio"
            name="localSearchType"
            data-testid="ingredient-search-radio"
            value="ingredient"
            checked={ localSearchType === 'ingredient' }
            onChange={ () => setLocalSearchType('ingredient') }
          />
          <label className="search-type-label" htmlFor="search-ingredient">
            {' '}
            Ingredient
          </label>
        </div>
        <div>
          <input
            className="search_radio_btn"
            id="search-name"
            type="radio"
            name="localSearchType"
            data-testid="name-search-radio"
            value="name"
            checked={ localSearchType === 'name' }
            onChange={ () => setLocalSearchType('name') }
          />
          <label className="search-type-label" htmlFor="search-name">
            {' '}
            Name
          </label>
        </div>
        <div>
          <input
            className="search_radio_btn"
            id="search-first-letter"
            type="radio"
            name="localSearchType"
            data-testid="first-letter-search-radio"
            value="first-letter"
            checked={ localSearchType === FIRST_LETTER }
            onChange={ () => setLocalSearchType(FIRST_LETTER) }
          />
          <label className="search-type-label" htmlFor="search-first-letter">
            {' '}
            First Letter
          </label>
        </div>
      </div>
      <div className="search-itens">
        <input
          className="search-input"
          placeholder="Search Recipe"
          data-testid="search-input"
          value={ localSearchInput }
          onChange={ ({ target }) => setLocalSearchInput(target.value) }
        />
        <button
          className="search-button"
          type="button"
          data-testid="exec-search-btn"
          onClick={ handleClick }
        >
          <img
            className="search-btn-img"
            src={ searchIcon }
            alt="search_button_icon"
          />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
