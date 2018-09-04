'use strict';


require.main.paths.unshift(process.cwd() + '/node_modules');


const boot = require.main.require('@fragmento/server-hapi');


;(async () => {

	let server = await boot(process.cwd());
	console.log(server.info);

})();
