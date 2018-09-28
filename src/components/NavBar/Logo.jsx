import React, { Fragment } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const Logo = (props, { router: { pathname } }) => (
  <Fragment>
    <Link href="/">
      <a
        className={`navbar-item navbar-item-line navbar-item logo-twitelo ${pathname ===
          '/' && 'navbar-item-line-active'}`}
      >
        <img id="menu-logo" src="/static/logo.png" alt="logo" />
        <span className="home-button has-text-weight-bold is-uppercase is-hidden-mobile">
          Twitelo
        </span>
      </a>
    </Link>
    <style jsx>{`
      .logo-twitelo {
        margin-left: auto;
      }
      .home-button {
        margin-left: 5px;
      }
    `}</style>
  </Fragment>
);

Logo.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default Logo;
