'use strict';


export default {

	init(app) {
		Vue.component('hello', require('./components/hello').default);
	}

}
