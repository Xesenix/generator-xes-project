'use strict';

import { Generator } from '../../lib/generator.js';
import { scriptColor, promptColor } from '../../lib/colors.js';
import { answerToBoolean, unique } from '../../lib/utils.js';
import { promptFormat } from '../../lib/prompts.js';

export default class EditorConfigGenerator extends Generator {
	namespace = 'EDITOR';

	async prompting() {
		this.log('General configuration:\n');

		let { initEditorConfig } = await this.prompt([
			{
				type: 'list',
				name: 'initEditorConfig',
				message: promptColor(`Initialize ${ scriptColor('.editorconfig') }: `),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		]);

		initEditorConfig = answerToBoolean(initEditorConfig);

		if (initEditorConfig) {
			await promptFormat(this);
		}

		this.props = {
			initEditorConfig,
		};
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
		this.config.save();
	}

	/** setup dependencies between generators in response to user input */
	async configuring() {
		const {
			vsCodeSetup = null,
			initGit = null,
			initEditorConfig = false,
		} = this.config.getAll();

		if (!initEditorConfig) {
			return;
		}

		if (vsCodeSetup === null) {
			this.composeWith(require.resolve('../vscode'));
		}

		if (initGit === null) {
			this.composeWith(require.resolve('../git'));
		}
	}

	/** modifies files that should already exists */
	async writing() {
		const {
			vsCodeSetup = false,
			initEditorConfig = false,
		} = this.config.getAll();

		if (!initEditorConfig) {
			return;
		}

		const { format, initGit = false } = this.config.getAll();

		this.log(`Setting up ${ scriptColor('.editorconfig') }...`);
		this.fs.copyTpl(
			this.templatePath('.editorconfig'),
			this.destinationPath('.editorconfig'),
			format,
		);

		// this.log(`Add lint fixing script to ${ scriptColor('package.json') }...`);
		// this.fs.extendJSON(this.destinationPath('package.json'), {
		// 	scripts: {
		// 		'eclint:fix': 'eclint fix',
		// 	},
		// });

		if (vsCodeSetup) {
			this.log(`Setting up recomendations in ${ scriptColor('.vscode/extensions.json') }...`);

			this.extendJSON('.vscode/extensions.json', (extensions) => ({
				recommendations: unique([
					...(extensions.recommendations || []),
					'editorconfig.editorconfig',
				]).sort(),
			}));
		}

		if (initGit) {
			this.log(`Setting up lint staged configuration in ${ scriptColor('.lintstagedrc') }...`);

			this.extendJSON(
				'.lintstagedrc',
				(lintStagedConfig) => ({
					...lintStagedConfig,
					// editor config should be last
					// '*': 'eclint fix', // breaks comments formatting
				}),
			);
		}
	}

	async install() {
		const {
			npmInstall = false,
			initEditorConfig = false,
		} = this.config.getAll();

		if (initEditorConfig && npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			// await this.addDevDependencies([
			// 	'eclint',
			// ]);
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
}
