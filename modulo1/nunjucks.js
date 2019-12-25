const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

// pasta onde fica as views
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true,
});

app.set('view engine', 'njk');
app.use(express.urlencoded({extended: false}));

const users = ['Luiz', 'Maylane', 'Jared'];

app.get('/', (req, res) => {
  // o arquivo .njk
  res.render('list', {users});
});

app.get('/new', (req, res) => {
  // o arquivo .njk
  res.render('new');
});

app.post('/create', (req, res) => {
  /*  como o node funciona da forma event loop
      a variável `users` ainda é mantida entre as rotas
  */
  users.push(req.body.user);
  return res.redirect('/');
});

app.listen(3000);
