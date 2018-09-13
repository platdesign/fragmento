/**
 * author     Christian Blaschke <mail@platdesign.de>
 */

'use strict';


module.exports = function() {};
module.exports.pitch = function(remainingRequest, precedingRequest, data) {

	return `
		module.exports = function(fragment) {

			process.fragment = fragment;
			__webpack_public_path__ = fragment.$options.assetsUrl;

			return require(${JSON.stringify('-!' + remainingRequest)});
		};
	`;
}

module.exports.seperable = true;
