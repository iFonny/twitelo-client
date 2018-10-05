import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import api from '../../libs/api';

const GameList = ({ gamesList }, { t }) => (
  <Fragment>
    <div className="hero-head game-list-container">
      <div className="container has-text-centered">
        <h1 className="title is-3 has-text-weight-light">{t('home.games-list')}</h1>
        <div className="has-text-centered game-list">
          {Object.keys(gamesList).map(game => (
            <div className="frame" key={gamesList[game].id}>
              <span className="helper" />
              <img
                src={`${api.defaults.baseURL}${gamesList[game].image}`}
                alt={gamesList[game].name}
                className="game-list-image no-select"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
    <style jsx>
      {`
        .game-list-container {
          margin: 1.5rem 0.5rem;
        }

        .game-list-container .title {
          margin-bottom: 0.5rem;
        }
        .game-list {
          margin-bottom: 0;
        }

        .game-list-image {
          max-height: 40px;
          max-width: 200px;
          margin: 0.5rem;
          cursor: pointer;
        }

        .game-list .frame {
          white-space: nowrap;
          text-align: center;
          display: inline-block;
        }

        .game-list .helper {
          display: inline-block;
          height: 100%;
          vertical-align: middle;
        }

        .game-list img {
          vertical-align: middle;
        }
      `}
    </style>
  </Fragment>
);

GameList.contextTypes = {
  t: PropTypes.func.isRequired,
};

GameList.propTypes = {
  gamesList: PropTypes.object.isRequired,
};

export default GameList;
