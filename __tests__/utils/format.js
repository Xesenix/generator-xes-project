/* eslint-disable jest/no-export */

const helpers = require('yeoman-test');

const extendResult = require('./extended-test-result');
const editorConfigFactory = require('../fixture/editorconfig');
const tslintConfigFactory = require('../fixture/tslintconfig');

const formatOptions = [
	['tab', '2', 'single'],
	['tab', '4', 'single'],
	['tab', '8', 'single'],
	['space', '2', 'single'],
	['space', '4', 'single'],
	['space', '8', 'single'],
	['tab', '2', 'double'],
	['tab', '4', 'double'],
	['tab', '8', 'double'],
	['space', '2', 'double'],
	['space', '4', 'double'],
	['space', '8', 'double'],
];

const testEditorConfig = (generatorPath, { prompts = {}, options = {} }) => {
	describe(`for prompts ${ JSON.stringify(prompts) }`, () => {
		describe.each(formatOptions)(`when format: %s, %s, %s`, (indentStyle, indentSize, quote) => {
			it('should initialize .editorconfig', async () => {
				const result = extendResult(
					await helpers
						.run(generatorPath)
						.withOptions({
							skipInstall: true,
							...options,
						})
						.withPrompts({
							...prompts,
							indentStyle,
							indentSize,
							quote,
						})
						.toPromise(),
				);

				if (prompts.initEditorConfig === "yes") {
					result.assertFile('.editorconfig');
					result.assertIniFileContent('.editorconfig', editorConfigFactory({
						indentStyle,
						indentSize,
						quote,
					}));
				} else {
					result.assertNoFile('.editorconfig');
				}
				result.restore();
			});
		});
	});
};

const testTSLintConfig = (generatorPath, { prompts = {}, options = {} }) => {
	describe(`for prompts ${ JSON.stringify(prompts) }`, () => {
		describe.each(formatOptions)(`when format: %s, %s, %s`, (indentStyle, indentSize, quote) => {
			it('should initialize tslint.json', async () => {
				const result = await helpers
					.run(generatorPath)
					.withOptions({
						skipInstall: true,
						...options,
					})
					.withPrompts({
						...prompts,
						indentStyle,
						indentSize,
						quote,
					})
					.toPromise()
					;

				result.assertFile('tslint.json');
				result.assertJsonFileContent('tslint.json', tslintConfigFactory({
					indentStyle,
					indentSize,
					quote,
				}));
				result.restore();
			});
		});
	});
};

module.exports = {
	formatOptions,
	testEditorConfig,
	testTSLintConfig,
};
