'use strict';


const {
	expect
} = require('code');
const path = require('path');
const Provider = require('../');
const fs = require('fs');

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf-8'));


function testFragmentProbe(fp) {
	expect(fp.id).to.be.a.string();

	expect(fp.labels).to.be.an.array();

	expect(fp.provider).to.be.an.object();

	expect(fp.provider.id).to.be.a.string();
	expect(fp.provider.url).to.be.a.string();
	expect(fp.provider.assetsPath).to.be.a.string();
	expect(fp.provider.apiPath).to.be.a.string();

	expect(fp.src).to.be.an.object();

	expect(fp.src.entry).to.be.a.string();
	expect(fp.src.deps).to.be.an.array();

}



function expectProbe(probe, expectedProbe) {
	expect(probe, 'probe')
		.to.be.an.array();

	for (let fp of probe) {
		testFragmentProbe(fp);
	}

	expect(probe).to.equal(expectedProbe);
}



function testProviderProbe(cwd) {

	it(`Test provider probe: ${path.basename(cwd)}`, () => {

		const provider = new Provider(cwd);
		const expectedProbe = readJson(path.join(cwd, 'expected.probe.json'))

		expectProbe(provider.probe, expectedProbe);


	});
}


describe('probe', () => {

	testProviderProbe(path.join(__dirname, 'providers', 'test-a'));

});
