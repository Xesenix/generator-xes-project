'use strict';

import path from 'path';

import { resetPrompts, resetGeneratorComposition } from '../dist/lib/generator.js';

import { testTSLintConfig } from './shared/tslint.js';

const generatorPath = path.resolve('./dist/generators/tslint');

describe('yo xes-project:tslint', () => {
	beforeEach(() => {
		resetPrompts();
		resetGeneratorComposition();
	});

	testTSLintConfig(generatorPath, {
		prompts: {
			initEditorConfig: 'yes',
			initLinting: 'yes',
		},
	});

	testTSLintConfig(generatorPath, {
		prompts: {
			initEditorConfig: 'no',
			initLinting: 'yes',
		},
	});
});
