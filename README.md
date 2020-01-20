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
    name: DataTypes.STRING
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