const config = {
  env: 'dev',
  server: {
    host: 'localhost',
    port: 4020,
    baseURL: 'http://localhost:4020',
  },
  api: {
    baseURL: 'http://localhost:4030',
  },
  db: {
    name: 'epitech_twitelo_dev',
  },
  passport: {
    twitter: {
      callbackURL: 'http://localhost:4020/auth/twitter/return',
    },
  },
};

// Exports module
module.exports = config;
