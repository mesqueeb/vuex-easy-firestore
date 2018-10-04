'use strict';

var isWhat = require('is-what');

/**
 * Checks all props of an object and deletes guarded and non-fillables.
 *
 * @export
 * @param {object} obj the target object to check
 * @param {string[]} [fillables=[]] an array of strings, with the props which should be allowed on returned object
 * @param {string[]} [guard=[]] an array of strings, with the props which should NOT be allowed on returned object
 * @returns {AnyObject} the cleaned object after deleting guard and non-fillables
 */
function checkFillables (obj, fillables, guard) {
    if (fillables === void 0) { fillables = []; }
    if (guard === void 0) { guard = []; }
    if (!isWhat.isObject(obj))
        return obj;
    return Object.keys(obj).reduce(function (carry, key) {
        // check fillables
        if (fillables.length && !fillables.includes(key)) {
            return carry;
        }
        // check guard
        guard.push('_conf');
        guard.push('_sync');
        if (guard.includes(key)) {
            return carry;
        }
        carry[key] = obj[key];
        return carry;
    }, {});
}

module.exports = checkFillables;
