import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';

import api from '../../libs/api';

import { selectAndFetchTags, createTagAndUpdate } from '../../actions/builder';
import { setError } from '../../actions/base';

const PaginationList = ({ total, perPage, currentPage, handlePageClick }) => {
  const pages = [];

  for (let i = 0; i < Math.ceil(total / perPage); i += 1) {
    pages.push(
      <li key={i}>
        <a
          role="button"
          onClick={() => handlePageClick(currentPage === i + 1, i + 1)}
          className={`pagination-link ${currentPage === i + 1 && 'is-current'}`}
        >
          {i + 1}
        </a>
      </li>,
    );
  }

  return <ul className="pagination-list">{pages}</ul>;
};
PaginationList.propTypes = {
  total: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  handlePageClick: PropTypes.func.isRequired,
};

class GameTagsList extends Component {
  constructor(props) {
    super(props);

    this.handleToggleShow = this.handleToggleShow.bind(this);
    this.handleInputDataForm = this.handleInputDataForm.bind(this);
    this.handleInputDataFormSettings = this.handleInputDataFormSettings.bind(this);
    this.handleInputDataFormDataSettings = this.handleInputDataFormDataSettings.bind(this);
    this.handleInputDataDynamicSettings = this.handleInputDataDynamicSettings.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleAddGameTagPopup = this.handleAddGameTagPopup.bind(this);
    this.handleCancelAddGameTag = this.handleCancelAddGameTag.bind(this);
    this.handleSelectSpeedrunGame = this.handleSelectSpeedrunGame.bind(this);
    this.handleGetSpeedrunGames = _.debounce(this.handleGetSpeedrunGames.bind(this), 1000);
    this.handleCreateTag = this.handleCreateTag.bind(this);

    this.checkInputs = this.checkInputs.bind(this);
    this.syncSelectedGameState = this.syncSelectedGameState.bind(this);
    this.tagExample = this.tagExample.bind(this);
    this.getSpeedrunCategories = this.getSpeedrunCategories.bind(this);
    this.goToDestinationSelection = this.goToDestinationSelection.bind(this);
    this.backToTagSettings = this.backToTagSettings.bind(this);

    this.state = {
      isOpen: true,
      navigation: null,
      tagCreation: null,
      dataForm: {
        settings: {},
        dataSettings: {},
      },
      speedrunDynamicSettings: {
        data: [],
        name: '',
        selected: null,
        isFetching: false,
        show: false,
      },
      currentPage: 1,
    };
  }

  componentDidUpdate(prevProps) {
    const { selectedGame } = this.props;

    if (prevProps.selectedGame !== selectedGame) {
      this.syncSelectedGameState();
    }
  }

  getSpeedrunCategories() {
    const { speedrunDynamicSettings } = this.state;
    const { selected } = speedrunDynamicSettings;

    if (selected && selected.categories) return selected.categories.data;
    return [];
  }

  tagExample() {
    const { tagCreation, dataForm } = this.state;
    const { t } = this.context;

    if (tagCreation && tagCreation.example && tagCreation.exampleOriginal && dataForm.settings) {
      let result = tagCreation.example;
      let { size } = tagCreation;

      const deepEx = key => {
        if (tagCreation.fieldSettings[key].input[dataForm.settings[key]])
          size += tagCreation.fieldSettings[key].input[dataForm.settings[key]].value;
        result = result[key][dataForm.settings[key]];
      };

      while (typeof result === 'object') {
        Object.keys(result).forEach(deepEx);
      }
      return `${result || tagCreation.exampleOriginal} (${size} ${t('builder.characters')})`;
    }
    return '...';
  }

  checkInputs() {
    const { tagCreation, dataForm } = this.state;
    const fieldSettingsArray = Object.keys(tagCreation.fieldSettings);
    const dataSettingsArray = Object.keys(tagCreation.dataSettings);

    if (tagCreation.account && !dataForm.account_id) return false;

    for (let i = 0; i < fieldSettingsArray.length; i += 1) {
      if (!dataForm.settings[fieldSettingsArray[i]]) return false;
    }

    for (let i = 0; i < dataSettingsArray.length; i += 1) {
      if (!dataForm.dataSettings[dataSettingsArray[i]]) return false;
    }

    return true;
  }

