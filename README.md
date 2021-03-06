# `mechanik`

`mechanik` is a *work-in-progress* ES7/Express/React/Docker app stack running on single Docker host instances.

## basic usage

```
npm run build
npm run test
npm run start
```

## features

* web server in clustered configuration
* config file w/ development, integration & production environments
* logging (to stdout & filesystem) w/ support for clustered Node configuration
* some `mocha` support
* partial `knex` and `bookshelf` implementation
  * models
* Docker containers
  * redis
  * postgres
* React components  
* async/await support
* `.eslintrc.js` config

## new module

```
'use strict';
// fetch configuration for environment
const config = require('./config')(process.env.NODE_ENV);
// init logging module
const log = require('./logger')('Module name goes here');

```

## todo
* Docker containers
  * api/web server
  * monitoring
* fully implement `knex` and `bookshelf`
  * migrations
* implement front-end standalone `socket.io` client
* `s3` module/support
* moar testing
* ~~figure out if `xo` is a good idea~~ it's not
* figure out if `flow` is a good idea
* rudimentary API limiter middleware
* advanced logging
  * external centralized logging service/container?
  * should this be part of monitor? perhaps monitor should be split up into client/server modules
  * ...in streams...
* messenger module
  * Apple Push Notifications
  * Facebook Messenger?

