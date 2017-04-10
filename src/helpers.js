'use strict';

const crypto = require('crypto');

/**
 * Returns random hex string.
 * @param {number} bytes Length in bytes.
 * @param {bool} uppercase Return string in uppercase.
 * @returns {string} Random hex string.
 */
function getRandomHex(bytes, uppercase) {
  let t = crypto.randomBytes(bytes).toString('hex');
  return uppercase ? t.toUpperCase() : t;
}

/**
 * Returns random boolean, using provided percentage as probability of result being true.
 * @param {number} percent Odds of function returning true, in percentage. 
 * @returns {bool} Random boolean value.
 */
function maybe(percent) {
  if (Math.random() < percent / 100) {
    return true;
  }
  return false;
}

/**
 * Opinionated string validation.
 * @param {bool} required Required - cannot be null, empty or just spaces.
 * @returns {bool} Validation result.
 */
function validateString(value, required = true) {
  // don't allow undefined values
  if (value === undefined) {
    return false;
  }
  if (required) {
    // don't allow null values
    if (value === null) {
      return false;
    }
    // type check: don't allow anything that's not a string
    if (typeof value !== 'string') {
      return false;
    }
    value = value.trim();
    // don't allow blank entries
    if (value === '') {
      return false;
    }
    // all checks passed
    return true;
  } else {
    // since string is not required, allow nulls or (empty) strings
    if (value === null || typeof value === 'string') {
      // all checks passed
      return true;
    }
    return false;
  }
}

/**
 * Opinionated integer validation. Fails for values <0 by default.
 * @param {bool} required Required. If set to false, function will ignore further parameters.
 * @param {bool} allowZero Allow value of 0 on required integer.
 * @param {bool} allowNegative Allow negative values on required integer.
 * @returns {bool} Validation result.
 */
function validateInt(value, required = true, allowZero = true, allowNegative = false) {
  // don't allow undefined or NaN values
  if (value === undefined || isNaN(value)) {
    return false;
  }
  // type check: don't allow anything that's not a number
  if (typeof value !== 'number') {
    return false;
  }
  // integers should be integers
  if (value % 1 !== 0) {
    return false;
  }
  if (required) {
    // if zero is not allowed, check
    if (!allowZero && value === 0) {
      return false;
    }
    // if negative numbers are not allowed, check
    if (!allowNegative && value < 0) {
      return false;
    }
  } 
  // all checks passed
  return true;
}

/**
 * Opinionated float validation. Fails for values <0 by default.
 * @param {bool} required Required. If set to false, function will ignore further parameters.
 * @param {bool} allowZero Allow value of 0 on required float.
 * @param {bool} allowNegative Allow negative values on required float.
 * @returns {bool} Validation result.
 */
function validateFloat(value, required = true, allowZero = true, allowNegative = false) {
  // don't allow undefined, NaN or Infinity values
  if (value === undefined || isNaN(value) || value === Infinity) {
    return false;
  }
  // type check: don't allow anything that's not a number
  if (typeof value !== 'number') {
    return false;
  }
  if (required) {
    // if zero is not allowed, check
    if (!allowZero && value === 0) {
      return false;
    }
    // if negative numbers are not allowed, check
    if (!allowNegative && value < 0) {
      return false;
    }
  } 
  // all checks passed
  return true;
}

module.exports = {
  getRandomHex,
  maybe,
  validateString,
  validateInt,
  validateFloat
};
