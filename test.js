'use strict';

const {resolve} = require('path');
const {URL} = require('url');

const enumerateFiles = require('.');
const fileUrl = require('file-url');
const test = require('tape');

test('enumerateFiles()', async t => {
	const files = await enumerateFiles('.');
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

	const fail = t.fail.bind(t, 'Unexpectedly succeeded.');

	try {
		await enumerateFiles(Buffer.from('not-found'));
		fail();
	} catch ({code}) {
		t.equal(code, 'ENOENT', 'should fail when it cannot find the directory.');
	}

	try {
		await enumerateFiles(new URL(fileUrl(__filename)));
		fail();
	} catch ({code}) {
		t.equal(code, 'ENOTDIR', 'should fail when it the target is not a directory.');
	}

	try {
		await enumerateFiles(__dirname, {caseFirst: /^/});
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected `caseFirst` option to be one of \'upper\', \'lower\', or \'false\', but got /^/ (regexp).',
			'should fail when it takes an invalid option.'
		);
	}

	try {
		await enumerateFiles([0, 1]);
		fail();
	} catch ({name}) {
		t.equal(name, 'TypeError', 'should fail when it takes a non-string argument.');
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
