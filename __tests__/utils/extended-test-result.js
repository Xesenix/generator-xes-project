const { ConfigIniParser } = require("config-ini-parser");
const hjson = require('hjson');
const assert = require('assert-plus');

module.exports = function extendResult(result) {
	result.assertJsonFileContent = function (filename, content) {
		const object = result._readFile(filename, true);

		try {
			assert.deepEqual(object, content);
		} catch (e) {
			throw new assert.AssertionError({
				...e,
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
				stackStartFunction: result.assertINIFileContent,
			});
		}
	};

	return result;
};
