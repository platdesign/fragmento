'use strict';


const { expect } = require('@hapi/code');
const { spawn } = require('child_process');
const path = require('path');
const cliPath = path.resolve(__dirname, '..');

describe('cli', function() {
	this.timeout(0);


	let envPath = path.join(__dirname, 'env');

	let appPath = path.join(envPath, 'app');



	// it('should execute run', (done) => {

	// 	let cmd = spawn('node', [cliPath, 'run'], {
	// 		cwd: appPath,
	// 		env: {
	// 			...process.env,
	// 			INIT_CWD: appPath
	// 		}
	// 	});


	// 	cmd.stdout.on('data', (data) => {
	// 	  console.log(`stdout: ${data}`);
	// 	});

	// 	cmd.stderr.on('data', (data) => {
	// 	  console.log(`stderr: ${data}`);
	// 	});

	// 	cmd.on('close', (code) => {
	// 	  console.log(`child process exited with code ${code}`);
	// 	});


	// 	setTimeout(() => {
	// 		cmd.kill();
	// 		done();
	// 	}, 2000);

	// });

});
