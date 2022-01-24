/* eslint-disable jest/no-export */

const helpers = require('yeoman-test');

const extendResult = require('./extended-test-result');
const editorConfigFactory = require('../fixture/editor-config');
const tslintConfigFactory = require('../fixture/tslint-config');
const vsCodeSettingsFactory = require('../fixture/vscode-settings');
const markdownLintConfigFactory = require('../fixture/markdownlint-config');

const formatOptions = [
	['tab', '2', 'single'],
	['tab', '4', 'single'],
	// ['tab', '8', 'single'],
	['space', '2', 'single'],
	['space', '4', 'single'],
	// ['space', '8', 'single'],
	['tab', '2', 'double'],
	['tab', '4', 'double'],
	// ['tab', '8', 'double'],
	['space', '2', 'double'],
	['space', '4', 'double'],
	// ['space', '8', 'double'],
];

const testEditorConfig = (generatorPath, { expect: { editorConfigGenerated }, prompts = {}, options = {} }) => {
	describe(`for prompts ${ JSON.stringify(prompts) }`, () => {
		if (editorConfigGenerated) {
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

					result.assertFile('.editorconfig');
					result.assertIniFileContent('.editorconfig', editorConfigFactory({
						indentStyle,
						indentSize,
						quote,
					}));

					result.restore();
				}, 300000);
			});
		} else {
			it('should not initialize .editorconfig', async () => {
				const result =
					await helpers
						.run(generatorPath)
						.withOptions({
							skipInstall: true,
							...options,
						})
						.withPrompts({
							...prompts,
						})
						.toPromise();

				result.assertNoFile('.editorconfig');
				result.restore();
			}, 300000);
		}
	});
};

const testTSLintConfig = (generatorPath, { prompts = {}, options = {} }) => {
	describe(`for prompts ${ JSON.stringify(prompts) }`, () => {
		describe.each(formatOptions)(`when format: %s, %s, %s`, (indentStyle, indentSize, quote) => {
			it('should initialize tslint.json', async () => {
				const result = extendResult(await helpers
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

				result.assertFile('tslint.json');
				result.assertJsonFileContent('tslint.json', tslintConfigFactory({
					indentStyle,
					indentSize,
					quote,
				}));
				result.restore();
			}, 300000);
		});
	});
};

const testVSCodeSettings = (generatorPath, { expect: { vscodeSettingsGenerated }, prompts = {}, options = {} }) => {
	describe(`for prompts ${ JSON.stringify(prompts) }`, () => {
		if (vscodeSettingsGenerated) {
			describe.each(formatOptions)(`when format: %s, %s, %s`, (indentStyle, indentSize, quote) => {
				it('should initialize .vscode/settings.json', async () => {
					const result = extendResult(await helpers
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

					result.assertFile('.vscode/settings.json');
					result.assertJsonFileContent('.vscode/settings.json', vsCodeSettingsFactory({
						indentStyle,
						indentSize,
						quote,
					}));
					result.restore();
				}, 300000);
			});
		} else {
			it('should not initialize .vscode/settings.json', async () => {
				const result = await helpers
					.run(generatorPath)
					.withOptions({
						skipInstall: true,
						...options,
					})
					.withPrompts({
						...prompts,
					})
					.toPromise()
					;

				result.assertNoFile('.vscode/settings.json');
				result.restore();
			}, 300000);
		}
	});
};

const testMarkdownLintConfig = (generatorPath, { expect: { markdownLintConfigGenerated }, prompts = {}, options = {} }) => {
	describe(`for prompts ${ JSON.stringify(prompts) }`, () => {
		if (markdownLintConfigGenerated) {
			describe.each(formatOptions)(`when format: %s, %s, %s`, (indentStyle, indentSize, quote) => {
				it('should initialize .markdownlint.jsonc', async () => {
					const result = extendResult(await helpers
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

					result.assertFile('.markdownlint.jsonc');
					result.assertJsonCFileContent('.markdownlint.jsonc', markdownLintConfigFactory({
						indentStyle,
						indentSize,
						quote,
					}));
					result.restore();
				}, 300000);
			});
		} else {
			it('should not initialize .markdownlint.jsonc', async () => {
				const result = await helpers
					.run(generatorPath)
					.withOptions({
						skipInstall: true,
						...options,
					})
					.withPrompts({
						...prompts,
					})
					.toPromise()
					;

				result.assertNoFile('.markdownlint.jsonc');
				result.restore();
			}, 300000);
		}
	});
};

module.exports = {
	formatOptions,
	testEditorConfig,
	testTSLintConfig,
	testVSCodeSettings,
	testMarkdownLintConfig,
};
