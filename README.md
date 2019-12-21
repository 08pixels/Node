# Node

### Express

O `express` serve para criar servidores http com tratamento fácil de rotas.

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
  return res.json
```

## Nodemon

yarn add -D nodemon

"scripts": {
  "start": "nodemon index.js"
}

```
$ yarn start
```

## Fluxo de Requisição

`Middleware`
Serve para manipular e modificar as informações do objeto de requisição `req`. (todos os middleware executados após ele, terão acesso à manipulações)

```js
// (req, res)
app.get('/', (req, res) => {

});
```
  pode colocar quantos middlewares forem necessaários.

`É um interceptador.`

Ele pode interceptar uma requisição e possivelmente devolver uma resposta.

O `Middleware` pode bloquear (o que também é útil) o fluxo das requisições. Para que ele não faça esse bloqueio, é necessário passar mais um parâmetro para o `Middleware`: 

```js
(req, res, next)
```


Usar `app.use(middleware)` para que todas as rotas utilizem o `Middleware`

