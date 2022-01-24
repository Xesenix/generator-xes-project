'use strict';

const { Generator } = require('../../lib/generator');
const { scriptColor, promptColor } = require('../../lib/colors');
const { answerToBoolean, unique } = require('../../lib/utils');
const { promptFormat } = require('../../lib/prompts');

module.exports = class MDLintGenerator extends Generator {
	namespace = 'MDLINT';

	async prompting() {
		this.log(`General configuration:\n`);

		let { initMDLint } = await this.prompt([
			{
				type: 'list',
				name: 'initMDLint',
				message: promptColor(`Initialize markdownlint: `),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		]);

		initMDLint = answerToBoolean(initMDLint);

		if (initMDLint) {
			await promptFormat(this);
		}

		this.props = {
			initMDLint,
		};
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
		this.config.save();
	}

	async configuring() {
		const {
			npmInstall = null,
			vsCodeSetup = null,
		} = this.config.getAll();

		if (!this.props.initMDLint) {
			return;
		}

		if (npmInstall === null) {
			this.composeWith(require.resolve('../npm'), {});
		}

		if (vsCodeSetup === null) {
			this.composeWith(require.resolve('../vscode'), {});
		}
	}

	async writing() {
		const { format = null, vsCodeSetup = false, initGit = false } = this.config.getAll();

		if (!this.props.initMDLint) {
			return;
		}

		this.log(`Setting up ${ scriptColor('.markdownlint.jsonc') }...`);
		this.fs.copyTpl(
			this.templatePath('.markdownlint.jsonc'),
			this.destinationPath('.markdownlint.jsonc'),
			format,
		);

		this.log(`Add linting scripts to ${ scriptColor('package.json') }...`);
		this.fs.extendJSON(this.destinationPath('package.json'), {
			scripts: {
				'mdlint:fix': 'markdownlint --fix **/*.md',
			},
		});

		if (vsCodeSetup) {
			this.log(`Setting up recomendations in ${ scriptColor('.vscode/extensions.json') }...`);

			this.extendJSON('.vscode/extensions.json', (extensions) => ({
				recommendations: unique([
					...(extensions.recommendations || []),
					'yzhang.markdown-all-in-one',
					'davidanson.vscode-markdownlint',
				]).sort(),
			}));
		}

		if (initGit) {
			this.log(`Setting up lint staged configuration in ${ scriptColor('.lintstagedrc') }...`);

			this.extendJSON('.lintstagedrc', (lintStagedConfig) => ({
				...lintStagedConfig,
				'*.md': 'markdownlint --fix -c .markdownlint.jsonc',
			}));
		}
	}

	async install() {
		const {
			npmInstall = false,
		} = this.config.getAll();

		if (npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			await this.addDevDependencies([
				// 'markdownlint',
				'markdownlint-cli',
			]);
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
};
