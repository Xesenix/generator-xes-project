'use strict';

import { Generator } from '../../lib/generator.js';
import { scriptColor, promptColor } from '../../lib/colors.js';
import { answerToBoolean, unique } from '../../lib/utils.js';
import { promptFormat } from '../../lib/prompts.js';

module.exports = class VSCodeGenerator extends Generator {
	namespace = 'VSCode';

	async prompting() {
		this.log('General configuration:\n');

		let { vsCodeSetup } = await this.prompt([
			{
				type: 'list',
				name: 'vsCodeSetup',
				message: promptColor('Configure VSCode?'),
				default: 'yes',
				choices: ['yes', 'no'],
				store: false,
			},
		]);

		vsCodeSetup = answerToBoolean(vsCodeSetup);

		this.props = {
			vsCodeSetup,
		};
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
		this.config.save();

		if (vsCodeSetup) {
			await promptFormat(this);
		}
	}

	/** setup dependencies between generators in response to user input */
	async configuring() {
		const {
			initEditorConfig = null,
			vsCodeSetup = false,
		} = this.config.getAll();

		if (!vsCodeSetup) {
			return;
		}

		if (initEditorConfig === null) {
			this.composeWith(require.resolve('../editorconfig'));
		}
	}

	/** generates files needed in other generators writing phase */
	async default() {
		const {
			vsCodeSetup = false,
		} = this.config.getAll();

		if (!vsCodeSetup) {
			return;
		}

		this.log('Initializing vscode...');

		this.log(`Setting up recomendations in ${ scriptColor('.vscode/extensions.json') }...`);

		this.extendJSON('.vscode/extensions.json', (extensions) => ({
			recommendations: unique([
				...(extensions.recommendations || []),
				'christian-kohler.path-intellisense',
				'davidanson.vscode-markdownlint',
				'mrmlnc.vscode-scss',
				'editorconfig.editorconfig',
				'streetsidesoftware.code-spell-checker',
			]).sort(),
		}));

		this.log(`Setting up vscode configuration in ${ scriptColor('.vscode/settings.json') }...`);

		const { format } = this.config.getAll();

		this.fs.copyTpl(
			this.templatePath('settings.json'),
			this.destinationPath('.vscode/settings.json'),
			format,
		);
	}
};
