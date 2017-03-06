'use strict';

const {resolve} = require('path');

const enumerateFiles = require('.');
const test = require('tape');

test('enumerateFiles()', t => {
  t.plan(5);

  enumerateFiles('.').then(files => {
    t.ok(files instanceof Set, 'should be fulfilled with a Set instance.');

    files.delete(resolve('.DS_Store'));

    t.deepEqual([...files], [
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.travis.yml',
      'LICENSE',
      'README.md',
      'index.js',
      'package.json',
      'test.js'
    ].map(path => resolve(path)), 'should list files in a directory.');
  }).catch(t.fail);

  enumerateFiles('not-found').catch(err => {
    t.strictEqual(err.code, 'ENOENT', 'should fail when it cannot find the directory.');
  });

  enumerateFiles([0, 1]).catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected a path of the directory (string), but got a non-string value [ 0, 1 ].',
      'should fail when it takes a non-string argument.'
    );
  });

  enumerateFiles().catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected a path of the directory (string), but got a non-string value undefined.',
      'should fail when it takes no arguments.'
    );
  });
});
