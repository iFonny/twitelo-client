import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const SiteDescription = (props, { t }) => (
  <Fragment>
    <div className="hero-head has-text-centered">
      <div className="container bio-example-container">
        <div className="bio-example-banner">
          <img
            className="round-pp-preview no-select"
            src="/images/fir.jpg"
            alt="profile"
            onError={e => {
              e.target.onerror = null;
              e.target.src = '/images/errors/default_profile.png';
            }}
          />
        </div>
        <div className="bio-example-desc">
          <p className="title is-4 has-text-white text-overflow-is-ellipsis">
            <span className="tag is-cyan">Fir</span>
          </p>
          <p className="subtitle is-5 has-text-white-ter has-text-weight-light is-italic">
            {t('home.description-example.l1')}
            <br />
            {t('home.description-example.l2')} <span className="tag is-cyan">Diamond</span>
            <span className="tag is-cyan">IV</span>
            <span className="tag is-cyan">86 LP</span>
            {t('home.description-example.l3')}
            <br /> Speedrun
            <span className="tag is-cyan">Super Mario Odyssey</span>
            <span className="tag is-cyan">Any%</span>
            {t('home.description-example.l4')}
          </p>
          <p className="title is-6 has-text-grey-lighter text-overflow-is-ellipsis">
            <span>
              <span className="icon icon-bio-example is-small">
                <i className="fas fa-map-marker-alt" />
              </span>
              PB : <span className="tag is-cyan">1h 01m 32s</span> -{' '}
              <span className="tag is-cyan">6th</span>
            </span>
          </p>
          <p className="subtitle is-6 has-text-info text-overflow-is-ellipsis">
            <span className="icon icon-bio-example is-small">
              <i className="fas fa-link" />
            </span>
            <span>http://speedrun.com/user/Fir</span>
          </p>
        </div>
      </div>
    </div>
    <style jsx>
      {`
        .bio-example-container {
          border: 1px solid rgb(26, 26, 26);
          box-shadow: 0px 4px 16px rgb(17, 17, 17);
        }

        .bio-example-banner {
          padding: 1rem;
          background-image: url('/banner.jpg');
          background-repeat: no-repeat;
          background-position: center top;
          background-size: cover;
        }

        .bio-example-desc {
          padding: 0.5rem;
          background-color: #363636;
        }

        @media screen and (max-width: 1023px) {
          .bio-example-container {
            border: 0;
          }
        }

        .bio-example-desc .title,
        .bio-example-desc .subtitle {
          line-height: 1.5rem;
        }

        .bio-example-desc .tag {
          margin: 0 0.1rem;
        }

        .icon-bio-example {
          margin-right: 0.2rem;
        }

        .round-pp-preview {
          object-fit: cover;
          height: 100px;
          width: 100px;
          border-radius: 100%;
          border: 1px solid rgb(26, 26, 26);
          cursor: pointer;
        }

        .round-pp-preview-mobile {
          object-fit: cover;
          height: 50px;
          width: 50px;
          border-radius: 100%;
          border: 1px solid white;
          cursor: pointer;
        }
      `}
    </style>
  </Fragment>
);

SiteDescription.contextTypes = {
  router: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default SiteDescription;
