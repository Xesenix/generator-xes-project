'use strict';

const { Generator } = require('../../lib/generator');
const { scriptColor, promptColor } = require('../../lib/colors');
const { promptFormat } = require('../../lib/prompts');
const { answerToBoolean, unique } = require('../../lib/utils');

module.exports = class VSCodeGenerator extends Generator {
	namespace = 'VSCode';

	async prompting() {
		this.log(`General configuration:\n`);

		let { vsCodeSetup } = await this.prompt([
			{
				type: 'list',
				name: 'vsCodeSetup',
				message: promptColor(`Configure VSCode?`),
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

	async configure() {
		const {
			initEditorConfig = null,
		} = this.config.getAll();

		if (!this.props.vsCodeSetup) {
			return;
		}

		if (initEditorConfig === null) {
			this.composeWith(require.resolve('../editorconfig'));
		}
	}

	async writing() {
		if (!this.props.vsCodeSetup) {
			return;
		}

		this.log(`Initializing vscode...`);

		this.log(`Setting up recomendations in ${ scriptColor('.vscode/extensions.json') }...`);

		this.extendJSON('.vscode/extensions.json', (extensions) => ({
			recommendations: unique([
				...(extensions.recommendations || []),
				'christian-kohler.path-intellisense',
				'davidanson.vscode-markdownlint',
				"mrmlnc.vscode-scss",
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
