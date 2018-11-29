/**
 * author     Christian Blaschke <mail@platdesign.de>
 */

'use strict';

const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const Provider = require('@fragmento/provider');

const CWD = process.env.INIT_CWD || process.env.PWD;
const provider = new Provider(CWD);


const projectConfig = provider.$config;
const fragments = provider.$fragmentsArray;



function devServerConfig() {
	return {
		// If devServer is needed use backend port and set up proxy
		port: projectConfig.backend.port,
		hot: true,
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		allowedHosts: ['*'],
		disableHostCheck: true,
		open: false,
		publicPath: projectConfig.backend.assetsPath,
		proxy: {
			'/api': {
				target: `http://localhost:${projectConfig.dev.server.port}`,
				ws: true,
				changeOrigin: true
			}
		}
	}
}



module.exports = async(api, projectOptions) => {

	api.chainWebpack(wconfig => {
		//wconfig.resolve.alias.set('vue$', 'vue/dist/vue.esm.js');


		wconfig.resolve.alias.set('@', path.join(CWD));


		// do not clear console
		wconfig
			.plugin('friendly-errors')
			.tap(args => {
				args[0].clearConsole = false;
				return args;
			});

		// remove default app
		wconfig.entryPoints
			.delete('app');


		wconfig.output
			.filename('[name].js')
			.library('[name]')
			.libraryTarget('jsonp')
			.jsonpFunction(`webpackJsonp_${projectConfig.id}`);


		if (api.service.mode === 'production') {
			wconfig.devtool(false);

			wconfig.output
				.filename('[name].[hash].js');
		}

		wconfig.optimization.splitChunks({});

		wconfig
			.resolveLoader
			.modules
			.add(path.join(__dirname, 'node_modules'));

		// resolveLoader: {
		//     alias: {
		//       "jade-loader-custom": path.join(__dirname, "./jade-loader-custom")
		//     }
		//   },


		for (let fragment of fragments) {

			wconfig
				.entry(fragment.entryName)
				.add('@fragmento/webpack-fragment-loader!' + path.join(fragment.clientPath, 'main.js'));

		}



		let externals = ['vue'];

		let fexternals = externals.reduce((acc, lib) => {
			acc[lib] = `var __fragmento_client__.aliasModules.${lib}`;
			return acc;
		}, {});


		const hostExternals = function(context, request, callback) {
			// Every module prefixed with "@host/" becomes external and will be loaded from __fragmento_client__.aliasModules
			// "@host/abc" -> __fragmento_client__.aliasModules.abc
			if (/^@host\//.test(request)) {
				return callback(null, `var __fragmento_client__.aliasModules['${request.substr(6)}']`);
			}
			callback();
		};

		wconfig.externals([
			fexternals,
			hostExternals
		]);



		wconfig.plugins
			.delete('html')
			.delete('prefetch')
			.delete('preload')
			.delete('copy')

		wconfig
			.plugin('manifest')
			.use(ManifestPlugin);



	});


	if (api.service.mode === 'development') {
		projectOptions.devServer = devServerConfig();
	}

};
