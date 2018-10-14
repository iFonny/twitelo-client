import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { setLanguage } from 'redux-i18n';
import { setUserLang } from '../../actions/user';

class Burger extends Component {
  constructor(props) {
    super(props);

    this.handleLangChange = this.handleLangChange.bind(this);
  }

  handleLangChange(e, locale) {
    const { onLangClick, onLangClickNoUser, user } = this.props;

    e.preventDefault();
    if (user) onLangClick(locale);
    else onLangClickNoUser(locale);
  }

  render() {
    const { user, customClass, isActiveClass, locales } = this.props;
    const { t } = this.context;

    return (
      <Fragment>
        <div
          id="menu-burger"
          className={`menu-burger ${isActiveClass && 'is-active'} ${customClass}`}
        >
          {user && (
            <Fragment>
              <hr className="dropdown-divider divider-burger" />
              <Link href="/builder">
                <a className="button button-burger is-dark" role="button">
                  <span className="icon is-medium">
                    <i className="fas fa-lg fa-paint-brush" />
                  </span>
                  <span className="sub-menu-button has-text-grey-lighter">
                    {t('navbar.builder')}
                  </span>
                </a>
              </Link>
              <hr className="dropdown-divider divider-burger" />
              <Link href="/chat">
                <a className="button button-burger is-dark" role="button">
                  <span className="icon is-medium">
                    <i className="fas fa-lg fa-comments" />
                  </span>
                  <span className="sub-menu-button has-text-grey-lighter">Chat</span>
                </a>
              </Link>
            </Fragment>
          )}
          <hr className="dropdown-divider divider-burger" />
          <Link href="/about">
            <a className="button button-burger is-dark" role="button">
              <span className="icon is-medium">
                <i className="fas fa-lg fa-info-circle" />
              </span>
              <span className="sub-menu-button has-text-grey-lighter">{t('navbar.about')}</span>
            </a>
          </Link>
          <hr className="dropdown-divider divider-burger" />
          <div className="locale-links">
            {locales.map(locale => (
              <a
                key={locale}
                onClick={e => this.handleLangChange(e, locale)}
                className="locale-link"
                role="button"
              >
                <img className="locale-img" src={`/images/locales/${locale}.png`} alt="locale" />
              </a>
            ))}
          </div>
          <hr className="dropdown-divider divider-burger" />
        </div>
        <style jsx>{`
          .menu-burger {
            width: 100%;
            background-color: #363636;
            display: none;
          }
          .button-burger {
            width: 100%;
          }
          .menu-burger.is-active {
            display: block;
          }
          .burger-menu-button {
            margin-right: 5px;
          }
          .locale-links {
            margin: 0rem 0.6rem;
            text-align: center;
          }
          .locale-img {
            margin-top: 0.4rem;
            margin-left: 1rem;
            margin-right: 1rem;
            height: 2.5rem;
          }
          .divider-burger {
            margin: 0;
          }
        `}</style>
      </Fragment>
    );
  }
}

Burger.contextTypes = {
  t: PropTypes.func.isRequired,
};

Burger.propTypes = {
  user: PropTypes.object,
  customClass: PropTypes.string,
  isActiveClass: PropTypes.bool.isRequired,
  locales: PropTypes.array.isRequired,
  onLangClick: PropTypes.func.isRequired,
  onLangClickNoUser: PropTypes.func.isRequired,
};

Burger.defaultProps = {
  user: null,
  customClass: '',
};

const mapStateToProps = state => ({
  user: state.user,
  locales: state.base.locales,
});

export default connect(
  mapStateToProps,
  { onLangClick: setUserLang, onLangClickNoUser: setLanguage },
)(Burger);
