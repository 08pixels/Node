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
-[Modulo 2](#Módulo-2)
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
