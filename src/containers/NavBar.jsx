import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Login from '../components/NavBar/Login';
import Logo from '../components/NavBar/Logo';
import Burger from '../components/NavBar/Burger';
import About from '../components/NavBar/About';
import Chat from '../components/NavBar/Chat';
import Locale from '../components/NavBar/Locale';
import User from '../components/NavBar/User';
import Builder from '../components/NavBar/Builder';
import SwitchToggle from '../components/NavBar/SwitchToggle';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.toggleActiveClass = this.toggleActiveClass.bind(this);

    this.state = { isActive: false };
  }

  toggleActiveClass() {
    const { isActive } = this.state;

    this.setState({
      isActive: !isActive,
    });
  }

  render() {
    const { user } = this.props;
    const { isActive } = this.state;

    return (
      <header>
        <nav className="navbar is-dark is-fixed-top has-text-white">
          <div className="navbar-brand">
            {user ? (
              <Fragment>
                <User customClass="is-hidden-desktop" />
                <SwitchToggle customClass="is-hidden-desktop" />
              </Fragment>
            ) : (
              <Login customClass="is-hidden-desktop" />
            )}
            <Logo />
            <div
              onClick={this.toggleActiveClass}
              id="menu-burger-icon"
              className={`navbar-burger navbar-item-no-bg ${isActive &&
                'is-active'}`}
              role="button"
            >
              <span />
              <span />
              <span />
            </div>
          </div>
          <Burger customClass="is-hidden-desktop" isActiveClass={isActive} />
          <div className="navbar-start">
            {user && (
              <Fragment>
                <Builder customClass="is-hidden-touch" />
                <Chat customClass="is-hidden-touch" />
              </Fragment>
            )}
            <About customClass="is-hidden-touch" />
          </div>
          <div className="navbar-end">
            {user ? (
              <Fragment>
                <SwitchToggle customClass="is-hidden-touch" />
              </Fragment>
            ) : (
              <Login customClass="is-hidden-touch" />
            )}
            <Locale customClass="is-hidden-touch" />
            {user && <User customClass="is-hidden-touch" />}
          </div>
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
