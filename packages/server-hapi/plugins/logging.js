'use strict';


const Good = require('good');


module.exports = {
	async register(server) {

		if (process.env.NODE_ENV !== 'test') {

			await server.register({
				plugin: Good,
				options: {
					ops: {
						interval: 1000
					},
					reporters: {
						myConsoleReporter: [{
								module: 'good-squeeze',
								name: 'Squeeze',
								args: [{
									log: '*',
									response: '*',
									error: '*'
								}]
							}, {
								module: 'good-console'
							},
							'stdout'
						]
					}
				}
			});

		}


	},
	name: 'logging'
};
