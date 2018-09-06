'use strict';

const Joi = require('joi');



const defaults = {

	fragmentsPath: './fragments',

	labels: [],

	backend: {
		port: 5001,
		publicBaseUrl: '//localhost:5001',
		cors: ['*'],
		assetsPath: '/assets/'
	},


	dev: {
		server: {
			port: 5002,
			cmd: 'npm run serve'
		}
	}

};





const schema = Joi.object().required().keys({

	id: Joi.string().required().alphanum().lowercase(),
	labels: Joi.array().required(),

	fragmentsPath: Joi.string().required(),

	backend: Joi.object().required().keys({
		port: Joi.number().required(),
		publicBaseUrl: Joi.string().required(),
		cors: Joi.array().required(),
		assetsPath: Joi.string().required()
	}),

	dev: Joi.object().required().keys({
		server: Joi.object().required().keys({
			port: Joi.number().required(),
			cmd: Joi.string().required()
		})
	})

});


module.exports = {
	defaults,
	schema
}
