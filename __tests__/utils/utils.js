const packageJson = require('package-json');

async function getModulesLatestVersions(modules) {
	return (await Promise.all(
		modules.map(async (module) => ({ [module]: (await packageJson(module)).version })),
	)).reduce((result, item) => ({ ...result, ...item }));
}

module.exports = {
	getModulesLatestVersions,
};
