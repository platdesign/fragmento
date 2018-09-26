'use strict';



const sinon = require('sinon');

const {
	expect
} = require('code');
const Store = require('../lib/store');
const Joi = require('joi');



describe('Store', () => {

	describe('garbage-cycle should remove expired items', () => {


		let clock, store;

		beforeEach(() => clock = sinon.useFakeTimers());
		beforeEach(() => store = new Store({
			ttl: 1000,
			itemSchema: Joi.object().keys({}).required()
		}));
		afterEach(() => store.close());
		afterEach(() => clock.restore());



		it('remove single item', () => {

			store.set('qwe', {});

			expect(store.size)
				.to.equal(1);

			clock.tick(1000);

			expect(store.size)
				.to.equal(0);

		});



		it('should add two items with delay and remove each in the correct garbage cycle', () => {

			store.set('qwe', {});

			expect(store.size, 'store.size after first item added')
				.to.equal(1);


			expect(Array.from(store.$map.keys()))
				.to.equal(['qwe']);

			clock.tick(500);

			store.set('asd', {});

			expect(store.size)
				.to.equal(2);

			expect(Array.from(store.$map.keys()))
				.to.equal(['qwe', 'asd'])

			clock.next();

			expect(store.size)
				.to.equal(1);

			expect(Array.from(store.$map.keys()))
				.to.equal(['asd']);


			// "garbage collector"-function runs every second.
			// after 1500ms the "asd"-item expires, but will just be removed
			// on next interval-cycle (at 2000ms)
			// !!!Date.now() should return 2000ms and not 1500ms like expected!!!

			clock.next();


			expect(store.size)
				.to.equal(0);


			expect(Date.now())
				.to.equal(2000);

		});



		it('should add an item and update it to keep it alive', () => {

			store.set('qwe', {});

			expect(store.size, 'store.size after first item added')
				.to.equal(1);

			clock.tick(500); // now: 500

			// update it
			store.set('qwe', {});

			expect(store.$get('qwe').$lastupdate)
				.to.equal(500);

			expect(store.$get('qwe').$expiresAt)
				.to.equal(1500);

			clock.tick(1000); // now: 1500


			// expiration is reached, but garbage-cycle will fire on 2000
			expect(store.size)
				.to.equal(1);

			clock.tick(500); // now: 2000

			// garbage-cycle should have been executed and item should be removed
			expect(store.size)
				.to.equal(0);

		});


	});



	describe('query by label [findByLabels()]', () => {

		let store;

		beforeEach(() => store = new Store({
			ttl: 10000,
			itemSchema: Joi.object().keys({
				labels: Joi.array().items(Joi.string())
			}).required()
		}));
		afterEach(() => store.close());


		let a, b, c;
		beforeEach(() => {

			a = {
				labels: ['a', 'b']
			};

			b = {
				labels: ['a', 'c']
			};

			c = {
				labels: ['c', 'd']
			};

			store.set('a', a);
			store.set('b', b);
			store.set('c', c);

		});


		it('should allow string as single label', () => {
			expect(store.findByLabels('a'))
				.equals([a, b]);
		});


		it('should return expected items by given labels as array', () => {

			expect(store.findByLabels(['a']))
				.equals([a, b]);

			expect(store.findByLabels(['b']))
				.to.equal([a]);

			expect(store.findByLabels(['c']))
				.to.equal([b, c]);

			expect(store.findByLabels(['d']))
				.to.equal([c]);

			expect(store.findByLabels(['e']))
				.to.equal([]);

			expect(store.findByLabels(['a', 'b']))
				.to.equal([a, b]);

			expect(store.findByLabels(['a', 'd']))
				.to.equal([a, b, c]);

			expect(store.findByLabels(['a', 'c', 'd']))
				.to.equal([a, b, c]);

		});


	});



});
