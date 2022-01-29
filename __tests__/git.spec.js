'use strict';

import path from 'path';
import helpers from 'yeoman-test';

import { resetPrompts, resetGeneratorComposition } from '../dist/lib/generator.js';

import { testGitIgnore } from './shared/git.js';
import { getModulesLatestVersions, describePrompts } from './utils/utils.js';
import extendResult from './utils/extended-test-result';

const generatorPath = path.resolve('./dist/generators/git');

describe('yo xes-project:git', () => {
	let gitModules;
	let npmModules;

	beforeAll(async () => {
		gitModules = await getModulesLatestVersions([
			'husky',
			'lint-staged',
			'validate-commit-msg',
			'commitizen',
			'cz-conventional-changelog',
			'semantic-release',
			'@commitlint/config-conventional',
			'@commitlint/cli',
		]);
		npmModules = await getModulesLatestVersions([
			'cross-env',
			'mkdirp',
		]);
	});

	beforeEach(() => {
		resetPrompts();
		resetGeneratorComposition();
	});

	testGitIgnore(generatorPath, { prompts: { gitIgnoreContext: ['Node'] } });
	testGitIgnore(generatorPath, { prompts: { gitIgnoreContext: ['UnrealEngine', 'Unity'] } });

	it('should not initialize .gitignore', async () => {
		const result = extendResult(
			await helpers
				.run(generatorPath)
				.withOptions({ skipInstall: true })
				.withPrompts({ initGit: 'no', initGitIgnore: 'no' })
				.toPromise()
		);

		result.assertNoFile('.gitignore');
		result.restore();
	}, 300000);

	describePrompts({ initGit: 'yes' }, (prompts) => {
		it('should initialize .git', async () => {
			const result = extendResult(
				await helpers
					.run(generatorPath)
					.withOptions({ skipInstall: true })
					.withPrompts(prompts)
					.toPromise()
			);

			result.assertPathExists('.git');
			result.restore();
		}, 300000);
	});


	describePrompts({ initGit: 'no' }, (prompts) => {
		it('should not initialize .git', async () => {
			const result = extendResult(
				await helpers
					.run(generatorPath)
					.withOptions({ skipInstall: true })
					.withPrompts(prompts)
					.toPromise()
			);

			result.assertPathDoesNotExists('.git');
			result.restore();
		}, 300000);
	});

	describePrompts({ initGit: 'yes', npmInstall: 'yes' }, (prompts) => {
		it('should install dependencies', async () => {
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
				devDependencies: {
					...gitModules,
					...npmModules,
				}
			});
			result.restore();
		}, 300000);
	});

	describePrompts({ initGit: 'no', npmInstall: 'no' }, (prompts) => {
		it('should not install dependencies', async () => {
			const result = extendResult(
				await helpers
					.run(generatorPath)
					.withOptions({ skipInstall: false })
					.withPrompts(prompts)
					.toPromise()
			);

			result.assertNoFile('package.json');

			result.restore();
		}, 300000);
	});
});
