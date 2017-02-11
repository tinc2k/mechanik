'use strict';

const helpers = require('./helpers'),
      Logger = require('./logger');

const log = new Logger('Core');


const fetchSomething = () => new Promise(resolve => {
  setTimeout(() => resolve('Something.'), 100);
});

const fetchSomethingUnreliably = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (helpers.maybe(80)) {
      resolve('Something else.');
    } else {
      reject('A bit of entropy kicked in.');
    }
  }, 200);
});

async function asyncFunction() {
  var something = await fetchSomething(); // returns promise
  var somethingElse = await fetchSomethingUnreliably();

  if(helpers.maybe(33))
    return Promise.reject('Something terrible has occured.');

  // waits for promise and uses promise result
  return something + somethingElse;
}

module.exports = {
  asyncFunction
};