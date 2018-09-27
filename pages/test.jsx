import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Layout from '../src/components/Layout';
import auth from '../src/libs/auth';

class Page extends Component {
  static async getInitialProps({ store, isServer, pathname, query, req }) {
    if (isServer) await auth(store, req);

    return {};
  }

  render() {
    return (
      <Layout>
        <div>Prop from Redux </div>
        <div>Prop from getInitialProps</div>
        <Link href="/">
          <a>Home</a>
        </Link>
      </Layout>
    );
  }
}

export default connect(state => state)(Page);
