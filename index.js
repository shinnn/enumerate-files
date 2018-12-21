'use strict';

const {join} = require('path');
const {inspect, promisify} = require('util');
const {realpath} = require('fs');

const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');
const readdirSorted = require('readdir-sorted');

const promisifiedRealpath = promisify(realpath);

module.exports = async function enumerateFiles(...args) {
	const argLen = args.length;
	const [path, options] = args;

	if (argLen !== 1 && argLen !== 2) {
		return readdirSorted(...args);
	}

	if (argLen === 2) {
		if (!isPlainObj(options)) {
			const error = new TypeError(`Expected a plain <Object> to set readdir-sorted options, but got ${
				inspectWithKind(options)
			}.`);
			error.code = 'ERR_INVALID_ARG_TYPE';

			throw error;
		}

		if (options.withFileTypes !== undefined) {
			const error = new Error(`\`withFileTypes\` option is not supported, but a value ${
				inspect(options.withFileTypes)
			} was provided for it.`);
			error.code = 'ERR_INVALID_OPT_VALUE';

			throw error;
		}
	}

	const [dir, dirents] = await Promise.all([
		promisifiedRealpath(path),
		readdirSorted(path, {...options, withFileTypes: true})
	]);
	const filePaths = new Set();

	for (const dirent of dirents) {
		if (dirent.isFile()) {
			filePaths.add(join(dir, dirent.name));
		}
	}

	return filePaths;
};
