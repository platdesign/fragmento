'use strict';



const { expect } = require('code');
const path = require('path');
const fragmentoCwd = require('../');



describe('project 1', () => {

	let cwd = path.join(__dirname, 'envs', 'project-1');

	describe('getProjectConfig', () => {

		it('should return a promise', () => {

			let config = fragmentoCwd.getProjectConfig(cwd);

			expect(config)
				.to.be.an.instanceof(Promise);

		});


		it('should extend config', async () => {

			let cwd = path.join(__dirname, 'envs', 'project-1');
			let config = await fragmentoCwd.getProjectConfig(cwd);

			expect(config)
				.to.be.an.object();

		});

	});




	describe('getFragments', () => {

		it('should return array of fragments', async () => {

			let fragments = await fragmentoCwd.getFragments(cwd);

			expect(fragments)
				.to.be.an.array();

			expect(fragments.length, 'fragments array length')
				.to.be.at.least(1);

			expect(fragments[0])
				.to.be.an.object()
				.contains(['dir']);

		});

	});


});
