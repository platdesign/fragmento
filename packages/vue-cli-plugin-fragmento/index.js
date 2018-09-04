'use strict';

const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const { getProjectConfig, getFragments } = require('@fragmento/cwd');



const projectConfig = getProjectConfig(process.env.INIT_CWD);
const fragments = getFragments(process.env.INIT_CWD);







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





module.exports = async (api, projectOptions) => {

	api.chainWebpack(wconfig => {
		wconfig.resolve.alias.set('vue$', 'vue/dist/vue.esm.js');


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


		if(api.service.mode === 'production') {
			wconfig.devtool(false);

			wconfig.output
				.filename('[name].[hash].js');
		}




		for(let fragment of fragments) {

			wconfig
				.entry(fragment.entryName)
				.add(path.join(fragment.dir, 'client', 'main.js'));

		}


		wconfig.externals({
			'vue': 'Vue'
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


	if(api.service.mode === 'development') {
		projectOptions.devServer = devServerConfig();
	}

};
