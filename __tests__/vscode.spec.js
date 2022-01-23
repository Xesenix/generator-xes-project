'use strict';

const path = require('path');

const { resetPrompts, resetGeneratorComposition } = require('../lib/generator');
const { testVSCodeSettings, testEditorConfig } = require('./utils/format');

const generatorPath = path.resolve('./generators/vscode');

describe('yo xes-project:vscode', () => {
	beforeEach(() => {
		resetPrompts();
		resetGeneratorComposition();
	});

	testVSCodeSettings(generatorPath, {
		expect: {
			vscodeSettingsGenerated: true,
		},
		prompts: {
			vsCodeSetup: 'yes',
		},
	});

	testVSCodeSettings(generatorPath, {
		expect: {
			vscodeSettingsGenerated: false,
		},
		prompts: {
			vsCodeSetup: 'no',
		},
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: true,
		},
		prompts: {
			vsCodeSetup: 'yes',
			initEditorConfig: "yes",
		},
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: false,
		},
		prompts: {
			vsCodeSetup: 'yes',
			initEditorConfig: "no",
		},
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: false,
		},
		prompts: {
			vsCodeSetup: 'no',
			initEditorConfig: "no",
		},
	});
});
