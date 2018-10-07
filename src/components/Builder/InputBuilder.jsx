import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';

import { setUserTwiteloSwitch } from '../../actions/user';
import {
  setTwiteloDataInput,
  setPreviewData,
  transformToUUID,
  updateTextCounters,
  saveProfile,
} from '../../actions/builder';

class InputBuilder extends Component {
  constructor(props) {
    super(props);

    this.handleToggleShow = this.handleToggleShow.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.getCounterColor = this.getCounterColor.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.checkCharacters = this.checkCharacters.bind(this);
    this.handleInputUpdate = _.debounce(this.handleInputUpdate.bind(this), 500);
    this.handleSaveProfile = this.handleSaveProfile.bind(this);

    this.state = {
      isOpen: true,
      isLoading: false,
      switchDisabled: {
        name: false,
        description: false,
        location: false,
      },
    };
  }

  getCounterColor(name) {
    const { textCounter } = this.props;

    if (textCounter[name] > 9) return 'has-text-light';
    if (textCounter[name] > 0) return 'has-text-warning';
    if (textCounter[name] === 0) return 'has-text-lightred';
    return 'has-text-red';
  }

  checkCharacters() {
    const { textCounter } = this.props;

    if (textCounter.name < 0) return false;
    if (textCounter.description < 0) return false;
    if (textCounter.location < 0) return false;
    return true;
  }

  handleToggleShow(e) {
    e.preventDefault();

    const { isOpen } = this.state;

    this.setState({ isOpen: !isOpen });
  }

  async handleSwitchChange(e, name) {
    // e.preventDefault();

    const { switchDisabled } = this.state;
    const { onChangeSwitch, twiteloData } = this.props;

    if (!switchDisabled[name]) {
      onChangeSwitch(name, !twiteloData[name].status);
    }
  }

  async handleInputChange(e, name) {
    const { onInputChange } = this.props;

    onInputChange(name, e.target.value);
  }

  async handleInputUpdate(e, name) {
    const {
      builder,
      actionSetPreviewData,
      actionTransformToUUID,
      actionUpdateTextCounters,
    } = this.props;
    actionTransformToUUID();
    actionUpdateTextCounters(builder, name);

    actionSetPreviewData('saved', false);
  }

