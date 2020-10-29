'use strict';


const Joi = require('joi');
const Hoek = require('@hapi/hoek');



function requireFirstAvailable(places) {
	let mod = {};
	for (let f of places) {
		try {
			mod = require(f);
			break;
		} catch (e) {
			continue;
		}
	}
	return mod;
}



function loadConfig(places, { schema, defaults }) {

	let configured = requireFirstAvailable(places);

	let merged = Hoek.applyToDefaults(defaults, configured);

	return Joi.attempt(merged, schema);

}


module.exports = {
	requireFirstAvailable,
	loadConfig
}
