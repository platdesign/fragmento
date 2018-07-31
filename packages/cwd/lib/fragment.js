'use strict';

const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const fsAccess = promisify(fs.access);



module.exports = class Fragment {

	constructor(dir) {
		this.dir = dir;
	}

	async init() {

		let configFile = path.join(this.dir, 'fragment.config');

		let config = require(configFile);

		// TODO: validate config

		this.config = Object.assign({}, config);

	}


};
