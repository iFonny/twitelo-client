import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Layout from '../src/components/Layout';

import auth from '../src/libs/auth';

class Home extends Component {
  static async getInitialProps({ store, isServer, pathname, query, req }) {
    if (isServer) await auth(store, req);

    return { test: store.getState() };
  }

  render() {
    return (
      <Layout>
        <div>
          {this.props.test.user
            ? this.props.test.user.username
            : 'PLEASE LOG IN'}
        </div>
        <Link href="/test">
          <a>Test</a>
        </Link>
      </Layout>
    );
  }
}

export default connect(state => state)(Home);
