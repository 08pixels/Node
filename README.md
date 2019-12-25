# Node

- [Modulo 1](#Modulo-1)
  - [Start](#Start)
    - [Express](#Express)
    - [Nodemon](#Nodemon)
  - [Fluxo](#Fluxo-de-Requisição)
    - [Middleware](#Middleware)
  - [Nunjucks](#Nunjucks)
    - [Configuração](#Configuração)
    - [Configurar Para Express](#Configurar-uso-para-Express)
    - [Método Render](#Metodo-Render)
  - [Enviar Formulário](#Enviar-Formulário)
# Modulo 1
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

