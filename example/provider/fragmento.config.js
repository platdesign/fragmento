'use strict';


module.exports = {
	id: 'server1',
	backend: {
		port: 5003,
		publicBaseUrl: 'http://localhost:5003'
	},
	devServer: {
		port: 5004
	},
	devCommand: 'npm run serve'
}
