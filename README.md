# enumerate-files

[![npm version](https://img.shields.io/npm/v/enumerate-files.svg)](https://www.npmjs.com/package/enumerate-files)
[![Build Status](https://travis-ci.org/shinnn/enumerate-files.svg?branch=master)](https://travis-ci.org/shinnn/enumerate-files)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/enumerate-files.svg)](https://coveralls.io/github/shinnn/enumerate-files?branch=master)

List all files in a given directory

```javascript
const enumerateFiles = require('enumerate-files');

enumerateFiles('./node_modules/enumerate-files/').then(files => {
  files;
  /* Set {
    '/Users/example/node_modules/LICENSE',
    '/Users/example/node_modules/README.md',
    '/Users/example/node_modules/index.js',
    '/Users/example/node_modules/package.json'
  } */
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install enumerate-files
```

## API

```javascript
const enumerateFiles = require('enumerate-files');
```

### enumerateFiles(*dir* [, *options*])

*dir*: `String` (directory path)  
*options*: `Object`  
Return: `Promise<Set>`

The promise will be fulfilled with a [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set) of strings — absolute paths of all *files* included in a given directory. Symbolic links and directories are excluded.

Options are directly passed to the underlying [`readdir-sorted`](https://github.com/shinnn/readdir-sorted#readdirsortedpath--options) to control the order of results.

```javascript
enumerateFiles('/dir').then(files => {
  const iterator = files.keys();

  iterator.next().value; //=> '/dir/10.js'
  iterator.next().value; //=> '/dir/2a.js'
  iterator.next().value; //=> '/dir/2A.js'
});

enumerateFiles('/dir', {
  numeric: true,
  caseFirst: 'upper'
}).then(files => {
  const iterator = files.keys();

  iterator.next().value; //=> '/dir/2A.js'
  iterator.next().value; //=> '/dir/2a.js'
  iterator.next().value; //=> '/dir/10.js'
});
```

## License

[ISC License](./LICENSE) © 2017 Shinnosuke Watanabe
