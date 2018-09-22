// Datas
const env = process.env.NODE_ENV || 'development';
let config = {};

// Switch between env
switch (env) {
  case 'prod': // Production
  case 'production':
    config = {
      ws: 'ws://',
      host: 'ws.twitelo.en-f.eu',
      port: 5000,
    };
    break;

  case 'dev': // Development
  case 'development':
    config = {
      ws: 'ws://',
      host: 'localhost:5000',
      port: 5000,
    };
    break;

  default:
    config = {
      ws: 'ws://',
      host: 'localhost:5000',
      port: 5000,
    };
    break;
}

// Exports module
module.exports = config;
