'use strict';


module.exports = function(content) {

	// this.cacheable && this.cacheable();
	// this.value = content;


	return content +
		`export const __fragmento = { loaded: function(fragment) {
			process.fragment = fragment;
			__webpack_public_path__ = fragment.$options.assetsUrl;
		}}`;
}
module.exports.seperable = true;
