import chalk from 'chalk';

export function validateNotEmpty(value) {
	if (value.length === 0) {
		return `${ chalk.red('Incorrect value: ') } value empty`;
	}
	return true;
}
