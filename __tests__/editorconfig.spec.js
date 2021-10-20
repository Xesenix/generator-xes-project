'use strict';

const path = require('path');
const { resetPrompts } = require('../lib/generator');

const generatorPath = path.resolve('./generators/editorconfig');

const { testEditorConfig } = require('./utils/format');

describe('yo xes-project:editorconfig', () => {
	beforeEach(() => {
		resetPrompts();
	});

	testEditorConfig(generatorPath, {
		prompts: {
			initEditorConfig: "yes",
			initLinting: 'yes',
			lintingEngine: 'none',
		},
	});

	testEditorConfig(generatorPath, {
		prompts: {
			initEditorConfig: "no",
			initLinting: 'yes',
			lintingEngine: 'none',
		},
	});

	testEditorConfig(generatorPath, {
		prompts: {
			initEditorConfig: "yes",
			initLinting: 'no',
			lintingEngine: 'none',
		},
	});

	testEditorConfig(generatorPath, {
		prompts: {
			initEditorConfig: "no",
			initLinting: 'no',
			lintingEngine: 'none',
		},
	});
});
