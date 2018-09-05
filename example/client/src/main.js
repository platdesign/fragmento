import Vue from 'vue'
//import router from './router'
import store from './store'

import { Client } from '@fragmento/client';
import axios from 'axios';

global.Vue = Vue;

const fclient = new Client();


;(async () => {


	let { data:probe } = await axios.get('http://localhost:5003/api/probe');



	Vue.config.productionTip = false

	const app = new Vue({
	//  router,
	  store,
	  render: h => h('hello')
	});


	// let app1Fragment = fclient.fragment({
	// 	"id": "app1",
	// 	"assetsUrl": "http://192.168.10.248:5003/assets/",
	// 	"url": "http://192.168.10.248:5003/assets/f_app1.js",
	// 	"tags": [
	// 		"app"
	// 	],
	// 	"apiBaseUrl": "http://192.168.10.248:5003/api/fragments/app1",
	// 	"dependencies": []
	// });

	let app1Fragment = fclient.fragment(probe.fragments[0]);


	let content = await app1Fragment.load();

	content.init(app);



	app.$mount('#app');

})();

