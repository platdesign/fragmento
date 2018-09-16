/**
 * author     Christian Blaschke <mail@platdesign.de>
 */

'use strict';



const Hapi = require('hapi');
const path = require('path');
const Provider = require('@fragmento/provider');
const fs = require('fs');


function stripDoubleSlash(str) {
	return str.replace(/\/\//, '/');
}


module.exports = async(cwd) => {

	let provider = new Provider(cwd);


	const fragments = provider.$fragmentsArray;
	const mainConfig = provider.$config;



	const server = new Hapi.Server({
		host: '0.0.0.0',
		port: process.env.NODE_ENV === 'production' ? mainConfig.backend.port : mainConfig.dev.server.port,
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


	server.decorate('server', 'fragmento', provider);


	let publicBaseUrl = mainConfig.backend.publicBaseUrl || `http://0.0.0.0:${mainConfig.backend.port}`;


	// let pFragments;

	// if (process.env.NODE_ENV !== 'production') {
	// 	pFragments = Array.from(fragments).map(f => ({
	// 		id: f.id,
	// 		url: `${publicBaseUrl}${mainConfig.publicPath}${f.entryName}.js`,
	// 		tags: f.tags,
	// 		apiBaseUrl: `${publicBaseUrl}/api/f/${f.id}`,
	// 		dependencies: [],
	// 		styles: [],
	// 		assetsUrl: publicBaseUrl + mainConfig.publicPath,
	// 	}));
	// } else {

	// 	let manifest = require(path.join(cwd, 'dist', 'manifest.json'))

	// 	pFragments = Array.from(fragments).map(f => ({
	// 		id: f.id,
	// 		url: publicBaseUrl + stripDoubleSlash(`${mainConfig.publicPath}${manifest[f.entryName+'.js']}`),
	// 		tags: f.tags,
	// 		apiBaseUrl: `${publicBaseUrl}/api/f/${f.id}`,
	// 		dependencies: [
	// 			publicBaseUrl + stripDoubleSlash(`${mainConfig.publicPath}${manifest['chunk-vendors.js']}`)
	// 		],
	// 		styles: [
	// 			...(manifest.hasOwnProperty(f.entryName + '.css') ? [publicBaseUrl + stripDoubleSlash(`${mainConfig.publicPath}${manifest[f.entryName+'.css']}`)] : [])
	// 		],
	// 		assetsUrl: publicBaseUrl + mainConfig.publicPath
	// 	}));
	// }



	// let probe = {
	// 	serverId: mainConfig.id,
	// 	baseUrl: publicBaseUrl,
	// 	fragments: pFragments
	// };

	// server.route({
	// 	method: 'GET',
	// 	path: '/api/probe',
	// 	handler: () => {
	// 		return probe
	// 	}
	// });



	const providerServerDir = path.join(cwd, 'server');
	await require(providerServerDir)(server);



	// register fragment assets route
	server.route({
		method: 'GET',
		path: `${mainConfig.backend.assetsPath}{param*}`,
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

		let apiFolder = path.join(fragment.serverPath, 'api');

		if (fs.existsSync(apiFolder)) {
			server.registerRoutesFromDir(apiFolder, {
				prefix: `/api/f/${fragment.id}`
			}, factory => factory(container));
		}

	}



	// start server
	await server.start();

	return server;
};