  async handleSaveProfile(e) {
    e.preventDefault();

    const { actionSaveProfile, twiteloData } = this.props;

    this.setState({ isLoading: true });

    await actionSaveProfile(twiteloData);

    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000);
  }

  render() {
    const { user, twiteloData, builderLoading, twiteloDataInput, textCounter } = this.props;
    const { isOpen, switchDisabled, isLoading } = this.state;
    const { t } = this.context;

    return (
      <Fragment>
        <article className="tile is-child has-text-centered builder-inputs">
          <div className="collapse card">
            <div className="collapse-trigger">
              <div onClick={this.handleToggleShow} role="button" className="card-header no-select">
                <div className="card-header-title">
                  <h1 className="title is-size-6-mobile is-size-5-desktop is-size-5">
                    {t('builder')}
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
                <div className="builder-container">
                  {builderLoading && (
                    <div v-if="builderLoading" className="loading-overlay is-full-height is-active">
                      <div className="loading-icon" />
                    </div>
                  )}

                  <div className="field is-grouped">
                    <label
                      tabIndex="0"
                      className={`switch is-medium ${(!user.switch || switchDisabled.name) &&
                        'is-disabled'}`}
                    >
                      <input
                        type="checkbox"
                        onChange={e => this.handleSwitchChange(e, 'name')}
                        disabled={!user.switch || switchDisabled.name}
                        checked={twiteloData.name.status}
                      />
                      <span className="check is-success" />
                      <span className="control-label" />
                    </label>

                    <div className="control has-icons-left is-expanded is-clearfix">
                      <input
                        value={twiteloDataInput.name}
                        onInput={e => this.handleInputUpdate(e, 'name')}
                        onChange={e => this.handleInputChange(e, 'name')}
                        type="text"
                        autoComplete="on"
                        placeholder={t('builder.placeholder.name')}
                        className="input"
                      />
                      <span className="icon is-left">
                        <i className="fas fa-user" />
                      </span>
                    </div>
                    <div className="text-counter control align-vertical-center">
                      <span className={this.getCounterColor('name')}>{textCounter.name}</span>
                    </div>
                  </div>

                  <div className="field is-grouped">
                    <label
                      tabIndex="0"
                      className={`switch is-medium ${(!user.switch || switchDisabled.location) &&
                        'is-disabled'}`}
                    >
                      <input
                        type="checkbox"
                        onChange={e => this.handleSwitchChange(e, 'location')}
                        disabled={!user.switch || switchDisabled.location}
                        checked={twiteloData.location.status}
                      />
                      <span className="check is-success" />
                      <span className="control-label" />
                    </label>

                    <div className="control has-icons-left is-expanded is-clearfix">
                      <input
                        value={twiteloDataInput.location}
                        onInput={e => this.handleInputUpdate(e, 'location')}
                        onChange={e => this.handleInputChange(e, 'location')}
                        type="text"
                        autoComplete="on"
                        placeholder={t('builder.placeholder.location')}
                        className="input"
                      />
                      <span className="icon is-left">
                        <i className="fas fa-map-marker-alt fa-lg" />
                      </span>
                    </div>
                    <div className="text-counter control align-vertical-center">
                      <span className={this.getCounterColor('location')}>
                        {textCounter.location}
                      </span>
                    </div>
                  </div>

                  <div className="field is-grouped">
                    <label
                      tabIndex="0"
                      className={`switch is-medium ${(!user.switch || switchDisabled.description) &&
                        'is-disabled'}`}
                    >
                      <input
                        type="checkbox"
                        onChange={e => this.handleSwitchChange(e, 'description')}
                        disabled={!user.switch || switchDisabled.description}
                        checked={twiteloData.description.status}
                      />
                      <span className="check is-success" />
                      <span className="control-label" />
                    </label>

                    <div className="control is-expanded is-clearfix">
                      <textarea
                        value={twiteloDataInput.description}
                        onInput={e => this.handleInputUpdate(e, 'description')}
                        onChange={e => this.handleInputChange(e, 'description')}
                        type="textarea"
                        autoComplete="on"
                        placeholder={t('builder.placeholder.description')}
                        className="textarea"
                      />
                    </div>
                    <div className="text-counter control align-vertical-center">
                      <span className={this.getCounterColor('description')}>
                        {textCounter.description}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="nav-buttons columns is-gapless is-mobile builder-fast-save">
                  <button
                    onClick={this.handleSaveProfile}
                    type="button"
                    className={`column button is-lightgreen align-vertical-center ${isLoading &&
                      'is-loading'}`}
                    disabled={!this.checkCharacters()}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-save" />
                    </span>
                    {this.checkCharacters() ? (
                      <span>{t('builder.save')}</span>
                    ) : (
                      <span className="is-size-6 is-size-7-mobile">
                        {t('builder.too-much-char-save')}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
        <style jsx>
          {`
            .text-counter {
              min-width: 30px;
            }
            .builder-inputs .loading-overlay {
              background-color: #1717178c;
            }
            .builder-inputs .builder-container {
              padding: 0.7rem 0.6rem 0.7rem 0.6rem;
            }
            .nav-buttons {
              width: 100%;
            }
            .nav-buttons .button {
              border: unset;
              border-radius: 0;
            }

            .builder-inputs .card-content {
              background-color: #2d2d2d;
              padding: 0;
              height: 100%;
            }
          `}
        </style>
      </Fragment>
    );
  }
}

InputBuilder.propTypes = {
  user: PropTypes.object.isRequired,
  twiteloData: PropTypes.object.isRequired,
  builder: PropTypes.object.isRequired,
  builderLoading: PropTypes.bool.isRequired,
  twiteloDataInput: PropTypes.object.isRequired,
  textCounter: PropTypes.object.isRequired,
};

InputBuilder.contextTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
  twiteloData: state.user.twitelo,
  builder: state.builder,
  builderLoading: state.builder.builderLoading,
  twiteloDataInput: state.builder.twiteloDataInput,
  textCounter: state.builder.textCounter,
});

export default connect(
  mapStateToProps,
  {
    onChangeSwitch: setUserTwiteloSwitch,
    onInputChange: setTwiteloDataInput,
    actionSetPreviewData: setPreviewData,
    actionTransformToUUID: transformToUUID,
    actionUpdateTextCounters: updateTextCounters,
    actionSaveProfile: saveProfile,
  },
)(InputBuilder);
