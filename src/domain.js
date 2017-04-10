'use strict';

const helpers = require('./helpers');

var log = require('./logger')('Domain');

const fetchSomething = () => new Promise(resolve => {
  log.debug('Fetching something...');
  setTimeout(() => {
    log.debug('Fetched something.');
    resolve('Something.');
  }, 100);
});

const fetchSomethingUnreliably = () => new Promise((resolve, reject) => {
  log.debug('Fetching something else unreliably...');
  setTimeout(() => {
    if (helpers.maybe(80)) {
      log.debug('Fetched something else.');
      resolve('Something else.');
    } else {
      let m = 'Failed fetching something else.';
      log.error(m);
      reject(m);
    }
  }, 200);
});

async function asyncFunction() {
  log.debug('asyncFunction() called.');
  var something = await fetchSomething(); // returns Promise
  return something;
}

async function unreliableAsyncFunction() {
  log.debug('unreliableAsyncFunction() called.');
  var something = await fetchSomething(); // returns Promise
  var somethingElse = await fetchSomethingUnreliably();

  if (helpers.maybe(33)) {
    let m = 'Something terrible had occured in the asyncFunction().';
    log.error(m);
    return Promise.reject(m);
  }

  // waits for promise and uses promise result
  return something + somethingElse;
}

module.exports = {
  asyncFunction,
  unreliableAsyncFunction
};
