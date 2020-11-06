const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/',
  cors(),
  createProxyMiddleware({
    target: 'https://httpbin.org',
    changeOrigin: true,
    router: function(req) {
      const target = req.headers['x-forwarded-proto'] + '://' + req.headers['x-forwarded-host'];
      return target;
    },
    logLevel: 'debug',
  })
);

app.listen(57386);
