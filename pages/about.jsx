import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../src/components/Layout';

import auth from '../src/libs/auth';

class About extends Component {
  static async getInitialProps({ store, isServer, pathname, query, req }) {
    if (isServer) await auth(store, req);

    return {};
  }

  render() {
    return <Layout>About</Layout>;
  }
}

export default connect(state => state)(About);
