const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

// pasta onde fica as views
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
});

app.set('view engine', 'njk');

let users = ['Luiz', 'Maylane', 'Jared'];

app.get('/', (req, res) => {
  // o arquivo .njk 
  res.render('list', { users });
});

app.get('/new', (req, res) => {
  // o arquivo .njk
  res.render('new');
});

app.listen(3000);
