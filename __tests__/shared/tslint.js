import helpers from 'yeoman-test';

import tslintConfigFactory from '../fixture/tslint-config.js';
import extendResult from '../utils/extended-test-result';
import { describePrompts } from '../utils/utils';

import { formatOptions } from './format.js';

export const testTSLintConfig = (generatorPath, { prompts = {}, options = {} }) => {
	describePrompts(prompts, () => {
		describe.each(formatOptions)('when format: %s, %s, %s', (indentStyle, indentSize, quote) => {
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
