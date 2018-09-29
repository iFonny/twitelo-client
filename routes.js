const nextRoutes = require('next-routes');

const routes = nextRoutes();
const APP_ROUTES = [
  {
    page: 'index',
    pattern: '/',
  },
  {
    page: 'about',
    pattern: '/about',
  },
  {
    page: 'builder',
    pattern: '/builder',
  },
  {
    page: 'chat',
    pattern: '/chat',
  },
];

APP_ROUTES.forEach(route => routes.add(route));

module.exports = routes;
