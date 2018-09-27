import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Login from '../components/NavBar/Login';
import Logo from '../components/NavBar/Logo';

class NavBar extends Component {
  handleBurgerClick() {}

  render() {
    const { user } = this.props;

    return (
      <header>
        <nav className="navbar is-dark is-fixed-top has-text-white">
          <div className="navbar-brand">
            <Logo />
          </div>
          <div className="navbar-start" />
          <div className="navbar-end">{!user && <Login />}</div>
        </nav>
        <style jsx>{`
          .navbar {
            height: 4rem !important;
            box-shadow: 0px 2px 10px black;
            padding: 0 0;
          }

          @media screen and (max-width: 1023px) {
            .navbar,
            .navbar-brand {
              height: 3.25rem !important;
            }
          }
        `}</style>
        <style jsx global>{`
          .navbar-item-no-bg,
          .navbar-item-no-bg:hover {
            background: none !important;
          }
          .no-select {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          .navbar-item-line-active,
          .navbar-item-line:hover {
            background: none !important;
            box-shadow: 0px -1px white inset;
          }
          .sub-menu-button {
            margin-left: 5px;
          }
          .menu-button {
            margin-left: 10px;
          }
          .navbar-dropdown-menu {
            background-color: #3d3d3d !important;
            border: 0px;
          }
          .navbar-item-menu:hover {
            background-color: #4d4c4c !important;
          }
        `}</style>
      </header>
    );
  }
}

NavBar.propTypes = {
  user: PropTypes.object,
};

NavBar.defaultProps = {
  user: null,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(NavBar);
