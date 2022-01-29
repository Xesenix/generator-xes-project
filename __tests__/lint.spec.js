'use strict';
import path from 'path';

import { resetPrompts, resetGeneratorComposition } from '../dist/lib/generator.js';

import { testEditorConfig } from './shared/editorconfig.js';
import { testTSLintConfig } from './shared/tslint.js';

const generatorPath = path.resolve('./dist/generators/lint');

describe('yo xes-project:lint', () => {
	beforeEach(() => {
		resetPrompts();
		resetGeneratorComposition();
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: true,
		},
		prompts: {
			initLinting: 'yes',
			lintingEngine: 'none',
		},
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: false,
		},
		prompts: {
			initLinting: 'no',
			lintingEngine: 'none',
		},
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: true,
		},
		prompts: {
			initLinting: 'yes',
			lintingEngine: 'tslint',
		},
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: false,
		},
		prompts: {
			initLinting: 'no',
			lintingEngine: 'tslint',
		},
	});

	testTSLintConfig(generatorPath, {
		prompts: {
			initLinting: 'yes',
			lintingEngine: 'tslint',
		},
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: true,
		},
		prompts: {
			initLinting: 'yes',
			lintingEngine: 'eslint',
		},
	});

	testEditorConfig(generatorPath, {
		expect: {
			editorConfigGenerated: false,
		},
		prompts: {
			initLinting: 'no',
			lintingEngine: 'eslint',
		},
	});
});
