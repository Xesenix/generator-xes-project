'use strict';

import { Generator } from '../../lib/generator.js';
import { scriptColor, promptColor } from '../../lib/colors.js';
import { answerToBoolean } from '../../lib/utils.js';
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

	async configuring() {
		const {
			npmInstall = null,
		} = this.config.getAll();

		if (!this.props.initESLint) {
			return;
		}

		if (npmInstall === null) {
			this.composeWith(require.resolve('../npm'));
		}

		this.log(`Setting up ${ scriptColor('eslint.json') }...`);
		this.fs.copyTpl(
			this.templatePath('eslint.json'),
			this.destinationPath('eslint.json'),
			this.props,
		);

		this.log(`Add linting fixing hook on ${ scriptColor('pre-commit') }...`);
		this.fs.extendJSON(this.destinationPath('package.json'), {
			scripts: {
				'pre-commit': 'lint:fix',
			},
		});
	}

	async writing() {
		const {
			format = null,
			initGit = false,
		} = this.config.getAll();

		if (!this.props.initESLint) {
			return;
		}

		this.log(`Setting up ${ scriptColor('eslint.json') }...`);
		this.fs.copyTpl(
			this.templatePath('eslint.json'),
			this.destinationPath('eslint.json'),
			format,
		);

		this.log(`Add lint fixing script to ${ scriptColor('package.json') }...`);
		this.fs.extendJSON(this.destinationPath('package.json'), {
			scripts: {
				'eslint:fix': 'eslint --report-unused-disable-directives --fix src/**/*.(j|t)s',
			},
		});

		if (initGit) {
			this.log(`Setting up lint staged configuration in ${ scriptColor('.lintstagedrc') }...`);

			this.extendJSON('.lintstagedrc', (lintStagedConfig) => ({
				...lintStagedConfig,
				'*.(j|t)s': ['eslint --fix'],
			}));
		}
	}

	async install() {
		const {
			npmInstall = false,
		} = this.config.getAll();

		if (!this.props.initESLint) {
			return;
		}

		if (npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			await this.addDevDependencies([
				'eslint',
			]);
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
}
