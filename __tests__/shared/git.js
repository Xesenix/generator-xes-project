import helpers from 'yeoman-test';

import { describePrompts } from '../utils/utils';

export function testGitIgnore(generatorPath, { prompts }) {
	prompts = { initGit: 'yes', initGitIgnore: 'yes', ...prompts };
	describePrompts(prompts, () => {
		it(`should initialize .gitignore with ${prompts.gitIgnoreContext.join(', ')}`, async () => {
			const result = await helpers
				.run(generatorPath)
				.withOptions({ skipInstall: true })
				.withPrompts({ initGit: 'yes', initGitIgnore: 'yes', ...prompts })
				.toPromise()
				;

			result.assertFile('.gitignore');
			prompts.gitIgnoreContext.forEach((context) => {
				result.assertFileContent('.gitignore', new RegExp(`# ===== ${context} =====`, 'g'));
			});
			result.restore();
		}, 300000);
	});
}
