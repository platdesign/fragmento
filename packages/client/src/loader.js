'use strict';

const es6Default = mod => {
	if(mod.hasOwnProperty('__esModule') && mod.__esModule === true && mod.hasOwnProperty('default')) {
		return mod.default;
	}
	return mod;
};




const loadScript = async function (url) {
	return new Promise((resolve, reject) => {
		const $script = document.createElement('script');
		$script.onerror = () => reject(new Error(`Failed to load script from ${url}`));
		$script.onload = resolve;
		$script.asnyc = true;
		$script.src = url;

		document.body.appendChild($script);
	});
}




const loadJsonP = async function(fn, url) {
	return new Promise(async (resolve, reject) => {

		let payload = null;

		global[fn] = _payload => payload = _payload;

		await loadScript(url);

		resolve(payload);
	});
}



const loadCss = async function(url) {
	return new Promise((resolve, reject) => {
		const $el = document.createElement('link');

		$el.rel  = 'stylesheet';
		$el.type = 'text/css';

		$el.onerror = () => reject(new Error(`Failed to load styles from ${url}`));
		$el.onload = resolve;
		$el.asnyc = true;
		$el.href = url;

		document.body.appendChild($el);
	});
};

export {
	loadScript,
	loadJsonP,
	loadCss
}
