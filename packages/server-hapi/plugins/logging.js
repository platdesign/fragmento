'use strict';


const laabr = require('laabr');


module.exports = {
	async register(server) {

		if (process.env.NODE_ENV !== 'test') {

			// await server.register({
			// 	plugin: require('hapi-pino'),
			// 	options: {
			// 		prettifier: 'pino-pretty',
			// 		prettyPrint: true, //process.env.NODE_ENV !== 'production',
			// 		// Redact Authorization headers, see https://getpino.io/#/docs/redaction
			// 		redact: ['req.headers.authorization']
			// 	}
			// });

			await server.register({
				plugin: laabr,
				options: {
					indent: 0,
					colored: true
				}
			});

			// await server.register({
			// 	plugin: HapiGood,
			// 	options: {
			// 		ops: {
			// 			interval: 1000
			// 		},
			// 		reporters: {
			// 			myConsoleReporter: [{
			// 					module: '@hapi/good-squeeze',
			// 					name: 'Squeeze',
			// 					args: [{
			// 						log: '*',
			// 						response: '*',
			// 						error: '*'
			// 					}]
			// 				}, {
			// 					module: '@hapi/good-console'
			// 				},
			// 				'stdout'
			// 			]
			// 		}
			// 	}
			// });

		}


	},
	name: 'logging'
};
