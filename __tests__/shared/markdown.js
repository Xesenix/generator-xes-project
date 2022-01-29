import helpers from 'yeoman-test';

import markdownLintConfigFactory from '../fixture/markdownlint-config.js';
import extendResult from '../utils/extended-test-result';
import { describePrompts } from '../utils/utils';

import { formatOptions } from './format.js';

export const testMarkdownLintConfig = (generatorPath, { expect: { markdownLintConfigGenerated }, prompts = {}, options = {} }) => {
	describePrompts(prompts, () => {
		if (markdownLintConfigGenerated) {
			describe.each(formatOptions)('when format: %s, %s, %s', (indentStyle, indentSize, quote) => {
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
