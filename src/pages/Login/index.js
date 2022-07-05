import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import myContext from '../../context/myContext';
import { setLocalStorage } from '../../services/localStorage';
import './index.css';

const PASSWORD_LENGTH = 6;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setUser, setMealsToken, setCocktailsToken } = useContext(myContext);
  const history = useHistory();

  const handleChange = ({ target: { name, value } }) => {
    if (name === 'email') {
      setEmail(value);
    }
    if (name === 'password') {
      setPassword(value);
    }
  };

  const isButtonDisabled = () => !(/\S+@\S+\.\S+/).test(email)
    || (password.length <= PASSWORD_LENGTH);

  const handleClick = () => {
    setLocalStorage('user', { email });
    setLocalStorage('mealsToken', 1);
    setLocalStorage('cocktailsToken', 1);
    setMealsToken(1);
    setCocktailsToken(1);
    setUser({ email });
    history.push('/foods');
  };

  return (
    <div className="App-header">
      <div className="opacity-container" />
      <form className="form-login">
        <h1 className="login-title">Login</h1>
        <input
          className="input-login"
          type="email"
          name="email"
          data-testid="email-input"
          placeholder="E-mail"
          autoComplete="off"
          value={ email }
          onChange={ handleChange }
        />
        <input
          className="input-login"
          type="password"
          name="password"
          data-testid="password-input"
          placeholder="Digite sua senha"
          autoComplete="off"
          value={ password }
          onChange={ handleChange }
        />
        <button
          className="button-login"
          type="button"
          data-testid="login-submit-btn"
          disabled={ isButtonDisabled() }
          onClick={ handleClick }
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
