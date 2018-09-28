import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class User extends Component {
  constructor(props) {
    super(props);

    this.toggleActiveClass = this.toggleActiveClass.bind(this);
    this.state = { isActive: false };
  }

  toggleActiveClass() {
    const { isActive } = this.state;

    this.setState({
      isActive: !isActive,
    });
  }

  render() {
    const { customClass, user } = this.props;
    const { t } = this.context;
    const { isActive } = this.state;

    return (
      <Fragment>
        <div
          className={`dropdown dropdown-user ${isActive &&
            'is-active'} is-bottom-left is-mobile-modal ${customClass}`}
        >
          <div
            role="button"
            className="dropdown-trigger"
            onClick={this.toggleActiveClass}
          >
            <a className="navbar-item navbar-item-line no-select">
              <img
                src={user.profile_image_url}
                href={`http://twitter.com/${user.username}`}
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = '/images/errors/default_profile.png';
                }}
                className="round-pp-menu"
                alt="profile"
              />
            </a>
          </div>
          <div
            className="background"
            style={isActive ? {} : { display: 'none' }}
          />
          <div className="dropdown-menu">
            <div className="dropdown-content">
              <a
                role="button"
                id="dropdown-user-button-close"
                className="button dropdown-user-button is-dark is-hidden-desktop"
                onClick={this.toggleActiveClass}
              >
                <span className="icon">
                  <i className="fas fa-times-circle fa-lg" />
                </span>
                <span className="sub-menu-button">
                  {t('navbar.close-popup')}
                </span>
              </a>
              <div className="card-content">
                <div className="media media-menu">
                  <a
                    href={`http://twitter.com/${user.username}`}
                    className="media-left no-select"
                  >
                    <img
                      src={user.profile_image_url}
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = '/images/errors/default_profile.png';
                      }}
                      className="round-pp-user no-select"
                      alt="profile"
                    />
                  </a>
                  <div className="media-content">
                    <p className="is-6 has-text-white text-overflow-is-ellipsis">
                      {user.name}
                    </p>
                    <p className="is-6 has-text-grey-lighter has-text-weight-light is-italic text-overflow-is-ellipsis">
                      {user.username}
                    </p>
                  </div>
                </div>
                <div className="content has-text-centered">
                  <span>{user.description}</span>
                  <br />
                </div>
              </div>
              <div className="columns is-gapless is-multiline">
                <a
                  href="/auth/logout"
                  id="dropdown-user-button-logout"
                  className="column button dropdown-user-button is-red"
                >
                  <span className="icon">
                    <i className="fas fa-sign-out-alt fa-lg" />
                  </span>
                  <span className="sub-menu-button">
                    {t('navbar.user.logout')}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <style jsx>
          {`
            .navbar-item img {
              max-height: 2.4rem;
            }
            .round-pp-menu {
              object-fit: cover;
              width: 2.4rem;
              height: 2.4rem;
              border-radius: 100%;
              border: 1px solid white;
              cursor: pointer;
            }

            .round-pp-user {
              object-fit: cover;
              height: 50px;
              width: 50px;
              border-radius: 100%;
              border: 1px solid white;
              cursor: pointer;
            }

            .media-menu {
              margin-bottom: 10px;
            }
            .media-right-switch {
              padding-top: 10px;
            }
            .dropdown-user-button {
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 0px;
            }
            #dropdown-user-button-logout {
              border-radius: 0px 0px 0px 15px;
            }

            // Mobile
            @media screen and (max-width: 1023px) {
              #dropdown-user-button-logout {
                border-radius: 0px 0px 15px 15px;
              }
              #dropdown-user-button-close {
                border-radius: 15px 15px 0 0;
              }
            }
            @media screen and (max-width: 370px) {
              .media-right-switch {
                display: none;
              }
            }
          `}
        </style>
        <style jsx global>
          {`
            .dropdown-user .dropdown-menu {
              padding-top: 0px;
              z-index: 100;
              width: 33rem;
            }

            .dropdown-user .dropdown-content {
              padding-top: 0;
              border-radius: 0px 0px 0px 15px;
              box-shadow: none;
              padding-bottom: 0px;
              opacity: 0.98;
              background-color: #3d3d3d;
            }

            // Mobile
            @media screen and (max-width: 1023px) {
              .dropdown-user .dropdown-content {
                border-radius: 15px 15px 15px 15px;
              }
            }
          `}
        </style>
      </Fragment>
    );
  }
}

User.contextTypes = {
  t: PropTypes.func.isRequired,
};

User.propTypes = {
  customClass: PropTypes.string,
  user: PropTypes.object.isRequired,
};

User.defaultProps = {
  customClass: '',
};

const mapStateToProps = state => ({
  user: state.user,
  currentLocale: state.i18nState.lang,
});

export default connect(mapStateToProps)(User);
