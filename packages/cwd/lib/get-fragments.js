'use strict';

const fs = require('fs');
const path = require('path');
const fsAccess = fs.accessSync;
const glob = require('glob');
const Fragment = require('./fragment');




module.exports = (cwd) => {

	let fragments = [];

	let fragmentsDir = path.join(cwd, 'fragments');

	try {
		fsAccess(fragmentsDir, fs.constants.R_OK);

		let fragDirs = glob.sync('./*/', {
			dot: false,
			cwd: fragmentsDir
		});

		for(let fragDir of fragDirs) {
			let fragment = new Fragment(path.join(fragmentsDir, fragDir));

			try {
				fragment.init();
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
