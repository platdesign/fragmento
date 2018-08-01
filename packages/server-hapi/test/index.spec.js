'use strict';


const { expect } = require('code');
const boot = require('../');
const path = require('path');


describe('server', () => {

	const cwd = path.join(__dirname, 'env');

	let server;
	beforeEach(async () => server = await boot(cwd));
	afterEach(async () => server.stop());


	it('should boot', async () => {

		expect(server.fragmento)
			.to.be.an.object()
			.to.include(['fragments', 'config']);

	});




	it('should register api routes', async () => {

		let res = await server.inject({
			method: 'GET',
			url: `/fragments/${server.fragmento.fragments[0].id}/api`
		});

		expect(res.result)
			.to.equal(123);

	});


	it('should register asset-routes', async () => {

		let res = await server.inject({
			method: 'GET',
			url: `/assets/${server.fragmento.fragments[0].id}.js`
		});

		expect(res.result)
			.to.equal(`console.log('test');\n`)

	});


});
