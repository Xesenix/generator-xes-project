import BaseGenerator from 'yeoman-generator';
import fs from 'fs';

import { progressColor } from './colors.js';

/**
 * Global prompts response cache.
 */
let asked = {};
const composed = [];

export const resetPrompts = () => asked = {};
export const resetGeneratorComposition = () => composed.length = 0;

/**
 * Extended Base generator class with additional prompt answers memory
 * and loging prefixes.
 */
export class Generator extends BaseGenerator {
	namespace = 'GENERATOR';

	constructor(args, opts) {
		super(args, opts);

		this.log = (message) => {
			return this.env.adapter.log(`${ progressColor(this.prefix() + ':') } ${ message }`);
		};

		this.prefix = () => (opts.parent !== '' ? opts.parent + ' > ' : '') + this.namespace;

		this.option('parent', {
			type: String,
			description: 'Parent generator name.',
			default: '',
		});
	}

	/**
	 * Extended prompt that remembers answers from previous queries
	 * and doesn't ask the same queries multiple times.
	 *
	 * @param BaseGenerator.Questions<any> questions
	 * @returns Promise<any>
	 */
	async prompt(questions) {
		const q = questions.filter(({ name }) => typeof asked[name] === 'undefined');
		const result = Object.keys(q).length > 0 ? await super.prompt(q) : {};

		asked = { ...asked, ...result };

		return asked;
	}

	/**
	 * Extended composeWith converting provided options to prompt answers.
	 *
	 * @param string | BaseGenerator.CompositionOptions | (string | BaseGenerator.CompositionOptions)[] generator
	 * @param BaseGenerator.GeneratorOptions options
	 * @param returnNewGenerator
	 * @returns Promise<any>
	 */
	composeWith(generator, options, returnNewGenerator) {
		const parent = this.prefix();

		if (options) {
			Object.entries(options).forEach(([key, value]) => asked[key] = value);
		}

		if (composed.includes(generator)) {
			return Promise.resolve(this);
		}

		composed.push(generator);

		return super.composeWith(generator, {
			parent,
			...options,
			returnNewGenerator,
		});
	}

	extendJSON(path, extend) {
		const jsonFilePath = this.destinationPath(path);
		let data = {};
		if (fs.existsSync(jsonFilePath)) {
			data = this.fs.readJSON(jsonFilePath);
		}
		this.fs.extendJSON(jsonFilePath, extend(data));
	}
}
