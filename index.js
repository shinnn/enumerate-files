/*!
 * enumerate-files | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/enumerate-files
*/
'use strict';

const lstatDir = require('lstat-dir');

function filterFiles(map) {
  const filePaths = new Set();

  for (const pathStatPair of map) {
    if (pathStatPair[1].isFile()) {
      filePaths.add(pathStatPair[0]);
    }
  }

  return filePaths;
}

module.exports = function enumerateFiles(dir) {
  return lstatDir(dir).then(filterFiles);
};
