const config = {
  env: 'production',
  server: {
    host: 'twitelo.en-f.eu',
    port: 4021,
    baseURL: 'https://twitelo.en-f.eu',
  },
  api: {
    baseURL: 'https://api.twitelo.en-f.eu',
  },
  db: {
    name: 'epitech_twitelo',
  },
  passport: {
    twitter: {
      callbackURL: 'https://twitelo.en-f.eu/auth/twitter/return',
    },
  },
};

// Exports module
module.exports = config;
