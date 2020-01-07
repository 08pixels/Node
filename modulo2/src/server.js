const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')

class App {
  constructor() {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.middleware()
    this.views()
    this.routes()
  }

  middleware() {
    this.express.use(express.urlencoded({extended: false}))
  }

  views() {
    nunjucks.configure(path.resolve(__dirname, 'app', 'views'), {
      autoescape: true,
      express: this.express,
      watch: this.isDev,
    })

    this.express.set('view engine', 'njk')
  }

  routes() {
    this.express.use(require('./routes'))
  }
}

module.exports = new App().express