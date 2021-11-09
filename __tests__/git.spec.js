'use strict';

const path = require('path');
const helpers = require('yeoman-test');

const { resetPrompts, resetGeneratorComposition } = require('../lib/generator');

const { getModulesLatestVersions } = require('./utils/utils');

const generatorPath = path.resolve('./generators/git');

describe('yo xes-project:git', () => {
	let gitModules;

	beforeAll(async () => {
		gitModules = (await getModulesLatestVersions([
			'husky',
			'validate-commit-msg',
			'commitizen',
			'cz-conventional-changelog',
			'semantic-release',
			'@commitlint/config-conventional',
			'@commitlint/cli',
		]));
	});

	beforeEach(() => {
		resetPrompts();
		resetGeneratorComposition();
	});

	it('should initialize .gitignore', async () => {
		const result = await helpers
			.run(generatorPath)
			// .withOptions({ skipInstall: false })
			.withPrompts({ initGit: 'yes', initGitIgnore: 'yes', gitIgnoreContext: ['Node'] })
			.toPromise()
			;

		result.assertFile('.gitignore');
		result.assertFileContent('.gitignore', /# ===== Node =====/);
		result.restore();
	});

	it('should not initialize .gitignore', async () => {
		const result = await helpers
			.run(generatorPath)
			// .withOptions({ skipInstall: false })
			.withPrompts({ initGit: 'no', initGitIgnore: 'no' })
			.toPromise()
			;

		result.assertNoFile('.gitignore');
		result.restore();
	});

	// can't check if .gti folder is created or not
	it.skip('should initialize .git', async () => {
		const result = await helpers
			.run(generatorPath)
			.withOptions({ skipInstall: false })
			.withPrompts({ initGit: 'yes' })
			.toPromise()
			;

		await new Promise((resolve) => setTimeout(resolve, 5000));

		console.log(result);

		result.env.fs();

		result.assertFile('.git');
		result.restore();
	});

	// can't check if .gti folder is created or not
	it.skip('should not initialize .git', async () => {
		const result = await helpers
			.run(generatorPath)
			.withOptions({ skipInstall: false })
			.withPrompts({ initGit: 'no' })
			.toPromise()
			;

		result.assertNoFile('.git');
		result.restore();
	});

	it('should install dependencies', async () => {
		const result = await helpers
			.run(generatorPath)
			.withOptions({ skipInstall: false })
			.withPrompts({ initGit: 'yes', npmInstall: 'yes' })
			.toPromise()
			;

		result.assertFile('package.json');
		result.assertJsonFileContent('package.json', {
			version: '0.0.0',
			devDependencies: gitModules,
		});
		result.restore();
	});

	it('should not install dependencies', async () => {
		const result = await helpers
			.run(generatorPath)
			.withOptions({ skipInstall: false })
			.withPrompts({ initGit: 'no', npmInstall: 'no' })
			.toPromise()
			;

		result.assertNoFile('package.json');

		result.restore();
	});
});
