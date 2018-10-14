import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setLanguage } from 'redux-i18n';
import { setUserLang } from '../../actions/user';

class Locale extends Component {
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
    const { customClass, currentLocale, locales } = this.props;
    const myLocales = locales.filter(locale => currentLocale !== locale);

    return (
      <Fragment>
        <div className={`dropdown dropdown-locale is-hoverable ${customClass}`}>
          <div role="button" className="dropdown-trigger">
            <a className="navbar-item navbar-item-no-bg no-select">
              <img src={`/images/locales/${currentLocale}.png`} alt="locale" />
            </a>
          </div>
          <div className="dropdown-menu">
            <div className="dropdown-content">
              {myLocales.map(locale => (
                <a
                  role="button"
                  key={locale}
                  onClick={e => this.handleLangChange(e, locale)}
                  className="dropdown-item"
                >
                  <img src={`/images/locales/${locale}.png`} alt="locale" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          .dropdown-locale {
            width: 60px;
          }

          a.dropdown-item {
            padding-right: 1rem;
            background-color: #363636;
          }

          a.dropdown-item:hover {
            background-color: #454545;
          }

          a.dropdown-item:last-child {
            border-radius: 0px 0px 8px 8px;
          }
        `}</style>
        <style jsx global>{`
          .dropdown-locale .dropdown-content {
            border-radius: 0px 0px 8px 8px;
            box-shadow: none;
            padding-bottom: 0px;
            padding-top: 0px;
            background-color: #3d3d3d;
            width: 60px;
          }

          .dropdown-locale .dropdown-menu {
            padding-top: 0px;
            z-index: 100;
            width: 60px;
          }
        `}</style>
      </Fragment>
    );
  }
}

Locale.propTypes = {
  user: PropTypes.object,
  customClass: PropTypes.string,
  currentLocale: PropTypes.string.isRequired,
  locales: PropTypes.array.isRequired,
  onLangClick: PropTypes.func.isRequired,
  onLangClickNoUser: PropTypes.func.isRequired,
};

Locale.defaultProps = {
  user: null,
  customClass: '',
};

const mapStateToProps = state => ({
  user: state.user,
  currentLocale: state.i18nState.lang,
  locales: state.base.locales,
});

export default connect(
  mapStateToProps,
  { onLangClick: setUserLang, onLangClickNoUser: setLanguage },
)(Locale);
