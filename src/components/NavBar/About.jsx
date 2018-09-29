import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const About = ({ customClass }, { t, router: { pathname } }) => (
  <Link href="/about">
    <a
      className={`navbar-item navbar-item-line navbar-item logo-twitelo ${customClass} ${pathname ===
        '/about' && 'navbar-item-line-active'}`}
    >
      <span className="icon is-medium">
        <i className="fas fa-lg fa-info-circle" />
      </span>
      <span className="menu-button">{t('navbar.about')}</span>
    </a>
  </Link>
);

About.contextTypes = {
  router: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

About.propTypes = {
  customClass: PropTypes.string,
};

About.defaultProps = {
  customClass: '',
};

export default About;
