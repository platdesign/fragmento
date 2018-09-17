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
		return this.$options.provider.id + '_' + this.$options.id;
	}

	async load() {


		if (this.content === null) {


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
			console.log(jsonpFn);
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

	constructor() {
		this.$registry = new Registry();
	}

	fragment(options) {
		return new Fragment(this, options);
	}

}

console.log('asd')

export {
	Client
}
