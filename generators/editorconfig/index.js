'use strict';

const { Generator } = require('../../lib/generator');
const { scriptColor, promptColor } = require('../../lib/colors');
const { answerToBoolean, unique } = require('../../lib/utils');
const { promptFormat } = require('../../lib/prompts');

module.exports = class EditorConfigGenerator extends Generator {
	namespace = 'EDITOR';

	async prompting() {
		this.log(`General configuration:\n`);

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

	async configuring() {
		const {
			vsCodeSetup = null,
		} = this.config.getAll();

		if (!this.props.initEditorConfig) {
			return;
		}

		if (vsCodeSetup === null) {
			this.composeWith(require.resolve('../vscode'));
		}
	}

	async writing() {
		const {
			vsCodeSetup = false,
		} = this.config.getAll();

		if (!this.props.initEditorConfig) {
			return;
		}

		const { format } = this.config.getAll();

		this.log(`Setting up ${ scriptColor('.editorconfig') }...`);
		this.fs.copyTpl(
			this.templatePath('.editorconfig'),
			this.destinationPath('.editorconfig'),
			format,
		);

		this.log(`Add lint fixing script to ${ scriptColor('package.json') }...`);
		this.fs.extendJSON(this.destinationPath('package.json'), {
			scripts: {
				'eclint:fix': 'eclint fix',
			},
		});

		if (vsCodeSetup) {
			this.log(`Setting up recomendations in ${ scriptColor('.vscode/extensions.json') }...`);

			this.extendJSON('.vscode/extensions.json', (extensions) => ({
				recommendations: unique([
					...(extensions.recommendations || []),
					'editorconfig.editorconfig',
				]).sort(),
			}));
		}
	}

	async install() {
		const {
			npmInstall = false,
		} = this.config.getAll();

		if (!this.props.initEditorConfig) {
			return;
		}

		if (npmInstall) {
			this.log(`Adding dependencies to ${ scriptColor('package.json') }...`);
			await this.addDevDependencies([
				'eclint',
			]);
		} else {
			this.log(`Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
};
