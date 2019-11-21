/**
 * author     Christian Blaschke <mail@platdesign.de>
 */
'use strict';


const program = require('commander');
const CWD = process.env.INIT_CWD;
const path = require('path');
const pkg = require('./package.json');
const Provider = require('@fragmento/provider');
const {
	spawn
} = require('child_process');
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
	.action(async (cmd) => {

		let provider = new Provider(CWD);


		let {
			$fragmentsArray: fragments,
			$config: config
		} = provider;



		if (cmd.production) {
			let childProcess = spawn('node', ['--preserve-symlinks', scripts.server], {
				cwd: CWD,
				stdio: 'inherit',
				env: {
					...process.env,
				}
			});

			childProcess.on('exit', (code) => {
				process.exit(code);
			});
		} else {

			if (config.dev.server.cmd) {

				let cmd = config.dev.server.cmd.split(' ');

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
					path.join(CWD, 'server'),
					...config.dev.server.watch.map(i => path.join(CWD, i))
				],
				env: {
					...process.env
				}
			});

		}

	});


program.parse(process.argv);
