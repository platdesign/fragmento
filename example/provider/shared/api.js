'use strict';

import axios from 'axios';


const api = axios.create({
	baseURL: process.fragment.$options.apiBaseUrl
});


export default api;
