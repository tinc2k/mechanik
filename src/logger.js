'use strict';

const winston = require('winston');
const cluster = require('cluster');

const enums = require('./enums');

const LEVELS = { fatal: 0, error: 1, warn: 2, info: 3, debug: 4, verbose: 5, telemetry: 6 };
const COLORS = { fatal: 'red', error: 'red', warn: 'yellow', info: 'gray', debug: 'green', verbose: 'blue', telemetry: 'cyan' };
const FIVE_MEGS = 5242880;

var _logger = null;

if (cluster.isMaster) {
  _logger = new (winston.Logger)({
    level: 'telemetry',
    levels: LEVELS,
    transports: [
      new (winston.transports.Console)({
        timestamp: true,
        colorize: true,
        prettyPrint: true,
        humanReadableUnhandledException: true
      }),
      new (winston.transports.File)({
        maxsize: FIVE_MEGS,
        filename: 'logs/api.log',
        maxFiles: 10
      })
    ],
    colors: COLORS
  });

  _logger.on('error', e => {
    console.log('ERROR Something bad happened to logging.');
    console.log(e);
  });
}


function Logger(componentName) {
  if (this instanceof Logger) {
    this.componentName = componentName;
  } else {
    return new Logger(componentName);
  }
}

Logger.prototype.telemetry = function(message, object) {
  raw(this.componentName, 'telemetry', message, object);
};

Logger.prototype.verbose = function(message, object) {
  raw(this.componentName, 'verbose', message, object);
};

Logger.prototype.debug = function(message, object) {
  raw(this.componentName, 'debug', message, object);
};

Logger.prototype.info = function(message, object) {
  raw(this.componentName, 'info', message, object);
};

Logger.prototype.warn = function(message, object) {
  raw(this.componentName, 'warn', message, object);
};

Logger.prototype.error = function(message, object) {
  raw(this.componentName, 'error', message, object);
};

Logger.prototype.fatal = function(message, object) {
  raw(this.componentName, 'fatal', message, object);
};

Logger.prototype.raw = raw;

function raw(component, level, message, object) {
  // if master, use _logger's transports directly
  if (cluster.isMaster) {
    switch(level) {
      case 'telemetry':
        return _logger.telemetry(`[${component}] ${message}`, object ? object : null);
      case 'verbose':
        return _logger.verbose(`[${component}] ${message}`, object ? object : null);
      case 'debug':
        return _logger.debug(`[${component}] ${message}`, object ? object : null);
      case 'info':
        return _logger.info(`[${component}] ${message}`, object ? object : null);
      case 'warn':
        return _logger.warn(`[${component}] ${message}`, object ? object : null);
      case 'error':
        return _logger.error(`[${component}] ${message}`, object ? object : null);
      case 'fatal':
        return _logger.fatal(`[${component}] ${message}`, object ? object : null);
      default:
        return _logger.debug(`[${component}] ${message}`, object ? object : null);
    }
  }

  // if worker, send as inter-process message to master
  process.send({
    type: enums.Message.Type.Log,
    payload: { component: component, level: level, message: message, object: object }
  });
}

module.exports = Logger;
