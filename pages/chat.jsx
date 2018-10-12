import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import Layout from '../src/components/Layout';

import auth from '../src/libs/auth';

class Chat extends Component {
  static async getInitialProps({ store, isServer, req, res }) {
    if (isServer) await auth(store, req);

    const { user } = store.getState();

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
    }

    return {};
  }

  componentWillUpdate() {
    document.title = 'Chat - Twitelo';
  }

  render() {
    return <Layout>Chat</Layout>;
  }
}

export default connect(state => state)(Chat);
