import React, { Fragment } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const About = (props, { t, router: { pathname } }) => (
  <Link href="/about">
    <a
      className={`navbar-item navbar-item-line navbar-item logo-twitelo ${pathname ===
        '/about' && 'navbar-item-line-active'}`}
    >
      <span className="icon is-medium has-text-info">
        <i className="fas fa-lg fa-info-circle" />
      </span>
      <span className="menu-button">{t('navbar.user.about')}</span>
    </a>
  </Link>
);

About.contextTypes = {
  router: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default About;
