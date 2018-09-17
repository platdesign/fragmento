'use strict';

const Fragment = require('./fragment');
const path = require('path');
const {
	loadConfig
} = require('./utils');
const glob = require('glob');

const CONFIG_SCHEMA = require('./schemas/provider-config');



module.exports = class Provider {

	constructor(cwd) {
		this.$cwd = cwd;
		this.$fragments = new Map();

		this.$config = loadConfig([
			path.join(this.$cwd, 'provider.config.js'),
			path.join(this.$cwd, 'fragmento.config.js'),
		], CONFIG_SCHEMA);

		this._loadAssetManifest();
		this._loadFragments();
	}

	get _isProd() {
		return process.env.NODE_ENV === 'production';
	}

	_loadFragments() {
		let fragDirs = glob.sync('./*/', {
			cwd: this.fragmentsPath,
			realpath: true
		});
		for (let fragPath of fragDirs) {
			let fragment = new Fragment(this, fragPath);
			this.$fragments.set(fragment.id, fragment);
		}
	}

	_loadAssetManifest() {
		this.$assetManifest = new Map();

		if (this._isProd) {
			let manifest = require(this._resolvePath('dist', 'manifest.json'))

			for (let [key, val] of Object.entries(manifest)) {
				this.$assetManifest.set(key, val);
			}
		}
	}

	_resolvePath() {
		return path.join(this.$cwd, ...arguments);
	}

	asset(file) {
		let asset = file;

		if (this._isProd && this.$assetManifest.has(file)) {
			asset = this.$assetManifest.get(file);
		}
		return asset.replace(/^\//, '');
	}

	get id() {
		return this.$config.id;
	}

	get labels() {
		return this.$config.labels;
	}

	get $fragmentsArray() {
		return Array.from(this.$fragments.values());
	}

	get fragmentsPath() {
		return this._resolvePath(this.$config.fragmentsPath);
	}

	get apiUrlPrefix() {
		return '/api';
	}

	get fragmentsApiUrlPrefix() {
		return [this.apiUrlPrefix, 'f'].join('/');
	}

	get probe() {
		return this.$fragmentsArray.map(f => f.probe)
	}

}
