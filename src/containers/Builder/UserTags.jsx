import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';

import api from '../../libs/api';

import {
  setTwiteloDataInput,
  setBuilderLoading,
  deleteTagWithIndex,
  updateTag,
} from '../../actions/builder';
import setError from '../../actions/base';

class UserTags extends Component {
  constructor(props) {
    super(props);

    this.handleToggleShow = this.handleToggleShow.bind(this);
    this.handleInputDataForm = this.handleInputDataForm.bind(this);
    this.handleInputDataFormSettings = this.handleInputDataFormSettings.bind(this);
    this.handleInputDataFormDataSettings = this.handleInputDataFormDataSettings.bind(this);
    this.handleInputDataDynamicSettings = this.handleInputDataDynamicSettings.bind(this);
    this.handleCancelEditUserTag = this.handleCancelEditUserTag.bind(this);
    this.handleSelectSpeedrunGame = this.handleSelectSpeedrunGame.bind(this);
    this.handleGetSpeedrunGames = _.debounce(this.handleGetSpeedrunGames.bind(this), 1000);
    this.handleGetSpeedrunGameByID = this.handleGetSpeedrunGameByID.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.handleEditTagPopup = this.handleEditTagPopup.bind(this);
    this.handleDeleteTagPopup = this.handleDeleteTagPopup.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);
    this.handleUpdateUserTag = this.handleUpdateUserTag.bind(this);

    this.getSpeedrunCategories = this.getSpeedrunCategories.bind(this);
    this.checkInputs = this.checkInputs.bind(this);

