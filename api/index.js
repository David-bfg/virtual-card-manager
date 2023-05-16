const express = require('express');
const CryptoJS = require('crypto-js');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = 3069;

// Allow requests only from the localhost domain
const corsOptions = {
  origin: 'http://localhost:9000'
};

app.use(cors(corsOptions));

// const account_token = env.account_token;
const apiBaseURL = 'https://sandbox.lithic.com';

const proxyMiddleware = createProxyMiddleware({
  target: apiBaseURL,
  pathRewrite: {
    '^/lithic': '/v1' // Rewrite '/lithic' to '/v1'
  },
  changeOrigin: true
})

// Proxy requests to another server with path rewriting, excluding /lithic/embed/card
app.use('/lithic', (req, res, next) => {
  if (req.path.startsWith('/lithic/embed')) {
    return next(); // Skip the proxy middleware
  } else {
    proxyMiddleware(req, res, next);
  }
});

// TODO: see if this belongs in browser.
// Learn why this is necessary at https://docs.lithic.com/pci-compliance.html
const hostedCard = (request, response) => {
  const { headers, query } = request;
  const { card_token } = query;
  const embed_request_json = JSON.stringify({
    // css: `${process.env.VUE_APP_API}/embedded.css`,
    token: card_token,
    // account_token: account_token,
  });

  const passedApiKey =
    headers.authorization && headers.authorization.replace('api-key ', '');
  const embed_request = Buffer.from(embed_request_json).toString('base64');
  const hmac = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(embed_request_json, passedApiKey)
  );

  const displayURL = `${apiBaseURL}/v1/embed/card`;
  const url = `${displayURL}?embed_request=${embed_request}&hmac=${hmac}`;

  response.send({ displayURL, url, params: { embed_request, hmac } });
};

app.get('/embed/card', hostedCard);

app.listen(port);