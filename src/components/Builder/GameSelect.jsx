import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import api from '../../libs/api';

import { selectAndFetchTags } from '../../actions/builder';

const ListItem = ({ game, onSelectGame }) => (
  <Fragment>
    <img
      onClick={() => onSelectGame(game)}
      src={`${api.defaults.baseURL}${game.icon}`}
      alt={game.name}
      className="game-list-icon no-select"
      role="button"
    />
    <style jsx>{`
      .game-list-icon {
        height: 50px;
        width: 50px;
        margin: 0.3rem;
        cursor: pointer;
        -webkit-filter: drop-shadow(0px 0px 1px rgb(255, 255, 255));
        filter: drop-shadow(0px 0px 1px rgb(255, 255, 255));
      }
      .game-list-icon:hover {
        -webkit-filter: drop-shadow(0px 0px 1px #ecde5d);
        filter: drop-shadow(0px 0px 1px #ecde5d);
      }
    `}</style>
  </Fragment>
);
ListItem.propTypes = {
  game: PropTypes.object.isRequired,
  onSelectGame: PropTypes.func.isRequired,
};

const GameList = ({ games, onSelectGame }) => {
  const listItems = Object.keys(games).map(key => (
    <ListItem
      key={games[key].id.toString()}
      game={games[key]}
      onSelectGame={onSelectGame}
    />
  ));

  return <div className="game-list">{listItems}</div>;
};
GameList.propTypes = {
  games: PropTypes.object.isRequired,
  onSelectGame: PropTypes.func.isRequired,
};

const SelectedGame = ({ game, onSelectGame }) => (
  <div className="content align-vertical-center animated bounceIn">
    <img
      onClick={() => onSelectGame(null)}
      src={`${api.defaults.baseURL}${game.image}`}
      alt={game.name}
      className="game-list-image no-select"
      role="button"
    />
    <style jsx>{`
      .game-list-image {
        max-width: 80%;
        max-height: 80px;
        margin: 0.5rem;
        cursor: pointer;
      }
      .game-list-image:hover {
        -webkit-filter: drop-shadow(0px 0px 1px #ecde5d);
        filter: drop-shadow(0px 0px 1px #ecde5d);
      }
    `}</style>
  </div>
);

SelectedGame.propTypes = {
  game: PropTypes.object.isRequired,
  onSelectGame: PropTypes.func.isRequired,
};

class GameSelect extends Component {
  constructor(props) {
    super(props);

    this.handleToggleShowGames = this.handleToggleShowGames.bind(this);

    this.state = {
      isOpen: true,
    };
  }

  handleToggleShowGames(e) {
    e.preventDefault();

    const { isOpen } = this.state;

    this.setState({
      isOpen: !isOpen,
    });
  }

  render() {
    const { selectedGame, games, onSelectGame } = this.props;
    const { isOpen } = this.state;
    const { t } = this.context;

    return (
      <Fragment>
        <article className="tile is-child has-text-centered game-select">
          <div className="collapse card">
            <div className="collapse-trigger">
              <div
                onClick={this.handleToggleShowGames}
                role="button"
                className="card-header no-select"
              >
                <div className="card-header-title">
                  <h1 className="title is-size-6-mobile is-size-5-desktop is-size-5">
                    {t('builder.select-game')}
                  </h1>
                </div>
                <a className="card-header-icon">
                  <span className="icon">
                    <i className={`fas fa-caret-${isOpen ? 'down' : 'up'}`} />
                  </span>
                </a>
              </div>
            </div>
            <div className={`collapse-content ${!isOpen && 'is-invisible'}`}>
              <div className="card-content align-vertical-center">
                <div>
                  {selectedGame ? (
                    <Fragment>
                      <button
                        onClick={() => onSelectGame(null)}
                        type="button"
                        className="delete game-selection-cancel"
                      />
                      <SelectedGame
                        game={selectedGame}
                        onSelectGame={onSelectGame}
                      />
                    </Fragment>
                  ) : (
                    <GameList games={games} onSelectGame={onSelectGame} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
        <style jsx>
          {`
            .delete.game-selection-cancel {
              position: absolute;
              right: 0.5rem !important;
              top: 3.5rem !important;
              height: 35px !important;
              width: 35px !important;
              max-height: 35px !important;
              max-width: 35px !important;
              min-height: 35px !important;
              min-width: 35px !important;
              border: 1px solid rgb(119, 116, 116);
              z-index: 1;
            }
            .game-select .card-content {
              min-height: 120px;
              padding: 0.3rem;
              padding-bottom: 0;
            }
          `}
        </style>
      </Fragment>
    );
  }
}

GameSelect.propTypes = {
  selectedGame: PropTypes.object,
  games: PropTypes.object.isRequired,
  onSelectGame: PropTypes.func.isRequired,
};

GameSelect.contextTypes = {
  t: PropTypes.func.isRequired,
};

GameSelect.defaultProps = {
  selectedGame: null,
};

const mapStateToProps = state => ({
  selectedGame: state.builder.selectedGame,
  games: state.builder.games,
});

export default connect(
  mapStateToProps,
  { onSelectGame: selectAndFetchTags },
)(GameSelect);
