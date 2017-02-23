'use strict';

const crypto = require('crypto');

function getRandomHex(bytes, uppercase) {
  let t = crypto.randomBytes(bytes).toString('hex');
  return uppercase ? t.toUpperCase() : t;
}

function maybe(percent) {
  if (Math.random() < percent / 100) {
    return true;
  }
  return false;
}

module.exports = {
  getRandomHex,
  maybe
};
