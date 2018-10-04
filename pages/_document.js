import Document, { Head, Main, NextScript } from 'next/document';
import Helmet from 'react-helmet';

// from https://github.com/zeit/next.js/edit/canary/examples/with-react-helmet/pages/_document.js
export default class extends Document {
  static async getInitialProps(...args) {
    const documentProps = await super.getInitialProps(...args);
    // see https://github.com/nfl/react-helmet#server-usage for more information
    // 'head' was occupied by 'renderPage().head', we cannot use it
    return { ...documentProps, helmet: Helmet.renderStatic() };
  }

  get helmetHtmlAttrComponents() {
    return this.props.helmet.htmlAttributes.toComponent();
  }

  get helmetBodyAttrComponents() {
    return this.props.helmet.bodyAttributes.toComponent();
  }

  get helmetHeadComponents() {
    return Object.keys(this.props.helmet)
      .filter(el => el !== 'htmlAttributes' && el !== 'bodyAttributes')
      .map(el => this.props.helmet[el].toComponent());
  }

  get helmetJsx() {
    let title = 'Link your twitter account and your favorite online games!';

    return (
      <Helmet>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
      </Helmet>
    );
  }

  render() {
    return (
      <html {...this.helmetHtmlAttrComponents} className="has-navbar-fixed-top">
        <Head>
          {this.helmetJsx}
          {this.helmetHeadComponents}
          <link
            rel="stylesheet"
            type="text/css"
            src="//cdn.materialdesignicons.com/2.1.19/css/materialdesignicons.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://use.fontawesome.com/releases/v5.1.0/css/all.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.min.css"
          />
          <style>{`body {font-family: sans-serif}`}</style>
        </Head>
        <body {...this.helmetBodyAttrComponents}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
