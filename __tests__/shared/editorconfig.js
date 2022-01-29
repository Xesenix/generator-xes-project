import helpers from 'yeoman-test';

import extendResult from '../utils/extended-test-result';
import { describePrompts } from '../utils/utils';
import editorConfigFactory from '../fixture/editor-config.js';

import { formatOptions } from './format.js';

export const testEditorConfig = (generatorPath, { expect: { editorConfigGenerated }, prompts = {}, options = {} }) => {
	describePrompts(prompts, () => {
		if (editorConfigGenerated) {
			describe.each(formatOptions)('when format: %s, %s, %s', (indentStyle, indentSize, quote) => {
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
				const result = extendResult(
					await helpers
						.run(generatorPath)
						.withOptions({
							skipInstall: true,
							...options,
						})
						.withPrompts({
							...prompts,
						})
						.toPromise()
				);

				result.assertNoFile('.editorconfig');
				result.restore();
			}, 300000);
		}
	});
};
