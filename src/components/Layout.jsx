import React from 'react';
import PropTypes from 'prop-types';
import NavBar from './NavBar';

const Layout = ({ children }) => (
  <div className="layout">
    <div className="background-image" />
    <NavBar />
    {children}
  </div>
);

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
};

export default Layout;
