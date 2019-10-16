/* @flow */
'use strict';

const os = require('os');
const path = require('path');
const http = require('http');
const https = require('https');
const cluster = require('cluster');
const parser = require('body-parser');
const fs = require('graceful-fs');
const express = require('express');

const enums = require('./enums');
const config = require('./config')(process.env.NODE_ENV);
const log = require('./logger')('Core');
const middleware = require('./middleware');

const CPU_COUNT = os.cpus().length;
const PORT_HTTP = config.isDevelopment ? 3000 : 80;
const PORT_HTTPS = 443;
const KEEP_ALIVE = 300000; // 5 minutes
const JSON_LIMIT = '1mb'; // default '100kb'
const STATIC_ROOT = path.join(__dirname, '../static');

// fake domain logic component
const domain = require('./domain');

// if running in clustered configuration, and this is the master process
if (config.Server.cluster && cluster.isMaster) {
  log.info(`Cluster mode enabled, spawning ${CPU_COUNT} workers.`);
  // attach event handlers
  cluster.on('message', onWorkerMessage);
  cluster.on('online', onWorkerOnline);
  cluster.on('exit', onWorkerDeath);
  // spawn workers
  for (let i = 0; i < CPU_COUNT; i++) {
    cluster.fork();
  }
// not running in clustered mode, or this is a spawned worker process
} else {
  var app = express();
  // use qs as querystring parser
  app.use(parser.urlencoded({ extended: true }));
  // parse JSON payloads
  app.use(parser.json({ limit: JSON_LIMIT }));
  app.set('view engine', 'pug');

  if (config.isDevelopment) {
    // pretty JSON response (disable JSON minification)
    app.set('json spaces', 2);
    // pretty HTTP response (disable pug/HTML minification)
    app.locals.pretty = true;
  }

  const httpServer = http.createServer(app);
  httpServer.on('connection', socket => socket.setTimeout(KEEP_ALIVE));
  httpServer.listen(PORT_HTTP);

  if (config.Server.force_https) {
    log.debug('Enforcing secure connections.');
    const httpsServer = https.createServer({
      cert: fs.readFileSync(config.Server.certificatePath),
      key: fs.readFileSync(config.Server.certificateKeyPath)
    }, app);
    httpsServer.on('connection', socket => socket.setTimeout(KEEP_ALIVE));
    httpsServer.listen(PORT_HTTPS);
    app.use(forceHttps);
  }

  app.get('/', logRequest, (req, res) => {
    res.render('index', { title: 'mechanik', content: 'mechanik content' });
  });

  app.get('/async', logRequest, (req, res) => {
    domain.unreliableAsyncFunction().then(results => {
      log.verbose('Unreliable domain method done.', results);
      res.json(results);
    }).catch(err => {
      log.error('Error executing unreliable domain method.', err);
      middleware.returnServerError(res, err);
    });
  });

  // serve favicons & static files
  app.use('/favicon.ico', express.static(path.join(STATIC_ROOT, 'images/favicon.ico')));
  app.use('/apple-touch-icon.png', express.static(path.join(STATIC_ROOT, 'images/apple-touch-icon.png')));
  app.use('/favicon-32x32.png', express.static(path.join(STATIC_ROOT, 'images/favicon-32x32.png')));
  app.use('/favicon-16x16.png', express.static(path.join(STATIC_ROOT, 'images/favicon-16x16.png')));
  app.use('/static', express.static(STATIC_ROOT));

  // if none of the above, 404
  app.use(logRequest, (req, res) => middleware.returnNotFound(res, null, req));
}

/**
 * Worker message received event handler.
 */
function onWorkerMessage(worker, message, handle) {
  // log.verbose('Received IPC message from worker.', { pid: worker.process.pid, message, handle });
  if (message.type === enums.Message.Type.Log) {
    log.raw(message.payload.component, message.payload.level, message.payload.message, message.payload.object);
  } else {
    log.warn('Received strange message from worker, revolution might be underway.', {pid: worker.process.pid, worker, message, handle});
  }
}

/**
 * Worker online event handler.
 */
function onWorkerOnline(worker) {
  log.info(`Worker ${worker.process.pid} went online.`);
}

/**
 * Worker death event handler.
 */
function onWorkerDeath(worker, code, signal) {
  log.warn(`Worker ${worker.process.pid} died with ${signal}. Respawning...`);
  cluster.fork();
}

/**
 * Redirects client to HTTPS version of requested URL.
 */
function forceHttps(req, res, next) {
  if (req.secure) {
    next();
  } else {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  }
}

/**
 * Log HTTP request details middleware.
 */
function logRequest(req, res, next) {
  log.telemetry('Request received.', {
    path: req.path,
    method: req.method === 'GET' ? undefined : req.method,
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    body: req.body,
    ip: req.ip
  });
  next();
}

// https://nodejs.org/api/process.html
process.on('uncaughtException', e => {
  log.error('Uncaught exception.', e);
});

// https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled rejection.', { reason, promise });
});

process.on('exit', () => {
  log.fatal('Process is exiting, goodbye.');
});

process.on('SIGINT', () => {
  log.warn('Got SIGINT. Exiting...');
  process.exit();
});
