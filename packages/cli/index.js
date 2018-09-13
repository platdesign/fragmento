/**
 * author     Christian Blaschke <mail@platdesign.de>
 */
'use strict';


const program = require('commander');
const CWD = process.env.INIT_CWD;
const path = require('path');
const pkg = require('./package.json');
const fcwd = require('@fragmento/cwd');
const { spawn } = require('child_process');
const nodemon = require('nodemon');



const scripts = {
	server: path.resolve(__dirname, 'scripts', 'server')
};



program
	.version(pkg.version)
	.description('Fragmento');



program
	.command('run')
	.option('-p, --production', 'Run production server')
	.action(async(cmd) => {

		let fragments = fcwd.getFragments(CWD);
		let config = fcwd.getProjectConfig(CWD);


		if (cmd.production) {
			spawn('node', ['--preserve-symlinks', scripts.server], {
				cwd: CWD,
				stdio: 'inherit',
				env: {
					...process.env,
				}
			});
		} else {

			if (config.devCommand) {

				let cmd = config.devCommand.split(' ');

				spawn(cmd.shift(), cmd, {
					cwd: CWD,
					stdio: 'inherit'
				});
			}


			nodemon({
				script: scripts.server,
				ext: 'js json',
				watch: [
					...fragments.map(f => f.serverPath),
					...fragments.map(f => f.configFile),
					path.join(CWD, 'server')
				],
				env: {
					...process.env
				}
			});

		}

	});


program.parse(process.argv);
