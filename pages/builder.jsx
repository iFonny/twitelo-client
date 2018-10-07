import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';

import Layout from '../src/components/Layout';
import GameSelect from '../src/components/Builder/GameSelect';
import InputBuilder from '../src/components/Builder/InputBuilder';
import Accounts from '../src/components/Builder/Accounts';
import GameTagsList from '../src/components/Builder/GameTagsList';
import UserTags from '../src/components/Builder/UserTags';

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

    let { user, builder } = store.getState();

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
      ({ user, builder } = store.getState());
      await store.dispatch(transformFromUUID());
      ({ user, builder } = store.getState());
      await store.dispatch(updateTextCounters(builder));
      ({ user, builder } = store.getState());
      await store.dispatch(refreshPreview());
      ({ user, builder } = store.getState());
    }

    return {};
  }

  render() {
    return (
      <Layout>
        <div className="builder-page">
          <div className="tile is-ancestor">
            <div className="tile is-parent top-tile">
              <GameSelect />
            </div>
          </div>

          <div className="tile is-ancestor">
            <div className="tile is-parent top-tile left-tile">
              <Accounts />
            </div>

            <div className="tile is-parent is-7 top-tile right-tile">
              <InputBuilder />
            </div>
          </div>

          <div className="tile is-ancestor">
            <div className="tile is-parent top-tile left-tile">
              <GameTagsList />
            </div>
            <div className="tile is-parent is-7 top-tile right-tile">
              <UserTags />
            </div>
          </div>
        </div>
        <style jsx>
          {`
            .top-tile {
              padding-bottom: 0 !important;
            }

            .right-tile {
              padding-left: 0.35rem !important;
            }
            .left-tile {
              padding-right: 0.35rem !important;
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
