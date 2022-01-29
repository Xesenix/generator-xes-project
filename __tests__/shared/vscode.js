import helpers from 'yeoman-test';

import vsCodeSettingsFactory from '../fixture/vscode-settings.js';
import extendResult from '../utils/extended-test-result';
import { describePrompts } from '../utils/utils';

import { formatOptions } from './format.js';

export const testVSCodeSettings = (generatorPath, { expect: { vscodeSettingsGenerated }, prompts = {}, options = {} }) => {
	describePrompts(prompts, () => {
		if (vscodeSettingsGenerated) {
			describe.each(formatOptions)('when format: %s, %s, %s', (indentStyle, indentSize, quote) => {
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
