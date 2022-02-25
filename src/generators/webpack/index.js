'use strict';

import { Generator } from '../../lib/generator.js';
import { scriptColor, promptColor } from '../../lib/colors.js';
import { answerToBoolean } from '../../lib/utils.js';

export default class WebpackGenerator extends Generator {
	namespace = 'WEBPACK';

	async prompting() {
		this.log('General configuration:\n');

		let { initWebpack } = await this.prompt([
			{
				type: 'list',
				name: 'initWebpack',
				message: promptColor('Initialize webpack: '),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		]);

		initWebpack = answerToBoolean(initWebpack);

		this.props = {
			initWebpack,
		};
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
	}

	/** setup dependencies between generators in response to user input */
	async configuring() {
		const {
			npmInstall = null,
			initWebpack = false,
		} = this.config.getAll();

		if (!initWebpack) {
			return;
		}

		if (npmInstall === null) {
			this.composeWith(require.resolve('../npm'), {});
		}
	}

	/** modifies files that should already exists */
	async writing() {
		const {
			initWebpack = false,
		} = this.config.getAll();

		if (!initWebpack) {
			return;
		}

		this.log(`Add webpack scripts to ${ scriptColor('package.json') }...`);
		this.fs.extendJSON(this.destinationPath('package.json'), {
			scripts: {
				'analyze': 'cross-env ANALYZE=true npm run build:prod',
				'build:dev': 'cross-env ENV=development parallel-webpack --config webpack.config.js',
				'build:prod': 'cross-env ENV=production webpack --config webpack.config.js',
				'report-coverage': 'cat ./coverage/lcov.info | coveralls',
				'serve': 'cross-env ENV=development HMR=true webpack-dev-server --config webpack.config.js',
				'start': 'http-server ./dist',
				'tsc': 'tsc -p tsconfig.json --diagnostics --pretty',
				'xi18n': 'ts-node ./scripts/extract.ts',
				'expose': 'ngrok http --host-header=rewrite 8080',
			},
		});
	}

	async install() {
		const {
			npmInstall = false,
			initWebpack = false,
		} = this.config.getAll();

		if (initWebpack && npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			await this.addDevDependencies([
				'webpack',
				'webpack-cli',
				'markdown-loader',
				'raw-loader',
				'svg-inline-loader',
				'sourcemap',
				'ejs-loader',
				'file-loader',
				'json-loader',
				// styles
				'optimize-css-assets-webpack-plugin',
				'css-loader',
				'sass-loader', // TODO: do I need this for SCSS?
				'style-loader',
				'postcss-reduce-initial',
				// templates
				'html-critical-webpack-plugin',
				'html-loader',
				'html-webpack-plugin',
				// build
				'http-server',
				'workbox-webpack-plugin',
				'webpack-pwa-manifest',
				'ngrock-webpack-plugin',
				'compression-webpack-plugin',
				'compression',
				'chunk-progress-webpack-plugin',
				'clean-webpack-plugin',
				'copy-webpack-plugin',
				// analytics
				'webpack-bundle-analyzer',
				'inspectpack',
				// environments
				'dotenv-webpack',
			]);
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
}
