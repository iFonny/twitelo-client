const config = require('../config/cursor');
global._config = config;

const path = require('path');
const express = require('express');
const session = require('express-session');
const compression = require('compression');
const next = require('next');
const helmet = require('helmet');

const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;
const r = require('rethinkdbdash')({
  db: config.db.name,
});
const RDBStore = require('session-rethinkdb')(session);
const dbFunc = require('./db');

const routes = require('../routes');

dbFunc.checkOrCreateTable(r).then(() => {
  //=======================================================================//
  //     Passport                                                          //
  //=======================================================================//

  passport.use(
    new Strategy(
      {
        consumerKey: config.secret.twitter.consumerKey,
        consumerSecret: config.secret.twitter.consumerSecret,
        callbackURL: config.passport.twitter.callbackURL,
      },
      function(token, tokenSecret, profile, done) {
        dbFunc
          .findOrCreate(r, profile, token, tokenSecret, config)
          .then(user => done(null, user))
          .catch(err => done(err));
      },
    ),
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    dbFunc
      .findUserByID(r, id)
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  //=======================================================================//
  //     Express & Session                                                 //
  //=======================================================================//
  const port = config.server.port;
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev });

  const store = new RDBStore(r, {
    browserSessionsMaxAge: 60000, // optional, default is 60000. After how much time should an expired session be cleared from the database
    clearInterval: 60000, // optional, default is 60000. How often do you want to check and clear expired sessions
  });

  const handler = routes.getRequestHandler(app);

  app.prepare().then(() => {
    const server = express();

    server.use(helmet());
    server.use(compression());

    let sessionParser = session({
      secret: config.secret.server.secret,
      store: store,
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 31536000000, // 1 year
      },
    });
    server.use(sessionParser);

    // Initialize Passport and restore authentication state, if any, from the
    // session.
    server.use(passport.initialize());
    server.use(passport.session());

    // (middleware) Handle passport errors
    server.use(function(err, req, res, next) {
      if (err) {
        console.error(err);
        req.logout(); // So deserialization won't continue to fail.
        req.session.destroy(function(serr) {
          if (req.originalUrl == '/login-error') next();
          // never redirect login page to itself
          else res.redirect('/login-error');
        });
      } else next();
    });

    // Static public files
    const staticPath = path.join(__dirname, '../static');
    server.use(
      '/',
      express.static(staticPath, {
        maxAge: '30d',
        immutable: true,
      }),
    );

    //=======================================================================//
    //     Auth Routes                                                       //
    //=======================================================================//

    server.get(
      '/auth/twitter',
      passport.authenticate('twitter', {
        failureRedirect: '/',
      }),
    );

    server.get(
      '/auth/twitter/return',
      passport.authenticate('twitter', {
        failureRedirect: '/',
      }),
      function(req, res) {
        if (req.user.freshUser) res.redirect('/');
        else res.redirect('/');
      },
    );

    server.get('/auth/logout', function(req, res) {
      req.logout();
      req.session.destroy(function(err) {
        res.redirect('/');
      });
    });

    server.get('*', (req, res) => {
      return handler(req, res);
    });

    function startServer() {
      server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
      });
    }

    startServer();
  });
});
