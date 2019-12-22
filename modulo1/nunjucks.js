const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

// pasta onde vai ficar as views
nunjucks.configure('views', {
  autoescape: true,
  express: app, 
  watch: true,
});

app.set('view engine', 'njk');

let users = ['user1', 'user2', 'user3'];

app.get('/', (req, res) => {
  res.render('list', {users});
});

app.get('/new', (req, res) => {
  res.render('new');
})

app.listen(3000);
