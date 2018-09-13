'use strict';

const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const { getProjectConfig, getFragments } = require('@fragmento/cwd');

const CWD = process.env.INIT_CWD || process.env.PWD;

const projectConfig = getProjectConfig(CWD);
const fragments = getFragments(CWD);



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
		publicPath: projectConfig.publicPath,
		proxy: {
			'/api': {
				target: `http://localhost:${projectConfig.devServer.port}`,
				ws: true,
				changeOrigin: true
			}
		}
	}
}




module.exports = async(api, projectOptions) => {

	api.chainWebpack(wconfig => {
		wconfig.resolve.alias.set('vue$', 'vue/dist/vue.esm.js');


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
				.add('@fragmento/webpack-fragment-loader!' + path.join(fragment.dir, 'client', 'main.js'));

		}


		wconfig.externals({
			'vue': 'Vue',
			'axios': 'axios'
		});



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
