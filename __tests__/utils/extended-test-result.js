import { ConfigIniParser } from 'config-ini-parser';
import hjson from 'hjson';
import assert from 'assert-plus';

/**
 *
 * @param {RunResult} result
 * @returns {void}
 */
export default function extendResult(result) {
	const originalAssertFile = result.assertFile;
	result.assertFile = function (filename) {
		try {
			originalAssertFile.apply(this, [filename]);
		} catch (e) {
			throw new assert.AssertionError({
				...e,
				message: `assertFile path: ${this.cwd}/${filename}\n${e.message}`,
				stackStartFunction: result.assertFile,
			});
		}
	};

	const originalAssertNoFile = result.assertNoFile;
	result.assertNoFile = function (filename) {
		try {
			originalAssertNoFile.apply(this, [filename]);
		} catch (e) {
			throw new assert.AssertionError({
				...e,
				message: `assertNoFile path: ${this.cwd}/${filename}\n${e.message}`,
				stackStartFunction: result.assertNoFile,
			});
		}
	};

	result.assertPathExists = function (path) {
		try {
			assert.bool(this.fs.exists(path));
		} catch (e) {
			throw new assert.AssertionError({
				...e,
				message: `assertPathExists path: ${this.cwd}/${path}\n${e.message}`,
				stackStartFunction: result.assertPathExists,
			});
		}
	};

	result.assertPathDoesNotExists = function (path) {
		try {
			assert.bool(!this.fs.exists(path));
		} catch (e) {
			throw new assert.AssertionError({
				...e,
				message: `assertPathDoesNotExists path: ${this.cwd}/${path}\n${e.message}`,
				stackStartFunction: result.assertPathDoesNotExists,
			});
		}
	};

	result.assertJsonFileContent = function (filename, content) {
		const object = result._readFile(filename, true);

		try {
			assert.deepEqual(object, content);
		} catch (e) {
			throw new assert.AssertionError({
				...e,
				message: `assertJsonFileContent path: ${this.cwd}/${filename}\n${e.message}`,
				stackStartFunction: result.assertJsonFileContent,
			});
		}
	};

	result.assertJsonCFileContent = function (filename, content) {
		const object = hjson.parse(result._readFile(filename, false));

		try {
			assert.deepEqual(object, content);
		} catch (e) {
			throw new assert.AssertionError({
				...e,
				message: `assertJsonCFileContent path: ${this.cwd}/${filename}\n${e.message}`,
				stackStartFunction: result.assertJsonCFileContent,
			});
		}
	};

	result.assertIniFileContent = function (filename, content) {
		const parser = new ConfigIniParser();
		parser.parse(result._readFile(filename));

		const object = parser.sections().reduce((data, key) => ({
			...data,
			[key]: parser.items(key).reduce((r, [k, v]) => ({ ...r, [k]: v }), {}),
		}), {});

		try {
			assert.deepEqual(object, content);
		} catch (e) {
			throw new assert.AssertionError({
				...e,
				message: `assertIniFileContent path: ${this.cwd}/${filename}\n${e.message}`,
				stackStartFunction: result.assertIniFileContent,
			});
		}
	};

	return result;
}
