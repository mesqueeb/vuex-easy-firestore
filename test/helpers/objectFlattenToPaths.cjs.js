'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isWhat = require('is-what');

function retrievePaths(object, path, result) {
  if (!isWhat.isObject(object) || !Object.keys(object).length || object.methodName === 'FieldValue.serverTimestamp') {
    if (!path) return object;
    result[path] = object;
    return result;
  }

  return Object.keys(object).reduce(function (carry, key) {
    var pathUntilNow = path ? path + '.' : '';
    var newPath = pathUntilNow + key;
    var extra = retrievePaths(object[key], newPath, result);
    return Object.assign(carry, extra);
  }, {});
}

function objectFlattenToPaths (object) {
  var result = {};
  return retrievePaths(object, null, result);
}

exports.default = objectFlattenToPaths;
