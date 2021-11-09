'use strict';

const path = require('path');
const { resetPrompts, resetGeneratorComposition } = require('../lib/generator');

const generatorPath = path.resolve('./generators/tslint');

const { testTSLintConfig } = require('./utils/format');

describe('yo xes-project:tslint', () => {
	beforeEach(() => {
		resetPrompts();
		resetGeneratorComposition();
	});

	testTSLintConfig(generatorPath, {
		prompts: {
			initEditorConfig: "yes",
			initLinting: 'yes',
		},
	});

	testTSLintConfig(generatorPath, {
		prompts: {
			initEditorConfig: "no",
			initLinting: 'yes',
		},
	});
});
