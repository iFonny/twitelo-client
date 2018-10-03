import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import Layout from '../src/components/Layout';

import auth from '../src/libs/auth';

import {
  fetchBuilderData,
  transformFromUUID,
  updateTextCounters,
  refreshPreview,
} from '../src/actions/builder';

class Builder extends Component {
  static async getInitialProps({ store, isServer, req, res }) {
    if (isServer) await auth(store, req);

    const { user, builder } = store.getState();

    // Check if auth (if not: redirect home)
    if (!user) {
      if (res) {
        res.writeHead(302, {
          Location: '/',
        });
        res.end();
      } else {
        Router.push('/');
      }
    } else if (Object.keys(builder.games).length <= 0) {
      await store.dispatch(fetchBuilderData());
      await store.dispatch(transformFromUUID(user.twitelo, builder));
      await store.dispatch(updateTextCounters(builder));
      await store.dispatch(refreshPreview(user.twitelo, builder));
    }

    return {};
  }

  render() {
    return (
      <Layout>
        Builder
        <style jsx>
          {`
            .top-tile {
              padding-bottom: 0;
            }

            .right-tile {
              padding-left: 0.35rem;
            }
            .left-tile {
              padding-right: 0.35rem;
            }
            .bottom-tile {
              padding-right: 0;
              padding-left: 0;
              padding-bottom: 0;
            }
            .builder-page {
              margin-top: 0.5rem;
              padding: 0.7rem;
            }
            @media screen and (max-width: 768px) {
              .right-tile {
                padding-left: 0.75rem;
              }
              .left-tile {
                padding-right: 0.75rem;
              }
            }
          `}
        </style>
      </Layout>
    );
  }
}

export default connect(state => state)(Builder);
