'use strict';


require.main.paths.unshift(process.cwd() + '/node_modules');


const boot = require.main.require('@fragmento/server-hapi');


;
(async() => {

	try {
		console.log('[server-hapi] starting ...');
		let server = await boot(process.cwd());
		console.log('[server-hapi] ready\n', server.info);



		process.once('SIGUSR2', async function() {
			console.log('[server-hapi] stopping ...');
			await server.stop();
			//await new Promise(resolve => setTimeout(resolve, 1000));
			console.log('[server-hapi] stopped');
			process.kill(process.pid, 'SIGUSR2');
		});
	} catch (e) {
		console.log('retry', e)
		process.exit(1);
	}

})();
