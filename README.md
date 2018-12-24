# enumerate-files

[![npm version](https://img.shields.io/npm/v/enumerate-files.svg)](https://www.npmjs.com/package/enumerate-files)
[![Build Status](https://travis-ci.com/shinnn/enumerate-files.svg?branch=master)](https://travis-ci.com/shinnn/enumerate-files)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/enumerate-files.svg)](https://coveralls.io/github/shinnn/enumerate-files?branch=master)

A [Node.js](https://nodejs.org/) module to list all files in a given directory

```javascript
const enumerateFiles = require('enumerate-files');

(async () => {
  const files = await enumerateFiles('./node_modules/enumerate-files/');
  /* Set {
    '/Users/example/node_modules/LICENSE',
    '/Users/example/node_modules/README.md',
    '/Users/example/node_modules/index.js',
    '/Users/example/node_modules/package.json'
  } */
})();
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install enumerate-files
```

## API

```javascript
const enumerateFiles = require('enumerate-files');
```

### enumerateFiles(*dir* [, *options*])

*dir*: `string` `Buffer` `Uint8Array` `URL` (directory path)  
*options*: `Object`  
Return: `Promise<Set<string|Buffer>>`

The returned promise is fulfilled with a [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set) of `string`s or `Buffer`s — absolute paths of all *files* included in a given directory. Symbolic links and directories are excluded.

Every options except for `withFileTypes` are directly passed to the underlying [`readdir-sorted`](https://github.com/shinnn/readdir-sorted#readdirsortedpath--options).

```javascript
(async () => {
  const iterator = (await enumerateFiles('/dir')).values();

  iterator.next().value; //=> '/dir/10.js'
  iterator.next().value; //=> '/dir/2a.js'
  iterator.next().value; //=> '/dir/2A.js'
})();

(async () => {
  const iterator = (await enumerateFiles('/dir', {
    numeric: true,
    caseFirst: 'upper',
    encoding: 'buffer'
  })).values();

  iterator.next().value; //=> Buffer.from('/dir/2A.js')
  iterator.next().value; //=> Buffer.from('/dir/2a.js')
  iterator.next().value; //=> Buffer.from('/dir/10.js')
})();
```

## License

[ISC License](./LICENSE) © 2017 - 2018 Shinnosuke Watanabe
