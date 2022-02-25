'use strict';

import { Generator } from '../../lib/generator.js';
import { scriptColor, promptColor } from '../../lib/colors.js';
import { answerToBoolean, unique } from '../../lib/utils.js';
import { promptFormat } from '../../lib/prompts.js';

export default class ESLintGenerator extends Generator {
	namespace = 'ESLINT';

	async prompting() {
		this.log('General configuration:\n');

		let { initESLint } = await this.prompt([
			{
				type: 'list',
				name: 'initESLint',
				message: promptColor('Initialize eslint: '),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		]);

		initESLint = answerToBoolean(initESLint);

		if (initESLint) {
			await promptFormat(this);
		}

		this.props = {
			initESLint,
		};
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
		this.config.save();
	}

	/** setup dependencies between generators in response to user input */
	async configuring() {
		const {
			npmInstall = null,
			vsCodeSetup = null,
			initESLint = false,
		} = this.config.getAll();

		if (!initESLint) {
			return;
		}

		if (npmInstall === null) {
			this.composeWith(require.resolve('../npm'));
		}

		if (vsCodeSetup === null) {
			this.composeWith(require.resolve('../vscode'));
		}
	}

	/** modifies files that should already exists */
	async writing() {
		const {
			format = null,
			initGit = false,
			vsCodeSetup = false,
			initESLint = false,
		} = this.config.getAll();

		if (!initESLint) {
			return;
		}

		this.log(`Setting up ${ scriptColor('.eslintrc') }...`);
		this.fs.copyTpl(
			this.templatePath('.eslintrc'),
			this.destinationPath('.eslintrc'),
			format,
		);

		this.log(`Add lint fixing script to ${ scriptColor('package.json') }...`);
		this.fs.extendJSON(this.destinationPath('package.json'), {
			scripts: {
				'eslint:fix': 'eslint --report-unused-disable-directives --fix ./**/*.(j|t)s',
			},
		});

		if (initGit) {
			this.log(`Setting up lint staged configuration in ${ scriptColor('.lintstagedrc') }...`);

			this.extendJSON('.lintstagedrc', (lintStagedConfig) => ({
				...lintStagedConfig,
				'*.(j|t)s': ['eslint --fix'],
			}));
		}

		if (vsCodeSetup) {
			this.log(`Setting up recomendations in ${ scriptColor('.vscode/extensions.json') }...`);

			this.extendJSON('.vscode/extensions.json', (extensions) => ({
				recommendations: unique([
					...(extensions.recommendations || []),
					'dbaeumer.vscode-eslint',
				]).sort(),
			}));

			this.log(`Enabling eslint in ${ scriptColor('.vscode/settings.json') }...`);

			this.extendJSON('.vscode/settings.json', (settings) => ({
				...settings,
				'eslint.enable': true,
			}));
		}
	}

	async install() {
		const {
			npmInstall = false,
			initESLint = false,
		} = this.config.getAll();

		if (initESLint && npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			await this.addDevDependencies([
				'eslint',
				'@babel/eslint-parser',
				'eslint-plugin-editorconfig',
			]);
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
}
