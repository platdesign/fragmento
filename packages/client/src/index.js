/**
 * author     Christian Blaschke <mail@platdesign.de>
 */

'use strict';

import Debug from 'debug';

const debug = Debug('ba:fragmento');

import { loadScript, loadJsonP, loadCss } from './loader';

import FragmentV1 from './v1/fragment';
import FragmentV2 from './v2/fragment';


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

		Object.defineProperties(this, {
			debug: { value: debug.extend('client') },
			decorators: { value: new Set() }
		});

		this.$options = options;
		this.$registry = new Registry();
		window.__fragmento_client__ = this;

		this.$fragments = new Map();

		if (global.Proxy !== undefined) {
			this.aliasModules = new Proxy(this.$options.aliasModules, {
				get(mod, key) {
					if (mod.hasOwnProperty(key)) {
						return mod[key];
					} else {
						throw new Error(
							`Fragmento alias modules: Host module @host/${key} not found.\n--> Please provide it as aliasModules option on initializing Fragmento.Client`
						);
					}
				}
			});
		} else {
			this.aliasModules = this.$options.aliasModules;
		}
	}

	decorator(factory) {
		this.decorators.add(factory);
	}


	fragment(options) {
		const { id } = options;

		let fragment;

		if (!this.$fragments.has(id)) {
			if (parseInt(options.version) === 1) {
				fragment = new FragmentV1(this, options);

			}

			if (parseInt(options.version) === 2) {
				fragment = new FragmentV2(this, options);
			}

			if (fragment) {
				this.$fragments.set(id, fragment);
			}
		} else {
			fragment = this.$fragments.get(id);

			fragment.updateOptions(options);
		}

		return fragment;
	}

	getFragmentsByLabels(labels) {

		let all = Array.from(this.$fragments.values());

		// fallback for v1 fragments
		if (Array.isArray(labels)) {
			let v1Fragments = all.filter(f => f.version === 1);
			return v1Fragments.filter((fragment) => fragment.matchesLabels(labels));
		}

		let v2Fragments = all.filter(f => f.version >= 2);
		return v2Fragments.filter((fragment) => fragment.matchesLabels(labels));

	}

	registerAliasModule(key, val) {
		this.$options.aliasModules[key] = val;

		return this;
	}
}

export { Client };
