'use strict';

import fs from 'fs';

import { Generator } from '../../lib/generator.js';
import { scriptColor } from '../../lib/colors.js';
import { promptNpmInstall } from '../../lib/prompts.js';

export default class NPMGenerator extends Generator {
	namespace = 'NPM';

	async prompting() {
		this.log('General configuration:\n');

		await promptNpmInstall(this);
	}

	/** generates files needed in other generators writing phase */
	async default() {
		const {
			npmInstall = false,
		} = this.config.getAll();

		if (!npmInstall) {
			return;
		}

		this.log('Initializing npm...');

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
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
}
