import React from 'react';
import { connect } from 'react-redux';
import { setError } from '../actions/base';
import { setLanguage } from 'redux-i18n';
import PropTypes from 'prop-types';

const Test = ({ dispatch }, context) => {
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          dispatch(setLanguage('fr'));
        }}
      >
        <button type="submit">{context.t('locale')}</button>
      </form>
    </div>
  );
};

Test.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default connect()(Test);
