'use strict';

var jsonWebToken = require('jsonwebtoken');

var logger = require('./../../Common/Services/Logger');
var secretKey = require('./config').secretKey;

var filename = 'AuthenticationService';

exports.getToken = function(object) {

	var promise = new Promise(function(resolve, reject) {

		if (!object) {
			logger.error(filename, 'getToken:' + 'object is null');
			reject(new Error(err));
		}

		var token = jsonWebToken.sign(object, secretKey);
		logger.info(filename, 'getToken:' + token);
		resolve(token);
	});

	return promise;
};

exports.verifyToken = function(token) {

	var promise = new Promise(function(resolve, reject) {

		if (!token) {
			logger.error(filename, 'verifyToken:' + 'token is null');
		}

	    jsonWebToken.verify(token, secretKey, function(err, decoded) {

			if (err) {
				logger.error(filename, 'verifyToken:' + err);
				reject(new Error(err));
			} else {
				logger.info(filename, 'verifyToken:' + decoded);
				resolve(decoded);
			}
		});
	});

	return promise;
};