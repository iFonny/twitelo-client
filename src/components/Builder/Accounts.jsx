import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';

import api from '../../libs/api';

import { updateAccount, deleteAccount } from '../../actions/builder';
import { setError } from '../../actions/base';

class Accounts extends Component {
  constructor(props) {
    super(props);

    this.handleToggleShow = this.handleToggleShow.bind(this);
    this.handleGameChange = this.handleGameChange.bind(this);
    this.handleInputDataForm = this.handleInputDataForm.bind(this);
    this.handleEditAccountPopup = this.handleEditAccountPopup.bind(this);
    this.handleDeleteAccountPopup = this.handleDeleteAccountPopup.bind(this);
    this.handleAddAccountPopup = this.handleAddAccountPopup.bind(this);
    this.handleCancelAddAccount = this.handleCancelAddAccount.bind(this);
    this.handleAddAccount = this.handleAddAccount.bind(this);
    this.handleUpdateAccount = this.handleUpdateAccount.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);

    this.accountsBySelect = this.accountsBySelect.bind(this);
    this.checkAccountIncluded = this.checkAccountIncluded.bind(this);
    this.checkInputsAdd = this.checkInputsAdd.bind(this);
    this.checkInputsEdit = this.checkInputsEdit.bind(this);
    this.syncSelectedGameState = this.syncSelectedGameState.bind(this);

