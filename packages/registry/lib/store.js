'use strict';


const Hoek = require('hoek');
const Joi = require('joi');
const debug = require('debug')('store');
const EventEmitter = require('events');


const STORE_CONFIG_DEFAULTS = {
	ttl: 10000
};

const STORE_CONFIG_SCHEMA = Joi.object().required().keys({
	ttl: Joi.number().min(100).required(),
	itemSchema: Joi.object().schema()
});



const ITEM_JOI_SCHEMA = Joi.object().required().keys({

	id: Joi.string().required(),
	labels: Joi.array().items(Joi.string()).required(),
	provider: Joi.object({
		id: Joi.string().required(),
		url: Joi.string().required(),
		assetsPath: Joi.string().required(),
		apiPath: Joi.string().required(),
	}),
	src: Joi.object({
		entry: Joi.string().required()
	})

}).options({
	allowUnknown: true
});



class Item {

	constructor(store, val) {
		this.$store = store;
		this.value = val;
	}

	_tick() {
		this.$lastupdate = Date.now();
	}

	get value() {
		return this.$value;
	}

	set value(_value) {

		let {
			error,
			value
		} = Joi.validate(_value, this.$store.$options.itemSchema || ITEM_JOI_SCHEMA);

		if (error) {
			throw error;
		}

		this.$value = value;
		this._tick();
	}

	get $expiresAt() {
		return this.$lastupdate + this.$store.$options.ttl;
	}

	get outdated() {
		return Date.now() >= this.$expiresAt;
	}


}



module.exports = class Store extends EventEmitter {

	constructor(options = {}) {
		super();

		options = Hoek.applyToDefaults(STORE_CONFIG_DEFAULTS, options);

		const {
			error,
			value
		} = Joi.validate(options, STORE_CONFIG_SCHEMA);

		if (error) {
			throw error;
		}

		this.$options = value;


		this.$map = new Map();
		this._garbageIntervalTimer = setInterval(() => this._runGarbageCollector(), this.$options.ttl);
	}

	get size() {
		return this.$map.size;
	}

	close() {
		clearInterval(this._garbageIntervalTimer);
		this.$map.clear();
	}


	_runGarbageCollector() {
		for (let [key, item] of this.$map.entries()) {
			if (item.outdated) {
				this.$map.delete(key);
				this.emit('removed', item);
				debug('removed', key);
			}
		}
	}


	set(key, val) {
		let item;

		if (!this.$map.has(key)) {
			item = new Item(this, val);
			this.$map.set(key, item);
			this.emit('added', item);
			debug('added', key);
		} else {
			item = this.$map.get(key);
			item.value = val;
			this.emit('updated', item);
			debug('updated', key);
		}

	}

	get(key) {
		return this.$get(key).value;
	}

	$get(key) {
		return this.$map.get(key);
	}

	getAll() {
		return Array.from(this.$map.values());
	}

	findByLabels(labels) {

		if (!Array.isArray(labels)) {
			labels = [labels];
		}

		return Array.from(this.$map.values())
			.map(item => item.value)
			.filter(item => labels.some(label => item.labels.includes(label)));
	}



}
