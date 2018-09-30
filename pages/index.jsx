import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Layout from '../src/components/Layout';
import SiteDescription from '../src/components/Home/SiteDescription';

import auth from '../src/libs/auth';
import api from '../src/libs/api';

import GameList from '../src/components/Home/GameList';
import FooterHome from '../src/components/Home/FooterHome';

class Home extends Component {
  static async getInitialProps({ store, isServer, req }) {
    if (isServer) await auth(store, req);

    let gamesList = [];
    let latestUsers = [];

    try {
      gamesList = (await api.get('/game')).data.data;
    } catch (e) {
      gamesList = [];
      console.error(e);
    }
    try {
      latestUsers = (await api.get('/user/latest')).data.data;
    } catch (e) {
      latestUsers = [];
      console.error(e);
    }

    return { gamesList, latestUsers };
  }

  render() {
    const { gamesList, latestUsers } = this.props;

    return (
      <Layout>
        <SiteDescription />
        <GameList gamesList={gamesList} />
        <FooterHome latestUsers={latestUsers} />
      </Layout>
    );
  }
}

Home.propTypes = {
  gamesList: PropTypes.object.isRequired,
  latestUsers: PropTypes.array.isRequired,
};

export default connect(state => state)(Home);
