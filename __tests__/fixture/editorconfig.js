module.exports = ({
	indentStyle,
	indentSize,
	quote,
}) => ({
	root: true,
	'*': {
		charset: 'utf-8',
		indent_style: indentStyle,
		indent_size: indentSize,
		insert_final_newline: true,
		quote_type: quote,
		trim_trailing_whitespace: true,
		spaces_around_operators: true,
		spaces_around_brackets: false,
		indent_brace_style: '1TBS',
		md: {
			max_line_length: 'off',
			trim_trailing_whitespace: false,
		},
	},
	"node_modules/**": {
		'charset': 'unset',
		'indent_style': 'unset',
		'indent_size': 'unset',
		'trim_trailing_whitespace': 'unset',
		'quote_type': 'unset',
		'insert_final_newline': 'unset',
		'spaces_around_operators': 'unset',
		'spaces_around_brackets': 'unset',
		'indent_brace_style': 'unset',
	},
});
