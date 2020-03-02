'use strict';

import { loadJsonP } from '../loader';


export default class Fragment {
	constructor(client, options) {
		Object.defineProperties(this, {
			version: { value: parseInt(options.version || 1) }
		});

		this.$client = client;
		this.$options = options;
		this.$content = null;
	}

	updateOptions() {}

	get content() {
		return this.$content && this.$content.default;
	}

	matchesLabels(labels) {
		return labels.every((label) => this.$options.labels.includes(label));
	}

	get _baseUrl() {
		let url = '';

		if (this.$client.$options.hasOwnProperty('assetProxyUrl')) {
			url += this.$client.$options.assetProxyUrl + '/' + this.$options.id;
		} else {
			url += this.$options.provider.url;
		}

		return url;
	}

	get _apiBaseUrl() {
		return this._baseUrl + this.$options.provider.apiPath;
	}

	get _assetsBaseUrl() {
		return this._baseUrl + this.$options.provider.assetsPath;
	}

	get __webpack_public_path__() {
		return this._assetsBaseUrl;
	}

	get id() {
		return this.$options.id;
	}

	async load() {
		if (this.content === null) {
			if (this.$options.src.hasOwnProperty('deps')) {
				if (Array.isArray(this.$options.src.deps) && this.$options.src.deps.length) {
					await Promise.all(
						this.$options.src.deps.map(async (dep) => {
							let depUri = this._assetsBaseUrl + dep.src;

							if (dep.type === 'script') {
								await this.$client.$registry.loadScript(depUri);
							}

							if (dep.type === 'style') {
								await this.$client.$registry.loadCss(depUri);
							}
						})
					);
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
