'use strict';



const sinon = require('sinon');

const {
	expect
} = require('code');
const Registry = require('../');
const Joi = require('joi');



describe('Registry', () => {

	describe('api', () => {

		let reg;
		beforeEach(() => reg = new Registry());
		afterEach(() => reg.close());

		const shouldHaveFunction = fn => it(`${fn}() should be a function`, () => expect(reg[fn]).to.be.a.function());


		shouldHaveFunction('get');
		shouldHaveFunction('set');
		shouldHaveFunction('getAll');
		shouldHaveFunction('findByLabels');

	});



	describe('events', () => {

		let reg;
		beforeEach(() => reg = new Registry({
			ttl: 1000,
			itemSchema: Joi.object().required()
		}));
		afterEach(() => reg.close());


		describe('added', () => {

			it('should be emitted on set', () => {

				let spy1 = sinon.spy();

				reg.on('added', spy1);

				reg.set('qwe', {});

				expect(spy1.called)
					.to.be.true();

			})

		});



		describe('updated', () => {

			it('should be emitted on second set', () => {

				let spy1 = sinon.spy();

				reg.on('updated', spy1);

				reg.set('qwe', {});
				reg.set('qwe', {});

				expect(spy1.called)
					.to.be.true();

			});

		});



		describe('removed', () => {

			let clock, reg;

			beforeEach(() => clock = sinon.useFakeTimers());
			beforeEach(() => reg = new Registry({
				ttl: 1000,
				itemSchema: Joi.object().required()
			}));
			afterEach(() => reg.close());
			afterEach(() => clock.restore());


			it('should be emitted on expiration of item', () => {

				let spy1 = sinon.spy();

				reg.on('removed', spy1);

				reg.set('qwe', {});

				clock.next();

				expect(spy1.called)
					.to.be.true();

			});

		});



	});
});
