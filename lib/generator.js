const BaseGenerator = require('yeoman-generator');

const { progressColor } = require('./colors');

let asked = {};

class Generator extends BaseGenerator {
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

	async prompt(questions) {
		const q = questions.filter(({ name }) => typeof asked[name] === 'undefined');
		const result = await super.prompt(q);

		asked = { ...asked, ...result };

		return asked;
	}

	composeWith(generator, options) {
		return super.composeWith(generator, {
			parent: this.prefix(),
			...options,
		});
	}
}

module.exports = {
	Generator,
	resetPrompts: () => asked = {},
};
