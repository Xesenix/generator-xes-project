'use strict';

const { Generator } = require('../../lib/generator');
const { scriptColor, promptColor } = require('../../lib/colors');
const { answerToBoolean } = require('../../lib/utils');
const { promptFormat } = require('../../lib/prompts');

module.exports = class TSLintGenerator extends Generator {
	namespace = 'TSLINT';

	async prompting() {
		this.log(`General configuration:\n`);

		let { initTSLint } = await this.prompt([
			{
				type: 'list',
				name: 'initTSLint',
				message: promptColor(`Initialize tslint: `),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		]);

		initTSLint = answerToBoolean(initTSLint);

		if (initTSLint) {
			await promptFormat(this);
		}

		this.props = {
			initTSLint,
		};
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
	}

	async configuring() {
		const {
			npmInstall = null,
		} = this.config.getAll();

		if (!this.props.initTSLint) {
			return;
		}

		if (npmInstall === null) {
			this.composeWith(require.resolve('../npm'));
		}
	}

	async writing() {
		const { format = null, initGit = false } = this.config.getAll();

		if (!this.props.initTSLint) {
			return;
		}

		this.log(`Setting up ${ scriptColor('tslint.json') }...`);
		this.fs.copyTpl(
			this.templatePath('tslint.json'),
			this.destinationPath('tslint.json'),
			format,
		);

		this.log(`Add lint fixing script to ${ scriptColor('package.json') }...`);
		this.fs.extendJSON(this.destinationPath('package.json'), {
			scripts: {
				'tslint:fix': 'tslint --fix src/**/*.ts',
			},
		});

		if (initGit) {
			this.log(`Setting up lint staged configuration in ${ scriptColor('.lintstagedrc') }...`);

			this.extendJSON('.lintstagedrc', (lintStagedConfig) => ({
				...lintStagedConfig,
				'*.(j|t)s': ['tslint --fix'],
			}));
		}
	}

	async install() {
		const {
			npmInstall = false,
		} = this.config.getAll();

		if (!this.props.initTSLint) {
			return;
		}

		if (npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			await this.addDevDependencies([
				'tslint',
				// 'tslint-config-prettier', // maybe not needed as prettier has bad formatting configuration
				'tslint-config-standard',
			]);
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
};
