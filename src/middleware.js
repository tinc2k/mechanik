'use strict';

const log = require('./logger')('Middleware');


/**
 * Returns 400 Bad Request response to client.
 * @param {string} message Optional client message.
 */
function returnBadRequest(res, message) {
  res.status(400).send(message ? message : 'Bad request.');
  log.warn('Returned 400 Bad Request.', message);
}

/**
 * Returns 401 Unauthorized response to client.
 * @param {string} message Optional client message.
 */
function returnUnauthorized(res, message) {
  res.status(401).send(message ? message : 'Unauthorized.');
  log.warn('Returned 401 Unauthorized.', message);
}

/**
 * Returns 404 Not Found response to client.
 * @param {string} message Optional client message.
 */
function returnNotFound(res, message, req) {
  message = message ? message : 'Not found.';
  res.status(404).send(message);
  log.warn('Returned 404 Not Found.', { message, path: req ? req.path : undefined });
}

/**
 * Returns 413 Payload Too Large response to client.
 * @param {string} message Optional client message.
 */
function returnTooLarge(res, message) {
  res.status(413).send(message ? message : 'Payload too large.');
  log.warn('Returned 413 Payload Too Large.', message);
}

/**
 * Returns 501 Not Implemented response to client.
 * @param {string} message Optional client message.
 */
function returnNotImplemented(res, message) {
  res.status(501).send(message ? message : 'Not implemented.');
  log.warn('Returned 501 Not Implemented.', message);
}

/**
 * Returns 500 Server Error response to client.
 * @param {string} message Optional client message.
 */
function returnServerError(res, message) {
  res.status(500).send(message ? message : 'Server error.');
  log.warn('Returned 500 Server Error.', message);
}

/**
 * Returns 409 Server Conflict response to client.
 * @param {string} message Optional client message.
 */
function returnServerConflict(res, message) {
  res.status(409).send(message ? message : 'Server conflict.');
  log.warn('Returned 409 Server Conflict.', message);
}

module.exports = {
  returnBadRequest,
  returnUnauthorized,
  returnNotFound,
  returnTooLarge,
  returnNotImplemented,
  returnServerError,
  returnServerConflict
};