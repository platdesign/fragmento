'use strict';

const Joi = require('joi');



const defaults = {

	labels: []

};





const schema = Joi.object().required().keys({

	id: Joi.string().required().alphanum().lowercase(),
	labels: Joi.array().required()

});


module.exports = {
	defaults,
	schema
}
