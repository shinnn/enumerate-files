/*!
 * enumerate-files | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/enumerate-files
*/
'use strict';

const lstatDir = require('lstat-dir');

module.exports = async function enumerateFiles(...args) {
  const map = await lstatDir(...args);
  const filePaths = new Set();

  for (const [path, stat] of map) {
    if (stat.isFile()) {
      filePaths.add(path);
    }
  }

  return filePaths;
};
