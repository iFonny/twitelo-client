import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class NavBar extends Component {
  render() {
    return (
      <div>
        <div>Twitelo</div>
        <a href="/auth/twitter">Login</a>
        Je suis une navbar
      </div>
    );
  }
}

export default connect(state => state)(NavBar);
