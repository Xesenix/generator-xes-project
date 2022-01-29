import packageJson from 'package-json';

export async function getModulesLatestVersions(modules) {
	return (await Promise.all(
		modules.map(async (module) => ({ [module]: (await packageJson(module)).version })),
	)).reduce((result, item) => ({ ...result, ...item }));
}

export function describePrompts(prompts, callback) {
	describe(`for prompts ${JSON.stringify(prompts)}`, () => callback(prompts));
}
