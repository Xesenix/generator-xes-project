'use strict';

import { Generator } from '../../lib/generator.js';
import { promptColor, scriptColor } from '../../lib/colors.js';
import { answerToBoolean } from '../../lib/utils.js';
import { promptFormat } from '../../lib/prompts.js';

export default class EditorConfigGenerator extends Generator {
	namespace = 'LINT';

	async prompting() {
		this.log('General configuration:\n');

		let { initLinting = 'no' } = await this.prompt([
			{
				type: 'list',
				name: 'initLinting',
				message: promptColor('Initialize linting: '),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		]);

		initLinting = answerToBoolean(initLinting);

		let { lintingEngine = 'none' } = initLinting
			? await this.prompt([
				{
					type: 'list',
					name: 'lintingEngine',
					message: promptColor('Typescript linting engine: '),
					default: 'tslint',
					choices: ['tslint', 'eslint', 'none'],
					store: true,
				},
			])
			: {};

		lintingEngine = lintingEngine === 'none' ? null : lintingEngine;

		if (initLinting) {
			await promptFormat(this);
		}

		this.props = {
			initLinting,
			lintingEngine,
		};
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
		this.config.save();
	}

	/** setup dependencies between generators in response to user input */
	async configuring() {
		const {
			initLinting,
			lintingEngine,
		} = this.config.getAll();

		if (!initLinting) {
			return;
		}

		await this.composeWith(require.resolve('../editorconfig'), { initEditorConfig: 'yes' });

		switch (lintingEngine) {
			case 'tslint':
				await this.composeWith(require.resolve('../tslint'), { initTSLint: 'yes' });
				break;
			case 'eslint':
				await this.composeWith(require.resolve('../eslint'), { initESLint: 'yes' });
				break;
		}

		await this.composeWith(require.resolve('../markdownlint'), {});
		await this.composeWith(require.resolve('../vscode'), {});
	}

	/** modifies files that should already exists */
	async writing() {
		const { initGit = false } = this.config.getAll();

		if (initGit) {
			// TODO: move to jsonlint
			const jsonFormatFiles = ['*.json', '.eslintrc', '.prettierrc', '.markdownlint', '.nycrc'];
			this.log(`Setting up lint staged configuration in ${ scriptColor('.lintstagedrc') }...`);

			this.extendJSON(
				'.lintstagedrc',
				(lintStagedConfig) => ({
					...lintStagedConfig,
					// TODO: handle removing already existing keys for linting files in jsonFormatFiles
					[`{${ jsonFormatFiles.join(',') }}`]: ['jsonlint -i -p'],
				}),
			);
		}
	}
}