  goToDestinationSelection() {
    this.setState({ navigation: 'selectDestination' });
  }

  backToTagSettings() {
    this.setState({ navigation: 'createTag' });
  }

  syncSelectedGameState() {
    this.setState({ navigation: null, currentPage: 1 });
  }

  handleToggleShow(e) {
    e.preventDefault();

    const { isOpen } = this.state;

    this.setState({ isOpen: !isOpen });
  }

  handleInputDataForm(e, key) {
    const { dataForm } = this.state;

    this.setState({ dataForm: { ...dataForm, [key]: e.target.value } });
  }

  handleInputDataFormSettings(e, key) {
    const { dataForm } = this.state;

    this.setState({
      dataForm: {
        ...dataForm,
        settings: { ...dataForm.settings, [key]: e.target.value },
      },
    });
  }

  handleInputDataFormDataSettings(e, key) {
    const { dataForm } = this.state;

    this.setState({
      dataForm: {
        ...dataForm,
        dataSettings: { ...dataForm.dataSettings, [key]: e.target.value },
      },
    });
  }

  handleInputDataDynamicSettings(e, key) {
    const { speedrunDynamicSettings } = this.state;

    this.setState({
      speedrunDynamicSettings: { ...speedrunDynamicSettings, [key]: e.target.value },
    });
  }

  handlePageClick(isDisabled, pageNumber) {
    if (!isDisabled) {
      this.setState({ currentPage: pageNumber });
    }
  }

  handleCancelAddGameTag() {
    this.setState({
      navigation: null,
      tagCreation: null,

      dataForm: {
        settings: {},
        dataSettings: {},
      },
      speedrunDynamicSettings: {
        data: [],
        name: '',
        selected: null,
        isFetching: false,
        show: false,
      },
    });
  }

  handleAddGameTagPopup(gameTag) {
    const { accounts, selectedGame } = this.props;
    const { navigation } = this.state;

    if (gameTag.account && (!accounts[selectedGame.id] || accounts[selectedGame.id].length <= 0)) {
      this.setState({ navigation: 'accountRequired' });
      setTimeout(() => {
        if (navigation === 'accountRequired') this.setState({ navigation: null });
      }, 3000);
    } else {
      this.setState({ tagCreation: gameTag, navigation: 'createTag' });
    }
  }

  handleSelectSpeedrunGame(option) {
    const { speedrunDynamicSettings, dataForm } = this.state;

    const toOmit = ['category'];
    const clonedDataSettings = _.cloneDeep(dataForm.dataSettings);

    if (option) {
      clonedDataSettings.game = option.id;
    } else toOmit.push('game');

    this.setState({
      dataForm: {
        ...dataForm,
        dataSettings: _.omit(clonedDataSettings, toOmit),
      },
      speedrunDynamicSettings: {
        ...speedrunDynamicSettings,
        show: false,
        selected: option,
        name: option.names.international,
      },
    });
  }

  handleGetSpeedrunGames() {
    const { notifSetError } = this.props;
    const { speedrunDynamicSettings } = this.state;

    this.setState({
      speedrunDynamicSettings: {
        ...speedrunDynamicSettings,
        data: [],
        isFetching: true,
      },
    });

    api
      .get(
        `https://www.speedrun.com/api/v1/games?name=${
          speedrunDynamicSettings.name
        }&embed=categories`,
      )
      .then(({ data }) => {
        const gameList = [];

        data.data.forEach(item => gameList.push(item));

        this.setState({
          speedrunDynamicSettings: {
            ...speedrunDynamicSettings,
            isFetching: false,
            show: true,
            data: gameList,
          },
        });
      })
      .catch(e => {
        notifSetError(e);

        this.setState({
          speedrunDynamicSettings: {
            ...speedrunDynamicSettings,
            isFetching: false,
          },
        });
      });
  }

  handleCreateTag(destination) {
    const { actionCreateTagAndUpdate } = this.props;
    const { tagCreation, dataForm } = this.state;

    actionCreateTagAndUpdate({
      destination,
      tagInfo: tagCreation,
      accountID: dataForm.account_id,
      settings: dataForm.settings,
      dataSettings: dataForm.dataSettings,
    });
    this.handleCancelAddGameTag();
  }

