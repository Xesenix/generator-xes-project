'use strict';

import { Generator } from '../../lib/generator.js';
import { scriptColor, promptColor } from '../../lib/colors.js';
import { answerToBoolean } from '../../lib/utils.js';

export default class I18nGenerator extends Generator {
	namespace = 'I18N';

	async prompting() {
		this.log('General configuration:\n');

		let { initI18n } = await this.prompt([
			{
				type: 'list',
				name: 'initI18n',
				message: promptColor('Initialize translations: '),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		]);

		initI18n = answerToBoolean(initI18n);

		this.props = {
			initI18n,
		};
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
		this.config.save();
	}

	async configuring() {
		const {
			npmInstall = null,
		} = this.config.getAll();

		if (!this.props.initI18n) {
			return;
		}

		if (npmInstall === null) {
			this.composeWith(require.resolve('../npm'), {});
		}
	}

	async writing() {
		if (!this.props.initI18n) {
			return;
		}

	}

	async install() {
		const {
			npmInstall = false,
		} = this.config.getAll();

		if (npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			await this.addDevDependencies([
				'gettext-extractor',
				'po-gettext-loader',
			]);
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
}
