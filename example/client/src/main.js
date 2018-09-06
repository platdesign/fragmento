import Vue from 'vue'
Vue.config.productionTip = false


//import router from './router'
import store from './store'


import { Client } from '@fragmento/client';
import axios from 'axios';

global.Vue = Vue;
global.axios = axios;

const fclient = new Client();


;(async () => {


	let { data:probe } = await axios.get('http://localhost:5003/api/probe');


	for(let fo of probe.fragments) {
		let fragment = fclient.fragment(fo);
		await fragment.load();
	}




	const app = new Vue({
	//  router,
	//  store,
	  template: '<div><app1/><app2/></div>'
	}).$mount('#app');


})();

