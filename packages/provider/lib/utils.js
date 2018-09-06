'use strict';


const Joi = require('joi');
const Hoek = require('hoek');



function requireFirstAvailable(places) {
	let mod = {};
	for(let f of places) {
		try {
			mod = require(f);
			break;
		} catch(e) {
			continue;
		}
	}
	return mod;
}



function loadConfig(places, { schema, defaults }) {

	let configured = requireFirstAvailable(places);

	let merged = Hoek.applyToDefaults(defaults, configured);

	let { error, value:validated } = Joi.validate(merged, schema);

	if(error) {
		throw error;
	}

	return validated;

}


module.exports = {
	requireFirstAvailable,
	loadConfig
}
