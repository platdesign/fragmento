'use strict';

const path = require('path');
const {
	loadConfig
} = require('./utils');
const CONFIG_SCHEMA = require('./schemas/fragment-config');



module.exports = class Fragment {


	constructor(provider, dir) {
		this.$path = dir;
		this.$provider = provider;

		this.$config = loadConfig([
			this._resolvePath('fragment.js'),
			this._resolvePath('fragment.config.js'),
		], CONFIG_SCHEMA);
	}


	_resolvePath() {
		return path.join(this.$path, ...arguments);
	}



	get id() {
		return this.$config.id;
	}



	get labels() {
		return [...this.$provider.labels, ...this.$config.labels]
	}



	get apiPath() {
		return [this.$provider.fragmentsApiUrlPrefix, this.id].join('/');
	}


	get entryId() {
		return `${this.$provider.id}_${this.id}`;
	}

	get entryName() {
		return `f_${this.entryId}`;
	}



	get entryFile() {
		return `${this.entryName}.js`;
	}



	get serverPath() {
		return this._resolvePath('server');
	}

	get clientPath() {
		return this._resolvePath('client');
	}

	get probe() {
		let probe = {
			id: this.entryId,
			labels: this.labels,

			provider: {
				id: this.$provider.id,
				url: this.$provider.$config.backend.publicBaseUrl,
				assetsPath: this.$provider.$config.backend.assetsPath,
				apiPath: this.apiPath,
			},

			src: {
				entry: this.$provider.asset(this.entryFile),
				deps: []
			}
		};



		// add dependencies in poduction
		if (this.$provider._isProd) {

			// add chunk-vendors.js (replaced manifest.json entry)
			probe.src.deps.push({
				type: 'script',
				src: this.$provider.asset('chunk-vendors.js')
			});

			// add fragment entry-styles if available
			let stylesEntry = this.entryName + '.css';
			if (this.$provider.$assetManifest.has(stylesEntry)) {
				probe.src.deps.push({
					type: 'style',
					src: this.$provider.asset(this.$provider.asset(stylesEntry))
				});
			}

		}



		return probe;
	}

}
