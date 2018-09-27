import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Test from '../containers/Test';

class NavBar extends Component {
  render() {
    return (
      <div>
        <div>Twitelo</div>
        <a href="/auth/twitter">Login</a>
        Je suis une navbar ({this.context.t('title')})
        <div>
          <Test />
        </div>
      </div>
    );
  }
}

NavBar.contextTypes = {
  t: PropTypes.func,
};

export default connect(state => state)(NavBar);
