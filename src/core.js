'use strict';

const http = require('http'),
      https = require('https'),
      fs = require('graceful-fs'),
      express = require('express'),
      cluster = require('cluster'),
      os = require('os'),
      util = require('util');

const config = require('./config'),
      enums = require('./enums'),
      helpers = require('./helpers'),
      Logger = require('./logger');

const log = new Logger('Core'),
      numCPUs = os.cpus().length,
      portHttp = config.isDevelopment ? 3000 : 80,
      portHttps = 443,
      keepAlive = 300000; // 5 minutes

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('message', onWorkerMessage);
  cluster.on('online', onWorkerOnline)
  cluster.on('exit', onWorkerExit);
} else {
  var app = express();

  if (config.isDevelopment) {
    // nice tidy JSON output, for better readability in dev
    app.set('json spaces', 2);
    // disable jade(pug) minification
    app.locals.pretty = true;
  } else {
    app.use(forceHttps);
  }
  // isn't this a neat little path trick?
  app.use('/static', express.static(__dirname + '/../static/'));

  const httpServer = http.createServer(app);
  httpServer.on('connection', socket => socket.setTimeout(keepAlive));
  httpServer.listen(portHttp);

  if (!config.isDevelopment) {
    const httpsServer = https.createServer({
        cert: fs.readFileSync(config.SERVER.certificate_path),
        key: fs.readFileSync(config.SERVER.certificate_key_path)
      }, app);
    httpsServer.on('connection', socket => socket.setTimeout(keepAlive));
    httpsServer.listen(portHttps);  
  }

  app.get('/', (req, res) => {
    log.debug('Hit endpoint.');
    res.send('Hello World!')
  });
}

function onWorkerMessage(worker, message, handle) {
  //log.verbose('Received IPC message from worker.', { pid: worker.process.pid, message, handle });
  if (message.type === enums.Message.Type.Log) {
    log.raw(message.payload.component, message.payload.level, message.payload.message, message.payload.object);
  } else {
    log.warn('Received strange message from worker, revolution might be underway.', { pid: worker.process.pid, worker, message, handle });
  }
}

function onWorkerOnline(worker) {
  log.debug(`Worker ${worker.process.pid} is online.`);
}

function onWorkerExit(worker, code, signal) {
  log.warn(`Worker ${worker.process.pid} died with ${signal}. Restarting...`);
  cluster.fork();
}

function forceHttps(req, res, next) {
  if(!req.secure) {
    res.writeHead(301, { 'Location': `https://${req.headers.host}${req.url}` });
    res.end();
  } else next();
}