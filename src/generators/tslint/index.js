'use strict';

import { Generator } from '../../lib/generator.js';
import { scriptColor, promptColor } from '../../lib/colors.js';
import { answerToBoolean } from '../../lib/utils.js';
import { promptFormat } from '../../lib/prompts.js';

export default class TSLintGenerator extends Generator {
	namespace = 'TSLINT';

	async prompting() {
		this.log('General configuration:\n');

		let { initTSLint } = await this.prompt([
			{
				type: 'list',
				name: 'initTSLint',
				message: promptColor('Initialize tslint: '),
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

	/** setup dependencies between generators in response to user input */
	async configuring() {
		const {
			npmInstall = null,
			initTSLint = false,
		} = this.config.getAll();

		if (!initTSLint) {
			return;
		}

		if (npmInstall === null) {
			this.composeWith(require.resolve('../npm'));
		}
	}

	/** generates files needed in other generators writing phase */
	async default() {
		const {
			format = null,
			initTSLint = false,
		} = this.config.getAll();

		if (!initTSLint) {
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
	}

	/** modifies files that should already exists */
	async writing() {
		const {
			initGit = false,
			initTSLint = false,
		} = this.config.getAll();

		if (!initTSLint) {
			return;
		}

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
			initTSLint = false,
		} = this.config.getAll();

		if (initTSLint && npmInstall) {
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
}
