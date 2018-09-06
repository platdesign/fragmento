'use strict';

const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const fsAccess = promisify(fs.access);
const Joi = require('joi');

const JOI_CONFIG_SCHEMA = Joi.object().required().keys({
	id: Joi.string().required(),
	tags: Joi.array().default([])
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

	get labels() {
		return this.config.labels;
	}

	get serverPath() {
		return path.join(this.dir, 'server');
	}

	get configFile() {
		return path.join(this.dir, 'fragment.config.js');
	}

	get entryName() {
		return `f_${this.id}`;
	}

	get entryFilename() {
		return `${this.entryName}.js`;
	}

	get apiPath() {
		return `/api/f/${this.id}`;
	}




	getProbe({ assetsMap, providerConfig }) {
		return {
			id: this.id,
			labels: this.labels,
			provider: {
				url: '//localhost:5003',
				assetsPath: '/assets/',
				apiPath: this.apiPath,
			},
			src: {
				entry: assetsMap.get(this.entryFilename),
				deps: [
					{
						type: 'script',
						src: ''
					},
					{
						type: 'style',
						src: ''
					}
				]
			}
		}
	}

};
