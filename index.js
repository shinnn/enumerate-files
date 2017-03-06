/*!
 * enumerate-files | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/enumerate-files
*/
'use strict';

var ES6Set = require('es6-set');
var lstatDir = require('lstat-dir');
var toArray = require('lodash').toArray;

function filterFiles(map) {
  var filePaths = new ES6Set();

  toArray(map).forEach(function(pathStatPair) {
    if (pathStatPair[1].isFile()) {
      filePaths.add(pathStatPair[0]);
    }
  });

  return filePaths;
}

module.exports = function enumerateFiles(dir) {
  return lstatDir(dir).then(filterFiles);
};
