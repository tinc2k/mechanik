# `mechanik`

`mechanik` is a *work-in-progress* ES7/Node/React/Docker app stack running on single Docker host instances.

## basic usage

```
npm run build
npm run test
npm run start
```

## features

* web server in clustered configuration
* config file w/ development, integration & production environments
* logging (to console output & filesystem) w/ support for clustered configuration
* partial `knex` and `bookshelf` implementation
 * models
* Docker containers
  * redis
  * postgres
* React components  
* async/await support
* `.eslintrc.js` config

## todo
* Docker containers
  * api/web server
  * monitoring
* fully implement `knex` and `bookshelf`
  * migrations
* implement front-end standalone `socket.io` client
* testing
* figure out if `xo` is a good idea
* figure out if `flow` is a good idea
* write a couple (`mocha`?) tests
* rudimentary API limiter middleware
* Apple push notifications module
