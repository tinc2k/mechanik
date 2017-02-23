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
const config = require('./config');

const log = require('./logger')('Core');

const CPU_COUNT = os.cpus().length;
const PORT_HTTP = config.isDevelopment ? 3000 : 80;
const PORT_HTTPS = 443;
const KEEP_ALIVE = 300000; // 5 minutes
const JSON_LIMIT = '1mb'; // default '100kb'

// fake domain logic component
const domain = require('./domain');

if (config.Server.cluster && cluster.isMaster) {
  log.info(`Cluster mode enabled, spawning ${CPU_COUNT} workers.`);
  for (let i = 0; i < CPU_COUNT; i++) {
    cluster.fork();
  }
  cluster.on('message', onWorkerMessage);
  cluster.on('online', onWorkerOnline);
  cluster.on('exit', onWorkerExit);
} else {
  var app = express();
  app.use(parser.urlencoded({extended: true}));
  app.use(parser.json({limit: JSON_LIMIT}));
  app.set('view engine', 'pug');

  if (config.isDevelopment) {
    // nice tidy JSON output, for better readability in dev
    app.set('json spaces', 2);
    // disable jade(pug) minification
    app.locals.pretty = true;
  }

  const httpServer = http.createServer(app);
  httpServer.on('connection', socket => socket.setTimeout(KEEP_ALIVE));
  httpServer.listen(PORT_HTTP);

  if (config.Server.force_https) {
    log.debug('Enforcing secure connections.');
    const httpsServer = https.createServer({
      cert: fs.readFileSync(config.Server.certificate_path),
      key: fs.readFileSync(config.Server.certificate_key_path)
    }, app);
    httpsServer.on('connection', socket => socket.setTimeout(KEEP_ALIVE));
    httpsServer.listen(PORT_HTTPS);
    app.use(forceHttps);
  }


  app.get('/', logRequest, (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!' });
  });

  app.get('/async', logRequest, (req, res) => {
    domain.asyncFunction().then(results => {
      log.debug('Finished executing domain logic.', results);
      res.send(results);
    }).catch(err => {
      // TODO add various special scenarios to return different HTTP status codes and/or messages
      log.error('Oh no!', err);
      returnServerError(res, err);
    });
  });

  /**
   * FAVICONS
   * https://github.com/audreyr/favicon-cheat-sheet
   */
  app.use('/favicon.ico', express.static(path.join(__dirname, '../static/images/favicon.ico')));
  app.use('/apple-touch-icon.png', express.static(path.join(__dirname, '../static/images/apple-touch-icon.png')));
  app.use('/favicon-32x32.png', express.static(path.join(__dirname, '../static/images/favicon-32x32.png')));
  app.use('/favicon-16x16.png', express.static(path.join(__dirname, '../static/images/favicon-16x16.png')));

  app.use(express.static(path.join(__dirname, '../static/')));

  app.use(logRequest, (req, res) => {
    returnNotFound(res);
  });
}

function onWorkerMessage(worker, message, handle) {
  // log.verbose('Received IPC message from worker.', { pid: worker.process.pid, message, handle });
  if (message.type === enums.Message.Type.Log) {
    log.raw(message.payload.component, message.payload.level, message.payload.message, message.payload.object);
  } else {
    log.warn('Received strange message from worker, revolution might be underway.', {pid: worker.process.pid, worker, message, handle});
  }
}

function onWorkerOnline(worker) {
  log.info(`Worker ${worker.process.pid} is online.`);
}

function onWorkerExit(worker, code, signal) {
  log.warn(`Worker ${worker.process.pid} died with ${signal}. Restarting...`);
  cluster.fork();
}

function forceHttps(req, res, next) {
  if (req.secure) {
    next();
  } else {
    res.writeHead(301, {Location: `https://${req.headers.host}${req.url}`});
    res.end();
  }
}

function returnBadRequest(res, message) {
  res.status(400).send(message ? message : 'Bad request.\n');
  log.warn('Returned 400 Bad Request.', message);
}

function returnUnauthorized(res, message) {
  res.status(401).send(message ? message : 'Unauthorized.\n');
  log.warn('Returned 401 Unauthorized.', message);
}

function returnNotFound(res, message) {
  res.status(404).send(message ? message : 'Not found.\n');
  log.warn('Returned 404 Not Found.', message);
}

function returnTooLarge(res, message) {
  res.status(413).send(message ? message : 'Payload too large.\n');
  log.warn('Returned 413 Payload Too Large.', message);
}

function returnNotImplemented(res, message) {
  res.status(501).send(message ? message : 'Not implemented.\n');
  log.warn('Returned 501 Not Implemented.', message);
}

function returnServerError(res, message) {
  res.status(500).send(message ? message : 'Server error.\n');
  log.warn('Returned 500 Server Error.', message);
}

function returnServerConflict(res, message) {
  res.status(409).send(message ? message : 'Server conflict.\n');
  log.warn('Returned 409 Server Conflict.', message);
}

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

// TODO https://nodejs.org/api/process.html
process.on('uncaughtException', e => {
  log.error('Uncaught exception.', e);
});

process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled rejection.', {reason, promise});
});

process.on('exit', () => {
  log.fatal('Process is exiting, goodbye.');
});

// Catch Ctrl+C
process.on('SIGINT', () => {
  log.warn('Got SIGINT. Exiting...');
  process.exit();
});
