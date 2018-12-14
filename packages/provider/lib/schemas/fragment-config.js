'use strict';

const Joi = require('joi');



const defaults = {

	labels: []

};



const schema = Joi.object().required().keys({

	id: Joi.string().required().regex(/^[a-z_]+$/, 'fragmentId').lowercase(),
	labels: Joi.array().required(),
	meta: Joi.object().default({})

});


module.exports = {
	defaults,
	schema
}