  render() {
    const {
      selectedGame,
      gameTagsCategory,
      gameTagsCategoryPages,
      games,
      accounts,
      locale,
      onSelectGame,
    } = this.props;
    const {
      isOpen,
      navigation,
      currentPage,
      tagCreation,
      dataForm,
      speedrunDynamicSettings,
    } = this.state;
    const { t } = this.context;

    return (
      <Fragment>
        <article className="tile is-child has-text-centered game-tags-list">
          <div className="collapse card">
            <div className="collapse-trigger">
              <div onClick={this.handleToggleShow} role="button" className="card-header no-select">
                <div className="card-header-title">
                  <h1 className="title is-size-6-mobile is-size-5-desktop is-size-5">
                    {t('builder.select-game-tag')}
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
              <div className="card-content">
                {/* LOADING TAGS */
                selectedGame &&
                  gameTagsCategory == null && (
                    <div className="is-full-height">
                      <div className="loading-overlay is-full-height is-active">
                        <div className="loading-icon" />
                      </div>
                    </div>
                  )}

                {/* TAG SELECTION BOX */
                selectedGame &&
                  gameTagsCategory &&
                  Object.keys(gameTagsCategory).length > 0 && (
                    <div className="is-full-height">
                      {/* TAG SELECTION */
                      !navigation ? (
                        <div className="is-full-height tag-selection-list animated fadeIn">
                          {gameTagsCategoryPages.length > 0 && (
                            <Fragment>
                              {gameTagsCategoryPages[currentPage - 1].map(gameCategoryKey => (
                                <div key={gameCategoryKey} className="category-tags">
                                  <p>{gameCategoryKey}</p>
                                  <div className="field align-tags no-select is-grouped-multiline is-grouped">
                                    {Object.keys(gameTagsCategory[gameCategoryKey]).map(
                                      gameTagKey => (
                                        <div key={gameTagKey} className="control">
                                          <div
                                            onClick={() =>
                                              this.handleAddGameTagPopup(
                                                gameTagsCategory[gameCategoryKey][gameTagKey],
                                              )
                                            }
                                            role="button"
                                            className="tags game-tag has-addons"
                                          >
                                            <span className="tag game-tag-name is-twitter">
                                              {gameTagsCategory[gameCategoryKey][gameTagKey].name}
                                            </span>
                                            <span className="tag game-tag-add">
                                              <span className="icon is-small">
                                                <i className="fas fa-plus" />
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              ))}
                              <div className="pagination pagination-bottom is-centered id-small is-rounded">
                                <a
                                  role="button"
                                  disabled={currentPage === 1}
                                  onClick={() =>
                                    this.handlePageClick(currentPage === 1, currentPage - 1)
                                  }
                                  className="pagination-previous"
                                >
                                  <span className="icon">
                                    <i className="fas fa-chevron-left" />
                                  </span>
                                </a>
                                <a
                                  role="button"
                                  disabled={!gameTagsCategoryPages[currentPage]}
                                  onClick={() =>
                                    this.handlePageClick(
                                      !gameTagsCategoryPages[currentPage],
                                      currentPage + 1,
                                    )
                                  }
                                  className="pagination-next"
                                >
                                  <span className="icon">
                                    <i className="fas fa-chevron-right" />
                                  </span>
                                </a>
                                <PaginationList
                                  total={Object.keys(gameTagsCategory).length}
                                  perPage={gameTagsCategoryPages[0].length}
                                  currentPage={currentPage}
                                  handlePageClick={this.handlePageClick}
                                />
                              </div>
                            </Fragment>
                          )}
                        </div>
                      ) : (
                        <div className="is-full-height">
                          {/* POPUP CREATE TAG */
                          navigation === 'createTag' &&
                            tagCreation && (
                              <div className="is-full-height relative-zone">
                                <button
                                  onClick={this.handleCancelAddGameTag}
                                  type="button"
                                  className="delete tag-creation-cancel"
                                />

                                <p className="tag-title has-text-grey-lighter is-size-4 has-text-left">
                                  {tagCreation.name} - {tagCreation.categorySmall}
                                </p>
                                <p className="tag-example is-size-6 has-text-grey-light has-text-left">
                                  {t('builder.example')} : {this.tagExample()}
                                </p>

                                <div>
                                  <section className="tag-creation-popup has-text-left animated fadeIn">
                                    {tagCreation.account && (
                                      <Fragment>
                                        <div className="field is-expanded is-grouped">
                                          <p className="control">
                                            <label className="label">{t('builder.account')}</label>
                                          </p>
                                          <div className="control is-expanded">
                                            <span className="select is-small is-fullwidth is-empty">
                                              <select
                                                defaultValue=""
                                                value={dataForm.account_id}
                                                onChange={e =>
                                                  this.handleInputDataForm(e, 'account_id')
                                                }
                                                required
                                              >
                                                <option disabled hidden value="">
                                                  {t('builder.account')}
                                                </option>
                                                {Object.keys(accounts[tagCreation.gameID]).map(
                                                  accountKey => (
                                                    <option
                                                      key={accountKey}
                                                      value={
                                                        accounts[tagCreation.gameID][accountKey].id
                                                      }
                                                    >
                                                      {
                                                        accounts[tagCreation.gameID][accountKey]
                                                          .settings.username
                                                      }{' '}
                                                      {accounts[tagCreation.gameID][accountKey]
                                                        .settings.region
                                                        ? `(${accounts[tagCreation.gameID][
                                                            accountKey
                                                          ].settings.region.toUpperCase()})`
                                                        : ''}
                                                    </option>
                                                  ),
                                                )}
                                              </select>
                                            </span>
                                          </div>
                                        </div>

                                        {Object.keys(tagCreation.fieldSettings).map(settingKey => (
                                          <div
                                            key={settingKey}
                                            className="field is-expanded is-grouped-multiline is-grouped"
                                          >
                                            <p className="control">
                                              <label className="label">
                                                {
                                                  tagCreation.fieldSettings[settingKey].label[
                                                    locale
                                                  ]
                                                }{' '}
                                                {tagCreation.fieldSettings[settingKey].tooltip && (
                                                  <span
                                                    data-label={
                                                      tagCreation.fieldSettings[settingKey].tooltip[
                                                        locale
                                                      ]
                                                    }
                                                    className="is-light is-right is-small tooltip is-multiline"
                                                  >
                                                    <span className="icon has-text-grey-light is-small">
                                                      <i className="far fa-question-circle" />
                                                    </span>
                                                  </span>
                                                )}
                                              </label>
                                            </p>

                                            {tagCreation.fieldSettings[settingKey].type ===
                                              'select' && (
                                              <div className="control is-expanded">
                                                <span className="select is-small is-fullwidth is-empty">
                                                  <select
                                                    defaultValue=""
                                                    value={dataForm.settings[settingKey]}
                                                    onChange={e =>
                                                      this.handleInputDataFormSettings(
                                                        e,
                                                        settingKey,
                                                      )
                                                    }
                                                    required
                                                  >
                                                    <option disabled hidden value="">
                                                      {
                                                        tagCreation.fieldSettings[settingKey].label[
                                                          locale
                                                        ]
                                                      }
                                                    </option>
                                                    {Object.keys(
                                                      tagCreation.fieldSettings[settingKey].input,
                                                    ).map(inputKey => (
                                                      <option key={inputKey} value={inputKey}>
                                                        {
                                                          tagCreation.fieldSettings[settingKey]
                                                            .input[inputKey][locale]
                                                        }{' '}
                                                        {tagCreation.fieldSettings[settingKey]
                                                          .input[inputKey].value !== 0
                                                          ? `(${
                                                              tagCreation.fieldSettings[settingKey]
                                                                .input[inputKey].value > 0
                                                                ? '+'
                                                                : '-'
                                                            } ${Math.abs(
                                                              tagCreation.fieldSettings[settingKey]
                                                                .input[inputKey].value,
                                                            )} ${t('builder.characters')})`
                                                          : ''}
                                                      </option>
                                                    ))}
                                                  </select>
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        ))}

                                        {Object.keys(tagCreation.dataSettings).map(settingKey => (
                                          <div
                                            key={settingKey}
                                            className="field is-expanded is-grouped-multiline is-grouped"
                                          >
                                            <p className="control">
                                              <label className="label">
                                                {tagCreation.dataSettings[settingKey].label[locale]}{' '}
                                                {tagCreation.dataSettings[settingKey].tooltip && (
                                                  <span
                                                    data-label={
                                                      tagCreation.dataSettings[settingKey].tooltip[
                                                        locale
                                                      ]
                                                    }
                                                    className="is-light is-right is-small tooltip is-multiline"
                                                  >
                                                    <span className="icon has-text-grey-light is-small">
                                                      <i className="far fa-question-circle" />
                                                    </span>
                                                  </span>
                                                )}
                                              </label>
                                            </p>

                                            {/* INPUT TYPE: string */
                                            tagCreation.dataSettings[settingKey].type ===
                                              'string' && (
                                              <div className="control is-small is-expanded is-clearfix">
                                                <input
                                                  onChange={e =>
                                                    this.handleInputDataFormDataSettings(
                                                      e,
                                                      settingKey,
                                                    )
                                                  }
                                                  value={dataForm.dataSettings[settingKey]}
                                                  type="text"
                                                  placeholder={
                                                    tagCreation.dataSettings[settingKey].label[
                                                      locale
                                                    ]
                                                  }
                                                  required
                                                  className="input is-small"
                                                />
                                              </div>
                                            )}

                                            {/* INPUT TYPE: select */
                                            tagCreation.dataSettings[settingKey].type ===
                                              'select' && (
                                              <div className="control is-expanded">
                                                <span className="select is-small is-fullwidth is-empty">
                                                  <select
                                                    defaultValue=""
                                                    value={dataForm.dataSettings[settingKey]}
                                                    onChange={e =>
                                                      this.handleInputDataFormDataSettings(
                                                        e,
                                                        settingKey,
                                                      )
                                                    }
                                                    required
                                                  >
                                                    <option disabled hidden value="">
                                                      {
                                                        tagCreation.dataSettings[settingKey].label[
                                                          locale
                                                        ]
                                                      }
                                                    </option>
                                                    {Object.keys(
                                                      tagCreation.dataSettings[settingKey].input,
                                                    ).map(inputKey => (
                                                      <option key={inputKey} value={inputKey}>
                                                        {
                                                          tagCreation.dataSettings[settingKey]
                                                            .input[inputKey][locale]
                                                        }
                                                      </option>
                                                    ))}
                                                  </select>
                                                </span>
                                              </div>
                                            )}

                                            {/* INPUT TYPE: speedrun_game */
                                            tagCreation.dataSettings[settingKey].type ===
                                              'speedrun_game' && (
                                              <div className="autocomplete control is-expanded">
                                                <div
                                                  className={`control has-icons-left is-small is-clearfix ${speedrunDynamicSettings.isFetching &&
                                                    'is-loading'}`}
                                                >
                                                  <input
                                                    value={speedrunDynamicSettings.name}
                                                    onChange={e =>
                                                      this.handleInputDataDynamicSettings(e, 'name')
                                                    }
                                                    onInput={this.handleGetSpeedrunGames}
                                                    type="text"
                                                    placeholder={
                                                      tagCreation.dataSettings[settingKey].label[
                                                        locale
                                                      ]
                                                    }
                                                    required="required"
                                                    className="input is-small"
                                                  />
                                                  <span className="icon is-left is-small">
                                                    <i className="fas fa-search" />
                                                  </span>
                                                </div>
                                                {speedrunDynamicSettings.show && (
                                                  <div className="dropdown-menu">
                                                    <div className="dropdown-content">
                                                      {speedrunDynamicSettings.data.map(theGame => (
                                                        <a
                                                          key={theGame.id}
                                                          className="dropdown-item"
                                                          role="button"
                                                          onClick={() =>
                                                            this.handleSelectSpeedrunGame(theGame)
                                                          }
                                                        >
                                                          <span>{theGame.names.international}</span>
                                                        </a>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            )}

                                            {/* INPUT TYPE: speedrun_category */
                                            tagCreation.dataSettings[settingKey].type ===
                                              'speedrun_category' && (
                                              <div className="control is-expanded">
                                                <span className="select is-small is-fullwidth is-empty">
                                                  <select
                                                    defaultValue=""
                                                    value={dataForm.dataSettings[settingKey]}
                                                    onChange={e =>
                                                      this.handleInputDataFormDataSettings(
                                                        e,
                                                        settingKey,
                                                      )
                                                    }
                                                    required
                                                  >
                                                    <option disabled hidden value="">
                                                      {
                                                        tagCreation.dataSettings[settingKey].label[
                                                          locale
                                                        ]
                                                      }
                                                    </option>
                                                    {this.getSpeedrunCategories().map(input => (
                                                      <option key={input.id} value={input.id}>
                                                        {input.name}
                                                      </option>
                                                    ))}
                                                  </select>
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </Fragment>
                                    )}
                                  </section>
                                </div>

                                <div className="nav-buttons columns is-gapless is-mobile">
                                  <button
                                    onClick={this.handleCancelAddGameTag}
                                    type="button"
                                    className="column button is-danger"
                                  >
                                    {t('builder.cancel')}
                                  </button>
                                  <button
                                    onClick={this.goToDestinationSelection}
                                    type="button"
                                    className="column button is-success"
                                    disabled={!this.checkInputs()}
                                  >
                                    {t('builder.next')}
                                  </button>
                                </div>
                              </div>
                            )}

                          {/* POPUP SELECT DESTINATION */
                          navigation === 'selectDestination' && (
                            <div className="is-full-height relative-zone">
                              <button
                                onClick={this.handleCancelAddGameTag}
                                type="button"
                                className="delete tag-creation-cancel"
                              />

                              <p className="tag-title has-text-grey-lighter is-size-4 has-text-left">
                                {tagCreation.name} - {tagCreation.categorySmall}
                              </p>
                              <p className="tag-example is-size-6 has-text-grey-light has-text-left">
                                {t('builder.example')} : {this.tagExample()}
                              </p>

                              <div className="columns is-multiline is-mobile tag-destination-buttons animated fadeIn">
                                <div className="column is-half">
                                  <a
                                    onClick={() => this.handleCreateTag('name')}
                                    role="button"
                                    className="button is-info is-outlined"
                                  >
                                    {t('builder.placeholder.name')}
                                  </a>
                                </div>
                                <div className="column is-half">
                                  <a
                                    onClick={() => this.handleCreateTag('location')}
                                    role="button"
                                    className="button is-info is-outlined"
                                  >
                                    {t('builder.placeholder.location')}
                                  </a>
                                </div>
                                <div className="column">
                                  <a
                                    onClick={() => this.handleCreateTag('description')}
                                    role="button"
                                    className="button is-info is-outlined"
                                  >
                                    {t('builder.placeholder.description')}
                                  </a>
                                </div>
                              </div>

                              <p className="is-size-7 has-text-grey-light has-text-centered">
                                {t('builder.can-move-anywhere')}
                              </p>

                              <div className="nav-buttons columns is-gapless is-mobile">
                                <button
                                  onClick={this.backToTagSettings}
                                  type="button"
                                  className="column button is-danger"
                                >
                                  {t('builder.previous')}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* POPUP ACCOUNT REQUIRED */
                          navigation === 'accountRequired' && (
                            <div className="is-full-height no-selected-game animated fadeIn">
                              <button
                                onClick={this.handleCancelAddGameTag}
                                type="button"
                                className="delete user-tag-edition-cancel"
                              />

                              <p className="is-size-4 has-text-danger">
                                {t('builder.no-accounts')}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                {/* No tags */
                selectedGame &&
                  gameTagsCategory &&
                  Object.keys(gameTagsCategory).length <= 0 && (
                    <div className="is-full-height no-selected-game">
                      <p className="is-size-4 has-text-danger">{t('builder.no-tags-game')}</p>
                    </div>
                  )}

                {/* No selected game */
                !selectedGame && (
                  <div className="is-full-height no-selected-game">
                    <div className="game-list">
                      {Object.keys(games).map(key => (
                        <img
                          key={key}
                          onClick={() => onSelectGame(games[key])}
                          role="button"
                          src={`${api.defaults.baseURL}${games[key].icon}`}
                          alt={games[key].name}
                          className="game-list-icon no-select"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
        <style jsx>
          {`
            .align-tags {
              display: flex;
              justify-content: center !important;
            }
            .game-list-icon {
              height: 50px;
              width: 50px;
              margin: 0.3rem;
              cursor: pointer;
              -webkit-filter: drop-shadow(0px 0px 1px rgb(255, 255, 255));
              filter: drop-shadow(0px 0px 1px rgb(255, 255, 255));
            }
            .game-list-image {
              max-width: 80%;
              max-height: 80px;
              margin: 0.5rem;
              cursor: pointer;
            }
            .game-list-icon:hover {
              -webkit-filter: drop-shadow(0px 0px 1px #ecde5d);
              filter: drop-shadow(0px 0px 1px #ecde5d);
            }
            .game-list-image:hover {
              -webkit-filter: drop-shadow(0px 0px 1px #ecde5d);
              filter: drop-shadow(0px 0px 1px #ecde5d);
            }
            .game-tags-list .loading-overlay {
              position: relative !important;
            }
            .game-tag-add {
              background-color: #77e49c;
              color: #363636;
            }
            .game-tag-name,
            .game-tag-add {
              cursor: pointer;
              margin: 0 !important;
            }
            .category-tags {
              padding-top: 0.2rem !important;
              padding-bottom: 0.5rem !important;
            }
            .no-selected-game {
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .relative-zone {
              position: relative !important;
              padding-bottom: 50px;
            }
            .tag-creation-popup {
              border-radius: 3px;
              padding: 0 0.7rem;
              position: relative;
              width: 100%;
              z-index: 2;
            }
            .delete.tag-creation-cancel {
              position: absolute;
              right: 0.5rem !important;
              top: 0.5rem !important;
              height: 35px !important;
              width: 35px !important;
              max-height: 35px !important;
              max-width: 35px !important;
              min-height: 35px !important;
              min-width: 35px !important;
              border: 1px solid rgb(119, 116, 116);
              z-index: 1;
            }
            .game-tag:hover {
              -webkit-filter: drop-shadow(0px 0px 1px #ecde5d);
              filter: drop-shadow(0px 0px 1px #ecde5d);
            }
            .tag-title {
              padding: 0.4rem 0.7rem 0 0.7rem;
            }
            .tag-example {
              padding: 0 0.7rem 0.7rem 0.7rem;
            }
            .nav-buttons {
              position: absolute;
              bottom: 0;
              width: 100%;
            }
            .nav-buttons .button {
              border: unset;
              border-radius: 0;
            }

            .tag-selection-list {
              padding-bottom: 50px;
            }

            @media screen and (max-width: 325px) {
              .tag-selection-list {
                padding-bottom: 93px;
              }
            }
            .tag-destination-buttons {
              margin: 0;
              height: 112px;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .tag-destination-buttons .column {
              padding: 0;
            }
            .tag-destination-buttons .column .button {
              height: 100%;
              width: 80%;
            }

            @media screen and (max-width: 768px) {
              .tag-destination-buttons .column {
                padding: 0.3rem;
              }
            }

            // pagination
            .game-tags-list .pagination-bottom {
              position: absolute;
              bottom: 0;
              width: 100%;
              margin: 0;
              padding-bottom: 2px;
            }
            .game-tags-list .card {
              height: 100%;
            }

            .game-tags-list .collapse-content {
              height: calc(100% - 48px);
            }
            .game-tags-list .card-content {
              height: 100%;
              padding: 0;
            }
          `}
        </style>
      </Fragment>
    );
  }
}

GameTagsList.propTypes = {
  selectedGame: PropTypes.object,
  gameTagsCategory: PropTypes.object,
  locale: PropTypes.string.isRequired,
  games: PropTypes.object.isRequired,
  accounts: PropTypes.object.isRequired,
  gameTagsCategoryPages: PropTypes.array.isRequired,
  onSelectGame: PropTypes.func.isRequired,
  notifSetError: PropTypes.func.isRequired,
  actionCreateTagAndUpdate: PropTypes.func.isRequired,
};

GameTagsList.defaultProps = {
  gameTagsCategory: null,
  selectedGame: null,
};

GameTagsList.contextTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  locale: state.i18nState.lang,
  games: state.builder.games,
  accounts: state.builder.accounts,
  selectedGame: state.builder.selectedGame,
  gameTagsCategory: state.builder.gameTagsCategory,
  gameTagsCategoryPages: state.builder.gameTagsCategoryPages,
});

export default connect(
  mapStateToProps,
  {
    notifSetError: setError,
    onSelectGame: selectAndFetchTags,
    actionCreateTagAndUpdate: createTagAndUpdate,
  },
)(GameTagsList);
