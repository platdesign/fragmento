/**
 * Vue component class.
 *
 * @name 			hello
 * @project 	hello-world
 * @author 		Christian Blaschke
 * @since			September 5th 2018, 1:14:41 pm
 */

import api from '@/shared/api'


export default {
	data() {
		return {
			process,
			test: null
		}
	},


	created() {
		this.loadTest();
	},



	methods: {
		async loadTest() {
			let { data } = await api.get('/test');
			this.test = data;
		}
	}
}
