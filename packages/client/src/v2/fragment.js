'use strict';

import { loadScript } from '../loader';

const SYM_isLoading = Symbol('isLoading');
const SYM_isLoaded = Symbol('isLoaded');
const SYM_options = Symbol('options');

global.__fragmento_jsonp__ = {};

const loadJsonP = async function(fn, url) {
	return new Promise(async (resolve, reject) => {

		let payload = null;

		global.__fragmento_jsonp__[fn] = _payload => payload = _payload;

		try {
			await loadScript(url);
			resolve(payload);
		} catch (e) {
			reject(e);
		}

	});
}


export default class Fragment {


	constructor(client, options) {

		Object.defineProperties(this, {
			id: { value: options.id, enumerable: true },
			version: { value: options.version, enumerable: true },
			debug: { value: client.debug.extend(`fragment@2:${options.id}`) },
			[SYM_options]: { value: options },
			[SYM_isLoaded]: { value: false, writable: true },
			[SYM_isLoading]: { value: false, writable: true },
			content: { value: null, configurable: true },
			labels: { value: Object.freeze(options.meta.labels), enumerable: true },
			annotations: { value: Object.freeze(options.meta.annotations), enumerable: true }
		});



		// run decorators
		for (let decorate of client.decorators.values()) {
			decorate(this);
		}

		this.debug('initialized');
	}



	updateOptions() {}


	matchesLabels(labels) {

		let _labels = this[SYM_options].meta.labels;

		return Object.entries(labels).every(([key, val]) => {
			return _labels.hasOwnProperty(key) && _labels[key] === val;
		});
	}

	get _baseUrl() {
		return this[SYM_options].src.baseUrl;
	}

	get _apiBaseUrl() {
		return this._baseUrl + this[SYM_options].src.apiPath;
	}

	get _assetsBaseUrl() {
		return this._baseUrl + this[SYM_options].src.assetsPath;
	}

	get __webpack_public_path__() {
		return this._assetsBaseUrl;
	}



	async load() {

		if (this[SYM_isLoaded]) {
			this.debug('already loaded');
			return;
		}

		if (this[SYM_isLoading]) {
			this.debug('already loading');
			return;
		}

		this.debug('load');
		this[SYM_isLoading] = true;


		// load deps

		// load entry
		try {
			let entryUrl = this._assetsBaseUrl + this[SYM_options].src.entry
			let jsonpFnName = this[SYM_options].meta.annotations['fragment/jsonp'];

			let entry = await loadJsonP(jsonpFnName, entryUrl);
			let content = entry(this);
			this[SYM_isLoaded] = true;

			if (content.hasOwnProperty('__esModule') && content.__esModule === true) {
				content = content.default;
			}

			Object.defineProperty(this, 'content', { value: content });
			this.debug('loaded');
		} catch (e) {
			console.error(e)
		} finally {
			this[SYM_isLoading] = false;
		}

	}
}
