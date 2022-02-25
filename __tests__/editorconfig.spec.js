'use strict';
import path from 'path';

import { resetPrompts, resetGeneratorComposition } from '../dist/lib/generator.js';

import { testGitIgnore } from './shared/git.js';
import { testEditorConfig } from './shared/editorconfig.js';

const generatorPath = path.resolve('./dist/generators/editorconfig');

describe('yo xes-project:editorconfig', () => {
	beforeEach(() => {
		resetPrompts();
		resetGeneratorComposition();
	});

	testGitIgnore(generatorPath, {
		prompts: {
			initEditorConfig: 'yes',
			gitIgnoreContext: ['Node'],
		},
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: true,
		},
		prompts: {
			initEditorConfig: 'yes',
			initLinting: 'yes',
			lintingEngine: 'none',
		},
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: false,
		},
		prompts: {
			initEditorConfig: 'no',
			initLinting: 'yes',
			lintingEngine: 'none',
		},
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: true,
		},
		prompts: {
			initEditorConfig: 'yes',
			initLinting: 'no',
			lintingEngine: 'none',
		},
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: false,
		},
		prompts: {
			initEditorConfig: 'no',
			initLinting: 'no',
			lintingEngine: 'none',
		},
	});
});
