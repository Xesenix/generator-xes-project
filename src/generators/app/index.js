'use strict';
import { Generator } from '../../lib/generator.js';

export default class AppGenerator extends Generator {
	async configuring() {
		this.log('App configure');

		this.composeWith(require.resolve('../npm'), {});
		this.composeWith(require.resolve('../git'), {});
		this.composeWith(require.resolve('../lint'), {});
		this.composeWith(require.resolve('../webpack'), {});
		this.composeWith(require.resolve('../karma'), {});
		this.composeWith(require.resolve('../i18n'), {});
		this.composeWith(require.resolve('../docs'), {});
	}
}
