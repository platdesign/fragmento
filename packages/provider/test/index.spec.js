'use strict';


const { expect } = require('code');
const path = require('path');
const Provider = require('../');






describe('provider', () => {

	it('asd', () => {

		const provider = new Provider(path.join(__dirname, 'providers', 'test-a'));

		console.log(JSON.stringify(provider.probe, null, 2));

	});

});
