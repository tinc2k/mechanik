/* eslint-env node, mocha */

const assert = require('assert');

const helpers = require('../build/helpers.js');

const HUGE = 99999999999999999999999999999999999999999999999999999999999;


describe('Helpers', () => {
  describe('validators', () => {
    it('should correctly validate strings.', () => {
      assert.equal(helpers.validateString(undefined), false);
      assert.equal(helpers.validateString(null), false);
      assert.equal(helpers.validateString(null, false), true);
      assert.equal(helpers.validateString(0), false);
      assert.equal(helpers.validateString(-1), false);
      assert.equal(helpers.validateString(42.17), false);
      assert.equal(helpers.validateString({}), false);
      assert.equal(helpers.validateString({value: 42}), false);
      assert.equal(helpers.validateString([]), false);
      assert.equal(helpers.validateString(''), false);
      assert.equal(helpers.validateString(' '), false);
      assert.equal(helpers.validateString('      '), false);
      assert.equal(helpers.validateString('test\n\ttest'), true);
      assert.equal(helpers.validateString('test'), true);
      assert.equal(helpers.validateString(' test '), true);
      assert.equal(helpers.validateString('ᶆ@ᶊᶊ1▼Έ Ćü©üṃḇéᴙ$ 🥒'), true);
    });
    it('should correctly validate integers.', () => {
      assert.equal(helpers.validateInt(undefined), false);
      assert.equal(helpers.validateInt(null), false);
      assert.equal(helpers.validateInt(1), true);
      assert.equal(helpers.validateInt(0), true);
      assert.equal(helpers.validateInt(0, true, false), false);
      assert.equal(helpers.validateInt(-1), false);
      assert.equal(helpers.validateInt(-1, true, true, true), true);
      assert.equal(helpers.validateInt({}), false);
      assert.equal(helpers.validateInt({value: 42}), false);
      assert.equal(helpers.validateInt([]), false);
      assert.equal(helpers.validateInt(NaN), false);
      assert.equal(helpers.validateInt(Infinity), false);
      assert.equal(helpers.validateInt(.1), false);
      assert.equal(helpers.validateInt(-.1), false);
      assert.equal(helpers.validateInt('42'), false);
      assert.equal(helpers.validateInt('ᶆ@ᶊᶊ1▼Έ Ćü©üṃḇéᴙ$ 🥒'), false);
      assert.equal(helpers.validateInt(HUGE), true);
      assert.equal(helpers.validateInt(-HUGE, true, true, true), true);
    });
    it('should correctly validate floats.', () => {
      assert.equal(helpers.validateFloat(undefined), false);
      assert.equal(helpers.validateFloat(null), false);
      assert.equal(helpers.validateFloat(1), true);
      assert.equal(helpers.validateFloat(0), true);
      assert.equal(helpers.validateFloat(0, true, false), false);
      assert.equal(helpers.validateFloat(-1), false);
      assert.equal(helpers.validateFloat(-1, true, true, true), true);
      assert.equal(helpers.validateFloat({}), false);
      assert.equal(helpers.validateFloat({value: 42}), false);
      assert.equal(helpers.validateFloat([]), false);
      assert.equal(helpers.validateFloat(NaN), false);
      assert.equal(helpers.validateFloat(Infinity), false);
      assert.equal(helpers.validateFloat(.1), true);
      assert.equal(helpers.validateFloat(-.1), false);
      assert.equal(helpers.validateFloat('42'), false);
      assert.equal(helpers.validateFloat('ᶆ@ᶊᶊ1▼Έ Ćü©üṃḇéᴙ$ 🥒'), false);
      assert.equal(helpers.validateFloat(HUGE), true);
      assert.equal(helpers.validateFloat(-HUGE, true, true, true), true);
    });
  });
});
