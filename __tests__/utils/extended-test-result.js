const ini = require('ini');
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

	result.assertIniFileContent = function (filename, content) {
		const object = ini.parse(result._readFile(filename));

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
