const express = require('express');
const next = require('next');
const { parse } = require('url');

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

const appNext = next({dir: './next', dev });
const handle = appNext.getRequestHandler();

const getRoutesNext = require('./next/routes');

const routesNext = getRoutesNext();
const server = express();

appNext.prepare().then(() => {
  server.get('/next', (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query = {} } = parsedUrl;
    const route = routesNext[pathname];
    if (route) {
      return appNext.render(req, res, route.page, query);
    }
    return handle(req, res);
  });
});

server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
});