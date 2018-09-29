import React from 'react';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import I18n from 'redux-i18n';
import withRedux from 'next-redux-wrapper';
import makeStore from '../src/store/createStore';

import styleSheet from '../src/styles/base.scss';

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
          <I18n translations={translations} initialLang="en" fallbackLang="en">
            <Component {...pageProps} />
          </I18n>
        </Provider>
        <style jsx global>
          {styleSheet}
        </style>
      </Container>
    );
  }
}

export default withRedux(makeStore)(Twitelo);
