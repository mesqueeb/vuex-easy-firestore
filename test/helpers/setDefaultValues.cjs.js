'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isWhat = require('is-what');
var merge = _interopDefault(require('merge-anything'));
var findAndReplace = _interopDefault(require('find-and-replace-anything'));

function convertTimestamps(originVal, targetVal) {
  if (originVal === '%convertTimestamp%') {
    // firestore timestamps
    if (isWhat.isObject(targetVal) && isWhat.isFunction(targetVal.toDate)) {
      return targetVal.toDate();
    } // strings


    if (isWhat.isString(targetVal) && isWhat.isDate(new Date(targetVal))) {
      return new Date(targetVal);
    }
  }

  return targetVal;
}

function setDefaultValues (obj, defaultValues) {
  if (!isWhat.isObject(defaultValues)) console.error('Trying to merge target:', obj, 'onto a non-object (defaultValues):', defaultValues);
  if (!isWhat.isObject(obj)) console.error('Trying to merge a non-object:', obj, 'onto the defaultValues:', defaultValues);
  var result = merge({
    extensions: [convertTimestamps]
  }, defaultValues, obj);
  return findAndReplace(result, '%convertTimestamp%', null);
}

exports.default = setDefaultValues;
