'use strict';

const path = require('path');
const glob = require('glob');
const extend = require('util')._extend;

const REGEX_ROUTE_PARAMS = /\/\$([a-zA-Z-]*)?/g;
const dash2camel = string => string.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });

function getRouteDefs(dir, globalPrefix, resolver) {
	const pattern = '**/*.js';

	return glob.sync(pattern, {
		cwd: dir,
		dot: false,
	})
	.map(file => {

		let prefix = path.join(globalPrefix, path.dirname(file));

		let routeDef = require(path.resolve(dir, file));

		if(resolver) {
			routeDef = resolver(routeDef);
		}

		if(!Array.isArray(routeDef)) {
			routeDef = [routeDef];
		}

		// freeze and clone original routeDef
		routeDef = routeDef
			.map(def => Object.freeze(def))
			.map(def => extend({}, def));


		routeDef.forEach(def => {

			def.path = (prefix + (def.path || '/')).replace(/\/$/, '');

			let res = def.path.match(REGEX_ROUTE_PARAMS);

			if(res) {
				res.forEach(needle => {

					let varName = dash2camel(needle.substr(2));

					def.path = def.path.replace(needle, `/{${varName}}`)
				});
			}

		})

		return routeDef;
	})
	.reduce((acc, item) => {

		if(Array.isArray(item)) {
			acc.push(...item);
		} else {
			acc.push(item);
		}

		return acc;
	}, []);

}




module.exports = {
	async register(server, options) {

		server.decorate('server', 'registerRoutesFromDir', function(dir, options = {}, resolver) {
			let defs = getRouteDefs(dir, options.prefix || '/', resolver);

			defs.forEach(def => server.route(def));

			server.log(['verbose'], `Registered ${defs.length} route(s) from ${path.relative(path.resolve(), dir)}`);
		});

	},
	name: 'routes'
};
