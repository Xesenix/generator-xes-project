'use strict';
import path from 'path';

import { testEditorConfig } from './shared/editorconfig.js';
import { testVSCodeSettings } from './shared/vscode.js';

import { resetPrompts, resetGeneratorComposition } from '../dist/lib/generator.js';

const generatorPath = path.resolve('./dist/generators/vscode');

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
			initEditorConfig: 'yes',
		},
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: false,
		},
		prompts: {
			vsCodeSetup: 'yes',
			initEditorConfig: 'no',
		},
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: false,
		},
		prompts: {
			vsCodeSetup: 'no',
			initEditorConfig: 'no',
		},
	});
});
