const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({
  target: 'http://localhost:5000', // Replace with your server URL
  changeOrigin: true,
}));

app.listen(5173, () => {
  console.log('Proxy server is running on port 5173');
});
