'use strict';

const {inspect, promisify} = require('util');
const {join} = require('path');
const {realpath} = require('fs');

const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');
const readdirSorted = require('readdir-sorted');

const ENCODING_ERR = 'Expected `encoding` option to be a <string> of Node.js encoding';
const UTF8 = Symbol('utf8');
const promisifiedRealpath = promisify(realpath);
const utf8EncodingRe = /utf-?8/ui;

module.exports = async function enumerateFiles(...args) {
	const argLen = args.length;
	const [path, options = {}] = args;

	if (argLen !== 1 && argLen !== 2) {
		return readdirSorted(...args);
	}

	const {encoding = 'utf8', withFileTypes} = options;

	if (argLen === 2) {
		if (!isPlainObj(options)) {
			const error = new TypeError(`Expected a plain <Object> to set readdir-sorted options, but got ${
				inspectWithKind(options)
			}.`);
			error.code = 'ERR_INVALID_ARG_TYPE';

			throw error;
		}

		if (encoding !== undefined && encoding !== null) {
			if (typeof encoding !== 'string') {
				const error = new TypeError(`${ENCODING_ERR}, but got a non-string value ${
					inspectWithKind(encoding)
				}.`);
				error.code = 'ERR_INVALID_OPT_VALUE_ENCODING';

				throw error;
			}

			if (!Buffer.isEncoding(encoding) && encoding !== 'buffer') {
				const error = new TypeError(`${ENCODING_ERR}, but got an unknown encoding ${
					inspect(encoding)
				}.`);
				error.code = 'ERR_UNKNOWN_ENCODING';

				throw error;
			}
		}

		if (withFileTypes !== undefined) {
			const error = new Error(`\`withFileTypes\` option is not supported, but a value ${
				inspect(withFileTypes)
			} was provided for it.`);
			error.code = 'ERR_INVALID_OPT_VALUE';

			throw error;
		}
	}

	const [dir, dirents] = await Promise.all([
		promisifiedRealpath(path),
		readdirSorted(path, {...options, withFileTypes: true, encoding: 'utf8'})
	]);
	const filePaths = new Set();
	const normalizedEncoding = !encoding || utf8EncodingRe.test(encoding) ? UTF8 : encoding;

	for (const dirent of dirents) {
		if (!dirent.isFile()) {
			continue;
		}

		const absolutePath = join(dir, dirent.name);

		if (normalizedEncoding === UTF8) {
			filePaths.add(absolutePath);
			continue;
		}

		if (normalizedEncoding === 'buffer') {
			filePaths.add(Buffer.from(absolutePath));
			continue;
		}

		filePaths.add(Buffer.from(absolutePath).toString(encoding));
	}

	return filePaths;
};
