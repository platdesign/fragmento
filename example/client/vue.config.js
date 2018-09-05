'use strict';

const path = require('path');


module.exports = {

	chainWebpack: config => {

		config.resolve.alias.set('@fragmento/client', path.resolve('..', '..', 'packages', 'client'));

	}

}
