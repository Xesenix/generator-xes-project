'use strict';

const axios = require('axios');

const { Generator } = require('../../lib/generator');
const { scriptColor, promptColor } = require('../../lib/colors');
const { answerToBoolean } = require('../../lib/utils');

const getGitIgnore = async function (context) {
	const gitIgnoreUrl = `https://raw.githubusercontent.com/github/gitignore/master/${ context }.gitignore`;

	this.log(`copying ${ context } gitignore from ${ gitIgnoreUrl }...\n`);

	const { data } = await axios.get(gitIgnoreUrl);

	return `# ===== ${ context } =====\n# @see(${ gitIgnoreUrl })\n\n${ data }`;
};

module.exports = class GitGenerator extends Generator {
	namespace = 'GIT';

	async prompting() {
		this.log(`General configuration:\n`);

		let { initGit } = await this.prompt([
			{
				type: 'list',
				name: 'initGit',
				message: promptColor(`Initialize git: `),
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
					message: promptColor(`Select ignore context: `),
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

	async configuring() {
		if (!this.props.initGit) {
			return;
		}

		this.composeWith(require.resolve('../npm'), {});
	}

	async writing() {
		if (this.props.initGit) {
			this.log(`Initializing git...`);
			this.spawnCommandSync('git', ['init']);
		} else {
			this.log(`Skiping initializing git...`);
		}

		if (this.props.initGitIgnore) {
			this.log(`Downloading ${ scriptColor('.gitignore') }...`);

			const ignoreContent = (await Promise.all(this.props.gitIgnoreContext.map((section) => getGitIgnore.call(this, section))))
				.join('\n');

			this.log(`Initializing ${ scriptColor('.gitignore') }...`);
			this.fs.write(
				this.destinationPath('.gitignore'),
				ignoreContent,
			);
		} else {
			this.log(`Skip ${ scriptColor('.gitignore') }...`);
		}
	}

	async install() {
		const {
			npmInstall = false,
		} = this.config.getAll();

		if (npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			this.addDevDependencies([
				'husky',
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
};
