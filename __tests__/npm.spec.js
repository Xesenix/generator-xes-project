'use strict';

const path = require('path');
const helpers = require('yeoman-test');

const { resetPrompts } = require('../lib/generator');

const { getModulesLatestVersions } = require('./utils/utils');

const generatorPath = path.resolve('./generators/npm');

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
	});

	it('should initialize package.json', async () => {
		const result = await helpers
			.run(generatorPath)
			.withOptions({ skipInstall: false })
			.withPrompts({ npmInstall: 'yes' })
			.toPromise()
			;

		result.assertFile('package.json');
		result.assertJsonFileContent('package.json', {
			version: '0.0.0',
			devDependencies: npmModules,
		});
		result.restore();
	});
});
