import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Layout from '../src/components/Layout';

import auth from '../src/libs/auth';

class Error extends Component {
  static async getInitialProps({ isServer, store, res, req, err }) {
    if (isServer) await auth(store, req);
    if (res) return { statusCode: res.statusCode };
    if (err) return { statusCode: err.statusCode };
    return { statusCode: null };
  }

  render() {
    const { statusCode } = this.props;
    const { t } = this.context;

    let message = t('error.unknown-error');

    if (statusCode === 403) message = t('error.forbidden');
    else if (statusCode === 404) message = t('error.page-not-found');
    else if (statusCode === 500) message = t('error.internal-server-error');
    else if (statusCode === 503) message = t('error.service-unavailable');
    else if (statusCode === 504) message = t('error.gateway-time-out');

    return (
      <Layout>
        <div className="container">
          {parseInt(statusCode, 10) && (
            <div className="page-error-code">{statusCode}</div>
          )}
          <div className="page-error-message">{message}</div>
          <br />
          <Link href="/">
            <a className="button is-light">
              <span className="icon is-small">
                <i className="fas fa-home" />
              </span>
              <span>{t('error.back-home')}</span>
            </a>
          </Link>
        </div>

        <style jsx>{`
          .container {
            text-align: center;
            margin-top: 2rem;
          }
          .page-error-code {
            font-weight: bolder;
            font-size: 8rem;
            text-align: center;
            font-family: 'Neucha', 'Avenir Next', Avenir, Helvetica, Arial,
              sans-serif;
            line-height: normal;
          }
          .page-error-message {
            font-size: 1.5rem;
            text-align: center;
            font-family: 'Neucha', 'Avenir Next', Avenir, Helvetica, Arial,
              sans-serif;
          }
        `}</style>
      </Layout>
    );
  }
}

Error.contextTypes = {
  t: PropTypes.func.isRequired,
};

Error.propTypes = {
  statusCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default Error;
