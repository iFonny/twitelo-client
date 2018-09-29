import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const Builder = ({ customClass }, { t, router: { pathname } }) => (
  <Link href="/builder">
    <a
      className={`navbar-item navbar-item-line ${customClass} ${pathname ===
        '/builder' && 'navbar-item-line-active'}`}
    >
      <span className="icon is-medium has-text-light">
        <i className="fas fa-lg fa-paint-brush" />
      </span>
      <span className="menu-button">{t('navbar.builder')}</span>
    </a>
  </Link>
);

Builder.contextTypes = {
  router: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

Builder.propTypes = {
  customClass: PropTypes.string,
};

Builder.defaultProps = {
  customClass: '',
};

export default Builder;
