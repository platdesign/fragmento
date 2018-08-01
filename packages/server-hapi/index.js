'use strict';

'use strict';

const Hapi = require('hapi');
const path = require('path');
const fcwd = require('@fragmento/cwd');
const fs = require('fs');


module.exports = async (cwd) => {

	const fragments = await fcwd.getFragments(cwd);
	const mainConfig = await fcwd.getProjectConfig(cwd);


	const server = new Hapi.Server({
		host: '0.0.0.0',
		port: mainConfig.server.port,
		routes: {
			cors: {
				origin: ['*']
			}
		}
	});

	await server.register(require('inert'));

	const container = {
		server
	};

	await server.register(require('./plugins/dir-routes'));


	server.decorate('server', 'fragmento', {
		fragments,
		config: mainConfig
	});


	// let assetServerUrl = 'http://localhost:9401';

	// if(process.env.NODE_ENV === 'production') {
	// 	assetServerUrl = 'http://localhost:5321';
	// }


	// let pFragments;

	// if(process.env.NODE_ENV !== 'production') {
	// 	pFragments = Array.from(fragments).map(f => ({
	// 		id: f.id,
	// 		serverId: mainConfig.id,
	// 		url: `${assetServerUrl}/${f.id}.js`,
	// 		tags: f.tags,
	// 		dependencies: []
	// 	}));
	// } else {

	// 	let manifest = require(path.join(cwd, 'dist', 'manifest.json'))

	// 	pFragments = Array.from(fragments).map(f => ({
	// 		id: f.id,
	// 		serverId: mainConfig.id,
	// 		url: `${assetServerUrl}${manifest[f.id+'.js']}`,
	// 		tags: f.tags,
	// 		dependencies: [
	// 			`${assetServerUrl}${manifest['chunk-vendors.js']}`,
	// 		]
	// 	}));
	// }




	// server.route({
	// 	method: 'GET',
	// 	path: '/probe',
	// 	handler: () => {
	// 		return {
	// 			serverId: mainConfig.id,
	// 			fragments: pFragments
	// 		}
	// 	}
	// });









	// register fragment assets route
	server.route({
		method: 'GET',
		path: '/assets/{param*}',
		handler: {
			directory: {
				path: path.join(cwd, 'dist'),
				redirectToSlash: true,
				index: true,
			}
		}
	});




	// Register fragment api routes
	for(let fragment of fragments) {

		let apiFolder = path.join(fragment.serverPath, 'api');

		if(fs.existsSync(apiFolder)) {
			server.registerRoutesFromDir(apiFolder, {
				prefix: `/fragments/${fragment.id}/api`
			}, factory => factory(container));
		}

	}





	// start server
	await server.start();

	return server;
};
