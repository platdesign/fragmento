'use strict';


const { expect } = require('@hapi/code');
const { spawn } = require('child_process');
const path = require('path');
const cliPath = path.resolve(__dirname, '..');

describe('cli', function() {
	this.timeout(0);


	let envPath = path.join(__dirname, 'env');

	let appPath = path.join(envPath, 'app');



	it('should execute run', (done) => {

		let cmd = spawn('node', [cliPath, 'run'], {
			cwd: appPath,
			env: {
				...process.env,
				INIT_CWD: appPath,
				NODE_ENV: 'test',
				TEST_SERVER_SCRIPT: path.join(appPath, 'server.js')
			}
		});

		cmd.stdout.pipe(process.stdout);
		cmd.stderr.pipe(process.stderr);


		setTimeout(() => {
			cmd.kill();
			cmd.on('close', (code) => {
				done();
			});
		}, 5000);

	});

});
