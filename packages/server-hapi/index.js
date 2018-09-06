'use strict';

'use strict';

const Hapi = require('hapi');
const path = require('path');
const fcwd = require('@fragmento/cwd');
const fs = require('fs');



function stripDoubleSlash(str) {
	return str.replace(/\/\//, '/');
}


module.exports = async (cwd) => {

	const fragments = fcwd.getFragments(cwd);
	const mainConfig = fcwd.getProjectConfig(cwd);




	const server = new Hapi.Server({
		host: '0.0.0.0',
		port: process.env.NODE_ENV === 'production' ? mainConfig.backend.port : mainConfig.devServer.port,
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


	let publicBaseUrl = mainConfig.backend.publicBaseUrl || `http://0.0.0.0:${mainConfig.backend.port}`;


	let pFragments;

	if(process.env.NODE_ENV !== 'production') {
		pFragments = Array.from(fragments).map(f => ({
			id: f.id,
			url: `${publicBaseUrl}${mainConfig.publicPath}${f.entryName}.js`,
			tags: f.tags,
			apiBaseUrl: `${publicBaseUrl}/api/f/${f.id}`,
			dependencies: [],
			styles: [],
			assetsUrl: publicBaseUrl + mainConfig.publicPath,
		}));
	} else {

		let manifest = require(path.join(cwd, 'dist', 'manifest.json'))

		pFragments = Array.from(fragments).map(f => ({
			id: f.id,
			url: publicBaseUrl + stripDoubleSlash(`${mainConfig.publicPath}${manifest[f.entryName+'.js']}`),
			tags: f.tags,
			apiBaseUrl: `${publicBaseUrl}/api/f/${f.id}`,
			dependencies: [
				publicBaseUrl + stripDoubleSlash(`${mainConfig.publicPath}${manifest['chunk-vendors.js']}`)
			],
			styles: [
				...(manifest.hasOwnProperty(f.entryName+'.css') ? [ publicBaseUrl + stripDoubleSlash(`${mainConfig.publicPath}${manifest[f.entryName+'.css']}`) ] : [])
			],
			assetsUrl: publicBaseUrl + mainConfig.publicPath
		}));
	}



	let probe = {
		serverId: mainConfig.id,
		baseUrl: publicBaseUrl,
		fragments: pFragments
	};




	server.route({
		method: 'GET',
		path: '/api/probe',
		handler: () => {
			return probe
		}
	});









	// register fragment assets route
	server.route({
		method: 'GET',
		path: `${mainConfig.publicPath}{param*}`,
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
				prefix: `/api/f/${fragment.id}`
			}, factory => factory(container));
		}

	}





	// start server
	await server.start();

	return server;
};
