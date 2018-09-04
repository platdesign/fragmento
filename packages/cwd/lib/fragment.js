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

	init() {

		let config = require(this.configFile);

		let { error, value } = Joi.validate(config, JOI_CONFIG_SCHEMA);

		if(error) {
			throw error;
		}

		this.config = Object.assign({}, value);

		this.config.id = this.config.id.replace(/\-/g, '_');

	}

	get id() {
		return this.config.id;
	}

	get serverPath() {
		return path.join(this.dir, 'server');
	}

	get configFile() {
		return path.join(this.dir, 'fragment.config.js');
	}

};
