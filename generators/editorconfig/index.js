'use strict';

const { Generator } = require('../../lib/generator');
const { scriptColor, promptColor } = require('../../lib/colors');
const { answerToBoolean } = require('../../lib/utils');
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

	async writing() {
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
	}
};