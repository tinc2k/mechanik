'use strict';

function getRandomHex(bytes, uppercase) {
  let t = crypto.randomBytes(bytes).toString('hex');
  return uppercase ? t.toUpperCase() : t;
}

module.exports = {
  getRandomHex
};