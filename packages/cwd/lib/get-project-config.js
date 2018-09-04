'use strict';


const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const fsAccess = fs.accessSync
const Joi = require('joi');


const JOI_CONFIG_SCHEMA = Joi.object().required().keys({
	id: Joi.string().required(),

	backend: Joi.object().keys({
		port: Joi.number().default(4001)
	}).default({ port: undefined }),


	devCommand: Joi.string()

});




module.exports = (cwd) => {

	let configFile = path.join(cwd, 'fragmento.config.js');

	let configFromFile;

	try {
		fsAccess(configFile, fs.constants.R_OK);
		configFromFile = require(configFile);
	} catch(e) {
		configFromFile = {};
	}

	let defaultConfig = {};


	let config = Object.assign({}, defaultConfig, configFromFile);

	let { error, value} = Joi.validate(config, JOI_CONFIG_SCHEMA);

	if(error) {
		throw error;
	}

	value.id = value.id.replace(/\-/g, '_');

	return value;
};