    this.state = {
      isOpen: true,
      navigation: null,
      accountCreation: null,
      accountEdition: null,
      accountGameSelect: 'all-games',
      addButtonIsLoading: false,
      saveButtonIsLoading: false,
      removeButtonIsLoading: false,
      dataForm: {},
    };
  }

  componentDidUpdate(prevProps) {
    const { selectedGame } = this.props;

    if (prevProps.selectedGame !== selectedGame) {
      this.syncSelectedGameState(selectedGame);
    }
  }

  syncSelectedGameState(selectedGame) {
    this.setState({ navigation: null });
    if (selectedGame) this.setState({ accountGameSelect: selectedGame.id });
    else this.setState({ accountGameSelect: 'all-games' });
  }

  accountsBySelect() {
    const { accountGameSelect } = this.state;
    const { allAccounts, accounts } = this.props;

    return !accountGameSelect || accountGameSelect === 'all-games'
      ? allAccounts
      : accounts[accountGameSelect];
  }

  checkAccountIncluded(id) {
    const { userTags } = this.props;

    const index = _.findIndex(userTags, o => o.included && o.account_id === id);

    return index >= 0;
  }

  checkInputsAdd() {
    const { accountCreation, dataForm } = this.state;
    const accountCreationArray = Object.keys(accountCreation);

    for (let i = 0; i < accountCreationArray.length; i += 1) {
      const input = accountCreationArray[i];
      if (!dataForm[input] && input !== 'verify') return false;
    }
    return true;
  }

  checkInputsEdit() {
    const { accountEdition, dataForm } = this.state;
    const accountEditionArray = Object.keys(accountEdition.fieldSettings);

    for (let i = 0; i < accountEditionArray.length; i += 1) {
      const input = accountEditionArray[i];
      if (!dataForm[input] && input !== 'verify') return false;
      if (dataForm[input] !== accountEdition.settings[input]) return true;
    }
    return true;
  }

  handleToggleShow(e) {
    e.preventDefault();

    const { isOpen } = this.state;

    this.setState({ isOpen: !isOpen });
  }

  handleGameChange(e) {
    this.setState({ accountGameSelect: e.target.value });
  }

  handleInputDataForm(e, key) {
    const { dataForm } = this.state;

    this.setState({ dataForm: { ...dataForm, [key]: e.target.value } });
  }

  handleEditAccountPopup(account) {
    const { accountSettings } = this.props;

    // TODO : VERIFIER QUE CA MARCHE
    const myAccountEdition = account;
    myAccountEdition.fieldSettings = accountSettings[account.game_id];
    this.setState({
      accountEdition: myAccountEdition,
      dataForm: _.cloneDeep(account.settings),
      navigation: 'editAccount',
    });
  }

  handleDeleteAccountPopup(account) {
    this.setState({
      accountEdition: account,
      navigation: 'deleteAccountConfirm',
    });
  }

  handleAddAccountPopup(gameSelected) {
    const { accountSettings } = this.props;

    this.setState({
      accountCreation: accountSettings[gameSelected],
      navigation: 'addAccount',
    });
  }

  handleCancelAddAccount() {
    this.setState({
      navigation: null,
      accountCreation: null,
      accountEdition: null,
      dataForm: {},
    });
  }

  async handleAddAccount(gameSelected) {
    const { notifSetError, actionUpdateAccount } = this.props;
    const { dataForm } = this.state;

    this.setState({ addButtonIsLoading: true });

    api
      .put('/account/me/create', {
        game_id: gameSelected,
        settings: dataForm,
      })
      .then(response => {
        actionUpdateAccount(response.data.data);
        this.handleCancelAddAccount();
        this.setState({ addButtonIsLoading: false });
      })
      .catch(e => {
        notifSetError(e);

        setTimeout(() => {
          this.setState({ addButtonIsLoading: false });
        }, 5000);
      });
  }

  async handleUpdateAccount(account) {
    const { notifSetError, actionUpdateAccount } = this.props;
    const { dataForm } = this.state;

    this.setState({ saveButtonIsLoading: true });

    api
      .post(`/account/me/${account.id}/edit`, {
        game_id: account.game_id,
        settings: dataForm,
      })
      .then(response => {
        if (response.data.data) actionUpdateAccount(response.data.data);

        this.handleCancelAddAccount();
        this.setState({ saveButtonIsLoading: false });
      })
      .catch(e => {
        notifSetError(e);

        setTimeout(() => {
          this.setState({ saveButtonIsLoading: false });
        }, 5000);
      });
  }

  async handleDeleteAccount(account) {
    const { twiteloData, builder, userTags, actionDeleteAccount } = this.props;
    this.setState({ removeButtonIsLoading: true });

    await actionDeleteAccount(twiteloData, builder, account, userTags);

    this.handleCancelAddAccount();
    this.setState({ removeButtonIsLoading: false });
  }

  render() {
    const { games, accounts, locale } = this.props;
    const {
      isOpen,
      navigation,
      accountGameSelect,
      accountEdition,
      accountCreation,
      dataForm,
      addButtonIsLoading,
      removeButtonIsLoading,
      saveButtonIsLoading,
    } = this.state;
    const { t } = this.context;

    const accountsBySelect = this.accountsBySelect();

    return (
      <Fragment>
        <article className="tile is-child has-text-centered account-list">
          <div className="collapse card">
            <div className="collapse-trigger">
              <div onClick={this.handleToggleShow} role="button" className="card-header no-select">
                <div className="card-header-title">
                  <h1 className="title is-size-6-mobile is-size-5-desktop is-size-5">
                    {t('builder.accounts')}
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
                <div className="accounts-container is-full-height">
                  {!navigation ? (
                    <div v-if="!navigation" className="is-full-height relative-zone">
                      <div className="field">
                        <div className="control game-selection is-expanded">
                          <span className="select is-dark is-fullwidth">
                            <select value={accountGameSelect} onChange={this.handleGameChange}>
                              <option value="all-games">{t('builder.all-games')}</option>
                              {Object.keys(games).map(key => (
                                <option key={games[key].id} value={games[key].id}>
                                  {games[key].name}
                                </option>
                              ))}
                            </select>
                          </span>
                        </div>
                      </div>

                      <div className="field align-tags animated fadeIn is-grouped-multiline is-grouped">
                        {!accountsBySelect || Object.keys(accountsBySelect).length <= 0 ? (
                          <p className="is-size-4 has-text-danger animated fadeIn">
                            {t('builder.no-accounts-list')}
                          </p>
                        ) : (
                          Object.keys(accountsBySelect).map(key => (
                            <div key={key} className="control animated fadeIn">
                              <div className="tags has-addons">
                                <span
                                  onClick={() => this.handleEditAccountPopup(accountsBySelect[key])}
                                  role="button"
                                  className="tag account-tag account-tag-edit is-twitter is-small"
                                >
                                  <span className="icon is-small">
                                    <i className="far fa-edit" />
                                  </span>
                                </span>
                                <span
                                  onClick={() => this.handleEditAccountPopup(accountsBySelect[key])}
                                  role="button"
                                  className={`tag account-tag account-tag-name is-small ${
                                    this.checkAccountIncluded(accountsBySelect[key].id)
                                      ? 'included'
                                      : 'not-included'
                                  }`}
                                >
                                  <span>
                                    {accountsBySelect[key].settings.username}
                                    {accountsBySelect[key].settings.region
                                      ? ` - ${accountsBySelect[key].settings.region.toUpperCase()}`
                                      : ''}
                                  </span>
                                </span>
                                {accountGameSelect === 'all-games' && (
                                  <span
                                    onClick={() =>
                                      this.handleEditAccountPopup(accountsBySelect[key])
                                    }
                                    role="button"
                                    className="tag account-tag account-tag-game is-small"
                                    style={{
                                      backgroundColor: games[accountsBySelect[key].game_id].color,
                                    }}
                                  >
                                    {games[accountsBySelect[key].game_id].small_name}
                                  </span>
                                )}
                                <span
                                  onClick={() =>
                                    this.handleDeleteAccountPopup(accountsBySelect[key])
                                  }
                                  role="button"
                                  className="tag account-tag account-tag-delete is-danger is-small"
                                >
                                  <span className="icon is-small">
                                    <i className="far fa-trash-alt" />
                                  </span>
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="nav-buttons columns is-gapless is-mobile">
                        {accountGameSelect && accountGameSelect !== 'all-games' ? (
                          <button
                            onClick={() => this.handleAddAccountPopup(accountGameSelect)}
                            disabled={
                              accounts[accountGameSelect] != null &&
                              accounts[accountGameSelect].length >= 3
                            }
                            type="button"
                            className="column button is-lightgreen"
                          >
                            {t('builder.add-account')} (
                            {accounts[accountGameSelect] ? accounts[accountGameSelect].length : 0}
                            /3)
                          </button>
                        ) : (
                          <button disabled className="column button is-lightgreen" type="button">
                            {t('builder.select-game-to-add-account')}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="is-full-height">
                      <button
                        onClick={this.handleCancelAddAccount}
                        type="button"
                        className="delete account-creation-cancel"
                      />

                      {navigation === 'addAccount' &&
                        accountCreation &&
                        accountGameSelect &&
                        accountGameSelect !== 'all-games' && (
                          <div className="is-full-height relative-zone">
                            <p className="account-title has-text-grey-lighter is-size-5 has-text-left">
                              {t('builder.add-account')}
                            </p>
                            <p className="account-subtitle is-size-6 has-text-grey-light has-text-left">
                              {games[accountGameSelect].name}
                            </p>

                            <section className="account-creation-popup has-text-left animated fadeIn">
                              {Object.keys(accountCreation).map(key => (
                                <div
                                  key={key}
                                  className="field is-expanded is-grouped-multiline is-grouped"
                                >
                                  {key !== 'verify' && (
                                    <p className="control">
                                      <label className="label">
                                        {accountCreation[key].label[locale]}{' '}
                                        {accountCreation[key].tooltip && (
                                          <span
                                            data-label={accountCreation[key].tooltip[locale]}
                                            className="is-light is-right is-small tooltip is-multiline"
                                          >
                                            <span className="icon has-text-grey-light is-small">
                                              <i className="far fa-question-circle" />
                                            </span>
                                          </span>
                                        )}
                                      </label>
                                    </p>
                                  )}

                                  {accountCreation[key].type === 'string' && (
                                    <div className="control is-small is-expanded is-clearfix">
                                      <input
                                        onChange={e => this.handleInputDataForm(e, key)}
                                        value={dataForm[key]}
                                        type="text"
                                        placeholder={accountCreation[key].label[locale]}
                                        required
                                        className="input is-small"
                                      />
                                    </div>
                                  )}

                                  {accountCreation[key].type === 'select' && (
                                    <div className="control is-expanded">
                                      <span className="select is-small is-fullwidth is-empty">
                                        <select
                                          defaultValue=""
                                          value={dataForm[key]}
                                          onChange={e => this.handleInputDataForm(e, key)}
                                          required
                                        >
                                          <option disabled hidden value="">
                                            {accountCreation[key].label[locale]}
                                          </option>
                                          {Object.keys(accountCreation[key].input).map(inputKey => (
                                            <option key={inputKey} value={inputKey}>
                                              {accountCreation[key].input[inputKey][locale]} (
                                              {inputKey})
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
                                onClick={this.handleCancelAddAccount}
                                type="button"
                                className="column button is-danger"
                              >
                                {t('builder.cancel')}
                              </button>
                              <button
                                onClick={() => this.handleAddAccount(accountGameSelect)}
                                className={`column button is-success ${addButtonIsLoading &&
                                  'is-loading'}`}
                                disabled={!this.checkInputsAdd()}
                                type="button"
                              >
                                {t('builder.add')}
                              </button>
                            </div>
                          </div>
                        )}

                      {navigation === 'editAccount' &&
                        accountEdition && (
                          <div className="is-full-height relative-zone">
                            <p className="account-title has-text-grey-lighter is-size-5 has-text-left">
                              {t('builder.edit-account')}
                            </p>
                            <p className="account-subtitle is-size-6 has-text-grey-light has-text-left">
                              {games[accountEdition.game_id].name}
                            </p>
                            <section className="account-creation-popup has-text-left animated fadeIn">
                              {Object.keys(accountEdition.fieldSettings).map(key => (
                                <div
                                  key={key}
                                  className="field is-expanded is-grouped-multiline is-grouped"
                                >
                                  {key !== 'verify' && (
                                    <p className="control">
                                      <label className="label">
                                        {accountEdition.fieldSettings[key].label[locale]}{' '}
                                        {accountEdition.fieldSettings[key].tooltip && (
                                          <span
                                            data-label={
                                              accountEdition.fieldSettings[key].tooltip[locale]
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
                                  )}

                                  {accountEdition.fieldSettings[key].type === 'string' && (
                                    <div className="control is-small is-expanded is-clearfix">
                                      <input
                                        onChange={e => this.handleInputDataForm(e, key)}
                                        value={dataForm[key]}
                                        type="text"
                                        placeholder={
                                          accountEdition.fieldSettings[key].label[locale]
                                        }
                                        required
                                        className="input is-small"
                                      />
                                    </div>
                                  )}

                                  {accountEdition.fieldSettings[key].type === 'select' && (
                                    <div className="control is-expanded">
                                      <span className="select is-small is-fullwidth is-empty">
                                        <select
                                          defaultValue=""
                                          value={dataForm[key]}
                                          onChange={e => this.handleInputDataForm(e, key)}
                                          required
                                        >
                                          <option disabled hidden value="">
                                            {accountEdition.fieldSettings[key].label[locale]}
                                          </option>
                                          {Object.keys(accountEdition.fieldSettings[key].input).map(
                                            inputKey => (
                                              <option key={inputKey} value={inputKey}>
                                                {
                                                  accountEdition.fieldSettings[key].input[inputKey][
                                                    locale
                                                  ]
                                                }{' '}
                                                ({inputKey})
                                              </option>
                                            ),
                                          )}
                                        </select>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </section>

                            <div className="nav-buttons columns is-gapless is-mobile">
                              <button
                                onClick={() => this.handleDeleteAccountPopup(accountEdition)}
                                className="column button is-danger"
                                type="button"
                              >
                                {t('builder.remove')}
                              </button>
                              <button
                                onClick={() => this.handleUpdateAccount(accountEdition)}
                                disabled={!this.checkInputsEdit()}
                                className={`column button is-success ${saveButtonIsLoading &&
                                  'is-loading'}`}
                                type="button"
                              >
                                {t('builder.save')}
                              </button>
                            </div>
                          </div>
                        )}

                      {navigation === 'deleteAccountConfirm' &&
                        accountEdition && (
                          <div className="is-full-height relative-zone">
                            <p className="account-title has-text-grey-lighter is-size-5 has-text-left">
                              {games[accountEdition.game_id].name} -{' '}
                              {accountEdition.settings.username}
                            </p>
                            <div className="confirmation-message align-vertical-center is-full-height animated fadeIn">
                              <div>
                                <div className="title is-size-5">
                                  {t('builder.remove-account-confirmation-message')}
                                </div>
                                <div className="field align-tags is-grouped-multiline is-grouped">
                                  <div className="tags has-text-centered has-addons">
                                    <span
                                      className={`tag account-tag account-tag-name is-medium ${
                                        accountEdition.included ? 'included' : 'not-included'
                                      }`}
                                    >
                                      {accountEdition.settings.username}
                                      {accountEdition.settings.region
                                        ? ` - ${accountEdition.settings.region.toUpperCase()}`
                                        : ''}
                                    </span>
                                    <span
                                      className="tag account-tag account-tag-game is-medium"
                                      style={{
                                        backgroundColor: games[accountEdition.game_id].color,
                                      }}
                                    >
                                      {games[accountEdition.game_id].small_name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="nav-buttons columns is-gapless is-mobile">
                              <button
                                onClick={this.handleCancelAddAccount}
                                type="button"
                                className="column button is-light"
                              >
                                {t('builder.cancel')}
                              </button>
                              <button
                                onClick={() => this.handleDeleteAccount(accountEdition)}
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
            .account-title {
              padding: 0 0.7rem 0 0.7rem;
            }
            .account-subtitle {
              padding: 0 0.7rem 0.7rem 0.7rem;
            }
            .account-creation-popup {
              border-radius: 3px;
              padding: 0 0.7rem;
              position: relative;
              width: 100%;
            }
            .align-tags {
              display: flex;
              justify-content: center !important;
              padding-top: 1rem;
            }
            .game-selection {
              border-top: 1px solid #c5c5c5;
              border-bottom: 1px solid #c5c5c5;
            }
            .relative-zone {
              position: relative;
              padding-bottom: 50px;
            }
            .delete.account-creation-cancel {
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
            .nav-buttons {
              position: absolute;
              bottom: 0;
              width: 100%;
            }
            .nav-buttons .button {
              border: unset;
              border-radius: 0;
            }
            .account-tag-name.included {
              background-color: #81d29d;
              color: #191818; /*rgba(0, 0, 0, 0.7);*/
            }
            .accounts-container .field.is-grouped > .control {
              margin-right: 0.25rem;
              margin-left: 0.25rem;
            }
            .account-tag-name.not-included {
              background-color: #f98989;
              color: #191818;
            }
            .account-tag {
              cursor: pointer;
            }
            .account-tag-game {
              color: #151515;
            }
            .confirmation-message {
              padding-top: 20px;
              height: calc(100% - 40px);
            }
          `}
        </style>
        <style jsx global>
          {`
            .account-list .card {
              height: 100%;
            }
            .account-list .collapse-content {
              height: calc(100% - 48px);
            }
            .account-list .collapse-content {
              height: calc(100% - 48px);
              min-height: 15rem;
            }
            @media screen and (max-width: 768px) {
              .account-list .collapse-content {
                min-height: 0;
              }
            }
            .account-list .card-content {
              height: 100%;
              padding: 0;
            }
            .accounts-container .game-selection select {
              background-color: #2d2d2d !important;
              color: white !important;
              border: 0 !important;
              border-radius: 0 !important;
            }
            .accounts-container .game-selection .select.is-empty select {
              color: rgba(255, 255, 255, 0.8) !important;
            }
          `}
        </style>
      </Fragment>
    );
  }
}

Accounts.propTypes = {
  accountSettings: PropTypes.object,
  selectedGame: PropTypes.object,
  twiteloData: PropTypes.object.isRequired,
  builder: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  games: PropTypes.object.isRequired,
  accounts: PropTypes.object.isRequired,
  allAccounts: PropTypes.object.isRequired,
  userTags: PropTypes.array.isRequired,
};

Accounts.defaultProps = {
  accountSettings: null,
  selectedGame: null,
};

Accounts.contextTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  twiteloData: state.user.twitelo,
  builder: state.builder,
  locale: state.i18nState.lang,
  games: state.builder.games,
  accounts: state.builder.accounts,
  accountSettings: state.builder.accountSettings,
  allAccounts: state.builder.allAccounts,
  selectedGame: state.builder.selectedGame,
  userTags: state.builder.userTags,
});

export default connect(
  mapStateToProps,
  {
    notifSetError: setError,
    actionUpdateAccount: updateAccount,
    actionDeleteAccount: deleteAccount,
  },
)(Accounts);
