'use strict';

const fs = require('fs');

const { Generator } = require('../../lib/generator');
const { scriptColor } = require('../../lib/colors');
const { promptNpmInstall } = require('../../lib/prompts');

module.exports = class NPMGenerator extends Generator {
	namespace = 'NPM';

	async prompting() {
		this.log(`General configuration:\n`);

		await promptNpmInstall(this);
	}

	async configure() {
		if (!this.props.npmInstall) {
			return;
		}

		this.log(`Initializing npm...`);

		if (!fs.existsSync('package.json')) {
			this.fs.extendJSON(this.destinationPath('package.json'), {
				name: '',
				version: '0.0.0',
				keywords: [],
				author: '',
				license: 'ISC',
			});
		}
	}

	async install() {
		const {
			npmInstall = false,
		} = this.config.getAll();

		if (npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			await this.addDevDependencies([
				'cross-env',
				'mkdirp',
			]);

			this.install({ npm: true });
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
};
