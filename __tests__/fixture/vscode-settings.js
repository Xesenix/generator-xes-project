module.exports = ({
	quote,
}) => ({

	'css.validate': false,
	'less.validate': false,
	'scss.validate': false,
	'html.format.wrapAttributes': 'force-expand-multiline',
	'editor.codeActionsOnSave': {
		'source.fixAll': true,
	},
	'editor.formatOnSave': true,
	'editor.wrappingIndent': 'indent',
	'[html]': {
		'editor.defaultFormatter': 'vscode.html-language-features',
	},
	'[json]': {
		'editor.defaultFormatter': 'vscode.json-language-features',
	},
	'[jsonc]': {
		'editor.defaultFormatter': 'vscode.json-language-features',
	},
	'[scss]': {
		'editor.defaultFormatter': 'mrmlnc.vscode-scss',
	},
	'[ts]': {
		'editor.defaultFormatter': 'vscode.typescript-language-features',
	},
	'[markdown]': {
		'editor.defaultFormatter': 'yzhang.markdown-all-in-one',
	},
	'javascript.format.semicolons': 'insert',
	'javascript.preferences.quoteStyle': quote,
	'typescript.format.semicolons': 'insert',
	'typescript.preferences.quoteStyle': quote,
});
