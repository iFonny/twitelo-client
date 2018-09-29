import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Layout from '../src/components/Layout';

import auth from '../src/libs/auth';

class Home extends Component {
  static async getInitialProps({ store, isServer, req }) {
    if (isServer) await auth(store, req);

    return { test: store.getState() };
  }

  render() {
    return (
      <Layout>
        <div>Coucou</div>

        <div>Coucou</div>
        <div>Coucou</div>
        <div>Coucou</div>
        <div>Coucou</div>
        <div>Coucou</div>
        <div>Coucou</div>
        <div>Coucou</div>

        <Link href="/test">
          <a>Test</a>
        </Link>
        <Link href="/test">
          <a>Test</a>
        </Link>
        <Link href="/test">
          <a>Test</a>
        </Link>
        <Link href="/test">
          <a>Test</a>
        </Link>
      </Layout>
    );
  }
}

export default connect(state => state)(Home);
