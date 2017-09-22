'use strict';

const {resolve} = require('path');

const enumerateFiles = require('.');
const test = require('tape');

test('enumerateFiles()', t => {
  t.plan(7);

  enumerateFiles('.').then(files => {
    t.ok(files instanceof Set, 'should be fulfilled with a Set instance.');

    files.delete(resolve('.DS_Store'));

    t.deepEqual([...files], [
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.travis.yml',
      'index.js',
      'LICENSE',
      'package-lock.json',
      'package.json',
      'README.md',
      'test.js'
    ].map(path => resolve(path)), 'should list files in a directory.');
  }).catch(t.fail);

  enumerateFiles('not-found').catch(err => {
    t.equal(err.code, 'ENOENT', 'should fail when it cannot find the directory.');
  });

  enumerateFiles(__dirname, {caseFirst: /^/}).catch(err => {
    t.equal(
      err.toString(),
      'TypeError: Expected `caseFirst` option to be one of \'upper\', \'lower\', or \'false\', but got /^/ (regexp).',
      'should fail when it takes an invalid option.'
    );
  });

  enumerateFiles([0, 1]).catch(err => {
    t.equal(
      err.toString(),
      'TypeError: Expected a directory path (string), but got [ 0, 1 ] (array).',
      'should fail when it takes a non-string argument.'
    );
  });

  enumerateFiles().catch(err => {
    t.equal(
      err.toString(),
      'TypeError: Expected 1 or 2 arguments (path: String[, options: Object]), but got no arguments.',
      'should fail when it takes no arguments.'
    );
  });

  enumerateFiles('a', {}, 'b').catch(err => {
    t.equal(
      err.toString(),
      'TypeError: Expected 1 or 2 arguments (path: String[, options: Object]), but got 3 arguments.',
      'should fail when it takes too many arguments.'
    );
  });
});
