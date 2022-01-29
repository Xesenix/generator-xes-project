'use strict';
import path from 'path';

import { resetPrompts, resetGeneratorComposition } from '../dist/lib/generator.js';

import { testMarkdownLintConfig } from './shared/markdown.js';

const generatorPath = path.resolve('./dist/generators/markdownlint');

describe('yo xes-project:markdownlint', () => {
	beforeEach(() => {
		resetPrompts();
		resetGeneratorComposition();
	});

	testMarkdownLintConfig(generatorPath, {
		expect: {
			markdownLintConfigGenerated: true,
		},
		prompts: {
			initMDLint: 'yes',
		},
	});

	testMarkdownLintConfig(generatorPath, {
		expect: {
			markdownLintConfigGenerated: false,
		},
		prompts: {
			initMDLint: 'no',
		},
	});
});
