'use strict';

import Vue from 'vue';
import Hello from './components/hello';


export default {

	init(app) {

		Vue.component('hello', Hello);

	}

}
