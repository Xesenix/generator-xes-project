const chalk = require('chalk');

module.exports = function validateNotEmpty(value) {
	if (value.length === 0) {
		return `${ chalk.red('Incorrect value: ') } value empty`;
	}
	return true;
};
