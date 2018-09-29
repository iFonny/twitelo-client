import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setUserSwitch } from '../../actions/user';

class SwitchToggle extends Component {
  constructor(props) {
    super(props);

    this.handleSwitchChange = this.handleSwitchChange.bind(this);
  }

  handleSwitchChange(e) {
    const { onSwitchChange, mySwitch } = this.props;

    e.preventDefault();
    onSwitchChange(!mySwitch);
  }

  render() {
    const { customClass, mySwitch } = this.props;

    return (
      <Fragment>
        <a
          id="navbar-item-switch"
          className={`navbar-item navbar-item-no-bg ${customClass}`}
        >
          <span
            data-label="Enable or disable auto-updater"
            className="is-hidden-touch is-light is-left is-medium tooltip"
          >
            <label className="switch is-medium">
              <input
                type="checkbox"
                checked={mySwitch}
                onChange={this.handleSwitchChange}
              />
              <span className="check is-success" />
              <span className="control-label" />
            </label>
          </span>
          <span
            data-label="Enable or disable auto-updater"
            className="is-hidden-desktop is-light is-bottom is-small tooltip is-multiline"
          >
            <label className="switch is-medium">
              <input
                type="checkbox"
                checked={mySwitch}
                onChange={this.handleSwitchChange}
              />
              <span className="check is-success" />
              <span className="control-label" />
            </label>
          </span>
        </a>
      </Fragment>
    );
  }
}

SwitchToggle.propTypes = {
  customClass: PropTypes.string,
  mySwitch: PropTypes.bool.isRequired,
  onSwitchChange: PropTypes.func.isRequired,
};

SwitchToggle.defaultProps = {
  customClass: '',
};

const mapStateToProps = state => ({
  mySwitch: state.user.switch,
});

export default connect(
  mapStateToProps,
  { onSwitchChange: setUserSwitch },
)(SwitchToggle);
