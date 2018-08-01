'use strict';

const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const fsAccess = promisify(fs.access);
const Joi = require('joi');

const JOI_CONFIG_SCHEMA = Joi.object().required().keys({
	id: Joi.string().required()
});


module.exports = class Fragment {

	constructor(dir) {
		this.dir = dir;
	}

	async init() {

		let configFile = path.join(this.dir, 'fragment.config.js');

		let config = require(configFile);

		let { error, value } = Joi.validate(config, JOI_CONFIG_SCHEMA);

		if(error) {
			throw error;
		}

		this.config = Object.assign({}, value);

	}

	get id() {
		return this.config.id;
	}

	get serverPath() {
		return path.join(this.dir, 'server');
	}

};
