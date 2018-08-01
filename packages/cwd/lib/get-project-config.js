'use strict';


const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const fsAccess = promisify(fs.access);
const Joi = require('joi');


const JOI_CONFIG_SCHEMA = Joi.object().required().keys({
	id: Joi.string().required(),

	server: Joi.object().keys({
		port: Joi.number().default(4001)
	}).default({ port: undefined }),


	devServer: Joi.object().keys({
		port: Joi.number().default(4002)
	}).default({})

});




module.exports = async (cwd) => {

	let configFile = path.join(cwd, 'fragmento.config.js');

	let configFromFile;

	try {
		await fsAccess(configFile, fs.constants.R_OK);
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

	return value;
};
