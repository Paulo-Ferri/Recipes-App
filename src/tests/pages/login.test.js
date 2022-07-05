import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../pages/Login';

import renderWithRouterAndProvider from '../utils/renderWithRouter';

const invalidEmails = ['teste', 'teste@email'];
const validEmail = 'teste@email.com';
const invalidPassword = 'teste';
const validPassword = 'teste12';

describe('Login Page', () => {
  let history;

  beforeEach(() => {
    ({ history } = renderWithRouterAndProvider(<Login />));
  });

  afterEach(() => {
    cleanup();
  });

  describe('should have a h1', () => {
    it('containing text "Login"', () => {
      const header = screen.getByRole('heading', { level: 1 });

      expect(header).toHaveTextContent('Login');
    });
  });

  describe('should have an input field for e-mail', () => {
    it('containing "E-mail" as placeholder', () => {
      const emailInput = screen.queryByPlaceholderText('E-mail');

      expect(emailInput).toBeInTheDocument();
    });
  });

  describe('should have an input field for password', () => {
    it('containing "Digite sua senha" as placeholder', () => {
      const passwordInput = screen.queryByPlaceholderText('Digite sua senha');

      expect(passwordInput).toBeInTheDocument();
    });
  });

  describe('should have a button', () => {
    it(
      'that is disabled if e-mail is not on correct format as "test@email.com"',
      () => {
        const button = screen.getByRole('button');
        const emailInput = screen.queryByPlaceholderText('E-mail');
        const passwordInput = screen.queryByPlaceholderText(/digite sua senha/i);

        userEvent.type(emailInput, invalidEmails[0]);
        userEvent.type(passwordInput, validPassword);
        expect(button).toHaveAttribute('disabled');

        userEvent.type(emailInput, invalidEmails[1]);
        expect(button).toHaveAttribute('disabled');
      },
    );

    it('that is disabled if password is less than 7 characters', () => {
      const button = screen.getByRole('button');
      const emailInput = screen.queryByPlaceholderText('E-mail');
      const passwordInput = screen.queryByPlaceholderText(/digite sua senha/i);

      userEvent.type(emailInput, validEmail);
      userEvent.type(passwordInput, invalidPassword);
      expect(button).toHaveAttribute('disabled');
    });

    it('that redirects the page to path "/foods" when clicked', () => {
      const button = screen.getByRole('button');
      const emailInput = screen.queryByPlaceholderText('E-mail');
      const passwordInput = screen.queryByPlaceholderText(/digite sua senha/i);

      userEvent.type(emailInput, validEmail);
      userEvent.type(passwordInput, validPassword);
      userEvent.click(button);

      expect(history.location.pathname).toBe('/foods');
    });
  });
});
