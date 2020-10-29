'use strict';


const { expect } = require('@hapi/code');
const boot = require('../');
const path = require('path');



describe('server', () => {

	const cwd = path.join(__dirname, 'env');

	let server;
	beforeEach(async () => server = await boot(cwd, false));
	afterEach(async () => server.stop());


	it('should boot', async () => {

		expect(server.fragmento)
			.to.be.an.object()
			.to.include(['$fragments', '$config']);

	});



	it('should register api routes', async () => {

		let res = await server.inject({
			method: 'GET',
			url: `/api/f/fragement_a/test`
		});

		expect(res.result)
			.to.equal(123);

	});



	it('should register asset-routes', async () => {

		let probe = server.fragmento.probe;

		for (let fragment of probe) {

			let res = await server.inject({
				method: 'GET',
				url: `${fragment.provider.assetsPath}${fragment.src.entry}`,
			});

			expect(res.result)
				.to.equal(`console.log('test');\n`)
		}

	});


});
