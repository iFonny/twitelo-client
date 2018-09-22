const devConfig = require('./dev');
const prodConfig = require('./production');

// Datas
const env = process.env.NODE_ENV || devConfig.env;
let config = {};

// Switch between env
switch (env) {
  case 'dev': // Development
  case 'development':
    config = devConfig;
    break;

  case 'prod': // Production
  case 'production':
    config = prodConfig;
    break;

  default:
    config = devConfig;
    break;
}

// secret configs
config.secret = require(`./secret`);

// Exports module
module.exports = config;
