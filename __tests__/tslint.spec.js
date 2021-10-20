'use strict';

const path = require('path');
const { resetPrompts } = require('../lib/generator');

const generatorPath = path.resolve('./generators/tslint');

const { testTSLintConfig } = require('./utils/format');

describe('yo xes-project:tslint', () => {
	beforeEach(() => {
		resetPrompts();
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
