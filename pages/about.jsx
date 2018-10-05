import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import api from '../src/libs/api';
import Layout from '../src/components/Layout';

import auth from '../src/libs/auth';

class About extends Component {
  static async getInitialProps({ store, isServer, req }) {
    if (isServer) await auth(store, req);

    let stats = [];

    try {
      stats = (await api.get('/other/stats/min')).data.data;
    } catch (e) {
      console.log(e);
      stats = [];
    }

    return { stats };
  }

  render() {
    const {
      stats,
      i18nState: { lang },
    } = this.props;
    const { t } = this.context;

    return (
      <Layout>
        <div className="container is-fluid about-page">
          {/* Contributors */}
          <section className="has-text-centered">
            <img className="twitelo-logo" src="/static/logo.png" alt="logo" />
            <br />
            <p className="is-size-3 has-text-weight-bold has-text-centered">
              {t('about.contributors')}
            </p>
            <ul className="is-size-5">
              <li>
                <span className="has-text-weight-semibold">Nicolas Thouchkaieff</span>{' '}
                <span className="is-italic">- nicolas.thouchkaieff@epitech.eu -</span>
                <a href="https://github.com/ifonny">
                  <span className="icon-link has-text-link">
                    <i className="fab fa-github fa-lg" />
                  </span>
                </a>
              </li>
              <li>
                <span className="has-text-weight-semibold">Gaetan Brignou</span>{' '}
                <span className="is-italic">- gaetan.brignou@epitech.eu -</span>
                <a href="https://github.com/GaetanBrignou">
                  <span className="icon-link has-text-link">
                    <i className="fab fa-github fa-lg" />
                  </span>
                </a>
              </li>
            </ul>
          </section>
          {/* Github */}
          <section className="has-text-centered">
            <p className="is-size-3 has-text-weight-bold has-text-centered">Github</p>
            <ul className="is-size-5">
              <li>
                <span className="has-text-weight-semibold">Server</span>{' '}
                <a href="https://github.com/iFonny/twitelo-server">
                  <span className="is-italic">- github.com/iFonny/twitelo-server -</span>
                  <span className="icon-link has-text-link">
                    <i className="fab fa-github fa-lg" />
                  </span>
                </a>
              </li>
              <li>
                <span className="has-text-weight-semibold">Client</span>{' '}
                <a href="https://github.com/iFonny/twitelo-client">
                  <span className="is-italic">- github.com/iFonny/twitelo-client -</span>
                  <span className="icon-link has-text-link">
                    <i className="fab fa-github fa-lg" />
                  </span>
                </a>
              </li>
            </ul>
          </section>
          {/* Statistics */}
          <section className="has-text-centered">
            <p className="is-size-3 has-text-weight-bold has-text-centered">{t('about.stats')}</p>
            <ul className="is-size-5">
              <li>
                <span className="has-text-weight-bold has-text-warning is-size-4">
                  {stats[0].nb}{' '}
                </span>
                <span className="has-text-weight-light">{stats[0].text[lang]} </span>
              </li>
              <li>
                <span className="has-text-weight-bold has-text-warning is-size-4">
                  {stats[1].nb}{' '}
                </span>
                <span className="has-text-weight-light">{stats[1].text[lang]} </span>
                <span className="is-size-4">
                  |{' '}
                  <span className="has-text-weight-bold has-text-warning is-size-4">
                    {stats[1].bonus.nb}{' '}
                  </span>
                  <span className="has-text-weight-light is-size-5">
                    {stats[1].bonus.text[lang]}
                  </span>
                </span>
              </li>
            </ul>
          </section>
        </div>
        <style jsx>
          {`
            .icon-link {
              margin-left: 0.5rem;
            }

            .container {
              margin: 0;
              padding: 0.5rem 3rem 1.5rem 3rem;
            }
            .about-page .twitelo-logo {
              height: 100px;
            }
            .about-page section {
              padding-top: 0.8rem;
            }

            @media screen and (max-width: 768px) {
              .container {
                padding: 0rem 0.5rem 1.5rem 0.5rem;
              }
            }
          `}
        </style>
      </Layout>
    );
  }
}

About.contextTypes = {
  t: PropTypes.func.isRequired,
};

About.propTypes = {
  stats: PropTypes.array.isRequired,
  i18nState: PropTypes.object.isRequired,
};

export default connect(state => state)(About);
