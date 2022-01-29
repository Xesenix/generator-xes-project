'use strict';

import { Generator } from '../../lib/generator.js';
import { scriptColor, promptColor } from '../../lib/colors.js';
import { answerToBoolean } from '../../lib/utils.js';

export default class TSGenerator extends Generator {
	namespace = 'TS';

	async prompting() {
		this.log('General configuration:\n');

		let { initTS } = await this.prompt([
			{
				type: 'list',
				name: 'initTS',
				message: promptColor('Initialize typescript: '),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		]);

		initTS = answerToBoolean(initTS);

		this.props = {
			initTS,
		};
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
	}

	async configuring() {
		const {
			npmInstall = null,
		} = this.config.getAll();

		if (!this.props.initTS) {
			return;
		}

		if (npmInstall === null) {
			this.composeWith(require.resolve('../npm'), {});
		}
	}

	async writing() {
		if (!this.props.initTS) {
			return;
		}

		this.log(`Add typescript scripts to ${ scriptColor('package.json') }...`);
		this.fs.extendJSON(this.destinationPath('package.json'), {
			scripts: {
				'tsc': 'tsc -p tsconfig.json --diagnostics --pretty',
			},
		});
	}

	async install() {
		const {
			npmInstall = false,
		} = this.config.getAll();

		if (!this.props.initTS) {
			return;
		}

		if (npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			await this.addDevDependencies([
				'@babel/core',
				'@babel/plugin-proposal-class-properties',
				'@babel/plugin-proposal-decorators',
				'@babel/plugin-transform-runtime',
				'@babel/plugin-proposal-json-strings',
				'@babel/plugin-proposal-object-rest-spread',
				'@babel/plugin-syntax-dynamic-import',
				'@babel/plugin-syntax-import-meta',
				'@babel/plugin-syntax-json-strings',
				'@babel/preset-env',
				'@babel/preset-typescript',
				'typescript',
				'ts-node',
				'babel-loader',
				'babel-plugin-import',
			]);
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
}
