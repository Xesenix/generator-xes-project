'use strict';

import { Generator } from '../../lib/generator.js';
import { scriptColor, promptColor } from '../../lib/colors.js';
import { answerToBoolean, unique } from '../../lib/utils.js';

export default class DocsGenerator extends Generator {
	namespace = 'DOCS';

	async prompting() {
		this.log('General configuration:\n');

		let { initDocs } = await this.prompt([
			{
				type: 'list',
				name: 'initDocs',
				message: promptColor('Initialize project documentation: '),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		]);

		initDocs = answerToBoolean(initDocs);

		this.props = {
			initDocs,
		};
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
	}

	/** setup dependencies between generators in response to user input */
	async configuring() {
		const {
			npmInstall = null,
			vsCodeSetup = null,
			initDocs = false,
		} = this.config.getAll();

		if (!initDocs) {
			return;
		}

		if (npmInstall === null) {
			this.composeWith(require.resolve('../npm'), {});
		}

		if (vsCodeSetup === null) {
			this.composeWith(require.resolve('../vscode'), {});
		}
	}

	/** modifies files that should already exists */
	async writing() {
		const {
			vsCodeSetup = false,
			initDocs = false,
		} = this.config.getAll();

		if (!initDocs) {
			return;
		}

		if (vsCodeSetup) {
			this.log(`Setting up recomendations in ${ scriptColor('.vscode/extensions.json') }...`);

			this.extendJSON('.vscode/extensions.json', (extensions) => ({
				recommendations: unique([
					...(extensions.recommendations || []),
					'yzhang.markdown-all-in-one',
				]).sort(),
			}));
		}
	}

	async install() {
		const {
			npmInstall = false,
			initDocs = false,
		} = this.config.getAll();

		if (initDocs && npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			await this.addDevDependencies([
			]);
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
}
