'use strict';

const path = require('path');

const { resetPrompts, resetGeneratorComposition } = require('../lib/generator');
const { testMarkdownLintConfig } = require('./utils/format');

const generatorPath = path.resolve('./generators/markdownlint');

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
