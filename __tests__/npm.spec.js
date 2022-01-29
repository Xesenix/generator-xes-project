'use strict';

import path from 'path';
import helpers from 'yeoman-test';

import { resetPrompts, resetGeneratorComposition } from '../dist/lib/generator.js';

import extendResult from './utils/extended-test-result';
import { getModulesLatestVersions, describePrompts } from './utils/utils.js';

const generatorPath = path.resolve('./dist/generators/npm');

describe('yo xes-project:npm', () => {
	let npmModules;

	beforeAll(async () => {
		npmModules = (await getModulesLatestVersions([
			'cross-env',
			'mkdirp',
		]));
	});

	beforeEach(() => {
		resetPrompts();
		resetGeneratorComposition();
	});

	describePrompts({ npmInstall: 'yes' }, (prompts) => {
		it('should initialize package.json', async () => {
			const result = extendResult(
				await helpers
					.run(generatorPath)
					.withOptions({ skipInstall: false })
					.withPrompts(prompts)
					.toPromise()
			);

			result.assertFile('package.json');
			result.assertJsonFileContent('package.json', {
				name: '',
				version: '0.0.0',
				keywords: [],
				author: '',
				license: 'ISC',
				devDependencies: npmModules,
			});
			result.restore();
		}, 300000);
	});
});
