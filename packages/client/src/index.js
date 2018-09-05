'use strict';


import { loadScript, loadJsonP } from './loader';




class Fragment {

	constructor(client, options) {
		this.$client = client;
		this.$options = options;
		this.$content = null;
	}

	get content() {
		return this.$content && this.$content.default;
	}

	async load() {

		if(this.content === null) {

			if(this.$options.hasOwnProperty('dependencies')) {
				if(Array.isArray(this.$options.dependencies) && this.$options.dependencies.length) {
					for(let dep of this.$options.dependencies) {
						await this.$client.$registry.load(dep);
					}
				}
			}



			let jsonpFn = `f_${this.$options.id}`;
			let content = await loadJsonP(jsonpFn, this.$options.url);
			this.$content = content;
			this.$content.__fragmento.loaded(this);

		} else {
			return this.content;
		}

	}

}




class Registry {

	constructor() {
		this.$scripts = new Set();
	}

	async load(url) {
		await loadScript(url);
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



export {
	Client
}
