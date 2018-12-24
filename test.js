'use strict';

const {isSet} = require('util').types;
const {join} = require('path');
const {pathToFileURL} = require('url');

const enumerateFiles = require('.');
const test = require('tape');

test('enumerateFiles()', async t => {
	const files = await enumerateFiles(__dirname);

	t.ok(isSet(files), 'should be fulfilled with a Set instance.');

	files.delete(join(__dirname, '.DS_Store'));
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
	].map(path => join(__dirname, path)), 'should list files in a directory.');

	t.equal(
		[...await enumerateFiles(__dirname, {encoding: 'base64'})].reverse()[0],
		Buffer.from(join(__dirname, 'test.js')).toString('base64'),
		'should encode results with a given `encoding` option.'
	);

	t.ok(
		Buffer.isBuffer((await enumerateFiles(__dirname, {encoding: 'buffer'})).values().next().value),
		'should be resolved with buffers when `encoding` options \'buffer\'.'
	);

	const fail = t.fail.bind(t, 'Unexpectedly succeeded.');

	try {
		await enumerateFiles(Buffer.from('not-found'), {encoding: null});
		fail();
	} catch ({code}) {
		t.equal(code, 'ENOENT', 'should fail when it cannot find the directory.');
	}

	try {
		await enumerateFiles(pathToFileURL(__filename));
		fail();
	} catch ({code}) {
		t.equal(code, 'ENOTDIR', 'should fail when it the target is not a directory.');
	}

	t.end();
});

test('Argument validation', async t => {
	const fail = t.fail.bind(t, 'Unexpectedly succeeded.');

	try {
		await enumerateFiles([0, 1]);
		fail();
	} catch ({code}) {
		t.equal(code, 'ERR_INVALID_ARG_TYPE', 'should fail when it takes an invalid path type.');
	}

	try {
		await enumerateFiles(__dirname, new Int32Array());
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected a plain <Object> to set readdir-sorted options, but got Int32Array [].',
			'should fail when it takes a non-plain object options.'
		);
	}

	try {
		await enumerateFiles(__dirname, {encoding: -0});
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected `encoding` option to be a <string> of Node.js encoding, but got a non-string value -0 (number).',
			'should fail when `encoding` option is not a string.'
		);
	}

	try {
		await enumerateFiles(__dirname, {encoding: 'buFfer'});
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected `encoding` option to be a <string> of Node.js encoding, but got an unknown encoding \'buFfer\'.',
			'should fail when `encoding` option is an invalid encoding.'
		);
	}

	try {
		await enumerateFiles(__dirname, {withFileTypes: false});
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'Error: `withFileTypes` option is not supported, but a value false was provided for it.',
			'should fail when it takes `withFileTypes` option.'
		);
	}

	try {
		await enumerateFiles(__dirname, {caseFirst: /^/u});
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected `caseFirst` option to be one of \'upper\', \'lower\', or \'false\', but got /^/u (regexp).',
			'should fail when it takes an invalid String#localeCompare() option.'
		);
	}

	try {
		await enumerateFiles();
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got no arguments.',
			'should fail when it takes no arguments.'
		);
	}

	try {
		await enumerateFiles('a', {}, 'b');
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got 3 arguments.',
			'should fail when it takes too many arguments.'
		);
	}

	t.end();
});
