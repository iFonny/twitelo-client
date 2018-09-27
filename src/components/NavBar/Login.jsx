import React from 'react';
import PropTypes from 'prop-types';

const Login = (props, { t }) => (
  <>
    <a href="/auth/twitter" className="navbar-item navbar-item-line">
      <span className="login-button">{t('navbar.login-with-twitter')}</span>
      <span className="icon is-medium has-text-info">
        <i className="fab fa-lg fa-twitter" />
      </span>
    </a>
    <style jsx>{`
      .login-button {
        margin-right: 5px;
      }
    `}</style>
  </>
);

Login.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Login;
