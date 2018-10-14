import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { refreshPreview, saveProfile } from '../../actions/builder';

class ProfilePreview extends Component {
  constructor(props) {
    super(props);

    this.checkCharacters = this.checkCharacters.bind(this);
    this.handleSaveProfile = this.handleSaveProfile.bind(this);

    this.state = {
      navigation: null,
      saveButtonIsLoading: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { profileSaved } = this.props;

    if (prevProps.profileSaved !== profileSaved) {
      const confirmExit = () =>
        'You have attempted to leave this page.  If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?';
      window.onbeforeunload = confirmExit;
    } else window.onbeforeunload = null;
  }

  checkCharacters() {
    const { textCounter } = this.props;

    if (textCounter.name < 0) return false;
    if (textCounter.description < 0) return false;
    if (textCounter.location < 0) return false;
    return true;
  }

  async handleSaveProfile() {
    const { actionSaveProfile, twiteloData } = this.props;

    this.setState({ saveButtonIsLoading: true });

    await actionSaveProfile(twiteloData);

    setTimeout(() => {
      this.setState({ saveButtonIsLoading: false });
    }, 1000);
  }

  render() {
    const { preview, user, onRefreshPreview } = this.props;
    const { navigation, saveButtonIsLoading } = this.state;
    const { t } = this.context;

    return (
      <Fragment>
        <article className="tile is-child has-text-centered desc-preview">
          <div className="profile-preview-title">
            <p className="title is-4 has-text-white text-overflow-is-ellipsis">
              {t('home.preview')}
            </p>
          </div>
          <div className="profile-preview-container">
            {!navigation && (
              <div>
                {preview.loading && (
                  <div className="loading-overlay is-full-height is-active">
                    <div className="loading-icon" />
                  </div>
                )}

                {!preview.loading &&
                  preview.needUpdate && (
                    <div
                      onClick={onRefreshPreview}
                      role="button"
                      className="loading-overlay is-full-height is-active need-update"
                    >
                      <div>
                        <span className="icon is-large">
                          <i className="fas fa-sync-alt fa-spin" />
                        </span>
                        <br />
                        <p className="is-size-5 has-text-weight-semibold">
                          {t('builder.refresh-preview')}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            )}

            <div className="profile-preview-banner">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://twitter.com/${user.username}`}
              >
                <img
                  className="round-pp-preview no-select"
                  src={user ? user.profile_image_url : '/images/iFonny.jpg'}
                  alt="profile"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = '/images/errors/default_profile.png';
                  }}
                />
              </a>
            </div>

            {!navigation && (
              <div className="profile-preview-desc">
                <p
                  className="is-size-4 is-size-5-touch has-text-white has-text-weight-bold text-overflow-is-ellipsis"
                  dangerouslySetInnerHTML={{ __html: preview.name }}
                />
                <p
                  className="is-size-5 is-size-6-touch has-text-white-ter has-text-weight-light is-italic"
                  dangerouslySetInnerHTML={{ __html: preview.description }}
                />
                <p className="is-size-6 has-text-grey-lighter has-text-weight-light text-overflow-is-ellipsis">
                  <span className="icon icon-bio-example is-small">
                    <i className="fas fa-map-marker-alt" />
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: preview.location }} />
                </p>
              </div>
            )}

            {navigation === 'info' && (
              <div className="profile-save-info">
                <p
                  className="is-size-6 has-text-white-ter has-text-weight-light animated fadeIn"
                  dangerouslySetInnerHTML={{ __html: t('builder.profil-warn-data-example') }}
                />
                <p
                  className="is-size-6 has-text-white-ter has-text-weight-light animated fadeIn"
                  dangerouslySetInnerHTML={{ __html: t('builder.profil-warn-data-update') }}
                />
              </div>
            )}
          </div>

          <div className="nav-buttons columns is-gapless is-mobile">
            {!navigation ? (
              <button
                onClick={() => this.setState({ navigation: 'info' })}
                type="button"
                className="column is-2 button is-light is-medium align-vertical-center"
              >
                <span className="icon">
                  <i className="fas fa-info-circle" />
                </span>
              </button>
            ) : (
              <button
                onClick={() => this.setState({ navigation: null })}
                type="button"
                className="column is-3 button is-light is-medium align-vertical-center"
              >
                <span className="icon">
                  <i className="fas fa-times-circle" />
                </span>
                <span className="is-size-6 is-size-7-mobile">{t('builder.close')}</span>
              </button>
            )}
            <button
              onClick={this.handleSaveProfile}
              type="button"
              className={`column button is-lightgreen is-medium align-vertical-center ${saveButtonIsLoading &&
                'is-loading'}`}
              disabled={!this.checkCharacters()}
            >
              <span className="icon">
                <i className="fas fa-save" />
              </span>

              {!this.checkCharacters() ? (
                <span className="is-size-6 is-size-7-mobile">
                  {t('builder.too-much-char-save')}
                </span>
              ) : (
                <span>{t('builder.save')}</span>
              )}
            </button>
          </div>
        </article>
        <style jsx>
          {`
            .profile-preview-title {
              padding: 0.4rem;
              padding-bottom: 0.5rem;
              background-color: #363636ab;
              box-shadow: 0px 3px 19px rgb(17, 17, 17);
            }

            .profile-preview-container {
              box-shadow: 0px 4px 16px rgb(17, 17, 17);
              margin: 0;
              padding: 0;
              width: 100%;
            }

            .profile-preview-banner {
              padding: 0.6rem;
              background-image: url('/banner.jpg');
              background-repeat: no-repeat;
              background-position: center top;
              background-size: cover;
            }

            .profile-preview-desc {
              background-color: #363636;
              padding-left: 20%;
              padding-right: 20%;
              padding-top: 1rem;
              padding-bottom: 1rem;
              min-height: 10rem;
            }
            .profile-preview-desc p {
              line-height: 1.7rem;
            }

            .profile-save-info {
              background-color: #363636;
              padding: 1.5rem 0.5rem;
              min-height: 10rem;
            }
            .profile-save-info p {
              line-height: 2.3rem;
            }

            @media screen and (max-width: 900px) {
              .profile-preview-desc {
                padding-left: 10%;
                padding-right: 10%;
              }
            }
            @media screen and (max-width: 600px) {
              .profile-preview-desc {
                padding-left: 0.5rem;
                padding-right: 0.5rem;
              }
            }

            .icon-bio-example {
              margin-right: 0.2rem;
            }

            .round-pp-preview {
              object-fit: cover;
              height: 80px;
              width: 80px;
              border-radius: 100%;
              border: 1px solid rgb(26, 26, 26);
              cursor: pointer;
            }

            .round-pp-preview-mobile {
              object-fit: cover;
              height: 50px;
              width: 50px;
              border-radius: 100%;
              border: 1px solid white;
              cursor: pointer;
            }

            .nav-buttons {
              width: 100%;
            }
            .nav-buttons .button {
              border: unset;
              border-radius: 0;
            }
            .need-update {
              cursor: pointer;
            }
          `}
        </style>
        <style jsx global>
          {`
            .profile-preview-desc .tag {
              margin: 0 0.1rem;
              vertical-align: middle;
              height: 1.3rem;
            }
            .profile-preview-container {
              position: relative;
            }
            .desc-preview .loading-overlay {
              background-color: rgba(20, 20, 20, 0.8) !important;
            }
          `}
        </style>
      </Fragment>
    );
  }
}

ProfilePreview.propTypes = {
  user: PropTypes.object.isRequired,
  twiteloData: PropTypes.object.isRequired,
  preview: PropTypes.object.isRequired,
  textCounter: PropTypes.object.isRequired,
  profileSaved: PropTypes.bool.isRequired,
  onRefreshPreview: PropTypes.func.isRequired,
};

ProfilePreview.contextTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
  twiteloData: state.user.twitelo,
  preview: state.builder.preview,
  textCounter: state.builder.textCounter,
  profileSaved: state.builder.preview.saved,
});

export default connect(
  mapStateToProps,
  {
    onRefreshPreview: refreshPreview,
    actionSaveProfile: saveProfile,
  },
)(ProfilePreview);
