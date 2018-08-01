'use strict';


const program = require('commander');
const CWD = process.env.INIT_CWD;
const path = require('path');
const pkg = require('./package.json');
const fcwd = require('@fragmento/cwd');



program
	.version(pkg.version)
	.description('Fragmento');


program
	.command('run')
	.option('-p, --production', 'Run production server')
	.action(async (cmd) => {
		setInterval(() => console.log('asd'), 100);
	});


program.parse(process.argv);
