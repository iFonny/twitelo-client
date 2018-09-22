const { ASSET_HOST } = process.env;

// for those who using CDN
const assetPrefix = ASSET_HOST || '';

module.exports = {
  assetPrefix,
  webpack: (configD, { dev }) => {
    const config = { ...configD };

    config.output.publicPath = `${assetPrefix}${config.output.publicPath}`;

    config.module.rules.push({
      test: /\.scss/,
      use: [
        {
          loader: 'emit-file-loader',
          options: {
            name: 'dist/[path][name].[ext]',
          },
        },
        'babel-loader',
        'styled-jsx-css-loader',
        {
          loader: 'sass-loader',
          options: { sourceMap: dev },
        },
      ],
    });

    return config;
  },
};
