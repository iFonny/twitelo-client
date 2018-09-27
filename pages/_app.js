import React from 'react';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import I18n from 'redux-i18n';
import withRedux from 'next-redux-wrapper';
import makeStore from '../src/store/createStore';

import transFR from '../locales/fr';
import transEN from '../locales/en';

const translations = {
  en: transEN,
  fr: transFR,
};

class Twitelo extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <I18n translations={translations}>
            <Component {...pageProps} />
          </I18n>
        </Provider>
      </Container>
    );
  }
}

export default withRedux(makeStore)(Twitelo);
