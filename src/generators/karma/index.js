'use strict';

import { Generator } from '../../lib/generator.js';
import { scriptColor, promptColor } from '../../lib/colors.js';
import { answerToBoolean } from '../../lib/utils.js';

export default class KarmaGenerator extends Generator {
	namespace = 'WEBPACK';

	async prompting() {
		this.log('General configuration:\n');

		let { initKarma } = await this.prompt([
			{
				type: 'list',
				name: 'initKarma',
				message: promptColor('Initialize karma: '),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		]);

		initKarma = answerToBoolean(initKarma);

		this.props = {
			initKarma,
		};
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
		this.config.save();
	}

	async configuring() {
		const {
			npmInstall = null,
		} = this.config.getAll();

		if (!this.props.initKarma) {
			return;
		}

		if (npmInstall === null) {
			this.composeWith(require.resolve('../npm'), {});
		}

		this.composeWith(require.resolve('../webpack'), {});
	}

	async writing() {
		if (!this.props.initKarma) {
			return;
		}

		this.log(`Copy karma templates ${ scriptColor('karma.conf.ts') }...`);
		this.fs.copyTpl(
			this.templatePath('karma.conf.ts'),
			this.destinationPath('karma.conf.ts'),
		);

		this.log(`Add karma scripts to ${ scriptColor('package.json') }...`);
		this.fs.extendJSON(this.destinationPath('package.json'), {
			scripts: {
				'tdd': 'cross-env BABEL_ENV=test ENV=test karma start',
				'test': 'cross-env BABEL_ENV=test ENV=test karma start --single-run',
			},
		});
	}

	async install() {
		const {
			npmInstall = false,
			initWebpack = false,
		} = this.config.getAll();

		if (npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			await this.addDevDependencies([
				'karma',
				'karma-babel-preprocessor',
				'karma-chrome-launcher',
				'karma-coverage',
				'karma-coverage-istanbul-reporter',
				'karma-jasmine',
				'karma-jasmine-html-reporter',
				'karma-sinon',
				'karma-sourcemap-loader',
				'karma-typescript-preprocessor2',
				...(initWebpack ? [
					'karma-webpack',
					// 'istanbul-instrumenter-loader', // not in webpack 5
				] : []),
				'sinon',
				'nyc',
				'jasmine',
				'jasmine-core',
				'jasmine-enzyme',
			]);
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
}
