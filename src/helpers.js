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

//TODO write tests
function validateObject(value, required = true, allowBlank = false) {
  // don't allow undefined values or Arrays
  if (value === undefined) {
    return false;
  }
  if (typeof value === 'object') {
    // don't allow arrays
    if (value && value.constructor === Array) {
      return false;
    }
    if (required) {
      // if value is required, don't allow nulls
      if (value === null) {
        return false;
      }
      // if we don't allow blank objects, check keys
      if (!allowBlank && Object.keys(value).length === 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  } else {
    // certainly not an object (or null, because typeof null === 'object')
    return false;
  }
}

//TODO write tests
function isTreeHealthy(node) {
  if (node === null || node === false) {
    //console.log('Node is null or false.', node);
    return true;
  } else if (typeof node === 'string') {
    //console.log('Node is a string.', node);
    return node.length > 0 ? false : true;
  } else if (node.constructor === Array) {
    //console.log('Node is an Array.', node);
    for (let i = 0; i < node.length; i++) {
      if (!isTreeHealthy(node[i])) {
        return false;
      }
    }
    return true;
  } else if (typeof node === 'object') {
    //console.log('Node is an object.', node);
    let keys = Object.keys(node);
    for (let i = 0; i < keys.length; i++) {
      if (!isTreeHealthy(node[keys[i]])) {
        return false;
      }
    }
    return true;
  } else {
    console.log('Node is of an unknown type.', node);
    throw new Error('Node is of an unknown type.');
  }
}

module.exports = {
  getRandomHex,
  maybe,
  validateString,
  validateInt,
  validateFloat,
  validateObject,
  isTreeHealthy
};
