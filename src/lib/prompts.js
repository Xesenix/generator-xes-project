import { promptColor } from './colors.js';
import { answerToBoolean } from './utils.js';
import { validateNotEmpty } from './validators.js';

export async function promptFormat(generator) {
	generator.log('Format configuration:\n');

	const format = await generator.prompt([
		{
			type: 'list',
			name: 'indentStyle',
			message: promptColor('Indentation style: '), // spaces don't work best with jsdocs
			default: 'tab',
			choices: ['tab', 'space'],
			validate: validateNotEmpty,
			store: true,
		},
		{
			type: 'list',
			name: 'indentSize',
			message: promptColor('Indentation size: '),
			default: '2',
			choices: ['1', '2', '4'],
			validate: validateNotEmpty,
			store: true,
		},
		{
			type: 'list',
			name: 'quote',
			message: promptColor('Quotes: '),
			default: 'single',
			choices: ['single', 'double'],
			validate: validateNotEmpty,
			store: true,
		},
	]);

	generator.props = { ...generator.props, format };

	Object.entries(generator.props).forEach(([key, value]) => generator.config.set(key, value));
	generator.config.save();

	return generator.props;
}

export async function promptNpmInstall(generator) {
	let { npmInstall } = await generator.prompt([
		{
			type: 'list',
			name: 'npmInstall',
			message: promptColor('Install dependencies?'),
			default: 'yes',
			choices: ['yes', 'no'],
			store: false,
		},
	]);

	npmInstall = answerToBoolean(npmInstall);

	generator.props = { ...generator.props, npmInstall };

	Object.entries(generator.props).forEach(([key, value]) => generator.config.set(key, value));
	generator.config.save();

	return generator.props;
}
