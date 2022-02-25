'use strict';

import { Generator } from '../../lib/generator.js';
import { scriptColor, promptColor } from '../../lib/colors.js';
import { answerToBoolean } from '../../lib/utils.js';

export default class BabelGenerator extends Generator {
	namespace = 'BABEL';

	async prompting() {
		this.log('General configuration:\n');

		let { initBabel } = await this.prompt([
			{
				type: 'list',
				name: 'initBabel',
				message: promptColor('Initialize babel: '),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		]);

		initBabel = answerToBoolean(initBabel);

		this.props = {
			initBabel,
		};
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
	}

	/** setup dependencies between generators in response to user input */
	async configuring() {
		const {
			npmInstall = null,
			initBabel = false,
		} = this.config.getAll();

		if (!initBabel) {
			return;
		}

		if (npmInstall === null) {
			this.composeWith(require.resolve('../npm'), {});
		}
	}

	/** modifies files that should already exists */
	async writing() {
		const { initBabel = false } = this.config.getAll();

		if (!initBabel) {
			return;
		}

		this.log(`Setting up ${ scriptColor('.babelrc') }...`);
		this.fs.copyTpl(
			this.templatePath('.babelrc'),
			this.destinationPath('.babelrc'),
		);

		this.log(`Add babel build script to ${ scriptColor('package.json') }...`);
		this.fs.extendJSON(this.destinationPath('package.json'), {
			scripts: {
				'babel:build': 'babel -d dist src',
			},
		});
	}

	async install() {
		const {
			npmInstall = false,
			initBabel = false,
		} = this.config.getAll();

		if (initBabel && npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			await this.addDevDependencies([
				'@babel/preset-env',
			]);
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
}
