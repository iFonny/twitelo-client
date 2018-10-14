import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setLanguage } from 'redux-i18n';
import api from '../libs/api';
import NavBar from './NavBar';

class Layout extends Component {
  componentDidMount() {
    const { user, dispatch } = this.props;

    if (user) {
      // Auth user requests
      api.defaults.headers.common.Authorization = user.twitelo_token;

      // Set user locale
      dispatch(setLanguage(user.settings.locale));
    }
  }

  render() {
    const { children } = this.props;

    return (
      <div className="layout">
        <div className="background-image" />
        <NavBar />
        {children}
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object,
};

Layout.defaultProps = {
  user: null,
};

export default connect(state => state)(Layout);
