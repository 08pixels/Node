const express = require('express')
const app = express()

const logMiddleware = (req, res, next) => {
  console.log(
    `HOST: ${req.headers.host} | URL: ${req.url} | METHOD: ${req.method}`
  );

  req.appName = 'goNode';
  return next();
};

app.use(logMiddleware)

app.get('/', (req, res) => {
  return res.send(`Hello, ${req.query.name}`);
});

app.get('/nome/:name', (req, res) => {
  return res.json({
    'message': `Welcome to ${req.appName}, ${req.params.name}`
  });
});

app.listen(3000);


