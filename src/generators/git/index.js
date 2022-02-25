'use strict';

import axios from 'axios';

import { variableColor, scriptColor, promptColor, errortColor } from '../../lib/colors.js';
import { Generator } from '../../lib/generator.js';
import { answerToBoolean } from '../../lib/utils.js';

const getGitIgnore = async function (context) {
	const gitIgnoreUrl = `https://raw.githubusercontent.com/github/gitignore/master/${ context }.gitignore`;

	this.log(`Copying ${ variableColor(context) } ${ scriptColor('.gitignore') } from ${ variableColor(gitIgnoreUrl) }...`);

	const { data } = await axios.get(gitIgnoreUrl);

	return `# ===== ${ context } =====\n# @see(${ gitIgnoreUrl })\n\n${ data }`;
};

export default class GitGenerator extends Generator {
	namespace = 'GIT';

	async prompting() {
		this.log('General configuration:\n');

		let { initGit } = await this.prompt([
			{
				type: 'list',
				name: 'initGit',
				message: promptColor('Initialize git: '),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		]);

		initGit = answerToBoolean(initGit);

		let { initGitIgnore = 'no' } = initGit
			? await this.prompt([
				{
					type: 'list',
					name: 'initGitIgnore',
					message: promptColor(`Initialize ${ scriptColor('.gitignore') }: `),
					default: 'yes',
					choices: ['yes', 'no'],
					store: true,
				},
			])
			: {};

		initGitIgnore = answerToBoolean(initGitIgnore);

		const { gitIgnoreContext = [] } = initGitIgnore
			? await this.prompt([
				{
					type: 'checkbox',
					name: 'gitIgnoreContext',
					message: promptColor('Select ignore context: '),
					default: ['Node'],
					choices: ['Node', 'VisualStudio', 'UnrealEngine', 'Unity', 'Python', 'Android'],
					store: true,
				},
			])
			: {};

		this.props = {
			initGit,
			initGitIgnore,
			gitIgnoreContext,
		};

		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
		this.config.save();
	}

	/** setup dependencies between generators in response to user input */
	async configuring() {
		const {
			npmInstall = null,
			initGit = false,
		} = this.config.getAll();

		if (!initGit) {
			return;
		}

		if (npmInstall === null) {
			this.composeWith(require.resolve('../npm'));
		}
	}

	/** modifies files that should already exists */
	async writing() {
		const {
			initGit = false,
			initGitIgnore = false,
			gitIgnoreContext = [],
		} = this.config.getAll();

		if (initGit) {
			this.log('Initializing git...');
			this.spawnCommandSync('git', ['init']);
		} else {
			this.log('Skiping initializing git...');
		}

		if (initGitIgnore) {
			this.log(`Downloading ${ scriptColor('.gitignore') }...`);

			try {
				const ignoreContent = (await Promise.all(gitIgnoreContext.map((section) => getGitIgnore.call(this, section))))
					.join('\n');

				this.log(`Initializing ${ scriptColor('.gitignore') }...`);
				this.fs.write(
					this.destinationPath('.gitignore'),
					ignoreContent,
				);
			} catch (err) {
				this.log(`Downloading ${ errortColor('FAILED') }...`);
			}
		} else {
			this.log(`Skip ${ scriptColor('.gitignore') }...`);
		}
	}

	async install() {
		const {
			npmInstall = false,
			initGit = false,
		} = this.config.getAll();

		if (initGit && npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			await this.addDevDependencies([
				'husky',
				'lint-staged',
				'validate-commit-msg',
				'commitizen',
				'cz-conventional-changelog',
				'semantic-release',
				'@commitlint/config-conventional',
				'@commitlint/cli',
			]);
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
}