    this.state = {
      isOpen: true,
      navigation: null,
      showUnusedTags: true,
      tagEdition: null,
      saveButtonIsLoading: false,
      removeButtonIsLoading: false,
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
    };
  }

  getSpeedrunCategories() {
    const { speedrunDynamicSettings } = this.state;
    const { selected } = speedrunDynamicSettings;

    if (selected && selected.categories) return selected.categories.data;
    return [];
  }

  checkInputs() {
    const { tagEdition, dataForm } = this.state;
    const fieldSettingsArray = Object.keys(tagEdition.info.fieldSettings);
    const dataSettingsArray = Object.keys(tagEdition.info.dataSettings);

    if (dataForm.account_id !== tagEdition.account_id) return true;
    for (let i = 0; i < fieldSettingsArray.length; i += 1) {
      if (!dataForm.settings[fieldSettingsArray[i]]) return false;
      if (dataForm.settings[fieldSettingsArray[i]] !== tagEdition.settings[fieldSettingsArray[i]])
        return true;
    }

    for (let i = 0; i < dataSettingsArray.length; i += 1) {
      if (!dataForm.dataSettings[dataSettingsArray[i]]) return false;
      if (
        dataForm.dataSettings[dataSettingsArray[i]] !==
        tagEdition.data_settings[dataSettingsArray[i]]
      )
        return true;
    }

    return false;
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

  handleCancelEditUserTag() {
    this.setState({
      navigation: null,
      tagEdition: null,
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

  handleSwitchChange() {
    const { showUnusedTags } = this.state;

    this.setState({ showUnusedTags: !showUnusedTags });
  }

  handleGetSpeedrunGameByID(id) {
    const { notifSetError } = this.props;
    const { speedrunDynamicSettings } = this.state;

    this.setState({
      speedrunDynamicSettings: {
        ...speedrunDynamicSettings,
        isFetching: true,
      },
    });

    api
      .get(`https://www.speedrun.com/api/v1/games/${id}?embed=categories`)
      .then(({ data }) => {
        this.setState({
          speedrunDynamicSettings: {
            ...speedrunDynamicSettings,
            name: data.data.names.international,
            selected: data.data,
            isFetching: false,
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

  handleEditTagPopup(tag, key) {
    const newTag = _.cloneDeep(tag);
    newTag.index = key;
    this.setState({
      navigation: 'editTag',
      tagEdition: newTag,
      dataForm: {
        account_id: tag.account_id,
        settings: _.cloneDeep(tag.settings) || {},
        dataSettings: _.cloneDeep(tag.data_settings) || {},
      },
    });

    /* dynamic settings */
    if (tag.game_id === 'speedrun' && tag.data_settings.game) {
      this.handleGetSpeedrunGameByID(tag.data_settings.game);
    }
  }

  handleAddTag(tag, destination) {
    const { actionSetBuilderLoading, actionSetTwiteloDataInput, twiteloDataInput } = this.props;

    actionSetBuilderLoading(true);
    actionSetTwiteloDataInput(
      destination,
      `${twiteloDataInput[destination].trim()} <{${tag.index}}>`,
    );
    actionSetBuilderLoading(false);
  }

  handleDeleteTagPopup(tag, key) {
    const newTag = _.cloneDeep(tag);
    newTag.index = key;
    this.setState({
      navigation: 'removeTagConfirm',
      tagEdition: newTag,
    });
  }

  async handleDeleteTag(tag) {
    const { actionDeleteTag } = this.props;

    this.setState({ removeButtonIsLoading: true });

    await actionDeleteTag(tag);

    this.handleCancelEditUserTag();
    this.setState({ removeButtonIsLoading: false });
  }

  async handleUpdateUserTag(tag) {
    const { actionUpdateTag } = this.props;
    const { dataForm } = this.state;

    this.setState({ saveButtonIsLoading: true });

    await actionUpdateTag({
      tag,
      accountID: dataForm.account_id,
      settings: dataForm.settings,
      dataSettings: dataForm.dataSettings,
    });

    this.handleCancelEditUserTag();
    this.setState({ saveButtonIsLoading: false });
  }

  render() {
    const { userTags, games, accounts, locale } = this.props;
    const {
      isOpen,
      navigation,
      showUnusedTags,
      tagEdition,
      removeButtonIsLoading,
      saveButtonIsLoading,
      dataForm,
      speedrunDynamicSettings,
    } = this.state;
    const { t } = this.context;

    return (
      <Fragment>
        <article className="tile is-child has-text-centered user-tags-list">
          <div className="collapse card">
            <div className="collapse-trigger">
              <div onClick={this.handleToggleShow} role="button" className="card-header no-select">
                <div className="card-header-title">
                  <h1 className="title is-size-6-mobile is-size-5-desktop is-size-5">
                    {t('builder.profile-data')}
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
                <div className="user-tags is-full-height">
                  {/* USER TAGS LIST */
                  !navigation ? (
                    <div className="is-full-height">
                      <div className="field is-grouped-right is-grouped">
                        <p className="control is-size-7">{t('builder.show-unused-tags')}</p>
                        <label className="switch is-small">
                          <input
                            type="checkbox"
                            checked={showUnusedTags}
                            onChange={this.handleSwitchChange}
                          />
                          <span className="check" /> <span className="control-label" />
                        </label>
                      </div>
                      <div className="field align-tags is-grouped-multiline is-grouped">
                        {!userTags.length ? (
                          <p className="is-size-4 has-text-danger">{t('builder.no-data')}</p>
                        ) : (
                          <Fragment>
                            {userTags.map((userTag, userTagKey) => (
                              <div key={userTag.id}>
                                {(showUnusedTags || userTag.included) && (
                                  <div className="tags animated fadeIn has-addons">
                                    <span
                                      onClick={() => this.handleEditTagPopup(userTag, userTagKey)}
                                      role="button"
                                      className="tag user-tag user-tag-edit is-twitter"
                                    >
                                      <span className="icon is-small">
                                        <i className="far fa-edit" />
                                      </span>
                                    </span>
                                    <span
                                      onClick={() => this.handleEditTagPopup(userTag, userTagKey)}
                                      role="button"
                                      className="tag user-tag user-tag-key"
                                    >
                                      <b>{userTagKey}</b>
                                    </span>
                                    <span
                                      onClick={() => this.handleEditTagPopup(userTag, userTagKey)}
                                      role="button"
                                      className={`tag user-tag user-tag-name-category ${
                                        userTag.included ? 'included' : 'not-included'
                                      }`}
                                    >
                                      {userTag.info.nameSmall} - {userTag.info.categorySmall}
                                    </span>
                                    <span
                                      onClick={() => this.handleEditTagPopup(userTag, userTagKey)}
                                      role="button"
                                      className="tag user-tag user-tag-game"
                                      style={{
                                        backgroundColor: games[userTag.game_id].color,
                                      }}
                                    >
                                      {games[userTag.game_id].small_name}
                                    </span>
                                    <span
                                      onClick={() => this.handleDeleteTagPopup(userTag, userTagKey)}
                                      role="button"
                                      className="tag user-tag user-tag-delete is-danger"
                                    >
                                      <span className="icon is-small">
                                        <i className="far fa-trash-alt" />
                                      </span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </Fragment>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="is-full-height">
                      {/* EDIT USER TAGS POPUP */
                      navigation === 'editTag' &&
                        tagEdition && (
                          <div className="is-full-height relative-zone">
                            <button
                              onClick={this.handleCancelEditUserTag}
                              type="button"
                              className="delete user-tag-edition-cancel"
                            />
                            <p className="tag-title has-text-grey-lighter is-size-5 has-text-left">
                              {tagEdition.info.name} - {tagEdition.info.categorySmall}
                            </p>
                            <p className="tag-example is-size-6 has-text-grey-light has-text-left">
                              {t('builder.add-in')}{' '}
                              <span
                                onClick={() => this.handleAddTag(tagEdition, 'name')}
                                role="button"
                                className="tag tag-add-in is-small is-info"
                              >
                                {t('builder.placeholder.name')}
                              </span>
                              <span
                                onClick={() => this.handleAddTag(tagEdition, 'location')}
                                role="button"
                                className="tag tag-add-in is-small is-info"
                              >
                                {t('builder.placeholder.location')}
                              </span>
                              <span
                                onClick={() => this.handleAddTag(tagEdition, 'description')}
                                role="button"
                                className="tag tag-add-in is-small is-info"
                              >
                                {t('builder.placeholder.description')}{' '}
                              </span>
                            </p>
                            <section className="user-tag-edition-popup has-text-left animated fadeIn">
                              {/* CHOOSE ACCOUNT */
                              tagEdition.info.account && (
                                <div className="field is-expanded is-grouped">
                                  <p className="control">
                                    <label className="label">{t('builder.account')}</label>
                                  </p>
                                  <div className="control is-expanded">
                                    <span className="select is-small is-fullwidth is-empty">
                                      <select
                                        defaultValue=""
                                        value={dataForm.account_id}
                                        onChange={e => this.handleInputDataForm(e, 'account_id')}
                                        required
                                      >
                                        <option disabled hidden value="">
                                          {t('builder.account')}
                                        </option>
                                        {Object.keys(accounts[tagEdition.info.gameID]).map(
                                          accountKey => (
                                            <option
                                              key={accountKey}
                                              value={
                                                accounts[tagEdition.info.gameID][accountKey].id
                                              }
                                            >
                                              {
                                                accounts[tagEdition.info.gameID][accountKey]
                                                  .settings.username
                                              }{' '}
                                              {accounts[tagEdition.info.gameID][accountKey].settings
                                                .region
                                                ? `(${accounts[tagEdition.info.gameID][
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
                              )}

                              {/* FORMAT SETTINGS */
                              Object.keys(tagEdition.info.fieldSettings).map(settingKey => (
                                <div
                                  key={settingKey}
                                  className="field is-expanded is-grouped-multiline is-grouped"
                                >
                                  <p className="control">
                                    <label className="label">
                                      {tagEdition.info.fieldSettings[settingKey].label[locale]}{' '}
                                      {tagEdition.info.fieldSettings[settingKey].tooltip && (
                                        <span
                                          data-label={
                                            tagEdition.info.fieldSettings[settingKey].tooltip[
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

                                  {tagEdition.info.fieldSettings[settingKey].type === 'select' && (
                                    <div className="control is-expanded">
                                      <span className="select is-small is-fullwidth is-empty">
                                        <select
                                          defaultValue=""
                                          value={dataForm.settings[settingKey]}
                                          onChange={e =>
                                            this.handleInputDataFormSettings(e, settingKey)
                                          }
                                          required
                                        >
                                          <option disabled hidden value="">
                                            {
                                              tagEdition.info.fieldSettings[settingKey].label[
                                                locale
                                              ]
                                            }
                                          </option>
                                          {Object.keys(
                                            tagEdition.info.fieldSettings[settingKey].input,
                                          ).map(inputKey => (
                                            <option key={inputKey} value={inputKey}>
                                              {
                                                tagEdition.info.fieldSettings[settingKey].input[
                                                  inputKey
                                                ][locale]
                                              }{' '}
                                              {tagEdition.info.fieldSettings[settingKey].input[
                                                inputKey
                                              ].value !== 0
                                                ? `(${
                                                    tagEdition.info.fieldSettings[settingKey].input[
                                                      inputKey
                                                    ].value > 0
                                                      ? '+'
                                                      : '-'
                                                  } ${Math.abs(
                                                    tagEdition.info.fieldSettings[settingKey].input[
                                                      inputKey
                                                    ].value,
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

                              {/* DATA GAME SETTING */
                              Object.keys(tagEdition.info.dataSettings).map(settingKey => (
                                <div
                                  key={settingKey}
                                  className="field is-expanded is-grouped-multiline is-grouped"
                                >
                                  <p className="control">
                                    <label className="label">
                                      {tagEdition.info.dataSettings[settingKey].label[locale]}{' '}
                                      {tagEdition.info.dataSettings[settingKey].tooltip && (
                                        <span
                                          data-label={
                                            tagEdition.info.dataSettings[settingKey].tooltip[locale]
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
                                  tagEdition.info.dataSettings[settingKey].type === 'string' && (
                                    <div className="control is-small is-expanded is-clearfix">
                                      <input
                                        onChange={e =>
                                          this.handleInputDataFormDataSettings(e, settingKey)
                                        }
                                        value={dataForm.dataSettings[settingKey]}
                                        type="text"
                                        placeholder={
                                          tagEdition.info.dataSettings[settingKey].label[locale]
                                        }
                                        required
                                        className="input is-small"
                                      />
                                    </div>
                                  )}

                                  {/* INPUT TYPE: select */
                                  tagEdition.info.dataSettings[settingKey].type === 'select' && (
                                    <div className="control is-expanded">
                                      <span className="select is-small is-fullwidth is-empty">
                                        <select
                                          defaultValue=""
                                          value={dataForm.dataSettings[settingKey]}
                                          onChange={e =>
                                            this.handleInputDataFormDataSettings(e, settingKey)
                                          }
                                          required
                                        >
                                          <option disabled hidden value="">
                                            {tagEdition.info.dataSettings[settingKey].label[locale]}
                                          </option>
                                          {Object.keys(
                                            tagEdition.info.dataSettings[settingKey].input,
                                          ).map(inputKey => (
                                            <option key={inputKey} value={inputKey}>
                                              {
                                                tagEdition.info.dataSettings[settingKey].input[
                                                  inputKey
                                                ][locale]
                                              }
                                            </option>
                                          ))}
                                        </select>
                                      </span>
                                    </div>
                                  )}

                                  {/* INPUT TYPE: speedrun_game */
                                  tagEdition.info.dataSettings[settingKey].type ===
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
                                            tagEdition.info.dataSettings[settingKey].label[locale]
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
                                  tagEdition.info.dataSettings[settingKey].type ===
                                    'speedrun_category' && (
                                    <div className="control is-expanded">
                                      <span className="select is-small is-fullwidth is-empty">
                                        <select
                                          defaultValue=""
                                          value={dataForm.dataSettings[settingKey]}
                                          onChange={e =>
                                            this.handleInputDataFormDataSettings(e, settingKey)
                                          }
                                          required
                                        >
                                          <option disabled hidden value="">
                                            {tagEdition.info.dataSettings[settingKey].label[locale]}
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
                            </section>

                            <div className="nav-buttons columns is-gapless is-mobile">
                              <button
                                onClick={() =>
                                  this.handleDeleteTagPopup(tagEdition, tagEdition.index)
                                }
                                type="button"
                                className="column button is-danger"
                              >
                                {t('builder.remove')}
                              </button>
                              <button
                                onClick={() => this.handleUpdateUserTag(tagEdition)}
                                type="button"
                                className={`column button is-success ${saveButtonIsLoading &&
                                  'is-loading'}`}
                                disabled={!this.checkInputs()}
                              >
                                {t('builder.save')}
                              </button>
                            </div>
                          </div>
                        )}

                      {/* REMOVE TAG POPUP CONFIRMATION */
                      navigation === 'removeTagConfirm' &&
                        tagEdition && (
                          <div className="is-full-height relative-zone">
                            <button
                              onClick={this.handleCancelEditUserTag}
                              type="button"
                              className="delete user-tag-edition-cancel"
                            />
                            <p className="tag-title has-text-grey-lighter is-size-5 has-text-left">
                              {tagEdition.info.name} - {tagEdition.info.categorySmall}
                            </p>

                            <div className="confirmation-message align-vertical-center is-full-height animated fadeIn">
                              <div>
                                <div className="title is-size-4">
                                  {t('builder.remove-tag-confirmation-message')}
                                </div>
                                <div className="field align-tags is-grouped-multiline is-grouped">
                                  <div className="tags has-text-centered has-addons">
                                    <span className="tag user-tag user-tag-key is-medium">
                                      {tagEdition.index}
                                    </span>
                                    <span
                                      className={`tag user-tag user-tag-name-category is-medium ${
                                        tagEdition.included ? 'included' : 'not-included'
                                      }`}
                                    >
                                      {tagEdition.info.nameSmall} - {tagEdition.info.categorySmall}
                                    </span>
                                    <span
                                      className="tag user-tag user-tag-game is-medium"
                                      style={{
                                        backgroundColor: games[tagEdition.game_id].color,
                                      }}
                                    >
                                      {games[tagEdition.game_id].small_name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="nav-buttons columns is-gapless is-mobile">
                              <button
                                onClick={this.handleCancelEditUserTag}
                                type="button"
                                className="column button is-light"
                              >
                                {t('builder.cancel')}
                              </button>
                              <button
                                onClick={() => this.handleDeleteTag(tagEdition)}
                                type="button"
                                className={`column button is-danger ${removeButtonIsLoading &&
                                  'is-loading'}`}
                              >
                                {t('builder.remove')}
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
        <style jsx>
          {`
            .align-tags {
              display: flex;
              justify-content: center !important;
              /*height: calc(100% - 30px);*/
            }
            .align-tags .tags {
              padding-right: 0.25rem;
              padding-left: 0.25rem;
              padding-bottom: 0.75rem;
            }
            .user-tag,
            .tag-add-in {
              cursor: pointer;
            }
            .user-tags {
              padding-top: 0.5rem;
            }
            .user-tag-key {
              background-color: #f5f5f5;
              color: #363636;
            }
            .user-tag-game {
              color: #151515;
            }
            .tag-add-in {
              height: 1.1rem;
              padding-left: 0.3rem;
              padding-right: 0.3rem;
              margin-right: 0.2rem;
              margin-left: 0.2rem;
            }

            .user-tag-name-category.included {
              background-color: #81d29d;
              color: #191818; /*rgba(0, 0, 0, 0.7);*/
            }

            .user-tag-name-category.not-included {
              background-color: #f98989;
              color: #191818;
            }
            .relative-zone {
              position: relative;
              padding-bottom: 50px;
            }
            .delete.user-tag-edition-cancel {
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
            .tag-title {
              padding: 0 0.7rem 0 0.7rem;
            }
            .tag-example {
              padding: 0 0.7rem 0.7rem 0.7rem;
            }
            .user-tags .field.is-grouped > .control {
              margin-right: 0.25rem;
              margin-left: 0.25rem;
            }
            .user-tag-edition-popup .control .label {
              margin-right: 0.6rem;
            }
            .user-tag-edition-popup {
              border-radius: 3px;
              padding: 0 0.7rem;
              position: relative;
              width: 100%;
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
            .user-tags-list .field.is-grouped.is-grouped-multiline:last-child {
              margin-bottom: 0;
            }
            .confirmation-message {
              height: calc(100% - 30px);
            }
          `}
        </style>
        <style jsx global>
          {`
            .user-tags-list .card {
              height: 100%;
            }
            .user-tags-list .collapse-content {
              height: calc(100% - 48px);
              min-height: 17rem;
            }
            @media screen and (max-width: 768px) {
              .user-tags-list .collapse-content {
                min-height: 0;
              }
            }
            .user-tags-list .card-content {
              height: 100%;
              padding: 0;
            }
          `}
        </style>
      </Fragment>
    );
  }
}

UserTags.propTypes = {
  locale: PropTypes.string.isRequired,
  games: PropTypes.object.isRequired,
  accounts: PropTypes.object.isRequired,
  userTags: PropTypes.array.isRequired,
  twiteloDataInput: PropTypes.object.isRequired,
  notifSetError: PropTypes.func.isRequired,
  actionSetTwiteloDataInput: PropTypes.func.isRequired,
  actionSetBuilderLoading: PropTypes.func.isRequired,
};

UserTags.contextTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  locale: state.i18nState.lang,
  games: state.builder.games,
  accounts: state.builder.accounts,
  userTags: state.builder.userTags,
  twiteloDataInput: state.builder.twiteloDataInput,
});

export default connect(
  mapStateToProps,
  {
    notifSetError: setError,
    actionSetTwiteloDataInput: setTwiteloDataInput,
    actionSetBuilderLoading: setBuilderLoading,
    actionDeleteTag: deleteTagWithIndex,
    actionUpdateTag: updateTag,
  },
)(UserTags);
