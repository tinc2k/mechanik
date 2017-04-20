'use strict';

const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const config = require('./config')(process.env.NODE_ENV);
const log = require('./logger')('Cache');

const options = {
  host: config.REDIS.host,
  port: config.REDIS.port
};
const client = redis.createClient(options);

log.debug('Starting Redis connection with options', options);

client.on('ready', () => {
  log.info('Ready.');
});

client.on('connect', () => {
  log.debug('Connected to Redis.');
});

client.on('reconnecting', () => {
  log.debug('Reconnecting to Redis...');
});

client.on('error', err => {
  log.error('Redis client error.', err);
});

client.on('end', () => {
  log.warn('Redis connection closed.');
});


// keys and expirations
//TODO jsdoc
function existsAsync(key) { return client.existsAsync(key); }
function delAsync(key) { return client.delAsync(key); }
function expireAsync(key, seconds) { return client.expireAsync(key, seconds); }
function pexpireAsync(key, miliseconds) { return client.pexpireAsync(key, miliseconds); }
function persistAsync(key) { return client.persistAsync(key); }
function ttlAsync(key) { return client.ttlAsync(key); }
function pttlAsync(key) { return client.pttlAsync(key); }

// strings
//TODO jsdoc
function getAsync(key) { return client.getAsync(key); }
function mgetAsync(keys) { return client.mgetAsync(keys); }
function setAsync(key, value) { return client.setAsync(key, value); }
function incrAsync(key) { return client.incrAsync(key); }
function incrbyAsync(key, value) { return client.incrbyAsync(key, value); }
function decrAsync(key) { return client.decrAsync(key); }
function decrbyAsync(key, value) { return client.decrbyAsync(key, value); }
function getsetAsync(key, value) { return client.getsetAsync(key, value); }

// lists (linked lists w/ atomic operations)
//TODO jsdoc
function lpushAsync(list, values) { return client.lpushAsync(list, values); } //variadic!
function rpushAsync(list, values) { return client.rpushAsync(list, values); } //variadic!
function lrangeAsync(list, first, last) { return client.lrangeAsync(list, first, last); }
function ltrimAsync(list, first, last) { return client.ltrimAsync(list, first, last); }
function rtrimAsync(list, first, last) { return client.rtrimAsync(list, first, last); }
function lpopAsync(list) { return client.lpopAsync(list); }
function rpopAsync(list) { return client.rpopAsync(list); }
function brpopAsync(list, seconds) { return client.brpopAsync(list, seconds); }
function blpopAync(list, seconds) { return client.blpopAsync(list, seconds); }
function llenAsync(list) { return client.llenAsync(list); }

// hashes (multiple key-value pairs under same hash hey)
//TODO jsdoc
function hsetAsync(hash, key, value) { return client.hsetAsync(hash, key, value); }
function hmsetAsync(hash, array) { return client.hmsetAsync(hash, array); }
function hgetAsync(hash, key) { return client.hgetAsync(hash, key); }
function hmgetAsync(hash) { return client.hmgetAsync(hash); }

// sets (setunordered collection of strings)
//TODO jsdoc
function saddAsync(set, values) { return client.saddAsync(set, values); }
function smembersAsync(set) { return client.smembersAsync(set); }
function sismemberAsync(set, value) { return client.sismemberAsync(set, value); }
function sinterAsync(keys) { return client.sinterAsync(keys); } //intersection values
// TODO spop, sunionstore, scard, srandmember

// sorted sets
//TODO jsdoc
function zaddAsync(set, scoreValues) { return client.zaddAsync(set, scoreValues); } //variadic!
function zrangeAsync(set, first, last, withscores) { return client.zrangeAsync(set, first, last, withscores); }
function zrevrangeAsync(set, first, last, withscores) { return client.zrevrangeAsync(set, first, last, withscores); }
// TODO zrangebyscore, zremrangebyscore, zrevrank, zrangebylex, zrevrangebylex, zremrangebylex, zlexcount

// bitmaps
// TODO setbit, getbit, bitop, bitcount, bitpos...



/**
 * Get deserialized object from cache.
 * @param {String} Key.
 * @returns {Promise} Deserialized object.
 */
function getJsonAsync(key) {
  return new Promise((resolve, reject) => {
    //_logger.debug(`Fetching JSON from key-value pair '${key}' from cache.`);
    return getAsync(key).then(obj => {
      if (obj) {
        log.debug(`Fetched JSON '${key}' from cache.`);
        try {
          obj = JSON.parse(obj);
          resolve(obj);
        } catch (err) {
          log.error('Error parsing JSON object from cache.', err);
          reject(err);
        }
      } else {
        resolve(null);
      }
    }); 
  });
}


/**
 * Writes object as JSON into cache, to expire in specified time.
 * Note: for more on transactions, check out https://redis.io/topics/transactions.
 * @param {string} key Cache key.
 * @param {object} obj Object to be stored.
 * @param {number} seconds Time to live in seconds.
 * @returns {Promise} Set object.
 */
function setJsonAsync(key, obj, seconds) {
  return new Promise((resolve, reject) => {
    let cerealized = JSON.stringify(obj);
    client.multi()
      .set(key, cerealized)
      .expire(key, seconds)
      .exec((err, replies) => {
        if (err) {
          log.error('Error setting JSON to cache', { err, key, obj, seconds });
          reject(err);
          return;
        }
        resolve(replies);
      });
  });
}


module.exports = {
  getJsonAsync,
  setJsonAsync,
  existsAsync,
  delAsync,
  expireAsync,
  pexpireAsync,
  persistAsync,
  ttlAsync,
  pttlAsync,
  getAsync,
  mgetAsync,
  setAsync,
  incrAsync,
  incrbyAsync,
  decrAsync,
  decrbyAsync,
  getsetAsync,
  lpushAsync,
  rpushAsync,
  lrangeAsync,
  ltrimAsync,
  rtrimAsync,
  lpopAsync,
  rpopAsync,
  brpopAsync,
  blpopAync,
  llenAsync,
  hsetAsync,
  hmsetAsync,
  hgetAsync,
  hmgetAsync,
  saddAsync,
  smembersAsync,
  sismemberAsync,
  sinterAsync,
  zaddAsync,
  zrangeAsync,
  zrevrangeAsync
};
