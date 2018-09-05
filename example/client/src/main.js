import Vue from 'vue'
//import router from './router'
import store from './store'

import { Client } from '@fragmento/client';
import axios from 'axios';


const fclient = new Client();


;(async () => {

	let app1Fragment = fclient.fragment({
		"id": "app1",
		"assetsUrl": "http://192.168.10.248:5003/assets/",
		"url": "http://192.168.10.248:5003/assets/f_app1.js",
		"tags": [
			"app"
		],
		"apiBaseUrl": "http://192.168.10.248:5003/api/fragments/app1",
		"dependencies": []
	});


	await app1Fragment.load();

	let app = await app1Fragment.content.loadApp();

	console.log(app);

})();















Vue.config.productionTip = false

new Vue({
//  router,
  store,
  render: h => h('h1', 'Hello World')
}).$mount('#app')
