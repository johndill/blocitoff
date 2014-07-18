'use strict';

(function(exports) {
	var config = {
		// list all roles for app (max 31)
		roles: [
			'public',
			'user',
			'admin'
		],

		// access levels. left side is access level, right side is user roles
		accessLevels: {
			'public': '*',
			'anon': ['public'],
			'user': ['user', 'admin'],
			'admin': ['admin']
		},
	};

	// function to build a distinct bit mask for each role
	function buildRoles(roles) {
		var bitMask = '01';
		var userRoles = {};

		for (var role in roles) {
			var intCode = parseInt(bitMask, 2);
			userRoles[roles[role]] = {
				bitMask: intCode,
				title: roles[role]
			};
			bitMask = (intCode << 1).toString(2);
		}

		return userRoles;
	}


	// function to build access level bit masks
	function buildAccessLevels(accessLevelsDeclarations, userRoles) {
		var accessLevels = {};
		for (var level in accessLevelsDeclarations) {
			if (typeof accessLevelsDeclarations[level] === 'string') {
				if (accessLevelsDeclarations[level] === '*') {
					var resultBitMask = '';

					for (var role in userRoles) {
						resultBitMask += '1';
					}

					accessLevels[level] = {
						bitMask: parseInt(resultBitMask, 2)
					};
				}
				else {
					console.log('Access Control Error: Coule not parse \'' + accessLevelsDeclarations[level] + '\' as access definition for level \'' + level + '\'');
				}
			}
			else {
				var resultBitMask = 0;

				for (var role in accessLevelsDeclarations[level]) {
					if (userRoles.hasOwnProperty(accessLevelsDeclarations[level][role])) {
						resultBitMask = resultBitMask | userRoles[accessLevelsDeclarations[level][role]].bitMask;
					}
					else {
						console.log('Access Control Error: Could not find role \'' + accessLevelDeclarations[level][role] + '\' in registered roles while building access for \'' + level + '\'');
					}
				}

				accessLevels[level] = {
					bitMask: resultBitMask
				};
			}
		}

		return accessLevels;
	}

	exports.userRoles = buildRoles(config.roles);
	exports.accessLevels = buildAccessLevels(config.accessLevels, exports.userRoles);

})(typeof exports === 'undefined' ? this.routingConfig = {} : exports);