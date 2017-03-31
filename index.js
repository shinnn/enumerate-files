/*!
 * enumerate-files | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/enumerate-files
*/
'use strict';

const lstatDir = require('lstat-dir');

function filterFiles(map) {
  const filePaths = new Set();

  for (const [path, stat] of map) {
    if (stat.isFile()) {
      filePaths.add(path);
    }
  }

  return filePaths;
}

module.exports = function enumerateFiles(...args) {
  return lstatDir(...args).then(filterFiles);
};
