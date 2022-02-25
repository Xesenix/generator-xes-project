export default ({
	indentStyle,
	indentSize,
	quote,
}) => ({
	'defaultSeverity': 'error',
	'extends': [
		'tslint:recommended',
		// "tslint-config-prettier",
		'tslint-eslint-rules',
		'tslint-react',
	],
	'linterOptions': {
		'exclude': [
			'node_modules/**',
		],
	},
	'jsRules': {
		'indent': [true, indentStyle === 'tab' ? 'tabs' : 'spaces', parseInt(indentSize)],
		'quotemark': [true, quote, 'jsx-double'],
	},
	'rules': {
		'array-type': [true, 'array'],
		'max-line-length': {
			'options': [180],
		},
		'indent': [true, indentStyle === 'tab' ? 'tabs' : 'spaces', parseInt(indentSize)],
		'trailing-comma': [
			true,
			{
				'multiline': 'always',
				'singleline': 'never',
				'esSpecCompliant': true,
			},
		],
		'no-redundant-jsdoc': true,
		'no-bitwise': false,
		'no-console': false,
		'no-empty': false,
		'no-empty-interface': false,
		'no-extra-semi': true,
		'no-invalid-regexp': true,
		'no-namespace': false,
		'no-internal-module': false,
		'prefer-template': [true, 'allow-single-concat'],
		'quotemark': [true, quote, 'jsx-double'],
		'valid-typeof': true,
		'semicolon': [true, 'always'],
		'whitespace': [true, 'check-branch', 'check-decl', 'check-operator', 'check-module', 'check-rest-spread', 'check-type', 'check-typecast', 'check-type-operator'],
		'object-literal-sort-keys': false,
		'ordered-imports': [
			true,
			{
				'named-imports-order': 'lowercase-first',
				'grouped-imports': true,
				'groups': [
					{
						'name': 'absolute path',
						'match': '^@(app|core|common|collections|shared|lib|models)',
						'order': 20,
					},
					{
						'named': 'relative paths',
						'match': '^\\.\\.',
						'order': 30,
					},
					{
						'named': 'same paths',
						'match': '^\\.',
						'order': 40,
					},
					{
						'named': 'external dependencies',
						'match': '.',
						'order': 10,
					},
				],
			},
		],
		'array-bracket-spacing': ['error', 'always'],
		'jsx-curly-spacing': ['error', 'always'],
		'jsx-no-multiline-js': false,
		'jsx-no-lambda': true,
		'jsx-boolean-value': false,
		'no-var-requires': false,
	},
	'rulesDirectory': [],
});
