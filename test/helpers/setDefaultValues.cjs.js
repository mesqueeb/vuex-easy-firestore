'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isWhat = require('is-what');

function mergeRecursively(defaultValues, obj) {
  if (!isWhat.isObject(obj)) return obj; // define newObject to merge all values upon

  var newObject = isWhat.isObject(defaultValues) ? Object.keys(defaultValues).reduce(function (carry, key) {
    if (!Object.keys(obj).includes(key)) carry[key] = defaultValues[key];
    return carry;
  }, {}) : {};
  return Object.keys(obj).reduce(function (carry, key) {
    var newVal = obj[key];
    var targetVal = defaultValues[key]; // early return when targetVal === undefined

    if (targetVal === undefined) {
      carry[key] = newVal;
      return carry;
    } // convert to new Date() if defaultValue == '%convertTimestamp%'


    if (targetVal === '%convertTimestamp%') {
      // firestore timestamps
      if (isWhat.isObject(newVal) && isWhat.isFunction(newVal.toDate)) {
        carry[key] = newVal.toDate();
        return carry;
      } // strings


      if (isWhat.isString(newVal) && isWhat.isDate(new Date(newVal))) {
        carry[key] = new Date(newVal);
        return carry;
      }
    } // When newVal is an object do the merge recursively


    if (isWhat.isObject(newVal) && Object.keys(newVal).length) {
      carry[key] = mergeRecursively(targetVal, newVal);
      return carry;
    } // all the rest


    carry[key] = newVal;
    return carry;
  }, newObject);
}
/**
 * Sets default values on an object
 *
 * @param {object} obj on which to set the default values
 * @param {object} defaultValues the default values
 */


function setDefaultValues (obj, defaultValues) {
  if (!isWhat.isObject(defaultValues)) console.error('Trying to merge target:', obj, 'onto a non-object:', defaultValues);
  if (!isWhat.isObject(obj)) console.error('Trying to merge a non-object:', obj, 'onto:', defaultValues);
  return mergeRecursively(defaultValues, obj); // return merge(defaultValues, obj)
}

exports.default = setDefaultValues;
