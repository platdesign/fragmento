'use strict';

const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const fsAccess = promisify(fs.access);
const glob = require('glob-promise');
const Fragment = require('./fragment');




module.exports = async (cwd) => {

	let fragments = [];

	let fragmentsDir = path.join(cwd, 'fragments');

	try {
		await fsAccess(fragmentsDir, fs.constants.R_OK);

		let fragDirs = await glob('./*/', {
			dot: false,
			cwd: fragmentsDir
		});

		for(let fragDir of fragDirs) {
			let fragment = new Fragment(path.join(fragmentsDir, fragDir));


			try {
				await fragment.init();
				fragments.push(fragment);
			} catch(e) {
				console.log(e);
			}


		}

	} catch(e) {
		console.log(e);
	}


	return fragments;
};
