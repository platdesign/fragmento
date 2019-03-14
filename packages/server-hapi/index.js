/**
 * author     Christian Blaschke <mail@platdesign.de>
 */

'use strict';



const Hapi = require('hapi');
const path = require('path');
const Provider = require('@fragmento/provider');
const fs = require('fs');



module.exports = async(cwd, autostart = true) => {

	const provider = new Provider(cwd);
	const fragments = provider.$fragmentsArray;



	// Init Hpi server
	const server = new Hapi.Server({
		host: '0.0.0.0',
		port: process.env.NODE_ENV === 'production' ? provider.$config.backend.port : provider.$config.dev.server.port,
		routes: {
			cors: {
				origin: ['*']
			}
		}
	});


	// register dir routes as plugin to create routes from route paths
	await server.register(require('./plugins/logging'));


	// Register inert as asset-provider
	await server.register(require('inert'));



	const container = {
		server
	};



	// register dir routes as plugin to create routes from route paths
	await server.register(require('./plugins/dir-routes'));



	// decorate server to give access to fragmento-provider
	server.decorate('server', 'fragmento', provider);



	// load server dir if available
	try {
		const providerServerDir = path.join(cwd, 'server');
		fs.accessSync(providerServerDir, fs.constants.R_OK);
		await require(providerServerDir)(server);
	} catch (e) {
		if (e.code !== 'ENOENT') {
			throw e;
		}
	}



	// register fragment assets route
	server.route({
		method: 'GET',
		path: `${provider.$config.backend.assetsPath}{param*}`,
		handler: {
			directory: {
				path: path.join(cwd, 'dist'),
				redirectToSlash: true,
				index: true,
			}
		}
	});



	// Register fragment api routes
	for (let fragment of fragments) {

		let indexFile = path.join(fragment.serverPath, 'index.js');

		if (fs.existsSync(indexFile)) {
			await require(indexFile)(fragment, server);
		}




		let apiFolder = path.join(fragment.serverPath, 'api');

		if (fs.existsSync(apiFolder)) {
			server.registerRoutesFromDir(apiFolder, {
				prefix: `/api/f/${fragment.id}`
			}, factory => factory(container));
		}



	}



	// start server if autostart isnt disabled
	if (autostart) {
		await server.start();
	}



	return server;
};
