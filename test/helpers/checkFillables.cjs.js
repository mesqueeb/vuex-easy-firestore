'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isWhat = require('is-what');

/**
 * Checks all props of an object and deletes guarded and non-fillables.
 *
 * @param {object}  obj       the target object to check
 * @param {array}   fillables an array of strings, with the props which should be allowed on returned object
 * @param {array}   guard     an array of strings, with the props which should NOT be allowed on returned object
 *
 * @returns {object} the cleaned object after deleting guard and non-fillables
 */
function checkFillables (obj) {
  var fillables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var guard = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (!isWhat.isObject(obj)) return obj;
  return Object.keys(obj).reduce(function (carry, key) {
    // check fillables
    if (fillables.length && !fillables.includes(key)) {
      return carry;
    }
    // check guard
    if (guard.includes(key)) {
      return carry;
    }
    carry[key] = obj[key];
    return carry;
  }, {});
}

exports.default = checkFillables;
