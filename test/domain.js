/* eslint-env node, mocha */

const assert = require('assert');

const domain = require('../build/domain.js');

describe('Domain', () => {
  describe('asyncFunction', () => {
    it('should fetch someting asynchronously.', done => {
      domain.asyncFunction().then(result => {
        assert.equal(result, 'Something.');
        done();
      }).catch(err => {
        console.log('Error fetching something asynchronously.', err);
      });
    });
  });
});
