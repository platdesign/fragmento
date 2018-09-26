/**
 * author     Christian Blaschke <mail@platdesign.de>
 */

'use strict';


import {
	loadScript,
	loadJsonP,
	loadCss
} from './loader';



class Fragment {

	constructor(client, options) {
		this.$client = client;
		this.$options = options;
		this.$content = null;
	}

	get content() {
		return this.$content && this.$content.default;
	}

	get _apiBaseUrl() {
		return this.$options.provider.url + this.$options.provider.apiPath;
	}

	get _assetsBaseUrl() {
		return this.$options.provider.url + this.$options.provider.assetsPath;
	}

	get __webpack_public_path__() {
		return this._assetsBaseUrl
	}

	get id() {
		return this.$options.id;
	}

	async load() {


		if (this.content === null) {


			if (this.$options.src.hasOwnProperty('deps')) {

				if (Array.isArray(this.$options.src.deps) && this.$options.src.deps.length) {

					await Promise.all(this.$options.src.deps.map(async dep => {
						let depUri = this._assetsBaseUrl + dep.src;

						if (dep.type === 'script') {
							await this.$client.$registry.loadScript(depUri);
						}

						if (dep.type === 'style') {
							await this.$client.$registry.loadCss(depUri);
						}
					}));

				}

			}


			// 	if (this.$options.hasOwnProperty('dependencies')) {
			// 		if (Array.isArray(this.$options.dependencies) && this.$options.dependencies.length) {
			// 			for (let dep of this.$options.dependencies) {
			// 				await this.$client.$registry.loadScript(dep);
			// 			}
			// 		}
			// 	}

			// 	if (this.$options.hasOwnProperty('styles')) {
			// 		if (Array.isArray(this.$options.styles) && this.$options.styles.length) {
			// 			for (let dep of this.$options.styles) {
			// 				await this.$client.$registry.loadCss(dep);
			// 			}
			// 		}
			// 	}


			let jsonpFn = `f_${this.id}`;

			let entryUrl = this._assetsBaseUrl + this.$options.src.entry;
			let content = await loadJsonP(jsonpFn, entryUrl);

			this.$content = content(this);

		}

		return this.content;

	}

}



class Registry {

	constructor() {
		this.$scripts = new Set();

	}



	async loadScript(url) {
		return loadScript(url);
	}

	async loadCss(url) {
		return loadCss(url);
	}
}



class Client {

	constructor(options) {
		this.$options = options;
		this.$registry = new Registry();
		window.__fragmento_client__ = this;


		this.aliasModules = new Proxy(this.$options.aliasModules, {
			get(mod, key) {
				if (mod.hasOwnProperty(key)) {
					return mod[key];
				} else {
					throw new Error(`Fragmento alias modules: Host module @host/${key} not found.\n--> Please provide it as aliasModules option on initializing Fragmento.Client`);
				}
			}
		})
	}

	// get aliasModules() {
	// 	return this.$options.aliasModules;
	// }

	fragment(options) {
		return new Fragment(this, options);
	}

}


export {
	Client
}
