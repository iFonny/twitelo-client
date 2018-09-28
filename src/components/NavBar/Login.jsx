import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Login = ({ customClass }, { t }) => (
  <Fragment>
    <a
      href="/auth/twitter"
      className={`navbar-item navbar-item-line ${customClass}`}
    >
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
  </Fragment>
);

Login.contextTypes = {
  t: PropTypes.func.isRequired,
};

Login.propTypes = {
  customClass: PropTypes.string,
};

Login.defaultProps = {
  customClass: '',
};

export default Login;
