# Node

- [Modulo 1](#Módulo-1)
  - [Start](#Start)
    - [Express](#Express)
    - [Nodemon](#Nodemon)
  - [Fluxo de Requisição](#Fluxo-de-Requisição)
    - [Middleware](#Middleware)
  - [Nunjucks](#Nunjucks)
    - [Configuração](#Configuração)
    - [Configurar Para Express](#Configurar-uso-para-Express)
    - [Método Render](#Metodo-Render)
  - [Enviar Formulário](#Enviar-Formulário)
- [Modulo 2](#Módulo-2)

# Módulo 1
## Start
### Express

O `express` serve para criar servidores HTTP com tratamento fácil de rotas.

```
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  return res.send('Hello, World!');
});


app.listen(3000);

```


Acrescentando mais funcionalidades quando comparado ao `http` padrão do node.

```
  return res.send()
  return res.json({})
```

## Nodemon

yarn add -D nodemon

```js
"scripts": {
  "start": "nodemon index.js"
}
```

```
$ yarn start
```

## Fluxo de Requisição

### Middleware
Serve para manipular e modificar as informações do objeto de requisição `req`. (todos os middleware executados após ele, terão acesso à manipulações)

```js
// (req, res)
app.get('/', (req, res) => {

});
```
  pode colocar quantos middlewares forem necessários.

`É um interceptador.`

Ele pode interceptar uma requisição e possivelmente devolver uma resposta.

O `Middleware` pode bloquear o fluxo das requisições. Para que ele não faça esse bloqueio, é necessário passar mais um parâmetro (que é uma função) para o `Middleware`: 

```js
(req, res, next) => {
  ...
  return next();
}

```


Usar `app.use(middleware)` para que todas as rotas utilizem o `Middleware`


## Nunjucks


É uma template engine que possibilita retornar uma view html (com conteúdo js) para as rotas, e passagem de variáveis.

### Configuração

```js
nunjucks.configure('views', {
  autospace: true,
  express: app,  // variável do express
  watch: true // tipo o modo monitor
});
```

### Configurar uso para Express

```js
// o formato dos arquivos nunjucks
app.use('view engine', 'njk');
```
### Método Render

```js
app.get('/', (req, res) => {
  // referencia o .njk
  res.render('pagina_view');
});
```

## Enviar Formulário

```js
// action: rota para qual será enviado
// method: métodos HTTP
<form action="" method="">
```

Vimos que para passar parâmetros entre as rotas usaríamos o `req.query.name`(?name=Rodrigo) ou com `req.params.name`(/rota/:name). Para poder utilizar o envio de parâmetros através do corpo da requisição, temos que setar isso ao `express`:

```js
app.use(express.urlenconded({ extended : false }));
```

Os parâmetros enviados pelo corpo da requisição pode ser acessado através de: `req.body.name`

# Módulo 2

Um aplicativo para gerenciamento de barbearia, onde os barbeiros e os clientes poderão se cadastrar e fazer o gerenciamento do horário.  

### Algumas Variáveis de Ambiente
`process.env.NODE_ENV` retorna: `production`, `testing` or `development`  

`process.env.PORT` retorna a porta disponivel pelo server

### Módulo path

permite melhor compatibilidade entre navegação das pastas, configurando automaticamente qual o tipo de barra que deve ser utilizada.

```js
// caminho: diretório atual/app/views
nunjucks.configure(path.resolve(__dirname, 'app', 'views'))
```

### Express 

```js
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
  }

  views() {
  }

  routes() {
  }
}

// normalmente exportar somente o express
// dependendo sempre da aplicação final.
module.exports = new App().express
```

### ORM 

`Object-relational-mapping`


### Sequelize

#### Instalação
```
yarn add sequelize
yarn add sequilize-cli -D
```
#### Inicialização

```
npx sequelize init
```

#### Configuração

```js
// no diretório raiz
//.sequelizerc
const path = require('path')

module.exports = {
  config: path.resolve('src', 'config', 'database.js'), // é necessário alterar o nome do arquivo gerado
  'models-path': path.resolve('src', 'app', 'models'),
  'seeders-path': path.resolve('src', 'database', 'seeders'),
  'migrations-path': path.resolve('src', 'database', 'migrations'),
}
```

Para testar (arquivos gerados em migrations)
```
npx sequelize migration:create --name=create-users
```

Arquivo `database.js`

```js
module.exports = {
  dialect: 'postgres', // yarn add pg

  host: '127.0.0.1', // endereço do database
  username: 'docker',
  password: 'docker',
  database: 'modulo2'
  operatorAliases: false, // para passar mais configurações ao sequelize
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
}
```

#### Postgres (database)

```O processo de instalação é no sistema operacional```

- instalar a base de dados (docker community)  
  ```sudo docker run --name name_do_database -p 5432:5432 -d -t kartoza/postgis```

  `-p` é o redirecionamento de porta  
  `-d` é o modo detach (background)  
  `-t` é para selecionar a imagem. Foi escolhido o kartoza porque tem melhor geolocalização, uuid, ...  

  ```sudo docker ps``` mostra os serviços em execução

- instalar gerenciador (dbeaver)
  - cuidado com os nomes.

#### Postgress integração
```
yarn add pg
```

### Configurando as views

Para manter uma boa organização, onde temos trechos de codigos que serão padrão na `view`, a separamos em dois diretórios: `_layouts` e `_partials`.

  - `_layots`  é onde fica a parte do layout que será reutilizado.
    - para utilizar no código é necessário usar o `{% extends "filepath.njk" %}`
  - `_partials` são as definições do `<head>`
    - para utilizar no código é necessário usar o `{% include "filepath.js" %}`

Páginas de estilos são deixadas no diretório `src/public`, onde se faz necessário configurar o express para servir páginas públicas (estáticas)

```js
  this.express.use(express.static(path.resolve('folderpath')))
```

Lembrar de configurar as rotas
```js
  res.render('viewsfilepath')
```

### Criando Model

```js
// app/models/User.js
module.exports = (sequelize, DataTypes) => {
  // primeiro passamos o nome da tabela: User
  const User = sequelize.define('User', {
    name: DataTypes.STRING
  })

  return User
}
```

É necessário configurar o migrate com os dados da nova tabela criada (métodos: up e down).

### Controller

```js 
// app/controller
const { User } = require('../models') // o index.js é encarregado de carregar todos models, assim só informamos quais queremos importar
class UserController {
  create(req, res) {
    res.render('auth/signup')
  }

  async store(req, res) {
    await User.create(req.body)

    return res.redirect('/')
  }

}
```

### Usando os controllers para configurar as rotas

```js
//routes.js

const express = require('express')
const routes = express.Router()

const { UserController } = require('./app/controllers/UserController)

routes.get('/signup', UserController.create)
routes.post('/signup', UserController.store)

module.exports = routes
```

### Formulário de Cadastro de Usuário

```html
// views/auth/signup.njk

<form action="/signup" method="post">
  <label for="avatar">
    <img src="images/signup.svg" height="24" />
  </label>

  <input id="avatar" name="avatar" type="file" />
  <input type="text" name="name" placeholder="Nome Completo" />
  <input type="email" name="email" placeholder="Seu e-mail" />
  <input type="password" name="password" placeholder="Senha" />

  <label for="provider">
    <input type="checkbox" id="provider" name="provider" value="1" />
    Sou Cabelereiro
  </label>

  <button type="submit"> Criar conta </button>
  <a href="/"> Já possuo conta </a>
</form>
<!-- carregar imagem de perfil e já atualizar na visualização -->
<script type="text/javascript">
  var avatar = document.getElementById('avatar')
  var img = document.querySelector('label[for=avatar] img')

  avatar.onchange = function(e) {
    img.classList.add('preview') // novo atributo para a classe (estilização)
    img.src = URL.createObjectURL(e.target.files[0])
  }

</script>
```

### Encriptando Senha

```
yarn add bcrypt
```

O método utilizado foi o `hooks`, no qual disponibiliza vários métodos, onde o que foi utilizado foi o `beforeSave`. O uso dele se dá com a adição de um novo parâmetro no arquivo de model

```js
// app/models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    password: DataTypes.VIRTUAL
  }, {
    hooks: {
      beforeSave: async user => {
        // se houver uma alteração em password
        // tanto na criação, como futuramente em uma troca de senha
        if(user.password) {
          // o 8 é a quantidade de rounds
          // normalmente fica entre 8 e 10
          // maiores números podem comprometer a performance
          user.password_hash = await bcrypt.hash(user.password, 8)
        }
      }
    }
  })

  return User
}
```

### Upload de imagem

`multer` Possibilita o envio de arquivos para o servidor

```
yarn add multer
```

Precisamos possibilitar o envio de arquivos através do `<form>`, com um simples atributo:
```js
<form action="/signup" method="post" enctype="multipart/form-data">
```

Para configurar onde os arquivos serão salvos, precisamos criar um arquivo de configuração: `config/multer.js`
```js
const path = require('path')
const crypto = require('crypto')
const multer = requite('multer')

module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, raw) => {
        if(err)
          return cb(err)

        cb(null, raw.toString('hex') + file.extname(file.originalname))
      })
    }
  })
}
```

Precisamos confirar `routes.js` para a execução da configuração do multer:

```js
const express = require('express')
const routes = express.Router()

const multerConfig = require('./config/multer')
const upload = require('multer')(multerConfig)

const UserController = require('./app/controllers/UserController')

routes.get('signup', UserController.create)
routes.post('signup', upload.single('avatar'), UserController.store) // 'avatar' é o nome da coluna na tabela

module.exports = routes

```

Agora vamos passar o nome do arquivo que foi enviado pelo form para o banco de dados, em  `UserController.js`. 

```js
const { User } = require('../models')

class UserController {
  create(req, res) {
    res.render('auth/signup')
  }

  async storage(req, res) {
    const {filename: 'avatar'} = req.file

    await User.create({...req.body, avatar})

    return res.redirect('/')
  }
}

module.exports = new UserController()
```

### Autenticação

Para isso, precisamos recuperar os dados do banco de dados.
Primeiro iremos adicionar uma nova função ao model de `User`

```js

const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
    password: DataTypes.VIRTUAL,
    password_hash: DataTypes.STRING,
    provider: DataTypes.BOOLEAN,
  }, {
    hooks: {
      beforeSave: async user => {
        if(user.password) {
          user.password_hash = await bcrypt.hash(user.password, 8)
        }
      }
    }
  })

  // aqui criaremos a nova função com o método prototype
  User.prototype.checkPassword = function(password) {
    return bcrypt.compare(password, this.password_hash)
  }

  return User
}
```

Criaremos um novo arquivo `controller`, `SessionController.js`, que irá invocar o novo método criado. A classe `SessionController` irá gerenciar uma nova sessão, tendo assim a responsabilidade de informar qual view será renderizada na página de login.

#### dependências
```yarn add bcrypt```

```js

const User = require('../models')

class SessionController {
  create(req, res) {
    return res.render('auth/sigin')
  }

  async store(req, res) {

    const { email, password } = req.body

    const user = User.findOne({where: {email}})

    if(!user) {
      // console.log('usuário não encontrado!')

      return res.redirect('/')
    }

    if(!(await user.checkPassword(password))) {
      console.log('Senha incorreta!')

      return res.redirect('/')
    }

    return res.redirect('/app/dashboard')
  }
}

module.export = new SessionController()
```

Agora basta somente tratá-las no arquivo de rotas.

```js
const express = require('express')
const routes = express.Router()

const multerConfig = require('./config/multer')
const upload = require('multer')(multerConfig)

const UserController = require('./controllers/UserController')
const SessionController = require('./controllers/SessionController')

server.get('/', SessionController.create)
server.post('/sigin', SessionController.store)

server.get('/sigup', UserController.create)
server.post('/sigup', upload.single('avatar'), UserController.store)

routes.get('/app/dashboard', (req, res) => {
  return res.render('dashboard')
})

module.exports = routes
```

View de login

```html
{% extends "_layouts/auth.njk" %}

{% block body %}
  <form action="/signin" method="post">
    <img src="images/logo.svg" height="42">

    <input type="text" name="name" placeholder="Seu nome">
    <input type="email" name="email" placeholder="Seu e-mail">
    <input type="password" name="password" placeholder="Sua senha">

    <button type="submit"> Entrar <button>
    <a href="/signup"> Criar conta </a>
  </form>
{% endblock %}
```

### Persistir Login (Sessão)

#### Dependências
```
yarn add express-session
yarn add session-file-store
```


Precisamos informar ao `express` para usar esse `middleware`, para isso fazemos as modificações em `server.js`

```js
const express = require('express')
const nunjucks = require('nunjucks')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const path = require('path')

class App {
  constructor() {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.middlewares()
    this.views()
    this.routes()
  }

  middlewares() {
    this.express.use(express.urlencoded({ extended: false }))
    this.express.use(session({
      name: 'root', // voce pode dar o nome que quiser
      secret: 'mySecretApp', // igualmente
      resave: true,
      store: new FileStore({
        path: path.resolve(__dirname, '..', 'tmp', 'sessions')
      })
      saveUninitialized: true
    }))
  }

  views() {
    nunjucks.configure(path.resolve(__dirname, 'app', 'views'), {
      autoescape: true,
      watch: this.isDev,
      express: this.express
    })

    this.express.use(express.static(path.resolve(__dirname, 'public')))
    this.express.set('view engine', 'njk')
  }

  routes() {
    this.express.use(require('./routes'))
  }
}

module.exports = new App().express

```

Agora vamos passar os dados da sessão no corpo da requisição. Vamos configurar em `SessionController`

```js

class SessionController {
  create(req, res) {
    return res.render('auth/signin')
  }

  async store(req, res) {
    const {email, password} = req.body

    const user = await User.findOne({where: { email } })

    if(!user) {
      console.log('usuário não encontrado')

      return res.redirect('/')
    }

    if(!(await user.checkPassword(password))) {
      console.log('senha incorreta')

      return res.redirect('/')
    }

    // estamos passando aqui
    req.session.user = user
    return res.redirect('/app/dashboard')
  }
}

module.exports = new SessionController()
```
podemos colocar um `console.log(req.session.user)` na rota do dashboard para se certificar dessas alterações.


### Middlewares de autenticação

```js
// src/app/middlewares/auth.js
module.exports = (req, res, next) => {
  if(req.session && req.session.user) {
    // para podermos ter acesso aos dados(sessão) do usuário entre as rotas
    res.locals.user = req.session.user
    return next()
  }

  return res.redirect('/')
}
```

```js
// src/app/middlewares/guest.js

module.exports = (req, res, next) => {
  if(req.session && !req.session.user) {
    return next()
  }

  return res.redirect('/app/dashboard')
}
```

#### usando os middlewares nas rotas

```js
// routes.js
const express = require('express')
const routes = express.Router()

const multerConfig = require('./app/config/multer')
const upload = require('multer')(multerConfig)

const authMiddleware = require('./app/middlewares/auth')
const guestMiddleware = require('./app/middlewares/guest')

const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionController')


routes.get('/', guestMiddleware, SessionController.create)
routes.post('/signin', SessionController.store)

routes.get('/signup', guestMiddleware, UserController.create)
routes.post('/signup', upload.single('avatar'), UserControler.store)

routes.use('/app', authMiddleware)
routes.get('/app/dashboard', (req, res) => {
  return res.render('dashboard')
})

module.exports = routes
```

### Logout

Vamos definir a view:

```js
// src/app/views/_layouts/main.njk

<!DOCTYPE html>
<html lang="en">
  {% include "_partials/head.njk" %}
  <body>
    <div class="main-wrapper"> 
      {% block body %} {% endblock %}
    </div>
  </body>
</html>
```

```js
// src/app/views/dashboard.js

{% include "_layouts/main.njk" %}

{% block body %}
  <h1> Olá, {{ user.name }} </h1>
  <a href="/app/logout"> sair </a>
{% endblock %}
```

Vamos precisar criar a rota referida ao logout: `/app/logout`

```js
const express = require('express')
const routes = express.Router()

const multerConfig = require('multerConfig')
const upload = require('multer')(multerConfig)

const authMiddleware = require('./app/middlewares/auth')
const guestMiddleware = require('./app/middleware/guest')

const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionController')

routes.get('/', guestMiddleware, UserController.create)
routes.post('/signin', UserControler.store)

routes.get('/signup', guestMiddleware, UserController.create)
routes.post('/signup', upload.single('avatar'), UserController.store)

routes.use('/app', authMiddleware)

routes.get('/app/logout', SessionController.destroy)

routes.get('/app/dashboard', (req, res) => {
  console.log(req.session.user)
  return res.render('dashboard')
})

module.exports = routes
```

Criando o `middleware` para tratar a rota

```js
// src/controllers/SessionController

const { User } = require('../models')

class SessionController {
  create(req, res) {
    return res.render('auth/sigin')
  }

  async store(req, res) {
    const { email, password } = req.file

    const user = await User.findOne({where: { email }})

    if(! user) {
      console.log('Usuário não encontrado!')

      return res.redirect('/')
    }

    if(! await user.checkPassword(password)) {
      console.log('Senha Incorreta')

      return res.redirect('/')
    }

    req.session.user = user
    return res.redirect('/app/dashboard')
  }

  destroy(req, res) {
    req.session.destroy(() => {
      res.clearCookie('root')

      return res.redirect('/')
    }) 
  }
}

module.exports = new SessionController()

```

### Flash Message

#### Dependência
```
yarn add connect-flash
```

É necessário deixar ele acessível a toda aplicação, sendo assim, configuramos o arquivo `server.js`

```js

const express = require('express')
const nunjucks = require('nunjucks')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const path = require('path')
const flash = require('flash')

class Server {
  constructor() {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.middlewares()
    this.views()
    this.routes()
  }

  middlewares() {
    this.express.use(express.urlenconded({extended: true}))
    // aqui
    this.express.use(flash())

    this.express.use(session({
      name: 'root',
      secret: 'mySecretApp',
      resave: true,
      store: new FileStore({
        path: path.resolve(__dirname, '..', 'tmp', 'sessions')
      }),
      saveUninitialized: true,
    }))
  }

  views() {
    nunjucks.configure(path.resolve(__dirname, 'app', 'views'), {
      autoscape: true,
      express: this.express,
      watch: this.isDev
    })

    this.express.use(express.static(path.resolve(__dirname, 'public')))
    this.express.set('view engine', 'njk')
  }

  routes() {
    this.express.use(require('./server'))
  }
}

module.exports = new Server().express
```

Usando `flash message`

```js

const { User } = require('../models')

class SessionController {

  create(req, res) {
    return res.render('auth/signin')
  }

  async store() {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email }})

    if(!user) {
      // flash message
      // parâmetro 1: error ou sucess
      // parâmetro 2: mensagem
      req.flash('error', 'Usuário não cadastrado')

      return res.redirect('/')
    }

    if(!await user.checkPassword(password)) {
      // flash message
      req.flash('error', 'Senha Incorreta')

      return res.redirect('/')
    }

    req.session.user = user
    return res.redirect('/app/dashboard')
  }
}

module.exports = new SessionController()
```

Usando variável global para que todas as views do nunjucks tenham acesso às flash messages. Para isso vamos criar um novo middleware em `routes.js`

```js
const express = require('express')
const multerConfig = require('./config/multer')
const upload = require('multer')(multerConfig)

const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')
const guestMiddleware =require('./app/middlewares/guest')

const UserController = require('./app/controller/UserController')
const SessionController = require('./app/controllers/SessionController')

// middleware para atribuição de variáveis globais
// entre as views
routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success')
  res.locals.flashError = req.flash('error')

  return next()
})

routes.get('/', guestMiddleware, SessionController.create)
routes.post('/sigin', SessionController.store)

routes.get('signup', guestMiddleware, UserControoler.create)
routes.post('signup', UserController.store)

routes.use('/app', authMiddleware)

routes.get('/app/dashboard', (req, res) => {
  return res.render('dashboard')
})

routes.get('/app/logout', SessionController.destroy)

module.exports = routes
```


Posicionando `flash messages` nas views. Para isso vamos criar uma arquivo `njk`em `_partials`, chamado `flash.njk`

```html
// flashSuccess e flashError são as variáveis globais
// que foram criadas

{% for message in flashSuccess %}
  <div class="alert alert-sucess">
    {{ message }}
  </div>
{% endfor %}


{% for message in flashError %}
  <div class="alert alert-danger">
    {{ message }}
  </div>
{% endfor %}
```

Informando onde as `flash messages` irão aparecer na view

```html
// signin.njk

{% extends "_layouts/auth.njk" %}

{% block body %}
  <form action="/sigin" method="post">
    <img src="/images/logo.svg" height="42" />

    {% include "_partials/flash.njk" %}
    <input type="email" name="email" placeholder="Seu e-mail" />
    <input type="password" name="password" placeholder="Sua senha" />

    <button type="submit"> Enviar </button>
    <a href="/signup"> Criar Conta </a>
  </form>
{% endblock %}
```

```html
// signup
{% include "_layouts/auth.njk" %}

{% block body %}
  <form action="/signup" method="post" enctype="multipart-data">

    {% include "_partials/flash.njk" %}
    <label for="avatar">
      <img src="/images/logo.svg" height="24" />
    </label>

    <input type="file" id="avatar" name="avatar" />
    
    <input type="text" name="name" placeholder="Seu nome" />
    <input type="email" name="avatar" placeholder="Seu e-mail" />
    <input type="password" name="password" placeholder="Sua senh a" />

    <label for="provider">
      <input type="checkbox" id="provider" name="provider" value="1">
      Sou Cabelereiro
    </label>

    <button type="submit"> Criar Conta </button>
    <a href="/"> Já possuo conta </a>
  </form>

  <script type="text/javascript">
    var avatarInput = document.getElementById('avatar')
    var avatarImg = document.querySelector('label[for="avatar"] img)

    avatarInput.onchange = function(e) {
      avatarImg.classList.add('preview')
      avatarImg.src = URL.createObjectURL(e.target.files[0])
    }

  </script>
{% endblock %}
```

### Listagem de Prestadores

Vamos criar um controller para a view de `dashboard.njk`

```js
// dashboardController.js

const { User } = require('../models')

class DashboardController {
  async index(req, res) {
    const providers = await User.findAll({where: { provider: true }})

    return res.render('dashboard', { providers })
  }
}

module.exports = new DashboardController()
```

Usando o Controller para a rota `/app/dashboard`

```js
const express = require('express')
const multerConfig = require('./config/multer')
const upload = require('multer')(multerConfig)
const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')
const guestMiddleware = require('./app/middlewares/guest')

const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionController')
const DashboardController = require('./app/controller/DashboardController')

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success')
  res.locals.flashError = req.flash('error')

  return next()
})

routes.get('/', guestMiddleware, SessionController.create)
routes.post('/sigin', SessionController.store)

routes.get('signup', guestMiddleware, UserController.create)
routes.post('signup', upload.single('avatar'), UserController.store)

routes.use('/app', authMiddleware)
routes.get('/app/logout', SessionController.destroy)

// aqui
routes.get('/app/dashboard', DashboardController.index)

module.exports = routes
```

Criando a view `dashboard.njk`

```html
{% extends "_layouts/main.njk" %}

{% block body %}
  <div class="content">
    <strong> Olá, {{ user.name }} </strong>
    <p> Inicie um agendamento escolhendo um dos profissionais abaixo </p>

    <ul class="providers">
      {% for provider in providers %}
        <li>
          <!-- por enquanto não temos como acessar o avatar do provedor -->
          <img src="" />
          <strong> {{ provider.name }}
          <a href=""> + </a>
        </li>
      {% endfor %}
      <a href="/app/logout" class="logout"> Sair </a>
    </ul>
  </div>
{% endblock %}
```