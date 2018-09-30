import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const SiteDescription = (props, { t }) => (
  <Fragment>
    <div className="hero-body twitelo-description">
      <div className="container has-text-centered">
        <h1
          className="title is-3 has-text-weight-light"
          dangerouslySetInnerHTML={{ __html: t('home.twitelo-description-l1') }}
        />
        <h1
          className="title is-5 has-text-weight-light"
          dangerouslySetInnerHTML={{ __html: t('home.twitelo-description-l2') }}
        />
      </div>
    </div>
    <style jsx>
      {`
        .twitelo-description {
          padding-bottom: 2rem;
          padding-top: 2.5rem;
        }
      `}
    </style>
  </Fragment>
);

SiteDescription.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SiteDescription;
