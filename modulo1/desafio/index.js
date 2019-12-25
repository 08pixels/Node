const express = require('express');
const nunjucks = require('nunjucks');
const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true,
});

app.set('view engine', 'njk');
app.use(express.urlencoded({extended: false}));

const checkAgeMid = (req, res, next) => {
  if (!req.query.age) {
    res.redirect('/');
  }

  return next();
};

app.get('/', (req, res) => {
  res.render('index');
});


app.get('/minor', checkAgeMid, (req, res) => {
  const age = req.query.age;
  return res.render('minor', {age});
});

app.get('/major', checkAgeMid, (req, res) => {
  const age = req.query.age;
  return res.render('major', {age});
});

app.post('/check', (req, res) => {
  const age = req.body.age;

  if (age < 18) {
    return res.redirect(`/minor?age=${age}`);
  } else {
    return res.redirect(`/major?age=${age}`);
  }
});

app.listen(3000);
